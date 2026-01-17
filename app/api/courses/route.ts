import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userEmail = user.primaryEmailAddress?.emailAddress as string;
        const courses = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.userId, userEmail))
            .orderBy(desc(coursesTable.createdAt));

        return NextResponse.json({ courses });
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch courses", details: error.message },
            { status: 500 }
        );
    }
}
