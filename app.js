const { useState, useEffect, useRef, createElement: e } = React;

function MentalHealthApp() {
  const [activeTab, setActiveTab] = useState('challenges');
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: 'Usuário', photo: null, gender: '', age: '', level: 1, xp: 0, streak: 0 });
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
  const [chatMessages, setChatMessages] = useState([{ type: 'ai', message: 'Olá! Sou seu assistente de bem-estar mental. Como você está se sentindo hoje?', timestamp: new Date() }]);
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
    { id: 'cat', name: 'Gato', base: '🐱' }, { id: 'dog', name: 'Cachorro', base: '🐶' },
    { id: 'rabbit', name: 'Coelho', base: '🐰' }, { id: 'fox', name: 'Raposa', base: '🦊' },
    { id: 'panda', name: 'Panda', base: '🐼' }, { id: 'bear', name: 'Urso', base: '🐻' }
  ];

  const mascotAccessories = [
    { id: 'none', name: 'Nenhum', emoji: '◯' }, { id: 'crown', name: 'Coroa', emoji: '👑' },
    { id: 'hat', name: 'Chapéu', emoji: '🎩' }, { id: 'flower', name: 'Flor', emoji: '🌸' },
    { id: 'star', name: 'Estrela', emoji: '⭐' }, { id: 'glasses', name: 'Óculos', emoji: '🕶️' }
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
              setUserProfile(prev => ({ ...prev, xp: newXP, level: newLevel, streak: newStreak }));
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
      alert('Você já completou este desafio hoje! ✓');
      return;
    }
    setSelectedChallenge(challenge);
    setCurrentTime(challenge.duration);
    setTimerActive(true);
  };

  const toggleTimer = () => setTimerActive(!timerActive);
  
  const resetTimer = () => {
    if (confirm('Deseja cancelar este desafio?')) {
      setTimerActive(false);
      setSelectedChallenge(null);
      setCurrentTime(0);
    }
  };

  const resetAllChallenges = () => {
    if (confirm('Resetar todos os desafios?')) {
      setCompletedChallenges(new Set());
      setSelectedChallenge(null);
      setTimerActive(false);
      setCurrentTime(0);
      alert('✓ Desafios resetados!');
    }
  };

  const resetAllSelfCare = () => {
    if (confirm('Resetar atividades de autocuidado?')) {
      setCompletedSelfCare(new Set());
      alert('✓ Atividades resetadas!');
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
        setUserProfile(prevProfile => ({ ...prevProfile, xp: newXP, level: newLevel }));
      }
      return newSet;
    });
  };

  const generateAIResponse = (userMessage) => {
    const responses = {
      'oi': 'Olá! Como você está se sentindo hoje?',
      'triste': 'Sinto muito. Seus sentimentos são válidos. Que tal um exercício de respiração?',
      'ansioso': 'A ansiedade pode ser desafiadora. Experimente a técnica 4-7-8.',
      'feliz': 'Que maravilha! Continue cultivando momentos positivos.',
      'default': ['Entendo. Pode me contar mais?', 'Seus sentimentos são válidos.', 'Você é forte!']
    };
    const msg = userMessage.toLowerCase().trim();
    for (const [key, response] of Object.entries(responses)) {
      if (key !== 'default' && msg.includes(key)) return response;
    }
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    setChatMessages([...chatMessages, { type: 'user', message: inputMessage, timestamp: new Date() }]);
    setIsTyping(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'ai', message: generateAIResponse(inputMessage), timestamp: new Date() }]);
      setIsTyping(false);
    }, 1500);
    setInputMessage('');
  };

  const saveMascotName = () => {
    if (tempName.trim()) {
      setMascotName(tempName);
      setIsEditingName(false);
    } else {
      alert('Digite um nome para o mascote');
    }
  };

  const getMascotDisplay = () => {
    const baseEmoji = mascotTypes.find(t => t.id === mascotType)?.base || '🐱';
    const accessory = mascotAccessories.find(a => a.id === mascotAccessory)?.emoji || '';
    return accessory !== '◯' ? `${baseEmoji}${accessory}` : baseEmoji;
  };

  const saveProfileChanges = () => {
    if (!tempProfile.name.trim()) {
      alert('Digite seu nome');
      return;
    }
    setUserProfile(tempProfile);
    setIsEditingProfile(false);
    alert('✓ Perfil atualizado!');
  };

  const handlePhotoUpload = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert('Arquivo muito grande! Máx 5MB.');
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
    if (confirm('Remover foto?')) {
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

  return e('div', { style: { minHeight: '100vh', backgroundColor: theme.bg, fontFamily: 'system-ui' } },
    e('div', { style: { backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, padding: '12px 16px' } },
      e('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' } },
        e('div', { style: { flex: 1 } },
          e('h1', { style: { fontSize: '18px', fontWeight: 'bold', color: '#6366F1', textAlign: 'center', margin: 0 } }, 'Jornada da Saúde Mental'),
          e('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '6px' } },
            e('span', { style: { fontSize: '14px', fontWeight: 'bold', color: theme.text } }, `🔥 ${userProfile.streak}`),
            e('span', { style: { fontSize: '14px', fontWeight: 'bold', color: theme.text } }, `⭐ Nível ${userProfile.level}`),
            e('span', { style: { fontSize: '14px', fontWeight: 'bold', color: theme.text } }, `⚡ ${userProfile.xp} XP`)
          )
        ),
        e('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
          e('label', { style: { display: 'flex', alignItems: 'center', cursor: 'pointer' } },
            e('input', { type: 'checkbox', checked: darkMode, onChange: (ev) => setDarkMode(ev.target.checked), style: { width: '40px', height: '20px' } })
          ),
          e('button', { onClick: () => setShowProfile(true), style: { width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: darkMode ? '#374151' : '#F3F4F6', cursor: 'pointer', fontSize: '18px' } }, '👤')
        )
      )
    ),
    e('div', { style: { padding: '12px', maxWidth: '1200px', margin: '0 auto' } },
      e('div', { style: { display: 'flex', backgroundColor: theme.card, borderRadius: '12px', padding: '4px', gap: '4px' } },
        [
          { id: 'challenges', icon: '🎯', label: 'Desafios' },
          { id: 'selfcare', icon: '💝', label: 'Autocuidado' },
          { id: 'mascot', icon: '✨', label: 'Mascote' },
          { id: 'chat', icon: '💬', label: 'Chat IA' },
          { id: 'insights', icon: '📊', label: 'Insights' }
        ].map(tab => e('button', {
          key: tab.id,
          onClick: () => setActiveTab(tab.id),
          style: {
            flex: 1, padding: '8px 4px', borderRadius: '8px', border: 'none',
            backgroundColor: activeTab === tab.id ? '#6366F1' : 'transparent',
            color: activeTab === tab.id ? '#FFF' : '#6B7280',
            cursor: 'pointer', fontSize: '12px', fontWeight: '500',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
          }
        },
          e('span', { style: { fontSize: '16px' } }, tab.icon),
          e('span', null, tab.label)
        ))
      )
    ),
    e('div', { style: { maxWidth: '1200px', margin: '0 auto', padding: '0 16px 80px' } },
      activeTab === 'challenges' && e('div', null,
        e('h2', { style: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: theme.text, margin: '0 0 8px' } }, 'Desafios Diários'),
        e('p', { style: { fontSize: '14px', textAlign: 'center', color: theme.textSec, margin: '0 0 16px' } }, 'Complete os exercícios para fortalecer sua mente'),
        e('div', { style: { display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '16px' } },
          e('div', { style: { textAlign: 'center' } },
            e('div', { style: { fontSize: '18px', fontWeight: 'bold', color: '#6366F1' } }, `${completedChallenges.size}/${challenges.length}`),
            e('div', { style: { fontSize: '12px', color: theme.textSec, marginTop: '4px' } }, 'Concluídos')
          )
        ),
        completedChallenges.size > 0 && e('div', { style: { textAlign: 'center', marginBottom: '16px' } },
          e('button', {
            onClick: resetAllChallenges,
            style: { padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#EF4444', color: '#FFF', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }
          }, '🔄 Resetar Todos')
        ),
        selectedChallenge && e('div', {
          style: { padding: '20px', borderRadius: '16px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, textAlign: 'center', marginBottom: '20px' }
        },
          e('div', { style: { fontSize: '12px', fontWeight: '600', color: theme.textSec, marginBottom: '4px' } }, 'Atividade Atual'),
          e('div', { style: { fontSize: '16px', fontWeight: 'bold', color: theme.text, marginBottom: '12px' } }, selectedChallenge.title),
          e('div', { style: { fontSize: '48px', fontWeight: 'bold', color: '#6366F1', marginBottom: '16px' } }, formatTime(currentTime)),
          e('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center' } },
            e('button', {
              onClick: toggleTimer,
              style: { width: '50px', height: '50px', borderRadius: '25px', border: 'none', backgroundColor: timerActive ? '#EF4444' : '#10B981', color: '#FFF', fontSize: '20px', cursor: 'pointer' }
            }, timerActive ? '⏸' : '▶'),
            e('button', {
              onClick: resetTimer,
              style: { width: '50px', height: '50px', borderRadius: '25px', border: 'none', backgroundColor: '#6B7280', color: '#FFF', fontSize: '20px', cursor: 'pointer' }
            }, '✕')
          )
        ),
        e('h3', { style: { fontSize: '18px', fontWeight: 'bold', color: theme.text, marginBottom: '12px' } }, 'Escolha seu Desafio'),
        ...challenges.map(challenge => {
          const isCompleted = completedChallenges.has(challenge.id);
          return e('div', {
            key: challenge.id,
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px', borderRadius: '12px', border: `1px solid ${theme.border}`,
              backgroundColor: theme.card, marginBottom: '10px', opacity: isCompleted ? 0.6 : 1
            }
          },
            e('div', { style: { display: 'flex', alignItems: 'center', flex: 1 } },
              e('div', { style: { width: '40px', height: '40px', borderRadius: '20px', backgroundColor: challenge.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '12px' } }, challenge.icon),
              e('div', null,
                e('div', { style: { fontSize: '14px', fontWeight: '600', color: theme.text, marginBottom: '2px' } }, challenge.title),
                e('div', { style: { fontSize: '12px', color: theme.textSec } }, `${Math.round(challenge.duration / 60)} min · ${challenge.xp} XP`)
              )
            ),
            !isCompleted ? e('button', {
              onClick: () => startChallenge(challenge),
              disabled: timerActive,
              style: { width: '36px', height: '36px', borderRadius: '18px', border: 'none', backgroundColor: '#6366F1', color: '#FFF', fontSize: '14px', cursor: timerActive ? 'not-allowed' : 'pointer', opacity: timerActive ? 0.5 : 1 }
            }, '▶') : e('span', { style: { fontSize: '24px', color: '#10B981', fontWeight: 'bold' } }, '✓')
          );
        })
      ),
      activeTab === 'selfcare' && e('div', null,
        e('h2', { style: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: theme.text, margin: '0 0 8px' } }, 'Atividades de Autocuidado'),
        e('p', { style: { fontSize: '14px', textAlign: 'center', color: theme.textSec, margin: '0 0 16px' } }, 'Marque as atividades que você completou'),
        completedSelfCare.size > 0 && e('div', { style: { textAlign: 'center', marginBottom: '16px' } },
          e('button', {
            onClick: resetAllSelfCare,
            style: { padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#EF4444', color: '#FFF', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }
          }, '🔄 Resetar Atividades')
        ),
        ...selfCareActivities.map(activity => {
          const isCompleted = completedSelfCare.has(activity.id);
          return e('div', {
            key: activity.id,
            onClick: () => toggleSelfCareComplete(activity),
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px', borderRadius: '12px',
              border: isCompleted ? '2px solid #EC4899' : `1px solid ${theme.border}`,
              backgroundColor: theme.card, marginBottom: '10px', cursor: 'pointer'
            }
          },
            e('div', { style: { display: 'flex', alignItems: 'center', flex: 1 } },
              e('span', { style: { fontSize: '24px', marginRight: '12px' } }, activity.icon),
              e('div', null,
                e('div', { style: { fontSize: '14px', fontWeight: '600', color: theme.text, marginBottom: '2px' } }, activity.title),
                e('div', { style: { fontSize: '12px', color: theme.textSec } }, `${activity.category} · ${activity.xp} XP`)
              )
            ),
            e('span', { style: { fontSize: '24px', color: isCompleted ? '#10B981' : '#EC4899', fontWeight: 'bold' } }, isCompleted ? '✓' : '♡')
          );
        })
      ),
      activeTab === 'mascot' && e('div', null,
        e('h2', { style: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: theme.text, margin: '0 0 16px' } }, 'Seu Apoiador Virtual'),
        e('div', { style: { padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, textAlign: 'center', marginBottom: '20px' } },
          e('div', { style: { fontSize: '80px', marginBottom: '16px' } }, getMascotDisplay()),
          isEditingName ? e('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' } },
            e('input', {
              value: tempName,
              onChange: (ev) => setTempName(ev.target.value),
              maxLength: 15,
              placeholder: 'Nome do mascote',
              style: { padding: '10px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.input, fontSize: '16px', fontWeight: 'bold', textAlign: 'center', color: theme.text, width: '200px' }
            }),
            e('button', {
              onClick: saveMascotName,
              style: { width: '36px', height: '36px', borderRadius: '18px', border: 'none', backgroundColor: '#10B981', color: '#FFF', fontSize: '16px', cursor: 'pointer' }
            }, '✓')
          ) : e('div', {
            onClick: () => setIsEditingName(true),
            style: { fontSize: '18px', fontWeight: 'bold', color: theme.text, marginBottom: '8px', cursor: 'pointer' }
          }, `${mascotName} ✏️`),
          e('div', { style: { fontSize: '14px', color: theme.textSec } }, 'Humor: Feliz 😄')
        ),
        e('h3', { style: { fontSize: '18px', fontWeight: 'bold', color: theme.text, marginBottom: '12px' } }, 'Personalizar Mascote'),
        e('div', { style: { fontSize: '14px', fontWeight: '600', color: theme.textSec, marginBottom: '8px' } }, 'Escolha o Animal:'),
        e('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' } },
          ...mascotTypes.map(t => e('button', {
            key: t.id,
            onClick: () => setMascotType(t.id),
            style: { width: '70px', padding: '12px', borderRadius: '12px', border: t.id === mascotType ? '3px solid #6366F1' : `1px solid ${theme.border}`, backgroundColor: theme.card, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }
          },
            e('span', { style: { fontSize: '28px' } }, t.base),
            e('span', { style: { fontSize: '10px', color: theme.textSec } }, t.name)
          ))
        ),
        e('div', { style: { fontSize: '14px', fontWeight: '600', color: theme.textSec, marginBottom: '8px' } }, 'Acessórios:'),
        e('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
          ...mascotAccessories.map(a => e('button', {
            key: a.id,
            onClick: () => setMascotAccessory(a.id),
            style: { width: '70px', padding: '12px', borderRadius: '12px', border: a.id === mascotAccessory ? '3px solid #F59E0B' : 

              
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(MentalHealthApp));
