function ProductCard({ product, onAddToCart }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                </h3>
                <p className="text-xl font-bold text-gray-900 mb-4">
                    ₹{product.price}
                </p>
                <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard
