"use client"

import { useState, useContext } from "react"
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { TextInput, Button, Text, Title, Paragraph, RadioButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../../context/AuthContext"
import { theme } from "../../theme"

export default function RegisterScreen() {
  const navigation = useNavigation()
  const { signUp } = useContext(AuthContext)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"user" | "provider" | "merchant">("user")
  const [isLoading, setIsLoading] = useState(false)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true)

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      await signUp(name, email, password, role as "user" | "provider" | "merchant")
      // No navegamos manualmente, dejamos que MainNavigator maneje la redirección
    } catch (err: any) {
      Alert.alert("Error", err.message || "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  const goToLogin = () => {
    navigation.navigate("Login" as never)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Title style={styles.title}>Crear cuenta</Title>
            <Paragraph style={styles.subtitle}>Únete a nuestra comunidad</Paragraph>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Nombre completo"
              value={name}
              onChangeText={setName}
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />

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

            <TextInput
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirmEntry}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={secureConfirmEntry ? "eye" : "eye-off"}
                  onPress={() => setSecureConfirmEntry(!secureConfirmEntry)}
                />
              }
              left={<TextInput.Icon icon="lock-check" />}
            />

            <View style={styles.roleContainer}>
              <Text style={styles.roleTitle}>Tipo de cuenta:</Text>
              <RadioButton.Group onValueChange={(value) => setRole(value as "user" | "provider" | "merchant")} value={role}>
                <View style={styles.radioOption}>
                  <RadioButton value="user" />
                  <Text style={styles.radioLabel}>Usuario - Buscar servicios</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="provider" />
                  <Text style={styles.radioLabel}>Proveedor - Ofrecer servicios</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="merchant" />
                  <Text style={styles.radioLabel}>Comerciante - Gestionar comercios</Text>
                </View>
              </RadioButton.Group>
            </View>

            <Button
              mode="contained"
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
            >
              Crear cuenta
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ¿Ya tienes una cuenta?{" "}
              <Text style={styles.loginLink} onPress={goToLogin}>
                Inicia sesión
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
  roleContainer: {
    marginBottom: 24,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 8,
  },
  registerButton: {
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
  loginLink: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
})
