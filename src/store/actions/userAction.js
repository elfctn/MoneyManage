import { toast } from "react-toastify";
import { API, renewAPI } from "../../api";


export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';


// Kullanıcının log in isteği
export const userLogin = (userData) => ({
  type: USER_LOGIN, payload: userData
})

//Kullanıcının log out isteği
export const userLogout = () => ({
  type: USER_LOGOUT,
});



export const loginUser = (userData, history) => async (dispatch) => {
  try {
      const response = await API.post('/auth/login', userData);
      dispatch(userLogin(response.data));
      localStorage.setItem('token', response.data.data); // Token'ı doğru şekilde kaydediyoruz
      renewAPI(); // API'yi yenileyerek yeni token'ı kullanmasını sağla
      history.push('/dashboard');
  } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      toast.error(error.response ? error.response.data.message : error.message, {
          position: 'top-right',
      });
      throw error;
  }
};

  export const logoutUser = () => {
    return (dispatch) => {
      dispatch(userLogout());
      localStorage.removeItem("token");
    };
  };


  {/* userAction dosyası sadece kullanıcı ile ilgili özel eylemleri yönetir. */ }