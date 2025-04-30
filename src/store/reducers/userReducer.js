import { USER_LOGIN, USER_LOGOUT } from '../actions/userAction'

const userInitial = {
  userData: {}, // Kullanıcı bilgileri
  isAuthenticated: !!localStorage.getItem('token'), // Token'a göre isAuthenticated belirlenir
};

const userReducer = (state = userInitial, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        userData: action.payload,
        isAuthenticated: true
      };
    case USER_LOGOUT:
      return {
        ...state,
        userData: {},
        isAuthenticated: false
      };
    default:
      return state;
  }
};

export default userReducer;