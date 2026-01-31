import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Command, HelpCircle, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { voiceService } from '../../../lib/VoiceService';
import { extractAgricultureTerms } from '../../../lib/agriculturalVocabulary';

const VoiceAssistant = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState('idle'); // idle, listening, processing, error, offline, unsupported
    const [confidence, setConfidence] = useState(1);
    const [pendingAction, setPendingAction] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Check voice support and network status
    useEffect(() => {
        if (!voiceService.isSupported()) {
            setStatus('unsupported');
        }

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const toggleAssistant = () => {
        if (!voiceService.isSupported()) {
            setStatus('unsupported');
            return;
        }

        if (!isOnline) {
            setStatus('offline');
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        if (isListening) {
            voiceService.stop();
            setIsListening(false);
            setStatus('idle');
        } else {
            setIsListening(true);
            setTranscript('');
            setConfidence(1);
            handleListen();
        }
    };

    const handleListen = async () => {
        setStatus('listening');
        try {
            const { transcript: text, confidence: conf, agricultureTerms } = await voiceService.listen(i18n.language);
            setTranscript(text);
            setConfidence(conf);
            setStatus('processing');
            processIntent(text.toLowerCase(), conf, agricultureTerms);
        } catch (error) {
            console.error('Voice Error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        } finally {
            setIsListening(false);
        }
    };

    const processIntent = (text, conf, agricultureTerms = []) => {
        // Handle pending confirmation for complex actions
        if (pendingAction) {
            if (text.includes(t('yes')) || text.includes('confirm') || text.includes('हाँ') || text.includes('ஆம்')) {
                pendingAction.execute();
                setPendingAction(null);
                setStatus('idle');
                return;
            } else if (text.includes(t('no')) || text.includes('cancel') || text.includes('नहीं') || text.includes('வேண்டாம்')) {
                setPendingAction(null);
                setStatus('idle');
                voiceService.speak(t('actionCancelled'), i18n.language);
                return;
            }
        }

        // Low confidence handling
        if (conf < 0.6) {
            setStatus('error');
            voiceService.speak(t('lowConfidence'), i18n.language);
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        // Enhanced intent mapping with agricultural vocabulary
        const intents = [
            // Navigation intents
            { keywords: ['dashboard', 'home', 'डैशबोर्ड', 'முகப்பு', 'ഡാഷ്ബോർഡ്', 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', 'డ్యాష్‌బోర్డ్'], path: '/', label: 'Dashboard' },
            { keywords: ['weather', 'rain', 'मौसम', 'வானிலை', 'കാലാവസ്ഥ', 'ಹವಾಮಾನ', 'వాతావరణం'], path: '/weather', label: 'Weather' },
            { keywords: ['crop', 'farm', 'फसल', 'பயிர்', 'വിള', 'ಬೆಳೆ', 'పంట'], path: '/crops', label: 'Crops' },
            { keywords: ['market', 'price', 'बाजार', 'சந்தை', 'വിപണി', 'ಮಾರುಕಟ್ಟೆ', 'మార్కెట్'], path: '/market', label: 'Market' },
            { keywords: ['inventory', 'stock', 'भंडार', 'கையிருப்பு', 'ശേഖരം', 'ದಾಸ್ತಾನು', 'ఇన్వెంటరీ'], path: '/inventory', label: 'Inventory' },
            { keywords: ['transaction', 'payment', 'लेनदेन', 'பரிவர்த்தனை', 'ഇടപാട്', 'ವಹಿವಾಟು', 'లావాదేవీ'], path: '/transactions', label: 'Transactions' },
            { keywords: ['setting', 'सेटिंग', 'அமைப்பு', 'ക്രമീകരണം', 'ಸೆಟ್ಟಿಂಗ್', 'సెట్టింగ్'], path: '/settings', label: 'Settings' },

            // Price check intent
            {
                keywords: ['price', 'rate', 'cost', 'कीमत', 'விலை', 'വില', 'ಬೆಲೆ', 'ధర', 'check price', 'what is the price'],
                action: () => {
                    // Extract crop name from agriculture terms
                    const cropTerm = agricultureTerms.find(term => term.category === 'crops');
                    if (cropTerm) {
                        voiceService.speak(`${t('checkPrice')} ${cropTerm.term}`, i18n.language);
                        navigate('/market', { state: { searchQuery: cropTerm.term } });
                    } else {
                        voiceService.speak(t('tellMeCropName'), i18n.language);
                        navigate('/market');
                    }
                    setStatus('idle');
                }
            },

            // Search intent
            {
                keywords: ['search', 'find', 'खोज', 'தேடு', 'തിരയുക', 'ಹುಡುಕು', 'వెతుకు'],
                action: () => {
                    const cropTerm = agricultureTerms.find(term => term.category === 'crops');
                    if (cropTerm) {
                        voiceService.speak(`${t('searching')} ${cropTerm.term}`, i18n.language);
                        navigate('/market', { state: { searchQuery: cropTerm.term } });
                    } else {
                        voiceService.speak(t('searching'), i18n.language);
                        navigate('/market');
                    }
                    setStatus('idle');
                }
            },

            // Add crop intent
            {
                keywords: ['add crop', 'new crop', 'फसल जोड़', 'பயிர் சேர்', 'വിള ചേർക്കുക', 'ಬೆಳೆ ಸೇರಿಸು', 'పంట జోడించు'],
                action: () => {
                    voiceService.speak(t('addCrop'), i18n.language);
                    navigate('/crops', { state: { action: 'add' } });
                    setStatus('idle');
                }
            },

            // Show inventory intent
            {
                keywords: ['show inventory', 'my stock', 'इन्वेंटरी दिखाओ', 'கையிருப்பு காட்டு', 'ഇൻവെന്ററി കാണിക്കുക', 'ದಾಸ್ತಾನು ತೋರಿಸು', 'ఇన్వెంటరీ చూపించు'],
                action: () => {
                    voiceService.speak(t('showInventory'), i18n.language);
                    navigate('/inventory');
                    setStatus('idle');
                }
            },

            // Create listing intent
            {
                keywords: ['create listing', 'sell', 'list', 'सूची बनाएं', 'பட்டியல் உருவாக்கு', 'ലിസ്റ്റിംഗ് സൃഷ്ടിക്കുക', 'ಪಟ್ಟಿ ರಚಿಸು', 'జాబితా సృష్టించు'],
                action: () => {
                    voiceService.speak(t('createListing'), i18n.language);
                    navigate('/market', { state: { action: 'create-listing' } });
                    setStatus('idle');
                }
            },

            // Logout intent (with confirmation)
            {
                keywords: ['logout', 'sign out', 'लॉग आउट', 'வெளியேறு', 'ലോഗൗട്ട്', 'ಲಾಗ್ ಔಟ್', 'లాగ్ అవుట్'],
                action: () => {
                    setPendingAction({
                        execute: () => navigate('/login'),
                        message: t('Are you sure you want to logout?')
                    });
                    voiceService.speak(t('Are you sure you want to logout?'), i18n.language);
                }
            }
        ];

        const match = intents.find(intent =>
            intent.keywords.some(keyword => text.includes(keyword))
        );

        if (match) {
            if (match.path) {
                voiceService.speak(`${t('Navigating to')} ${t(match.label)}`, i18n.language);
                navigate(match.path);
                setStatus('idle');
            } else if (match.action) {
                match.action();
            }
        } else {
            // Log unrecognized command
            voiceService.logUnrecognizedCommand(text, {
                page: location.pathname,
                language: i18n.language,
                confidence: conf,
                agricultureTerms
            });

            setStatus('error');
            voiceService.speak(t('unrecognizedCommand'), i18n.language);
            setTimeout(() => {
                setStatus('idle');
                setShowHelp(true); // Show contextual help
            }, 2000);
        }
    };

    const getContextualCommands = () => {
        const currentPath = location.pathname;
        const commonCommands = [
            t('Go To Dashboard'),
            t('Check Weather'),
            t('Show My Crops')
        ];

        if (currentPath === '/market') {
            return [...commonCommands, t('checkPrice'), t('createListing'), t('searchFor')];
        } else if (currentPath === '/crops') {
            return [...commonCommands, t('addCrop'), t('Show My Crops')];
        } else if (currentPath === '/inventory') {
            return [...commonCommands, t('showInventory')];
        }

        return commonCommands;
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Contextual Help Panel */}
            {showHelp && status === 'idle' && (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-emerald-100 dark:border-emerald-900/30 w-72 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <HelpCircle size={16} className="text-emerald-500" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {t('tryThese')}
                            </span>
                        </div>
                        <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {getContextualCommands().slice(0, 4).map((cmd, idx) => (
                            <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                <Command size={12} className="text-emerald-500" />
                                "{cmd}"
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Status Panel */}
            {(isListening || status !== 'idle') && status !== 'unsupported' && (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-emerald-100 dark:border-emerald-900/30 w-64 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            {status === 'offline' ? (
                                <WifiOff size={16} className="text-red-500" />
                            ) : (
                                <div className={`w-3 h-3 rounded-full ${status === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                            )}
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {status === 'listening' ? t('Listening') : status === 'offline' ? t('networkOffline') : t('Voice Assistant')}
                            </span>
                        </div>
                        <button onClick={() => setStatus('idle')} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>

                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 min-h-[20px]">
                        {pendingAction ? pendingAction.message : (transcript || t('Speak Now'))}
                    </p>

                    {status === 'processing' && (
                        <div className="mt-2">
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                <span>{t('Confidence')}</span>
                                <span>{Math.round(confidence * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${confidence > 0.8 ? 'bg-emerald-500' : confidence > 0.6 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${confidence * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {status === 'listening' && (
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-1 bg-emerald-500 rounded-full animate-bounce" style={{ height: '12px', animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    )}

                    {status === 'error' && (
                        <p className="text-xs text-red-500 mt-2">{t('commandLogged')}</p>
                    )}
                </div>
            )}

            {/* Unsupported Browser Message */}
            {status === 'unsupported' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 w-72 animate-in fade-in">
                    <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">{t('voiceNotSupported')}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">{t('useIconNavigation')}</p>
                    <button onClick={() => setStatus('idle')} className="mt-3 text-xs text-amber-700 dark:text-amber-300 underline">
                        {t('Cancelled')}
                    </button>
                </div>
            )}

            {/* Voice Button */}
            <button
                onClick={toggleAssistant}
                disabled={status === 'unsupported'}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : status === 'unsupported'
                            ? 'bg-slate-400 text-white cursor-not-allowed'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
            >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                {!isListening && status !== 'unsupported' && (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
                )}
            </button>

            {/* Help Button */}
            {!showHelp && status === 'idle' && (
                <button
                    onClick={() => setShowHelp(true)}
                    className="absolute -top-12 right-0 text-xs text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center gap-1"
                >
                    <HelpCircle size={14} />
                    {t('whatCanISay')}
                </button>
            )}
        </div>
    );
};

export default VoiceAssistant;
