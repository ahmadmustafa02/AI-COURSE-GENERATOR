"use client";

import React, { useEffect, useState } from 'react'
import CourseInfoCard from './_components/CourseInfoCard'
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Course } from '@/type/CourseType';
import CourseChapters from './_components/CourseChapters';
import { toast } from 'sonner';
import {getAudioData} from '@remotion/media-utils'


const CoursePreview = () => {

const {courseid} = useParams();
const [courseDetail, setCourseDetail] = useState<Course>();

useEffect(() => {
    courseid && GetCourseDetail();
}, [courseid]);

const GetCourseDetail = async () => {
  const loadingToast = toast.loading("Fetching Course Details...");
  try {
    const result = await axios.get('/api/course?courseId=' + courseid);
    console.log('Course Detail:', result.data);
    console.log('Chapter Content Slides:', result.data.chapterContentSlide);
    
    // Extract the actual course object - your API returns {course: {...}, chapterContentSlide: [...]}
    const courseData = result.data.course || result.data;
    const slides = result.data.chapterContentSlide || [];
    
    // Combine them for the state
    const fullCourseData = {
      ...courseData,
      chapterContentSlide: slides
    };
    
    console.log('Full course data:', fullCourseData);
    
    setCourseDetail(fullCourseData);
    toast.success("Course Details Fetched Successfully!", {id: loadingToast});
    
    // Check if chapterContentSlide is undefined, null, or empty array
    const hasNoSlides = !slides || slides.length === 0;
    
    console.log('Has no slides?', hasNoSlides);
    
    if (hasNoSlides) {
      console.log('Starting video content generation...');
      await GetVideoContent(fullCourseData);
    } else {
      console.log('Video content already exists, skipping generation');
    }
  } catch (error) {
    console.error('Error fetching course details:', error);
    toast.error("Failed to fetch course details", {id: loadingToast});
  }
}

const GetVideoContent = async (courseData: Course) => {
  console.log('GetVideoContent called with:', courseData);
  
  // Add null check before accessing
  if (!courseData?.courseLayout?.chapters) {
    console.error('No course layout or chapters found');
    toast.error("Course layout is not available");
    return;
  }
  
  console.log('Chapters found:', courseData.courseLayout.chapters);
  
  const mainToast = toast.loading("Generating Video Content Using AI...");
  
  try {
    // Process all chapters
    const chapters = courseData.courseLayout.chapters;
    
    for (let i = 0; i < chapters.length; i++) {
      const chapterToast = toast.loading(`Generating Video Content for chapter ${i + 1}/${chapters.length}...`);
      
      console.log(`Processing chapter ${i + 1}:`, chapters[i]);
      
      try {
        const payload = {
          courseId: courseData.courseId,
          chapter: chapters[i]
        };
        
        console.log('Sending request to /api/generate-video-content with:', payload);
        
        const result = await axios.post('/api/generate-video-content', payload);

        console.log('Video Content API Response for chapter', i + 1, ':', result.data);
        
        // Log response structure
        console.log('Response structure:', {
          success: result.data.success,
          savedSlides: result.data.savedSlides,
          message: result.data.message,
          dataType: Array.isArray(result.data.data) ? 'Array' : typeof result.data.data,
          slideCount: Array.isArray(result.data.data) ? result.data.data.length : 0
        });
        
        // Log individual slide details if data is an array
        if (Array.isArray(result.data.data)) {
          console.log(`✅ Successfully generated ${result.data.data.length} slides for chapter ${i + 1}`);
          
          result.data.data.forEach((slide: any, slideIndex: number) => {
            console.log(`📄 Slide ${slideIndex + 1} Details:`, {
              slideId: slide.slideId,
              slideIndex: slide.slideIndex,
              title: slide.title,
              subtitle: slide.subtitle,
              audioFileName: slide.audioFileName,
              narration: slide.narration?.fullText?.substring(0, 100) + '...',
              narrationLength: slide.narration?.fullText?.length || 0,
              hasHtml: !!slide.html,
              htmlLength: slide.html?.length || 0,
              revelData: slide.revelData,
              revelDataCount: slide.revelData?.length || 0
            });
          });
        } else {
          console.warn('⚠️ Response data is not an array:', result.data.data);
        }
        
        toast.success(`Video Content Generated for chapter ${i + 1} successfully! (${result.data.savedSlides || 0} slides)`, {id: chapterToast});
      } catch (error) {
        console.error(`❌ Error generating content for chapter ${i + 1}:`, error);
        if (axios.isAxiosError(error)) {
          console.error('Response data:', error.response?.data);
          console.error('Response status:', error.response?.status);
        }
        toast.error(`Failed to generate content for chapter ${i + 1}`, {id: chapterToast});
      }
    }
    
    toast.success("Video content generation completed!", {id: mainToast});
    
    // Optionally refetch course details to get the newly generated slides
    console.log('Refetching course details to load generated slides...');
    await GetCourseDetail();
    
  } catch (error) {
    console.error('Error in GetVideoContent:', error);
    toast.error("Failed to generate video content", {id: mainToast});
  }
};
    const fps= 30;
    const slides= courseDetail?.chapterContentSlide??[];
    const [durationsBySlideId, setDurationsBySlideId] = useState<Record<string, number> | null>(null);

    useEffect(() => {
        let cancelled = false;
        
        const run = async () => {
            if (!slides || slides.length === 0) {
                setDurationsBySlideId({});
                return;
            }
            
            const entries = await Promise.all(
                slides.map(async (slide) => {
                    try {
                        // Skip if audioFileName is null, empty, or not a valid URL
                        if (!slide?.audioFileName || slide.audioFileName.trim() === '') {
                            console.log(`Skipping slide ${slide.slideId}: no audio file`);
                            return [slide.slideId, fps * 6] as const; // Default 6 seconds
                        }
                        
                        const audioData = await getAudioData(slide.audioFileName);
                        const audioSec = audioData?.durationInSeconds;
                        const frames = Math.max(1, Math.ceil((audioSec || 6) * fps));
                        return [slide.slideId, frames] as const;
                    } catch (error) {
                        console.error(`Error getting audio data for slide ${slide.slideId}:`, error);
                        // Return default duration if audio fetch fails
                        return [slide.slideId, fps * 6] as const; // Default 6 seconds
                    }
                })
            );
            
            if (!cancelled) {
                setDurationsBySlideId(Object.fromEntries(entries));
            }
        };
        
        run();
        return () => {
            cancelled = true;
        };
    }, [slides, fps]);
   

  return (
    <div className='min-h-screen bg-black py-16 sm:py-24'>
      <div className='max-w-[1200px] mx-auto px-6'>
        <CourseInfoCard course={courseDetail} durationsBySlideId={durationsBySlideId} />
        <CourseChapters course={courseDetail} durationsBySlideId={durationsBySlideId} />
      </div>
    </div>
  )
}

export default CoursePreview