import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            const response = await axios.get('/.netlify/functions/products')
            const foundProduct = response.data.find(p => p._id === id)
            setProduct(foundProduct)

            if (foundProduct?.sizes?.length > 0) {
                setSelectedSize(foundProduct.sizes[0])
            }
            if (foundProduct?.colors?.length > 0) {
                setSelectedColor(foundProduct.colors[0])
            }
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!product) return

        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const cartItem = {
            ...product,
            quantity,
            selectedSize,
            selectedColor
        }

        const existingIndex = cart.findIndex(
            item => item._id === product._id &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
        )

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += quantity
        } else {
            cart.push(cartItem)
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('cartUpdated'))
        alert('Product added to cart!')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <p className="text-gray-600 mb-4">Product not found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                        {/* Product Image */}
                        <div>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <p className="text-3xl font-bold text-blue-600 mb-6">
                                ₹{product.price}
                            </p>

                            {product.description && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Size</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-6 py-2 border-2 rounded-md font-medium transition-colors ${selectedSize === size
                                                        ? 'border-blue-600 bg-blue-600 text-white'
                                                        : 'border-gray-300 text-gray-700 hover:border-blue-400'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Color</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-6 py-2 border-2 rounded-md font-medium transition-colors ${selectedColor === color
                                                        ? 'border-blue-600 bg-blue-600 text-white'
                                                        : 'border-gray-300 text-gray-700 hover:border-blue-400'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity</h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Stock Info */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-600">
                                    {product.stock > 0 ? (
                                        <span className="text-green-600 font-medium">✓ In Stock ({product.stock} available)</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">✗ Out of Stock</span>
                                    )}
                                </p>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
                            >
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>

                            {/* Payment Info */}
                            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800 font-medium">
                                    💵 Cash on Delivery Available
                                </p>
                                <p className="text-sm text-green-700 mt-1">
                                    Pay when you receive the product
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
