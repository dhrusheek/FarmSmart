/**
 * NotificationGateways handles SMS and IVR flows.
 * In a real environment, this would integrate with providers like Twilio or MessageBird.
 */

class NotificationGateways {
    constructor() {
        this.dltRegisteredTemplates = [
            'OTP_TEMPLATE',
            'WEATHER_ALERT',
            'PRICE_ALERT',
            'AUCTION_WIN'
        ];
    }

    /**
     * Send an SMS notification
     * @param {string} phoneNumber 
     * @param {string} message 
     * @param {string} templateId - DLT Template ID
     */
    async sendSMS(phoneNumber, message, templateId) {
        console.log(`[SMS Gateway] Validating DLT Compliance for Template: ${templateId}`);

        if (!this.dltRegisteredTemplates.includes(templateId)) {
            console.error(`[SMS Gateway] DLT Compliance Failed: Template ${templateId} not registered.`);
            return { success: false, error: 'DLT_NON_COMPLIANCE' };
        }

        console.log(`[SMS Gateway] Sending SMS to ${phoneNumber}: ${message}`);

        // Simulate network latency
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, messageId: `msg_${Math.random().toString(36).substr(2, 9)}` });
            }, 1000);
        });
    }

    /**
     * Initiate an IVR call
     * @param {string} phoneNumber 
     * @param {Array} steps - IVR flow steps (e.g., ['Welcome', 'Press 1 for...', 'Thank you'])
     */
    async initiateIVR(phoneNumber, steps) {
        console.log(`[IVR System] Initiating Call to ${phoneNumber}`);
        console.log(`[IVR System] Flow: ${steps.join(' -> ')}`);

        // Simulate IVR flow execution
        return new Promise((resolve) => {
            let currentStep = 0;
            const interval = setInterval(() => {
                console.log(`[IVR System] Executing Step: ${steps[currentStep]}`);
                currentStep++;
                if (currentStep >= steps.length) {
                    clearInterval(interval);
                    resolve({ success: true, callId: `call_${Math.random().toString(36).substr(2, 9)}` });
                }
            }, 1500);
        });
    }
}

export const notificationGateways = new NotificationGateways();
