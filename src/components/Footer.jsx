import { motion } from 'framer-motion'
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const Footer = () => {
  const footerLinks = {
    menu: [
      { name: 'Hub caps', href: '/products/hubcaps' },
      { name: 'Wheelskins', href: '/products/wheelskins' },
      { name: 'Wheel Simulator', href: '/products/wheel-simulator' },
      { name: 'Trim Rings', href: '/products/trim-rings' },
    ],
    customerService: [
      { name: 'Help Centre', href: '#' },
      { name: 'Payment', href: '#' },
      { name: 'Delivery', href: '#' },
      { name: 'Returns and Refunds', href: '#' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Logo size="small" />
            <p className="text-gray-400 mb-6">
              Your trusted partner for adventure gear and auto upgrades.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-white font-bold mb-4">Menu</h4>
            <ul className="space-y-2">
              {footerLinks.menu.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>
                    <motion.div
                      className="hover:text-blue-400 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-white font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {footerLinks.customerService.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="hover:text-blue-400 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <div className="space-y-3">
              <motion.a
                href="mailto:info@onepacifichub.com"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                whileHover={{ x: 5 }}
              >
                <Mail size={18} />
                info@onepacifichub.com
              </motion.a>
              <motion.a
                href="tel:+12132688273"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                whileHover={{ x: 5 }}
              >
                <Phone size={18} />
                +1 (213) 268 8273
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500"
        >
          <p>© 2024 onepacifichub. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
