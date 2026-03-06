import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/config';
import Icon from 'react-native-vector-icons/Ionicons';
import { searchRecipesByIngredients } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  { 
    id: 'italian', 
    name: 'Italian', 
    icon: 'pizza', 
    ingredients: 'pasta,tomato,cheese,olive oil,basil,garlic',
    color: '#e87a3d'
  },
  { 
    id: 'mexican', 
    name: 'Mexican', 
    icon: 'flame', 
    ingredients: 'beans,rice,avocado,tortilla,chili,cilantro',
    color: '#e83d3d'
  },
  { 
    id: 'asian', 
    name: 'Asian', 
    icon: 'restaurant', 
    ingredients: 'rice,noodles,soy sauce,ginger,garlic,sesame',
    color: '#3de87a'
  },
  { 
    id: 'african', 
    name: 'African', 
    icon: 'globe', 
    ingredients: 'rice,beans,plantains,peanuts,chicken,tomatoes',
    color: '#e8a63d'
  },
  { 
    id: 'vegetarian', 
    name: 'Vegetarian', 
    icon: 'leaf', 
    ingredients: 'vegetables,tofu,beans,lentils,cheese,mushrooms',
    color: '#4ade80'
  },
  { 
    id: 'dessert', 
    name: 'Desserts', 
    icon: 'ice-cream', 
    ingredients: 'sugar,flour,eggs,butter,chocolate,vanilla',
    color: '#e83d9e'
  },
];

const CategoriesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showResults, setShowResults] = useState(false);

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!showResults ? (
        <ScrollView showsVerticalScrollIndicator={false}>
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
                  <Icon name={category.icon} size={30} color="#fff" />
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
              <Icon name="close" size={20} color={COLORS.textSecondary} />
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
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="restaurant" size={48} color={COLORS.textSecondary} />
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
  recipesList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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