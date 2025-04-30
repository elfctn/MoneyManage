import React from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DebtChart = () => {
  const debts = useSelector((state) => state.debts.debts);

  const data = debts.map((debt) => ({
    name: debt.debtName,
    totalDebt: debt.amount,
    paidDebt: debt.paymentPlan.reduce(
      (sum, payment) => (payment.isPaid ? sum + payment.paymentAmount : sum),
      0
    ),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalDebt" fill="#8884d8" name="Toplam Borç" />
        <Bar dataKey="paidDebt" fill="#82ca9d" name="Ödenen Borç" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DebtChart;
