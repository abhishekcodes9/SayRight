import express from 'express';
import request from 'supertest';
import { prepareForSpeech } from '../services/speechPrep';

// Build a minimal Express app with just the /api/prepare route
const app = express();
app.use(express.json());

app.post('/api/prepare', (req, res) => {
  try {
    const { text } = req.body;

    if (text === undefined || text === null) {
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

    const result = prepareForSpeech(text);

    res.json({
      originalText: result.originalText,
      preparedText: result.preparedText,
      changes: result.changes
    });
  } catch (error) {
    console.error('Error in /api/prepare:', (error as Error).message);

    res.status(500).json({
      error: 'Speech preparation failed',
      message: (error as Error).message
    });
  }
});

describe('POST /api/prepare', () => {
  describe('Valid requests', () => {
    test('returns prepared text for technical input', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({ text: 'Deploy the API v2.0 using CI/CD with SHA-256 hashing.' })
        .expect(200);

      expect(res.body).toHaveProperty('originalText');
      expect(res.body).toHaveProperty('preparedText');
      expect(res.body).toHaveProperty('changes');
      expect(res.body.originalText).toBe('Deploy the API v2.0 using CI/CD with SHA-256 hashing.');
      expect(res.body.preparedText).toContain('A P I');
      expect(res.body.preparedText).toContain('two point zero');
      expect(res.body.preparedText).toContain('C I slash C D');
      expect(res.body.preparedText).toContain('S H A two five six');
      expect(Array.isArray(res.body.changes)).toBe(true);
      expect(res.body.changes.length).toBeGreaterThan(0);
    });

    test('returns unchanged text for plain English', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({ text: 'Hello world, this is a simple sentence.' })
        .expect(200);

      expect(res.body.originalText).toBe('Hello world, this is a simple sentence.');
      expect(res.body.preparedText).toBe('Hello world, this is a simple sentence.');
      expect(res.body.changes).toEqual([]);
    });

    test('each change includes all required fields', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({ text: 'OAuth 2.0' })
        .expect(200);

      expect(res.body.changes.length).toBeGreaterThan(0);
      res.body.changes.forEach((change: any) => {
        expect(change).toHaveProperty('original');
        expect(change).toHaveProperty('prepared');
        expect(change).toHaveProperty('reason');
        expect(change).toHaveProperty('position');
      });
    });
  });

  describe('Missing text', () => {
    test('rejects empty body', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({})
        .expect(400);

      expect(res.body.error).toBe('Missing required field');
    });

    test('rejects null text', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({ text: null })
        .expect(400);

      expect(res.body.error).toBe('Missing required field');
    });
  });

  describe('Non-string text', () => {
    test('rejects numeric text', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({ text: 12345 })
        .expect(400);

      expect(res.body.error).toBe('Invalid field type');
    });

    test('rejects array text', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({ text: ['hello'] })
        .expect(400);

      expect(res.body.error).toBe('Invalid field type');
    });

    test('rejects boolean text', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({ text: true })
        .expect(400);

      expect(res.body.error).toBe('Invalid field type');
    });
  });

  describe('Empty / whitespace text', () => {
    test('rejects empty string', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({ text: '' })
        .expect(400);

      expect(res.body.error).toBe('Invalid input');
    });

    test('rejects whitespace-only string', async () => {
      const res = await request(app)
        .post('/api/prepare')
        .send({ text: '   ' })
        .expect(400);

      expect(res.body.error).toBe('Invalid input');
    });
  });
});
