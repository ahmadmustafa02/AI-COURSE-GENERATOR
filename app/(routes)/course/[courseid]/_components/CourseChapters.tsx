import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/type/CourseType';
import { DotIcon } from 'lucide-react';
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
    <div className='max-w-6xl mt-5 p-10 border rounded-3xl shadow w-full '>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-2xl'>Course Preview</h2>
        <h2 className='text-sm text-muted-foreground'>Chapters</h2>

      </div>

      <div className='mt-10'>
        {course?.courseLayout?.chapters.map((chapter, index) => (
        <Card className='mv-5' key={index}>
          <CardHeader>
            <div className='flex gap-3 items-center'>
                          <h2 className='p-2 bg-primary/40 inline-flex h-10 w-10 text-center rounded-2xl justify-center'>{index + 1}</h2>
                         <CardTitle className='md:text-xl text-base '>
                          {chapter.chapterTitle}
                         </CardTitle>
            </div>
            

          </CardHeader>

          <CardContent>

        <div className='grid grid-cols-2 gap-5'>

            <div>
            {chapter?.subContent.map((content, index) => (
              <div className='flex gap-2 items-center mt-2' key={index}>
               <DotIcon className='h-2 w-5 text-primary '/>
               <h2>{content}</h2>
              </div>
            ))}
            </div>
      

        <div>
              {getChapterSlides(chapter.chapterId).length > 0 ? (
                <Player className='border-2 border-grey/10 rounded-2xl'
                                component={CourseComposition}
                                 inputProps={{
                  //@ts-ignore
                   slides: transformSlides(getChapterSlides(chapter.chapterId)),
                   durationsBySlideId: durationsBySlideId??{}

                  }
                   }
                               durationInFrames={GetChapterDurationInFrame(chapter.chapterId)}
                               compositionWidth={1280}
                               compositionHeight={720}
                               fps={30}
                               controls={true}
                               style={{
                                   width: '80%',
                                   height: 'auto',
                                   aspectRatio: '16/9'
                               }}
                               />
              ) : (
                <div className='border-2 border-grey/10 rounded-2xl flex items-center justify-center aspect-video bg-muted/10'>
                  <p className='text-muted-foreground'>No slides available for this chapter</p>
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