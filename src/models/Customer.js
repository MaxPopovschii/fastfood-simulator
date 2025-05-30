class Customer {
    constructor(id) {
        this.id = id;
        this.orderNumber = null;
    }

    placeOrder() {
        return new Promise((resolve) => {
            this.orderNumber = Math.floor(Math.random() * 1000) + 1;
            resolve(this.orderNumber);
        });
    }

    waitForOrder() {
        return Promise.resolve(this.orderNumber);
    }
}

export default Customer;