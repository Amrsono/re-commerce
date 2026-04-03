import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// Get customer profile overview
router.get('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        
        const isEmail = identifier.includes('@');

        const user = await prisma.user.findFirst({
            where: isEmail ? { email: identifier } : { id: identifier },
            include: {
                tickets: {
                    include: { device: true },
                    orderBy: { createdAt: 'desc' }
                },
                notifications: {
                    where: { isRead: false },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                paymentMethods: true
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
});

// Get order details & history
router.get('/:identifier/orders', async (req, res) => {
    try {
        const { identifier } = req.params;
        const isEmail = identifier.includes('@');

        // First resolve the actual DB User ID
        const user = await prisma.user.findFirst({
            where: isEmail ? { email: identifier } : { id: identifier },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const orders = await prisma.ticket.findMany({
            where: { customerId: user.id },
            include: { device: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
});

export default router;
