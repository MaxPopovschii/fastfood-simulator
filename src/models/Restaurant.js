import Customer from './Customer.js';
import Order from './Order.js';

class Restaurant {
    constructor() {
        this.orderQueue = [];
        this.preparingOrders = [];
        this.readyOrders = [];
        this.customerQueue = [];
        this.isRunning = false;
        this.settings = {
            customerInterval: 2000,
            cookingTime: 3000,
            orderTakingTime: 1000,
            serverDeliveryTime: 1000
        };
        this.maxConcurrentOrders = 5;
    }

    start(settings = {}) {
        this.settings = { ...this.settings, ...settings };
        this.isRunning = true;
        this.generateCustomers();
        this.processOrders();
    }

    stop() {
        this.isRunning = false;
    }

    generateCustomers() {
        if (!this.isRunning) return;
        
        const customer = new Customer(Date.now());
        this.customerQueue.push(customer);
        setTimeout(() => this.generateCustomers(), this.settings.customerInterval);
    }

    processOrders() {
        if (!this.isRunning) return;

        // Process one customer at a time to create order
        if (this.customerQueue.length > 0) {
            const customer = this.customerQueue.shift();
            if (customer && typeof customer.placeOrder === 'function') {
                customer.placeOrder()
                    .then(orderNumber => {
                        const order = new Order(orderNumber, customer.id);
                        this.orderQueue.push(order);
                    });
            }
        }

        // Process one order at a time for cooking
        if (this.orderQueue.length > 0 && this.preparingOrders.length < this.maxConcurrentOrders) {
            const orderToProcess = this.orderQueue.shift();
            this.preparingOrders.push(orderToProcess);
            
            // Schedule cooking completion
            setTimeout(() => {
                if (this.isRunning) {
                    this.finishCooking(orderToProcess);
                }
            }, this.settings.cookingTime);
        }

        // Schedule next processing cycle only if restaurant is running
        if (this.isRunning) {
            setTimeout(() => this.processOrders(), this.settings.orderTakingTime);
        }
    }

    finishCooking(order) {
        const index = this.preparingOrders.indexOf(order);
        if (index !== -1) {
            this.preparingOrders.splice(index, 1);
            this.readyOrders.push(order);
        }
    }

    deliverOrder(order) {
        const index = this.preparingOrders.indexOf(order);
        if (index !== -1) {
            this.preparingOrders.splice(index, 1);
            this.readyOrders.push(order);
            return true;
        }
        return false;
    }

    pickupOrder(orderNumber) {
        const index = this.readyOrders.findIndex(o => o.orderNumber === orderNumber);
        if (index !== -1) {
            return this.readyOrders.splice(index, 1)[0];
        }
        return null;
    }

    cancelOrder(orderNumber) {
        const index = this.orderQueue.findIndex(o => o.orderNumber === orderNumber);
        if (index !== -1) {
            this.orderQueue.splice(index, 1);
            return true;
        }
        return false;
    }
}

export default Restaurant;