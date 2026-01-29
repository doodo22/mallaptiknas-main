'use client';

import { useState } from 'react';

export default function DeepSeekTestPage() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState(null);
  const [prompt, setPrompt] = useState('Hello, can you tell me a short joke?');

  const testConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/deepseek-test');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Network error: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testChat = async () => {
    setChatLoading(true);
    setChatResponse(null);
    
    try {
      const response = await fetch('/api/deepseek-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setChatResponse(data);
    } catch (error) {
      setChatResponse({
        success: false,
        message: 'Network error: ' + error.message
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">DeepSeek Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Connection Test</h2>
          <p className="text-gray-600 mb-6">
            This test will check if your DeepSeek API key is properly configured and if the connection to DeepSeek API is working.
          </p>
          
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test DeepSeek Connection'}
          </button>
          
          {testResult && (
            <div className={`mt-6 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-semibold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.success ? '✓ Connection Successful' : '✗ Connection Failed'}
              </h3>
              <p className={`mt-2 ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {testResult.message}
              </p>
              
              {testResult.instructions && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 font-medium">Instructions:</p>
                  <p className="text-yellow-700 mt-1">{testResult.instructions}</p>
                </div>
              )}
              
              {testResult.models && (
                <div className="mt-4">
                  <p className="text-gray-700 font-medium">Available Models:</p>
                  <ul className="mt-2 space-y-1">
                    {testResult.models.slice(0, 5).map((model, index) => (
                      <li key={index} className="text-gray-600">• {model.id}</li>
                    ))}
                    {testResult.models.length > 5 && (
                      <li className="text-gray-500">... and {testResult.models.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}
              
              {testResult.error && (
                <div className="mt-4">
                  <p className="text-gray-700 font-medium">Error Details:</p>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm text-gray-800 overflow-auto">
                    {typeof testResult.error === 'string' ? testResult.error : JSON.stringify(testResult.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Chat Completion Test</h2>
          <p className="text-gray-600 mb-4">
            Test the DeepSeek chat completion API with a custom prompt.
          </p>
          
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-gray-700 font-medium mb-2">
              Prompt:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>
          
          <button
            onClick={testChat}
            disabled={chatLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chatLoading ? 'Sending...' : 'Test Chat Completion'}
          </button>
          
          {chatResponse && (
            <div className={`mt-6 p-4 rounded-lg ${chatResponse.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-semibold ${chatResponse.success ? 'text-green-800' : 'text-red-800'}`}>
                {chatResponse.success ? '✓ Chat Test Successful' : '✗ Chat Test Failed'}
              </h3>
              <p className={`mt-2 ${chatResponse.success ? 'text-green-700' : 'text-red-700'}`}>
                {chatResponse.message}
              </p>
              
              {chatResponse.response && (
                <div className="mt-4">
                  <p className="text-gray-700 font-medium">DeepSeek Response:</p>
                  <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-800">{chatResponse.response}</p>
                  </div>
                </div>
              )}
              
              {chatResponse.error && (
                <div className="mt-4">
                  <p className="text-gray-700 font-medium">Error Details:</p>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm text-gray-800 overflow-auto">
                    {typeof chatResponse.error === 'string' ? chatResponse.error : JSON.stringify(chatResponse.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Setup Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2 text-yellow-700">
            <li>Get a DeepSeek API key from <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DeepSeek Platform</a></li>
            <li>Create a <code className="bg-yellow-100 px-1 py-0.5 rounded">.env</code> file in the root directory</li>
            <li>Add your API key: <code className="bg-yellow-100 px-1 py-0.5 rounded">DEEPSEEK_API_KEY=your_api_key_here</code></li>
            <li>Restart the development server: <code className="bg-yellow-100 px-1 py-0.5 rounded">npm run dev</code></li>
            <li>Click the test buttons above to verify your connection</li>
          </ol>
        </div>
      </div>
    </div>
  );
}