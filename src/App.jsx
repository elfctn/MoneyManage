import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { useSelector } from "react-redux";
import WithAuth from "./components/WithAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Debts from "./pages/Debts";
import PaymentPlan from "./pages/PaymentPlan";
import Header from "./components/layout/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/layout/Footer";

const ProtectedDashboard = WithAuth(Dashboard);
const ProtectedDebts = WithAuth(Debts);
const ProtectedPaymentPlan = WithAuth(PaymentPlan);

const HomeRedirect = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/dashboard");
    } else {
      history.push("/signup");
    }
  }, [isAuthenticated, history]);

  return null;
};

function App() {
  return (
    <Router>
      <div className="w-full">
        <ToastContainer />
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={RegisterPage} />
          <Route path="/dashboard" exact>
            <Header />
            <ProtectedDashboard />
            <Footer />
          </Route>
          <Route path="/debts" exact>
            <Header />
            <ProtectedDebts />
          </Route>
          <Route path="/payment-plan" exact>
            <Header />
            <ProtectedPaymentPlan />
          </Route>
          <Route path="/" exact component={HomeRedirect} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
