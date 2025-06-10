require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const app = require('./src/app.js');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function main() {
    try {
        if (!global._server) {
            const server = app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });

            // Store server globally to avoid duplicates on hot reloads
            global._server = server;

            // Optional: Handle graceful shutdown (good practice!)
            process.on('SIGTERM', () => {
                server.close(() => {
                    console.log('Server gracefully shut down');
                });
            });
        }
    } catch (error) {
        console.error('Error starting application:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main().catch(e => {
    console.error(e);
}).finally(async () => {
    await prisma.$disconnect();
});
