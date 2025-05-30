class Order {
    constructor(orderNumber, customerId) {
        this.orderNumber = orderNumber;
        this.customerId = customerId;
        this.status = 'pending';
        this.createdAt = new Date();
    }

    prepare() {
        this.status = 'preparing';
    }

    complete() {
        this.status = 'ready';
    }

    deliver() {
        this.status = 'delivered';
    }
}

export default Order;