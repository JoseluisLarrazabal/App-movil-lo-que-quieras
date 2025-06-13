import { useState, useRef, useEffect } from "react"
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { TextInput, IconButton, Avatar, Text, Surface } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"

interface Message {
  id: string
  text: string
  senderId: string
  timestamp: Date
  isRead: boolean
}

interface ChatParams {
  providerId: string
  providerName: string
  providerAvatar: string
}

export default function ChatScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const params = route.params as ChatParams
  const scrollViewRef = useRef<ScrollView>(null)

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! ¿Cómo puedo ayudarte?",
      senderId: params.providerId,
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
    },
    {
      id: "2",
      text: "Hola, me gustaría reservar un servicio",
      senderId: "currentUser",
      timestamp: new Date(Date.now() - 3500000),
      isRead: true,
    },
    {
      id: "3",
      text: "Por supuesto, ¿qué servicio te interesa?",
      senderId: params.providerId,
      timestamp: new Date(Date.now() - 3400000),
      isRead: true,
    },
  ])

  useEffect(() => {
    navigation.setOptions({
      title: params.providerName,
      headerRight: () => (
        <Avatar.Image
          size={40}
          source={{ uri: params.providerAvatar }}
          style={styles.headerAvatar}
        />
      ),
    })
  }, [navigation, params])

  const handleSendMessage = () => {
    if (message.trim() === "") return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      senderId: "currentUser",
      timestamp: new Date(),
      isRead: false,
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simular respuesta del proveedor
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Gracias por tu mensaje. Te responderé lo antes posible.",
        senderId: params.providerId,
        timestamp: new Date(),
        isRead: false,
      }
      setMessages(prev => [...prev, responseMessage])
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageContainer,
                msg.senderId === "currentUser" ? styles.sentMessage : styles.receivedMessage,
              ]}
            >
              <Surface style={styles.messageBubble}>
                <Text style={styles.messageText}>{msg.text}</Text>
                <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
              </Surface>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            value={message}
            onChangeText={setMessage}
            placeholder="Escribe un mensaje..."
            style={styles.input}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSendMessage}
                disabled={message.trim() === ""}
              />
            }
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
  keyboardAvoidingView: {
    flex: 1,
  },
  headerAvatar: {
    marginRight: 16,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: theme.colors.placeholder,
    alignSelf: "flex-end",
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
    backgroundColor: theme.colors.surface,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
}) 