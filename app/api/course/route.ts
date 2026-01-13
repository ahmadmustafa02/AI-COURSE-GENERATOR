import { db } from "@/config/db";
import { chapterContentSlides, coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const courseId= await req.nextUrl.searchParams.get('courseId');

    const courses=await db.select().from(coursesTable).where(eq(coursesTable.courseId,courseId as string));
    
    const chapterContentSlide=await db.select().from(chapterContentSlides).where(eq(chapterContentSlides.courseId,courseId as string));

    return NextResponse.json({course:courses[0], chapterContentSlide});

    
}