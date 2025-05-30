import Order from '../src/models/Order';

describe('Order', () => {
    let order;

    beforeEach(() => {
        order = new Order(123, 1);
    });

    test('should create order with correct properties', () => {
        expect(order.orderNumber).toBe(123);
        expect(order.customerId).toBe(1);
        expect(order.status).toBe('pending');
        expect(order.createdAt).toBeInstanceOf(Date);
    });

    test('should update status when preparing order', () => {
        order.prepare();
        expect(order.status).toBe('preparing');
    });

    test('should update status when completing order', () => {
        order.complete();
        expect(order.status).toBe('ready');
    });

    test('should update status when delivering order', () => {
        order.deliver();
        expect(order.status).toBe('delivered');
    });
});