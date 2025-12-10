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

        const { orderId, status } = JSON.parse(event.body)

        if (!['accepted', 'rejected'].includes(status)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid status' })
            }
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        )

        if (!order) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Order not found' })
            }
        }

        return {
            statusCode: 200,
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
