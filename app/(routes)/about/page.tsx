import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Target, Users, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[800px] mx-auto text-center mb-20 animate-fade-in">
            <h1 className="text-6xl sm:text-7xl lg:text-[72px] font-semibold mb-8 leading-[1.1] tracking-tight">
              Learning,{' '}
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-[18px] text-white/60 leading-relaxed">
              We're building the future of personalized education with AI-powered course generation that adapts to your learning style and pace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            <div className="group bg-white/3 border border-white/6 rounded-2xl p-10 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-[24px] font-semibold text-white mb-4">Our Mission</h3>
              <p className="text-[16px] text-white/60 leading-relaxed">
                To democratize education by making high-quality, personalized learning accessible to everyone, anywhere, anytime.
              </p>
            </div>

            <div className="group bg-white/3 border border-white/6 rounded-2xl p-10 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-[24px] font-semibold text-white mb-4">Our Vision</h3>
              <p className="text-[16px] text-white/60 leading-relaxed">
                A world where learning is effortless, engaging, and tailored to each individual's unique needs and goals.
              </p>
            </div>
          </div>

          <div className="bg-white/3 border border-white/6 rounded-2xl p-12 mb-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-[36px] font-semibold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-[16px] text-white/60 leading-relaxed">
              <p>
                CourseCraft AI was born from a simple observation: traditional learning materials often fail to meet individual needs. Some learners need more depth, others need a faster pace, and everyone has unique goals.
              </p>
              <p>
                We combined cutting-edge AI technology with educational expertise to create a platform that generates custom courses on any topic. Each course is structured, comprehensive, and includes video content—all tailored to help you achieve your learning objectives.
              </p>
              <p>
                Today, thousands of learners use CourseCraft AI to master new skills, explore passions, and advance their careers. We're just getting started.
              </p>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-[36px] font-semibold text-white mb-10 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/3 border border-white/6 rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[20px] font-semibold text-white mb-3">Innovation</h3>
                <p className="text-[15px] text-white/60">
                  We push boundaries to create learning experiences that were impossible before.
                </p>
              </div>

              <div className="bg-white/3 border border-white/6 rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[20px] font-semibold text-white mb-3">Accessibility</h3>
                <p className="text-[15px] text-white/60">
                  Quality education should be available to everyone, regardless of background.
                </p>
              </div>

              <div className="bg-white/3 border border-white/6 rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[20px] font-semibold text-white mb-3">Excellence</h3>
                <p className="text-[15px] text-white/60">
                  We're committed to delivering the highest quality content and experience.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-[36px] font-semibold text-white mb-6">Ready to Start Learning?</h2>
            <p className="text-[18px] text-white/60 mb-8 max-w-[600px] mx-auto">
              Join thousands of learners transforming their skills with AI-powered courses.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white text-[15px] font-medium px-8 py-6 h-auto rounded-xl transition-all duration-200 hover:-translate-y-0.5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
