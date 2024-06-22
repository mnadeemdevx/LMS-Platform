import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } },
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { isCompleted } = await req.json();

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId,
                },
            },
            update: {
                isCompleted,
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted,
            },
        });

        return NextResponse.json(userProgress);
    } catch (err) {
        console.log("[CHAPTER_ID_PROGRESS]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
