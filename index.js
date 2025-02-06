require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const express = require('express');

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize server
const PORT = process.env.PORT || 3000;

// Main async function
async function main() {
    try {
        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting application:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

// Run main function
main().catch(e => {
    throw e;
}).finally(async () => {
    await prisma.$disconnect();
});