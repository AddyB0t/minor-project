// AI chatbot for farming advice using OpenRouter
import { OPENROUTER_API_KEY } from '@env';

// Rate limiting to prevent API key flagging
let lastApiCall = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

function enforceRateLimit() {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastCall;
    console.log(`[RATE_LIMIT] Waiting ${waitTime}ms before next API call`);
    return new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastApiCall = now;
  return Promise.resolve();
}

// Validate API key is available
if (!OPENROUTER_API_KEY) {
  console.error('[CHATBOT] OPENROUTER_API_KEY not found in environment variables');
  console.error('[CHATBOT] Please create .env file with your API key');
}

// Environment validation function
function validateEnvironmentVariables() {
  const missingVars = [];
  
  if (!OPENROUTER_API_KEY) {
    missingVars.push('OPENROUTER_API_KEY');
  }
  
  if (missingVars.length > 0) {
    const errorMsg = `Missing environment variables: ${missingVars.join(', ')}`;
    console.error(`[ENV] ${errorMsg}`);
    console.error('[ENV] Please check your .env file');
    console.error('[ENV] Setup instructions:');
    console.error('[ENV] 1. Copy .env.example to .env');
    console.error('[ENV] 2. Add your OpenRouter API key');
    console.error('[ENV] 3. Restart the development server');
    throw new Error(errorMsg);
  }
  
  console.log('[ENV] All required environment variables loaded successfully');
  return true;
}

// Helper function to extract JSON from mixed response
function extractJSONFromResponse(response) {
  try {
    // Try direct parsing first
    JSON.parse(response);
    return response;
  } catch (e) {
    // If direct parsing fails, try to extract JSON from text
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    throw new Error('No valid JSON found in AI response');
  }
}

// Helper function to convert pH range to single numeric value
function convertPhRangeToValue(phRange) {
  console.log(`[pH] Converting pH: ${phRange} (type: ${typeof phRange})`);
  
  // Already numeric - return as is
  if (typeof phRange === 'number') {
    return phRange;
  }
  
  if (typeof phRange === 'string') {
    // Handle ranges like "6.0-7.0" or "5.5-6.5"
    const rangeMatch = phRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      const midpoint = (min + max) / 2;
      console.log(`[pH] Range ${phRange} → midpoint ${midpoint}`);
      return midpoint;
    }
    
    // Handle single values like "6.5"
    const singleMatch = phRange.match(/(\d+\.?\d*)/);
    if (singleMatch) {
      const value = parseFloat(singleMatch[1]);
      console.log(`[pH] Single value ${phRange} → ${value}`);
      return value;
    }
  }
  
  console.log(`[pH] Using default pH 6.5 for: ${phRange}`);
  return 6.5;  // Safe default
}

// Helper function to map sunlight values to database format
function mapSunlightToDbValue(sunlightValue) {
  console.log(`[SUNLIGHT] Converting sunlight: ${sunlightValue} (type: ${typeof sunlightValue})`);
  
  if (typeof sunlightValue === 'string') {
    const normalizedValue = sunlightValue.toLowerCase().trim();
    
    // Map common sunlight descriptions to database values
    const sunlightMapping = {
      'full sun': 'high',
      'fullsun': 'high',
      'high': 'high',
      'partial sun': 'medium',
      'partialsun': 'medium',
      'medium': 'medium',
      'partial shade': 'medium',
      'partialshade': 'medium',
      'shade': 'low',
      'low': 'low',
      'filtered light': 'low',
      'indirect': 'low'
    };
    
    const mappedValue = sunlightMapping[normalizedValue] || 'medium';
    console.log(`[SUNLIGHT] Mapped ${sunlightValue} → ${mappedValue}`);
    return mappedValue;
  }
  
  console.log(`[SUNLIGHT] Using default 'medium' for: ${sunlightValue}`);
  return 'medium'; // Safe default
}

// Helper function to map water need values to database format
function mapWaterNeedToDbValue(waterNeedValue) {
  console.log(`[WATER] Converting water need: ${waterNeedValue} (type: ${typeof waterNeedValue})`);
  
  if (typeof waterNeedValue === 'string') {
    const normalizedValue = waterNeedValue.toLowerCase().trim();
    
    // Map water need descriptions to database values
    const waterMapping = {
      'very high': 'high',
      'high': 'high',
      'medium': 'medium',
      'moderate': 'medium',
      'low': 'low',
      'very low': 'low',
      'minimal': 'low'
    };
    
    const mappedValue = waterMapping[normalizedValue] || 'medium';
    console.log(`[WATER] Mapped ${waterNeedValue} → ${mappedValue}`);
    return mappedValue;
  }
  
  console.log(`[WATER] Using default 'medium' for: ${waterNeedValue}`);
  return 'medium'; // Safe default
}

// Fallback data generator
function getFallbackPlantData(plantName) {
  console.log(`[AI] Using fallback data for: ${plantName}`);
  return {
    water_need: 'medium',
    sunlight: 'high',
    soil_ph: 6.5,
    cost_per_acre: 180000,
    category: 'Unknown',
    growth_days: 90,
    yield: 'Unknown',
    emoji: '🌱'
  };
}

// Enhanced API request with retry logic
async function makeApiRequest(plantName, retryCount = 0) {
  // Validate environment on first API call
  if (retryCount === 0) {
    validateEnvironmentVariables();
  }
  
  // Enforce rate limiting to prevent flagging
  await enforceRateLimit();
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Smart-Agriculture-App/1.0',
        'X-Title': 'Smart Agriculture App'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a farming expert. Return ONLY valid JSON with no additional text or formatting. Use this exact format with database-compatible values: {"water_need":"high","sunlight":"medium","soil_ph":"6.5","cost_per_acre":150000,"category":"Vegetable","growth_days":60,"yield":"15-20 tons/acre","emoji":"🧅"}. For water_need and sunlight use only: "low", "medium", or "high". For soil_ph use single numeric values like 6.5.'
          },
          {
            role: 'user', 
            content: `Provide farming data for ${plantName} in JSON format with Indian costs in rupees.`
          }
        ],
        temperature: 0.1,  // Lower temperature for more consistent responses
        max_tokens: 200    // Limit response length
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (retryCount < 2) {
      console.log(`[AI] Retrying API request (attempt ${retryCount + 1}/3)`);
      // Exponential backoff: 5s, then 15s to avoid flagging
      const delay = retryCount === 0 ? 5000 : 15000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeApiRequest(plantName, retryCount + 1);
    }
    throw error;
  }
}

// Get plant information from AI with comprehensive error handling
export async function getPlantInfoFromAI(plantName) {
  try {
    console.log(`[AI] Getting plant info for: ${plantName}`);
    
    // Step 1: Make API request with retry logic
    const response = await makeApiRequest(plantName);
    console.log(`[AI] API Response status: ${response.status}`);
    
    // Step 2: Check if response is ok
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    // Step 3: Parse JSON with error handling
    const data = await response.json();
    console.log('[AI] Raw API response:', JSON.stringify(data, null, 2));
    
    // Step 4: Validate response structure
    if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Invalid API response structure - no choices array');
    }
    
    if (!data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid API response structure - no message content');
    }

    // Step 5: Extract and validate AI response
    const aiResponse = data.choices[0].message.content;
    console.log('[AI] Raw AI response:', aiResponse);
    
    // Step 6: Parse JSON with better error handling
    const cleanedResponse = extractJSONFromResponse(aiResponse);
    const plantData = JSON.parse(cleanedResponse);
    
    // Convert values for database compatibility
    plantData.soil_ph = convertPhRangeToValue(plantData.soil_ph);
    plantData.sunlight = mapSunlightToDbValue(plantData.sunlight);
    plantData.water_need = mapWaterNeedToDbValue(plantData.water_need);
    console.log(`[AI] Processed soil_ph: ${plantData.soil_ph} (type: ${typeof plantData.soil_ph})`);
    console.log(`[AI] Processed sunlight: ${plantData.sunlight}`);
    console.log(`[AI] Processed water_need: ${plantData.water_need}`);
    
    // Step 7: Validate required fields
    const requiredFields = ['water_need', 'sunlight', 'soil_ph', 'cost_per_acre'];
    for (const field of requiredFields) {
      if (!plantData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    console.log('[AI] Successfully parsed plant data:', plantData);
    return plantData;
    
  } catch (error) {
    console.error('[AI] Error getting plant info:', error);
    console.error('[AI] Full error details:', error.message);
    
    // Handle environment variable errors specifically
    if (error.message.includes('Missing environment variables')) {
      console.error('[ENV] Environment setup required:');
      console.error('[ENV] 1. Copy .env.example to .env');
      console.error('[ENV] 2. Add your OpenRouter API key');
      console.error('[ENV] 3. Restart the development server');
      return getFallbackPlantData(plantName);
    }
    
    // Return fallback data for other errors
    return getFallbackPlantData(plantName);
  }
}

// Ask AI about farming
export async function askAI(question) {
  try {
    validateEnvironmentVariables();

    // Enforce rate limiting to prevent flagging
    await enforceRateLimit();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Smart-Agriculture-App/1.0',
        'X-Title': 'Smart Agriculture App'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are AgroAssist AI, an expert agricultural advisor with deep knowledge of:

EXPERTISE AREAS:
- Crop selection based on climate, soil, and weather conditions
- Pest and disease management
- Irrigation and water management
- Soil health and fertilization
- Seasonal farming practices
- Climate-smart agriculture

RESPONSE GUIDELINES:
1. Give ACCURATE, scientifically-backed farming advice
2. Consider the CONTEXT of the question (weather, season, region)
3. For weather-related questions:
   - Storm/Heavy Rain: Recommend drainage, avoid transplanting, protect seedlings
   - Drought: Suggest drought-resistant crops (millets, sorghum, chickpea)
   - Flooding: Advise rice only in paddies, otherwise avoid planting
4. Always explain WHY you recommend something
5. Keep answers concise (under 150 words) but complete
6. If unsure, say so rather than guessing

NEVER recommend crops unsuitable for the conditions asked about.
For storms: Focus on protection, NOT planting new crops.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.3,  // Lower temperature for more accurate responses
        max_tokens: 300
      })
    });

    const data = await response.json();

    // Check for API errors
    if (data.error) {
      console.error('[AI] API Error:', data.error);
      return `API Error: ${data.error.message || 'Unknown error'}`;
    }

    // Check if response has expected structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('[AI] Invalid response:', JSON.stringify(data));
      return 'Received invalid response from AI. Please try again.';
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('[AI] Chat error:', error.message);

    // Handle environment variable errors specifically
    if (error.message.includes('Missing environment variables')) {
      console.error('[ENV] Environment setup required for chat functionality:');
      console.error('[ENV] 1. Copy .env.example to .env');
      console.error('[ENV] 2. Add your OpenRouter API key');
      console.error('[ENV] 3. Restart the development server');
      return 'AI chat is unavailable. Please check the console for setup instructions.';
    }

    return `Error: ${error.message}. Check your internet connection.`;
  }
}
