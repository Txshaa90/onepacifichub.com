import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <motion.ol
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center flex-wrap gap-2 text-sm"
      >
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-400" />
            {item.href ? (
              <Link
                to={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </motion.ol>
    </nav>
  )
}

export default Breadcrumb
