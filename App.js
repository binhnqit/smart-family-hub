import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import CalendarScreen from './src/modules/calendar/CalendarScreen';
import ChoresScreen from './src/modules/chores/ChoresScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar');

  return (
    <View style={styles.container}>

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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#F8F9FA',
  },

  content: {
    flex: 1,
    width: '100%',
  },

  tabBar: {
    height: 65,
    width: '100%',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    flexShrink: 0,
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
