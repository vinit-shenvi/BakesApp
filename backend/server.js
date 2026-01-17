
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory data store
let orders = [
    {
        id: "ORD-INIT-001",
        customerName: "Demo Customer",
        storeName: "Kanti Bakes - HSR",
        customerAddress: "123 Indiranagar, Bangalore",
        storeAddress: "Sector 7, HSR Layout",
        items: ["Mysore Pak (500g)", "Special Mixture"],
        amount: 540.0,
        status: "newRequest", // newRequest, accepted, pickedUp, delivered
        distanceKm: 4.5,
        timestamp: new Date()
    }
];

// GET all orders (for Admin & Delivery polling)
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// POST new order (from Customer App)
app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date(),
        status: "newRequest",
        ...req.body
    };
    orders.unshift(newOrder); // Add to top
    console.log('New Order Received:', newOrder.id);
    res.status(201).json(newOrder);
});

// PATCH update status (from Delivery App or Admin)
app.patch('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        console.log(`Order ${id} updated to ${status}`);
        res.json(order);
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
