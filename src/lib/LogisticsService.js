/**
 * LogisticsService provides mock real-time partner APIs
 * for availability and cost comparison
 */

class LogisticsService {
    constructor() {
        this.partners = [
            { id: 1, name: 'FastShip Logistics', rating: 4.5, coverage: 'National' },
            { id: 2, name: 'GreenTransport Co.', rating: 4.2, coverage: 'Regional' },
            { id: 3, name: 'RuralConnect Express', rating: 4.7, coverage: 'Rural Focus' }
        ];
    }

    /**
     * Get real-time quotes from logistics partners
     * @param {object} shipment - { origin, destination, weight, crop }
     */
    async getQuotes(shipment) {
        console.log('[Logistics Service] Fetching quotes for:', shipment);

        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        const baseRate = this.calculateBaseRate(shipment);

        return this.partners.map(partner => {
            const multiplier = 0.8 + Math.random() * 0.4; // 80% to 120% of base
            const cost = Math.round(baseRate * multiplier);
            const available = Math.random() > 0.2; // 80% availability
            const eta = Math.ceil(2 + Math.random() * 5); // 2-7 days

            return {
                partnerId: partner.id,
                partnerName: partner.name,
                rating: partner.rating,
                cost,
                currency: 'INR',
                available,
                eta: available ? `${eta} days` : null,
                vehicleType: this.getVehicleType(shipment.weight),
                insurance: Math.round(cost * 0.02)
            };
        });
    }

    calculateBaseRate(shipment) {
        const distanceKm = this.estimateDistance(shipment.origin, shipment.destination);
        const weightQuintal = shipment.weight;

        // Base rate: ₹10 per km per quintal
        return distanceKm * weightQuintal * 10;
    }

    estimateDistance(origin, destination) {
        // Mock distance calculation
        const distances = {
            'Delhi-Mumbai': 1400,
            'Delhi-Kolkata': 1500,
            'Mumbai-Bangalore': 980,
            'Chennai-Hyderabad': 630
        };

        const key = `${origin}-${destination}`;
        return distances[key] || 500 + Math.random() * 1000;
    }

    getVehicleType(weight) {
        if (weight < 50) return 'Pickup Truck';
        if (weight < 200) return 'Mini Truck';
        if (weight < 500) return 'Medium Truck';
        return 'Heavy Truck';
    }

    /**
     * Check partner availability for a specific date
     */
    async checkAvailability(partnerId, date) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const partner = this.partners.find(p => p.id === partnerId);
        if (!partner) throw new Error('Partner not found');

        // Simulate availability (70% chance)
        const available = Math.random() > 0.3;

        return {
            partnerId,
            partnerName: partner.name,
            date,
            available,
            slotsRemaining: available ? Math.ceil(Math.random() * 10) : 0
        };
    }
}

export const logisticsService = new LogisticsService();
