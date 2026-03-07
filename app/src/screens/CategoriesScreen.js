import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { COLORS } from '../constants/config';
import { searchRecipesByIngredients } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import DancingChefLoader from '../components/DancingChefLoader';

const CATEGORIES = [
  { 
    id: 'italian', 
    name: 'Italian', 
    icon: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png',
    ingredients: 'pasta,tomato,cheese,olive oil,basil,garlic',
    color: '#e87a3d'
  },
  { 
    id: 'mexican', 
    name: 'Mexican', 
    icon: 'https://cdn-icons-png.flaticon.com/512/2942/2942690.png',
    ingredients: 'beans,rice,avocado,tortilla,chili,cilantro',
    color: '#e83d3d'
  },
  { 
    id: 'asian', 
    name: 'Asian', 
    icon: 'https://cdn-icons-png.flaticon.com/512/3174/3174883.png',
    ingredients: 'rice,noodles,soy sauce,ginger,garlic,sesame',
    color: '#3de87a'
  },
  { 
    id: 'african', 
    name: 'African', 
    icon: 'https://cdn-icons-png.flaticon.com/512/2579/2579021.png',
    ingredients: 'rice,beans,plantains,peanuts,chicken,tomatoes',
    color: '#e8a63d'
  },
  { 
    id: 'vegetarian', 
    name: 'Vegetarian', 
    icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
    ingredients: 'vegetables,tofu,beans,lentils,cheese,mushrooms',
    color: '#4ade80'
  },
  { 
    id: 'dessert', 
    name: 'Desserts', 
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    ingredients: 'sugar,flour,eggs,butter,chocolate,vanilla',
    color: '#e83d9e'
  },
];

const CategoriesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCategoryPress = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    setShowResults(true);
    
    try {
      const results = await searchRecipesByIngredients(category.ingredients);
      setRecipes(results);
    } catch (error) {
      Alert.alert('Error', `Failed to load ${category.name} recipes`);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  const clearSearch = () => {
    setShowResults(false);
    setRecipes([]);
    setSelectedCategory(null);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    if (showResults && selectedCategory) {
      try {
        const results = await searchRecipesByIngredients(selectedCategory.ingredients);
        setRecipes(results);
      } catch (error) {
        Alert.alert('Error', 'Failed to refresh recipes');
      }
    }
    
    setRefreshing(false);
  }, [showResults, selectedCategory]);

  if (loading) {
    return <DancingChefLoader message={`Loading ${selectedCategory?.name} recipes...`} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!showResults ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          <View style={styles.header}>
            <Text style={styles.title}>Recipe Categories</Text>
            <Text style={styles.subtitle}>Choose a category to explore</Text>
          </View>

          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color + '20' }]}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Image 
                    source={{ uri: category.icon }}
                    style={styles.categoryIconImage}
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDesc}>Delicious {category.name} recipes</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <View>
              <Text style={styles.resultsTitle}>
                {selectedCategory?.name} Recipes
              </Text>
              <Text style={styles.resultsCount}>
                Found {recipes.length} recipes
              </Text>
            </View>
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828778.png' }}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <RecipeCard 
                recipe={item} 
                onPress={() => handleRecipePress(item.id)}
              />
            )}
            contentContainerStyle={styles.recipesList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149852.png' }}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>No recipes found</Text>
                <Text style={styles.emptyText}>
                  Try another category
                </Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  categoriesGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIconImage: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  categoryName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultsCount: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  clearButton: {
    padding: 8,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.textSecondary,
  },
  recipesList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    marginBottom: 16,
    tintColor: COLORS.textSecondary,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CategoriesScreen;