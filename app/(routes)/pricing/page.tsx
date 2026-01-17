import { PricingTable } from '@clerk/nextjs'
import React from 'react'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black">
      <div className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-semibold mb-6 tracking-[-0.03em] text-white">
              Simple, Transparent Pricing
            </h1>
            <p className="text-[18px] text-white/60 max-w-[640px] mx-auto">
              Choose the perfect plan for your learning journey
            </p>
          </div>
          <PricingTable />
        </div>
      </div>
    </div>
  )
}
