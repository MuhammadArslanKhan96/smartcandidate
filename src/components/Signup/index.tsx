"use client";
import { signUpWithEmail } from "@/helpers/authHelper";
import Link from "next/link";
import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { useAuthContext } from "@/context/AuthContext";
import "react-phone-number-input/style.css"; // Import stylesheet for react-phone-number-input
import { toast } from "react-hot-toast";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    committee: "",
    password: "",
    confirmPassword: "",
  });
  const { setUser } = useAuthContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === "string") {
      setFormData({
        ...formData,
        phone: e,
      });
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.confirmPassword ||
      !formData.committee ||
      !formData.email ||
      !formData.name ||
      !formData.password ||
      !formData.phone
    )
      return toast.error("Fill all of the required fields !!");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords don't match !!");

    try {
      const data = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.committee,
        formData.name,
        formData.phone,
      );

      setUser(data);

      toast.success("User Registered Successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        committee: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded bg-white p-8 shadow-md">
        <div className="text-left">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign up</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create an account on the internal platform
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-950 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-950 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <div className="mt-1">
              <PhoneInput
                id="phone"
                name="phone"
                international
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-950 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="committee"
              className="block text-sm font-medium text-gray-700"
            >
              Committee
            </label>
            <div className="mt-1">
              <input
                id="committee"
                name="committee"
                type="text"
                placeholder="Committee"
                required
                value={formData.committee}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-950 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-950 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-950 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded bg-blue-950 px-4 py-2 font-bold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              SIGN UP NOW
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between text-sm">
          <Link href="/signin" className="text-blue-950 hover:text-indigo-500">
            Already have an account? Sign in
          </Link>
          <button className="text-blue-950 hover:text-indigo-500">
            Forgot password? Reset password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
