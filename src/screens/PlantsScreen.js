// Plants screen for plant database - Dark Theme
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getPlantInfo, addPlantInfo, getAllPlants } from '../database';
import { getPlantInfoFromAI } from '../chatbot';
import DataTable from '../components/table/DataTable';

// Shadcn dark theme colors
const colors = {
  background: '#09090B',
  card: '#18181B',
  cardHover: '#27272A',
  border: '#27272A',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  textDim: '#71717A',
  primary: '#22C55E',
  accent: '#3B82F6',
  warning: '#F59E0B',
  error: '#EF4444',
};

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
    { name: 'Tomato', emoji: '🍅', category: 'Vegetable', waterNeed: 'high', sunlight: 'high', soilPh: 6.4, costPerAcre: 207500, growthDays: 75, yield: '25-30 tons/acre', status: 'Recommended' },
    { name: 'Wheat', emoji: '🌾', category: 'Grain', waterNeed: 'medium', sunlight: 'high', soilPh: 6.5, costPerAcre: 149400, growthDays: 120, yield: '3-4 tons/acre', status: 'Popular' },
    { name: 'Rice', emoji: '🌾', category: 'Grain', waterNeed: 'high', sunlight: 'high', soilPh: 6.0, costPerAcre: 182600, growthDays: 150, yield: '4-5 tons/acre', status: 'High Yield' },
    { name: 'Corn', emoji: '🌽', category: 'Grain', waterNeed: 'high', sunlight: 'high', soilPh: 6.5, costPerAcre: 166000, growthDays: 90, yield: '6-8 tons/acre', status: 'Recommended' },
    { name: 'Potato', emoji: '🥔', category: 'Vegetable', waterNeed: 'medium', sunlight: 'medium', soilPh: 5.5, costPerAcre: 232400, growthDays: 80, yield: '20-25 tons/acre', status: 'Popular' },
    { name: 'Sugarcane', emoji: '🎋', category: 'Cash Crop', waterNeed: 'high', sunlight: 'high', soilPh: 7.0, costPerAcre: 290500, growthDays: 365, yield: '80-100 tons/acre', status: 'High Profit' },
    { name: 'Cotton', emoji: '🌿', category: 'Fiber', waterNeed: 'medium', sunlight: 'high', soilPh: 6.5, costPerAcre: 249000, growthDays: 180, yield: '8-10 quintals/acre', status: 'Industrial' },
    { name: 'Soybean', emoji: '🫘', category: 'Oilseed', waterNeed: 'medium', sunlight: 'high', soilPh: 6.5, costPerAcre: 157700, growthDays: 100, yield: '2-3 tons/acre', status: 'Recommended' }
  ];

  useEffect(() => {
    const loadCombinedPlants = async () => {
      const combinedPlants = [...mockPlantsData];
      const realPlants = await getAllPlants();
      if (realPlants && realPlants.length > 0) {
        const existingNames = mockPlantsData.map(p => p.name.toLowerCase());
        const newPlants = realPlants.filter(p => !existingNames.includes(p.name.toLowerCase())).map(dbPlant => ({
          name: dbPlant.name,
          emoji: '🌱',
          category: 'Added by AI',
          waterNeed: dbPlant.water_need,
          sunlight: dbPlant.sunlight,
          soilPh: dbPlant.soil_ph,
          costPerAcre: dbPlant.cost_per_acre,
          growthDays: 0,
          yield: 'Unknown',
          status: 'AI Generated'
        }));
        combinedPlants.push(...newPlants);
      }
      setPlantsData(combinedPlants);
    };
    loadCombinedPlants();
  }, []);

  const addNewPlant = async () => {
    if (!newPlantName.trim()) {
      setAddPlantError('Please enter a plant name');
      return;
    }

    setIsAddingPlant(true);
    setAddPlantError('');

    try {
      setAddPlantError('Getting plant info from AI...');
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI request timed out')), 30000));
      const aiPlantData = await Promise.race([getPlantInfoFromAI(newPlantName.trim()), timeoutPromise]);

      if (!aiPlantData) throw new Error('AI returned no data');

      setAddPlantError('Saving to database...');
      const plantDataForDB = {
        name: newPlantName.trim(),
        water_need: aiPlantData.water_need,
        sunlight: aiPlantData.sunlight,
        soil_ph: typeof aiPlantData.soil_ph === 'number' ? aiPlantData.soil_ph : 6.5,
        cost_per_acre: aiPlantData.cost_per_acre
      };

      const savedPlant = await addPlantInfo(plantDataForDB);
      if (!savedPlant) throw new Error('Failed to save plant');

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
      setNewPlantName('');
      setShowAddPlantModal(false);
      Alert.alert('Success!', `${newPlantName.trim()} added successfully!`);
    } catch (error) {
      console.error('[Plant Addition] Error:', error);
      setAddPlantError(error.message || 'Failed to add plant');
    } finally {
      setIsAddingPlant(false);
    }
  };

  const plantColumns = [
    {
      key: 'name',
      label: 'Plant',
      width: 2,
      minWidth: 110,
      render: (value, item) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>{item.emoji}</Text>
          <Text style={{ fontWeight: '600', color: colors.text }}>{value}</Text>
        </View>
      )
    },
    { key: 'category', label: 'Category', width: 1.3, minWidth: 90 },
    { key: 'waterNeed', label: 'Water', width: 1, minWidth: 70 },
    { key: 'sunlight', label: 'Sun', width: 1, minWidth: 70 },
    {
      key: 'costPerAcre',
      label: 'Cost/Acre',
      width: 1.3,
      minWidth: 100,
      render: (value) => (
        <Text style={{ fontWeight: '600', color: colors.primary }}>₹{value.toLocaleString('en-IN')}</Text>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 1.3,
      minWidth: 100,
      render: (value) => (
        <View style={{
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
          backgroundColor: value === 'Recommended' ? 'rgba(34, 197, 94, 0.15)' :
                          value === 'Popular' ? 'rgba(59, 130, 246, 0.15)' :
                          value === 'High Yield' ? 'rgba(168, 85, 247, 0.15)' :
                          value === 'High Profit' ? 'rgba(245, 158, 11, 0.15)' :
                          value === 'AI Generated' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(113, 113, 122, 0.15)'
        }}>
          <Text style={{
            fontSize: 11,
            fontWeight: '600',
            textAlign: 'center',
            color: value === 'Recommended' ? '#4ADE80' :
                   value === 'Popular' ? '#60A5FA' :
                   value === 'High Yield' ? '#C084FC' :
                   value === 'High Profit' ? '#FBBF24' :
                   value === 'AI Generated' ? '#22D3EE' : colors.textMuted
          }}>
            {value}
          </Text>
        </View>
      )
    },
  ];

  const stats = [
    { title: 'Total Crops', value: plantsData.length.toString(), icon: '🌱' },
    { title: 'Avg Cost/Acre', value: `₹${Math.round(plantsData.reduce((sum, p) => sum + p.costPerAcre, 0) / plantsData.length).toLocaleString('en-IN')}`, icon: '💰' },
    { title: 'High Yield', value: plantsData.filter(p => p.status === 'High Yield').length.toString(), icon: '📈' },
    { title: 'Vegetables', value: plantsData.filter(p => p.category === 'Vegetable').length.toString(), icon: '🥕' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          {/* Header */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: 6 }}>
              Plant Database
            </Text>
            <Text style={{ fontSize: 14, color: colors.textMuted }}>
              Comprehensive crop information and analytics
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 14 }}>
              Farm Overview
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {stats.map((stat, index) => (
                <View
                  key={index}
                  style={{
                    width: '48%',
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{stat.value}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{stat.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Add Plant Section */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                Add New Plant
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                onPress={() => setShowAddPlantModal(true)}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>+ Add Plant</Text>
              </TouchableOpacity>
            </View>

            {/* Add Plant Modal */}
            {showAddPlantModal && (
              <View style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
                <Text style={{ fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
                  Add New Plant
                </Text>

                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: colors.text,
                    backgroundColor: colors.background,
                    marginBottom: 12,
                  }}
                  placeholder="Enter plant name (e.g., Carrots)"
                  placeholderTextColor={colors.textDim}
                  value={newPlantName}
                  onChangeText={setNewPlantName}
                  editable={!isAddingPlant}
                />

                {addPlantError ? (
                  <Text style={{ color: isAddingPlant ? colors.primary : colors.error, fontSize: 13, marginBottom: 12 }}>
                    {addPlantError}
                  </Text>
                ) : null}

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: colors.cardHover,
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setShowAddPlantModal(false);
                      setNewPlantName('');
                      setAddPlantError('');
                    }}
                    disabled={isAddingPlant}
                  >
                    <Text style={{ color: colors.text, fontWeight: '600' }}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: isAddingPlant ? colors.cardHover : colors.primary,
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                    onPress={addNewPlant}
                    disabled={isAddingPlant}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                      {isAddingPlant ? 'Adding...' : 'Add Plant'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Plants Table */}
          <View style={{ marginBottom: 24 }}>
            <DataTable
              title="Crop Database"
              data={plantsData}
              columns={plantColumns}
              searchable={true}
              sortable={false}
              pagination={false}
              maxHeight={400}
              variant="dark"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
