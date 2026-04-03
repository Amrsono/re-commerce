import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// Get messages for a specific order/ticket
router.get('/ticket/:ticketId', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const messages = await prisma.message.findMany({
            where: { ticketId },
            include: { sender: true },
            orderBy: { createdAt: 'asc' }
        });

        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
});

// Send a message
router.post('/send', async (req, res) => {
    try {
        const { content, senderId, senderEmail, receiverId, ticketId } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, error: 'Message content is required' });
        }
        if (!ticketId) {
            return res.status(400).json({ success: false, error: 'No active ticket. Please submit a device first to start a support conversation.' });
        }

        let realSenderId = senderId;
        let realReceiverId = receiverId;

        // If it's a customer sending via email, upsert to ensure they exist in the DB
        if (senderEmail) {
            const user = await prisma.user.upsert({
                where: { email: senderEmail },
                update: {},
                create: {
                    email: senderEmail,
                    name: senderEmail.split('@')[0],
                    role: 'CUSTOMER',
                },
            });
            realSenderId = user.id;
            console.log(`[Chat] Resolved sender by email: ${senderEmail} -> ${user.id}`);
        }
        
        console.log(`[Chat] Sending message: sender=${realSenderId}, receiver=${realReceiverId}, ticket=${ticketId}`);

        // If sending to mock admin "1", resolve real admin DB CUID
        if (receiverId === "1" || !receiverId) {
            const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }});
            if (admin) {
                realReceiverId = admin.id;
            } else {
                // If no admin exists at all, we could fail or create a dummy one.
                // It's safer to fail logically so we don't insert bad FKs.
                return res.status(400).json({ success: false, error: 'No admin user found to receive message' });
            }
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: realSenderId,
                receiverId: realReceiverId,
                ticketId
            },
            include: { sender: true }
        });

        // Also create a notification for the receiver
        await prisma.notification.create({
            data: {
                userId: realReceiverId,
                title: 'New Message',
                content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                type: 'MESSAGE'
            }
        });

        res.json({ success: true, message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// Admin endpoint: Get all tickets that have chat messages (Inbox view)
router.get('/admin/inbox', async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                messages: {
                    some: {} // Only tickets with at least one message
                }
            },
            include: {
                device: true,
                customer: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        res.json({ success: true, tickets });
    } catch (error) {
        console.error('Error fetching admin inbox:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch admin inbox' });
    }
});

export default router;
