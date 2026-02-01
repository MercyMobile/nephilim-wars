import React, { useState, useEffect, useRef } from 'react';

// --- Imports ---
import CharacterGenerator from './pages/CharacterGenerator';
import CombatScreen from './pages/CombatScreen';
import BestiaryScreen from './pages/BestiaryScreen';
import DiceScreen from './components/DiceScreen';
import TabernacleViewer from "./components/TabernacleViewer";
import ErrorBoundary from './components/ErrorBoundary';

// --- SCRIBE AVATAR COMPONENT (VISUALS) ---
const ScribeAvatar = ({ speaking }) => (
  <div className="flex flex-col items-center justify-center mb-6 transition-all duration-500">
    <div className="relative group">
      {/* Outer Glow Ring - Pulses only when speaking */}
      <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${speaking ? 'bg-amber-600/40 animate-pulse' : 'bg-transparent'}`}></div>
      
      {/* The Scribe Icon Container */}
      <div className={`relative z-10 w-24 h-24 rounded-full border-4 flex items-center justify-center bg-stone-950 transition-all duration-500 ${speaking ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-105' : 'border-stone-700 opacity-80'}`}>
        {/* Icon */}
        <span className="text-4xl filter drop-shadow-lg select-none">
          {speaking ? "🗣️" : "✒️"}
        </span>
      </div>
      
      {/* Sound Wave Animation (CSS Bars) - Only visible when speaking */}
      {speaking && (
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex gap-1 h-8 items-center">
          <div className="w-1 bg-amber-500 animate-[bounce_1s_infinite] h-4"></div>
          <div className="w-1 bg-amber-500 animate-[bounce_1.2s_infinite] h-8"></div>
          <div className="w-1 bg-amber-500 animate-[bounce_0.8s_infinite] h-6"></div>
        </div>
      )}
    </div>
    
    {/* Status Text */}
    <div className={`mt-4 font-cinzel text-xs tracking-[0.2em] transition-colors ${speaking ? 'text-amber-400' : 'text-stone-600'}`}>
      {speaking ? "THE SCRIBE SPEAKS..." : "AWAITING INQUIRY"}
    </div>
  </div>
);

// --- SCRIBE CHAT COMPONENT (LOGIC & SPEECH) ---
const ScribeChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false); // State for Avatar animation
  const chatEndRef = useRef(null);
  
  // 🔴 IMPORTANT: Ensure this matches your deployed Cloudflare Worker URL
  const WORKER_URL = "https://scribe.cisco-velez76.workers.dev";

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

// --- TUNED SPEECH LOGIC (Less Robotic) ---
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    // 1. Safety Check: Only speak if it's a NEW message from the Scribe
    if (!lastMessage || lastMessage.role !== 'scribe') return;

    // 2. Cancel any existing speech to avoid overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(lastMessage.content);
    
    // 3. Robust Voice Selection (Prioritize "Natural" / High Quality)
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Priority 1: Modern "Natural" voices (Edge/Chrome/Android)
      // Priority 2: Specific High-Quality Humanoid names
      // Priority 3: Any English voice
      const preferredVoice = voices.find(v => v.name.includes("Natural")) || 
                             voices.find(v => v.name.includes("Google UK English Male")) || 
                             voices.find(v => v.name.includes("Daniel")) || // Mac High Quality
                             voices.find(v => v.lang.startsWith("en-")); // Any English fallback

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        // console.log("Using voice:", preferredVoice.name); // Uncomment to debug
      }
      
      // SETTINGS: Keeping pitch normal prevents the "Speak-n-Spell" effect
      utterance.rate = 1.0;  // Normal speed (0.9 can sound draggable)
      utterance.pitch = 1.0; // Artificial pitch shifting creates robotic artifacts
    };

    // Chrome loads voices asynchronously, so we must check both ways
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    // 4. Event Handlers for Animation Sync
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);

    // 5. Cleanup: Stop talking if user leaves the page!
    return () => {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    };
  }, [messages]);

  const handleSend = async (textOverride = null) => {
    const userText = textOverride || input;
    if (!userText.trim()) return;
    
    setInput('');
    setLoading(true);

    // Add User Message immediately
    setMessages(prev => [...prev, { role: 'user', content: userText }]);

    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userText })
      });

      const data = await response.json();
      
      // Add Scribe Message
      setMessages(prev => [...prev, { 
        role: 'scribe', 
        content: data.reply,
        sources: data.sources 
      }]);
    } catch (error) {
      console.error("Scribe Error:", error);
      setMessages(prev => [...prev, { 
        role: 'scribe', 
        content: "The connection to the archives has been severed. (Check your internet or Worker URL)." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto border-x-2 border-amber-900/30 bg-[#0f0f0f] shadow-2xl font-serif text-[#d4c4a8]">
      {/* Header */}
      <div className="p-6 text-center border-b border-[#5a4a3a] bg-[#1f1a15]">
        <h3 className="m-0 text-xl font-cinzel text-[#a89f91] uppercase tracking-widest">
          The Scribe of the Way
        </h3>
        <p className="text-xs text-[#666] mt-2 italic">
          "Ask, and the annals of history shall be opened..."
        </p>
      </div>

      {/* Chat History */}
      <div className={`flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-black ${messages.length === 0 ? 'flex flex-col justify-center' : ''}`}>
        
        {/* ✨ ALWAYS SHOW AVATAR AT TOP ✨ */}
        <ScribeAvatar speaking={speaking} />

        {/* Empty State Instructions */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-8 w-full animate-fade-in">
            <p className="italic text-stone-500 text-sm">Select a topic below or type your own inquiry.</p>

            {/* Suggestion Chips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
              {["Who is Enoch?", "The Watchers", "The Nephilim Wars", "Timeline of Events"].map((prompt) => (
                <button 
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-4 py-3 text-sm border border-[#5a4a3a] bg-[#1a1510] hover:bg-[#2a221a] hover:border-[#8c7356] transition-colors rounded shadow-sm text-[#d4c5a3]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Message List */}
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`p-4 mb-6 rounded-lg max-w-[85%] leading-relaxed shadow-lg ${
              msg.role === 'user' 
                ? 'self-end bg-[#2a2a2a] text-stone-200 border border-stone-700 ml-auto' 
                : 'self-start bg-[#1a1510] border-l-4 border-[#8b0000] text-[#d4c4a8]'
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
            
            {/* Source Citations */}
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-stone-800 text-xs text-[#666] font-mono">
                <span className="text-[#8b0000] font-bold uppercase mr-2">Sources:</span>
                {[...new Set(msg.sources)].join(', ')}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="self-start bg-[#1a1510] border-l-4 border-[#8b0000] p-4 rounded-lg animate-pulse flex items-center gap-3">
            <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-bounce delay-75" />
            <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-bounce delay-150" />
            <span className="text-stone-500 italic text-sm ml-2">Consulting the archives...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Controls */}
      <div className="p-4 border-t border-[#5a4a3a] bg-[#1f1a15] flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Inquire of the Scribe..." 
          className="flex-1 p-4 bg-black border border-[#5a4a3a] text-white font-serif focus:outline-none focus:border-amber-600 transition-colors placeholder-stone-700"
          disabled={loading}
        />
        <button 
          onClick={() => handleSend()}
          disabled={loading}
          className="px-8 py-3 bg-[#8b0000] text-white font-bold font-cinzel uppercase hover:bg-[#a50000] disabled:bg-[#333] disabled:text-stone-600 transition-colors border border-red-900 shadow-[0_0_15px_rgba(139,0,0,0.3)]"
        >
          Inquire
        </button>
      </div>
    </div>
  );
};

// --- HOME MENU COMPONENT ---
const MainMenu = ({ onNavigate }) => (
  <div className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
      style={{ backgroundImage: "url('/dead-sea-scroll.jpg')" }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

    <div className="z-10 text-center space-y-6 sm:space-y-8 p-4 sm:p-8 border-4 border-double border-amber-900/50 bg-stone-950/80 rounded-lg shadow-2xl max-w-2xl w-full backdrop-blur-sm mx-4">
      <div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-cinzel text-amber-500 mb-2 text-shadow-lg">NEPHILIM WARS</h1>
        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto"></div>
        <p className="text-sm sm:text-base text-stone-400 font-serif italic mt-2">Creation to Corruption</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <MenuButton onClick={() => onNavigate('generator')} icon="✨" title="Create Character" desc="Historical Builder" />
        <MenuButton onClick={() => onNavigate('combat')} icon="⚔️" title="Enter Combat" desc="Tactical Warfare" />
        <MenuButton onClick={() => onNavigate('dice')} icon="🎲" title="Dice Roller" desc="3D Physics" />
        <MenuButton onClick={() => onNavigate('bestiary')} icon="📖" title="Bestiary" desc="Lore & Stats" />
        <MenuButton onClick={() => onNavigate('rules')} icon="📜" title="Rules of Engagement" desc="Combat System" />
        <MenuButton onClick={() => onNavigate('lore')} icon="📚" title="Lore Codex" desc="History & Peoples" />
      </div>

      <div className="text-xs text-stone-600 uppercase tracking-widest mt-8">Version 0.9.3 • Mercy Mobile</div>
    </div>
  </div>
);

const MenuButton = ({ onClick, icon, title, desc }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 p-4 bg-stone-900 border border-stone-800 hover:border-amber-600 hover:bg-stone-800 transition-all group text-left rounded"
  >
    <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
    <div>
      <div className="text-amber-500 font-bold font-cinzel group-hover:text-amber-400">{title}</div>
      <div className="text-stone-500 text-xs uppercase tracking-wider group-hover:text-stone-400">{desc}</div>
    </div>
  </button>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [characterExists, setCharacterExists] = useState(false);
  const [loreTab, setLoreTab] = useState('codex'); 
  const [rulesTab, setRulesTab] = useState('combat'); 

  useEffect(() => {
    const saved = localStorage.getItem('generatedCharacter');
    if (saved) setCharacterExists(true);
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'returnHome') {
        setCurrentView('home');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCharacterReady = () => {
    setCharacterExists(true);
    setCurrentView('combat');
  };

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-black overflow-hidden font-serif">

        {/* --- RIBBON MENU --- */}
        {currentView !== 'dice' && (
          <nav className="bg-stone-950 border-b border-amber-900/50 p-3 flex flex-wrap justify-center gap-2 z-50 shadow-2xl relative min-h-[60px]">
            <NavButton label="🏛️ Home" isActive={currentView === 'home'} onClick={() => setCurrentView('home')} />
            <NavButton label="✨ Create Character" isActive={currentView === 'generator'} onClick={() => setCurrentView('generator')} />
            <NavButton label="⚔️ Combat" isActive={currentView === 'combat'} onClick={() => setCurrentView('combat')} />
            <NavButton label="🎲 Dice" isActive={currentView === 'dice'} onClick={() => setCurrentView('dice')} />
            <NavButton label="📖 Bestiary" isActive={currentView === 'bestiary'} onClick={() => setCurrentView('bestiary')} />
            <NavButton label="📜 Rules" isActive={currentView === 'rules'} onClick={() => setCurrentView('rules')} />
            <NavButton label="📚 Lore" isActive={currentView === 'lore'} onClick={() => setCurrentView('lore')} />
          </nav>
        )}

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
        
        {currentView === 'home' && <MainMenu onNavigate={setCurrentView} />}
        {currentView === 'generator' && <CharacterGenerator onCharacterComplete={handleCharacterReady} />}
        {currentView === 'combat' && <CombatScreen />}

        {currentView === 'dice' && (
          <div className="w-full h-full bg-black relative">
             <DiceScreen />
             <button
               onClick={() => setCurrentView('home')}
               className="absolute bottom-4 left-4 z-50 bg-stone-900/80 text-stone-300 border border-amber-900 px-4 py-2 rounded hover:bg-black hover:text-amber-500 hover:border-amber-500 transition font-cinzel font-semibold text-sm shadow-md backdrop-blur-sm opacity-80 hover:opacity-100"
             >
               🏛️ Home
             </button>
          </div>
        )}

        {currentView === 'bestiary' && <BestiaryScreen />}

        {currentView === 'rules' && (
          <div className="h-full w-full bg-stone-900 flex flex-col">
            <div className="bg-stone-950 border-b border-amber-900/50 p-4 text-center">
              <h2 className="text-2xl font-cinzel font-bold text-amber-500">Rules of Engagement</h2>
              <p className="text-stone-400 text-sm mt-1">Combat System & Class Guides</p>
            </div>
            <div className="flex flex-wrap gap-2 bg-stone-950 border-b border-stone-800 p-2">
              <TabButton active={rulesTab === 'combat'} onClick={() => setRulesTab('combat')} label="⚔️ Combat Rules" mobileLabel="⚔️ Combat" />
              <TabButton active={rulesTab === 'classes'} onClick={() => setRulesTab('classes')} label="📋 Class Guide" mobileLabel="📋 Classes" />
            </div>
            <div className="flex-1 overflow-hidden">
              {rulesTab === 'combat' && <iframe src="/combat/index.html" className="w-full h-full border-0" title="Combat Rules" />}
              {rulesTab === 'classes' && <iframe src="/rules/classes.html" className="w-full h-full border-0" title="Class Guide" />}
            </div>
          </div>
        )}

        {currentView === 'lore' && (
          <div className="h-full w-full bg-stone-900 flex flex-col">
            {/* Header */}
            <div className="bg-stone-950 border-b border-amber-900/50 p-4 text-center">
              <h2 className="text-2xl font-cinzel font-bold text-amber-500">Lore Codex</h2>
              <p className="text-stone-400 text-sm mt-1">Ancient History & Peoples</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-stone-950 border-b border-stone-800 p-2 justify-center">
              <TabButton active={loreTab === 'codex'} onClick={() => setLoreTab('codex')} label="📚 Codex Angelorum" mobileLabel="📚 Codex" />
              <TabButton active={loreTab === 'races'} onClick={() => setLoreTab('races')} label="👥 Races & Peoples" mobileLabel="👥 Races" />
              <TabButton active={loreTab === 'archaeology'} onClick={() => setLoreTab('archaeology')} label="🏺 Archaeology" mobileLabel="🏺 Arch" />
              <TabButton active={loreTab === 'tabernacle'} onClick={() => setLoreTab('tabernacle')} label="🏛️ Humble Tabernacle" mobileLabel="🏛️ Tabernacle" />
              
              {/* --- NEW SCRIBE TAB --- */}
              <TabButton active={loreTab === 'scribe'} onClick={() => setLoreTab('scribe')} label="✒️ The Scribe" mobileLabel="✒️ Scribe" />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {loreTab === 'codex' && <iframe src="/encyclopedia/index.html" className="w-full h-full border-0" title="Codex Angelorum" />}
              {loreTab === 'races' && <iframe src="/encyclopedia/nephilim_wars_races_and_peoples.html" className="w-full h-full border-0" title="Races & Peoples" />}
              {loreTab === 'archaeology' && <iframe src="/Archaeology/index.html" className="w-full h-full border-0" title="Archaeology" />}
              {loreTab === 'tabernacle' && <div className="w-full h-full bg-stone-900 flex flex-col overflow-y-auto"><TabernacleViewer /></div>}
              
              {/* --- SCRIBE RENDER --- */}
              {loreTab === 'scribe' && (
                 <div className="w-full h-full p-4 bg-stone-900 flex justify-center">
                    <ScribeChat />
                 </div>
              )}
            </div>
          </div>
        )}

        </div>
      </div>
    </ErrorBoundary>
  );
}

// Helper for Top Nav Buttons
const NavButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-3 sm:px-5 py-2 sm:py-2.5 font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase rounded transition-all
      ${isActive
        ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
        : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
      }
    `}
  >
    {label}
  </button>
);

// Helper for Inner Tab Buttons
const TabButton = ({ active, onClick, label, mobileLabel }) => (
  <button
    onClick={onClick}
    className={`px-3 sm:px-4 py-2 font-cinzel text-xs sm:text-sm uppercase tracking-widest rounded transition-all flex-1 sm:flex-initial ${
      active
        ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50'
        : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
    }`}
  >
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden">{mobileLabel}</span>
  </button>
);