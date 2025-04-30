import { ADD_DEBT, UPDATE_DEBT, SET_SELECTED_DEBT, FETCH_DEBTS, UPDATE_PAYMENT_STATUS, FETCH_PAYMENT_PLANS } from '../actions/debtActions';

const initialState = {
  debts: [],
  paymentPlan: [],
  selectedDebt: null,
};

const debtReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_DEBT:
      return {
        ...state,
        debts: [...state.debts, action.payload],
      };
    case UPDATE_DEBT:
      return {
        ...state,
        debts: state.debts.map(debt => 
          debt.id === action.payload.id ? { ...debt, ...action.payload } : debt
        ),
      };
    case SET_SELECTED_DEBT:
      return {
        ...state,
        selectedDebt: action.payload,
      };
    case FETCH_PAYMENT_PLANS:
      return {
        ...state,
        paymentPlan: action.payload.data,
        };
    case FETCH_DEBTS:
      return {
        ...state,
        debts: action.payload,
        isLoading: false,
      };
    case UPDATE_PAYMENT_STATUS:
      return {
        ...state,
        debts: state.debts.map(debt =>
          debt.id === action.payload.debtId
            ? {
                ...debt,
                paymentPlan: debt.paymentPlan.map(plan =>
                  plan.id === action.payload.paymentPlanId
                    ? { ...plan, isPaid: action.payload.isPaid }
                    : plan
                ),
              }
            : debt
        ),
        selectedDebt: state.selectedDebt && state.selectedDebt.id === action.payload.debtId
          ? {
              ...state.selectedDebt,
              paymentPlan: state.selectedDebt.paymentPlan.map(plan =>
                plan.id === action.payload.paymentPlanId
                  ? { ...plan, isPaid: action.payload.isPaid }
                  : plan
              ),
            }
          : state.selectedDebt,
      };
    default:
      return state;
  }
};

export default debtReducer;