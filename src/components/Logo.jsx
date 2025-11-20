import { motion } from 'framer-motion'

const Logo = ({ className = "", size = "default" }) => {
  const sizes = {
    small: { iconSize: 40, fontSize: "text-xl" },
    default: { iconSize: 50, fontSize: "text-2xl" },
    large: { iconSize: 60, fontSize: "text-3xl" }
  }

  const currentSize = sizes[size] || sizes.default

  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      {/* Globe Icon */}
      <svg 
        width={currentSize.iconSize} 
        height={currentSize.iconSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle - globe */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#globeGradient)"
        />
        
        {/* Continents - simplified shapes */}
        <path
          d="M 30 25 Q 35 20, 40 25 L 45 30 Q 50 28, 55 32 L 60 28 Q 65 30, 62 35 L 58 40 Q 55 45, 50 42 L 45 45 Q 40 48, 38 43 L 35 38 Q 32 35, 30 30 Z"
          fill="rgba(255,255,255,0.3)"
        />
        
        <path
          d="M 25 50 Q 28 45, 32 48 L 35 52 Q 38 55, 35 58 L 32 62 Q 28 65, 25 62 Z"
          fill="rgba(255,255,255,0.3)"
        />
        
        <path
          d="M 55 55 Q 60 52, 65 55 L 70 60 Q 72 65, 68 68 L 62 70 Q 58 72, 55 68 L 52 63 Q 50 58, 55 55 Z"
          fill="rgba(255,255,255,0.3)"
        />

        {/* Latitude lines */}
        <ellipse cx="50" cy="50" rx="45" ry="15" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
        <ellipse cx="50" cy="50" rx="45" ry="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
        
        {/* Longitude lines */}
        <ellipse cx="50" cy="50" rx="15" ry="45" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
        <ellipse cx="50" cy="50" rx="30" ry="45" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
        
        {/* Vertical center line */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {/* Gradients */}
        <defs>
          <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text */}
      <span className={`font-bold text-gray-900 ${currentSize.fontSize}`}>
        onepacifichub
      </span>
    </motion.div>
  )
}

export default Logo
