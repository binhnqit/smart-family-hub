// src/modules/calendar/CalendarScreen.jsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../api/supabaseClient'; 
import { processFamilyCommand } from '../../api/geminiService'; // Đảm bảo đúng đường dẫn import của pro

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Lấy dữ liệu sự kiện từ Supabase khi mở màn hình
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu lịch trình:", error.message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const handleSendAI = async () => {
    if (!command.trim()) return;
    setLoading(true);
    try {
      // 1. Gửi câu lệnh tiếng Việt của pro qua xử lý lõi AI Gemini
      const aiResponse = await processFamilyCommand(command);
      
      // 2. Sau khi AI thêm/sửa vào Supabase thành công, xóa ô nhập liệu và cập nhật lại giao diện
      setCommand('');
      await fetchEvents();
      
      // Thông báo cho người dùng biết
      Alert.alert("Thành công", aiResponse || "Đã cập nhật lịch trình gia đình!");
    } catch (error) {
      Alert.alert("Lỗi hệ thống", "Không thể xử lý câu lệnh AI lúc này.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📅 Lịch trình gia đình</Text>
      
      {/* THANH NHẬP LỆNH AI ĐIỀU KHIỂN THÔNG MINH */}
      <View style={styles.aiBox}>
        <TextInput
          style={styles.input}
          placeholder="Nói với Trợ lý: Thêm lịch đi ăn lẩu lúc 19h ngày mai..."
          value={command}
          onChangeText={setCommand}
          placeholderTextColor="#A9A9A9"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendAI} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Gửi AI</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* HIỂN THỊ DANH SÁCH EVENT CHUẨN ĐIỆN THOẠI */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.eventTitle}>{item.title}</Text>
            </View>
            {item.start_time && (
              <Text style={styles.eventTime}>
                ⏰ {new Date(item.start_time).toLocaleString('vi-VN')}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có lịch trình nào được lên.</Text>
            <Text style={styles.emptySubText}>Hãy thử ra lệnh cho Gemini ở ô phía trên nhé pro!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#F8F9FA' 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1C1C1E', 
    marginBottom: 16,
    marginTop: 10
  },
  aiBox: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: { 
    flex: 1, 
    height: 45, 
    paddingHorizontal: 12, 
    fontSize: 14,
    color: '#1C1C1E'
  },
  sendButton: { 
    backgroundColor: '#6366F1', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    borderRadius: 8 
  },
  sendButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 14 
  },
  eventCard: { 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12,
    borderWidth: 1, 
    borderColor: '#E5E5EA',
    elevation: 1
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  eventTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1C1C1E' 
  },
  eventTime: { 
    fontSize: 13, 
    color: '#8E8E93' 
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60
  },
  emptyText: { 
    fontSize: 15, 
    fontWeight: '500',
    color: '#8E8E93', 
    textAlign: 'center' 
  },
  emptySubText: {
    fontSize: 13,
    color: '#AEAEB2',
    marginTop: 6,
    textAlign: 'center'
  }
});
