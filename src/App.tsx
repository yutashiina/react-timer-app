import React from 'react';
import TimerTabs from './components/TimerTabs';

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{textAlign: "center"}}>TIMER</h1>
      <p style={{textAlign: "center"}}><a href="https://github.com/yutashiina/react-timer-app.git" target="_blank">ソースコード</a></p>
      <TimerTabs />
    </div>
  );
};

export default App;
