import { motion } from 'framer-motion'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star, Check, Minus, Plus, Package, Palette, Building2, Wrench } from 'lucide-react'
import { products, categories } from '../data/products'
import { useCart } from '../context/CartContext'
import { useState, useMemo } from 'react'

const ProductDetailPage = () => {
  const { category, productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Find the category info
  const categoryInfo = categories.find(cat => cat.slug === category)
  
  // Get all products for this category
  const categoryProducts = products[categoryInfo?.id] || []
  
  // Find the specific product
  const product = categoryProducts.find(p => p.id === productId)

  // Generate multiple images (in real scenario, these would come from product data)
  const productImages = useMemo(() => {
    if (!product) return []
    return [
      product.image,
      product.image, // In real app, these would be different angles
      product.image,
      product.image
    ]
  }, [product])

  // Extract product specifications from name and description
  const specifications = useMemo(() => {
    if (!product) return {}
    
    const specs = {
      dimensions: '',
      color: '',
      brand: '',
      installationType: 'Easy Installation'
    }

    // Extract dimensions (e.g., "15 inch", "16\"", etc.)
    const sizeMatch = product.name.match(/(\d+)\s*(inch|"|in)/i)
    if (sizeMatch) {
      specs.dimensions = `${sizeMatch[1]} inches`
    }

    // Extract color
    const colorKeywords = ['Chrome', 'Silver', 'Black', 'Matte', 'Polished', 'Gloss']
    colorKeywords.forEach(color => {
      if (product.name.includes(color) || product.description.includes(color)) {
        specs.color = color
      }
    })

    // Extract brand
    const brandKeywords = ['Fuel Rider', 'Premium', 'Universal', 'OEM']
    brandKeywords.forEach(brand => {
      if (product.name.includes(brand) || product.description.includes(brand)) {
        specs.brand = brand
      }
    })
    if (!specs.brand) specs.brand = 'OnePacificHub'

    // Installation type
    if (product.name.includes('Snap-On') || product.description.includes('snap')) {
      specs.installationType = 'Snap-On Installation'
    } else if (product.name.includes('Push-On') || product.description.includes('push')) {
      specs.installationType = 'Push-On Installation'
    }

    return specs
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link to={`/products/${category}`} className="text-blue-600 hover:underline">
            Back to {categoryInfo?.name}
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to={`/products/${category}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to {categoryInfo?.name}
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-white rounded-xl p-2 shadow-md transition-all ${
                    selectedImageIndex === index
                      ? 'ring-4 ring-blue-500'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Product Name */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500">Part #: {product.id}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
              <p className="text-sm text-gray-600 mb-1">Price</p>
              <p className="text-4xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Product Specifications */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {specifications.dimensions && (
                  <div className="flex items-start gap-3">
                    <Package className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Dimensions</p>
                      <p className="font-semibold text-gray-900">{specifications.dimensions}</p>
                    </div>
                  </div>
                )}
                {specifications.color && (
                  <div className="flex items-start gap-3">
                    <Palette className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p className="font-semibold text-gray-900">{specifications.color}</p>
                    </div>
                  </div>
                )}
                {specifications.brand && (
                  <div className="flex items-start gap-3">
                    <Building2 className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Brand</p>
                      <p className="font-semibold text-gray-900">{specifications.brand}</p>
                    </div>
                  </div>
                )}
                {specifications.installationType && (
                  <div className="flex items-start gap-3">
                    <Wrench className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Installation Type</p>
                      <p className="font-semibold text-gray-900">{specifications.installationType}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About this item */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this item</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{product.description}</span>
                </li>
                {product.features && product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Quantity</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={24} />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={24} />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </>
              )}
            </motion.button>

            {/* View Cart Link */}
            {addedToCart && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Link
                  to="/cart"
                  className="text-blue-600 hover:text-blue-700 font-semibold underline"
                >
                  View Cart & Checkout
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
