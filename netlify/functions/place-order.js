const { connectDB, Order } = require('./utils/db')

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        }
    }

    try {
        await connectDB()

        const { name, phone, address, items, total } = JSON.parse(event.body)

        const order = new Order({
            name,
            phone,
            address,
            items,
            total,
            status: 'pending',
            date: new Date()
        })

        await order.save()

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ success: true, order })
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
