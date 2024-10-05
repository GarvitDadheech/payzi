import { PrismaClient, OnRampStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      number: '9999999999',
      password: '$2b$10$FV1Z7mbgZ7MkVckidWcmiOeYtLvNe1KDAuIfK3uA26cOODqDSTvkW',
      name: 'Jasmine Johnson',
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
      password: '$2b$10$3pmstoCM/9outISGt0eemeQL5i/SpxyA3zrWEjT/gUbKPxSe/OsrS',
      name: 'Jennifer Smith',
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
      password: '$2b$10$gvEXF24lLayJTzCpl1B1N.Z5mSVYC376gWG/Z7hVcwdc.F2aJCqzm',
      name: 'Charlie Brown',
      balance: 30000,
      transaction: {
        startTime: new Date(),
        status: OnRampStatus.Processing,
        amount: 15000,
        token: "124",
        provider: "HDFC Bank",
      },
    },
    {
      number: '9999999996',
      password: '$2b$10$Z9WBWvI1spTBavN9K1M4/egMR4Q9FcwGZpRhMXN/f2NUrvoHQ.6s.',
      name: 'Prince Parker',
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
      password: '$2b$10$U01En4aq2p1BxRDjFGDn1.KihcXgVvrP3WU0sDYAiLDMK9ejZFlcm',
      name: 'Jeremy Cartman',
      balance: 10000,
      transaction: {
        startTime: new Date(),
        status: OnRampStatus.Failure,
        amount: 5000,
        token: "126",
        provider: "Axis Bank",
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
