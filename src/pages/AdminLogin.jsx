import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post('/.netlify/functions/admin-login', formData)

            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token)
                navigate('/admin/dashboard')
            } else {
                alert('Invalid credentials!')
            }
        } catch (error) {
            console.error('Login error:', error)
            alert('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Admin Login
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="admin@shop.com"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
