import axios from 'axios';

const RIME_API_URL = 'https://users.rime.ai/v1/rime-tts';

export class RimeClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('RIME_API_KEY is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Generate speech audio from text using Rime TTS API
   * @param text - The text to convert to speech
   * @returns Audio buffer (MP3 format)
   */
  async generateSpeech(text: string): Promise<Buffer> {
    const requestBody = {
      text: text,
      speaker: 'astra',
      modelId: 'coda',
      lang: 'en',
      audioConfig: { encoding: 'mp3' }
    };

    try {
      const response = await axios.post(RIME_API_URL, requestBody, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 30000 // 30 second timeout
      });

      return Buffer.from(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data
          ? Buffer.from(error.response.data).toString('utf-8')
          : 'No error details available';

        console.error('Rime API Error:', {
          status,
          statusText: error.response?.statusText,
          data: errorData,
          message: error.message
        });

        if (status === 401) {
          throw new Error('Rime API authentication failed. Check your API key.');
        } else if (status === 400) {
          throw new Error(`Rime API rejected request: ${errorData}`);
        } else if (status === 429) {
          throw new Error('Rime API rate limit exceeded. Please try again later.');
        } else if (status && status >= 500) {
          throw new Error('Rime API server error. Please try again later.');
        }

        throw new Error(`Rime API error: ${error.message}`);
      }

      throw new Error('Failed to generate speech: ' + (error as Error).message);
    }
  }
}
