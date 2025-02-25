// lib/appwriteClient.ts
import { Client, Storage, Databases, Account, Users } from "node-appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

export const storage = new Storage(client);
export const databases = new Databases(client);
export const account = new Account(client);
export const users = new Users(client);
