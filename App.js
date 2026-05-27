import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import CalendarScreen from './src/modules/calendar/CalendarScreen';
import ChoresScreen from './src/modules/chores/ChoresScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.mainContent}>
        {currentTab === 'calendar' ? <CalendarScreen /> : <ChoresScreen />}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          onPress={() => setCurrentTab('calendar')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText, 
            { color: currentTab === 'calendar' ? '#6366F1' : '#8E8E93', fontWeight: currentTab === 'calendar' ? '700' : '500' }
          ]}>
            📅 Lịch trình
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setCurrentTab('chores')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText, 
            { color: currentTab === 'chores' ? '#10B981' : '#8E8E93', fontWeight: currentTab === 'chores' ? '700' : '500' }
          ]}>
            ✅ Việc nhà
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  mainContent: { flex: 1, marginBottom: 65 },
  tabBar: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, 
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5EA', 
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 8 },
      web: { boxShadow: '0px -2px 10px rgba(0,0,0,0.03)' }
    })
  },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  tabText: { fontSize: 14 }
});
