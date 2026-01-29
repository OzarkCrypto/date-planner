'use client';

import { useState } from 'react';

const modes = [
  {
    id: 1,
    name: '소박한 노포',
    emoji: '🍜',
    description: '오래된 맛집, 저렴하고 정겨운',
    budget: '~SGD 15/인',
    color: '#D4A373',
  },
  {
    id: 2,
    name: '분위기 캐주얼',
    emoji: '🍷',
    description: '괜찮은 분위기, 부담없는 가격',
    budget: '~SGD 40/인',
    color: '#E07A5F',
  },
  {
    id: 3,
    name: '기념일 스페셜',
    emoji: '✨',
    description: '특별한 날, 파인다이닝급',
    budget: '~SGD 100+/인',
    color: '#3D405B',
  },
];

export default function Home() {
  const [selectedMode, setSelectedMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!selectedMode) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: selectedMode }),
      });

      if (!response.ok) {
        throw new Error('추천 생성에 실패했습니다');
      }

      const data = await response.json();
      setResult(data.recommendation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>이번 주말 어디갈까?</h1>
          <p style={styles.subtitle}>싱가포르 데이트 코스 추천</p>
        </header>

        <section style={styles.modeSection}>
          <p style={styles.label}>오늘의 무드</p>
          <div style={styles.modeGrid}>
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                style={{
                  ...styles.modeCard,
                  borderColor: selectedMode === mode.id ? mode.color : '#E8E4E1',
                  backgroundColor: selectedMode === mode.id ? `${mode.color}15` : '#FDFCFB',
                }}
              >
                <span style={styles.modeEmoji}>{mode.emoji}</span>
                <span style={styles.modeName}>{mode.name}</span>
                <span style={styles.modeDesc}>{mode.description}</span>
                <span style={{ ...styles.modeBudget, color: mode.color }}>{mode.budget}</span>
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleGenerate}
          disabled={!selectedMode || loading}
          style={{
            ...styles.generateBtn,
            opacity: !selectedMode || loading ? 0.5 : 1,
            cursor: !selectedMode || loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '코스 짜는 중...' : '데이트 코스 추천받기'}
        </button>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {result && (
          <section style={styles.resultSection}>
            <h2 style={styles.resultTitle}>추천 데이트 코스</h2>
            <div style={styles.resultContent}>
              {result}
            </div>
          </section>
        )}

        <footer style={styles.footer}>
          <p>📍 Aljunied/Geylang 기준 30분~1시간 이내</p>
        </footer>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #FDF8F3 0%, #F5EDE4 100%)',
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2D2A26',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8B8680',
    margin: 0,
  },
  modeSection: {
    marginBottom: '32px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B6560',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  modeGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  modeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '20px',
    border: '2px solid',
    borderRadius: '16px',
    background: '#FDFCFB',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  modeEmoji: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  modeName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: '4px',
  },
  modeDesc: {
    fontSize: '14px',
    color: '#8B8680',
    marginBottom: '8px',
  },
  modeBudget: {
    fontSize: '13px',
    fontWeight: '600',
  },
  generateBtn: {
    width: '100%',
    padding: '18px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#2D2A26',
    border: 'none',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    marginBottom: '24px',
  },
  error: {
    padding: '16px',
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    borderRadius: '12px',
    fontSize: '14px',
    marginBottom: '24px',
  },
  resultSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  resultTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2A26',
    margin: '0 0 16px 0',
  },
  resultContent: {
    fontSize: '15px',
    lineHeight: '1.8',
    color: '#4A4640',
    whiteSpace: 'pre-wrap',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#8B8680',
  },
};
