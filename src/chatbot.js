// AI chatbot for farming advice using OpenRouter
import { OPENROUTER_API_KEY } from '@env';

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
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: 'You are PAWA_Paglu, a helpful farming assistant. Give short, practical advice about crops, soil, water, and farming. Keep answers under 100 words.'
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