import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';

import { supabase } from '../../services/supabaseClient';
import { processFamilyCommand } from '../../services/aiService';

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCalendar();

    // Thiết lập kênh nghe realtime tự động đồng bộ dữ liệu
    const subscription = supabase
      .channel('realtime-family-calendar')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'family_calendar' },
        (payload) => {
          fetchCalendar();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchCalendar = async () => {
    try {
      const { data, error } = await supabase
        .from('family_calendar')
        .select('*')
        .order('event_date', { ascending: true });

      if (!error && data) {
        setEvents(data);
      }
    } catch (err) {
      console.log('Lỗi tải dữ liệu lịch:', err);
    }
  };

  const handleAiSubmit = async () => {
    if (!inputText.trim() || loading) return;

    try {
      setLoading(true);
      const res = await processFamilyCommand(inputText);

      if (res && res.success) {
        setInputText('');
        fetchCalendar();
        showNotification('✨ Thành công', 'Trợ lý AI đã cập nhật lịch trình!');
      } else {
        showNotification('⚠️ Thất bại', 'AI chưa xử lý được câu lệnh này.');
      }
    } catch (err) {
      console.log(err);
      showNotification('⚠️ Có lỗi xảy ra', 'Không thể kết nối dịch vụ AI.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const getUserColor = (name) => {
    switch (name) {
      case 'Bố':
        return '#007AFF';
      case 'Mẹ':
        return '#FF2D55';
      case 'Con':
        return '#34C759';
      default:
        return '#636366';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* CARD HEADER CHỨA Ô NHẬP LỆNH AI */}
      <View style={styles.headerCard}>
        <Text style={styles.aiTitle}>✨ Trợ lý lịch trình AI</Text>

        <View style={styles.inputRow}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ví dụ: Mẹ dặn mai 15h họp phụ huynh"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            multiline
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleAiSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.sendButtonText}>Gửi lệnh</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* TIÊU ĐỀ DANH SÁCH SỰ KIỆN */}
      <Text style={styles.sectionTitle}>📅 Dòng thời gian sự kiện</Text>

      {/* DANH SÁCH TRẠNG THÁI */}
      {events.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🗓️</Text>
          <Text style={styles.emptyTitle}>Chưa có lịch trình</Text>
          <Text style={styles.emptyText}>
            Hãy nhập một câu lệnh tự nhiên để Gemini AI tự động tạo lịch cho gia đình.
          </Text>
        </View>
      ) : (
        events.map((item) => (
          <View key={item.id} style={styles.eventCard}>
            <View style={styles.cardTop}>
              <View
                style={[
                  styles.userBadge,
                  { backgroundColor: getUserColor(item.assignee) },
                ]}
              >
                <Text style={styles.userBadgeText}>
                  👤 {item.assignee || 'Cả nhà'}
                </Text>
              </View>

              <Text style={styles.timeText}>
                ⏱️{' '}
                {item.event_time
                  ? String(item.event_time).substring(0, 5)
                  : 'Cả ngày'}
              </Text>
            </View>

            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.dateText}>🗓️ {item.event_date}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 24px rgba(0,0,0,0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
      },
    }),
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    gap: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    minHeight: 56,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      web: { outlineStyle: 'none' },
    }),
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 22,
    fontSize: 14,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(0,0,0,0.04)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      },
    }),
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  userBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  userBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  timeText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
    lineHeight: 24,
  },
  dateText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});
