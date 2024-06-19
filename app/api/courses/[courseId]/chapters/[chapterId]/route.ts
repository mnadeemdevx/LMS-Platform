import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } },
) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();

        console.log("vaues", values);

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

        const chapter = await db.chapter.update({
            where: { id: chapterId, courseId },
            data: { ...values },
        });
        // TODO; handle video uploads
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: { chapterId },
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: { id: existingMuxData.id },
                });
            }
        }

        const asset = await video.assets.create({
            input: [{ url: values.videoUrl }],
            playback_policy: ["public"],
            test: false,
        });

        await db.muxData.create({
            data: {
                chapterId,
                assetId: asset.id,
                playbackId: asset.playback_ids?.[0].id,
            },
        });
        return NextResponse.json(chapter);
    } catch (err) {
        console.log("[COURSES_CHAPTER_ID]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
