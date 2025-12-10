const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://admin:nihal123@cluster0.9rqju8p.mongodb.net/shopdb'

let cachedDb = null

const connectDB = async () => {
    if (cachedDb) {
        return cachedDb
    }

    const db = await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    cachedDb = db
    return db
}

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
})

const OrderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: { type: Array, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now }
})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

module.exports = { connectDB, Product, Order }
