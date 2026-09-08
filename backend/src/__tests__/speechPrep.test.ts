import { prepareForSpeech, SpeechPrepResult } from '../services/speechPrep';

describe('Speech Preparation Engine', () => {
  describe('Required MVP Examples', () => {
    test('OAuth 2.0 -> OAuth two point zero', () => {
      const result = prepareForSpeech('OAuth 2.0');
      expect(result.preparedText).toBe('OAuth two point zero');
      expect(result.changes.length).toBeGreaterThan(0);
    });

    test('SHA-256 -> S H A two five six', () => {
      const result = prepareForSpeech('SHA-256');
      expect(result.preparedText).toBe('S H A two five six');
      expect(result.changes.length).toBeGreaterThan(0);
    });

    test('CI/CD -> C I slash C D', () => {
      const result = prepareForSpeech('CI/CD');
      expect(result.preparedText).toBe('C I slash C D');
      expect(result.changes.length).toBeGreaterThan(0);
    });
  });

  describe('Additional Technical Terms', () => {
    test('JWT authentication', () => {
      const result = prepareForSpeech('JWT authentication');
      expect(result.preparedText).toContain('J W T');
      expect(result.changes.length).toBeGreaterThan(0);
    });

    test('k8s cluster', () => {
      const result = prepareForSpeech('k8s cluster');
      expect(result.preparedText).toContain('kubernetes');
      expect(result.changes.length).toBeGreaterThan(0);
    });

    test('REST API endpoint', () => {
      const result = prepareForSpeech('REST API endpoint');
      expect(result.preparedText).toContain('REST');
      expect(result.preparedText).toContain('A P I');
      expect(result.changes.length).toBeGreaterThan(0);
    });

    test('HTTPS protocol', () => {
      const result = prepareForSpeech('HTTPS protocol');
      expect(result.preparedText).toContain('H T T P S');
      expect(result.changes.length).toBeGreaterThan(0);
    });

    test('gRPC service', () => {
      const result = prepareForSpeech('gRPC service');
      expect(result.preparedText).toContain('gee R P C');
      expect(result.changes.length).toBeGreaterThan(0);
    });
  });

  describe('Version Numbers', () => {
    test('Simple version: 3.0', () => {
      const result = prepareForSpeech('Version 3.0');
      expect(result.preparedText).toContain('three point zero');
    });

    test('Semantic version: v1.14.2', () => {
      const result = prepareForSpeech('v1.14.2');
      expect(result.preparedText).toContain('version one point fourteen point two');
    });
  });

  describe('Cryptographic Hashes', () => {
    test('MD5 hash', () => {
      const result = prepareForSpeech('MD5-128 hash');
      // MD5-128 -> "MD5 one two eight" (MD5 is captured as a unit)
      expect(result.preparedText).toContain('MD5 one two eight');
    });

    test('AES encryption', () => {
      const result = prepareForSpeech('AES-256 encryption');
      expect(result.preparedText).toContain('AES two five six');
    });
  });

  describe('Slash-Separated Terms', () => {
    test('TCP/IP network', () => {
      const result = prepareForSpeech('TCP/IP network');
      expect(result.preparedText).toContain('T C P slash I P');
    });

    test('read/write permissions', () => {
      const result = prepareForSpeech('read/write permissions');
      expect(result.preparedText).toContain('read slash write');
    });
  });

  describe('Ordinary Text (No Transformation)', () => {
    test('Plain English sentence', () => {
      const text = 'This is a normal sentence without technical terms.';
      const result = prepareForSpeech(text);
      expect(result.preparedText).toBe(text);
      expect(result.changes.length).toBe(0);
    });

    test('Simple greeting', () => {
      const text = 'Hello world';
      const result = prepareForSpeech(text);
      expect(result.preparedText).toBe(text);
      expect(result.changes.length).toBe(0);
    });
  });

  describe('Complex Technical Sentences', () => {
    test('Full technical sentence with multiple terms', () => {
      const text = 'Deploy the API v2.0 using CI/CD with SHA-256 hashing.';
      const result = prepareForSpeech(text);

      expect(result.preparedText).toContain('A P I');
      expect(result.preparedText).toContain('two point zero');
      expect(result.preparedText).toContain('C I slash C D');
      expect(result.preparedText).toContain('S H A two five six');
      expect(result.changes.length).toBeGreaterThan(3);
    });

    test('Authentication scenario', () => {
      const text = 'Use OAuth 2.0 with JWT tokens over HTTPS.';
      const result = prepareForSpeech(text);

      expect(result.preparedText).toContain('OAuth');
      expect(result.preparedText).toContain('two point zero');
      expect(result.preparedText).toContain('J W T');
      expect(result.preparedText).toContain('H T T P S');
    });
  });

  describe('Edge Cases', () => {
    test('Empty string', () => {
      const result = prepareForSpeech('');
      expect(result.preparedText).toBe('');
      expect(result.changes.length).toBe(0);
    });

    test('Whitespace only', () => {
      const result = prepareForSpeech('   ');
      expect(result.preparedText).toBe('   ');
      expect(result.changes.length).toBe(0);
    });
  });

  describe('Change Tracking', () => {
    test('Changes include original, prepared, and reason', () => {
      const result = prepareForSpeech('OAuth 2.0');

      expect(result.changes.length).toBeGreaterThan(0);
      result.changes.forEach(change => {
        expect(change).toHaveProperty('original');
        expect(change).toHaveProperty('prepared');
        expect(change).toHaveProperty('reason');
        expect(change).toHaveProperty('position');
        expect(typeof change.reason).toBe('string');
        expect(change.reason.length).toBeGreaterThan(0);
      });
    });

    test('Original text is preserved', () => {
      const original = 'SHA-256 and OAuth 2.0';
      const result = prepareForSpeech(original);

      expect(result.originalText).toBe(original);
      expect(result.preparedText).not.toBe(original);
    });
  });

  describe('Comma After Spelled Abbreviations', () => {
    test('JWT authentication -> J W T, authentication', () => {
      const result = prepareForSpeech('JWT authentication');
      expect(result.preparedText).toBe('J W T, authentication');
    });

    test('HTTPS protocol -> H T T P S, protocol', () => {
      const result = prepareForSpeech('HTTPS protocol');
      expect(result.preparedText).toBe('H T T P S, protocol');
    });

    test('REST API endpoint -> REST A P I, endpoint', () => {
      const result = prepareForSpeech('REST API endpoint');
      expect(result.preparedText).toBe('REST A P I, endpoint');
    });

    test('does not add comma before slash (CI/CD expansion)', () => {
      const result = prepareForSpeech('CI/CD');
      expect(result.preparedText).toBe('C I slash C D');
    });

    test('does not add comma before point (version expansion)', () => {
      const result = prepareForSpeech('v2.0');
      expect(result.preparedText).toBe('version two point zero');
    });

    test('does not add comma before number words (SHA-256 expansion)', () => {
      const result = prepareForSpeech('SHA-256');
      expect(result.preparedText).toBe('S H A two five six');
    });

    test('plain text remains unchanged', () => {
      const text = 'Hello world';
      const result = prepareForSpeech(text);
      expect(result.preparedText).toBe(text);
      expect(result.changes.length).toBe(0);
    });

    test('mixed sentence with comma after JWT but not after SHA', () => {
      const text = 'Use JWT with SHA-256.';
      const result = prepareForSpeech(text);
      expect(result.preparedText).toContain('J W T,');
      expect(result.preparedText).toContain('S H A two five six');
    });
  });
});

describe('Minimal Technical Pronunciation Lexicon', () => {
  test('WebSocket', () => { expect(prepareForSpeech('WebSocket').preparedText).toBe('Web Socket'); });
  test('PostgreSQL', () => { expect(prepareForSpeech('PostgreSQL').preparedText).toBe('Postgres S Q L'); });
  test('MongoDB', () => { expect(prepareForSpeech('MongoDB').preparedText).toBe('Mongo D B'); });
  test('GraphQL', () => { expect(prepareForSpeech('GraphQL').preparedText).toBe('Graph Q L'); });
});
