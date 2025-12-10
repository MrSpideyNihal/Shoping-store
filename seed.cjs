const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://admin:nihal123@cluster0.9rqju8p.mongodb.net/shopdb'

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
})

const Product = mongoose.model('Product', ProductSchema)

const sampleProducts = [
    {
        name: 'Classic White T-Shirt',
        price: 499,
        image: 'https://i.ibb.co/QXKtF7V/white-tshirt.jpg'
    },
    {
        name: 'Black Premium T-Shirt',
        price: 599,
        image: 'https://i.ibb.co/7XqwsLq/black-tshirt.jpg'
    },
    {
        name: 'Navy Blue T-Shirt',
        price: 549,
        image: 'https://i.ibb.co/kKZN8Yq/navy-tshirt.jpg'
    },
    {
        name: 'Red Sports T-Shirt',
        price: 649,
        image: 'https://i.ibb.co/ZMxB4Kq/red-tshirt.jpg'
    },
    {
        name: 'Grey Casual T-Shirt',
        price: 499,
        image: 'https://i.ibb.co/Qd7JXNL/grey-tshirt.jpg'
    },
    {
        name: 'Green Polo T-Shirt',
        price: 799,
        image: 'https://i.ibb.co/VYqfKYq/green-polo.jpg'
    },
    {
        name: 'Yellow Graphic T-Shirt',
        price: 699,
        image: 'https://i.ibb.co/hYqXqYq/yellow-graphic.jpg'
    },
    {
        name: 'Purple V-Neck T-Shirt',
        price: 599,
        image: 'https://i.ibb.co/ZXqYqYq/purple-vneck.jpg'
    }
]

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...')
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Connected to MongoDB')

        // Check if products already exist
        const existingProducts = await Product.countDocuments()

        if (existingProducts > 0) {
            console.log(`Database already has ${existingProducts} products. Skipping seed.`)
            console.log('To re-seed, delete all products first.')
        } else {
            console.log('Seeding database with sample products...')
            await Product.insertMany(sampleProducts)
            console.log('✓ Successfully added 8 sample products!')
        }

        await mongoose.connection.close()
        console.log('Database connection closed')
    } catch (error) {
        console.error('Error seeding database:', error)
        process.exit(1)
    }
}

seedDatabase()
