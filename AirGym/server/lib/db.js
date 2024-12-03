const { PrismaClient } = require("@prisma/client");

// Create a new PrismaClient instance if it doesn't exist
const db = globalThis.prisma || new PrismaClient();

// If we're not in production, set the prisma property on the global object
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

module.exports = { db };
