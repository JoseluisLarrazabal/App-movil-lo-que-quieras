import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider as PaperProvider } from "react-native-paper"
import { Provider as ReduxProvider } from "react-redux"
import { store } from "./src/redux/store"
import { AuthProvider } from "./src/context/AuthContext"
import { theme } from "./src/theme"
import MainNavigator from "./src/navigation/MainNavigator"
import { StatusBar } from "expo-status-bar"
import { LogBox } from "react-native"

// Ignorar advertencias específicas que no afectan la funcionalidad
LogBox.ignoreLogs([
  "TurboModuleRegistry",
  "PlatformConstants",
  "Invariant Violation",
  "Require cycle:",
  "ViewPropTypes",
  "Warning: componentWillReceiveProps",
  "Warning: componentWillMount",
  "Constants.platform.ios.model has been deprecated",
  "new NativeEventEmitter",
])

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AuthProvider>
              <StatusBar style="light" backgroundColor={theme.colors.primary} />
              <MainNavigator />
            </AuthProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  )
}
