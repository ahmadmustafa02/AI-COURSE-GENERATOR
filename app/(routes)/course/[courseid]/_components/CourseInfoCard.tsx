import { Course } from '@/type/CourseType'
import { BookOpenIcon, ChartNoAxesColumnIncreasing, Sparkle } from 'lucide-react'
import React from 'react'
import {Player } from '@remotion/player'
import ChapterVideo from './ChapterVideo'
type Props = {
    course:Course | undefined
}
function CourseInfoCard ({course}: Props) {
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
                <Player className='border-2 border-grey/10 rounded-2xl'
                 component={ChapterVideo}
                durationInFrames={30}
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
    </div>
  )
}

export default CourseInfoCard