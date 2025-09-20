// Enhanced Chat screen for farming questions with conversation history
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { askAI } from '../chatbot';
import { saveChatMessage } from '../database';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: 'Hello! I\'m PAWA_Paglu, your AI farming assistant. Ask me anything about crops, soil, weather, or farming techniques! 🌾',
      timestamp: new Date()
    }
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollViewRef = useRef();

  // Mock conversation history data
  const [conversationHistory] = useState([
    {
      id: 1,
      date: '2024-01-20',
      time: '10:30 AM',
      userMessage: 'How to improve tomato yield?',
      aiResponse: 'To improve tomato yield, ensure proper spacing (2-3 feet apart), provide consistent watering...',
      category: 'Crop Management',
      rating: 5
    },
    {
      id: 2,
      date: '2024-01-20',
      time: '09:15 AM',
      userMessage: 'Best time to plant wheat?',
      aiResponse: 'Wheat planting season varies by region. In temperate climates, plant in fall...',
      category: 'Planting',
      rating: 4
    },
    {
      id: 3,
      date: '2024-01-19',
      time: '03:45 PM',
      userMessage: 'Soil pH for rice cultivation?',
      aiResponse: 'Rice grows best in soil with pH between 5.5-6.5. Test your soil pH...',
      category: 'Soil Management',
      rating: 5
    },
    {
      id: 4,
      date: '2024-01-19',
      time: '11:20 AM',
      userMessage: 'How to control pests in corn?',
      aiResponse: 'Integrated pest management includes crop rotation, beneficial insects...',
      category: 'Pest Control',
      rating: 4
    },
  ]);

  // Send question to AI
  const sendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = question;
    setQuestion('');
    setLoading(true);

    // Add user message
    const newUserMessage = { type: 'user', text: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMessage]);

    // Scroll to bottom
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Get AI response
    const aiResponse = await askAI(userMessage);

    // Add AI response
    const newAIMessage = { type: 'ai', text: aiResponse, timestamp: new Date() };
    setMessages(prev => [...prev, newAIMessage]);

    // Save to database
    await saveChatMessage(1, userMessage, aiResponse);
    setLoading(false);

    // Scroll to bottom again
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStats = () => {
    const userMessages = messages.filter(m => m.type === 'user').length;
    const aiMessages = messages.filter(m => m.type === 'ai').length;
    const totalConversations = conversationHistory.length;
    const avgRating = conversationHistory.reduce((sum, conv) => sum + conv.rating, 0) / conversationHistory.length;

    return { userMessages, aiMessages, totalConversations, avgRating };
  };

  const stats = getMessageStats();

  const historyColumns = [
    {
      key: 'date',
      label: 'Date',
      width: 1.5,
      render: (value, item) => (
        <View>
          <Text className="font-semibold text-gray-800">{value}</Text>
          <Text className="text-xs text-gray-500">{item.time}</Text>
        </View>
      )
    },
    {
      key: 'userMessage',
      label: 'Question',
      width: 3,
      render: (value) => (
        <Text className="text-sm text-gray-700" numberOfLines={2}>
          {value.length > 50 ? value.substring(0, 50) + '...' : value}
        </Text>
      )
    },
    {
      key: 'category',
      label: 'Category',
      width: 2,
      render: (value) => (
        <View className={`px-2 py-1 rounded-full ${
          value === 'Crop Management' ? 'bg-green-100' :
          value === 'Planting' ? 'bg-blue-100' :
          value === 'Soil Management' ? 'bg-brown-100' :
          value === 'Pest Control' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            value === 'Crop Management' ? 'text-green-600' :
            value === 'Planting' ? 'text-blue-600' :
            value === 'Soil Management' ? 'text-brown-600' :
            value === 'Pest Control' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {value}
          </Text>
        </View>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      width: 1,
      render: (value) => (
        <View className="flex-row">
          {[...Array(5)].map((_, i) => (
            <Text key={i} className={`text-sm ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </Text>
          ))}
        </View>
      )
    },
  ];

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header with Stats */}
      <View className="bg-white shadow-sm px-6 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-gray-800">🤖 PAWA_Paglu</Text>
            <Text className="text-gray-600">Your AI Farming Assistant</Text>
          </View>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${showHistory ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => setShowHistory(!showHistory)}
          >
            <Text className={`font-semibold ${showHistory ? 'text-white' : 'text-gray-700'}`}>
              {showHistory ? 'Chat' : 'History'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between">
          <StatCard
            title="Messages"
            value={stats.userMessages.toString()}
            icon="💬"
            color="from-blue-500 to-cyan-600"
            subtitle="This session"
          />
          <StatCard
            title="Conversations"
            value={stats.totalConversations.toString()}
            icon="📚"
            color="from-green-500 to-emerald-600"
            subtitle="Total history"
          />
          <StatCard
            title="Avg Rating"
            value={stats.avgRating.toFixed(1)}
            icon="⭐"
            color="from-yellow-500 to-orange-600"
            subtitle="Out of 5"
          />
        </View>
      </View>

      {showHistory ? (
        /* Conversation History */
        <View className="flex-1 p-6">
          <DataTable
            title="Conversation History"
            data={conversationHistory}
            columns={historyColumns}
            searchable={true}
            sortable={true}
            maxHeight={500}
            emptyMessage="No conversation history available"
          />
        </View>
      ) : (
        /* Chat Interface */
        <>
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg, index) => (
              <View key={index} className={`mb-4 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <View className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 rounded-br-md'
                    : 'bg-white rounded-bl-md border border-gray-100'
                }`}>
                  <Text className={`text-base leading-5 ${
                    msg.type === 'user' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {msg.text}
                  </Text>
                  <Text className={`text-xs mt-2 ${
                    msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
              </View>
            ))}

            {loading && (
              <View className="items-start mb-4">
                <View className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-md border border-gray-100">
                  <View className="flex-row items-center">
                    <Text className="text-gray-600 mr-2">PAWA_Paglu is thinking</Text>
                    <View className="flex-row">
                      <View className="w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse"></View>
                      <View className="w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse" style={{ animationDelay: '0.2s' }}></View>
                      <View className="w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse" style={{ animationDelay: '0.4s' }}></View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View className="bg-white border-t border-gray-200 px-4 py-3">
            <View className="flex-row items-end bg-gray-50 rounded-2xl px-4 py-2">
              <TextInput
                className="flex-1 text-base text-gray-800 mr-3 max-h-20"
                placeholder="Ask about farming, crops, soil..."
                placeholderTextColor="#9CA3AF"
                value={question}
                onChangeText={setQuestion}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                className={`w-10 h-10 rounded-full items-center justify-center shadow-md ${
                  question.trim() && !loading
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-gray-300'
                }`}
                onPress={sendMessage}
                disabled={!question.trim() || loading}
              >
                <Text className="text-white text-lg font-bold">↑</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}