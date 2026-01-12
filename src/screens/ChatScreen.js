// Modern Chat screen for farming questions - Dark Theme
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { askAI } from '../chatbot';
// Database is optional - chat works without it

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
  primaryDark: '#16A34A',
  userBubble: '#22C55E',
  aiBubble: '#27272A',
};

// Typewriter component for waterfall text effect
const TypewriterText = ({ text, onComplete, style }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    let index = 0;
    setDisplayedText('');
    setIsComplete(false);

    // Type word by word for smoother effect
    const words = text.split(' ');
    let currentText = '';

    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? '' : ' ') + words[index];
        setDisplayedText(currentText);
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete && onComplete();
      }
    }, 50); // 50ms per word for smooth waterfall effect

    return () => clearInterval(interval);
  }, [text]);

  return (
    <Text style={style}>
      {displayedText}
      {!isComplete && <Text style={{ opacity: 0.5 }}>|</Text>}
    </Text>
  );
};

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: 'Hello! I\'m AgroAssist AI, your intelligent farming assistant. Ask me anything about crops, soil, weather, or farming techniques!',
      timestamp: new Date(),
      isTyping: false // Already displayed, no animation
    }
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState(-1); // Track which message is typing
  const scrollViewRef = useRef();

  // Auto-scroll during typing
  useEffect(() => {
    if (typingIndex >= 0) {
      const scrollInterval = setInterval(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearInterval(scrollInterval);
    }
  }, [typingIndex]);

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

    // Add AI response with typing animation
    const newAIMessage = { type: 'ai', text: aiResponse, timestamp: new Date(), isTyping: true };
    setMessages(prev => {
      const newMessages = [...prev, newAIMessage];
      setTypingIndex(newMessages.length - 1); // Set typing index to this message
      return newMessages;
    });
    setLoading(false);

    // Scroll to bottom again
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // Handle typing complete
  const handleTypingComplete = (index) => {
    setMessages(prev => prev.map((msg, i) =>
      i === index ? { ...msg, isTyping: false } : msg
    ));
    setTypingIndex(-1);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.card,
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              AgroAssist AI
            </Text>
            <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
              Your Intelligent Farming Assistant
            </Text>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, backgroundColor: colors.background }}
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
                    backgroundColor: colors.primary,
                    borderRadius: 16,
                    borderBottomRightRadius: 4,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 15, lineHeight: 22 }}>
                    {msg.text}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 6 }}>
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    maxWidth: '80%',
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    borderBottomLeftRadius: 4,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  {msg.isTyping ? (
                    <TypewriterText
                      text={msg.text}
                      onComplete={() => handleTypingComplete(index)}
                      style={{ color: colors.text, fontSize: 15, lineHeight: 22 }}
                    />
                  ) : (
                    <Text style={{ color: colors.text, fontSize: 15, lineHeight: 22 }}>
                      {msg.text}
                    </Text>
                  )}
                  {!msg.isTyping && (
                    <Text style={{ color: colors.textDim, fontSize: 11, marginTop: 6 }}>
                      {formatTime(msg.timestamp)}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}

          {loading && (
            <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  borderBottomLeftRadius: 4,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: colors.primary, fontSize: 14, marginRight: 8 }}>
                    Thinking
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, marginHorizontal: 2, backgroundColor: colors.primary, opacity: 0.8 }} />
                    <View style={{ width: 6, height: 6, borderRadius: 3, marginHorizontal: 2, backgroundColor: colors.primary, opacity: 0.5 }} />
                    <View style={{ width: 6, height: 6, borderRadius: 3, marginHorizontal: 2, backgroundColor: colors.primary, opacity: 0.3 }} />
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View
          style={{
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              backgroundColor: colors.background,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                color: colors.text,
                fontSize: 15,
                marginRight: 12,
                maxHeight: 100,
                paddingVertical: 8,
              }}
              placeholder="Ask about farming, crops, soil..."
              placeholderTextColor={colors.textDim}
              value={question}
              onChangeText={setQuestion}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!question.trim() || loading || typingIndex >= 0}
              style={{
                backgroundColor: question.trim() && !loading && typingIndex < 0 ? colors.primary : colors.cardHover,
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>
                ↑
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
