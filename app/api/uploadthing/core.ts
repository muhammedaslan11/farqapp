import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  menuImageUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => ({
    url: file.url,
  })),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
