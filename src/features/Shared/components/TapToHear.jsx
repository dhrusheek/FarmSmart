import React from 'react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { voiceService } from '../../../lib/VoiceService';

const TapToHear = ({ text, className = "" }) => {
    const { i18n, t } = useTranslation();

    const handleSpeak = (e) => {
        e.stopPropagation();
        voiceService.speak(text, i18n.language);
    };

    return (
        <button
            onClick={handleSpeak}
            className={`p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center gap-2 group ${className}`}
            title={t('Tap To Hear')}
            aria-label={t('Tap To Hear')}
        >
            <Volume2 size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden group-hover:inline">
                {t('Tap To Hear')}
            </span>
        </button>
    );
};

export default TapToHear;
