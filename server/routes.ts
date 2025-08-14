import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./database";
import { analyzeImage } from "./services/gemini";
import { insertImageAnalysisSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Image analysis endpoint
  app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Convert buffer to base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Analyze the image with OpenAI
      const analysisResult = await analyzeImage(base64Image);
      
      // Store the analysis
      const imageAnalysis = await storage.createImageAnalysis({
        originalFilename: req.file.originalname,
        imageData: base64Image,
        originalDescription: analysisResult.original.description,
        originalElements: JSON.stringify(analysisResult.original.elements),
        originalMood: analysisResult.original.mood,
        mirrorDescription: analysisResult.mirror.description,
        mirrorElements: JSON.stringify(analysisResult.mirror.elements),
        mirrorMood: analysisResult.mirror.mood,
      });

      res.json({
        id: imageAnalysis.id,
        original: {
          description: analysisResult.original.description,
          elements: analysisResult.original.elements,
          mood: analysisResult.original.mood,
        },
        mirror: {
          description: analysisResult.mirror.description,
          elements: analysisResult.mirror.elements,
          mood: analysisResult.mirror.mood,
        }
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze image" 
      });
    }
  });

  // Get analysis by ID
  app.get('/api/analysis/:id', async (req, res) => {
    try {
      const analysis = await storage.getImageAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json({
        id: analysis.id,
        originalFilename: analysis.originalFilename,
        original: {
          description: analysis.originalDescription,
          elements: JSON.parse(analysis.originalElements),
          mood: analysis.originalMood,
        },
        mirror: {
          description: analysis.mirrorDescription,
          elements: JSON.parse(analysis.mirrorElements),
          mood: analysis.mirrorMood,
        },
        createdAt: analysis.createdAt,
      });
    } catch (error) {
      console.error('Error fetching analysis:', error);
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  // Get recent analyses
  app.get('/api/recent-analyses', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const analyses = await storage.getRecentImageAnalyses(limit);
      
      res.json(analyses.map(analysis => ({
        id: analysis.id,
        originalFilename: analysis.originalFilename,
        createdAt: analysis.createdAt,
      })));
    } catch (error) {
      console.error('Error fetching recent analyses:', error);
      res.status(500).json({ message: "Failed to fetch recent analyses" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
