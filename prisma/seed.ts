import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with premium dummy data...');

    // 1. Clean existing data
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Admin User
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            name: 'System Admin',
            email: 'admin@finance.com',
            password: hashedAdminPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin User Created: admin@finance.com / admin123');

    // 3. Create Accounts
    const mainAccount = await prisma.account.create({
        data: {
            name: 'Main Checking',
            type: 'BANK',
            balance: 5420.50,
            userId: admin.id,
        },
    });

    const savingsAccount = await prisma.account.create({
        data: {
            name: 'Emergency Savings',
            type: 'SAVINGS',
            balance: 12500.00,
            userId: admin.id,
        },
    });

    const businessCredit = await prisma.account.create({
        data: {
            name: 'Business Credit',
            type: 'CREDIT_CARD',
            balance: -450.20,
            userId: admin.id,
        },
    });
    console.log('✅ 3 Accounts Created');

    // 4. Create Categories
    const salaryCat = await prisma.category.create({
        data: { name: 'Main Salary', type: 'INCOME', userId: admin.id },
    });
    const freelanceCat = await prisma.category.create({
        data: { name: 'Freelance Work', type: 'INCOME', userId: admin.id },
    });
    const rentCat = await prisma.category.create({
        data: { name: 'Rent & Living', type: 'EXPENSE', userId: admin.id },
    });
    const foodCat = await prisma.category.create({
        data: { name: 'Dining Out', type: 'EXPENSE', userId: admin.id },
    });
    const transportCat = await prisma.category.create({
        data: { name: 'Transport', type: 'EXPENSE', userId: admin.id },
    });
    const healthCat = await prisma.category.create({
        data: { name: 'Health & Medical', type: 'EXPENSE', userId: admin.id },
    });
    console.log('✅ 6 Categories Created');

    // 5. Create 50+ Transactions for valid charts
    const transactions = [];
    const now = new Date();
    
    // Last 30 days of transactions
    for (let i = 0; i < 40; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const isIncome = Math.random() > 0.7; // 30% income

        transactions.push({
            amount: isIncome ? (Math.random() * 2000 + 1000) : (Math.random() * 150 + 10),
            description: isIncome ? 'Project Payment' : `Daily Purchase - ${i}`,
            date: date,
            userId: admin.id,
            accountId: isIncome ? mainAccount.id : (Math.random() > 0.5 ? mainAccount.id : businessCredit.id),
            categoryId: isIncome ? salaryCat.id : (Math.random() > 0.5 ? foodCat.id : transportCat.id),
        });
    }

    // Fixed periodic expenses
    transactions.push({
        amount: 1200,
        description: 'Monthly Rent',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        userId: admin.id,
        accountId: mainAccount.id,
        categoryId: rentCat.id,
    });

    await prisma.transaction.createMany({ data: transactions });
    console.log('✅ 40+ Transactions Seeded');

    console.log('✨ Seeding complete! Database is now "WOW".');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
