import React, { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import CountupTimer from './CountupTimer';

const TimerTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'countdown' | 'countup'>('countdown');

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* タブ切り替え */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('countdown')}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: activeTab === 'countdown' ? '#4f46e5' : '#e5e7eb',
            color: activeTab === 'countdown' ? 'white' : 'black',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Countdown
        </button>
        <button
          onClick={() => setActiveTab('countup')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'countup' ? '#4f46e5' : '#e5e7eb',
            color: activeTab === 'countup' ? 'white' : 'black',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Countup
        </button>
      </div>

      {/* 切り替え表示 */}
      {activeTab === 'countdown' ? <CountdownTimer /> : <CountupTimer />}
    </div>
  );
};

export default TimerTabs;
