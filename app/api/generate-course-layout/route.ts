import { Course_config_prompt } from "@/app/data/prompt";
import { db } from "@/config/db";
import { client } from "@/config/groq";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log('=== Generate Course Layout API Called ===');
    
    const { userInput, type,  courseId } = await req.json();
    console.log('User Input:', userInput);
    console.log('Type:', type);

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('Calling Groq API...');
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: Course_config_prompt },
        { role: "user", content: `Create a course on the topic: ${userInput}` }
      ],
      temperature: 0.7,
    });

    console.log('Groq API Response received');
    let rawResult = response.choices[0].message?.content || "";
    
    // Remove markdown code blocks if present
    rawResult = rawResult
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log('Parsing JSON...');
    const JSONResult = JSON.parse(rawResult);
    

    //  SAVE TO DB
    console.log('Saving to database...');
    const savedCourse = await db.insert(coursesTable).values({
      courseId: courseId,
      userId: user.primaryEmailAddress?.emailAddress as string,
      courseName: JSONResult.courseName,
      userInput: userInput,
      type: type,
      courseLayout: JSONResult,
    }).returning();

    console.log('Course saved to database:', savedCourse[0]);

    return NextResponse.json({
      ...JSONResult,
      dbId: savedCourse[0].id,
      courseId: savedCourse[0].courseId
    });

  } catch (error: any) {
    console.error(" generate-course-layout error:", error);
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Stack:", error.stack);
    }
    
    return NextResponse.json(
      { error: "Failed to generate course layout", details: error.message },
      { status: 500 }
    );
  }
}