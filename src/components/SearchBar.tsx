import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Searchbar } from "react-native-paper"
import { theme } from "../theme"

interface SearchBarProps {
  onPress: () => void
  placeholder?: string
}

export default function SearchBar({ onPress, placeholder = "¿Qué servicio necesitas?" }: SearchBarProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View pointerEvents="none">
        <Searchbar
          placeholder={placeholder}
          style={styles.searchbar}
          inputStyle={styles.input}
          iconColor={theme.colors.placeholder}
          placeholderTextColor={theme.colors.placeholder}
          editable={false}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchbar: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    elevation: 1,
  },
  input: {
    fontSize: 14,
  },
})
