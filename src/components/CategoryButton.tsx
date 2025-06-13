import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"
import { theme } from "../theme"
import type { Category } from "../redux/slices/categoriesSlice"

const iconMap: Record<string, string> = {
  broom: "🧹",
  wrench: "🔧",
  "lightning-bolt": "⚡",
  hammer: "🔨",
  tree: "🌱",
  brush: "🎨",
  car: "🚗",
  laptop: "💻",
  heart: "❤️",
  school: "🏫",
}

interface CategoryButtonProps {
  category: Category
  onPress: () => void
}

export default function CategoryButton({ category, onPress }: CategoryButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <Text style={styles.icon}>{iconMap[category.icon] || "❓"}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {category.name}
      </Text>
      <Text style={styles.count}>{category.serviceCount || 0} servicios</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 16,
    width: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 14,
  },
  count: {
    fontSize: 10,
    color: theme.colors.placeholder,
    textAlign: "center",
  },
})
