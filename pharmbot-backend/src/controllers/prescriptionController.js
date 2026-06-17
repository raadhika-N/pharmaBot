const prisma = require('../config/db');
const fs = require('fs');
const path = require('path');

// POST /api/prescriptions/upload
const uploadPrescription = async (req, res) => {
  try {
    const { rawText } = req.body;

    if (!req.file && !rawText) {
      return res.status(400).json({
        error: 'Please upload a file or provide prescription text.'
      });
    }

    const prescriptionData = {
      userId: req.user.id,
      status: 'pending'
    };

    if (req.file) {
      prescriptionData.fileName = req.file.originalname;
      prescriptionData.fileType = req.file.mimetype;
      prescriptionData.filePath = req.file.path;
    }

    if (rawText) {
      prescriptionData.rawText = rawText.trim();
    }

    const prescription = await prisma.prescription.create({
      data: prescriptionData
    });

    res.status(201).json({
      message: 'Prescription uploaded successfully.',
      prescription
    });

  } catch (error) {
    console.error('Upload error:', error);

    // If DB save failed but file was saved, clean it up
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: 'Failed to upload prescription.' });
  }
};

// GET /api/prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        rawText: true,
        drugs: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      count: prescriptions.length,
      prescriptions
    });

  } catch (error) {
    console.error('Get all error:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions.' });
  }
};

// GET /api/prescriptions/:id
const getPrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    if (prescription.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this prescription.' });
    }

    res.json({ prescription });

  } catch (error) {
    console.error('Get one error:', error);
    res.status(500).json({ error: 'Failed to fetch prescription.' });
  }
};

// DELETE /api/prescriptions/:id
const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    if (prescription.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this prescription.' });
    }

    // Delete the physical file from disk if it exists
    if (prescription.filePath) {
      const absolutePath = path.resolve(prescription.filePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    await prisma.prescription.delete({
      where: { id }
    });

    res.json({ message: 'Prescription deleted successfully.' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete prescription.' });
  }
};

module.exports = {
  uploadPrescription,
  getAllPrescriptions,
  getPrescription,
  deletePrescription
};