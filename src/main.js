import Restaurant from './models/Restaurant.js';

class SimulationUI {
    constructor() {
        this.restaurant = new Restaurant();
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.customerCount = document.getElementById('customerCount');
        this.currentOrder = document.getElementById('currentOrder');
        this.waitingOrders = document.getElementById('waitingOrders');
        this.readyOrder = document.getElementById('readyOrder');
        this.pickupCustomers = document.getElementById('pickupCustomers');
        this.simStatus = document.getElementById('simStatus');
        this.pickupArea = document.querySelector('.pickup-visualization');
        this.addPickupListeners();
    }

    addEventListeners() {
        this.startBtn.addEventListener('click', () => this.startSimulation());
        this.stopBtn.addEventListener('click', () => this.stopSimulation());
    }

    addPickupListeners() {
        this.pickupArea.addEventListener('click', (e) => {
            const orderElement = e.target.closest('.order.ready');
            if (orderElement) {
                const orderNumber = parseInt(orderElement.dataset.orderNumber);
                const pickedOrder = this.restaurant.pickupOrder(orderNumber);
                
                if (pickedOrder) {
                    // Animazione di ritiro
                    orderElement.classList.add('picked');
                    setTimeout(() => {
                        orderElement.remove();
                        // Rimuovi anche il cliente in attesa
                        const waitingCustomers = document.querySelector('.pickup-customers');
                        if (waitingCustomers.firstChild) {
                            waitingCustomers.firstChild.remove();
                        }
                    }, 500);
                }
            }
        });
    }

    startSimulation() {
        const settings = {
            customerInterval: parseInt(document.getElementById('customerInterval').value),
            cookingTime: parseInt(document.getElementById('cookingTime').value),
            orderTakingTime: parseInt(document.getElementById('orderTakingTime').value),
            serverDeliveryTime: parseInt(document.getElementById('serverDeliveryTime').value)
        };

        this.restaurant.start(settings);
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.updateSimStatus(true);
        this.startUpdating();
    }

    stopSimulation() {
        this.restaurant.stop();
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.updateSimStatus(false);
    }

    updateSimStatus(isRunning) {
        if (this.simStatus) {
            if (isRunning) {
                this.simStatus.textContent = "Simulazione ATTIVA";
                this.simStatus.classList.remove('stopped');
                this.simStatus.classList.add('active');
            } else {
                this.simStatus.textContent = "Simulazione STOPPATA";
                this.simStatus.classList.remove('active');
                this.simStatus.classList.add('stopped');
            }
        }
    }

    startUpdating() {
        if (!this.restaurant.isRunning) return;

        this.updateUI();
        requestAnimationFrame(() => this.startUpdating());
    }

    updateUI() {
        // Aggiorna i contatori
        this.customerCount.textContent = this.restaurant.customerQueue.length;
        this.waitingOrders.textContent = this.restaurant.orderQueue.length;
        
        // Visualizza i clienti in coda
        const customerQueue = document.querySelector('.customer-queue');
        customerQueue.innerHTML = '';
        this.restaurant.customerQueue.forEach(() => {
            const customer = document.createElement('div');
            customer.className = 'customer';
            customerQueue.appendChild(customer);
        });

        // Visualizza gli ordini in preparazione
        const ordersInPrep = document.querySelector('.orders-in-preparation');
        ordersInPrep.innerHTML = '';
        this.restaurant.preparingOrders.forEach(order => {
            const orderEl = document.createElement('div');
            orderEl.className = 'order cooking';
            orderEl.dataset.orderNumber = order.orderNumber;
            ordersInPrep.appendChild(orderEl);
        });

        // Visualizza gli ordini pronti e i clienti in attesa
        const pickupArea = document.querySelector('.pickup-visualization');
        pickupArea.innerHTML = '';

        // Aggiungi il server (cameriere)
        const server = document.createElement('div');
        server.className = 'server';
        server.textContent = '👨‍💼';
        pickupArea.appendChild(server);

        // Aggiorna gli ordini pronti con indicazione di click
        const pickupOrders = document.querySelector('.pickup-orders');
        pickupOrders.innerHTML = '';
        this.restaurant.readyOrders.forEach(order => {
            const orderEl = document.createElement('div');
            orderEl.className = 'order ready clickable';
            orderEl.dataset.orderNumber = order.orderNumber;
            orderEl.innerHTML = `
                <span class="order-number">#${order.orderNumber}</span>
                <span class="order-icon">🍔</span>
                <span class="pickup-hint">Click to pickup</span>
            `;
            pickupOrders.appendChild(orderEl);
        });

        // Container per i clienti in attesa
        const pickupCustomers = document.createElement('div');
        pickupCustomers.className = 'pickup-customers';
        this.restaurant.readyOrders.forEach(() => {
            const customer = document.createElement('div');
            customer.className = 'customer waiting';
            customer.textContent = '🧍';
            pickupCustomers.appendChild(customer);
        });
        pickupArea.appendChild(pickupCustomers);

        // Aggiorna display ordini
        this.currentOrder.textContent = this.restaurant.preparingOrders.length > 0 
            ? this.restaurant.preparingOrders[0].orderNumber 
            : 'None';
        this.readyOrder.textContent = this.restaurant.readyOrders.length > 0 
            ? this.restaurant.readyOrders[0].orderNumber 
            : 'None';
        this.pickupCustomers.textContent = this.restaurant.readyOrders.length;
    }
}

// Initialize the simulation
const simulation = new SimulationUI();