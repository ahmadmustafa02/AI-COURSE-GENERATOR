"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[800px] mx-auto text-center mb-20 animate-fade-in">
            <h1 className="text-6xl sm:text-7xl lg:text-[72px] font-semibold mb-8 leading-[1.1] tracking-tight">
              Get in{' '}
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-[18px] text-white/60 leading-relaxed">
              Have questions, feedback, or need support? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            <div className="lg:col-span-2">
              <div className="bg-white/3 border border-white/6 rounded-2xl p-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-[24px] font-semibold text-white mb-3">Message Sent!</h3>
                    <p className="text-[16px] text-white/60">
                      Thank you for reaching out. We'll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-[15px] font-medium text-white/80 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-[15px] font-medium text-white/80 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-[15px] font-medium text-white/80 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-[15px] font-medium text-white/80 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                        placeholder="Tell us more..."
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white text-[15px] font-medium px-6 py-6 h-auto rounded-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/3 border border-white/6 rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-[20px] font-semibold text-white mb-2">Email Us</h3>
                <p className="text-[15px] text-white/60 mb-3">
                  For general inquiries and support
                </p>
                <a href="mailto:support@coursecraft.ai" className="text-[15px] text-primary hover:text-primary/80 transition-colors">
                  support@coursecraft.ai
                </a>
              </div>

              <div className="bg-white/3 border border-white/6 rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-[20px] font-semibold text-white mb-2">Feedback</h3>
                <p className="text-[15px] text-white/60 mb-3">
                  We value your thoughts and suggestions
                </p>
                <a href="mailto:feedback@coursecraft.ai" className="text-[15px] text-primary hover:text-primary/80 transition-colors">
                  feedback@coursecraft.ai
                </a>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-[18px] font-semibold text-white mb-3">Quick Response</h3>
                <p className="text-[14px] text-white/60">
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
