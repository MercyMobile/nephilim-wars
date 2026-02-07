import React, { useState, useRef, useEffect } from 'react';
import { useScribeTTS } from '../hooks/useScribeTTS';

const QUICK_QUESTIONS = [
  "How does the 3-action economy work?",
  "Explain the Soul Economy (RP & CP)",
  "How do I build a Nephilim Gibbor?",
  "What are the Degrees of Success?",
  "How does Multiple Attack Penalty work?",
  "What backgrounds are available?",
  "How do ability boosts work?",
  "Tell me about the Watchers"
];

const RulesOracle = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    speaking,
    isMuted,
    useEnhancedVoice,
    kokoroLoading,
    kokoroReady,
    kokoroError,
    speak,
    stopSpeaking,
    toggleMute,
    toggleEnhancedVoice
  } = useScribeTTS();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak when new oracle message arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'oracle') {
      speak(lastMessage.content);
    }
  }, [messages, speak]);

  const handleSend = async (textOverride = null) => {
    const question = (textOverride || input).trim();
    if (!question || loading) return;

    stopSpeaking();
    setInput('');
    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: messages.slice(-12)
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'oracle',
        content: data.reply || data.error || 'The Oracle is silent.'
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'oracle',
        content: 'The connection to the Oracle has been severed. Check your connection and try again.'
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-[#0c0a09] font-serif text-[#d6d3d1]">
      {/* Header with TTS controls */}
      <div className="p-4 border-b border-[#44403c] bg-[#1c1917] flex items-center justify-between flex-shrink-0">
        {/* Enhanced Voice Toggle */}
        <button
          onClick={toggleEnhancedVoice}
          disabled={kokoroLoading}
          className={`relative px-3 py-2 text-xs rounded border transition-all ${
            useEnhancedVoice
              ? kokoroReady
                ? "border-emerald-600 text-emerald-400 bg-emerald-900/20"
                : "border-amber-600 text-amber-400 bg-amber-900/20 animate-pulse"
              : "border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-400"
          }`}
          title={useEnhancedVoice ? (kokoroReady ? "Neural voice active" : "Loading neural voice...") : "Enable neural voice (86MB download)"}
        >
          {kokoroLoading ? (
            <span className="flex items-center gap-1">
              <span className="animate-spin">⏳</span>
              <span className="hidden sm:inline">Loading...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span>{useEnhancedVoice ? "🧠" : "🔤"}</span>
              <span className="hidden sm:inline">{useEnhancedVoice ? "Neural" : "Standard"}</span>
            </span>
          )}
        </button>

        {/* Title */}
        <div className="text-center flex-1 px-2">
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-500">Oracle of Enoch</h2>
          <p className="text-xs text-stone-500 mt-1 hidden sm:block">Ask about rules, lore, character creation, combat, or mechanics</p>
          {kokoroError && <p className="text-xs text-red-500 mt-1">{kokoroError}</p>}
        </div>

        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          className={`w-10 h-10 flex items-center justify-center rounded border transition-colors ${
            isMuted
              ? "border-red-900/50 text-stone-600 bg-stone-900"
              : "border-amber-600 text-amber-500 bg-amber-900/20"
          }`}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Speaking indicator */}
      {speaking && !isMuted && (
        <div className="bg-amber-900/20 border-b border-amber-800/30 px-4 py-2 flex items-center justify-center gap-2 flex-shrink-0">
          <div className="flex gap-1 h-4 items-center">
            <div className="w-1 bg-amber-500 animate-[bounce_1s_infinite] h-2"></div>
            <div className="w-1 bg-amber-500 animate-[bounce_1.2s_infinite] h-4"></div>
            <div className="w-1 bg-amber-500 animate-[bounce_0.8s_infinite] h-3"></div>
          </div>
          <span className="text-xs text-amber-400 font-cinzel tracking-wider">THE ORACLE SPEAKS...</span>
          <button
            onClick={stopSpeaking}
            className="text-xs text-stone-400 hover:text-red-400 transition ml-2"
          >
            ⏹ Stop
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📜</div>
            <p className="text-stone-400 mb-6 text-sm">The Oracle awaits your questions about Nephilim Wars.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-3 py-2 bg-[#1c1917] border border-[#44403c] text-stone-300 text-xs rounded hover:border-amber-600 hover:text-amber-400 transition text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-900/40 border border-amber-700 text-amber-100'
                  : 'bg-[#1c1917] border border-[#44403c] text-stone-200'
              }`}
            >
              {msg.role === 'oracle' && (
                <div className="text-amber-500 text-xs font-bold mb-1 uppercase tracking-wider">Oracle</div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1c1917] border border-[#44403c] rounded-lg px-4 py-3">
              <div className="text-amber-500 text-xs font-bold mb-1 uppercase tracking-wider">Oracle</div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#44403c] bg-[#1c1917] flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the Oracle..."
            disabled={loading}
            className="flex-1 bg-black border border-[#44403c] text-white px-4 py-3 rounded focus:border-amber-500 focus:outline-none text-sm disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-amber-900 border border-amber-600 text-amber-100 font-bold rounded hover:bg-amber-800 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            Ask
          </button>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => { setMessages([]); stopSpeaking(); }}
            className="mt-2 text-xs text-stone-500 hover:text-stone-300 transition"
          >
            Clear conversation
          </button>
        )}
      </div>
    </div>
  );
};

export default RulesOracle;
