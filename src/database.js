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
    const { data, error } = await supabase
      .from('sensors')
      .insert({
        user_id: userId,
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

// Save chat message
export async function saveChatMessage(userId, userMessage, aiResponse) {
  try {
    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: userId,
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