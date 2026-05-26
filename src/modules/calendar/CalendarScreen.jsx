import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { processFamilyCommand } from '../../services/aiService';

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

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    setLoading(true);
    const res = await processFamilyCommand(inputText);
    if (res.success) {
      setInputText('');
      fetchCalendar();
    } else {
      alert("⚠️ Lỗi phân tích lệnh AI. Hãy kiểm tra lại API Key.");
    }
    setLoading(false);
  };

  // Hàm gán màu sắc tinh tế cho từng thành viên trong nhà
  const getAssigneeStyle = (name) => {
    switch (name) {
      case 'Bố': return { bg: '#EBF5FF', color: '#007AFF', border: '#C2E0FF' };
      case 'Mẹ': return { bg: '#FFF0F6', color: '#FF2D55', border: '#FFD6E7' };
      case 'Con': return { bg: '#E8FBF2', color: '#34C759', border: '#C7F5DE' };
      default: return { bg: '#F2F2F7', color: '#1C1C1E', border: '#E5E5EA' };
    }
  };

  return (
    <div style={styles.container}>
      {/* KHU VỰC NHẬP LỆNH AI CỤC BỘ */}
      <div style={styles.glassHeader}>
        <div style={styles.aiTitleRow}>
          <span style={styles.sparkleIcon}>✨</span>
          <span style={styles.aiHeaderTitle}>Trợ lý Lịch trình thông minh</span>
        </div>
        <form onSubmit={handleAiSubmit} style={styles.searchBar}>
          <input 
            type="text"
            placeholder="Ví dụ: 'Mẹ dặn chiều mai 15h họp phụ huynh cho con'..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <button type="submit" style={styles.sendBtn} disabled={loading}>
            {loading ? <div style={styles.spinner}></div> : 'Gửi AI'}
          </button>
        </form>
      </div>

      <div style={styles.contentBody}>
        <h2 style={styles.sectionTitle}>📅 Dòng thời gian sự kiện</h2>
        
        {events.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>🗓️</div>
            <p style={styles.emptyText}>Chưa có lịch trình nào được ghi nhận.</p>
            <p style={styles.emptySubText}>Hãy nhập một câu lệnh tự nhiên ở ô phía trên để Trợ lý Gemini tự động sắp xếp lịch giúp bạn.</p>
          </div>
        ) : (
          <div style={styles.gridList}>
            {events.map((item) => {
              const uStyle = getAssigneeStyle(item.assignee);
              return (
                <div key={item.id} style={styles.eventCard}>
                  <div style={styles.cardHeader}>
                    <span style={{...styles.badge, backgroundColor: uStyle.bg, color: uStyle.color, borderColor: uStyle.border}}>
                      👤 {item.assignee}
                    </span>
                    <div style={styles.dateTimeBadge}>
                      <span>⏱️ {item.event_time ? item.event_time.substring(0, 5) : 'Cả ngày'}</span>
                    </div>
                  </div>
                  <h3 style={styles.eventTitle}>{item.title}</h3>
                  <div style={styles.cardFooter}>
                    <span style={styles.dateLabel}>🗓️ {item.event_date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '24px', backgroundColor: '#F8F9FA', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  glassHeader: { background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.5)', padding: '20px', borderRadius: '24px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)', marginBottom: '32px' },
  aiTitleRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  sparkleIcon: { fontSize: '18px', animation: 'pulse 2s infinite' },
  aiHeaderTitle: { fontWeight: '600', fontSize: '14px', color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.5px' },
  searchBar: { display: 'flex', gap: '12px' },
  input: { flex: 1, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', padding: '14px 20px', borderRadius: '16px', fontSize: '15px', color: '#1F2937', outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' },
  sendBtn: { backgroundColor: '#6366F1', color: '#FFFFFF', border: 'none', padding: '0 24px', borderRadius: '16px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '20px', letterSpacing: '-0.5px' },
  emptyContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px dashed #E5E7EB', textAlign: 'center' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyText: { fontWeight: '600', color: '#374151', fontSize: '16px', margin: '0 0 8px 0' },
  emptySubText: { color: '#9CA3AF', fontSize: '14px', maxWidth: '360px', margin: 0, lineHeight: '1.5' },
  gridList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  eventCard: { backgroundColor: '#FFFFFF', border: '1px solid #F3F4F6', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, boxShadow 0.2s', cursor: 'pointer' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  badge: { padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', border: '1px solid' },
  dateTimeBadge: { backgroundColor: '#F3F4F6', color: '#4B5563', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' },
  eventTitle: { fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 16px 0', lineHeight: '1.4', flex: 1 },
  cardFooter: { borderTop: '1px solid #F3F4F6', paddingTop: '12px', display: 'flex', justifyContent: 'flex-start' },
  dateLabel: { fontSize: '13px', color: '#6B7280', fontWeight: '500' },
  spinner: { width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
};
