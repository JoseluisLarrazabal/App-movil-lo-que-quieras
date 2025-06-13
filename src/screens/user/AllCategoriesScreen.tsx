import React from "react"
import { StyleSheet, View, FlatList } from "react-native"
import { useSelector } from "react-redux"
import { useNavigation } from "@react-navigation/native"
import { Appbar, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState } from "../../redux/store"
import CategoryButton from "../../components/CategoryButton"
import { theme } from "../../theme"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../navigation/types"

export default function AllCategoriesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { items: categories } = useSelector((state: RootState) => state.categories)

  const handleCategoryPress = (category: any) => {
    navigation.navigate("CategoryScreen", {
      categoryId: category._id,
      categoryName: category.name,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Todas las categorías" />
      </Appbar.Header>
      <Title style={styles.title}>Explora todas las categorías</Title>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        numColumns={3}
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item }) => (
          <View style={styles.categoryItemWrapper}>
            <CategoryButton category={item} onPress={() => handleCategoryPress(item)} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
    color: theme.colors.text,
    textAlign: "center",
  },
  categoriesList: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  categoryItemWrapper: {
    flex: 1,
    alignItems: "center",
    marginBottom: 18,
  },
}) 