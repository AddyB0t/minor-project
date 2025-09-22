// Modern Chat screen for farming questions
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { askAI } from '../chatbot';
import { saveChatMessage } from '../database';
import { EnvironmentColors } from '../design-system/Colors';
import { Typography } from '../design-system/Typography';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: 'Hello! I\'m AgroAssist AI, your intelligent farming assistant. Ask me anything about crops, soil, weather, or farming techniques! 🌾',
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
    await saveChatMessage("demo-user", userMessage, aiResponse);
    setLoading(false);

    // Scroll to bottom again
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: EnvironmentColors.background.secondary }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Modern Header */}
      <View
        style={{
          backgroundColor: EnvironmentColors.primary[500],
          paddingHorizontal: 24,
          paddingVertical: 16,
          paddingTop: Platform.OS === 'ios' ? 60 : 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[Typography.styles.h2, { color: EnvironmentColors.background.primary, fontWeight: '700' }]}>
              🤖 AgroAssist AI
            </Text>
            <Text style={[Typography.styles.body, { color: EnvironmentColors.background.primary, opacity: 0.9 }]}>
              Your Intelligent Farming Assistant
            </Text>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: EnvironmentColors.background.secondary }}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View key={index} style={{
            marginBottom: 16,
            alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {msg.type === 'user' ? (
              <View
                style={{
                  maxWidth: '80%',
                  backgroundColor: EnvironmentColors.primary[500],
                  borderRadius: 20,
                  borderBottomRightRadius: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2
                }}
              >
                <Text style={[Typography.styles.body, { color: EnvironmentColors.background.primary, lineHeight: 20 }]}>
                  {msg.text}
                </Text>
                <Text style={[Typography.styles.caption, { color: EnvironmentColors.background.primary, opacity: 0.8, marginTop: 4 }]}>
                  {formatTime(msg.timestamp)}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  maxWidth: '80%',
                  backgroundColor: EnvironmentColors.background.primary,
                  borderRadius: 20,
                  borderBottomLeftRadius: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: EnvironmentColors.neutral[200],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1
                }}
              >
                <Text style={[Typography.styles.body, { color: EnvironmentColors.neutral[800], lineHeight: 20 }]}>
                  {msg.text}
                </Text>
                <Text style={[Typography.styles.caption, { color: EnvironmentColors.neutral[500], marginTop: 4 }]}>
                  {formatTime(msg.timestamp)}
                </Text>
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
            <View
              style={{
                backgroundColor: EnvironmentColors.background.primary,
                borderRadius: 20,
                borderBottomLeftRadius: 6,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: EnvironmentColors.neutral[200],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[Typography.styles.body, { color: EnvironmentColors.primary[600], marginRight: 8 }]}>
                  AgroAssist AI is thinking
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <View 
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      marginHorizontal: 2,
                      backgroundColor: EnvironmentColors.primary[600],
                      opacity: 0.7
                    }}
                  />
                  <View 
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      marginHorizontal: 2,
                      backgroundColor: EnvironmentColors.primary[600],
                      opacity: 0.5
                    }}
                  />
                  <View 
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      marginHorizontal: 2,
                      backgroundColor: EnvironmentColors.primary[600],
                      opacity: 0.3
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modern Input Area */}
      <View 
        style={{
          backgroundColor: EnvironmentColors.background.primary,
          borderTopWidth: 1,
          borderTopColor: EnvironmentColors.neutral[200],
          paddingHorizontal: 16,
          paddingVertical: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 8
        }}
      >
        <View 
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            backgroundColor: EnvironmentColors.neutral[50],
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: EnvironmentColors.neutral[200],
          }}
        >
          <TextInput
            style={[
              Typography.styles.body,
              {
                flex: 1,
                color: EnvironmentColors.neutral[800],
                marginRight: 12,
                maxHeight: 80,
                paddingVertical: 8,
              }
            ]}
            placeholder="Ask about farming, crops, soil..."
            placeholderTextColor={EnvironmentColors.neutral[500]}
            value={question}
            onChangeText={setQuestion}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!question.trim() || loading}
            style={{
              backgroundColor: question.trim() && !loading 
                ? EnvironmentColors.primary[500] 
                : EnvironmentColors.neutral[300],
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: question.trim() && !loading ? 0.2 : 0,
              shadowRadius: 2,
              elevation: question.trim() && !loading ? 2 : 0
            }}
          >
            <Text style={{ 
              color: EnvironmentColors.background.primary, 
              fontSize: 18, 
              fontWeight: 'bold',
              marginTop: -2
            }}>
              ↑
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}