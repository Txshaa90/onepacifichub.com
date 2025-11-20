import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      title: 'DIY Auto Upgrades',
      description: 'Explore our premium DIY auto upgrades to enhance your vehicle for every journey ahead.',
      image: '/images/Explore our premium DIY auto upgrades to enhance your vehicle for every journey ahead..jpeg',
      link: '/auto-upgrades'
    },
    {
      title: 'Fishing Gear',
      description: 'Discover top-quality fishing gear designed to help you catch more on your next trip.',
      image: '/images/Discover top-quality fishing gear designed to help you catch more on your next trip..jpg',
      link: '/products/wheelskins'
    },
    {
      title: 'Travel Essentials',
      description: 'Find essential travel gear for road trips, camping, and outdoor adventures to pack smart.',
      image: '/images/Find essential travel gear for road trips, camping, and outdoor adventures to pack smart..jpg',
      link: '/products/trim-rings'
    }
  ]

  return (
    <section id="about-section" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Adventure Awaits You
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            At onepacifichub, we provide top-quality DIY auto restyling, wheel skins, 
            and essential wheel accessories to enhance your vehicle's appearance.
          </motion.p>
        </motion.div>

        {/* Three Image Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link key={feature.title} to={feature.link}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-2xl font-bold">{feature.title}</h3>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed group-hover:text-blue-600 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
