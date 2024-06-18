const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: 'Computer Science' },
                { name: 'Music' },
                { name: 'Fitness' },
                { name: 'Photography' },
                { name: 'Accounting' },
                { name: 'Engineering' },
                { name: 'Filming' },
            ],
        });
        console.log('Seeding done!');
    } catch (err) {
        console.log('Error seeding the database categories', err);
    } finally {
        database.$disconnect();
    }
}

main();
