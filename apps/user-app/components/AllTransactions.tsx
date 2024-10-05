import React from 'react';
import { Card } from "@repo/ui/card";

type OnRampTransaction = {
  type: 'onRamp';
  time: Date;
  amount: number;
  status: string;
  provider: string;
};

type P2PTransaction = {
  type: 'p2p';
  time: Date;
  amount: number;
  fromUserId: string;
  toUserId: string;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
      return 'text-green-600';
    case 'failure':
      return 'text-red-600';
    case 'processing':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};

type Transaction = OnRampTransaction | P2PTransaction;

export const AllTransactions = ({
  transactions,title
}: {
  transactions: Transaction[];
  title:string
}) => {
  if (!transactions.length) {
    return (
      <Card title={title}>
        <div className="text-center pb-8 pt-8">
          No transactions found
        </div>
      </Card>
    );
  }

  return (
    <Card title={title}>
      <div className="pt-2">
        {transactions.map((t, index) => (
          <div key={index} className="flex justify-between mb-4">
            <div>
              <div className="text-sm">
                {t.type === 'onRamp' ? 'Received INR' : t.amount > 0 ? 'Received P2P' : 'Sent P2P'}
              </div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
              {t.type === 'onRamp' && (
                <div>
                  <div className="text-slate-600 text-xs">
                    Provider: {t.provider}
                  </div>
                  <div className={`text-xs ${getStatusColor(t.status)}`}>
                    Status: {t.status}
                  </div>
                </div>
              )}
              {t.type === 'p2p' && (
                <div className="text-slate-600 text-xs">
                  {t.amount > 0 ? `From: ${t.fromUserId}` : `To: ${t.toUserId}`}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              {t.type === 'onRamp' ? (
                <span className="text-green-600">+ Rs {t.amount / 100}</span>
              ) : (
                <span className={t.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                  {t.amount > 0 ? '+' : '-'} Rs {Math.abs(t.amount) / 100}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};