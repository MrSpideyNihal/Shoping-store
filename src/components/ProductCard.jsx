import { Link } from 'react-router-dom'

function ProductCard({ product, onAddToCart }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/product/${product._id}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
            </Link>
            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-xl font-bold text-gray-900 mb-4">
                    ₹{product.price}
                </p>
                <div className="flex gap-2">
                    <Link
                        to={`/product/${product._id}`}
                        className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-center"
                    >
                        View Details
                    </Link>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
