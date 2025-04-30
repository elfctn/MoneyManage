import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import WithAuth from "../components/WithAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddDebtModal from "../components/form/AddDebtModal";
import {
  setSelectedDebt,
  fetchDebts,
  deleteDebt,
} from "../store/actions/debtActions";

const Debts = () => {
  const debts = useSelector((state) => state.debts.debts) || [];
  const selectedDebt = useSelector((state) => state.debts.selectedDebt);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleViewPaymentPlan = (debt) => {
    dispatch(setSelectedDebt(debt));
    history.push(`/payment-plan`);
  };

  useEffect(() => {
    dispatch(fetchDebts());
  }, [dispatch]);

  const handleShow = () => {
    setIsEdit(false);
    dispatch(setSelectedDebt(null));
    setShow(true);
  };

  const handleEditShow = (debt) => {
    setIsEdit(true);
    dispatch(setSelectedDebt(debt));
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    dispatch(setSelectedDebt(null));
  };

  const handleDelete = (debt) => {
    dispatch(deleteDebt(debt.id));
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-100">
      <h1 className="text-4xl font-bold my-6">Borçlar</h1>
      <div className="w-full max-w-4xl flex flex-wrap justify-between gap-4 mb-4">
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col justify-between items-center">
            <FontAwesomeIcon
              icon={faPlus}
              className="text-sky-500 cursor-pointer"
              onClick={handleShow}
            />
            <h2 className="text-xl text-sky-500  font-semibold">
              Yeni Borç Ekle
            </h2>
          </div>
        </div>
        {debts.map((debt) => (
          <div
            key={debt.id}
            className="w-full bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">{debt.debtName}</h2>
              <div className="flex gap-2">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-sky-500 cursor-pointer"
                  onClick={() => handleEditShow(debt)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-sky-500 cursor-pointer"
                  onClick={() => handleDelete(debt)}
                />
              </div>
            </div>
            <p>{debt.lenderName}</p>
            <p>{debt.amount} ₺</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="p-2 bg-sky-500 rounded text-white hover:scale-105"
                onClick={() => handleViewPaymentPlan(debt)}
              >
                Ödeme Planını Gör
              </button>
            </div>
          </div>
        ))}
      </div>
      <AddDebtModal
        isOpen={show}
        toggle={handleClose}
        isEdit={isEdit}
        selectedDebt={selectedDebt}
      />
    </div>
  );
};

export default WithAuth(Debts);
