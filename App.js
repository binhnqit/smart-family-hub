import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import CalendarScreen from './src/modules/calendar/CalendarScreen';
import ChoresScreen from './src/modules/chores/ChoresScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar');

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>
        {currentTab === 'calendar'
          ? <CalendarScreen />
          : <ChoresScreen />}
      </View>

      <View style={styles.tabBar}>

        <TouchableOpacity
          onPress={() => setCurrentTab('calendar')}
          style={styles.tabButton}
        >
          <Text style={[
            styles.tabText,
            currentTab === 'calendar' && styles.activeText
          ]}>
            📅 Lịch trình
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentTab('chores')}
          style={styles.tabButton}
        >
          <Text style={[
            styles.tabText,
            currentTab === 'chores' && styles.activeText
          ]}>
            ✅ Việc nhà
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  content: {
    flex: 1,
  },

  tabBar: {
    height: 65,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },

  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabText: {
    fontSize: 15,
    color: '#8E8E93',
  },

  activeText: {
    color: '#6366F1',
    fontWeight: '700',
  },
});
