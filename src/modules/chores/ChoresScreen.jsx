import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';

const ChoresScreen = () => {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Hàm lấy danh sách việc nhà từ Supabase
  const fetchChores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('family_chores')
      .select('*')
      .order('is_completed', { ascending: true }) // Việc chưa làm xếp lên trước
      .order('created_at', { ascending: false });

    if (error) console.error('Lỗi lấy danh sách việc nhà:', error.message);
    else setChores(data);
    setLoading(false);
  };

  // 2. Hàm xử lý khi bấm nút Tích chọn hoàn thành việc nhà
  const toggleChoreComplete = async (id, currentStatus) => {
    const { error } = await supabase
      .from('family_chores')
      .update({ is_completed: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Lỗi cập nhật trạng thái:', error.message);
    } else {
      // Cập nhật lại giao diện ngay lập tức sau khi bấm (Trải nghiệm mượt mà)
      setChores(prevChores =>
        prevChores.map(chore =>
          chore.id === id ? { ...chore, is_completed: !currentStatus } : chore
        ).sort((a, b) => a.is_completed - b.is_completed) // Sắp xếp lại danh sách
      );
    }
  };

  useEffect(() => {
    fetchChores();
  }, []);

  return (
    <div style={styles.container}>
      {/* Tiêu đề Module */}
      <header style={styles.header}>
        <h1 style={styles.title}>Nhiệm vụ tuần này</h1>
        <p style={styles.subtitle}>Làm việc nhà hăng say - Tích điểm đổi quà hay</p>
      </header>

      {/* Danh sách nhiệm vụ */}
      <main style={styles.choreList}>
        {loading ? (
          <p style={styles.statusText}>Đang tải danh sách nhiệm vụ...</p>
        ) : chores.length === 0 ? (
          <p style={styles.statusText}>Hiện tại chưa có nhiệm vụ nào. Thảnh thơi thôi!</p>
        ) : (
          chores.map((chore) => (
            <div 
              key={chore.id} 
              style={{ 
                ...styles.card, 
                backgroundColor: chore.is_completed ? '#F3F4F6' : '#FFFFFF',
                opacity: chore.is_completed ? 0.7 : 1
              }}
            >
              {/* Nút Checkbox phong cách Apple tròn */}
              <button 
                onClick={() => toggleChoreComplete(chore.id, chore.is_completed)}
                style={{ 
                  ...styles.checkbox, 
                  backgroundColor: chore.is_completed ? '#10B981' : 'transparent',
                  borderColor: chore.is_completed ? '#10B981' : '#D1D5DB'
                }}
              >
                {chore.is_completed && '✓'}
              </button>

              {/* Nội dung công việc */}
              <div style={styles.cardContent}>
                <span style={{ 
                  ...styles.taskName, 
                  textDecoration: chore.is_completed ? 'line-through' : 'none',
                  color: chore.is_completed ? '#9CA3AF' : '#1F2937'
                }}>
                  {chore.task_name}
                </span>
                <span style={styles.pointsBadge}>+{chore.points} Điểm</span>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

// 3. Định nghĩa kiểu dáng giao diện hiện đại, tinh tế (Apple Gamification)
const styles = {
  container: { padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#F9FAFB', minHeight: '100vh' },
  header: { marginBottom: '30px' },
  title: { fontSize: '34px', fontWeight: '700', color: '#111827', margin: 0 },
  subtitle: { fontSize: '16px', color: '#10B981', fontWeight: '500', marginTop: '5px' },
  choreList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { display: 'flex', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', alignItems: 'center', transition: 'all 0.2s' },
  checkbox: { width: '26px', height: '26px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', marginRight: '15px', padding: 0, outline: 'none' },
  cardContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 },
  taskName: { fontSize: '17px', fontWeight: '600' },
  pointsBadge: { fontSize: '13px', fontWeight: '700', backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: '20px' },
  statusText: { textAlign: 'center', color: '#9CA3AF', marginTop: '50px' }
};

export default ChoresScreen;
