import React from 'react'
import Link from 'next/link'
import { Linkedin, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-white/6 bg-black/80 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-[19px] font-semibold tracking-tight text-white">
                CourseCraft AI
              </span>
            </Link>
            <p className="text-[14px] text-white/50 leading-relaxed">
              Transform any topic into a complete course with AI-powered learning.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-[15px] font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[15px] font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-[15px] font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/" className="text-[14px] text-white/60 hover:text-white transition-colors duration-200">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[14px] text-white/50">
              © 2026 CourseCraft AI. All rights reserved.
            </p>
            
            {/* Made by Credit */}
            <div className="flex items-center gap-2 text-[14px] text-white/50">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>by</span>
              <a 
                href="https://linkedin.com/in/ahmadmustafa01" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors duration-200 font-medium"
              >
                Ahmad Mustafa
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
