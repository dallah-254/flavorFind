import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/config';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AboutScreen from '../screens/AboutScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { color: COLORS.text },
    }}
  >
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen} 
      options={{ title: 'FlavorFind' }}
    />
    <Stack.Screen 
      name="RecipeDetail" 
      component={RecipeDetailScreen} 
      options={{ title: 'Recipe Details' }}
    />
  </Stack.Navigator>
);

const RecipesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { color: COLORS.text },
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
      options={{ title: 'Recipe Details' }}
    />
  </Stack.Navigator>
);

const CategoriesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { color: COLORS.text },
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
      options={{ title: 'Recipe Details' }}
    />
  </Stack.Navigator>
);

const AboutStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { color: COLORS.text },
    }}
  >
    <Stack.Screen 
      name="AboutMain" 
      component={AboutScreen} 
      options={{ title: 'About' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Recipes" 
        component={RecipesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="About" 
        component={AboutStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;