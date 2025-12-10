import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminDashboard() {
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [activeTab, setActiveTab] = useState('products')
    const [showProductForm, setShowProductForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        image: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            navigate('/admin')
            return
        }
        fetchProducts()
        fetchOrders()
    }, [navigate])

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/.netlify/functions/products')
            setProducts(response.data)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/.netlify/functions/orders')
            setOrders(response.data)
        } catch (error) {
            console.error('Error fetching orders:', error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        navigate('/admin')
    }

    const handleProductFormChange = (e) => {
        setProductForm({
            ...productForm,
            [e.target.name]: e.target.value
        })
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/.netlify/functions/products', productForm)
            setProductForm({ name: '', price: '', image: '' })
            setShowProductForm(false)
            fetchProducts()
            alert('Product added successfully!')
        } catch (error) {
            console.error('Error adding product:', error)
            alert('Failed to add product')
        }
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product)
        setProductForm({
            name: product.name,
            price: product.price,
            image: product.image
        })
        setShowProductForm(true)
    }

    const handleUpdateProduct = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`/.netlify/functions/product-update?id=${editingProduct._id}`, productForm)
            setProductForm({ name: '', price: '', image: '' })
            setShowProductForm(false)
            setEditingProduct(null)
            fetchProducts()
            alert('Product updated successfully!')
        } catch (error) {
            console.error('Error updating product:', error)
            alert('Failed to update product')
        }
    }

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            await axios.delete(`/.netlify/functions/product-delete?id=${id}`)
            fetchProducts()
            alert('Product deleted successfully!')
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Failed to delete product')
        }
    }

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await axios.post('/.netlify/functions/update-order', { orderId, status })
            fetchOrders()
            alert(`Order ${status} successfully!`)
        } catch (error) {
            console.error('Error updating order:', error)
            alert('Failed to update order')
        }
    }

    const cancelForm = () => {
        setShowProductForm(false)
        setEditingProduct(null)
        setProductForm({ name: '', price: '', image: '' })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`py-2 px-6 rounded-md font-semibold ${activeTab === 'products'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`py-2 px-6 rounded-md font-semibold ${activeTab === 'orders'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Orders
                    </button>
                </div>

                {activeTab === 'products' && (
                    <div>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
                            <button
                                onClick={() => setShowProductForm(true)}
                                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                            >
                                + Add Product
                            </button>
                        </div>

                        {showProductForm && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 className="text-xl font-semibold mb-4">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={productForm.name}
                                            onChange={handleProductFormChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Price (₹)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={productForm.price}
                                            onChange={handleProductFormChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Image URL</label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={productForm.image}
                                            onChange={handleProductFormChange}
                                            required
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                                        >
                                            {editingProduct ? 'Update' : 'Add'} Product
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelForm}
                                            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">₹{product.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="text-blue-600 hover:text-blue-800 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h2>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Customer Name</p>
                                            <p className="font-semibold">{order.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-semibold">{order.phone}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-semibold">{order.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="font-semibold text-lg">₹{order.total}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <p className={`font-semibold ${order.status === 'accepted' ? 'text-green-600' :
                                                    order.status === 'rejected' ? 'text-red-600' :
                                                        'text-yellow-600'
                                                }`}>
                                                {order.status.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-2">Items:</p>
                                        <div className="space-y-2">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span>{item.name} x {item.quantity}</span>
                                                    <span>₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {order.status === 'pending' && (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order._id, 'accepted')}
                                                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order._id, 'rejected')}
                                                className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                                    No orders yet
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
