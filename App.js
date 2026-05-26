import React, { useState } from 'react';
import CalendarScreen from './src/modules/calendar/CalendarScreen';
import ChoresScreen from './src/modules/chores/ChoresScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('calendar'); // 'calendar' hoặc 'chores'

  return (
    <div style={styles.container}>
      {/* Màn hình chức năng tương ứng */}
      <div style={styles.mainContent}>
        {currentTab === 'calendar' ? <CalendarScreen /> : <ChoresScreen />}
      </div>

      {/* Thanh Menu điều hướng dưới đáy điện thoại (Bottom Tab Bar) */}
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
  container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F9FAFB' },
  mainContent: { flex: 1, overflowY: 'auto', paddingBottom: '80px' },
  tabBar: { position: 'fixed', bottom: 0, left: 0, right: 0, height: '65px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E5EA', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000 },
  tabButton: { background: 'none', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', padding: '10px' }
};
