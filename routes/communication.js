import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all active communications (public)
router.get('/', async (req, res) => {
  try {
    const communications = await prisma.communication.findMany({
      where: { isActive: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    res.json(communications);
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all communications (admin only)
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const communications = await prisma.communication.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });

    res.json(communications);
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single communication (public)
router.get('/:id', async (req, res) => {
  try {
    const communication = await prisma.communication.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!communication) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    res.json(communication);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create communication (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, type, priority } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const allowedTypes = ['announcement', 'update', 'warning', 'event'];
    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const communication = await prisma.communication.create({
      data: {
        title,
        content,
        type: type || 'announcement',
        priority: priority || 0,
        isActive: true,
      },
    });

    res.status(201).json(communication);
  } catch (error) {
    console.error('Error creating communication:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update communication (admin only)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { title, content, type, isActive, priority } = req.body;

    const communication = await prisma.communication.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(type && { type }),
        ...(typeof isActive === 'boolean' && { isActive }),
        ...(typeof priority === 'number' && { priority }),
        updatedAt: new Date(),
      },
    });

    res.json(communication);
  } catch (error) {
    console.error('Error updating communication:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete communication (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await prisma.communication.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting communication:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
