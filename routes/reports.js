import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all reports
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = status ? { status } : {};
    
    const reports = await prisma.reportRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single report
router.get('/:id', async (req, res) => {
  try {
    const report = await prisma.reportRequest.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create report (public)
router.post('/', async (req, res) => {
  try {
    const { reporterDiscordId, reporterUsername, reportedDiscordId, reportedUsername, reason, description } = req.body;

    if (!reporterDiscordId || !reporterUsername || !reportedDiscordId || !reportedUsername || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const report = await prisma.reportRequest.create({
      data: {
        reporterDiscordId,
        reporterUsername,
        reportedDiscordId,
        reportedUsername,
        reason,
        description: description || '',
      },
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update report status (admin only)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const report = await prisma.reportRequest.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        adminNotes: adminNotes || null,
        updatedAt: new Date(),
      },
    });

    res.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete report (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await prisma.reportRequest.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
