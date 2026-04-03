import { Router } from 'express';
import { prisma, redis } from '../db';

const router = Router();

// Server-side price estimation (mirrors client-side logic for consistency)
function estimatePrice(condition: string, model: string): number {
    const lower = model.toLowerCase();
    let base = 400;
    if (lower.includes('pro max') || lower.includes('ultra') || lower.includes('m3')) base = 900;
    else if (lower.includes('pro') || lower.includes('plus')) base = 700;
    else if (lower.includes('macbook') || lower.includes('ipad')) base = 650;

    const multiplier: Record<string, number> = {
        Mint: 1.0, Good: 0.75, Poor: 0.35, Broken: 0.15,
    };
    return Math.round(base * (multiplier[condition] ?? 0.75));
}

router.post('/submit', async (req, res) => {
    try {
        const { brand, model, specs, condition, userEmail, userName, userId, estimatedPrice, status } = req.body;

        if (!userEmail) {
            return res.status(400).json({ success: false, error: 'userEmail is required' });
        }

        // 1. Upsert user
        const user = await prisma.user.upsert({
            where: { email: userEmail },
            update: { name: userName || undefined },
            create: {
                id: userId || undefined,
                email: userEmail,
                name: userName || userEmail.split('@')[0],
                role: 'CUSTOMER',
            },
        });

        // 2. Compute estimated value (use client-provided or server-computed)
        const computedEstimate = estimatedPrice || estimatePrice(condition, model);

        // 3. Create Device entry with estimated value
        const device = await prisma.device.create({
            data: {
                brand,
                model,
                specs,
                condition,
                estimatedVal: computedEstimate,
                userId: user.id,
            },
        });

        // 4. Create Ticket for SLA Tracking
        const slaDeadline = new Date();
        slaDeadline.setHours(slaDeadline.getHours() + 48);

        const ticket = await prisma.ticket.create({
            data: {
                deviceId: device.id,
                customerId: user.id,
                slaDeadline,
                status: status || 'PRICING_ESTIMATED'
            }
        });

        // 5. Set Redis key for AI pricing SLA (5 mins)
        await redis.setex(`sla:pricing:${device.id}`, 300, 'pending');

        res.json({ success: true, device, ticket });
    } catch (error) {
        console.error('Error submitting device:', error);
        res.status(500).json({ success: false, error: 'Failed to submit device' });
    }
});

// Backfill existing devices that have null estimatedVal
router.post('/backfill-prices', async (req, res) => {
    try {
        const devices = await prisma.device.findMany({
            where: { estimatedVal: null }
        });
        let updated = 0;
        for (const device of devices) {
            const est = estimatePrice(device.condition, device.model);
            await prisma.device.update({
                where: { id: device.id },
                data: { estimatedVal: est }
            });
            updated++;
        }
        // Also update any OPEN tickets to PRICING_ESTIMATED
        await prisma.ticket.updateMany({
            where: { status: 'OPEN' },
            data: { status: 'PRICING_ESTIMATED' }
        });
        res.json({ success: true, updated });
    } catch (error) {
        console.error('Error backfilling prices:', error);
        res.status(500).json({ success: false, error: 'Backfill failed' });
    }
});

export default router;
