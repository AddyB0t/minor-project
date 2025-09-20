// Enhanced Chat component for farming questions
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { askAI } from '../chatbot';
import { saveChatMessage } from '../database';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: 'Hello! I\'m PAWA_Paglu, your AI farming assistant. Ask me anything about crops, soil, weather, or farming techniques! 🌾',
      timestamp: new Date()
    }
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

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

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 shadow-lg">
        <View className="flex-row items-center">
          <Text className="text-3xl mr-3">🤖</Text>
          <View>
            <Text className="text-white text-xl font-bold">PAWA_Paglu</Text>
            <Text className="text-blue-100">AI Farming Assistant</Text>
          </View>
        </View>
      </View>

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
            </View>
            <Text className="text-xs text-gray-500 mt-1 px-2">
              {formatTime(msg.timestamp)}
            </Text>
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
    </KeyboardAvoidingView>
  );
}