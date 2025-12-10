const { connectDB, Product } = require('./utils/db')

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    try {
        await connectDB()

        if (event.httpMethod === 'GET') {
            const products = await Product.find({})
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(products)
            }
        }

        if (event.httpMethod === 'POST') {
            const { name, price, image } = JSON.parse(event.body)

            const product = new Product({
                name,
                price: Number(price),
                image
            })

            await product.save()

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ success: true, product })
            }
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        }
    } catch (error) {
        console.error('Error:', error)
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        }
    }
}
