import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDebts } from "../store/actions/debtActions";
import WithAuth from "../components/WithAuth";
import DebtChart from "../components/charts/DebtChart";

const Dashboard = () => {
  const dispatch = useDispatch();
  const debts = useSelector((state) => state.debts.debts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      setIsLoading(true);
      await dispatch(fetchDebts());
      setIsLoading(false);
    };

    if (debts.length === 0) {
      loadDebts();
    }
  }, [dispatch, debts.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-4 text-4xl font-bold text-gray-600 ">
        Loading...
      </div>
    );
  }

  // Toplam borç miktarı
  const totalDebt = debts.reduce((total, debt) => total + debt.amount, 0);

  // Ödenen borç miktarı
  const paidDebt = debts.reduce((total, debt) => {
    const paidAmount = debt.paymentPlan
      .filter((payment) => payment.isPaid)
      .reduce((sum, payment) => sum + payment.paymentAmount, 0);
    return total + paidAmount;
  }, 0);

  // Kalan borç miktarı
  const remainingDebt = totalDebt - paidDebt;

  // Toplam taksit sayısı
  const totalInstallments = debts.reduce((total, debt) => {
    return total + debt.installment;
  }, 0);

  // Ortalama Aylık Ödeme Tutarı
  const averageMonthlyPayment = totalInstallments
    ? totalDebt / totalInstallments
    : 0;

  // Yaklaşan ödeme tarihleri
  const upcomingPayments = debts
    .flatMap((debt) => debt.paymentPlan)
    .filter(
      (payment) => !payment.isPaid && new Date(payment.paymentDate) > new Date()
    )
    .sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate))
    .slice(0, 5);

  // Ödeme geçmişi
  const paymentHistory = debts
    .flatMap((debt) =>
      debt.paymentPlan
        .filter((payment) => payment.isPaid)
        .map((payment) => ({
          debtName: debt.debtName,
          paymentDate: payment.paymentDate,
          paymentAmount: payment.paymentAmount,
        }))
    )
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
    .slice(0, 5);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    return amount.toFixed(2);
  };

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col bg-white my-10">
      <div className="container mx-auto flex-1 flex flex-col items-center px-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 m-4">
          <div className="p-6 rounded-lg shadow-md bg-sky-800">
            <h2 className="text-lg font-semibold text-white">Toplam Borç</h2>
            <p className="text-2xl font-bold text-white">
              {totalDebt.toFixed(2)} ₺
            </p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-blue-300">
            <h2 className="text-lg font-semibold text-white">Ödenen Borç</h2>
            <p className="text-2xl font-bold text-white">
              {paidDebt.toFixed(2)} ₺
            </p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-violet-400">
            <h2 className="text-lg font-semibold text-white">Kalan Borç</h2>
            <p className="text-2xl font-bold text-white">
              {remainingDebt.toFixed(2)} ₺
            </p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-emerald-300">
            <h2 className="text-lg font-semibold text-white">
              Ortalama Aylık Ödemeler
            </h2>
            <p className="text-2xl font-bold text-white">
              {averageMonthlyPayment.toFixed(2)} ₺
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-200 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-white">
              Yaklaşan Ödeme Tarihleri
            </h2>
            {upcomingPayments.length > 0 ? (
              <ul className="list-disc ml-4 text-white">
                {upcomingPayments.map((payment, index) => (
                  <li key={index} className="text-lg">
                    {formatDate(payment.paymentDate)}:{" "}
                    {formatAmount(payment.paymentAmount)} ₺
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg font-semibold text-white">
                Yaklaşan ödemeniz bulunmamaktadır.
              </p>
            )}
          </div>
          <div className="bg-indigo-200 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-white">Ödeme Geçmişi</h2>
            {paymentHistory.length > 0 ? (
              <ul className="list-disc ml-4 text-white">
                {paymentHistory.map((payment, index) => (
                  <li key={index} className="text-lg">
                    {payment.debtName} borcu{" "}
                    {formatAmount(payment.paymentAmount)} ₺ ödendi
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg font-semibold text-white">
                Ödeme geçmişiniz bulunmamaktadır.
              </p>
            )}
          </div>
        </div>

        <div className="w-full bg-white p-6 rounded-lg shadow-md mt-4">
          <h2 className="text-xl font-semibold mb-4">Borç Durumu Grafiği</h2>
          <DebtChart debts={debts} />
        </div>
      </div>
    </div>
  );
};

export default WithAuth(Dashboard);
