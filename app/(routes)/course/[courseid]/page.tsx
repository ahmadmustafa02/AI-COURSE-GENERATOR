"use client";

import React, { use, useEffect, useState } from 'react'
import CourseInfoCard from './_components/CourseInfoCard'
import axios from 'axios';
import { useParams } from 'next/dist/client/components/navigation';
import { Course } from '@/type/CourseType';
import CourseChapters from './_components/CourseChapters';

const CoursePreview = () => {

const {courseid} = useParams();
const [courseDetail, setCourseDetail] = useState<Course>();

useEffect(() => {
    courseid && GetCourseDetail();
}, [courseid]);

const GetCourseDetail= async ()=>{
    const result = await axios.get('/api/course?courseId=' + courseid);
    console.log('Course Detail:', result.data);
    setCourseDetail(result.data);

}

  return (
    <div className='flex flex-col items-center '>
        <CourseInfoCard course={courseDetail}/>
        <CourseChapters course={courseDetail}/>
    </div>
  )
}

export default CoursePreview