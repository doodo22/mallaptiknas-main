class DeepSeekClient {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY;
    this.baseURL = 'https://api.deepseek.com/v1';
  }

  async getModels() {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching DeepSeek models:', error);
      throw error;
    }
  }

  async chatCompletion(messages, options = {}) {
    try {
      const defaultOptions = {
        model: 'deepseek-chat',
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      };

      const requestBody = {
        ...defaultOptions,
        ...options,
        messages,
      };

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat completion failed: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in DeepSeek chat completion:', error);
      throw error;
    }
  }

  async quickChat(prompt, options = {}) {
    const messages = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await this.chatCompletion(messages, options);
    return response.choices[0]?.message?.content || '';
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Test connection method
  async testConnection() {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          message: 'DEEPSEEK_API_KEY is not set',
        };
      }

      const models = await this.getModels();
      return {
        success: true,
        message: 'Successfully connected to DeepSeek API',
        models: models.data,
        apiKeyPresent: true,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to connect to DeepSeek API',
        error: error.message,
      };
    }
  }
}

// Create and export a singleton instance
export const deepseek = new DeepSeekClient();

// Also export the class for custom instances
export { DeepSeekClient };