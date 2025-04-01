import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Custom tab bar colors
  const tabBarColors = {
    light: {
      activeBg: '#E7F3FE', // Light blue background for active tab
      activeTint: '#0E56A8', // Dark blue text/icon
      inactiveBg: '#F8FAFC', // Very light gray background
      inactiveTint: '#64748B', // Gray text/icon
      divider: '#E5E7EB', // Light border
    },
    dark: {
      activeBg: '#1E3D47', // Dark teal background
      activeTint: '#A1CEDC', // Light blue text/icon
      inactiveBg: '#1E293B', // Dark slate background
      inactiveTint: '#94A3B8', // Light gray text/icon
      divider: '#334155', // Dark border
    }
  };

  const colors = isDarkMode ? tabBarColors.dark : tabBarColors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 80,
          paddingHorizontal: 16, // Add horizontal padding
          paddingBottom: Platform.OS === 'ios' ? 30 : 20,
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
          }),
        },
        tabBarItemStyle: {
          flex: 1,
          height: '100%',
          marginHorizontal: 4, // Space between buttons
          borderRadius: 12, // Rounded corners
        },
        tabBarActiveTintColor: colors.activeTint,
        tabBarInactiveTintColor: colors.inactiveTint,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons 
              name="tie" 
              size={24} 
              color={focused ? colors.activeTint : colors.inactiveTint}
            />
          ),
          tabBarStyle: {
            backgroundColor: colors.activeBg,
          },
        }}
      />
      
      <Tabs.Screen
        name="Bookmark"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ focused }) => (
            <IconSymbol 
              size={24} 
              name="bookmark.fill" 
              color={focused ? colors.activeTint : colors.inactiveTint}
            />
          ),
          tabBarStyle: {
            backgroundColor: colors.activeBg,
          },
        }}
      />

      <Tabs.Screen
        name="JobDetails"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}