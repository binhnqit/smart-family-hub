import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { processFamilyCommand } from '../../services/aiService';

export default function ChoresScreen() {
  const [chores, setChores] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchChores = async () => {
    const { data, error } = await supabase.from('family_chores').select('*');
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

  const handleAiSubmit = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    const res = await processFamilyCommand(inputText);
    if (res.success) {
      setInputText('');
      fetchChores();
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.aiBox}>
        <input 
          type="text"
          placeholder="✨ Giao việc nhà nhanh (Ví dụ: Giao Con rửa bát 20 điểm)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <button onClick={handleAiSubmit} style={styles.btn} disabled={loading}>
          {loading ? '...' : 'Giao'}
        </button>
      </div>

      <h2 style={styles.title}>✅ Danh sách việc nhà</h2>

      {chores.length === 0 ? (
        <p style={styles.emptyText}>Chưa có việc nhà nào được giao.</p>
      ) : (
        <div style={styles.list}>
          {chores.map((chore) => (
            <div key={chore.id} style={{...styles.card, borderLeft: chore.is_completed ? '5px solid #34C759' : '5px solid #FF9500'}}>
              <div style={styles.left}>
                <input 
                  type="checkbox" 
                  checked={chore.is_completed} 
                  onChange={() => handleToggleComplete(chore.id, chore.is_completed)}
                  style={styles.checkbox}
                />
                <span style={{...styles.choreTitle, textDecoration: chore.is_completed ? 'line-through' : 'none', color: chore.is_completed ? '#8E8E93' : '#1C1C1E'}}>
                  {chore.title} <span style={styles.assignee}>({chore.assignee})</span>
                </span>
              </div>
              <span style={styles.points}>🪙 +{chore.points}đ</span>
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
  btn: { backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' },
  title: { fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#1C1C1E' },
  emptyText: { color: '#8E8E93', fontSize: '14px', textAlign: 'center', marginTop: '40px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { backgroundColor: '#FFF', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  left: { display: 'flex', alignItems: 'center', gap: '12px' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  choreTitle: { fontSize: '15px', fontWeight: '500' },
  assignee: { fontStyle: 'italic', fontSize: '13px', color: '#007AFF' },
  points: { fontWeight: '700', color: '#FF9500', fontSize: '14px' }
};
