import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Search, Filter } from 'lucide-react'
import { products, categories } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useState, useMemo } from 'react'

const ProductsPage = () => {
  const { category } = useParams()
  
  // Find the category info
  const categoryInfo = categories.find(cat => cat.slug === category)
  
  // Get products for this category
  const categoryProducts = products[categoryInfo?.id] || []

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Define popular car brands with logos
  const carBrands = [
    { name: 'Cadillac', logo: '🚗', color: 'from-gray-700 to-gray-900' },
    { name: 'Chevrolet', logo: '⚡', color: 'from-yellow-500 to-orange-500' },
    { name: 'Chrysler', logo: '🔷', color: 'from-blue-600 to-blue-800' },
    { name: 'Dodge', logo: '🐏', color: 'from-red-600 to-red-800' },
    { name: 'Ford', logo: '🔵', color: 'from-blue-500 to-blue-700' },
    { name: 'GMC', logo: '🔴', color: 'from-red-500 to-red-700' },
    { name: 'Honda', logo: '🅷', color: 'from-gray-600 to-gray-800' },
    { name: 'Jeep', logo: '🚙', color: 'from-green-600 to-green-800' },
    { name: 'Mazda', logo: '🔘', color: 'from-gray-500 to-gray-700' },
    { name: 'Nissan', logo: '⭕', color: 'from-gray-700 to-black' },
    { name: 'Ram', logo: '🐏', color: 'from-gray-600 to-gray-900' },
    { name: 'Toyota', logo: '🔴', color: 'from-red-500 to-red-600' }
  ]

  // Filter brands that have products
  const availableBrands = useMemo(() => {
    return carBrands.filter(brand => 
      categoryProducts.some(product => 
        product.name.includes(brand.name) || product.description.includes(brand.name)
      )
    )
  }, [categoryProducts])

  // Extract unique years, makes, models from product names/descriptions
  const years = useMemo(() => {
    const yearSet = new Set()
    categoryProducts.forEach(product => {
      const yearMatches = product.name.match(/\b(19|20)\d{2}\b/g)
      if (yearMatches) {
        yearMatches.forEach(year => yearSet.add(year))
      }
    })
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [categoryProducts])

  const makes = useMemo(() => {
    const makeSet = new Set()
    const commonMakes = ['Ford', 'Chevrolet', 'Toyota', 'Honda', 'GMC', 'Dodge', 'Nissan', 'Mazda', 'Cadillac', 'Jeep', 'Ram']
    categoryProducts.forEach(product => {
      commonMakes.forEach(make => {
        if (product.name.includes(make) || product.description.includes(make)) {
          makeSet.add(make)
        }
      })
    })
    return Array.from(makeSet).sort()
  }, [categoryProducts])

  const models = useMemo(() => {
    const modelSet = new Set()
    const commonModels = ['F-150', 'Silverado', 'Sierra', 'Camry', 'Corolla', 'Accord', 'Civic', 'Tundra', 'Cruze', 'Challenger', 'Charger', 'Prius', 'SRX', 'XT5', 'Colorado', 'Equinox']
    categoryProducts.forEach(product => {
      commonModels.forEach(model => {
        if (product.name.includes(model) || product.description.includes(model)) {
          modelSet.add(model)
        }
      })
    })
    return Array.from(modelSet).sort()
  }, [categoryProducts])

  // Filter products
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(product => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.id.toLowerCase().includes(searchLower)
      
      const matchesBrand = selectedBrand === '' || 
        product.name.includes(selectedBrand) || 
        product.description.includes(selectedBrand)
      
      const matchesYear = selectedYear === '' || 
        product.name.includes(selectedYear) || 
        product.description.includes(selectedYear)
      
      const matchesMake = selectedMake === '' || 
        product.name.includes(selectedMake) || 
        product.description.includes(selectedMake)
      
      const matchesModel = selectedModel === '' || 
        product.name.includes(selectedModel) || 
        product.description.includes(selectedModel)
      
      return matchesSearch && matchesBrand && matchesYear && matchesMake && matchesModel
    })
  }, [categoryProducts, searchQuery, selectedBrand, selectedYear, selectedMake, selectedModel])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedBrand('')
    setSelectedYear('')
    setSelectedMake('')
    setSelectedModel('')
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </motion.div>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {categoryInfo.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {categoryInfo.description}
          </p>
        </motion.div>

        {/* Brand Filter Section */}
        {availableBrands.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Shop by Brand</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableBrands.map((brand, index) => (
                <motion.button
                  key={brand.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBrand(selectedBrand === brand.name ? '' : brand.name)}
                  className={`relative p-6 rounded-2xl shadow-lg transition-all ${
                    selectedBrand === brand.name
                      ? `bg-gradient-to-br ${brand.color} text-white ring-4 ring-blue-400`
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{brand.logo}</div>
                    <p className={`font-bold text-sm ${
                      selectedBrand === brand.name ? 'text-white' : 'text-gray-900'
                    }`}>
                      {brand.name}
                    </p>
                  </div>
                  {selectedBrand === brand.name && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            {selectedBrand && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setSelectedBrand('')}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline"
                >
                  Clear brand filter
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 bg-white rounded-2xl shadow-lg p-6"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by part number, product name, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors"
          >
            <Filter size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filter Dropdowns */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid md:grid-cols-3 gap-4"
            >
              {/* Year Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Make Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Make</label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">All Makes</option>
                  {makes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              {/* Model Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">All Models</option>
                  {models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Active Filters & Results Count */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-600 font-semibold">
                {filteredProducts.length} of {categoryProducts.length} products
              </span>
              {(searchQuery || selectedBrand || selectedYear || selectedMake || selectedModel) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
            
            {/* Active Filter Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {selectedBrand && (
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium">
                  Brand: {selectedBrand}
                </span>
              )}
              {selectedYear && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Year: {selectedYear}
                </span>
              )}
              {selectedMake && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Make: {selectedMake}
                </span>
              )}
              {selectedModel && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Model: {selectedModel}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-600 text-lg mb-4">No products match your search criteria.</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Clear filters to see all products
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
