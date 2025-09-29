// AI chatbot for farming advice using OpenRouter
const OPENROUTER_API_KEY = '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';

// Ask AI about farming
export async function askAI(question) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are AgroAssist AI, a helpful farming assistant. Give short, practical advice about crops, soil, water, and farming. Keep answers under 100 words.'
          },
          {
            role: 'user',
            content: question
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return 'Sorry, I could not get farming advice right now. Please try again later.';
  }
}
