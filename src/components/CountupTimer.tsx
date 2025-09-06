import React, { useState, useEffect, useRef } from 'react';

const CountupTimer: React.FC = () => {
  const [inputMinutes, setInputMinutes] = useState<string>('0');
  const [inputSeconds, setInputSeconds] = useState<string>('10');
  const [seconds, setSeconds] = useState(0); // 秒表示用
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pauseTime, setPauseTime] = useState<number | null>(null);
  const requestRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  // useEffect内で animate 定義（ESLint対応）
  useEffect(() => {
    if (!isActive || !startTime) return;

    const animate = () => {
      const now = Date.now();
      const elapsedMs = (pauseTime ?? now) - startTime;
      const elapsedSec = Math.floor(elapsedMs / 1000);

      // 秒表示は state 更新
      setSeconds(elapsedSec >= totalSeconds ? totalSeconds : elapsedSec);

      // バーは DOM 直更新
      if (barRef.current) {
        const progress = Math.min(100, (elapsedMs / (totalSeconds * 1000)) * 100);
        barRef.current.style.width = `${progress}%`;
      }

      if (elapsedSec < totalSeconds && isActive) {
        requestRef.current = requestAnimationFrame(animate);
      } else if (elapsedSec >= totalSeconds) {
        setIsActive(false);

        // 音アラート
        if (audioRef.current) audioRef.current.play().catch(() => {});

        // 通知
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('カウントアップ終了', { body: '目標時間に到達しました！' });
        }
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, startTime, pauseTime, totalSeconds]);

  const handleStart = () => {
    const mins = parseInt(inputMinutes);
    const secs = parseInt(inputSeconds);

    if (isNaN(mins) || mins < 0 || isNaN(secs) || secs < 0 || secs > 59) {
      alert('正しい時間を入力してください（秒は0〜59）');
      return;
    }

    const total = mins * 60 + secs;
    setTotalSeconds(total);
    setSeconds(0);
    setStartTime(Date.now());
    setPauseTime(null);
    setIsActive(true);

    // 音の初期解放
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current!.pause();
        audioRef.current!.currentTime = 0;
      }).catch(() => {});
    }

    // 通知権限
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const togglePause = () => {
    if (isActive) {
      setIsActive(false);
      setPauseTime(Date.now());
    } else {
      if (pauseTime && startTime) {
        setStartTime(startTime + (Date.now() - pauseTime));
      }
      setPauseTime(null);
      setIsActive(true);
    }
  };

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
    setStartTime(null);
    setPauseTime(null);
    if (barRef.current) barRef.current.style.width = '0%';
  };

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Countup Timer</h2>

      {/* 目標時間入力 */}
      <div>
        <input
          type="number"
          min="0"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          style={{ width: '50px' }}
        />
        <span>分</span>
        <input
          type="number"
          min="0"
          max="59"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(e.target.value)}
          style={{ width: '50px', marginLeft: '10px' }}
        />
        <span>秒</span>
      </div>

      {/* 経過時間 */}
      <p style={{ fontSize: '2rem' }}>{formatTime(seconds)}</p>

      {/* 進捗バー */}
      <div
        style={{
          width: '300px',
          height: '20px',
          background: '#eee',
          margin: '10px auto',
          borderRadius: '10px',
        }}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '0%',
            background: '#16a34a',
            borderRadius: '10px',
          }}
        />
      </div>

      {/* ボタン */}
      {!isActive && seconds === 0 ? (
        <button onClick={handleStart}>Start</button>
      ) : (
        <button onClick={togglePause}>{isActive ? 'Pause' : 'Resume'}</button>
      )}
      <button onClick={reset} style={{ marginLeft: '10px' }}>Reset</button>

      {/* 音 */}
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" />
    </div>
  );
};

export default CountupTimer;
