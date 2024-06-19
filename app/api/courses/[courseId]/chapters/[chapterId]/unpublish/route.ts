import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } },
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, chapterId } = params;

        const courseOwner = await db.course.findUnique({
            where: { id: courseId, userId },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unPublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                isPublished: false,
            },
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: { id: courseId },
                data: { isPublished: false },
            });
        }

        return NextResponse.json(unPublishedChapter);
    } catch (err) {
        console.log("[COURSES_CHAPTER_ID]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
