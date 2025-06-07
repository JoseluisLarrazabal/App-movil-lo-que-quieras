"use client"

import { useState, useContext } from "react"
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { TextInput, Button, Text, Title, Paragraph } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../../context/AuthContext"
import { theme } from "../../theme"

export default function LoginScreen() {
  const navigation = useNavigation()
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña")
      return
    }

    setIsLoading(true)

    try {
      await signIn(email, password)
    } catch (err: any) {
      Alert.alert("Error", err.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const goToRegister = () => {
    navigation.navigate("Register" as never)
  }

  const showTestCredentials = () => {
    Alert.alert(
      "Credenciales de prueba",
      "Usuario: user@test.com\nProveedor: provider@test.com\nAdmin: admin@test.com\n\nContraseña: cualquiera",
      [{ text: "OK" }],
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Title style={styles.title}>¡Bienvenido de vuelta!</Title>
            <Paragraph style={styles.subtitle}>Inicia sesión para continuar</Paragraph>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? "eye" : "eye-off"}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              left={<TextInput.Icon icon="lock" />}
            />

            <Button mode="text" style={styles.testButton} onPress={showTestCredentials}>
              Ver credenciales de prueba
            </Button>

            <Button
              mode="contained"
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
            >
              Iniciar sesión
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ¿No tienes una cuenta?{" "}
              <Text style={styles.registerLink} onPress={goToRegister}>
                Regístrate
              </Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  testButton: {
    alignSelf: "center",
    marginBottom: 24,
  },
  loginButton: {
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonContent: {
    height: 50,
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 16,
    color: theme.colors.placeholder,
  },
  registerLink: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
})
