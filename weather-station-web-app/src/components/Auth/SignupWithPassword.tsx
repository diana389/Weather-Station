"use client";
import Link from "next/link";
import React, { useState } from "react";

// Custom hook to manage form state and submission logic
function useSignupForm(onSubmit: (data: { name: string; email: string; password: string; gender: string }) => void) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call the parent's onSubmit function when form is submitted
    onSubmit({ name, email, password, gender });
  };

  return {
    name,
    email,
    password,
    gender,
    setName,
    setEmail,
    setPassword,
    setGender,
    handleSubmit
  };
}

interface SignupWithPasswordProps {
  onSubmit: (data: { name: string; email: string; password: string; gender: string }) => void;
}

export default function SignupWithPassword({ onSubmit }: SignupWithPasswordProps) {
  const {
    name,
    email,
    password,
    gender,
    setName,
    setEmail,
    setPassword,
    setGender,
    handleSubmit
  } = useSignupForm(onSubmit);

  return (
    <form onSubmit={handleSubmit}>
      {/* Name Field */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2.5 block font-medium text-dark dark:text-white">
          Name
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label htmlFor="email" className="mb-2.5 block font-medium text-dark dark:text-white">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="mb-5">
        <label htmlFor="password" className="mb-2.5 block font-medium text-dark dark:text-white">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Gender Field */}
      <div className="mb-4">
        <label htmlFor="gender" className="mb-2.5 block font-medium text-dark dark:text-white">
          Gender
        </label>
        <div className="relative">
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}
