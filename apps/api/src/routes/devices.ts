import { Router, Request, Response } from 'express';
import { prisma } from '../db';

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
// Handoff sessions repository (temporary memory storage)
// In a scalable production app, use Redis for this
const handoffSessions = new Map<string, { photoUrl: string | null; status: 'PENDING' | 'UPLOADED' }>();

router.post('/handoff/:sessionId', async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const { photoUrl } = req.body;
        if (!photoUrl) {
            return res.status(400).json({ success: false, error: 'photoUrl is required' });
        }
        handoffSessions.set(sessionId, { photoUrl, status: 'UPLOADED' });
        res.json({ success: true });
    } catch (err) {
        console.error('Handoff POST error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.get('/handoff/:sessionId', async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const session = handoffSessions.get(sessionId);
    if (!session) {
        // Return PENDING if not created yet (allow desktop to poll before mobile opens)
        return res.json({ success: true, session: { status: 'PENDING', photoUrl: null } });
    }
    res.json({ success: true, session });
});

router.post('/submit', async (req: Request, res: Response) => {
    try {
        const { brand, model, specs, condition, userEmail, userName, userId, estimatedPrice, status } = req.body;

        if (!userEmail) {
            return res.status(400).json({ success: false, error: 'userEmail is required' });
        }

        // 1. Upsert user
        const user = await prisma.user.upsert({
            where: { email: userEmail as string },
            update: { name: (userName as string) || undefined },
            create: {
                id: (userId as string) || undefined,
                email: userEmail as string,
                name: (userName as string) || (userEmail as string).split('@')[0],
                role: 'CUSTOMER',
            },
        });

        // 2. Compute estimated value (use client-provided or server-computed)
        const computedEstimate = estimatedPrice || estimatePrice(condition as string, model as string);

        // 3. Create Device entry with estimated value
        const device = await prisma.device.create({
            data: {
                brand: brand as string,
                model: model as string,
                specs: specs as any,
                condition: condition as string,
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


        res.json({ success: true, device, ticket });
    } catch (error) {
        console.error('Error submitting device:', error);
        res.status(500).json({ success: false, error: 'Failed to submit device' });
    }
});

// Backfill existing devices that have null estimatedVal
router.post('/backfill-prices', async (req: Request, res: Response) => {
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
