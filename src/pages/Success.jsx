import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Success() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="mb-6">
                        <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Order Placed Successfully!
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Thank you for your order. We will call you soon to confirm your delivery details.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <p className="text-blue-800">
                            <strong>Payment Method:</strong> Cash on Delivery (COD)
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 font-semibold"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Success
