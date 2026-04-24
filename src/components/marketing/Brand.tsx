import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../kit/Logo'
import { motion } from 'framer-motion' 
import { item } from './animations/navbar.animation'
const Brand = ({className, size = "sm"}: {className?: string, size?: "sm" | "md" | "lg"}) => {
  return (
     <motion.div
            variants={item}
            initial="closed"
            animate="open"
            className={className}
          >
            <Link to={window.location.origin} className="flex items-center gap-2 flex-shrink-0">
              <Logo size={size}/>
            </Link>
          </motion.div>
  )
}

export default Brand