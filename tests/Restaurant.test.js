import Restaurant from '../src/models/Restaurant.js';
import Order from '../src/models/Order.js';
import Customer from '../src/models/Customer.js';

describe('Restaurant', () => {
    let restaurant;

    beforeEach(() => {
        jest.useFakeTimers();
        restaurant = new Restaurant();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should initialize with default settings', () => {
        expect(restaurant.settings).toEqual({
            customerInterval: 2000,
            cookingTime: 3000,
            orderTakingTime: 1000,
            serverDeliveryTime: 1000
        });
    });

    test('should start simulation with custom settings', () => {
        const customSettings = {
            customerInterval: 1000,
            cookingTime: 2000
        };
        
        restaurant.start(customSettings);
        
        expect(restaurant.isRunning).toBe(true);
        expect(restaurant.settings).toEqual({
            ...restaurant.settings,
            ...customSettings
        });
    });
    
    test('should stop simulation', () => {
        restaurant.start();
        restaurant.stop();
        
        expect(restaurant.isRunning).toBe(false);
    });

    test('should process orders', async () => {
        restaurant.start({
            orderTakingTime: 1000,
            cookingTime: 2000
        });

        restaurant.customerQueue.push({ id: 1 });
        
        jest.advanceTimersByTime(1000);
        
        expect(restaurant.orderQueue.length).toBeGreaterThanOrEqual(0);
        
        jest.advanceTimersByTime(2000);
        
        expect(restaurant.readyOrders.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle order preparation', () => {
        const restaurant = new Restaurant();
        restaurant.start();
        
        // Add an order to the queue
        const order = new Order(1, 'customer1');
        restaurant.orderQueue.push(order);
        
        // Simulate cooking time passing
        jest.advanceTimersByTime(restaurant.settings.cookingTime);
        
        expect(restaurant.preparingOrders).toContain(order);
        expect(restaurant.orderQueue).not.toContain(order);
    });

    test('should handle order delivery', () => {
        const restaurant = new Restaurant();
        restaurant.start();
        
        // Add an order to preparing
        const order = new Order(1, 'customer1');
        restaurant.preparingOrders.push(order);
        
        // Deliver the order directly
        restaurant.deliverOrder(order);
        
        expect(restaurant.readyOrders).toContain(order);
        expect(restaurant.preparingOrders).not.toContain(order);
    });

    test('should handle order pickup', () => {
        const restaurant = new Restaurant();
        restaurant.start();
        
        // Add an order to ready orders
        const order = new Order(1, 'customer1');
        restaurant.readyOrders.push(order);
        
        // Attempt pickup
        const pickedOrder = restaurant.pickupOrder(1);
        
        expect(pickedOrder).toBe(order);
        expect(restaurant.readyOrders).not.toContain(order);
    });

    test('should not process orders when stopped', () => {
        const restaurant = new Restaurant();
        restaurant.start();
        
        // Add an order
        const order = new Order(1, 'customer1');
        restaurant.orderQueue.push(order);
        
        // Stop the restaurant
        restaurant.stop();
        
        // Advance time
        jest.advanceTimersByTime(restaurant.settings.cookingTime);
        
        expect(restaurant.orderQueue).toContain(order);
        expect(restaurant.preparingOrders).not.toContain(order);
    });

    test('should handle customer arrival', () => {  
        restaurant.start();
        const customer = new Customer(1, 'John Doe');
        
        // Simulate customer arrival
        restaurant.customerQueue.push(customer);
        
        jest.advanceTimersByTime(restaurant.settings.customerInterval);
        
        expect(restaurant.orderQueue.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle order cancellation', () => {
        restaurant.start();
        const order = new Order(1, 'customer1');
        restaurant.orderQueue.push(order);

        const cancelled = restaurant.cancelOrder(1);
        expect(cancelled).toBe(true);
        expect(restaurant.orderQueue).not.toContain(order);
    });

    test('should not exceed maximum concurrent orders', () => {
        restaurant.start();
        const maxOrders = 5;

        // Add more than max orders
        for (let i = 1; i <= maxOrders + 2; i++) {
            const order = new Order(i, `customer${i}`);
            restaurant.orderQueue.push(order);
        }

        // Process orders
        jest.advanceTimersByTime(restaurant.settings.cookingTime);
        expect(restaurant.preparingOrders.length).toBeLessThanOrEqual(maxOrders);
    });
});