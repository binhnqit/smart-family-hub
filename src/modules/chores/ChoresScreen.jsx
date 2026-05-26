import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { processFamilyCommand } from '../../services/aiService';

export default function ChoresScreen() {
  const [chores, setChores] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchChores = async () => {
    const { data, error } = await supabase.from('family_chores').select('*').order('id', { ascending: false });
    if (!error && data) setChores(data);
  };

  useEffect(() => {
    fetchChores();
  }, []);

  const handleToggleComplete = async (id, currentStatus) => {
    const { error } = await supabase
      .from('family_chores')
      .update({ is_completed: !currentStatus })
      .eq('id', id);
    if (!error) fetchChores();
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    setLoading(true);
    const res = await processFamilyCommand(inputText);
    if (res.success) {
      setInputText('');
      fetchChores();
    } else {
      alert("⚠️ Lỗi phân tích lệnh AI. Hãy kiểm tra lại API Key.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* KHU VỰC NHẬP LỆNH AI CỤC BỘ */}
      <div style={styles.glassHeader}>
        <div style={styles.aiTitleRow}>
          <span style={styles.sparkleIcon}>✨</span>
          <span style={styles.aiHeaderTitle}>Hệ thống giao việc tự động</span>
        </div>
        <form onSubmit={handleAiSubmit} style={styles.searchBar}>
          <input 
            type="text"
            placeholder="Ví dụ: 'Giao Con quét nhà lau nhà thưởng 20 điểm'..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <button type="submit" style={styles.sendBtn} disabled={loading}>
            {loading ? <div style={styles.spinner}></div> : 'Giao Việc'}
          </button>
        </form>
      </div>

      <div style={styles.contentBody}>
        <h2 style={styles.sectionTitle}>✅ Danh sách công việc trong nhà</h2>

        {chores.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>🧼</div>
            <p style={styles.emptyText}>Nhà cửa sạch bong! Chưa có việc cần làm.</p>
            <p style={styles.emptySubText}>Gõ câu lệnh giao việc ở trên để phân phối công việc cho các thành viên nhé.</p>
          </div>
        ) : (
          <div style={styles.verticalList}>
            {chores.map((chore) => (
              <div 
                key={chore.id} 
                style={{
                  ...styles.choreCard, 
                  backgroundColor: chore.is_completed ? '#FAFAFA' : '#FFFFFF',
                  opacity: chore.is_completed ? 0.75 : 1
                }}
              >
                <div style={styles.leftSection}>
                  <label style={styles.checkboxContainer}>
                    <input 
                      type="checkbox" 
                      checked={chore.is_completed} 
                      onChange={() => handleToggleComplete(chore.id, chore.is_completed)}
                      style={styles.realCheckbox}
                    />
                    <span style={styles.customCheckbox}></span>
                  </label>
                  <div style={styles.textBlock}>
                    <span style={{
                      ...styles.choreTitle, 
                      textDecoration: chore.is_completed ? 'line-through' : 'none',
                      color: chore.is_completed ? '#9CA3AF' : '#1F2937'
                    }}>
                      {chore.title}
                    </span>
                    <span style={styles.assigneeBadge}>👤 {chore.assignee}</span>
                  </div>
                </div>
                <div style={styles.rightSection}>
                  <span style={{...styles.coinBadge, backgroundColor: chore.is_completed ? '#E5E7EB' : '#FEF3C7', color: chore.is_completed ? '#6B7280' : '#D97706'}}>
                    🪙 +{chore.points} Điểm
                  </span>
                </div>
              </div>
            ))}
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
  sparkleIcon: { fontSize: '18px' },
  aiHeaderTitle: { fontWeight: '600', fontSize: '14px', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px' },
  searchBar: { display: 'flex', gap: '12px' },
  input: { flex: 1, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', padding: '14px 20px', borderRadius: '16px', fontSize: '15px', color: '#1F2937', outline: 'none' },
  sendBtn: { backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', padding: '0 24px', borderRadius: '16px', fontWeight: '600', fontSize: '15px', cursor: 'pointer' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '20px', letterSpacing: '-0.5px' },
  emptyContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px dashed #E5E7EB', textAlign: 'center' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyText: { fontWeight: '600', color: '#374151', fontSize: '16px', margin: '0 0 8px 0' },
  emptySubText: { color: '#9CA3AF', fontSize: '14px', maxWidth: '360px', margin: 0 },
  verticalList: { display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '800px' },
  choreCard: { border: '1px solid #F3F4F6', padding: '18px 24px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)', transition: 'all 0.2s' },
  leftSection: { display: 'flex', alignItems: 'center', gap: '16px' },
  checkboxContainer: { position: 'relative', display: 'inline-block', width: '22px', height: '22px', cursor: 'pointer' },
  realCheckbox: { width: '22px', height: '22px', cursor: 'pointer' },
  textBlock: { display: 'flex', flexDirection: 'column', gap: '4px' },
  choreTitle: { fontSize: '16px', fontWeight: '600' },
  assigneeBadge: { fontSize: '13px', color: '#6366F1', fontWeight: '500' },
  rightSection: { display: 'flex', alignItems: 'center' },
  coinBadge: { padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' },
  spinner: { width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF', borderRadius: '50%' }
};
