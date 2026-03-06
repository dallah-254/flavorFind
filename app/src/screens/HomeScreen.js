import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/config';
import Icon from 'react-native-vector-icons/Ionicons';
import { searchRecipesByIngredients, testConnection } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const QUICK_INGREDIENTS = ['Chicken', 'Pasta', 'Tomato', 'Cheese', 'Rice', 'Beef', 'Fish', 'Eggs'];

const HomeScreen = ({ navigation }) => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Test API connection on mount
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        await testConnection();
        console.log('✅ Connected to backend');
      } catch (error) {
        Alert.alert(
          'Connection Error',
          'Cannot connect to the backend server. Please check your internet connection.'
        );
      }
    };
    checkConnection();
  }, []);

  const handleSearch = async () => {
    if (!ingredients.trim()) {
      Alert.alert('Error', 'Please enter some ingredients');
      return;
    }

    setLoading(true);
    setShowResults(true);
    
    try {
      const results = await searchRecipesByIngredients(ingredients);
      setRecipes(results);
    } catch (error) {
      Alert.alert('Error', `Failed to search recipes: ${error.message}`);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = (ingredient) => {
    if (ingredients) {
      setIngredients(ingredients + ', ' + ingredient);
    } else {
      setIngredients(ingredient);
    }
  };

  const clearSearch = () => {
    setShowResults(false);
    setRecipes([]);
    setIngredients('');
  };

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!showResults ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Discover Amazing <Text style={styles.heroHighlight}>Recipes</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Find perfect recipes based on ingredients you have
            </Text>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="e.g., chicken, rice, tomatoes..."
                placeholderTextColor={COLORS.textSecondary}
                value={ingredients}
                onChangeText={setIngredients}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Icon name="search" size={20} color="#fff" />
                <Text style={styles.searchButtonText}>FIND RECIPES</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Ingredients */}
            <View style={styles.quickContainer}>
              <Text style={styles.quickTitle}>Quick ingredients:</Text>
              <View style={styles.quickTagsGrid}>
                {QUICK_INGREDIENTS.map((item) => (
                  <TouchableOpacity 
                    key={item} 
                    style={styles.quickTag}
                    onPress={() => addIngredient(item.toLowerCase())}
                  >
                    <Text style={styles.quickTagText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Featured Recipes */}
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Recipes</Text>
            <View style={styles.featuredGrid}>
              {/* Pizza */}
              <TouchableOpacity 
                style={styles.featuredCard}
                onPress={() => {
                  setIngredients('flour,yeast,tomato,cheese');
                  handleSearch();
                }}
              >
                <Icon name="pizza" size={24} color={COLORS.primary} />
                <Text style={styles.featuredTitle}>Pizza</Text>
              </TouchableOpacity>

              {/* Pasta */}
              <TouchableOpacity 
                style={styles.featuredCard}
                onPress={() => {
                  setIngredients('pasta,cream,cheese,garlic');
                  handleSearch();
                }}
              >
                <Icon name="restaurant" size={24} color={COLORS.primary} />
                <Text style={styles.featuredTitle}>Pasta</Text>
              </TouchableOpacity>

              {/* Salad */}
              <TouchableOpacity 
                style={styles.featuredCard}
                onPress={() => {
                  setIngredients('lettuce,tomato,cucumber,olive oil');
                  handleSearch();
                }}
              >
                <Icon name="leaf" size={24} color={COLORS.primary} />
                <Text style={styles.featuredTitle}>Salad</Text>
              </TouchableOpacity>

              {/* Jollof */}
              <TouchableOpacity 
                style={styles.featuredCard}
                onPress={() => {
                  setIngredients('rice,tomatoes,onions,chicken');
                  handleSearch();
                }}
              >
                <Icon name="flame" size={24} color={COLORS.primary} />
                <Text style={styles.featuredTitle}>Jollof Rice</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Smart Recipe Finder</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Icon name="checkmark" size={16} color="#fff" />
                </View>
                <Text style={styles.benefitText}>AI-powered recipe matching</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Icon name="add" size={16} color="#fff" />
                </View>
                <Text style={styles.benefitText}>Thousands of recipes</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Icon name="flash" size={16} color="#fff" />
                </View>
                <Text style={styles.benefitText}>Quick and easy preparation</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              Found <Text style={styles.resultsCount}>{recipes.length}</Text> Recipes
            </Text>
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearButton}>Clear Search</Text>
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
                <Icon name="search" size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyTitle}>No recipes found</Text>
                <Text style={styles.emptyText}>
                  Try different ingredients or check your spelling
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
  heroSection: {
    backgroundColor: COLORS.card,
    padding: 16,
    margin: 16,
    borderRadius: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroHighlight: {
    color: COLORS.primary,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    marginBottom: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  quickContainer: {
    marginTop: 8,
  },
  quickTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  quickTagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTag: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  quickTagText: {
    color: COLORS.text,
    fontSize: 12,
  },
  featuredSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featuredCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredTitle: {
    color: COLORS.text,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  benefitsSection: {
    padding: 16,
    marginBottom: 20,
  },
  benefitsList: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitText: {
    color: COLORS.text,
    fontSize: 14,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsCount: {
    color: COLORS.primary,
  },
  clearButton: {
    color: COLORS.textSecondary,
    fontSize: 14,
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

export default HomeScreen;