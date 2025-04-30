import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "../store/actions/userAction";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpOptions, setShowHelpOptions] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleShowClick = () => {
    setShowHelpOptions(!showHelpOptions);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log("Form Submitted:", data);
    try {
      await dispatch(loginUser(data, history));
      toast.success("Başarıyla giriş yapıldı!");
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Login error: ",
        error.response ? error.response.data : error.message
      );
      toast.error(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Giriş işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        {
          position: "top-right",
        }
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#e7f0fd] ">
      <h2 className="absolute font-extrabold text-[199px] text-white opacity-50 right-[3%] top-[10%] hidden md:block ">
        Log in
      </h2>
      <div className="max-w-xl w-full mx-auto p-10 mt-20  ">
        {isLoading ? (
          <div className="fullscreen">
            <div className="flex flex-col justify-center items-center">
              <h1 className="font-bold text-gray-500 text-[60px] mt-20 ml-10">
                LOADING...
              </h1>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="bg-white p-10 border border-gray-300 mt-6 rounded-lg shadow-md">
          <div className="flex flex-col justify-center items-center">
            <p className="text-[#252B42] font-bold text-[40px] tracking-tighter">
              WELCOME!
            </p>
            <p className="text-[#68686b] text-lg tracking-tight">
              Log in to your account and enjoy shopping
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {/* EMAİL ALANI */}
            <div>
              <label htmlFor="email" className="form-label"></label>
              <input
                className="form-input"
                placeholder="Email Address..."
                type="email"
                id="email"
                {...register("email", {
                  required: "Email address is required",
                  pattern: /^\S+@\S+$/i,
                })}
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>
            {/* PASSWORD ALANI */}
            <div>
              <label htmlFor="password" className="form-label"></label>
              <div className="relative">
                <input
                  placeholder="Password..."
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  size="xs"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>
            <div className="flex justify-start items-center">
              <input
                type="radio"
                id="Check"
                name="Check"
                className="mr-2 w-[24px] h-[14px]"
              />{" "}
              <span className="text-sm text-gray-600 font-medium">
                Remember me{" "}
              </span>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`
                             w-full py-2.5 bg-sky-500 text-lg text-white rounded-lg font-semibold
                             ${
                               isLoading
                                 ? "opacity-50 cursor-not-allowed"
                                 : "hover:scale-105"
                             }
                            `}
            >
              Sign in
            </button>
            <button className="w-full py-2 border-2 border-sky-500 text-lg text-gray-500 rounded-lg font-semibold">
              <span className="flex justify-center items-center gap-2">
                <FcGoogle className="text-2xl" />
                Sign in with Google
              </span>
            </button>
            <div className="text-sm text-left font-semibold text-customGray">
              By continuing, you agree to DebtsMaster's{" "}
              <span className="text-sky-500 no-underline hover:underline hover:text-red-600">
                Conditions of Use{" "}
              </span>{" "}
              and{" "}
              <span className="text-sky-500 no-underline hover:underline hover:text-red-600">
                {" "}
                Privacy Notice.
              </span>
            </div>
            <p className="text-md text-left font-semibold text-customGray">
              <FontAwesomeIcon
                icon={faCaretUp}
                rotation={180}
                size="xs"
                style={{ color: "#000000" }}
                className="inline-block align-middle mr-1"
              />
              <span
                onClick={handleShowClick}
                className="text-sky-500 hover:text-red-600 text-sm font-semibold ml-1 no-underline hover:underline cursor-pointer"
              >
                Need help?
              </span>
              {showHelpOptions && (
                <span className="text-sky-500 text-sm ml-[15px] block">
                  <span className="hover:text-red-600 hover:underline">
                    Forgot your password?
                  </span>{" "}
                  <br></br>
                  <span className="hover:text-red-600 hover:underline">
                    Other issues with Sign-in?
                  </span>
                </span>
              )}
            </p>
            <hr></hr>
            <div>
              <div className="text-md text-center font-semibold text-customGray">
                Don't have an DebtsMaster account?
                <Link
                  to="/signup"
                  className="text-sky-500 text-md font-semibold ml-1 no-underline"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
