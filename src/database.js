// Database functions for smart agriculture app using Supabase
import supabase from './supabase';

// Get plant info by name
export async function getPlantInfo(plantName) {
  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('name', plantName)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting plant info:', error);
    return null;
  }
}

// Save sensor reading
export async function saveSensorData(userId, sensorType, value) {
  try {
    // If userId is not a valid UUID format, get the sample user ID
    let actualUserId = userId;
    if (typeof userId === 'string' && userId.length < 36) {
      actualUserId = await getSampleUserId();
    }

    const { data, error } = await supabase
      .from('sensors')
      .insert({
        user_id: actualUserId,
        sensor_type: sensorType,
        value: value
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving sensor data:', error);
    return null;
  }
}

// Get user's recent sensor data
export async function getUserSensorData(userId) {
  try {
    const { data, error } = await supabase
      .from('sensors')
      .select('*')
      .eq('user_id', userId)
      .order('reading_date', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting sensor data:', error);
    return [];
  }
}

// Add new plant to database
export async function addPlantInfo(plantData) {
  try {
    const { data, error } = await supabase
      .from('plants')
      .insert({
        name: plantData.name,
        water_need: plantData.water_need,
        sunlight: plantData.sunlight,
        soil_ph: plantData.soil_ph,
        cost_per_acre: plantData.cost_per_acre
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding plant:', error);
    return null;
  }
}

// Get all plants from database
export async function getAllPlants() {
  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting all plants:', error);
    return [];
  }
}

// Get sample user ID (for demo purposes)
export async function getSampleUserId() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'john@farm.com')
      .single();

    if (error) throw error;
    return data?.id;
  } catch (error) {
    console.error('Error getting sample user ID:', error);
    // Return a default UUID if user not found
    return '550e8400-e29b-41d4-a716-446655440000';
  }
}

// Save chat message
export async function saveChatMessage(userId, userMessage, aiResponse) {
  try {
    // If userId is not a valid UUID format, get the sample user ID
    let actualUserId = userId;
    if (typeof userId === 'string' && userId.length < 36) {
      actualUserId = await getSampleUserId();
    }

    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: actualUserId,
        user_message: userMessage,
        ai_response: aiResponse
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return null;
  }
}