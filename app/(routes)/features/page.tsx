import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Video, BookOpen, Clock, Zap, Target, Brain, BarChart } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[800px] mx-auto text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[13px] font-medium text-primary">Powered by AI</span>
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-[72px] font-semibold mb-8 leading-[1.1] tracking-tight">
              Everything You Need{' '}
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                to Learn Faster
              </span>
            </h1>
            <p className="text-[18px] text-white/60 leading-relaxed">
              Powerful features designed to accelerate your learning journey and help you master any topic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            <div className="group bg-white/3 border border-white/6 rounded-2xl p-10 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-[28px] font-semibold text-white mb-4">AI-Powered Generation</h3>
              <p className="text-[16px] text-white/60 leading-relaxed mb-6">
                Our advanced AI analyzes your topic and creates structured, comprehensive courses with chapters, lessons, and key concepts—all tailored to your learning goals.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Intelligent content structuring</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Adaptive learning paths</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Contextual explanations</span>
                </li>
              </ul>
            </div>

            <div className="group bg-white/3 border border-white/6 rounded-2xl p-10 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Video className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-[28px] font-semibold text-white mb-4">Video Content</h3>
              <p className="text-[16px] text-white/60 leading-relaxed mb-6">
                Every course includes high-quality video content for each chapter. Visual learning helps concepts stick and makes complex topics easier to understand.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Professional video lessons</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Visual demonstrations</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Playback controls</span>
                </li>
              </ul>
            </div>

            <div className="group bg-white/3 border border-white/6 rounded-2xl p-10 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-[28px] font-semibold text-white mb-4">Structured Chapters</h3>
              <p className="text-[16px] text-white/60 leading-relaxed mb-6">
                Each course is organized into logical chapters with clear learning objectives. Progress through content at your own pace with a clear roadmap.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Logical progression</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Clear learning objectives</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Easy navigation</span>
                </li>
              </ul>
            </div>

            <div className="group bg-white/3 border border-white/6 rounded-2xl p-10 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-[28px] font-semibold text-white mb-4">Learn at Your Pace</h3>
              <p className="text-[16px] text-white/60 leading-relaxed mb-6">
                No deadlines, no pressure. Access your courses anytime, anywhere. Pause, rewind, and revisit content as many times as you need.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Lifetime access</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Self-paced learning</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Mobile friendly</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-[36px] font-semibold text-white mb-10 text-center">Additional Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/3 border border-white/6 rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <Zap className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-[20px] font-semibold text-white mb-3">Instant Generation</h3>
                <p className="text-[15px] text-white/60">
                  Get your complete course in minutes, not weeks.
                </p>
              </div>

              <div className="bg-white/3 border border-white/6 rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <Target className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-[20px] font-semibold text-white mb-3">Topic Flexibility</h3>
                <p className="text-[15px] text-white/60">
                  Learn anything from coding to cooking, art to algorithms.
                </p>
              </div>

              <div className="bg-white/3 border border-white/6 rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <BarChart className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-[20px] font-semibold text-white mb-3">Track Progress</h3>
                <p className="text-[15px] text-white/60">
                  Monitor your learning journey and celebrate milestones.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-12 text-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <h2 className="text-[36px] font-semibold text-white mb-4">Ready to Experience These Features?</h2>
            <p className="text-[18px] text-white/60 mb-8 max-w-[600px] mx-auto">
              Start creating personalized courses today and see the difference AI-powered learning makes.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white text-[15px] font-medium px-8 py-6 h-auto rounded-xl transition-all duration-200 hover:-translate-y-0.5">
                Create Your First Course
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
