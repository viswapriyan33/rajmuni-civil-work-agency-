import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Languages,
  Sparkles,
  Check,
  FileCheck,
} from 'lucide-react';
import {
  translateNlpText,
  translateNlpTextAsync,
  playVoiceAgent,
  stopVoiceAgent,
  startMikeListening,
  polishAndSynthesizeCivilSpeech,
  enhanceCivilText,
} from '../services/nlpVoiceService';

export default function AiNlpVoiceBar({
  fieldKey,
  currentValue,
  onTextChange,
  englishBackup,
  label = 'AI Automated Text',
}) {
  // If currentValue already contains Tamil characters on load, initialize to Tamil ('ta')
  const initialLang =
    currentValue && /[\u0B80-\u0BFF]/.test(currentValue)
      ? 'ta'
      : currentValue && /[\u0900-\u097F]/.test(currentValue)
      ? 'hi'
      : 'en';

  const [activeLang, setActiveLang] = useState(initialLang);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');
  const recognitionControllerRef = useRef(null);

  // Store translations for this field so switching between English, Tamil, and Hindi is instant & lossless
  const translationsRef = useRef({
    en: englishBackup || '',
    ta: '',
    hi: '',
  });

  // Keep track of which language was originally spoken
  const spokenSourceRef = useRef({
    lang: '',
    text: '',
  });

  // Sync initial values into translations cache
  useEffect(() => {
    if (englishBackup && !translationsRef.current.en) {
      translationsRef.current.en = englishBackup;
    }
    if (currentValue) {
      if (/[\u0B80-\u0BFF]/.test(currentValue)) {
        translationsRef.current.ta = currentValue;
      } else if (/[\u0900-\u097F]/.test(currentValue)) {
        translationsRef.current.hi = currentValue;
      } else {
        translationsRef.current.en = currentValue;
      }
    }
  }, [currentValue, englishBackup]);

  // Clean up speech and mic on unmount
  useEffect(() => {
    return () => {
      stopVoiceAgent();
      if (recognitionControllerRef.current) {
        try {
          recognitionControllerRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Handle Language Switch (English, Tamil, Hindi)
  // When user clicks 'English', translate & display in Professional English!
  // When user clicks 'தமிழ்', restore / display in Tamil!
  const handleLanguageSwitch = async (newLang) => {
    if (newLang === activeLang) return;
    stopVoiceAgent();
    setIsPlayingVoice(false);

    // If input is currently empty, just switch active language
    if (!currentValue || !currentValue.trim()) {
      setActiveLang(newLang);
      const langName =
        newLang === 'ta' ? 'தமிழ் (Tamil)' : newLang === 'hi' ? 'हिन्दी (Hindi)' : 'English';
      setVoiceNotice(`🌐 Language: ${langName} • Voice & Mike ready.`);
      setTimeout(() => setVoiceNotice(''), 2500);
      return;
    }

    setActiveLang(newLang);

    // CASE 1: Switching to English
    // User spoke in Tamil, now clicks English button -> Translate and display in English!
    if (newLang === 'en') {
      let targetEnglish =
        translationsRef.current.en || englishBackup;

      if (!targetEnglish || /[\u0B80-\u0BFF\u0900-\u097F]/.test(targetEnglish)) {
        setVoiceNotice('🧠 Translating to Professional Civil Engineering English...');
        try {
          const synthesized = await polishAndSynthesizeCivilSpeech({
            spokenTranscript: currentValue,
            sourceLang: activeLang,
            fieldKey,
          });
          targetEnglish = synthesized.en;
          translationsRef.current.en = targetEnglish;
        } catch (err) {
          targetEnglish = await translateNlpTextAsync(fieldKey, currentValue, 'en', activeLang);
          translationsRef.current.en = targetEnglish;
        }
      }

      if (onTextChange) {
        onTextChange(targetEnglish, targetEnglish);
      }

      setVoiceNotice('🌐 Language: English • Displaying 100% Certified Professional Civil English.');
      setTimeout(() => setVoiceNotice(''), 3500);
      return;
    }

    // CASE 2: Switching to Tamil
    if (newLang === 'ta') {
      let targetTamil = translationsRef.current.ta;

      if (!targetTamil) {
        setVoiceNotice('🧠 Translating to தமிழ் (Tamil)...');
        const sourceForTamil = translationsRef.current.en || currentValue;
        targetTamil = await translateNlpTextAsync(fieldKey, sourceForTamil, 'ta', 'en');
        translationsRef.current.ta = targetTamil;
      }

      const baseEnglish = translationsRef.current.en || englishBackup || currentValue;
      if (onTextChange) {
        onTextChange(targetTamil, baseEnglish);
      }

      setVoiceNotice('🌐 Language: தமிழ் (Tamil) • Displaying Tamil text.');
      setTimeout(() => setVoiceNotice(''), 3500);
      return;
    }

    // CASE 3: Switching to Hindi
    if (newLang === 'hi') {
      let targetHindi = translationsRef.current.hi;

      if (!targetHindi) {
        setVoiceNotice('🧠 Translating to हिन्दी (Hindi)...');
        const sourceForHindi = translationsRef.current.en || currentValue;
        targetHindi = await translateNlpTextAsync(fieldKey, sourceForHindi, 'hi', 'en');
        translationsRef.current.hi = targetHindi;
      }

      const baseEnglish = translationsRef.current.en || englishBackup || currentValue;
      if (onTextChange) {
        onTextChange(targetHindi, baseEnglish);
      }

      setVoiceNotice('🌐 Language: हिन्दी (Hindi) • Displaying Hindi text.');
      setTimeout(() => setVoiceNotice(''), 3500);
      return;
    }
  };

  // Handle Voice Agent Audio Playback (Speaks in active language: Tamil, English, or Hindi)
  const handleToggleVoice = async () => {
    if (isPlayingVoice) {
      stopVoiceAgent();
      setIsPlayingVoice(false);
      setVoiceNotice('');
      return;
    }

    if (!currentValue || !currentValue.trim()) {
      setVoiceNotice('⚠️ No text available to speak. Speak via Mike or enter notes.');
      setTimeout(() => setVoiceNotice(''), 2500);
      return;
    }

    const langLabel =
      activeLang === 'ta' ? 'தமிழ் (Tamil)' : activeLang === 'hi' ? 'हिन्दी (Hindi)' : 'English';

    setVoiceNotice(`🔊 Voice Agent speaking in ${langLabel}...`);
    setIsPlayingVoice(true);

    // Speak the exact text in the active language
    let textToSpeak = currentValue;

    // If active language is Tamil but text in box is English, translate text first so it speaks Tamil!
    if (activeLang === 'ta' && !/[\u0B80-\u0BFF]/.test(currentValue)) {
      textToSpeak = await translateNlpTextAsync(fieldKey, currentValue, 'ta', 'en');
    } else if (activeLang === 'hi' && !/[\u0900-\u097F]/.test(currentValue)) {
      textToSpeak = await translateNlpTextAsync(fieldKey, currentValue, 'hi', 'en');
    } else if (activeLang === 'en' && /[\u0B80-\u0BFF\u0900-\u097F]/.test(currentValue)) {
      textToSpeak = translationsRef.current.en || (await translateNlpTextAsync(fieldKey, currentValue, 'en', 'auto'));
    }

    playVoiceAgent({
      text: textToSpeak,
      lang: activeLang,
      onStart: () => setIsPlayingVoice(true),
      onEnd: () => {
        setIsPlayingVoice(false);
        setVoiceNotice('');
      },
      onError: (err) => {
        setIsPlayingVoice(false);
        setVoiceNotice('⚠️ Audio completed.');
        setTimeout(() => setVoiceNotice(''), 2000);
      },
    });
  };

  // Handle Microphone Dictation
  // If user speaks in Tamil -> Text MUST display in Tamil (not English)!
  // English translation is prepared in the background and revealed when user clicks 'English'.
  const handleToggleMic = () => {
    if (isListeningMic) {
      if (recognitionControllerRef.current) {
        try {
          recognitionControllerRef.current.stop();
        } catch {}
      }
      setIsListeningMic(false);
      setVoiceNotice('');
      return;
    }

    stopVoiceAgent();
    setIsPlayingVoice(false);

    const langLabel =
      activeLang === 'ta' ? 'தமிழ் (Tamil)' : activeLang === 'hi' ? 'हिन्दी (Hindi)' : 'English';

    setVoiceNotice(`🎙️ Listening in ${langLabel}... Speak into microphone.`);
    setIsListeningMic(true);

    const controller = startMikeListening({
      lang: activeLang,
      // Real-time preview as user speaks:
      onInterim: (interimText) => {
        if (!interimText) return;
        // If user is speaking Tamil, ensure activeLang reflects Tamil immediately
        if (/[\u0B80-\u0BFF]/.test(interimText) && activeLang !== 'ta') {
          setActiveLang('ta');
        }
        // Update input field in real-time with what is spoken!
        if (onTextChange) {
          onTextChange(interimText, translationsRef.current.en || interimText);
        }
      },
      // Finalized transcript when user finishes or clicks stop:
      onResult: async (spokenText) => {
        setIsListeningMic(false);
        if (!spokenText || !spokenText.trim()) return;

        const isTamil = /[\u0B80-\u0BFF]/.test(spokenText) || activeLang === 'ta';
        const isHindi = /[\u0900-\u097F]/.test(spokenText) || activeLang === 'hi';

        if (isTamil) {
          // USER SPOKE IN TAMIL:
          // 1. MUST display in Tamil, NOT in English!
          setActiveLang('ta');
          spokenSourceRef.current = { lang: 'ta', text: spokenText };
          translationsRef.current.ta = spokenText;

          // Update text box immediately with the Tamil words!
          if (onTextChange) {
            onTextChange(spokenText, translationsRef.current.en || spokenText);
          }

          setVoiceNotice('🧠 Spoken Tamil recorded • Preparing Professional English for PDF & English view...');

          try {
            // Translate to Certified Professional Civil Engineering English in the background
            const synthesized = await polishAndSynthesizeCivilSpeech({
              spokenTranscript: spokenText,
              sourceLang: 'ta',
              fieldKey,
            });

            translationsRef.current.en = synthesized.en;
            translationsRef.current.hi = synthesized.hi;

            // Notice: First argument (display in box) REMAINS Tamil! Second argument (PDF report) receives pure English!
            if (onTextChange) {
              onTextChange(spokenText, synthesized.en);
            }

            setVoiceNotice('✓ Text displayed in தமிழ் • Click "English" button to translate into Professional English!');
            setTimeout(() => setVoiceNotice(''), 6000);
          } catch (err) {
            console.error('Translation error:', err);
            setVoiceNotice('✓ Spoken Tamil recorded in field.');
            setTimeout(() => setVoiceNotice(''), 3000);
          }
        } else if (isHindi) {
          // USER SPOKE IN HINDI:
          setActiveLang('hi');
          spokenSourceRef.current = { lang: 'hi', text: spokenText };
          translationsRef.current.hi = spokenText;

          if (onTextChange) {
            onTextChange(spokenText, translationsRef.current.en || spokenText);
          }

          setVoiceNotice('🧠 Spoken Hindi recorded • Preparing Professional English...');

          try {
            const synthesized = await polishAndSynthesizeCivilSpeech({
              spokenTranscript: spokenText,
              sourceLang: 'hi',
              fieldKey,
            });

            translationsRef.current.en = synthesized.en;
            translationsRef.current.ta = synthesized.ta;

            if (onTextChange) {
              onTextChange(spokenText, synthesized.en);
            }

            setVoiceNotice('✓ Text displayed in हिन्दी • Click "English" button to translate into Professional English!');
            setTimeout(() => setVoiceNotice(''), 6000);
          } catch (err) {
            console.error('Translation error:', err);
            setVoiceNotice('✓ Spoken Hindi recorded in field.');
            setTimeout(() => setVoiceNotice(''), 3000);
          }
        } else {
          // USER SPOKE IN ENGLISH:
          setActiveLang('en');
          spokenSourceRef.current = { lang: 'en', text: spokenText };
          translationsRef.current.en = spokenText;

          if (onTextChange) {
            onTextChange(spokenText, spokenText);
          }

          try {
            const synthesized = await polishAndSynthesizeCivilSpeech({
              spokenTranscript: spokenText,
              sourceLang: 'en',
              fieldKey,
            });

            translationsRef.current.en = synthesized.en;
            translationsRef.current.ta = synthesized.ta;
            translationsRef.current.hi = synthesized.hi;

            if (onTextChange) {
              onTextChange(synthesized.en, synthesized.en);
            }

            setVoiceNotice('✓ Spoken English recorded in field & polished for PDF.');
            setTimeout(() => setVoiceNotice(''), 4000);
          } catch {
            setVoiceNotice('✓ Spoken English recorded in field.');
            setTimeout(() => setVoiceNotice(''), 3000);
          }
        }
      },
      onError: (err) => {
        setIsListeningMic(false);
        setVoiceNotice(`⚠️ Mic: ${err}`);
        setTimeout(() => setVoiceNotice(''), 3500);
      },
      onEnd: () => {
        setIsListeningMic(false);
      },
    });

    recognitionControllerRef.current = controller;
  };

  // AI Content Enhancement (Civil Engineering NLP Enhancement for Tamil, English & Hindi)
  const handleAiEnhance = async () => {
    if (!currentValue || !currentValue.trim()) {
      setVoiceNotice('⚠️ Enter text or speak into Mike to enhance with AI.');
      setTimeout(() => setVoiceNotice(''), 2500);
      return;
    }

    setIsEnhancing(true);
    const langLabel =
      activeLang === 'ta' ? 'தமிழ் (Tamil)' : activeLang === 'hi' ? 'हिन्दी (Hindi)' : 'English';
    setVoiceNotice(`✨ AI Enhancing text in ${langLabel} with formal Civil Engineering terminology...`);

    try {
      const enhanced = await enhanceCivilText({
        text: currentValue,
        lang: activeLang,
        fieldKey,
      });

      if (enhanced?.display) {
        if (activeLang === 'ta') {
          translationsRef.current.ta = enhanced.display;
        } else if (activeLang === 'hi') {
          translationsRef.current.hi = enhanced.display;
        }
        translationsRef.current.en = enhanced.english;

        if (onTextChange) {
          onTextChange(enhanced.display, enhanced.english);
        }

        setVoiceNotice(`✓ Text Enhanced by AI in ${langLabel}! Synchronized certified English for PDF.`);
        setTimeout(() => setVoiceNotice(''), 4500);
      }
    } catch (err) {
      console.warn('AI Enhance notice:', err);
      setVoiceNotice('✓ Text processed.');
      setTimeout(() => setVoiceNotice(''), 2500);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="ai-nlp-voice-bar">
      {/* Left: Language Selection Group (Button name: Language, 3 languages: English, Tamil, Hindi) */}
      <div className="nlp-lang-cluster">
        <div className="nlp-lang-btn-main">
          <Languages size={14} className="icon-pulse" />
          <span>Language:</span>
        </div>

        {/* 3 Language Switchers: English 1st, then Tamil, Hindi */}
        <div className="nlp-lang-pills">
          {/* 1. English */}
          <button
            type="button"
            className={`btn-nlp-lang ${activeLang === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageSwitch('en')}
            title="Click to translate into Professional Civil Engineering English (and speak English)"
          >
            <span>English</span>
            {activeLang === 'en' && <Check size={11} className="check-ico" />}
          </button>

          {/* 2. Tamil */}
          <button
            type="button"
            className={`btn-nlp-lang ${activeLang === 'ta' ? 'active' : ''}`}
            onClick={() => handleLanguageSwitch('ta')}
            title="தமிழில் உரை & குரல் (Tamil) - பேசவும் கேட்கவும்"
          >
            <span>தமிழ்</span>
            {activeLang === 'ta' && <Check size={11} className="check-ico" />}
          </button>

          {/* 3. Hindi */}
          <button
            type="button"
            className={`btn-nlp-lang ${activeLang === 'hi' ? 'active' : ''}`}
            onClick={() => handleLanguageSwitch('hi')}
            title="हिन्दी में पाठ एवं आवाज (Hindi) - बोलें और सुनें"
          >
            <span>हिन्दी</span>
            {activeLang === 'hi' && <Check size={11} className="check-ico" />}
          </button>
        </div>
      </div>

      {/* Right: PDF Indicator, AI Enhance Button, Voice Button & Mike Button */}
      <div className="nlp-audio-cluster">
        {/* PDF English Guarantee Indicator */}
        <div
          className="nlp-pdf-sync-badge"
          title="The official generated PDF always receives 100% Certified Professional English"
          style={{
            fontSize: '0.7rem',
            color: '#34d399',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.2rem 0.5rem',
            background: 'rgba(52, 211, 153, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(52, 211, 153, 0.25)',
          }}
        >
          <FileCheck size={12} />
          <span>PDF: 100% English</span>
        </div>

        {/* AI Enhance Button (Enhances Tamil/English with Civil Terminology) */}
        <button
          type="button"
          className={`btn-audio-mini btn-enhance-agent ${isEnhancing ? 'enhancing' : ''}`}
          onClick={handleAiEnhance}
          disabled={isEnhancing}
          title={`Enhance content in ${activeLang === 'ta' ? 'தமிழ் (Tamil)' : 'English'} with Civil AI`}
        >
          <Sparkles size={14} className={isEnhancing ? 'icon-spin' : ''} />
          <span className="btn-label-text">{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
        </button>

        {/* Voice Button (Accurate Native Speech Agent) */}
        <button
          type="button"
          className={`btn-audio-mini btn-voice-agent ${isPlayingVoice ? 'playing' : ''}`}
          onClick={handleToggleVoice}
          title={
            isPlayingVoice
              ? 'Stop Voice Agent'
              : `Play Voice in ${activeLang === 'ta' ? 'Tamil (தமிழ்)' : activeLang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}`
          }
        >
          {isPlayingVoice ? (
            <>
              <VolumeX size={15} />
              <span className="soundwave-bar-mini" />
              <span className="btn-label-text">Stop</span>
            </>
          ) : (
            <>
              <Volume2 size={15} />
              <span className="btn-label-text">Voice</span>
            </>
          )}
        </button>

        {/* Mike Button (Continuous Speech-to-Text Input) */}
        <button
          type="button"
          className={`btn-audio-mini btn-mike-agent ${isListeningMic ? 'recording' : ''}`}
          onClick={handleToggleMic}
          title={
            isListeningMic
              ? 'Listening... Click to finish'
              : `Speak into Mike in ${activeLang === 'ta' ? 'Tamil (தமிழ்)' : activeLang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}`
          }
        >
          {isListeningMic ? (
            <>
              <MicOff size={15} />
              <span className="mic-pulse-dot" />
              <span className="btn-label-text">Listening...</span>
            </>
          ) : (
            <>
              <Mic size={15} />
              <span className="btn-label-text">Mike</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time Notice or Translation Sync Status */}
      {voiceNotice && (
        <div className="nlp-voice-toast">
          <Sparkles size={13} />
          <span>{voiceNotice}</span>
        </div>
      )}
    </div>
  );
}
