import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
// Đi lùi 2 cấp (từ calendar -> modules -> src), sau đó đi vào api
import { supabase } from '../../api/supabaseClient';

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Giả định bảng lưu lịch trình tên là family_events
      const { data, error } = await supabase
        .from('family_events')
        .select('*')
        .order('start_time', { ascending: true });

      if (!error && data) {
        setEvents(data);
      }
    } catch (err) {
      console.log('Lỗi lấy dữ liệu lịch trình:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Lắng nghe realtime sự kiện lịch trình thay đổi từ Supabase
    const subscription = supabase
      .channel('realtime-family-events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'family_events' },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Sửa lỗi thẻ <header>, <h1>, <p> của Web gây crash app */}
      <View style={styles.header}>
        <Text style={styles.title}>Lịch gia đình</Text>
        <Text style={styles.subtitle}>
          Hôm nay bạn có {events.length} sự kiện
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
      ) : events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có lịch trình nào.</Text>
          <Text style={styles.emptySubText}>Hãy thử nói với Gemini!</Text>
        </View>
      ) : (
        <View style={styles.eventList}>
          {events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>⏰ {event.start_time}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  eventList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      web: { boxShadow: '0px 4px 6px rgba(0,0,0,0.02)' },
      default: { elevation: 1, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 3 }
    })
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  }
});
