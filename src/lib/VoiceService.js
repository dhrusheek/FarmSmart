/**
 * VoiceService handles Speech-to-Text (Recognition) and Text-to-Speech (Synthesis)
 * supporting multiple Indian languages with agricultural vocabulary support.
 */

import { matchAgricultureTerm, extractAgricultureTerms } from './agriculturalVocabulary';

const languageMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    ml: 'ml-IN',
    kn: 'kn-IN',
    te: 'te-IN'
};

class VoiceService {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.unrecognizedCommands = [];
        this.dialogueState = null;

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 3; // Get multiple alternatives for better matching
        }
    }

    /**
     * Check if voice recognition is supported
     */
    isSupported() {
        return !!this.recognition;
    }

    /**
     * Check network status
     */
    isOnline() {
        return navigator.onLine;
    }

    /**
     * Speak text in a specific language
     * @param {string} text - The text to speak
     * @param {string} langCode - en, hi, ta, etc.
     */
    speak(text, langCode = 'en') {
        if (!this.synthesis) return;

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = languageMap[langCode] || 'en-IN';
        utterance.rate = 0.9; // Slightly slower for better clarity

        // Find a suitable voice if available
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith(langCode));
        if (preferredVoice) utterance.voice = preferredVoice;

        this.synthesis.speak(utterance);
    }

    /**
     * Start listening for voice input with agricultural vocabulary support
     * @param {string} langCode - Language to listen in
     * @returns {Promise<object>} - { transcript, confidence, agricultureTerms }
     */
    listen(langCode = 'en') {
        return new Promise((resolve, reject) => {
            if (!this.recognition) {
                reject('Speech recognition not supported');
                return;
            }

            if (!this.isOnline()) {
                reject('Network offline');
                return;
            }

            this.recognition.lang = languageMap[langCode] || 'en-IN';

            this.recognition.onresult = (event) => {
                const result = event.results[0][0];
                let transcript = result.transcript;
                const confidence = result.confidence;

                // Extract agricultural terms from transcript
                const agricultureTerms = extractAgricultureTerms(transcript, langCode);

                // Try fuzzy matching if confidence is low
                if (confidence < 0.7 && agricultureTerms.length > 0) {
                    // Replace with best matched agricultural terms
                    agricultureTerms.forEach(match => {
                        if (match.confidence > 0.7) {
                            transcript = transcript.replace(
                                new RegExp(match.term, 'gi'),
                                match.term
                            );
                        }
                    });
                }

                this.recognition.stop();
                resolve({ transcript, confidence, agricultureTerms });
            };

            this.recognition.onerror = (event) => {
                this.recognition.stop();
                reject(event.error);
            };

            this.recognition.start();
        });
    }

    /**
     * Log unrecognized command for improvement
     * @param {string} command - The unrecognized command
     * @param {object} context - Context information (page, user, etc.)
     */
    logUnrecognizedCommand(command, context = {}) {
        const logEntry = {
            command,
            context,
            timestamp: new Date().toISOString(),
            language: context.language || 'en'
        };

        this.unrecognizedCommands.push(logEntry);

        // Store in localStorage for persistence
        try {
            const stored = JSON.parse(localStorage.getItem('voiceUnrecognizedCommands') || '[]');
            stored.push(logEntry);
            // Keep only last 100 entries
            if (stored.length > 100) stored.shift();
            localStorage.setItem('voiceUnrecognizedCommands', JSON.stringify(stored));
        } catch (error) {
            console.error('Failed to log unrecognized command:', error);
        }

        console.log('Unrecognized command logged:', logEntry);
    }

    /**
     * Get dialogue state
     */
    getDialogueState() {
        return this.dialogueState;
    }

    /**
     * Set dialogue state for multi-step interactions
     * @param {object} state - { intent, slots, step, context }
     */
    setDialogueState(state) {
        this.dialogueState = state;
    }

    /**
     * Clear dialogue state
     */
    clearDialogueState() {
        this.dialogueState = null;
    }

    /**
     * Get unrecognized commands
     */
    getUnrecognizedCommands() {
        try {
            return JSON.parse(localStorage.getItem('voiceUnrecognizedCommands') || '[]');
        } catch {
            return [];
        }
    }

    stop() {
        if (this.recognition) this.recognition.stop();
        if (this.synthesis) this.synthesis.cancel();
    }
}

export const voiceService = new VoiceService();
