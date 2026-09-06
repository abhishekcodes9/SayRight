/**
 * Speech Preparation Engine
 *
 * Transforms technical text into speech-friendly format for TTS.
 * All transformations are deterministic and rule-based.
 */

export interface SpeechChange {
  original: string;
  prepared: string;
  reason: string;
  position: number;
}

export interface SpeechPrepResult {
  originalText: string;
  preparedText: string;
  changes: SpeechChange[];
}

/**
 * Technical abbreviation dictionary
 * Format: [pattern, spoken form, reason]
 */
const TECH_ABBREVIATIONS: Array<[RegExp, string, string]> = [
  // Authentication & Security
  [/\bOAuth\b/gi, 'OAuth', 'Authentication protocol'],
  [/\bJWT\b/g, 'J W T', 'JSON Web Token - spell out initialism'],
  [/\bSSL\b/g, 'S S L', 'Secure Sockets Layer - spell out'],
  [/\bTLS\b/g, 'T L S', 'Transport Layer Security - spell out'],
  [/\bHTTPS\b/g, 'H T T P S', 'Secure HTTP - spell out'],
  [/\bHTTP\b/g, 'H T T P', 'Protocol name - spell out'],

  // DevOps & Infrastructure
  [/\bCI\/CD\b/gi, 'C I slash C D', 'Continuous Integration/Deployment - spell out with slash'],
  [/\bAPI\b/g, 'A P I', 'Application Programming Interface - spell out'],
  [/\bREST\b/g, 'REST', 'RESTful (word form)'],
  [/\bCLI\b/g, 'C L I', 'Command Line Interface - spell out'],
  [/\bGUI\b/g, 'G U I', 'Graphical User Interface - spell out'],
  [/\bURL\b/g, 'U R L', 'Uniform Resource Locator - spell out'],
  [/\bDNS\b/g, 'D N S', 'Domain Name System - spell out'],
  [/\bCDN\b/g, 'C D N', 'Content Delivery Network - spell out'],
  [/\bVPC\b/g, 'V P C', 'Virtual Private Cloud - spell out'],
  [/\bAWS\b/g, 'A W S', 'Amazon Web Services - spell out'],
  [/\bGCP\b/g, 'G C P', 'Google Cloud Platform - spell out'],

  // Data & Protocols
  [/\bJSON\b/g, 'JSON', 'JSON (word form)'],
  [/\bXML\b/g, 'X M L', 'Extensible Markup Language - spell out'],
  [/\bSQL\b/g, 'S Q L', 'Structured Query Language - spell out'],
  [/\bNoSQL\b/gi, 'No S Q L', 'Non-SQL database - expand'],
  [/\bgRPC\b/g, 'gee R P C', 'Remote procedure call - expand g'],
  [/\bGraphQL\b/gi, 'GraphQL', 'Graph Query Language (word form)'],

  // Cryptography
  [/\bSHA\b/g, 'S H A', 'Secure Hash Algorithm - spell out'],
  [/\bMD5\b/g, 'M D five', 'Message Digest algorithm - spell out'],
  [/\bAES\b/g, 'A E S', 'Advanced Encryption Standard - spell out'],
  [/\bRSA\b/g, 'R S A', 'Rivest-Shamir-Adleman - spell out'],

  // Container & Orchestration
  [/\bk8s\b/gi, 'kubernetes', 'k8s is shorthand for kubernetes'],
  [/\bDocker\b/gi, 'Docker', 'Container platform (word form)'],

  // Programming
  [/\bSDK\b/g, 'S D K', 'Software Development Kit - spell out'],
  [/\bIDE\b/g, 'I D E', 'Integrated Development Environment - spell out'],
  [/\bORM\b/g, 'O R M', 'Object-Relational Mapping - spell out'],
  [/\bMVC\b/g, 'M V C', 'Model-View-Controller - spell out'],
];

/**
 * Cryptographic hash patterns (e.g., SHA-256, MD5-128)
 * Note: MD followed by digit (MD5, MD4) needs special handling
 */
const HASH_PATTERN = /\b(SHA|MD\d?|AES|RSA)-(\d+)\b/gi;

/**
 * Version number patterns (e.g., 2.0, v1.14.2, OAuth 2.0)
 * Includes optional 'v' prefix
 */
const VERSION_PATTERN = /\bv?(\d+)\.(\d+)(?:\.(\d+))?\b/gi;

/**
 * Slash-separated terms (e.g., read/write, TCP/IP)
 */
const SLASH_TERM_PATTERN = /\b([A-Z]{2,}|[a-z]+)\/([A-Z]{2,}|[a-z]+)\b/g;

/**
 * Convert a digit to its word form
 */
function digitToWord(digit: string): string {
  const map: Record<string, string> = {
    '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
    '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine'
  };
  return map[digit] || digit;
}

/**
 * Expand version numbers for natural speech
 * Examples: 2.0 -> "two point zero", 1.14.2 -> "one point fourteen point two"
 */
function expandVersionNumber(match: string): string {
  // Remove 'v' prefix if present
  const versionOnly = match.replace(/^v/i, '');
  const parts = versionOnly.split('.');

  if (parts.length === 2) {
    // Simple version: 2.0 -> "two point zero"
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);

    // Single digits: spell individually
    if (major < 10 && minor < 10) {
      return `${digitToWord(parts[0])} point ${digitToWord(parts[1])}`;
    }
    // Larger numbers: speak naturally
    return `${major} point ${minor}`;
  }

  if (parts.length === 3) {
    // Semantic version: 1.14.2 -> "one point fourteen point two"
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);
    const patch = parseInt(parts[2]);

    const majorStr = major < 10 ? digitToWord(parts[0]) : major.toString();
    const minorStr = minor < 100 ? minor.toString() : minor.toString();
    const patchStr = patch < 10 ? digitToWord(parts[2]) : patch.toString();

    return `${majorStr} point ${minorStr} point ${patchStr}`;
  }

  return match; // Fallback
}

/**
 * Expand cryptographic hash identifiers
 * Example: SHA-256 -> "SHA two five six"
 */
function expandHashIdentifier(algorithm: string, bits: string): string {
  // Keep algorithm as-is (SHA, AES, RSA, MD5, etc.)
  const algoExpanded = algorithm.toUpperCase();

  // Expand number digit by digit for clarity
  const bitsExpanded = bits.split('').map(digitToWord).join(' ');

  return `${algoExpanded} ${bitsExpanded}`;
}

/**
 * Main speech preparation function
 */
export function prepareForSpeech(text: string): SpeechPrepResult {
  if (!text || text.trim() === '') {
    return {
      originalText: text,
      preparedText: text,
      changes: []
    };
  }

  const changes: SpeechChange[] = [];
  let prepared = text;

  // We need to track positions in the original text for the change log
  interface Transformation {
    start: number;
    end: number;
    original: string;
    replacement: string;
    reason: string;
  }
  const transformations: Transformation[] = [];

  // Step 1: Handle cryptographic hash patterns (SHA-256, MD5-128, etc.)
  // IMPORTANT: Do this BEFORE handling abbreviations to avoid conflicts
  const hashMatches: Transformation[] = [];
  let match: RegExpExecArray | null;
  const hashRegex = new RegExp(HASH_PATTERN.source, HASH_PATTERN.flags);

  while ((match = hashRegex.exec(text)) !== null) {
    const algo = match[1];
    const bits = match[2];
    const replacement = expandHashIdentifier(algo, bits);
    hashMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      original: match[0],
      replacement,
      reason: 'Cryptographic identifier - expand algorithm and bits for clarity'
    });
  }

  // Step 2: Handle version numbers (e.g., 2.0, v1.14.2)
  const versionMatches: Transformation[] = [];
  const versionRegex = new RegExp(VERSION_PATTERN.source, VERSION_PATTERN.flags);

  while ((match = versionRegex.exec(text)) !== null) {
    // Skip if this overlaps with a hash match
    const overlaps = hashMatches.some(h =>
      match!.index >= h.start && match!.index < h.end
    );
    if (!overlaps) {
      const replacement = expandVersionNumber(match[0]);
      versionMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        original: match[0],
        replacement,
        reason: 'Version number - expand for natural speech'
      });
    }
  }

  // Step 3: Handle slash-separated terms (CI/CD, TCP/IP, read/write)
  const slashMatches: Transformation[] = [];
  const slashRegex = new RegExp(SLASH_TERM_PATTERN.source, SLASH_TERM_PATTERN.flags);

  while ((match = slashRegex.exec(text)) !== null) {
    const left = match[1];
    const right = match[2];
    const isAcronym = /^[A-Z]{2,}$/.test(left) && /^[A-Z]{2,}$/.test(right);

    let replacement: string;
    if (isAcronym) {
      const leftSpelled = left.split('').join(' ');
      const rightSpelled = right.split('').join(' ');
      replacement = `${leftSpelled} slash ${rightSpelled}`;
    } else {
      replacement = `${left} slash ${right}`;
    }

    slashMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      original: match[0],
      replacement,
      reason: isAcronym ? 'Slash-separated acronyms - spell out with explicit slash' : 'Slash-separated terms - make slash explicit'
    });
  }

  // Step 4: Handle technical abbreviations
  const abbrMatches: Transformation[] = [];
  TECH_ABBREVIATIONS.forEach(([pattern, replacement, reason]) => {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      // Skip if overlaps with hash, version, or slash matches
      const overlaps = [...hashMatches, ...versionMatches, ...slashMatches].some(t =>
        match!.index >= t.start && match!.index < t.end
      );
      if (!overlaps && match[0] !== replacement) {
        abbrMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          original: match[0],
          replacement,
          reason
        });
      }
    }
  });

  // Combine all transformations and sort by position
  transformations.push(...hashMatches, ...versionMatches, ...slashMatches, ...abbrMatches);
  transformations.sort((a, b) => a.start - b.start);

  // Apply transformations from end to start to preserve positions
  for (let i = transformations.length - 1; i >= 0; i--) {
    const t = transformations[i];
    prepared = prepared.substring(0, t.start) + t.replacement + prepared.substring(t.end);

    changes.unshift({
      original: t.original,
      prepared: t.replacement,
      reason: t.reason,
      position: t.start
    });
  }

  return {
    originalText: text,
    preparedText: prepared,
    changes
  };
}

/**
 * Utility function to get a summary of changes
 */
export function getChangeSummary(result: SpeechPrepResult): string {
  if (result.changes.length === 0) {
    return 'No transformations needed.';
  }

  return `Applied ${result.changes.length} transformation(s):\n` +
    result.changes.map((c, i) =>
      `  ${i + 1}. "${c.original}" → "${c.prepared}" (${c.reason})`
    ).join('\n');
}
