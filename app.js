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

  // Continue no próximo bloco...
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      backgroundColor: theme.bg,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }
  },
    // Header
    React.createElement('div', {
      style: {
        backgroundColor: theme.card,
        borderBottom: `1px solid ${theme.border}`,
        padding: '12px 16px'
      }
    },
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }
      },
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('h1', {
            style: {
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#6366F1',
              textAlign: 'center',
              margin: 0
            }
          }, 'Jornada da Saúde Mental'),
          React.createElement('div', {
            style: {
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: '6px'
            }
          },
            React.createElement('span', {
              style: { fontSize: '14px', fontWeight: 'bold', color: theme.text }
            }, `🔥 ${userProfile.streak}`),
            React.createElement('span', {
              style: { fontSize: '14px', fontWeight: 'bold', color: theme.text }
            }, `⭐ Nível ${userProfile.level}`),
            React.createElement('span', {
              style: { fontSize: '14px', fontWeight: 'bold', color: theme.text }
            }, `⚡ ${userProfile.xp} XP`)
          )
        ),
        React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
          React.createElement('label', { style: { display: 'flex', alignItems: 'center', cursor: 'pointer' } },
            React.createElement('input', {
              type: 'checkbox',
              checked: darkMode,
              onChange: (e) => setDarkMode(e.target.checked),
              style: { width: '40px', height: '20px' }
            })
          ),
          React.createElement('button', {
            onClick: () => setShowProfile(true),
            style: {
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: darkMode ? '#374151' : '#F3F4F6',
              cursor: 'pointer',
              fontSize: '18px'
            }
          }, '👤')
        )
      )
    ),
    React.createElement('div', { style: { padding: '16px', textAlign: 'center', color: theme.text } },
      'App está funcionando! 🎉'
    )
  );
};

// Renderizar o app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(MentalHealthApp));

export default MentalHealthApp;
