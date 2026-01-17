"use client"

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import Link from 'next/link'
import { Course } from '@/type/CourseType'
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const CourseList = () => {
  const { user, isLoaded } = useUser()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchCourses()
    } else if (isLoaded && !user) {
      setLoading(false)
    }
  }, [isLoaded, user])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const result = await axios.get('/api/courses')
      setCourses(result.data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return null
  }

  if (!user) {
    return (
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-white/5 border border-white/10 mb-8">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-[-0.03em]">Your Learning Journey Starts Here</h2>
          <p className="text-[18px] text-white/60 max-w-[640px] mx-auto">
            Sign in to view and manage your courses. Create your first AI-powered course in seconds.
          </p>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse bg-white/3 border-white/6">
                <CardHeader>
                  <div className="h-6 bg-white/5 rounded-xl w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/5 rounded-xl w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-white/5 rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (courses.length === 0) {
    return (
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-white/5 border border-white/10 mb-8">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-[-0.03em]">No Courses Yet</h2>
          <p className="text-[18px] text-white/60 max-w-[640px] mx-auto">
            Create your first AI-powered course by entering a topic above. Transform any subject into a complete learning experience.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-semibold mb-4 tracking-[-0.03em]">Your Courses</h2>
          <p className="text-[17px] text-white/60">Continue learning from where you left off</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.courseId} href={`/course/${course.courseId}`}>
              <Card className="group hover-lift transition-all duration-200 border-white/6 bg-white/3 backdrop-blur-xl hover:bg-white/5 hover:border-white/10">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-[20px] font-semibold mb-3 line-clamp-2 text-white tracking-tight">
                        {course.courseName}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-[15px] text-white/60 leading-relaxed">
                        {course.courseLayout?.courseDescription || course.userInput}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center gap-4 text-[14px] text-white/50">
                    {course.courseLayout?.level && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span>{course.courseLayout.level}</span>
                      </div>
                    )}
                    {course.courseLayout?.totalChapters && (
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{course.courseLayout.totalChapters} Chapters</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-4 border-t border-white/6">
                  <div className="text-[13px] text-white/40">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-[14px] font-medium text-white/70 group-hover:text-primary transition-colors">
                    Continue
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CourseList