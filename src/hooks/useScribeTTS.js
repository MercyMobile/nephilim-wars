import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * TTS Hook for the Scribe of the Way
 * Supports both Web Speech API (default) and Kokoro.js (enhanced neural voice)
 */
export function useScribeTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [useEnhancedVoice, setUseEnhancedVoice] = useState(false);
  const [kokoroLoading, setKokoroLoading] = useState(false);
  const [kokoroReady, setKokoroReady] = useState(false);
  const [kokoroError, setKokoroError] = useState(null);

  const kokoroRef = useRef(null);
  const audioContextRef = useRef(null);
  const currentSourceRef = useRef(null);

  // Initialize Kokoro.js when enhanced voice is enabled
  useEffect(() => {
    if (!useEnhancedVoice || kokoroRef.current || kokoroLoading) return;

    const loadKokoro = async () => {
      setKokoroLoading(true);
      setKokoroError(null);

      try {
        const { KokoroTTS } = await import('kokoro-js');

        // Load the quantized model (86MB instead of 326MB)
        const tts = await KokoroTTS.from_pretrained(
          "onnx-community/Kokoro-82M-ONNX",
          { dtype: "q8" }
        );

        kokoroRef.current = tts;
        setKokoroReady(true);
      } catch (error) {
        console.error('Failed to load Kokoro TTS:', error);
        setKokoroError('Failed to load enhanced voice. Using standard voice.');
        setUseEnhancedVoice(false);
      } finally {
        setKokoroLoading(false);
      }
    };

    loadKokoro();
  }, [useEnhancedVoice, kokoroLoading]);

  // Get or create AudioContext for Kokoro playback
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Stop any current playback
  const stopSpeaking = useCallback(() => {
    // Stop Web Speech API
    window.speechSynthesis.cancel();

    // Stop Kokoro audio (handles both single source and multi-source streaming)
    if (currentSourceRef.current) {
      try {
        if (currentSourceRef.current.stop) {
          currentSourceRef.current.stop();
        } else if (currentSourceRef.current.sources) {
          currentSourceRef.current.sources.forEach(s => { try { s.stop(); } catch { /* noop */ } });
        }
      } catch {
        // Already stopped
      }
      currentSourceRef.current = null;
    }

    setSpeaking(false);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!isMuted) {
      stopSpeaking();
    }
    setIsMuted(prev => !prev);
  }, [isMuted, stopSpeaking]);

  // Toggle enhanced voice
  const toggleEnhancedVoice = useCallback(() => {
    stopSpeaking();
    setUseEnhancedVoice(prev => !prev);
  }, [stopSpeaking]);

  // Speak with Kokoro.js using streaming - plays chunks as they arrive
  const speakWithKokoro = useCallback(async (text) => {
    if (!kokoroRef.current) return false;

    try {
      setSpeaking(true);

      const audioContext = getAudioContext();

      // Resume if suspended (required for autoplay policies)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Use streaming API to handle long text that exceeds model's max context length
      const stream = kokoroRef.current.stream(text, {
        voice: "bm_lewis",  // Confident British male voice
        speed: 1.1          // Brisk authoritative pace
      });

      // Track scheduled playback time and sources for cleanup
      let nextStartTime = audioContext.currentTime;
      const sources = [];
      let lastSource = null;

      // Play chunks progressively as they arrive
      for await (const chunk of stream) {
        const audioData = await chunk.audio.toBlob();
        const arrayBuffer = await audioData.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = 1.0;  // Natural pitch
        source.connect(audioContext.destination);

        // Schedule this chunk to play after previous chunks
        const startTime = Math.max(nextStartTime, audioContext.currentTime);
        source.start(startTime);

        // Calculate when this chunk will finish
        const duration = audioBuffer.duration;
        nextStartTime = startTime + duration;

        sources.push(source);
        lastSource = source;
      }

      if (lastSource) {
        // Store sources for stop functionality
        currentSourceRef.current = { sources, stop: () => sources.forEach(s => { try { s.stop(); } catch { /* noop */ } }) };

        lastSource.onended = () => {
          setSpeaking(false);
          currentSourceRef.current = null;
        };
      } else {
        setSpeaking(false);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Kokoro TTS error:', error);
      setSpeaking(false);
      return false;
    }
  }, [getAudioContext]);

  // Speak with Web Speech API (fallback)
  const speakWithWebSpeech = useCallback((text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Authoritative voice settings
    utterance.pitch = 0.8;
    utterance.rate = 1.0;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(v => v.name.includes("Daniel")) ||
        voices.find(v => v.name.includes("James")) ||
        voices.find(v => v.name.includes("Male") && v.lang.startsWith("en")) ||
        voices.find(v => v.name.includes("Google UK English Male")) ||
        voices.find(v => v.name.includes("Natural") && v.name.toLowerCase().includes("male")) ||
        voices.find(v => v.name.includes("Natural")) ||
        voices.find(v => v.name.includes("Google")) ||
        voices.find(v => v.lang.startsWith("en-"));
      if (preferredVoice) utterance.voice = preferredVoice;
    };

    if (window.speechSynthesis.getVoices().length > 0) setVoice();
    else window.speechSynthesis.onvoiceschanged = setVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Main speak function
  const speak = useCallback(async (text) => {
    if (isMuted || !text) return;

    stopSpeaking();

    // Try Kokoro first if enabled and ready
    if (useEnhancedVoice && kokoroReady) {
      const success = await speakWithKokoro(text);
      if (success) return;
    }

    // Fall back to Web Speech API
    speakWithWebSpeech(text);
  }, [isMuted, useEnhancedVoice, kokoroReady, stopSpeaking, speakWithKokoro, speakWithWebSpeech]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopSpeaking]);

  return {
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
  };
}
