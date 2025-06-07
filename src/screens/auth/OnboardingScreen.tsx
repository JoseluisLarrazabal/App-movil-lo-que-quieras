import { StyleSheet, View, Dimensions } from "react-native"
import { Button, Text, Title, Paragraph } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

export default function OnboardingScreen() {
  const navigation = useNavigation()

  const goToLogin = () => {
    navigation.navigate("Login" as never)
  }

  const goToRegister = () => {
    navigation.navigate("Register" as never)
  }

  return (
    <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>LQ</Text>
            </View>
            <Title style={styles.appName}>Lo Que Quieras!</Title>
            <Paragraph style={styles.tagline}>Tu marketplace de servicios</Paragraph>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureText}>Encuentra servicios cerca de ti</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💼</Text>
              <Text style={styles.featureText}>Ofrece tus habilidades</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💳</Text>
              <Text style={styles.featureText}>Paga de forma segura</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={[styles.button, styles.primaryButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={goToRegister}
            >
              Crear cuenta
            </Button>
            <Button
              mode="outlined"
              style={[styles.button, styles.secondaryButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.secondaryButtonLabel}
              onPress={goToLogin}
            >
              Iniciar sesión
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  featuresContainer: {
    marginVertical: 40,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: "white",
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 12,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: "white",
  },
  secondaryButton: {
    borderColor: "white",
    borderWidth: 2,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
})
