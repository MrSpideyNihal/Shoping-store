import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Analytics() {
    const [stats, setStats] = useState({
        totalEarnings: 0,
        totalOrders: 0,
        pendingOrders: 0,
        acceptedOrders: 0,
        rejectedOrders: 0,
        totalProducts: 0
    })
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            navigate('/admin')
            return
        }
        fetchAnalytics()
    }, [navigate])

    const fetchAnalytics = async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                axios.get('/.netlify/functions/orders'),
                axios.get('/.netlify/functions/products')
            ])

            const orders = ordersRes.data
            const products = productsRes.data

            const totalEarnings = orders
                .filter(order => order.status === 'accepted')
                .reduce((sum, order) => sum + order.total, 0)

            const stats = {
                totalEarnings,
                totalOrders: orders.length,
                pendingOrders: orders.filter(o => o.status === 'pending').length,
                acceptedOrders: orders.filter(o => o.status === 'accepted').length,
                rejectedOrders: orders.filter(o => o.status === 'rejected').length,
                totalProducts: products.length
            }

            setStats(stats)
            setRecentOrders(orders.slice(0, 5))
        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        navigate('/admin')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading analytics...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            >
                                Manage Store
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Earnings */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Earnings</p>
                                <p className="text-3xl font-bold mt-2">₹{stats.totalEarnings.toLocaleString()}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-full p-3">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-full p-3">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Products */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Total Products</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-full p-3">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                        <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                    </div>

                    {/* Accepted Orders */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <p className="text-gray-600 text-sm font-medium">Accepted Orders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.acceptedOrders}</p>
                    </div>

                    {/* Rejected Orders */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                        <p className="text-gray-600 text-sm font-medium">Rejected Orders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rejectedOrders}</p>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">{order.name}</td>
                                            <td className="px-4 py-3">{order.phone}</td>
                                            <td className="px-4 py-3 font-semibold">₹{order.total}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Analytics
