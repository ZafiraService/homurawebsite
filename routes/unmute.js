import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all unmute requests
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = status ? { status } : {};
    
    const requests = await prisma.unmuteRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching unmute requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single unmute request
router.get('/:id', async (req, res) => {
  try {
    const request = await prisma.unmuteRequest.findUnique({
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

// Create unmute request (public)
router.post('/', async (req, res) => {
  try {
    const { discordId, username, reason } = req.body;

    if (!discordId || !username || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const request = await prisma.unmuteRequest.create({
      data: {
        discordId,
        username,
        reason,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating unmute request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update unmute request status (admin only)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const request = await prisma.unmuteRequest.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        adminNotes: adminNotes || null,
        updatedAt: new Date(),
      },
    });

    res.json(request);
  } catch (error) {
    console.error('Error updating unmute request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete unmute request (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await prisma.unmuteRequest.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting unmute request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
