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

  // Define popular car makes
  const carMakes = [
    { name: 'Cadillac' },
    { name: 'Chevrolet' },
    { name: 'Chrysler' },
    { name: 'Dodge' },
    { name: 'Ford' },
    { name: 'GMC' },
    { name: 'Honda' },
    { name: 'Jeep' },
    { name: 'Mazda' },
    { name: 'Nissan' },
    { name: 'Ram' },
    { name: 'Toyota' }
  ]

  // Filter makes that have products
  const availableMakes = useMemo(() => {
    return carMakes.filter(make => 
      categoryProducts.some(product => 
        product.name.includes(make.name) || product.description.includes(make.name)
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

        {/* Make Filter Section */}
        {availableMakes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Shop by Make</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {availableMakes.map((make, index) => (
                <motion.button
                  key={make.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBrand(selectedBrand === make.name ? '' : make.name)}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                    selectedBrand === make.name
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                  }`}
                >
                  {make.name}
                </motion.button>
              ))}
            </div>
            {selectedBrand && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setSelectedBrand('')}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline"
                >
                  Clear make filter
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
                  Make: {selectedBrand}
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
