import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function Cart() {
    const [cart, setCart] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
        setCart(cartData)
    }, [])

    const handleRemoveItem = (productId) => {
        const updatedCart = cart.filter(item => item._id !== productId)
        setCart(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        window.dispatchEvent(new Event('cartUpdated'))
    }

    const handleQuantityChange = (productId, change) => {
        const updatedCart = cart.map(item => {
            if (item._id === productId) {
                const newQuantity = item.quantity + change
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
            }
            return item
        })
        setCart(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        window.dispatchEvent(new Event('cartUpdated'))
    }

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault()

        if (cart.length === 0) {
            alert('Your cart is empty!')
            return
        }

        if (!formData.name || !formData.phone || !formData.address) {
            alert('Please fill all fields!')
            return
        }

        setLoading(true)

        try {
            const orderData = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                items: cart,
                total: calculateTotal()
            }

            await axios.post('/.netlify/functions/place-order', orderData)

            localStorage.removeItem('cart')
            window.dispatchEvent(new Event('cartUpdated'))
            navigate('/success')
        } catch (error) {
            console.error('Error placing order:', error)
            alert('Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 mb-4">Your cart is empty</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                            {cart.map((item) => (
                                <div key={item._id} className="bg-white rounded-lg shadow-md p-4">
                                    <div className="flex gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600">₹{item.price}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, -1)}
                                                    className="bg-gray-200 px-2 py-1 rounded"
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, 1)}
                                                    className="bg-gray-200 px-2 py-1 rounded"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    className="ml-auto text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total:</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
                            <form onSubmit={handlePlaceOrder} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 font-semibold"
                                >
                                    {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart
