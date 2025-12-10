import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'

function Home() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts(products)
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredProducts(filtered)
        }
    }, [searchQuery, products])

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/.netlify/functions/products')
            setProducts(response.data)
            setFilteredProducts(response.data)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const existingItem = cart.find(item => item._id === product._id)

        if (existingItem) {
            existingItem.quantity += 1
        } else {
            cart.push({ ...product, quantity: 1 })
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('cartUpdated'))
        alert('Product added to cart!')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Shop Our Products
                    </h1>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
