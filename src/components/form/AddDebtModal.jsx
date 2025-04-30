import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";

import { useDispatch, useSelector } from "react-redux";
import {
  addDebt,
  updateDebt,
  setSelectedDebt,
} from "../../store/actions/debtActions";

const AddDebtModal = ({ isOpen, toggle, isEdit }) => {
  const dispatch = useDispatch();
  const selectedDebt = useSelector((state) => state.debts.selectedDebt);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      debtName: "",
      lenderName: "",
      debtAmount: "",
      interestRate: "",
      amount: "",
      paymentStart: "",
      installment: "",
      description: "",
      paymentPlan: [],
    },
  });

  useEffect(() => {
    if (isEdit && selectedDebt) {
      setValue("debtName", selectedDebt.debtName);
      setValue("lenderName", selectedDebt.lenderName);
      setValue("debtAmount", selectedDebt.debtAmount);
      setValue("interestRate", selectedDebt.interestRate);
      setValue("installment", selectedDebt.installment);
      setValue("paymentStart", selectedDebt.paymentStart.split("T")[0]);
      setValue("amount", selectedDebt.amount);
      setValue("description", selectedDebt.description);
      setValue(
        "paymentPlan",
        selectedDebt.paymentPlan
          ? selectedDebt.paymentPlan.map((plan) => ({
              ...plan,
              paymentDate: plan.paymentDate.split("T")[0],
            }))
          : []
      );
    } else {
      reset({
        debtName: "",
        lenderName: "",
        debtAmount: "",
        interestRate: "",
        amount: "",
        paymentStart: "",
        installment: "",
        description: "",
        paymentPlan: [],
      });
    }
  }, [isEdit, selectedDebt, setValue, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset({
        debtName: "",
        lenderName: "",
        debtAmount: "",
        interestRate: "",
        amount: "",
        paymentStart: "",
        installment: "",
        description: "",
        paymentPlan: [],
      });
      dispatch(setSelectedDebt(null));
    }
  }, [isOpen, reset, dispatch]);

  const onSubmit = async (data) => {
    try {
      const installmentCount = parseInt(data.installment, 10);
      const paymentAmount = parseFloat(data.amount) / installmentCount;
      const paymentPlan = [];

      for (let i = 0; i < installmentCount; i++) {
        const paymentDate = new Date(data.paymentStart);
        paymentDate.setMonth(paymentDate.getMonth() + i);
        paymentPlan.push({
          paymentDate: paymentDate.toISOString(),
          paymentAmount: paymentAmount,
          isPaid: false,
        });
      }

      const formattedData = {
        debtName: data.debtName,
        lenderName: data.lenderName,
        debtAmount: parseFloat(data.debtAmount),
        interestRate: parseFloat(data.interestRate),
        amount: parseFloat(data.amount),
        paymentStart: new Date(data.paymentStart).toISOString(),
        installment: installmentCount,
        description: data.description,
        paymentPlan: paymentPlan,
      };

      if (isEdit) {
        await dispatch(updateDebt(selectedDebt.id, formattedData));
      } else {
        await dispatch(addDebt(formattedData));
      }
      toggle();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal show={isOpen} onHide={toggle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Borç Düzenle" : "Yeni Borç Ekle"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="debtName" className="form-label">
                Borç Adı*
              </label>
              <input
                type="text"
                id="debtName"
                placeholder="Borcunuza bir isim giriniz"
                className="w-full p-2 mr-[55px] border rounded bg-gray-50"
                {...register("debtName", { required: "Borç adı gereklidir" })}
              />
              {errors.debtName && (
                <p className="form-error">{errors.debtName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lenderName" className="form-label">
                Borcu Veren*
              </label>
              <input
                id="lenderName"
                type="text"
                className="w-full p-2 mr-[55px] border rounded bg-gray-50"
                placeholder="Borcu vereni giriniz"
                {...register("lenderName", {
                  required: "Borcu veren gereklidir",
                })}
              />
              {errors.lenderName && (
                <p className="form-error">{errors.lenderName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="debtAmount" className="form-label">
                Borç Tutarı*
              </label>
              <input
                id="debtAmount"
                type="number"
                className="w-full p-2 mr-[55px] border rounded bg-gray-50"
                placeholder="Borç tutarı giriniz"
                {...register("debtAmount", {
                  required: "Borç tutarı gereklidir",
                })}
              />
              {errors.debtAmount && (
                <p className="form-error">{errors.debtAmount.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="interestRate" className="form-label">
                Faiz Oranı*
              </label>
              <input
                id="interestRate"
                type="number"
                className="w-full p-2 mr-[55px] border rounded bg-gray-50"
                placeholder="Faiz oranı giriniz"
                step="0.01"
                {...register("interestRate", {
                  required: "Faiz oranı gereklidir",
                })}
              />
              {errors.interestRate && (
                <p className="form-error">{errors.interestRate.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="installment" className="form-label">
                Taksit Sayısı*
              </label>
              <input
                id="installment"
                type="number"
                className="w-full p-2 mr-[55px] border rounded bg-gray-50"
                placeholder="Taksit sayısı giriniz"
                {...register("installment", {
                  required: "Taksit sayısı gereklidir",
                })}
              />
              {errors.installment && (
                <p className="form-error">{errors.installment.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="paymentStart" className="form-label">
                Ödeme Başlangıç Tarihi*
              </label>
              <input
                id="paymentStart"
                type="date"
                className="w-full p-2 mr-[55px] border rounded bg-gray-50"
                {...register("paymentStart", {
                  required: "Ödeme başlangıç tarihi gereklidir",
                })}
              />
              {errors.paymentStart && (
                <p className="form-error">{errors.paymentStart.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="amount" className="form-label">
                Toplam Tutar*
              </label>
              <input
                id="amount"
                type="number"
                className="w-full p-2 mr-[55px] border rounded bg-gray-50"
                placeholder="Toplam tutarı giriniz"
                {...register("amount", { required: "Toplam tutar gereklidir" })}
              />
              {errors.amount && (
                <p className="form-error">{errors.amount.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="description" className="form-label">
                Açıklama
              </label>
              <textarea
                id="description"
                type="text"
                className="w-full pb-20 border rounded bg-gray-50"
                placeholder="Diğer bilgileri giriniz."
                {...register("description")}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="px-3 py-2 bg-sky-500 text-white rounded-md hover:scale-105"
            type="submit"
          >
            {isEdit ? "Güncelle" : "Ekle"}
          </button>
          <button
            className="px-3 py-2 bg-gray-500 text-white rounded-md hover:scale-105"
            onClick={toggle}
          >
            İptal
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddDebtModal;
