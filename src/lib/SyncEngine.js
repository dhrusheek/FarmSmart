/**
 * SyncEngine handles offline-first data synchronization
 * Uses LocalStorage for offline queue and progressive sync
 */

class SyncEngine {
    constructor() {
        this.syncQueue = this.loadQueue();
        this.isOnline = navigator.onLine;
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('online', () => {
            console.log('[Sync Engine] Network restored, starting sync...');
            this.isOnline = true;
            this.processQueue();
        });

        window.addEventListener('offline', () => {
            console.log('[Sync Engine] Network lost, entering offline mode');
            this.isOnline = false;
        });
    }

    loadQueue() {
        try {
            const stored = localStorage.getItem('syncQueue');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('[Sync Engine] Failed to load queue:', error);
            return [];
        }
    }

    saveQueue() {
        try {
            localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
        } catch (error) {
            console.error('[Sync Engine] Failed to save queue:', error);
        }
    }

    /**
     * Add an action to the sync queue
     * @param {string} type - Action type (e.g., 'CREATE_CROP', 'UPDATE_INVENTORY')
     * @param {object} payload - Action data
     */
    enqueue(type, payload) {
        const action = {
            id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            payload,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        this.syncQueue.push(action);
        this.saveQueue();
        console.log(`[Sync Engine] Queued: ${type}`, action);

        if (this.isOnline) {
            this.processQueue();
        }

        return action.id;
    }

    /**
     * Process the sync queue
     */
    async processQueue() {
        if (!this.isOnline || this.syncQueue.length === 0) return;

        console.log(`[Sync Engine] Processing ${this.syncQueue.length} queued actions...`);

        const pending = this.syncQueue.filter(action => action.status === 'pending');

        for (const action of pending) {
            try {
                action.status = 'syncing';
                this.saveQueue();

                // Simulate API call
                await this.syncAction(action);

                action.status = 'completed';
                action.completedAt = new Date().toISOString();
                console.log(`[Sync Engine] Synced: ${action.type}`);
            } catch (error) {
                action.status = 'failed';
                action.error = error.message;
                console.error(`[Sync Engine] Failed to sync: ${action.type}`, error);
            }

            this.saveQueue();
        }

        // Clean up completed actions older than 24 hours
        const oneDayAgo = Date.now() - 86400000;
        this.syncQueue = this.syncQueue.filter(action =>
            action.status !== 'completed' || new Date(action.timestamp).getTime() > oneDayAgo
        );
        this.saveQueue();
    }

    /**
     * Simulate syncing an action to the server
     */
    async syncAction(action) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1000 + Math.random() * 2000);
        });
    }

    /**
     * Get sync queue status
     */
    getStatus() {
        return {
            isOnline: this.isOnline,
            total: this.syncQueue.length,
            pending: this.syncQueue.filter(a => a.status === 'pending').length,
            syncing: this.syncQueue.filter(a => a.status === 'syncing').length,
            failed: this.syncQueue.filter(a => a.status === 'failed').length,
            completed: this.syncQueue.filter(a => a.status === 'completed').length
        };
    }

    /**
     * Retry failed actions
     */
    retryFailed() {
        this.syncQueue.forEach(action => {
            if (action.status === 'failed') {
                action.status = 'pending';
                delete action.error;
            }
        });
        this.saveQueue();
        this.processQueue();
    }
}

export const syncEngine = new SyncEngine();
