// import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
    const { userId } = auth();
    // const isAuthorized = isTeacher(userId);

    if (!userId) {
        throw new Error("Unauthorized");
    }

    return { userId };
};

export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    courseAttachment: f({
        text: { maxFileSize: "128MB" },
        image: { maxFileSize: "128MB" },
        video: { maxFileSize: "512GB" },
        audio: { maxFileSize: "128MB" },
        pdf: { maxFileSize: "128MB" },
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
