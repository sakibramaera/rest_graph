import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

async function main() {
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.cart.deleteMany();

    console.log('Seeding...');

    const user1 = await prisma.user.create({
        data: {
            email: 'lisa@simpson.com',
            userName: 'Lisa',
            fullName: 'Simpson',
            password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
            role: 'ADMIN',
            products: {
                create: [
                    {
                        name: 'Join us for Prisma Day 2019 in Berlin',
                        price: '20',
                        quantity: '15',
                    },
                    {
                        name: 'sakib us for Prisma Day 2019 in Berlin',
                        price: '30',
                        quantity: '19',
                    },
                ],
            },
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'bart@simpson.com',
            userName: 'Bart',
            fullName: 'Simpson',
            password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
        },
    });

    console.log({ user1, user2 });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });