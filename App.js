import React, { useState } from 'react';
import CalendarScreen from './src/modules/calendar/CalendarScreen';
import ChoresScreen from './src/modules/chores/ChoresScreen';
import { processFamilyCommand } from './src/services/aiService';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar');
  const [commandText, setCommandText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendToGemini = async () => {
    if (!commandText.trim()) return;
    setIsLoading(true);
    const response = await processFamilyCommand(commandText);
    setIsLoading(false);
    if (response.success) {
      alert(`🤖 Gemini đã xử lý: Tự động thêm ${response.data.type === 'calendar' ? 'Lịch trình' : 'Việc nhà'} cho [${response.data.assignee}]!`);
      setCommandText('');
      // Tải lại trang để cập nhật dữ liệu mới
      window.location.reload();
    } else {
      alert("⚠️ Có lỗi xảy ra khi kết nối bộ não AI.");
    }
  };

  return (
    <div style={styles.container}>
      {/* KHU VỰC TRỢ LÝ AI GEMINI TRÊN ĐẦU APP */}
      <div style={styles.aiHeader}>
        <div style={styles.aiTitleBlock}>
          <span style={styles.aiIcon}>✨</span>
          <h3 style={styles.aiTitle}>Trợ lý Gia đình Gemini</h3>
        </div>
        <div style={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Mẹ dặn mai 8h đi siêu thị, Con lau nhà..." 
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            style={styles.inputStyle}
            disabled={isLoading}
          />
          <button onClick={handleSendToGemini} style={styles.buttonStyle} disabled={isLoading}>
            {isLoading ? 'Đang tính...' : 'Gửi AI'}
          </button>
        </div>
      </div>

      {/* MÀN HÌNH CHỨC NĂNG CHÍNH */}
      <div style={styles.mainContent}>
        {currentTab === 'calendar' ? <CalendarScreen /> : <ChoresScreen />}
      </div>

      {/* MENU ĐIỀU HƯỚNG DƯỚI ĐÁY */}
      <nav style={styles.tabBar}>
        <button 
          onClick={() => setCurrentTab('calendar')} 
          style={{...styles.tabButton, color: currentTab === 'calendar' ? '#007AFF' : '#8E8E93'}}
        >
          📅 Lịch trình
        </button>
        <button 
          onClick={() => setCurrentTab('chores')} 
          style={{...styles.tabButton, color: currentTab === 'chores' ? '#10B981' : '#8E8E93'}}
        >
          ✅ Việc nhà
        </button>
      </nav>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F3F4F6' },
  aiHeader: { backgroundColor: '#FFFFFF', padding: '16px', borderBottom: '1px solid #E5E5EA', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' },
  aiTitleBlock: { display: 'flex', alignItems: 'center', marginBottom: '10px' },
  aiIcon: { fontSize: '20px', marginRight: '8px' },
  aiTitle: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#1F2937' },
  inputGroup: { display: 'flex', gap: '8px' },
  inputStyle: { flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' },
  buttonStyle: { backgroundColor: '#5856D6', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer' },
  mainContent: { flex: 1, overflowY: 'auto', paddingBottom: '80px' },
  tabBar: { position: 'fixed', bottom: 0, left: 0, right: 0, height: '65px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E5EA', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000 },
  tabButton: { background: 'none', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }
};
