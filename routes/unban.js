import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all unban requests
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = status ? { status } : {};
    
    const requests = await prisma.unbanRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching unban requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single unban request
router.get('/:id', async (req, res) => {
  try {
    const request = await prisma.unbanRequest.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create unban request (public)
router.post('/', async (req, res) => {
  try {
    const { discordId, username, reason } = req.body;

    if (!discordId || !username || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const request = await prisma.unbanRequest.create({
      data: {
        discordId,
        username,
        reason,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating unban request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update unban request status (admin only)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const request = await prisma.unbanRequest.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        adminNotes: adminNotes || null,
        updatedAt: new Date(),
      },
    });

    res.json(request);
  } catch (error) {
    console.error('Error updating unban request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete unban request (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await prisma.unbanRequest.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting unban request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
