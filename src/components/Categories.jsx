import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Car, Disc, Settings, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Categories = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const categories = [
    {
      icon: Car,
      title: 'Hub Caps',
      description: 'Premium hub caps to transform your vehicle\'s appearance with style and protection.',
      color: 'from-blue-500 to-blue-600',
      delay: 0.2,
      link: '/products/hubcaps'
    },
    {
      icon: Disc,
      title: 'Wheel Skins',
      description: 'Comfortable and stylish steering wheel covers for enhanced grip and comfort.',
      color: 'from-cyan-500 to-cyan-600',
      delay: 0.4,
      link: '/products/wheelskins'
    },
    {
      icon: Settings,
      title: 'Wheel Simulators',
      description: 'Convert steel wheels to chrome beauty with our premium wheel simulators.',
      color: 'from-purple-500 to-purple-600',
      delay: 0.6,
      link: '/products/wheel-simulator'
    },
    {
      icon: Circle,
      title: 'Trim Rings',
      description: 'Add the perfect finishing touch to your wheels with our trim rings.',
      color: 'from-teal-500 to-teal-600',
      delay: 0.8,
      link: '/products/trim-rings'
    }
  ]

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Explore Our Categories
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need for your next adventure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link key={category.title} to={category.link}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: category.delay }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow group cursor-pointer h-full"
              >
                <motion.div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <category.icon className="text-white" size={32} />
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {category.description}
                </p>

                <motion.div
                  className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                  whileHover={{ x: 5 }}
                >
                  View Products
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
