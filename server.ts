import express from "express";
import type { Request, Response } from "express";

import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/express";

const app = express();
const port = 3001;

// Logging Middleware to Track Requests
app.use((req, res, next) => {
  console.log(`[Request] Method: ${req.method} - URL: ${req.url}`);
  next();
});

// UploadThing Configuration and Router Setup
const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Error uploading file:", err.message);
    return { message: err.message };
  },
});

// Define the FileRouter inline
const uploadRouter: FileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    .onUploadError(({ error, fileKey }) => {
      console.log("Upload Error Triggered:", {
        message: error.message,
        fileKey,
      });
      throw error;
    })
    .onUploadComplete(async (data) => {
      console.log("Upload Completed:", data);
      return { foo: "bar", baz: "qux" };
    }),
};

// Apply the createRouteHandler with uploadRouter
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {},
  })
);

// Test Route to Verify Server
app.get("/test", (req: Request, res: Response) => {
  res.send("Server is working!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
