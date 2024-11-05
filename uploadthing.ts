// uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    return { message: err.message };
  },
});

export const uploadRouter: FileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    .onUploadError(({ error, fileKey }) => {
      console.log("upload error", { message: error.message, fileKey });
      throw error;
    })
    .onUploadComplete(async (data) => {
      console.log("upload completed", data);
      return { foo: "bar", baz: "qux" };
    }),
};
