import React, { useState } from 'react';
// Sửa lại đường dẫn cho đúng cấu trúc thư mục: src/modules/...
import CalendarScreen from './src/modules/calendar/CalendarScreen';
import ChoresScreen from './src/modules/chores/ChoresScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar');

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {currentTab === 'calendar' ? <CalendarScreen /> : <ChoresScreen />}
      </div>

      <nav style={styles.tabBar}>
        <button 
          onClick={() => setCurrentTab('calendar')} 
          style={{...styles.tabButton, color: currentTab === 'calendar' ? '#6366F1' : '#8E8E93'}}
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
  container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F8F9FA' },
  mainContent: { flex: 1, overflowY: 'auto', paddingBottom: '80px' },
  tabBar: { position: 'fixed', bottom: 0, left: 0, right: 0, height: '65px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E5EA', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000, boxShadow: '0px -2px 10px rgba(0,0,0,0.03)' },
  tabButton: { background: 'none', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }
};
