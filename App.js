import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import CalendarScreen from './src/modules/calendar/CalendarScreen';
import ChoresScreen from './src/modules/chores/ChoresScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar');

  return (
    <SafeAreaView style={styles.container}>
      {/* VÙNG NỘI DUNG CHÍNH */}
      <ScrollView style={styles.mainContent}>
        {currentTab === 'calendar' ? <CalendarScreen /> : <ChoresScreen />}
      </ScrollView>

      {/* THANH ĐIỀU HƯỚNG BOTTOM BAR CHUẨN ĐIỆN THOẠI & WEB */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          onClick={() => setCurrentTab('calendar')} 
          onPress={() => setCurrentTab('calendar')}
          style={styles.tabButton}
        >
          <Text style={{
            ...styles.tabText, 
            color: currentTab === 'calendar' ? '#6366F1' : '#8E8E93',
            fontWeight: currentTab === 'calendar' ? '700' : '500'
          }}>
            📅 Lịch trình
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onClick={() => setCurrentTab('chores')} 
          onPress={() => setCurrentTab('chores')}
          style={styles.tabButton}
        >
          <Text style={{
            ...styles.tabText, 
            color: currentTab === 'chores' ? '#10B981' : '#8E8E93',
            fontWeight: currentTab === 'chores' ? '700' : '500'
          }}>
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
    backgroundColor: '#F8F9FA' 
  },
  mainContent: { 
    flex: 1, 
    marginBottom: 65 
  },
  tabBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 65, 
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  tabButton: { 
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 10
  },
  tabText: {
    fontSize: 15,
  }
});
