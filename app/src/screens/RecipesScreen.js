import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/config';
import Icon from 'react-native-vector-icons/Ionicons';
import { searchRecipesByIngredients } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const POPULAR_INGREDIENTS = ['chicken', 'pasta', 'rice', 'beef', 'fish', 'vegetables'];

const RecipesScreen = ({ navigation }) => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!ingredients.trim()) {
      Alert.alert('Error', 'Please enter some ingredients');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchRecipesByIngredients(ingredients);
      setRecipes(results);
    } catch (error) {
      Alert.alert('Error', `Failed to search recipes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePopularPress = (ingredient) => {
    setIngredients(ingredient);
    setTimeout(() => handleSearch(), 100);
  };

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter ingredients (e.g., chicken, rice)"
            placeholderTextColor={COLORS.textSecondary}
            value={ingredients}
            onChangeText={setIngredients}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.popularContainer}>
          <Text style={styles.popularTitle}>Popular:</Text>
          <View style={styles.popularTags}>
            {POPULAR_INGREDIENTS.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.popularTag}
                onPress={() => handlePopularPress(item)}
              >
                <Text style={styles.popularTagText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {hasSearched ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsCount}>
            Found {recipes.length} recipes
          </Text>
          
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
                <Icon name="search" size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyTitle}>No recipes found</Text>
                <Text style={styles.emptyText}>
                  Try different ingredients or check your spelling
                </Text>
              </View>
            }
          />
        </View>
      ) : (
        <View style={styles.welcomeContainer}>
          <Icon name="restaurant" size={64} color={COLORS.primary} />
          <Text style={styles.welcomeTitle}>Search for Recipes</Text>
          <Text style={styles.welcomeText}>
            Enter ingredients you have and we'll find matching recipes
          </Text>
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
  searchSection: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  popularContainer: {
    marginTop: 12,
  },
  popularTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularTag: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  popularTagText: {
    color: COLORS.text,
    fontSize: 12,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsCount: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  recipesList: {
    paddingBottom: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  welcomeTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
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

export default RecipesScreen;