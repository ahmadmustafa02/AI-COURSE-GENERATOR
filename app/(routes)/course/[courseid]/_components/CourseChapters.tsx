import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/type/CourseType';
import { DotIcon } from 'lucide-react';
import React from 'react'
import ChapterVideo from './ChapterVideo';
import { Player } from '@remotion/player';



type Props = {
  course: Course | undefined;
}

const CourseChapters = ({course}: Props) => {
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
              <Player className='border-2 border-grey/10 rounded-2xl'
                              component={ChapterVideo}
                             durationInFrames={30}
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