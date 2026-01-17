"use client"
import { Button } from '@/components/ui/button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/6 bg-black/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5">
        <Link href="/" className="group">
          <span className="text-[19px] font-semibold tracking-tight text-white">
            CourseCraft AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link 
            href="/" 
            className="text-[15px] font-medium text-white/80 hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            href="/features" 
            className="text-[15px] font-medium text-white/80 hover:text-white transition-colors duration-200"
          >
            Features
          </Link>
          <Link 
            href="/about" 
            className="text-[15px] font-medium text-white/80 hover:text-white transition-colors duration-200"
          >
            About
          </Link>
          <Link 
            href="/pricing" 
            className="text-[15px] font-medium text-white/80 hover:text-white transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link 
            href="/contact" 
            className="text-[15px] font-medium text-white/80 hover:text-white transition-colors duration-200"
          >
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 rounded-full ring-1 ring-white/10"
                }
              }}
            />
          ) : (
            <SignInButton mode="modal">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white text-[15px] font-medium px-5 py-2.5 h-auto rounded-xl transition-all duration-200 hover-lift"
                size="sm"
              >
                Get Started
              </Button>
            </SignInButton>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/6 bg-black/95 backdrop-blur-xl animate-slide-up">
          <div className="px-6 py-6 space-y-4">
            <Link
              href="/"
              className="block py-2.5 text-[17px] font-medium text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/features"
              className="block py-2.5 text-[17px] font-medium text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/about"
              className="block py-2.5 text-[17px] font-medium text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="block py-2.5 text-[17px] font-medium text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="block py-2.5 text-[17px] font-medium text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-white/6">
              {user ? (
                <div className="flex items-center gap-3">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-full ring-1 ring-white/10"
                      }
                    }}
                  />
                  <span className="text-[15px] text-white/60">Account</span>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white text-[15px] font-medium px-5 py-3 h-auto rounded-xl" size="sm">
                    Get Started
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header