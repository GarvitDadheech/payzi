import { PrismaClient, OnRampStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      number: '9999999999',
      password: 'alice',
      name: 'Alice Johnson',
      balance: 50000,
      transaction: {
        startTime: new Date(),
        status: OnRampStatus.Success,
        amount: 20000,
        token: "122",
        provider: "HDFC Bank",
      },
    },
    {
      number: '9999999998',
      password: 'bob',
      name: 'Bob Smith',
      balance: 15000,
      transaction: {
        startTime: new Date(),
        status: OnRampStatus.Failure,
        amount: 2000,
        token: "123",
        provider: "HDFC Bank",
      },
    },
    {
      number: '9999999997',
      password: 'charlie',
      name: 'Charlie Brown',
      balance: 30000,
      transaction: {
        startTime: new Date(),
        status: OnRampStatus.Processing,
        amount: 15000,
        token: "124",
        provider: "ICICI Bank",
      },
    },
    {
      number: '9999999996',
      password: 'diana',
      name: 'Diana Prince',
      balance: 80000,
      transaction: {
        startTime: new Date(),
        status: OnRampStatus.Success,
        amount: 30000,
        token: "125",
        provider: "Axis Bank",
      },
    },
    {
      number: '9999999995',
      password: 'eric',
      name: 'Eric Cartman',
      balance: 10000,
      transaction: {
        startTime: new Date(),
        status: OnRampStatus.Failure,
        amount: 5000,
        token: "126",
        provider: "SBI",
      },
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { number: user.number },
      update: {
        balance: {
          upsert: {
            create: {
              amount: user.balance,
              locked: 0
            },
            update: {
              amount: user.balance,
            },
          },
        },
      },
      create: {
        number: user.number,
        password: user.password,
        name: user.name,
        OnRampTransaction: {
          create: {
            startTime: user.transaction.startTime,
            status: user.transaction.status,
            amount: user.transaction.amount,
            token: user.transaction.token,
            provider: user.transaction.provider,
          },
        },
        balance: {
          create: {
            amount: user.balance,
            locked: 0
          },
        },
      },
    });
  }

  console.log('Seed data inserted successfully.');
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
