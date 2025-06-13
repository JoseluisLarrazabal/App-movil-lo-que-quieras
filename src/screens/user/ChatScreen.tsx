"use client"

import { useState, useRef, useEffect } from "react"
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Text, TextInput, Avatar, Card, Appbar, Chip } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"

interface Message {
  id: string
  text: string
  sender: "user" | "provider"
  timestamp: Date
  type?: "text" | "image" | "service"
}

export default function ChatScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { providerId, providerName } = route.params as { providerId: string; providerName: string }

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Vi que estás interesado en mi servicio de limpieza. ¿En qué puedo ayudarte?",
      sender: "provider",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      text: "Hola María! Sí, necesito una limpieza profunda para mi apartamento de 2 habitaciones.",
      sender: "user",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "3",
      text: "Perfecto! ¿Cuándo te gustaría programar el servicio? Tengo disponibilidad esta semana.",
      sender: "provider",
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: "4",
      text: "¿Qué tal el viernes por la mañana?",
      sender: "user",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: "5",
      text: "El viernes me viene perfecto. ¿A las 9:00 AM te parece bien?",
      sender: "provider",
      timestamp: new Date(Date.now() - 60000),
    },
  ])

  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])
      setMessage("")

      // Simulate provider response
      setTimeout(() => {
        const responses = [
          "¡Perfecto! Te confirmo la cita.",
          "Gracias por contactarme. Te responderé pronto.",
          "Entendido. ¿Hay algo más que necesites saber?",
          "Excelente. Nos vemos entonces.",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const providerResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: "provider",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, providerResponse])
      }, 1000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user"

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.providerMessage]}>
        {!isUser && (
          <Avatar.Image
            size={32}
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.avatar}
          />
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.providerBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.providerText]}>{item.text}</Text>
          <Text style={[styles.messageTime, isUser ? styles.userTime : styles.providerTime]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Avatar.Image
          size={32}
          source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
          style={styles.headerAvatar}
        />
        <Appbar.Content title={providerName} subtitle="En línea" />
        <Appbar.Action icon="phone" onPress={() => {}} />
        <Appbar.Action icon="video" onPress={() => {}} />
      </Appbar.Header>

      {/* Service Info Card */}
      <Card style={styles.serviceCard}>
        <Card.Content style={styles.serviceContent}>
          <Text style={styles.serviceTitle}>Limpieza profunda de hogar</Text>
          <View style={styles.serviceInfo}>
            <Chip style={styles.priceChip}>$850</Chip>
            <Chip style={styles.durationChip}>2-3 horas</Chip>
          </View>
        </Card.Content>
      </Card>

      <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Escribe un mensaje..."
            style={styles.textInput}
            multiline
            maxLength={500}
            right={
              <TextInput.Icon
                icon="send"
                onPress={sendMessage}
                disabled={!message.trim()}
              />
            }
            left={<TextInput.Icon icon="attachment" onPress={() => {}} />}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerAvatar: {
    marginLeft: 8,
  },
  serviceCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  serviceContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  serviceInfo: {
    flexDirection: "row",
    gap: 8,
  },
  priceChip: {
    backgroundColor: theme.colors.primary,
    height: 28,
  },
  durationChip: {
    backgroundColor: theme.colors.surface,
    height: 28,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "flex-end",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  providerMessage: {
    justifyContent: "flex-start",
  },
  avatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  providerBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: "white",
  },
  providerText: {
    color: theme.colors.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  providerTime: {
    color: theme.colors.placeholder,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 16,
  },
})
