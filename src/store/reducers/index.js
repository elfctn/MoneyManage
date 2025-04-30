import { combineReducers } from 'redux';
import userReducer from './userReducer';
import debtReducer from './debtReducer';


const rootReducer = combineReducers({
    user: userReducer,
    debts: debtReducer,

});

export default rootReducer;