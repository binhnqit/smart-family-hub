import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, Platform } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { processFamilyCommand } from '../../services/aiService';
import GlassCard from '../../components/ui/GlassCard';
import AppInput from '../../components/ui/AppInput';

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCalendar = async () => {
    const { data, error } = await supabase
      .from('family_calendar')
      .select('*')
      .order('event_date', { ascending: true });
    if (!error && data) setEvents(data);
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleAiSubmit = async () => {
    if (!inputText.trim() || loading) return;
    setLoading(true);
    const res = await processFamilyCommand(inputText);
    if (res && res.success) {
      setInputText('');
      fetchCalendar();
      if (Platform.OS !== 'web') Alert.alert("✨ Thành công", "Gemini đã cập nhật lịch trình gia đình!");
    } else {
      if (Platform.OS !== 'web') Alert.alert("⚠️ Thất bại", "Lỗi phân tích lệnh AI.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* KHU VỰC NHẬP LỆNH AI */}
      <GlassCard style={styles.headerCard}>
        <Text style={styles.aiTitle}>✨ Trợ lý Lịch trình thông minh</Text>
        <View style={styles.searchRow}>
          <AppInput 
            placeholder="Mẹ dặn chiều mai 15h họp phụ huynh..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleAiSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Gửi AI</Text>}
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* DANH SÁCH LỊCH TRÌNH */}
      <Text style={styles.sectionTitle}>📅 Dòng thời gian sự kiện</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GlassCard style={styles.eventCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.badgeText}>👤 {item.assignee || 'Cả nhà'}</Text>
              <Text style={styles.timeText}>⏱️ {item.event_time || 'Cả ngày'}</Text>
            </View>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.dateText}>🗓️ {item.event_date}</Text>
          </GlassCard>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🗓️</Text>
            <Text style={styles.emptyText}>Chưa có lịch trình nào được ghi nhận.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  headerCard: { marginBottom: 20 },
  aiTitle: { fontSize: 14, fontWeight: '700', color: '#6366F1', marginBottom: 12, textTransform: 'uppercase' },
  searchRow: { flexDirection: 'row', gap: 10 },
  sendBtn: { backgroundColor: '#6366F1', borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  eventCard: { marginBottom: 12, backgroundColor: '#FFFFFF' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#6366F1', backgroundColor: '#EBF5FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  timeText: { fontSize: 12, color: '#4B5563', fontWeight: '500' },
  eventTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 10 },
  dateText: { fontSize: 13, color: '#6B7280' },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: '#9CA3AF', fontSize: 14 }
});
