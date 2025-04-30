import { API } from '../../api';

export const SET_LOADING = 'SET_LOADING';
export const ADD_DEBT = 'ADD_DEBT';
export const UPDATE_DEBT = 'UPDATE_DEBT';
export const SET_SELECTED_DEBT = 'SET_SELECTED_DEBT';
export const FETCH_DEBTS = 'FETCH_DEBTS';
export const UPDATE_PAYMENT_STATUS = 'UPDATE_PAYMENT_STATUS';
export const FETCH_PAYMENT_PLANS = "FETCH_PAYMENT_PLANS";
export const DELETE_DEBT = 'DELETE_DEBT';

// BORÇ EKLEME EYLEMİ
export const addDebtAction = (debt) => ({
  type: ADD_DEBT, payload: debt,
});

// BORÇ GÜNCELLEME EYLEMİ
export const updateDebtAction = (debt) => ({
  type: UPDATE_DEBT, payload: debt,
});

// SEÇİLİ BORCU AYARLAMA EYLEMİ
export const setSelectedDebt = (debt) => ({
  type: SET_SELECTED_DEBT, payload: debt,
});

// BORÇ SİL
export const deleteDebt = (debtId) => async (dispatch) => {
  try {
    await API.delete(`/finance/debt/${debtId}`);
    dispatch(fetchDebts());
    dispatch({ type: DELETE_DEBT, payload: debtId });
  } catch (error) {
    console.error('Error deleting debt:', error);
  }
};

export const fetchPaymentPlans = (debtId) => async (dispatch) => {
    try {
      const response = await API.get(`finance/payment-plans/${debtId}`);
      dispatch({ type: FETCH_PAYMENT_PLANS, payload: response.data });
      console.log("Fetched Payment Plans: ", response.data); 
      return response.data; 
    } catch (error) {
      console.error('Error fetching payment plans:', error);
    }
  };

// ÖDEME DURUMUNU GÜNCELLE(isPaid)
export const updatePaymentStatus = (debtId, paymentDate, paymentAmount, paymentPlanId, isPaid) => async (dispatch, getState) => {
    try {
      const state = getState();
      const selectedDebt = state.debts.debts.find(debt => debt.id === debtId);
      const paymentPlan = selectedDebt.paymentPlan.find(plan => plan.id === paymentPlanId);
      const payload = {
        paymentDate: paymentDate,
        paymentAmount: paymentAmount,
        isPaid: isPaid,
      };
      await API.put(`finance/payment-plans/${paymentPlanId}`, payload);
      dispatch({
        type: UPDATE_PAYMENT_STATUS,
        payload: { debtId, paymentPlanId, isPaid }
      });
      dispatch(fetchDebts());
    } catch (error) {
      //console.error('Error updating payment status:', error);
    }
  };

// BORÇLARI GETİR
export const fetchDebts = () => async (dispatch) => {
    try {
      const response = await API.get('/finance/debt');
      const debtsWithPaymentPlan = await Promise.all(response.data.data.map(async (debt) => {
        const paymentPlansResponse = await API.get(`finance/payment-plans/${debt.id}`);
        const paymentPlan = calculatePaymentPlan(
          debt.debtAmount,
          debt.amount,
          debt.paymentStart,
          debt.installment,
          paymentPlansResponse.data.data
        );
        return {
          ...debt,
          paymentPlan
        };
      }));
      dispatch({ type: FETCH_DEBTS, payload: debtsWithPaymentPlan });
      //console.log("Fetched Debts: ", debtsWithPaymentPlan);
    } catch (error) {
      //console.error('Error fetching debts:', error);
    }
  };


  // ÖDEME PLANINI HESAPLA
const calculatePaymentPlan = (debtAmount, amount, paymentStart, installment, existingPaymentPlan = []) => {
    const paymentPlan = [];
    const monthlyAmount = amount / installment;
  
    for (let i = 0; i < installment; i++) {
      const paymentDate = new Date(paymentStart);
      paymentDate.setMonth(paymentDate.getMonth() + i);
  
      const existingPayment = existingPaymentPlan.find(plan => 
        new Date(plan.paymentDate).toISOString() === paymentDate.toISOString()
      );
  
      paymentPlan.push({
        paymentDate: paymentDate.toISOString(),
        paymentAmount: monthlyAmount,
        isPaid: existingPayment ? existingPayment.isPaid : false 
      });
    }
  
    return paymentPlan;
  };

// BORÇ EKLE
export const addDebt = (data) => async (dispatch) => {
    const paymentPlan = calculatePaymentPlan(
      data.debtAmount,
      data.amount,
      data.paymentStart,
      data.installment
    ).map(plan => ({
      paymentDate: plan.paymentDate,
      paymentAmount: plan.paymentAmount,
      isPaid: plan.isPaid
    }));
  
    const postData = {
      ...data,
      paymentPlan,
    };
  
    try {
      await API.post('finance/debt', postData);
      dispatch(fetchDebts());
    } catch (error) {
      //console.error('Error adding debt:', error);
      throw error;
    }
  };

// BORÇ GÜNCELLE
export const updateDebt = (debtId, data) => async (dispatch) => {
    const paymentPlan = calculatePaymentPlan(
      data.debtAmount,
      data.amount,
      data.paymentStart,
      data.installment
    ).map(plan => ({
      paymentDate: plan.paymentDate,
      paymentAmount: plan.paymentAmount,
      isPaid: plan.isPaid
    }));
  
    const postData = {
      ...data,
      paymentPlan,
    };
  
    try {
      const response = await API.put(`finance/debt/${debtId}`, postData);
      //console.log("Update Debt Response: ", response.data);
      dispatch(fetchDebts());
    } catch (error) {
      //console.error('Error updating debt:', error);
      throw error;
    }
  };