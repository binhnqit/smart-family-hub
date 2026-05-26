import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';

const CalendarScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Hàm lấy dữ liệu lịch trình từ "cuốn sổ cái" Supabase
  const fetchFamilyEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('family_events')
      .select('*')
      .order('start_time', { ascending: true }); // Sắp xếp theo thời gian sớm nhất lên đầu

    if (error) console.error('Lỗi lấy lịch trình:', error.message);
    else setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFamilyEvents();
  }, []);

  return (
    <div style={styles.container}>
      {/* Tiêu đề phong cách Apple chuẩn */}
      <header style={styles.header}>
        <h1 style={styles.title}>Lịch gia đình</h1>
        <p style={styles.subtitle}>Hôm nay bạn có {events.length} sự kiện</p>
      </header>

      {/* Danh sách các thẻ sự kiện (Event Cards) */}
      <main style={styles.eventList}>
        {loading ? (
          <p style={styles.statusText}>Đang cập nhật lịch...</p>
        ) : events.length === 0 ? (
          <p style={styles.statusText}>Chưa có lịch trình nào. Hãy thử nói với Gemini!</p>
        ) : (
          events.map((event) => (
            <div key={event.id} style={styles.card}>
              <div style={{ ...styles.indicator, backgroundColor: getColorByMember(event.assigned_to) }}></div>
              <div style={styles.cardContent}>
                <h3 style={styles.eventTitle}>{event.title}</h3>
                <p style={styles.eventTime}>
                  {new Date(event.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} 
                  - {event.assigned_to === 'all' ? 'Cả nhà' : event.assigned_to}
                </p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

// 2. Hàm hỗ trợ: Tự động đổi màu dựa trên thành viên (Pastel Style)
const getColorByMember = (member) => {
  const colors = {
    'all': '#E2E8F0', // Xám nhẹ nhã nhặn
    'Bố': '#93C5FD',  // Xanh Pastel
    'Mẹ': '#FCA5A5',  // Hồng Pastel
    'Con': '#C4B5FD'  // Tím Pastel
  };
  return colors[member] || '#D1D5DB';
};

// 3. Định nghĩa kiểu dáng giao diện (CSS-in-JS) - Apple Minimalist
const styles = {
  container: { padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#F9FAFB', minHeight: '100vh' },
  header: { marginBottom: '30px' },
  title: { fontSize: '34px', fontWeight: '700', color: '#111827', margin: 0 },
  subtitle: { fontSize: '16px', color: '#6B7280', marginTop: '5px' },
  eventList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', alignItems: 'center' },
  indicator: { width: '6px', height: '40px', borderRadius: '3px', marginRight: '15px' },
  cardContent: { display: 'flex', flexDirection: 'column' },
  eventTitle: { fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: 0 },
  eventTime: { fontSize: '14px', color: '#9CA3AF', marginTop: '4px' },
  statusText: { textAlign: 'center', color: '#9CA3AF', marginTop: '50px' }
};

export default CalendarScreen;
