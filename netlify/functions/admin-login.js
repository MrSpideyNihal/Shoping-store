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
        const { email, password } = JSON.parse(event.body)

        // Hardcoded admin credentials
        const ADMIN_EMAIL = 'admin@shop.com'
        const ADMIN_PASSWORD = 'admin123'

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    token: 'admin-token-' + Date.now()
                })
            }
        }

        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, error: 'Invalid credentials' })
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
