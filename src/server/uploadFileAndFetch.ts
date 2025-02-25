import { Hono } from "hono";
import { storage } from "@/lib/appwriteClient";

const bucketId = process.env.NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID;
if (!bucketId) {
    throw new Error("NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID is not defined");
}

const app = new Hono();

app.post("/upload", async (c) => {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    if (!file) return c.json({ error: "No file uploaded" }, 400);
    const response = await storage.createFile(bucketId, "unique()", file);
    return c.json(response);
});

app.get("/files", async (c) => {
    const response = await storage.listFiles(bucketId);
    return c.json(response);
});

export default app;