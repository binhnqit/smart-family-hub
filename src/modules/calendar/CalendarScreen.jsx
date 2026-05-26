import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { processFamilyCommand } from '../../services/aiService';

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Hàm tải dữ liệu lịch từ Supabase về app
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

  const handleVoiceSubmit = async () => {
    if (!inputText.trim()) return;
    setLoading(false);
    setLoading(true);
    const res = await processFamilyCommand(inputText);
    if (res.success) {
      setInputText('');
      fetchCalendar(); // Tải lại danh sách realtime
    } else {
      alert("Lỗi kết nối bộ não AI");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Ô NHẬP LIỆU AI NẰM TRONG APP */}
      <div style={styles.aiBox}>
        <input 
          type="text"
          placeholder="✨ Thêm lịch nhanh (Ví dụ: Mai 8h Mẹ đi khám bệnh)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <button onClick={handleVoiceSubmit} style={styles.btn} disabled={loading}>
          {loading ? '...' : 'Gửi'}
        </button>
      </div>

      <h2 style={styles.title}>📅 Lịch trình gia đình</h2>
      
      {events.length === 0 ? (
        <p style={styles.emptyText}>Chưa có lịch trình nào. Hãy thử nhập câu lệnh ở ô trên!</p>
      ) : (
        <div style={styles.list}>
          {events.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardLeft}>
                <span style={styles.badge}>{item.assignee}</span>
                <h4 style={styles.eventTitle}>{item.title}</h4>
              </div>
              <div style={styles.cardRight}>
                <span style={styles.dateText}>📅 {item.event_date}</span>
                <span style={styles.timeText}>⏰ {item.event_time || 'Cả ngày'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '20px', maxWidth: '600px', margin: '0 auto' },
  aiBox: { display: 'flex', gap: '10px', backgroundColor: '#FFF', padding: '12px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' },
  input: { flex: 1, border: 'none', backgroundColor: '#F3F4F6', padding: '12px', borderRadius: '12px', fontSize: '14px', outline: 'none' },
  btn: { backgroundColor: '#5856D6', color: '#FFF', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' },
  title: { fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#1C1C1E' },
  emptyText: { color: '#8E8E93', fontSize: '14px', textAlign: 'center', marginTop: '40px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { backgroundColor: '#FFF', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '5px solid #007AFF' },
  cardLeft: { display: 'flex', flexDirection: 'column', gap: '6px' },
  badge: { backgroundColor: '#E1F5FE', color: '#0288D1', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', width: 'fit-content' },
  eventTitle: { margin: 0, fontSize: '16px', color: '#2C3E50', fontWeight: '600' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', fontSize: '13px', color: '#666' }
};
