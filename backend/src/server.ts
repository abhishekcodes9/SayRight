import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { RimeClient } from './services/rimeClient';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Rime client (only if API key is available)
let rimeClient: RimeClient | null = null;

try {
  const apiKey = process.env.RIME_API_KEY;
  if (apiKey && apiKey !== 'your_rime_api_key_here') {
    rimeClient = new RimeClient(apiKey);
    console.log('✓ Rime client initialized');
  } else {
    console.warn('⚠ RIME_API_KEY not configured - /api/speak endpoint will not work');
  }
} catch (error) {
  console.error('✗ Failed to initialize Rime client:', (error as Error).message);
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'SayRight Backend',
    timestamp: new Date().toISOString(),
    rimeConfigured: rimeClient !== null
  });
});

// TTS endpoint
app.post('/api/speak', async (req: Request, res: Response) => {
  try {
    // Check if Rime client is initialized
    if (!rimeClient) {
      return res.status(503).json({
        error: 'TTS service not available',
        message: 'RIME_API_KEY is not configured'
      });
    }

    // Validate request body
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'Text is required'
      });
    }

    if (typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid field type',
        message: 'Text must be a string'
      });
    }

    if (text.trim() === '') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text cannot be empty'
      });
    }

    // Generate speech
    console.log(`Generating speech for text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

    const audioBuffer = await rimeClient.generateSpeech(text);

    // Return audio response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'no-cache'
    });

    res.send(audioBuffer);
    console.log('✓ Speech generated successfully');

  } catch (error) {
    console.error('Error in /api/speak:', (error as Error).message);

    res.status(500).json({
      error: 'Speech generation failed',
      message: (error as Error).message
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log('==========================================');
  console.log(`🚀 SayRight Backend Server`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log('==========================================');
});
