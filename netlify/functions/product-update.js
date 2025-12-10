const { connectDB, Product } = require('./utils/db')

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS'
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    if (event.httpMethod !== 'PUT') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        }
    }

    try {
        await connectDB()

        const { id } = event.queryStringParameters
        const { name, price, image } = JSON.parse(event.body)

        const product = await Product.findByIdAndUpdate(
            id,
            { name, price: Number(price), image },
            { new: true }
        )

        if (!product) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Product not found' })
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, product })
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
