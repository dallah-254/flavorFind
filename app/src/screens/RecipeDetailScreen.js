import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { COLORS } from '../constants/config';
import { getRecipeDetails } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/Ionicons';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipeDetails();
  }, []);

  const loadRecipeDetails = async () => {
    try {
      const data = await getRecipeDetails(recipeId);
      setRecipe(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load recipe details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!recipe) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} 
        style={styles.image}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.extendedIngredients && recipe.extendedIngredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Icon name="checkmark-circle" size={18} color={COLORS.primary} />
              <Text style={styles.ingredientText}>{ingredient.original}</Text>
            </View>
          ))}
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.analyzedInstructions && recipe.analyzedInstructions[0] ? (
            recipe.analyzedInstructions[0].steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <Text style={styles.stepText}>{step.step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noInstructions}>
              No instructions available. Please visit the source website.
            </Text>
          )}
        </View>

        {/* Source Link */}
        {recipe.sourceUrl && (
          <TouchableOpacity 
            style={styles.sourceButton}
            onPress={() => Linking.openURL(recipe.sourceUrl)}
          >
            <Icon name="open-outline" size={20} color="#fff" />
            <Text style={styles.sourceButtonText}>
              View Full Recipe on {recipe.sourceName || 'Source Website'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 16,
  },
  ingredientText: {
    color: COLORS.text,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  noInstructions: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  sourceButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  sourceButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RecipeDetailScreen;