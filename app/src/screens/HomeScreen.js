import DancingChefLoader from '../components/DancingChefLoader';
import React, { useState, useCallback, useEffect } from 'react';
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
  Image,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../constants/config';
import { searchRecipesByIngredients, testConnection } from '../services/api';
import RecipeCard from '../components/RecipeCard';

const QUICK_INGREDIENTS = ['Chicken', 'Pasta', 'Tomato', 'Cheese', 'Rice', 'Beef', 'Fish', 'Eggs'];

// Trending Recipes Data (simulated popular recipes)
const TRENDING_RECIPES = [
  {
    id: 1,
    title: 'Creamy Garlic Pasta',
    image: 'https://images.unsplash.com/photo-1645112411342-4665ad1698a0?w=400',
    ingredients: 'pasta,garlic,cream,cheese',
    time: '25 min',
    trending: true,
  },
  {
    id: 2,
    title: 'Spicy Chicken Wings',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
    ingredients: 'chicken,wings,spices,hot sauce',
    time: '40 min',
    trending: true,
  },
  {
    id: 3,
    title: 'Mediterranean Salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    ingredients: 'lettuce,tomato,cucumber,feta,olives',
    time: '15 min',
    trending: true,
  },
  {
    id: 4,
    title: 'Beef Stir Fry',
    image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400',
    ingredients: 'beef,vegetables,soy sauce,ginger',
    time: '30 min',
    trending: true,
  },
];

// Quick & Easy Recipes Data (under 20 mins)
const QUICK_RECIPES = [
  {
    id: 5,
    title: '5-Minute Avocado Toast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    ingredients: 'bread,avocado,eggs,salt',
    time: '5 min',
  },
  {
    id: 6,
    title: 'Quick Tomato Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    ingredients: 'pasta,tomato,garlic,basil',
    time: '15 min',
  },
  {
    id: 7,
    title: 'Microwave Mug Omelette',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400',
    ingredients: 'eggs,milk,cheese,pepper',
    time: '3 min',
  },
  {
    id: 8,
    title: 'Greek Yogurt Bowl',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    ingredients: 'yogurt,honey,berries,granola',
    time: '2 min',
  },
  {
    id: 9,
    title: 'Caprese Sandwich',
    image: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=400',
    ingredients: 'bread,tomato,mozzarella,basil',
    time: '10 min',
  },
  {
    id: 10,
    title: 'Quick Fried Rice',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    ingredients: 'rice,eggs,vegetables,soy sauce',
    time: '12 min',
  },
];

// Cuisine Explorer Data
const CUISINES = [
  {
    id: 'italian',
    name: 'Italian',
    icon: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png',
    ingredients: 'pasta,tomato,cheese,olive oil,basil,garlic',
    color: '#e87a3d',
  },
  {
    id: 'asian',
    name: 'Asian',
    icon: 'https://cdn-icons-png.flaticon.com/512/3174/3174883.png',
    ingredients: 'rice,noodles,soy sauce,ginger,garlic',
    color: '#3de87a',
  },
  {
    id: 'mexican',
    name: 'Mexican',
    icon: 'https://cdn-icons-png.flaticon.com/512/2942/2942690.png',
    ingredients: 'beans,rice,avocado,tortilla,chili',
    color: '#e83d3d',
  },
  {
    id: 'african',
    name: 'African',
    icon: 'https://cdn-icons-png.flaticon.com/512/2579/2579021.png',
    ingredients: 'rice,beans,plantains,peanuts,chicken',
    color: '#e8a63d',
  },
  {
    id: 'indian',
    name: 'Indian',
    icon: 'https://cdn-icons-png.flaticon.com/512/2942/2942796.png',
    ingredients: 'rice,curry,spices,lentils,chicken',
    color: '#e83d9e',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    icon: 'https://cdn-icons-png.flaticon.com/512/2942/2942708.png',
    ingredients: 'olive oil,fish,vegetables,hummus',
    color: '#4ade80',
  },
];

// Seasonal Picks Data (changes by month)
const getSeasonalRecipes = () => {
  const month = new Date().getMonth();
  
  // Winter (Dec-Feb)
  if (month === 11 || month === 0 || month === 1) {
    return [
      {
        id: 11,
        title: 'Hearty Beef Stew',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
        ingredients: 'beef,potatoes,carrots,onions,broth',
        season: 'Winter',
      },
      {
        id: 12,
        title: 'Roasted Root Vegetables',
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
        ingredients: 'carrots,potatoes,parsnips,rosemary',
        season: 'Winter',
      },
    ];
  }
  // Spring (Mar-May)
  else if (month >= 2 && month <= 4) {
    return [
      {
        id: 13,
        title: 'Spring Pea Risotto',
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
        ingredients: 'rice,peas,parmesan,mint',
        season: 'Spring',
      },
      {
        id: 14,
        title: 'Asparagus Lemon Pasta',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
        ingredients: 'pasta,asparagus,lemon,garlic',
        season: 'Spring',
      },
    ];
  }
  // Summer (Jun-Aug)
  else if (month >= 5 && month <= 7) {
    return [
      {
        id: 15,
        title: 'Grilled Corn Salad',
        image: 'https://images.unsplash.com/photo-1547483238-2c2bf5a4cf24?w=400',
        ingredients: 'corn,peppers,lime,cilantro',
        season: 'Summer',
      },
      {
        id: 16,
        title: 'Watermelon Feta Salad',
        image: 'https://images.unsplash.com/photo-1580014317999-e9f1936787a5?w=400',
        ingredients: 'watermelon,feta,mint,lime',
        season: 'Summer',
      },
    ];
  }
  // Fall (Sep-Nov)
  else {
    return [
      {
        id: 17,
        title: 'Butternut Squash Soup',
        image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400',
        ingredients: 'squash,onions,ginger,coconut milk',
        season: 'Fall',
      },
      {
        id: 18,
        title: 'Apple Cinnamon Oatmeal',
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400',
        ingredients: 'oats,apples,cinnamon,honey',
        season: 'Fall',
      },
    ];
  }
};

// Chef's Special Data
const CHEF_SPECIAL = {
  id: 19,
  title: 'Signature Beef Wellington',
  chef: 'Chef Maria',
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
  ingredients: 'beef,mushrooms,puff pastry,eggs',
  description: 'A showstopping centerpiece for special occasions',
  time: '120 min',
  difficulty: 'Advanced',
};

// Cooking Tips Data
const COOKING_TIPS = [
  {
    id: 1,
    tip: 'To check if pan is hot enough, flick a drop of water - it should sizzle and evaporate immediately.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3174/3174883.png',
  },
  {
    id: 2,
    tip: 'Always let meat rest for 5-10 minutes after cooking to keep juices inside.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png',
  },
  {
    id: 3,
    tip: 'Use room temperature eggs for baking - they incorporate better into batters.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
  },
  {
    id: 4,
    tip: 'Add salt to pasta water - it should taste like the sea for best flavor.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1471/1471262.png',
  },
];

const HomeScreen = ({ navigation }) => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [seasonalRecipes] = useState(getSeasonalRecipes());
  const [dailyTip] = useState(COOKING_TIPS[Math.floor(Math.random() * COOKING_TIPS.length)]);

  useEffect(() => {
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

  const handleSearch = async (searchIngredients) => {
    const searchQuery = searchIngredients || ingredients;
    
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter some ingredients');
      return;
    }

    setLoading(true);
    setShowResults(true);
    
    try {
      const results = await searchRecipesByIngredients(searchQuery);
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

  const handleCuisinePress = (cuisine) => {
    setIngredients(cuisine.ingredients);
    handleSearch(cuisine.ingredients);
  };

  const handleQuickRecipePress = (quickRecipe) => {
    setIngredients(quickRecipe.ingredients);
    handleSearch(quickRecipe.ingredients);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    if (showResults && ingredients) {
      try {
        const results = await searchRecipesByIngredients(ingredients);
        setRecipes(results);
      } catch (error) {
        Alert.alert('Error', 'Failed to refresh recipes');
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setRefreshing(false);
  }, [showResults, ingredients]);

  if (loading) {
    return <DancingChefLoader message="Finding delicious recipes..." />;
  }

  // Trending Recipe Card Component
  const TrendingCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.trendingCard}
      onPress={() => handleQuickRecipePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.trendingImage} />
      <View style={styles.trendingBadge}>
        <Text style={styles.trendingBadgeText}>🔥 Trending</Text>
      </View>
      <View style={styles.trendingContent}>
        <Text style={styles.trendingTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.trendingMeta}>
          <Text style={styles.trendingTime}>⏱ {item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Quick Recipe Card Component
  const QuickRecipeCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.quickCard}
      onPress={() => handleQuickRecipePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.quickImage} />
      <View style={styles.quickContent}>
        <Text style={styles.quickTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.quickTime}>⚡ {item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  // Cuisine Card Component
  const CuisineCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.cuisineCard}
      onPress={() => handleCuisinePress(item)}
    >
      <View style={[styles.cuisineIconContainer, { backgroundColor: item.color + '20' }]}>
        <Image source={{ uri: item.icon }} style={[styles.cuisineIcon, { tintColor: item.color }]} />
      </View>
      <Text style={styles.cuisineName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Seasonal Card Component
  const SeasonalCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.seasonalCard}
      onPress={() => handleQuickRecipePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.seasonalImage} />
      <View style={styles.seasonalOverlay}>
        <Text style={styles.seasonalBadge}>🌱 {item.season}</Text>
      </View>
      <View style={styles.seasonalContent}>
        <Text style={styles.seasonalTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

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
              title="Pull to refresh"
              titleColor={COLORS.textSecondary}
            />
          }
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Discover Amazing <Text style={styles.heroHighlight}>Recipes</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Find perfect recipes based on ingredients you have
            </Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="e.g., chicken, rice, tomatoes..."
                placeholderTextColor={COLORS.textSecondary}
                value={ingredients}
                onChangeText={setIngredients}
                onSubmitEditing={() => handleSearch()}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch()}>
                <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149852.png' }}
                  style={styles.buttonIcon}
                />
                <Text style={styles.searchButtonText}>FIND</Text>
              </TouchableOpacity>
            </View>

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

          {/* Trending Now Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={TRENDING_RECIPES}
              renderItem={({ item }) => <TrendingCard item={item} />}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          {/* Cuisine Explorer Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🌍 Explore Cuisines</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                <Text style={styles.seeAllText}>All Cuisines</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={CUISINES}
              renderItem={({ item }) => <CuisineCard item={item} />}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          {/* Quick & Easy Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⚡ Quick & Easy</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>More Quick Meals</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={QUICK_RECIPES}
              renderItem={({ item }) => <QuickRecipeCard item={item} />}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          {/* Seasonal Picks Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🌱 Seasonal Picks</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={seasonalRecipes}
              renderItem={({ item }) => <SeasonalCard item={item} />}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          {/* Chef's Special Section */}
          <View style={styles.chefSpecialSection}>
            <Text style={styles.chefSpecialTitle}>👨‍🍳 Chef's Special</Text>
            <TouchableOpacity 
              style={styles.chefSpecialCard}
              onPress={() => handleQuickRecipePress(CHEF_SPECIAL)}
            >
              <Image source={{ uri: CHEF_SPECIAL.image }} style={styles.chefSpecialImage} />
              <View style={styles.chefSpecialOverlay}>
                <View style={styles.chefSpecialContent}>
                  <Text style={styles.chefSpecialName}>{CHEF_SPECIAL.title}</Text>
                  <Text style={styles.chefSpecialChef}>by {CHEF_SPECIAL.chef}</Text>
                  <Text style={styles.chefSpecialDesc}>{CHEF_SPECIAL.description}</Text>
                  <View style={styles.chefSpecialMeta}>
                    <Text style={styles.chefSpecialTime}>⏱ {CHEF_SPECIAL.time}</Text>
                    <Text style={styles.chefSpecialDifficulty}>📊 {CHEF_SPECIAL.difficulty}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Cooking Tip of the Day */}
          <View style={styles.tipSection}>
            <View style={styles.tipCard}>
              <Image 
                source={{ uri: dailyTip.icon }}
                style={styles.tipIcon}
              />
              <View style={styles.tipContent}>
                <Text style={styles.tipLabel}>💡 Tip of the Day</Text>
                <Text style={styles.tipText}>{dailyTip.tip}</Text>
              </View>
            </View>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Smart Recipe Finder</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }}
                    style={styles.benefitIconImage}
                  />
                </View>
                <Text style={styles.benefitText}>AI-powered recipe matching</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' }}
                    style={styles.benefitIconImage}
                  />
                </View>
                <Text style={styles.benefitText}>Thousands of recipes</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                    style={styles.benefitIconImage}
                  />
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
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
    tintColor: '#fff',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  trendingCard: {
    width: 200,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  trendingImage: {
    width: '100%',
    height: 120,
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trendingContent: {
    padding: 10,
  },
  trendingTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingTime: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  cuisineCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  cuisineIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cuisineIcon: {
    width: 30,
    height: 30,
  },
  cuisineName: {
    color: COLORS.text,
    fontSize: 12,
    textAlign: 'center',
  },
  quickCard: {
    width: 140,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  quickImage: {
    width: '100%',
    height: 100,
  },
  quickContent: {
    padding: 8,
  },
  quickTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  quickTime: {
    color: COLORS.primary,
    fontSize: 11,
  },
  seasonalCard: {
    width: 160,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  seasonalImage: {
    width: '100%',
    height: 100,
  },
  seasonalOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  seasonalBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    overflow: 'hidden',
  },
  seasonalContent: {
    padding: 8,
  },
  seasonalTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '500',
  },
  chefSpecialSection: {
    padding: 16,
    marginBottom: 16,
  },
  chefSpecialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  chefSpecialCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chefSpecialImage: {
    width: '100%',
    height: '100%',
  },
  chefSpecialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  chefSpecialContent: {
    padding: 16,
  },
  chefSpecialName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chefSpecialChef: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.9,
  },
  chefSpecialDesc: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 8,
    opacity: 0.8,
  },
  chefSpecialMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  chefSpecialTime: {
    color: '#fff',
    fontSize: 12,
  },
  chefSpecialDifficulty: {
    color: '#fff',
    fontSize: 12,
  },
  tipSection: {
    padding: 16,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipLabel: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitIconImage: {
    width: 18,
    height: 18,
    tintColor: '#fff',
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

export default HomeScreen;