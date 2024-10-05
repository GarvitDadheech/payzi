import React from 'react';
import { getServerSession } from "next-auth";
import db from "@repo/db/client";
import { authOptions } from '../../lib/auth';
import { AllTransactions } from '../../../components/AllTransactions';

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Please log in to view your transactions.</div>;
  }

  const onRampTransactions = await db.onRampTransaction.findMany({
    where: { userId: Number(userId) },
    orderBy: { startTime: 'desc' },
  });

  const p2pTransactions = await db.p2pTransfer.findMany({
    where: {
      OR: [
        { fromUserId: Number(userId) },
        { toUserId: Number(userId) },
      ],
    },
    orderBy: { timestamp: 'desc' },
  });

  const allTransactions = [
    ...onRampTransactions.map(t => ({
      type: 'onRamp' as const,
      time: t.startTime,
      amount: t.amount,
      status: t.status,
      provider: t.provider,
    })),
    ...p2pTransactions.map(t => ({
      type: 'p2p' as const,
      time: t.timestamp,
      amount: t.fromUserId === Number(userId) ? -t.amount : t.amount,
      fromUserId: t.fromUserId.toString(),
      toUserId: t.toUserId.toString(),
    })),
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>
      <AllTransactions transactions={allTransactions} title="All Transactions"/>
    </div>
  );
}