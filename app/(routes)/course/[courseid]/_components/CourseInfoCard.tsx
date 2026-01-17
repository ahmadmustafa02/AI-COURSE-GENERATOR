import { Course } from '@/type/CourseType'
import { BookOpenIcon, ChartNoAxesColumnIncreasing, Sparkle } from 'lucide-react'
import React, { useMemo } from 'react'
import {Player } from '@remotion/player'
import { CourseComposition } from './ChapterVideo'
type Props = {
    course:Course | undefined;
    durationsBySlideId: Record<string, number> | null;
    
}
function CourseInfoCard ({course, durationsBySlideId}: Props) {
 

    const fps=30;
    const slides= course?.chapterContentSlide??[];
    
    const transformedSlides = useMemo(() => {
        return slides.map((slide) => ({
            slideId: slide.slideId,
            html: slide.html || '',
            audioFileUrl: slide.audioFileName || '',
            revelData: slide.revelData || [],
            caption: slide.captions ? {
                chunks: slide.captions.chunks || [],
                fullText: slide.captions.fullText
            } : undefined
        }));
    }, [slides]);
    
    const durationInFrames= useMemo(() => {
        if (!durationsBySlideId) {
            const defaultDuration = fps * 6 * Math.max(1, slides.length); // Default duration if not loaded yet
            return Math.max(30, defaultDuration); // Ensure minimum of 30 frames
        }
        if (slides.length === 0) {
            return 30; // Minimum duration for empty slides
        }
        const totalDuration = slides.reduce((sum, slide) => sum+ (durationsBySlideId[slide.slideId]??fps*6),0);
        return Math.max(30, totalDuration); // Ensure minimum of 30 frames
    }, [durationsBySlideId, slides, fps]);

  return (
    <div className="w-full">
        <div className='py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16'>
            <div className='space-y-8 animate-fade-in'>
                <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit'>
                    <Sparkle className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[13px] font-medium text-white/80">Course Preview</span>
                </div>
                <h1 className='text-5xl sm:text-6xl font-semibold leading-[1.1] tracking-[-0.03em] text-white'>
                    {course?.courseName}
                </h1>
                <p className='text-[18px] text-white/60 leading-relaxed'>
                    {course?.courseLayout?.courseDescription}
                </p>
                <div className='flex flex-wrap gap-3'>
                    {course?.courseLayout?.level && (
                        <div className='px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 backdrop-blur-xl'>
                            <ChartNoAxesColumnIncreasing className='h-4 w-4 text-primary'/>
                            <span className='text-[14px] font-medium text-white/80'>{course.courseLayout.level}</span>
                        </div>
                    )}
                    {course?.courseLayout?.totalChapters && (
                        <div className='px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 backdrop-blur-xl'>
                            <BookOpenIcon className='h-4 w-4 text-primary'/>
                            <span className='text-[14px] font-medium text-white/80'>{course.courseLayout.totalChapters} Chapters</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {!durationsBySlideId ? (
                    <div className='relative rounded-[20px] overflow-hidden border border-white/6 bg-white/3 backdrop-blur-xl aspect-video flex items-center justify-center'>
                        <div className='relative text-center z-10'>
                            <div className='animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-4'></div>
                            <p className='text-white/60 font-medium text-[15px]'>Loading video player...</p>
                        </div>
                    </div>
                ) : transformedSlides.length > 0 ? (
                    <div className="relative">
                        <div className="rounded-[20px] overflow-hidden border border-white/6 bg-white/3 backdrop-blur-xl">
                            <Player 
                                className='w-full'
                                component={CourseComposition}
                                inputProps={{
                                //@ts-ignore
                                slides: transformedSlides,
                                durationsBySlideId: durationsBySlideId || {}
                                }}
                                durationInFrames={Math.max(30, durationInFrames)}
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
                            <p className='text-[14px] text-white/40 mt-2'>Generate content to see preview</p>
                        </div>
                    </div>
                )}
            </div>

          

        </div>
    </div>
  )
}

export default CourseInfoCard