import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all candidatures
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = status ? { status } : {};
    
    const candidatures = await prisma.candidatureRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(candidatures);
  } catch (error) {
    console.error('Error fetching candidatures:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single candidature
router.get('/:id', async (req, res) => {
  try {
    const candidature = await prisma.candidatureRequest.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!candidature) {
      return res.status(404).json({ error: 'Candidature not found' });
    }

    res.json(candidature);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create candidature (public)
router.post('/', async (req, res) => {
  try {
    const { discordId, username, email, position, message } = req.body;

    if (!discordId || !username || !email || !position || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const allowedPositions = ['moderator', 'helper', 'staff'];
    if (!allowedPositions.includes(position)) {
      return res.status(400).json({ error: 'Invalid position' });
    }

    const candidature = await prisma.candidatureRequest.create({
      data: {
        discordId,
        username,
        email,
        position,
        message,
      },
    });

    res.status(201).json(candidature);
  } catch (error) {
    console.error('Error creating candidature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update candidature status (admin only)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const candidature = await prisma.candidatureRequest.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        adminNotes: adminNotes || null,
        updatedAt: new Date(),
      },
    });

    res.json(candidature);
  } catch (error) {
    console.error('Error updating candidature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete candidature (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await prisma.candidatureRequest.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
