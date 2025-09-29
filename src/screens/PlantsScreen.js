// Plants screen for plant database
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPlantInfo, addPlantInfo, getAllPlants } from '../database';
import { getPlantInfoFromAI } from '../chatbot';
import DataTable from '../components/table/DataTable';
import StatCard from '../components/cards/StatCard';

const { width } = Dimensions.get('window');

export default function PlantsScreen() {
  const navigation = useNavigation();
  const [plantInfo, setPlantInfo] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plantsData, setPlantsData] = useState([]);
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [addPlantError, setAddPlantError] = useState('');

  // Mock comprehensive plant data
  const mockPlantsData = [
    {
      name: 'Tomato',
      emoji: '🍅',
      category: 'Vegetable',
      waterNeed: 'high',
      sunlight: 'high',
      soilPh: 6.4,
      costPerAcre: 207500,
      growthDays: 75,
      yield: '25-30 tons/acre',
      status: 'Recommended'
    },
    {
      name: 'Wheat',
      emoji: '🌾',
      category: 'Grain',
      waterNeed: 'medium',
      sunlight: 'high',
      soilPh: 6.5,
      costPerAcre: 149400,
      growthDays: 120,
      yield: '3-4 tons/acre',
      status: 'Popular'
    },
    {
      name: 'Rice',
      emoji: '🌾',
      category: 'Grain',
      waterNeed: 'high',
      sunlight: 'high',
      soilPh: 6.0,
      costPerAcre: 182600,
      growthDays: 150,
      yield: '4-5 tons/acre',
      status: 'High Yield'
    },
    {
      name: 'Corn',
      emoji: '🌽',
      category: 'Grain',
      waterNeed: 'high',
      sunlight: 'high',
      soilPh: 6.5,
      costPerAcre: 166000,
      growthDays: 90,
      yield: '6-8 tons/acre',
      status: 'Recommended'
    },
    {
      name: 'Potato',
      emoji: '🥔',
      category: 'Vegetable',
      waterNeed: 'medium',
      sunlight: 'medium',
      soilPh: 5.5,
      costPerAcre: 232400,
      growthDays: 80,
      yield: '20-25 tons/acre',
      status: 'Popular'
    },
    {
      name: 'Sugarcane',
      emoji: '🎋',
      category: 'Cash Crop',
      waterNeed: 'high',
      sunlight: 'high',
      soilPh: 7.0,
      costPerAcre: 290500,
      growthDays: 365,
      yield: '80-100 tons/acre',
      status: 'High Profit'
    },
    {
      name: 'Cotton',
      emoji: '🌿',
      category: 'Fiber',
      waterNeed: 'medium',
      sunlight: 'high',
      soilPh: 6.5,
      costPerAcre: 249000,
      growthDays: 180,
      yield: '8-10 quintals/acre',
      status: 'Industrial'
    },
    {
      name: 'Soybean',
      emoji: '🫘',
      category: 'Oilseed',
      waterNeed: 'medium',
      sunlight: 'high',
      soilPh: 6.5,
      costPerAcre: 157700,
      growthDays: 100,
      yield: '2-3 tons/acre',
      status: 'Recommended'
    }
  ];

  useEffect(() => {
    const loadCombinedPlants = async () => {
      // Always start with mock data (converted to INR)
      const combinedPlants = [...mockPlantsData];
      
      // Try to get additional plants from database
      const realPlants = await getAllPlants();
      if (realPlants && realPlants.length > 0) {
        // Add database plants to mock data (avoid duplicates by name)
        const existingNames = mockPlantsData.map(p => p.name.toLowerCase());
        const newPlants = realPlants.filter(p => 
          !existingNames.includes(p.name.toLowerCase())
        ).map(dbPlant => ({
          // Convert database format to UI format
          name: dbPlant.name,
          emoji: '🌱', // Default emoji for database plants
          category: 'Added by AI',
          waterNeed: dbPlant.water_need,
          sunlight: dbPlant.sunlight,
          soilPh: dbPlant.soil_ph,
          costPerAcre: dbPlant.cost_per_acre,
          growthDays: 0, // Default
          yield: 'Unknown', // Default  
          status: 'AI Generated'
        }));
        
        combinedPlants.push(...newPlants);
      }
      
      setPlantsData(combinedPlants);
    };
    
    loadCombinedPlants();
  }, []);

  const showPlant = async (plantName) => {
    setSelectedPlant(plantName);
    const info = await getPlantInfo(plantName);
    setPlantInfo(info);
  };

  const addNewPlant = async () => {
    if (!newPlantName.trim()) {
      setAddPlantError('Please enter a plant name');
      return;
    }

    setIsAddingPlant(true);
    setAddPlantError('');

    try {
      // Step 1: Get plant info from AI with timeout
      setAddPlantError('🤖 Contacting AI for plant information...');
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI request timed out')), 30000)
      );
      
      const aiPlantData = await Promise.race([
        getPlantInfoFromAI(newPlantName.trim()),
        timeoutPromise
      ]);
      
      if (!aiPlantData) {
        throw new Error('AI returned no data - using fallback information');
      }

      setAddPlantError('💾 Validating and saving plant to database...');
      
      // Step 2: Validate and prepare data for database
      const plantDataForDB = {
        name: newPlantName.trim(),
        water_need: aiPlantData.water_need,
        sunlight: aiPlantData.sunlight,
        soil_ph: typeof aiPlantData.soil_ph === 'number' ? aiPlantData.soil_ph : 6.5,
        cost_per_acre: aiPlantData.cost_per_acre
      };
      
      // Database validation before insert
      const validationErrors = [];
      
      if (!plantDataForDB.name || plantDataForDB.name.trim().length === 0) {
        validationErrors.push('Plant name cannot be empty');
      }
      
      if (!['low', 'medium', 'high'].includes(plantDataForDB.water_need)) {
        validationErrors.push(`Invalid water_need: ${plantDataForDB.water_need}. Must be low, medium, or high`);
      }
      
      if (!['low', 'medium', 'high'].includes(plantDataForDB.sunlight)) {
        validationErrors.push(`Invalid sunlight: ${plantDataForDB.sunlight}. Must be low, medium, or high`);
      }
      
      if (typeof plantDataForDB.soil_ph !== 'number' || plantDataForDB.soil_ph < 4.0 || plantDataForDB.soil_ph > 8.5) {
        validationErrors.push(`Invalid soil_ph: ${plantDataForDB.soil_ph}. Must be a number between 4.0 and 8.5`);
      }
      
      if (typeof plantDataForDB.cost_per_acre !== 'number' || plantDataForDB.cost_per_acre <= 0) {
        validationErrors.push(`Invalid cost_per_acre: ${plantDataForDB.cost_per_acre}. Must be a positive number`);
      }
      
      if (validationErrors.length > 0) {
        throw new Error(`Database validation failed: ${validationErrors.join(', ')}`);
      }
      
      console.log('[DB] Validation passed, saving plant data:', plantDataForDB);
      
      const savedPlant = await addPlantInfo(plantDataForDB);

      if (!savedPlant) {
        throw new Error('Failed to save plant to database - please try again');
      }

      // Step 3: Add to local plants data (combine with existing)
      const newPlantForUI = {
        name: newPlantName.trim(),
        emoji: aiPlantData.emoji || '🌱',
        category: aiPlantData.category || 'Added by AI',
        waterNeed: aiPlantData.water_need,
        sunlight: aiPlantData.sunlight,
        soilPh: aiPlantData.soil_ph,
        costPerAcre: aiPlantData.cost_per_acre,
        growthDays: aiPlantData.growth_days || 0,
        yield: aiPlantData.yield || 'Unknown',
        status: 'AI Generated'
      };
      
      setPlantsData(prevData => [...prevData, newPlantForUI]);
      
      // Step 4: Reset form and close modal
      setNewPlantName('');
      setShowAddPlantModal(false);
      
      // Show success message with context
      Alert.alert(
        'Success!', 
        aiPlantData.category === 'Unknown' 
          ? `${newPlantName.trim()} added with basic information (AI data unavailable)`
          : `${newPlantName.trim()} added successfully with AI-generated farming data!`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('[Plant Addition] Error:', error);
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to add plant';
      if (error.message.includes('AI request timed out')) {
        userMessage = 'AI request took too long. Please try again.';
      } else if (error.message.includes('network')) {
        userMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('fallback')) {
        userMessage = 'Added with basic info (AI unavailable)';
      } else if (error.message.includes('Database validation failed')) {
        userMessage = 'Plant data validation failed. Please try again.';
        console.error('[DB] Validation error:', error.message);
      } else if (error.message.includes('sunlight_check') || error.message.includes('water_need_check')) {
        userMessage = 'Plant data format error. Database constraints not met.';
        console.error('[DB] Constraint violation error:', error);
      } else if (error.message.includes('22P02') || error.message.includes('invalid input syntax')) {
        userMessage = 'Data format error. Please try adding the plant again.';
        console.error('[DB] Data format error - likely pH conversion issue:', error);
      } else if (error.message.includes('23505')) {
        userMessage = 'Plant already exists in database.';
        console.error('[DB] Unique constraint violation - duplicate plant:', error);
      } else if (error.message.includes('Failed to save plant to database')) {
        userMessage = 'Database error. Please try again.';
      }
      
      setAddPlantError(userMessage);
    } finally {
      setIsAddingPlant(false);
    }
  };

  const plantColumns = [
    {
      key: 'name',
      label: 'Plant',
      width: 2,
      minWidth: 120,
      render: (value, item) => (
        <View className="flex-row items-center">
          <Text className="text-lg mr-2">{item.emoji}</Text>
          <Text className="font-semibold text-gray-800">{value}</Text>
        </View>
      )
    },
    { key: 'category', label: 'Category', width: 1.5, minWidth: 100 },
    { key: 'waterNeed', label: 'Water', width: 1.2, minWidth: 85 },
    { key: 'sunlight', label: 'Sunlight', width: 1.5, minWidth: 100 },
    { key: 'soilPh', label: 'Soil pH', width: 1.2, minWidth: 80 },
    {
      key: 'costPerAcre',
      label: 'Cost (₹/acre)',
      width: 1.5,
      minWidth: 110,
      render: (value) => (
        <Text className="font-semibold text-green-600">₹{value.toLocaleString('en-IN')}</Text>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 1.5,
      minWidth: 110,
      render: (value) => (
        <View className={`px-2 py-1 rounded-full ${
          value === 'Recommended' ? 'bg-green-100' :
          value === 'Popular' ? 'bg-blue-100' :
          value === 'High Yield' ? 'bg-purple-100' :
          value === 'High Profit' ? 'bg-yellow-100' :
          value === 'AI Generated' ? 'bg-cyan-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            value === 'Recommended' ? 'text-green-600' :
            value === 'Popular' ? 'text-blue-600' :
            value === 'High Yield' ? 'text-purple-600' :
            value === 'High Profit' ? 'text-yellow-600' :
            value === 'AI Generated' ? 'text-cyan-600' : 'text-gray-600'
          }`}>
            {value}
          </Text>
        </View>
      )
    },
  ];

  const stats = [
    { title: 'Total Crops', value: plantsData.length.toString(), icon: '🌱', color: 'from-green-500 to-emerald-600' },
    { title: 'Avg Cost/Acre', value: `₹${Math.round(plantsData.reduce((sum, p) => sum + p.costPerAcre, 0) / plantsData.length).toLocaleString('en-IN')}`, icon: '💰', color: 'from-blue-500 to-cyan-600' },
    { title: 'High Yield Crops', value: plantsData.filter(p => p.status === 'High Yield').length.toString(), icon: '📈', color: 'from-purple-500 to-pink-600' },
    { title: 'Vegetables', value: plantsData.filter(p => p.category === 'Vegetable').length.toString(), icon: '🥕', color: 'from-orange-500 to-red-600' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      <View style={{ padding: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#1E293B', marginBottom: 8 }}>
            🌱 Plant Database
          </Text>
          <Text style={{ fontSize: 16, color: '#64748B' }}>
            Comprehensive crop information and analytics
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#374151', marginBottom: 16 }}>
            Farm Overview
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {stats.map((stat, index) => (
              <View key={index} style={{ width: '48%' }}>
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={index % 4 === 0 ? 'forest' : index % 4 === 1 ? 'sky' : index % 4 === 2 ? 'sunset' : 'ocean'}
                  variant="solid"
                  size="medium"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Add Plant Section */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: '#374151' }}>
              Add New Plant
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#22C55E',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => setShowAddPlantModal(true)}
            >
              <Text style={{ color: 'white', fontWeight: '600', marginRight: 4 }}>+ Add Plant</Text>
            </TouchableOpacity>
          </View>

          {/* Add Plant Modal */}
          {showAddPlantModal && (
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4
            }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 16 }}>
                Add New Plant 🌱
              </Text>
              
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  marginBottom: 12
                }}
                placeholder="Enter plant name (e.g., Carrots, Spinach)"
                value={newPlantName}
                onChangeText={setNewPlantName}
                editable={!isAddingPlant}
              />

              {addPlantError ? (
                <Text style={{ color: '#EF4444', fontSize: 14, marginBottom: 12 }}>
                  {addPlantError}
                </Text>
              ) : null}

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#6B7280',
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    setShowAddPlantModal(false);
                    setNewPlantName('');
                    setAddPlantError('');
                  }}
                  disabled={isAddingPlant}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: isAddingPlant ? '#9CA3AF' : '#22C55E',
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center'
                  }}
                  onPress={addNewPlant}
                  disabled={isAddingPlant}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>
                    {isAddingPlant ? 'Adding...' : 'Add Plant'}
                  </Text>
                </TouchableOpacity>
              </View>

              {isAddingPlant && (
                <View style={{ marginTop: 16, padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8 }}>
                  <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                    {addPlantError || '🤖 Getting plant info from AI...'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Plants Table */}
        <View style={{ marginBottom: 32 }}>
          <DataTable
            title="Crop Database"
            data={plantsData}
            columns={plantColumns}
            searchable={true}
            sortable={true}
            maxHeight={400}
            emptyMessage="No plants found"
          />
        </View>

        {/* Plant Details */}
        {plantInfo && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4
          }}>
            <View className="flex-row items-center mb-6">
              <Text className="text-4xl mr-3">
                {mockPlantsData.find(p => p.name === plantInfo.name)?.emoji}
              </Text>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-800">{plantInfo.name}</Text>
                <Text className="text-gray-600">Detailed Growing Guide</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${
                mockPlantsData.find(p => p.name === plantInfo.name)?.status === 'Recommended' ? 'bg-green-100' :
                mockPlantsData.find(p => p.name === plantInfo.name)?.status === 'Popular' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Text className={`text-sm font-semibold ${
                  mockPlantsData.find(p => p.name === plantInfo.name)?.status === 'Recommended' ? 'text-green-600' :
                  mockPlantsData.find(p => p.name === plantInfo.name)?.status === 'Popular' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {mockPlantsData.find(p => p.name === plantInfo.name)?.status}
                </Text>
              </View>
            </View>

            <View className="grid grid-cols-2 gap-4 mb-6">
              <View className="bg-blue-50 p-4 rounded-xl">
                <Text className="text-2xl mb-2">💧</Text>
                <Text className="font-semibold text-gray-700">Water Needs</Text>
                <Text className="text-gray-600">{plantInfo.water_need}</Text>
              </View>

              <View className="bg-yellow-50 p-4 rounded-xl">
                <Text className="text-2xl mb-2">☀️</Text>
                <Text className="font-semibold text-gray-700">Sunlight</Text>
                <Text className="text-gray-600">{plantInfo.sunlight}</Text>
              </View>

              <View className="bg-green-50 p-4 rounded-xl">
                <Text className="text-2xl mb-2">🧪</Text>
                <Text className="font-semibold text-gray-700">Soil pH</Text>
                <Text className="text-gray-600">{plantInfo.soil_ph}</Text>
              </View>

              <View className="bg-purple-50 p-4 rounded-xl">
                <Text className="text-2xl mb-2">💰</Text>
                <Text className="font-semibold text-gray-700">Cost per Acre</Text>
                <Text className="text-lg font-bold text-green-600">₹{plantInfo.cost_per_acre?.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="font-semibold text-gray-700 mb-2">Additional Information</Text>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Growth Period:</Text>
                <Text className="font-semibold">{mockPlantsData.find(p => p.name === plantInfo.name)?.growthDays} days</Text>
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-gray-600">Expected Yield:</Text>
                <Text className="font-semibold">{mockPlantsData.find(p => p.name === plantInfo.name)?.yield}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}