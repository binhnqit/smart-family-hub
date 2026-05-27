import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Platform 
} from 'react-native';
import CalendarScreen from './src/modules/calendar/CalendarScreen';
import ChoresScreen from './src/modules/chores/ChoresScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar');

  return (
    <View style={styles.container}>
      {/* Cấu hình thanh trạng thái phía trên cùng của điện thoại */}
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Vùng an toàn chỉ áp dụng cho phần Header phía trên (Tránh lẹm tai thỏ/Android notch) */}
      <SafeAreaView style={styles.topSafeArea} />

      {/* Vùng hiển thị nội dung chính của Tab được chọn */}
      <View style={styles.mainContent}>
        {currentTab === 'calendar' ? <CalendarScreen /> : <ChoresScreen />}
      </View>

      {/* THANH ĐIỀU HƯỚNG TAB BAR DƯỚI ĐÁY */}
      <View style={styles.tabBar}>
        {/* Nút chuyển sang Tab Lịch Trình */}
        <TouchableOpacity 
          onPress={() => setCurrentTab('calendar')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText, 
            { 
              color: currentTab === 'calendar' ? '#6366F1' : '#8E8E93', 
              fontWeight: currentTab === 'calendar' ? '700' : '500' 
            }
          ]}>
            📅 Lịch trình
          </Text>
        </TouchableOpacity>

        {/* Nút chuyển sang Tab Việc Nhà */}
        <TouchableOpacity 
          onPress={() => setCurrentTab('chores')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText, 
            { 
              color: currentTab === 'chores' ? '#10B981' : '#8E8E93', 
              fontWeight: currentTab === 'chores' ? '700' : '500' 
            }
          ]}>
            ✅ Việc nhà
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vùng đệm an toàn dưới đáy cho các dòng iPhone đời mới */}
      <SafeAreaView style={[
        styles.bottomSafeArea, 
        { backgroundColor: '#FFFFFF' }
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  topSafeArea: {
    flex: 0,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  mainContent: { 
    flex: 1,
  },
  tabBar: { 
    height: 60, 
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1, 
    borderTopColor: '#E5E5EA', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: -3 }, 
        shadowOpacity: 0.04, 
        shadowRadius: 6 
      },
      android: { 
        elevation: 10 
      },
      web: { 
        boxShadow: '0px -3px 12px rgba(0,0,0,0.03)' 
      }
    })
  },
  tabButton: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%' 
  },
  tabText: { 
    fontSize: 14,
    letterSpacing: -0.2
  },
  bottomSafeArea: {
    flex: 0,
  }
});
