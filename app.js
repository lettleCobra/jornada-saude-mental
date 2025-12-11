const { useState, useEffect, useRef } = React;

const MentalHealthApp = () => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({ 
    name: 'Usuário', 
    photo: null, 
    gender: '', 
    age: '', 
    level: 1, 
    xp: 0, 
    streak: 0 
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...userProfile });
  const [mascotName, setMascotName] = useState('Luna');
  const [mascotType, setMascotType] = useState('cat');
  const [mascotAccessory, setMascotAccessory] = useState('none');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(mascotName);
  const [showShareCard, setShowShareCard] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [completedSelfCare, setCompletedSelfCare] = useState(new Set());
  const [timerActive, setTimerActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const chatScrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', message: 'Olá! Sou seu assistente de bem-estar mental. Como você está se sentindo hoje?', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [dailyMood, setDailyMood] = useState(null);

  const challenges = [
    { id: 1, title: 'Meditação Matinal', duration: 300, icon: '🧘', xp: 50, color: '#60A5FA' },
    { id: 2, title: 'Respiração 4-7-8', duration: 180, icon: '🌬️', xp: 30, color: '#34D399' },
    { id: 3, title: 'Diário da Gratidão', duration: 240, icon: '📝', xp: 40, color: '#FBBF24' },
    { id: 4, title: 'Caminhada Mindful', duration: 600, icon: '🚶', xp: 60, color: '#A78BFA' },
    { id: 5, title: 'Música Terapêutica', duration: 420, icon: '🎵', xp: 45, color: '#F472B6' },
    { id: 6, title: 'Autocompaixão', duration: 300, icon: '💝', xp: 50, color: '#EF4444' }
  ];

  const selfCareActivities = [
    { id: 1, title: 'Tomar um banho relaxante', icon: '🛁', category: 'Físico', xp: 20 },
    { id: 2, title: 'Ler um livro inspirador', icon: '📚', category: 'Mental', xp: 25 },
    { id: 3, title: 'Preparar uma refeição nutritiva', icon: '🥗', category: 'Físico', xp: 30 },
    { id: 4, title: 'Conversar com um amigo querido', icon: '💬', category: 'Social', xp: 35 },
    { id: 5, title: 'Praticar yoga ou alongamento', icon: '🧘‍♀️', category: 'Físico', xp: 40 },
    { id: 6, title: 'Organizar seu espaço pessoal', icon: '🏠', category: 'Mental', xp: 25 },
    { id: 7, title: 'Assistir algo que te faça sorrir', icon: '😊', category: 'Emocional', xp: 20 },
    { id: 8, title: 'Fazer algo criativo', icon: '🎨', category: 'Mental', xp: 30 }
  ];

  const mascotTypes = [
    { id: 'cat', name: 'Gato', base: '🐱' }, 
    { id: 'dog', name: 'Cachorro', base: '🐶' },
    { id: 'rabbit', name: 'Coelho', base: '🐰' }, 
    { id: 'fox', name: 'Raposa', base: '🦊' },
    { id: 'panda', name: 'Panda', base: '🐼' }, 
    { id: 'bear', name: 'Urso', base: '🐻' }
  ];

  const mascotAccessories = [
    { id: 'none', name: 'Nenhum', emoji: '◯' }, 
    { id: 'crown', name: 'Coroa', emoji: '👑' },
    { id: 'hat', name: 'Chapéu', emoji: '🎩' }, 
    { id: 'flower', name: 'Flor', emoji: '🌸' },
    { id: 'star', name: 'Estrela', emoji: '⭐' }, 
    { id: 'glasses', name: 'Óculos', emoji: '🕶️' }
  ];

  useEffect(() => {
    let interval;
    if (timerActive && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(time => {
          if (time <= 1) {
            setTimerActive(false);
            if (selectedChallenge) {
              setCompletedChallenges(prev => new Set([...prev, selectedChallenge.id]));
              const newXP = userProfile.xp + selectedChallenge.xp;
              const newLevel = Math.floor(newXP / 100) + 1;
              const newStreak = completedChallenges.size === 0 ? userProfile.streak + 1 : userProfile.streak;
              setUserProfile(prev => ({ 
                ...prev, 
                xp: newXP,
                level: newLevel,
                streak: newStreak
              }));
              alert(`🎉 Parabéns! Você completou: ${selectedChallenge.title}\n+${selectedChallenge.xp} XP`);
              setSelectedChallenge(null);
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, currentTime, selectedChallenge, userProfile.xp, userProfile.streak, completedChallenges.size]);

  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeTab]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startChallenge = (challenge) => {
    if (completedChallenges.has(challenge.id)) {
      alert('Você já completou este desafio hoje! ✓\n\nVolte amanhã para novos desafios.');
      return;
    }
    setSelectedChallenge(challenge);
    setCurrentTime(challenge.duration);
    setTimerActive(true);
  };

  const toggleTimer = () => setTimerActive(!timerActive);
  
  const resetTimer = () => {
    if (window.confirm('Deseja realmente cancelar este desafio?')) {
      setTimerActive(false);
      setSelectedChallenge(null);
      setCurrentTime(0);
    }
  };

  const resetAllChallenges = () => {
    if (window.confirm('🔄 Resetar todos os desafios?\n\nIsso marcará todos os desafios como não concluídos.')) {
      setCompletedChallenges(new Set());
      setSelectedChallenge(null);
      setTimerActive(false);
      setCurrentTime(0);
      alert('✓ Desafios resetados com sucesso!');
    }
  };

  const resetAllSelfCare = () => {
    if (window.confirm('🔄 Resetar atividades de autocuidado?\n\nIsso marcará todas as atividades como não concluídas.')) {
      setCompletedSelfCare(new Set());
      alert('✓ Atividades resetadas com sucesso!');
    }
  };

  const toggleSelfCareComplete = (activity) => {
    setCompletedSelfCare(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activity.id)) {
        newSet.delete(activity.id);
        setUserProfile(prevProfile => ({ 
          ...prevProfile, 
          xp: Math.max(0, prevProfile.xp - activity.xp),
          level: Math.floor(Math.max(0, prevProfile.xp - activity.xp) / 100) + 1
        }));
      } else {
        newSet.add(activity.id);
        const newXP = userProfile.xp + activity.xp;
        const newLevel = Math.floor(newXP / 100) + 1;
        setUserProfile(prevProfile => ({ 
          ...prevProfile, 
          xp: newXP,
          level: newLevel
        }));
      }
      return newSet;
    });
  };

  const generateAIResponse = (userMessage) => {
    const responses = {
      'oi': 'Olá! Como você está se sentindo hoje? Estou aqui para te apoiar.',
      'olá': 'Olá! Como você está se sentindo hoje? Estou aqui para te apoiar.',
      'triste': 'Sinto muito que você esteja triste. Seus sentimentos são válidos. Que tal um exercício de respiração?',
      'ansioso': 'A ansiedade pode ser desafiadora. Que tal experimentar a técnica 4-7-8? Respire fundo por 4 segundos, segure por 7 e solte em 8.',
      'ansiosa': 'A ansiedade pode ser desafiadora. Que tal experimentar a técnica 4-7-8? Respire fundo por 4 segundos, segure por 7 e solte em 8.',
      'feliz': 'Que maravilha! Continue cultivando esses momentos positivos. O que te deixou feliz hoje?',
      'cansado': 'Reconhecer o cansaço é importante. Que tal fazer uma pausa e praticar autocuidado?',
      'cansada': 'Reconhecer o cansaço é importante. Que tal fazer uma pausa e praticar autocuidado?',
      'default': [
        'Entendo. Pode me contar mais sobre isso?', 
        'Seus sentimentos são totalmente válidos.', 
        'Você é mais forte do que imagina. Estou aqui para apoiar você.',
        'Como posso te ajudar melhor neste momento?'
      ]
    };
    
    const message = userMessage.toLowerCase().trim();
    for (const [key, response] of Object.entries(responses)) {
      if (key !== 'default' && message.includes(key)) return response;
    }
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setChatMessages([...chatMessages, { 
      type: 'user', 
      message: inputMessage, 
      timestamp: new Date() 
    }]);
    
    setIsTyping(true);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: generateAIResponse(inputMessage), 
        timestamp: new Date() 
      }]);
      setIsTyping(false);
    }, 1500);
    
    setInputMessage('');
  };

  const saveMascotName = () => {
    if (tempName.trim()) {
      setMascotName(tempName);
      setIsEditingName(false);
    } else {
      alert('Por favor, digite um nome para o mascote');
    }
  };

  const getMascotDisplay = () => {
    const baseEmoji = mascotTypes.find(t => t.id === mascotType)?.base || '🐱';
    const accessory = mascotAccessories.find(a => a.id === mascotAccessory)?.emoji || '';
    return accessory !== '◯' ? `${baseEmoji}${accessory}` : baseEmoji;
  };

  const saveProfileChanges = () => {
    if (!tempProfile.name.trim()) {
      alert('Por favor, digite seu nome');
      return;
    }
    setUserProfile(tempProfile);
    setIsEditingProfile(false);
    alert('✓ Perfil atualizado com sucesso!');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert('Arquivo muito grande! Escolha uma imagem menor que 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempProfile({ ...tempProfile, photo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    if (window.confirm('Remover foto do perfil?')) {
      setTempProfile({ ...tempProfile, photo: null });
    }
  };

  const handleShare = (platform) => {
    const stats = `🔥 ${userProfile.streak} dias\n🎯 ${completedChallenges.size} desafios\n💝 ${completedSelfCare.size} atividades\n⚡ ${userProfile.xp} XP`;
    alert(`Compartilhar no ${platform}\n\n${userProfile.name} está na Jornada da Saúde Mental! 🧘\n\n${stats}`);
    setShowShareCard(false);
  };

  const theme = {
    bg: darkMode ? '#111827' : '#F0F9FF',
    card: darkMode ? '#1F2937' : '#FFFFFF',
    text: darkMode ? '#F3F4F6' : '#1F2937',
    textSec: darkMode ? '#9CA3AF' : '#6B7280',
    border: darkMode ? '#374151' : '#E5E7EB',
    input: darkMode ? '#374151' : '#FFFFFF',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366F1', textAlign: 'center', margin: 0 }}>
              Jornada da Saúde Mental
            </h1>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: theme.text }}>
                🔥 {userProfile.streak}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: theme.text }}>
                ⭐ Nível {userProfile.level}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: theme.text }}>
                ⚡ {userProfile.xp} XP
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={(e) => setDarkMode(e.target.checked)}
                style={{ width: '40px', height: '20px' }}
              />
            </label>
            <button 
              onClick={() => setShowProfile(true)}
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                border: 'none', 
                backgroundColor: darkMode ? '#374151' : '#F3F4F6',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              👤
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding: '12px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          backgroundColor: theme.card, 
          borderRadius: '12px', 
          padding: '4px',
          gap: '4px'
        }}>
          {[
            { id: 'challenges', icon: '🎯', label: 'Desafios' },
            { id: 'selfcare', icon: '💝', label: 'Autocuidado' },
            { id: 'mascot', icon: '✨', label: 'Mascote' },
            { id: 'chat', icon: '💬', label: 'Chat IA' },
            { id: 'insights', icon: '📊', label: 'Insights' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#6366F1' : 'transparent',
                color: activeTab === tab.id ? '#FFF' : '#6B7280',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px 80px' }}>
        {activeTab === 'challenges' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: theme.text, margin: '0 0 8px' }}>
              Desafios Diários
            </h2>
            <p style={{ fontSize: '14px', textAlign: 'center', color: theme.textSec, margin: '0 0 16px' }}>
              Complete os exercícios para fortalecer sua mente
            </p>
            
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366F1' }}>
                  {completedChallenges.size}/{challenges.length}
                </div>
                <div style={{ fontSize: '12px', color: theme.textSec, marginTop: '4px' }}>Concluídos</div>
              </div>
            </div>

            {completedChallenges.size > 0 && (
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <button
                  onClick={resetAllChallenges}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#EF4444',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Resetar Todos os Desafios
                </button>
              </div>
            )}

            {selectedChallenge && (
              <div style={{ 
                padding: '20px', 
                borderRadius: '16px', 
                border: `1px solid ${theme.border}`, 
                backgroundColor: theme.card, 
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: theme.textSec, marginBottom: '4px' }}>
                  Atividade Atual
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: theme.text, marginBottom: '12px' }}>
                  {selectedChallenge.title}
                </div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#6366F1', marginBottom: '16px' }}>
                  {formatTime(currentTime)}
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={toggleTimer}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '25px',
                      border: 'none',
                      backgroundColor: timerActive ? '#EF4444' : '#10B981',
                      color: '#FFF',
                      fontSize: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    {timerActive ? '⏸' : '▶'}
                  </button>
                  <button
                    onClick={resetTimer}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '25px',
                      border: 'none',
                      backgroundColor: '#6B7280',
                      color: '#FFF',
                      fontSize: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: theme.text, marginBottom: '12px' }}>
              Escolha seu Desafio
            </h3>
            
            {challenges.map(challenge => {
              const isCompleted = completedChallenges.has(challenge.id);
              return (
                <div
                  key={challenge.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.card,
                    marginBottom: '10px',
                    opacity: isCompleted ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      backgroundColor: challenge.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      marginRight: '12px'
                    }}>
                      {challenge.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, marginBottom: '2px' }}>
                        {challenge.title}
                      </div>
                      <div style={{ fontSize: '12px', color: theme.textSec }}>
                        {Math.round(challenge.duration / 60)} min · {challenge.xp} XP
                      </div>
                    </div>
                  </div>
                  {!isCompleted ? (
                    <button
                      onClick={() => startChallenge(challenge)}
                      disabled={timerActive}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '18px',
                        border: 'none',
                        backgroundColor: '#6366F1',
                        color: '#FFF',
                        fontSize: '14px',
                        cursor: timerActive ? 'not-allowed' : 'pointer',
                        opacity: timerActive ? 0.5 : 1
                      }}
                    >
                      ▶
                    </button>
                  ) : (
                    <span style={{ fontSize: '24px', color: '#10B981', fontWeight: 'bold' }}>✓</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'selfcare' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: theme.text, margin: '0 0 8px' }}>
              Atividades de Autocuidado
            </h2>
            <p style={{ fontSize: '14px', textAlign: 'center', color: theme.textSec, margin: '0 0 16px' }}>
              Marque as atividades que você completou hoje
            </p>

            {completedSelfCare.size > 0 && (
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <button
                  onClick={resetAllSelfCare}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#EF4444',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Resetar Atividades
                </button>
              </div>
            )}
            
            {selfCareActivities.map(activity => {
              const isCompleted = completedSelfCare.has(activity.id);
              return (
                <div
                  key={activity.id}
                  onClick={() => toggleSelfCareComplete(activity)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    border: isCompleted ? '2px solid #EC4899' : `1px solid ${theme.border}`,
                    backgroundColor: theme.card,
                    marginBottom: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>{activity.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, marginBottom: '2px' }}>
                        {activity.title}
                      </div>
                      <div style={{ fontSize: '12px', color: theme.textSec }}>
                        {activity.category} · {activity.xp} XP
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '24px', color: isCompleted ? '#10B981' : '#EC4899', fontWeight: 'bold' }}>
                    {isCompleted ? '✓' : '♡'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'mascot' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: theme.text, margin: '0 0 16px' }}>
              Seu Apoiador Virtual
            </h2>
            
            <div style={{
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.card,
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>
                {getMascotDisplay()}
              </div>
              
              {isEditingName ? (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={15}
                    placeholder="Nome do mascote"
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.input,
                      fontSize: '16px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: theme.text,
                      width: '200px'
                    }}
                  />
                  <button
                    onClick={saveMascotName}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '18px',
                      border: 'none',
                      backgroundColor: '#10B981',
                      color: '#FFF',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: theme.text,
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {mascotName} ✏️
                </div>
              )}
              
              <div style={{ fontSize: '14px', color: theme.textSec }}>
                Humor: Feliz 😄
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: theme.text, marginBottom: '12px' }}>
              Personalizar Mascote
            </h3>
            
            <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textSec, marginBottom: '8px' }}>
              Escolha o Animal:
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {mascotTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setMascotType(t.id)}
                  style={{
                    width: '70px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: t.id === mascotType ? '3px solid #6366F1' : `1px solid ${theme.border}`,
                    backgroundColor: theme.card,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{t.base}</span>
                  <span style={{ fontSize: '10px', color: theme.textSec }}>{t.name}</span>
                </button>
              ))}
            </div>

            <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textSec, marginBottom: '8px' }}>
              Acessórios:
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {mascotAccessories.map(a => (
                <button
                  key={a.id}
                  onClick={() => setMascotAccessory(a.id)}
                  style={{
                    width: '70px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: a.id === mascotAccessory ? '3px solid #F59E0B' : `1px solid ${theme.border}`,
                    backgroundColor: theme.card,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{a.emoji}</span>
                  <span style={{ fontSize: '10px', color: theme.textSec }}>{a.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: theme.text, margin: '0 0 16px' }}>
              Chat com IA ({mascotName})
            </h2>
            
            <div
              ref={chatScrollRef}
              style={{
                height: '400px',
                overflowY: 'auto',
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.card,
                padding: '16px',
                marginBottom: '16px'
              }}
            >
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '12px'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: msg.type === 'user' ? '#6366F1' : (darkMode ? '#374151' : '#F3F4F6'),
                      borderBottomRightRadius: msg.type === 'user' ? '3px' : '12px',
                      borderBottomLeftRadius: msg.type === 'user' ? '12px' : '3px'
                    }}
                  >
                    <div style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.5', 
                      color: msg.type === 'user' ? '#FFF' : theme.text 
                    }}>
                      {msg.message}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      opacity: 0.6, 
                      marginTop: '4px',
                      color: msg.type === 'user' ? '#FFF' : theme.textSec
                    }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#374151' : '#F3F4F6',
                    borderBottomLeftRadius: '3px'
                  }}>
                    <div style={{ fontSize: '14px', fontStyle: 'italic', color: theme.textSec }}>
                      {mascotName} está digitando...
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Fale sobre como está se sentindo..."
                disabled={isTyping}
                maxLength={200}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.input,
                  fontSize: '14px',
                  color: theme.text,
                  resize: 'none',
                  height: '50px',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#6366F1',
                  color: '#FFF',
                  fontSize: '20px',
                  cursor: (!inputMessage.trim() || isTyping) ? 'not-allowed' : 'pointer',
                  opacity: (!inputMessage.trim() || isTyping) ? 0.5 : 1
                }}
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: theme.text, margin: '0 0 16px' }}>
              Seus Insights de Bem-Estar
            </h2>

            <div style={{
              padding: '20px',
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.card,
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: theme.text, marginBottom: '16px' }}>
                📅 Registro de Humor
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: theme.textSec }}>
                  Como você se sente hoje?
                </span>
                {dailyMood && (
                  <span style={{ fontSize: '24px' }}>
                    {dailyMood === 5 && '🌟'}
                    {dailyMood === 4 && '😊'}
                    {dailyMood === 3 && '😐'}
                    {dailyMood === 2 && '😟'}
                    {dailyMood === 1 && '😢'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    onClick={() => setDailyMood(value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: dailyMood === value ? '#6366F1' : theme.border,
                      color: dailyMood === value ? '#FFF' : theme.text,
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              padding: '20px',
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.card,
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: theme.text, marginBottom: '12px' }}>
                📈 Suas Estatísticas
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: theme.textSec }}>Desafios Concluídos:</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#6366F1' }}>
                    {completedChallenges.size}/{challenges.length}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: theme.textSec }}>Atividades de Autocuidado:</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#6366F1' }}>
                    {completedSelfCare.size}/{selfCareActivities.length}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: theme.textSec }}>XP Total:</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#6366F1' }}>
                    {userProfile.xp} pontos
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: theme.textSec }}>Sequência:</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#6366F1' }}>
                    {userProfile.streak} dias 🔥
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              padding: '20px',
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.card
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: theme.text, marginBottom: '12px' }}>
                💡 Dica do Dia
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: theme.textSec, margin: 0 }}>
                Continue assim! Pequenas ações diárias fazem uma grande diferença na sua jornada de bem-estar mental. Lembre-se de ser gentil consigo mesmo. 💚
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div
          onClick={() => setShowProfile(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '400px',
              maxHeight: '80vh',
              backgroundColor: theme.card,
              borderRadius: '20px',
              padding: '24px',
              overflow: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: theme.text, margin: 0 }}>Perfil</h2>
              <button
                onClick={() => setShowProfile(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  color: '#6B7280',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {!isEditingProfile ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '40px',
                    backgroundColor: '#6366F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    margin: '0 auto 12px',
                    border: '3px solid #FFF',
                    overflow: 'hidden'
                  }}>
                    {userProfile.photo ? (
                      <img src={userProfile.photo} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: theme.text, margin: '0 0 8px' }}>
                    {userProfile.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: theme.textSec, margin: '0 0 4px' }}>
                    {userProfile.age && `${userProfile.age} anos`}
                    {userProfile.age && userProfile.gender && ' • '}
                    {userProfile.gender && (userProfile.gender === 'M' ? 'Masculino' : userProfile.gender === 'F' ? 'Feminino' : 'Outro')}
                  </p>
                  <p style={{ fontSize: '12px', color: theme.textSec, margin: 0 }}>Membro desde 2025</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ 
                    flex: 1, 
                    textAlign: 'center', 
                    padding: '16px', 
                    borderRadius: '12px', 
                    backgroundColor: darkMode ? '#374151' : '#F9FAFB' 
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.text, marginBottom: '4px' }}>
                      {completedChallenges.size}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSec }}>Desafios</div>
                  </div>
                  <div style={{ 
                    flex: 1, 
                    textAlign: 'center', 
                    padding: '16px', 
                    borderRadius: '12px', 
                    backgroundColor: darkMode ? '#374151' : '#F9FAFB' 
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.text, marginBottom: '4px' }}>
                      {completedSelfCare.size}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSec }}>Autocuidado</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowShareCard(true)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#6366F1',
                    color: '#FFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '12px'
                  }}
                >
                  📤 Compartilhar Progresso
                </button>

                <button
                  onClick={() => {
                    setTempProfile({ ...userProfile });
                    setIsEditingProfile(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#F59E0B',
                    color: '#FFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Editar Perfil
                </button>
              </>
            ) : (
              <>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '40px',
                    backgroundColor: '#6366F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    margin: '0 auto 12px',
                    border: '3px solid #FFF',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {tempProfile.photo ? (
                      <img src={tempProfile.photo} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>👤</span>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '30px',
                        height: '30px',
                        borderRadius: '15px',
                        border: '2px solid #FFF',
                        backgroundColor: '#6366F1',
                        color: '#FFF',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Adicionar foto"
                    >
                      📷
                    </button>
                  </div>
                  {tempProfile.photo && (
                    <button
                      onClick={removePhoto}
                      style={{
                        fontSize: '12px',
                        color: '#EF4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Remover foto
                    </button>
                  )}
                </div>

                <label style={{ fontSize: '12px', fontWeight: '600', color: theme.textSec, display: 'block', marginBottom: '6px' }}>
                  Nome
                </label>
                <input
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  placeholder="Digite seu nome"
                  maxLength={30}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.input,
                    fontSize: '14px',
                    color: theme.text,
                    marginBottom: '16px',
                    boxSizing: 'border-box'
                  }}
                />

                <label style={{ fontSize: '12px', fontWeight: '600', color: theme.textSec, display: 'block', marginBottom: '6px' }}>
                  Idade
                </label>
                <input
                  value={tempProfile.age}
                  onChange={(e) => setTempProfile({ ...tempProfile, age: e.target.value })}
                  placeholder="Digite sua idade"
                  type="number"
                  min="1"
                  max="120"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.input,
                    fontSize: '14px',
                    color: theme.text,
                    marginBottom: '16px',
                    boxSizing: 'border-box'
                  }}
                />

                <label style={{ fontSize: '12px', fontWeight: '600', color: theme.textSec, display: 'block', marginBottom: '6px' }}>
                  Sexo
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setTempProfile({ ...tempProfile, gender: 'M' })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: tempProfile.gender === 'M' ? '2px solid #6366F1' : `1px solid ${theme.border}`,
                      backgroundColor: tempProfile.gender === 'M' ? (darkMode ? '#4338CA' : '#EEF2FF') : theme.input,
                      color: theme.text,
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    ♂️ Masculino
                  </button>
                  <button
                    onClick={() => setTempProfile({ ...tempProfile, gender: 'F' })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: tempProfile.gender === 'F' ? '2px solid #6366F1' : `1px solid ${theme.border}`,
                      backgroundColor: tempProfile.gender === 'F' ? (darkMode ? '#4338CA' : '#EEF2FF') : theme.input,
                      color: theme.text,
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    ♀️ Feminino
                  </button>
                </div>
                <button
                  onClick={() => setTempProfile({ ...tempProfile, gender: 'O' })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: tempProfile.gender === 'O' ? '2px solid #6366F1' : `1px solid ${theme.border}`,
                    backgroundColor: tempProfile.gender === 'O' ? (darkMode ? '#4338CA' : '#EEF2FF') : theme.input,
                    color: theme.text,
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginBottom: '16px'
                  }}
                >
                  ⚧️ Outro
                </button>

                <button
                  onClick={saveProfileChanges}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#10B981',
                    color: '#FFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '12px'
                  }}
                >
                  ✓ Salvar Alterações
                </button>

                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    setTempProfile({ ...userProfile });
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: theme.border,
                    color: theme.text,
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✕ Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Share Card Modal */}
      {showShareCard && (
        <div
          onClick={() => setShowShareCard(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            zIndex: 1001
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '350px',
              backgroundColor: theme.card,
              borderRadius: '20px',
              padding: '28px',
              border: '2px solid #6366F1'
            }}
          >
            <div style={{ 
              textAlign: 'center', 
              paddingBottom: '20px', 
              marginBottom: '20px', 
              borderBottom: `1px solid ${theme.border}` 
            }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '45px',
                backgroundColor: '#6366F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '44px',
                margin: '0 auto 16px',
                border: '3px solid #A5B4FC',
                overflow: 'hidden'
              }}>
                {userProfile.photo ? (
                  <img src={userProfile.photo} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: theme.text, margin: '0 0 6px' }}>
                {userProfile.name}
              </h3>
              <p style={{ fontSize: '16px', color: '#6366F1', fontWeight: '600', margin: 0 }}>
                ⭐ Nível {userProfile.level}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              {[
                { emoji: '🔥', num: userProfile.streak, label: 'Dias Seguidos' },
                { emoji: '🎯', num: completedChallenges.size, label: 'Desafios' },
                { emoji: '💝', num: completedSelfCare.size, label: 'Autocuidado' },
                { emoji: '⚡', num: userProfile.xp, label: 'XP Total' }
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    flex: '1 1 45%',
                    backgroundColor: darkMode ? '#374151' : '#F9FAFB',
                    padding: '14px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>{stat.emoji}</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6366F1', marginBottom: '2px' }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: '11px', color: theme.textSec }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ 
              textAlign: 'center', 
              paddingTop: '16px', 
              marginBottom: '16px', 
              borderTop: `1px solid ${theme.border}` 
            }}>
              <p style={{ fontSize: '14px', color: theme.textSec, fontWeight: '600', margin: 0 }}>
                🧘 Jornada da Saúde Mental
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <button
                onClick={() => handleShare('Instagram')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#E1306C',
                  color: '#FFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📸 Instagram
              </button>
              <button
                onClick={() => handleShare('WhatsApp')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#25D366',
                  color: '#FFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                💬 WhatsApp
              </button>
            </div>

            <button
              onClick={() => setShowShareCard(false)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: theme.border,
                color: theme.text,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MentalHealthApp />);

export default MentalHealthApp;