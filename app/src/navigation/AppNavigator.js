import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/config';
import { Image, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AboutScreen from '../screens/AboutScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack with header
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
    }}
  >
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen} 
      options={{ 
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={{ 
                width: 32, 
                height: 32, 
                marginRight: 10,
                tintColor: COLORS.primary 
              }}
              resizeMode="contain"
            />
            <Text style={{ 
              color: COLORS.text, 
              fontSize: 20, 
              fontWeight: 'bold',
            }}>
              FlavorFind
            </Text>
          </View>
        ),
      }}
    />
    <Stack.Screen 
      name="RecipeDetail" 
      component={RecipeDetailScreen} 
      options={{ 
        title: 'Recipe Details',
        headerBackTitle: 'Back'
      }}
    />
  </Stack.Navigator>
);

// Recipes Stack
const RecipesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
    }}
  >
    <Stack.Screen 
      name="RecipesMain" 
      component={RecipesScreen} 
      options={{ title: 'All Recipes' }}
    />
    <Stack.Screen 
      name="RecipeDetail" 
      component={RecipeDetailScreen} 
      options={{ 
        title: 'Recipe Details',
        headerBackTitle: 'Back'
      }}
    />
  </Stack.Navigator>
);

// Categories Stack
const CategoriesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
    }}
  >
    <Stack.Screen 
      name="CategoriesMain" 
      component={CategoriesScreen} 
      options={{ title: 'Categories' }}
    />
    <Stack.Screen 
      name="RecipeDetail" 
      component={RecipeDetailScreen} 
      options={{ 
        title: 'Recipe Details',
        headerBackTitle: 'Back'
      }}
    />
  </Stack.Navigator>
);

// About Stack
const AboutStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
    }}
  >
    <Stack.Screen 
      name="AboutMain" 
      component={AboutScreen} 
      options={{ title: 'About' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconUrl;

          if (route.name === 'Home') {
            iconUrl = focused 
              ? 'https://cdn-icons-png.flaticon.com/512/1946/1946436.png' // filled home
              : 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png'; // outline home
          } else if (route.name === 'Recipes') {
            iconUrl = focused
              ? 'https://cdn-icons-png.flaticon.com/512/2833/2833805.png' // filled recipes
              : 'https://cdn-icons-png.flaticon.com/512/2833/2833836.png'; // outline recipes
          } else if (route.name === 'Categories') {
            iconUrl = focused
              ? 'https://cdn-icons-png.flaticon.com/512/992/992680.png' // filled categories
              : 'https://cdn-icons-png.flaticon.com/512/992/992651.png'; // outline categories
          } else if (route.name === 'About') {
            iconUrl = focused
              ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' // filled about
              : 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png'; // outline about
          }

          return (
            <Image 
              source={{ uri: iconUrl }} 
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Recipes" component={RecipesStack} />
      <Tab.Screen name="Categories" component={CategoriesStack} />
      <Tab.Screen name="About" component={AboutStack} />
    </Tab.Navigator>
  );
};

export default AppNavigator;