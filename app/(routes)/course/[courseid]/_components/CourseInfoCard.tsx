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
    <div>
        <div className='p-8 grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className=''>
                <h2 className='flex gap-2 p-1 px-2 border rounded-2xl inline-flex'><Sparkle className="" /> Course Preview</h2>
                <h2 className='text-3xl font-bold mt-4 '>{course?.courseName}</h2>
                <p className='text-lg text-muted-foreground mt-3'>{course?.courseLayout?.courseDescription}</p>
            <div className='mt-5 flex gap-5'>
                <h2 className='px-3 p-2 border rounded-4xl flex gap-2 items-center inline-flex'><ChartNoAxesColumnIncreasing className='text-sky-400'/>{course?.courseLayout?.level}</h2>
                <h2 className='px-3 p-2 border rounded-4xl flex gap-2 items-center inline-flex'><BookOpenIcon className='text-green-400'/>{course?.courseLayout?.totalChapters} Chapters</h2>

            </div>

            </div>

            <div>
                {!durationsBySlideId ? (
                    <div className='border-2 border-grey/10 rounded-2xl flex items-center justify-center aspect-video bg-muted/10'>
                        <div className='text-center'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
                            <p className='text-muted-foreground'>Loading video player...</p>
                        </div>
                    </div>
                ) : transformedSlides.length > 0 ? (
                    <Player className='border-2 border-grey/10 rounded-2xl'
                     component={CourseComposition}
                     inputProps={{
                    //@ts-ignore
                     slides: transformedSlides,
                     durationsBySlideId: durationsBySlideId || {}

                    }
                     }
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
                ) : (
                    <div className='border-2 border-grey/10 rounded-2xl flex items-center justify-center aspect-video bg-muted/10'>
                        <p className='text-muted-foreground'>No slides available</p>
                    </div>
                )}
            </div>

          

        </div>
    </div>
  )
}

export default CourseInfoCard