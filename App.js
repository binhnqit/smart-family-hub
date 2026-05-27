// App.js (Nằm ngay thư mục gốc)
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import CalendarScreen from './src/modules/calendar/CalendarScreen';
import ChoresScreen from './src/modules/chores/ChoresScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* VÙNG HIỂN THỊ NỘI DUNG MÀN HÌNH */}
      <View style={styles.mainContent}>
        {currentTab === 'calendar' ? <CalendarScreen /> : <ChoresScreen />}
      </View>

      {/* THANH ĐIỀU HƯỚNG BOTTOM BAR CHUẨN ĐIỆN THOẠI */}
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
    elevation: 8, // Tạo shadow mượt trên Android
    shadowColor: '#000', // Tạo shadow trên iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tabButton: { 
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    height: '100%',
  },
  tabText: {
    fontSize: 14,
  }
});
