import Customer from '../src/models/Customer';

describe('Customer', () => {
    let customer;

    beforeEach(() => {
        customer = new Customer(1);
    });

    test('should create customer with id', () => {
        expect(customer.id).toBe(1);
        expect(customer.orderNumber).toBeNull();
    });

    test('should generate order number when placing order', async () => {
        const orderNumber = await customer.placeOrder();
        expect(orderNumber).toBeGreaterThan(0);
        expect(orderNumber).toBeLessThan(1001);
        expect(customer.orderNumber).toBe(orderNumber);
    });

    test('should return order number when waiting for order', async () => {
        customer.orderNumber = 123;
        const result = await customer.waitForOrder();
        expect(result).toBe(123);
    });
});