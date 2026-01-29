import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Check if DEEPSEEK_API_KEY is set
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'DEEPSEEK_API_KEY environment variable is not set',
          instructions: 'Please add DEEPSEEK_API_KEY to your .env file'
        },
        { status: 500 }
      );
    }

    // Test DeepSeek API connection
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to connect to DeepSeek API',
          status: response.status,
          error: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to DeepSeek API',
      models: data.data,
      apiKeyPresent: true,
      apiKeyFirstChars: apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4)
    });
    
  } catch (error) {
    console.error('DeepSeek test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error testing DeepSeek connection',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { success: false, message: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'DEEPSEEK_API_KEY environment variable is not set'
        },
        { status: 500 }
      );
    }

    // Test DeepSeek chat completion
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to get response from DeepSeek',
          status: response.status,
          error: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Successfully received response from DeepSeek',
      response: data.choices[0]?.message?.content || 'No response content',
      fullResponse: data
    });
    
  } catch (error) {
    console.error('DeepSeek chat error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error communicating with DeepSeek',
        error: error.message
      },
      { status: 500 }
    );
  }
}