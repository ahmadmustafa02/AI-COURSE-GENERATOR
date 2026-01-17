import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/type/CourseType';
import { DotIcon, BookOpenIcon } from 'lucide-react';
import React, { useMemo } from 'react'
import { Player } from '@remotion/player';
import { CourseComposition } from './ChapterVideo';



type Props = {
  course: Course | undefined;
  durationsBySlideId: Record<string, number> | null;
}

const CourseChapters = ({course, durationsBySlideId}: Props) => {
 const slides= course?.chapterContentSlide??[];
  
  const transformSlides = (slidesToTransform: typeof slides) => {
    return slidesToTransform.map((slide) => ({
      slideId: slide.slideId,
      html: slide.html || '',
      audioFileUrl: slide.audioFileName || '',
      revelData: slide.revelData || [],
      caption: slide.captions ? {
        chunks: slide.captions.chunks || [],
        fullText: slide.captions.fullText
      } : undefined
    }));
  };
  
  const GetChapterDurationInFrame = (chapterId: string) => {
    if (!durationsBySlideId || !course) {
      return 30;
    }
    const chapterSlides = course.chapterContentSlide.filter(slide => slide.chapterId === chapterId);
    if (chapterSlides.length === 0) {
      return 30; // Default minimum duration
    }
    const totalDuration = chapterSlides.reduce((sum, slide) => sum + (durationsBySlideId[slide.slideId] ?? 30), 0);
    return Math.max(30, totalDuration); // Ensure minimum of 30 frames
  }
  
  const getChapterSlides = (chapterId: string) => {
    return slides.filter(slide => slide.chapterId === chapterId);
  }

  return (
    <div className='mt-24'>
      <div className='mb-16 animate-fade-in'>
        <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 w-fit'>
          <BookOpenIcon className='h-3.5 w-3.5 text-primary' />
          <span className='text-[13px] font-medium text-white/80'>Course Chapters</span>
        </div>
        <h2 className='text-4xl sm:text-5xl font-semibold mb-4 tracking-[-0.03em]'>Explore the Course</h2>
        <p className='text-[17px] text-white/60'>Dive deep into each chapter and master the content</p>
      </div>

      <div className='space-y-6'>
        {course?.courseLayout?.chapters.map((chapter, index) => (
        <Card 
          className='group hover-lift transition-all duration-200 border-white/6 bg-white/3 backdrop-blur-xl hover:bg-white/5 hover:border-white/10 animate-slide-up' 
          key={index}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="pb-6">
            <div className='flex gap-4 items-start'>
              <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[17px] font-semibold text-primary'>
                {index + 1}
              </div>
              <div className='flex-1'>
                <CardTitle className='text-[24px] font-semibold tracking-tight text-white'>
                  {chapter.chapterTitle}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
              <div className='space-y-4'>
                <h3 className='text-[13px] font-semibold text-white/50 uppercase tracking-wide mb-5'>What You'll Learn</h3>
                {chapter?.subContent.map((content, index) => (
                  <div className='flex gap-3 items-start' key={index}>
                    <div className='flex-shrink-0 mt-1'>
                      <DotIcon className='h-5 w-5 text-primary'/>
                    </div>
                    <p className='text-[15px] text-white/70 leading-relaxed'>{content}</p>
                  </div>
                ))}
              </div>
      
              <div className="relative">
                {getChapterSlides(chapter.chapterId).length > 0 ? (
                  <div className="relative">
                    <div className="rounded-[20px] overflow-hidden border border-white/6 bg-white/3 backdrop-blur-xl">
                      <Player 
                        className='w-full'
                        component={CourseComposition}
                        inputProps={{
                        //@ts-ignore
                        slides: transformSlides(getChapterSlides(chapter.chapterId)),
                        durationsBySlideId: durationsBySlideId??{}
                        }}
                        durationInFrames={GetChapterDurationInFrame(chapter.chapterId)}
                        compositionWidth={1280}
                        compositionHeight={720}
                        fps={30}
                        controls={true}
                        style={{
                            width: '100%',
                            aspectRatio: '16/9'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className='rounded-[20px] border border-white/6 bg-white/3 backdrop-blur-xl aspect-video flex items-center justify-center'>
                    <div className="text-center">
                      <p className='text-white/60 font-medium text-[15px]'>No slides available</p>
                      <p className='text-[14px] text-white/40 mt-1'>Content will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
         
        ))}
      </div>
      
    </div>
  )
}

export default CourseChapters