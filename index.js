require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const app = require('./src/app.js');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function main() {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
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
