import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { API, renewAPI } from "../api";
import { Link, useHistory } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    console.log("Payload:", payload);
    try {
      const response = await API.post("/auth/register", payload);
      console.log("Response:", response);
      localStorage.setItem("token", response.data.token);
      renewAPI();
      setIsSubmitted(true);
      toast.success("Başarıyla kayıt olundu!");
      history.push("/login");
    } catch (error) {
      toast.error(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred while submitting the form. Please try again."
      );
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#e7f0fd]">
      <h2 className="absolute font-extrabold text-[54px] sm:text-[174px] text-white opacity-50 right-[1%] top-[12%] z-50">
        Sign Up
      </h2>
      <div className="max-w-xl w-full mx-auto p-10 mt-20">
        <div className="bg-white p-10 border border-gray-300 mt-6 rounded-lg shadow-md">
          <div className="flex flex-col justify-center text-center space-y-2 mb-4">
            <h1 className="text-[#252B42] font-bold text-[40px] tracking-tighter">
              CREATE AN ACCOUNT
            </h1>
            <span className="text-customGray text-xs">
              Enter your information below to create your account
            </span>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div>
              <label htmlFor="name" className="form-label"></label>
              <input
                type="text"
                id="name"
                placeholder="Full Name..."
                className="form-input"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>
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
            <div>
              <label htmlFor="password" className="form-label"></label>
              <input
                placeholder="Password..."
                className="form-input"
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^[a-zA-Z0-9]{6,12}$/,
                    message:
                      "Password must be 6 to 12 characters long and contain only letters and numbers",
                  },
                })}
              />
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="form-label" htmlFor="confirmPassword"></label>
              <input
                className="form-input"
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password..."
                {...register("confirmPassword", {
                  required: "Enter your password",
                  validate: (val) => {
                    if (watch("password") !== val) {
                      return "Your passwords do not match";
                    }
                  },
                })}
              />
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || isSubmitted}
              className={`w-full py-2.5 bg-sky-500 text-lg text-white rounded-lg font-semibold${
                isSubmitted ? "" : "hover:scale-105"
              } ${!isValid || isLoading ? " cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <Spinner color="white" className="ml-[190px]" />
              ) : (
                "Continue With Email"
              )}
            </button>
            <div className="sm:w-full w-[90%] text-md text-center font-semibold text-customGray">
              Already have an account?
              <Link
                to="/login"
                className="text-sky-500 text-md font-semibold ml-1 no-underline"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="text-center text-customGray">
        By clicking continue, you agree to our <br />
        <span className="underline inline-block mx-1 hover:font-semibold cursor-pointer">
          Terms of Service
        </span>{" "}
        and
        <span className="underline inline-block mx-1 hover:font-semibold cursor-pointer">
          Privacy Policy
        </span>
        .
      </div>
    </div>
  );
}
