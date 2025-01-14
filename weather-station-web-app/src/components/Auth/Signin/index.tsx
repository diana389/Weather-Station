"use client";
import Link from "next/link";
import React, { useState } from "react";
import SigninWithPassword from "../SigninWithPassword";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebaseConfig";

export default function Signin() {
  const [formData, setFormData] = useState<{ email: string; password: string } | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state to display Firebase errors

  // Handle form submission directly in the parent component
  const handleFormSubmit = (data: { email: string; password: string }) => {
    const { email, password } = data;

    // Firebase sign-in attempt
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signed in successfully:", user);
        // Handle successful sign-in (e.g., store user info, navigate)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error signing in:", errorMessage);
        setError(errorMessage); // Set error state to display it
      });

    setFormData(data); // Store the form data to display it or trigger authentication
  };

  return (
    <>
      <div>
        {/* Pass the handleFormSubmit function directly to the child component */}
        <SigninWithPassword onSubmit={handleFormSubmit} />
      </div>

      {/*/!* Display the form data after submission *!/*/}
      {/*{formData && (*/}
      {/*  <div>*/}
      {/*    <h3>Form Data:</h3>*/}
      {/*    <pre>{JSON.stringify(formData, null, 2)}</pre>*/}
      {/*  </div>*/}
      {/*)}*/}

      {/* Display any error messages */}
      {error && (
        <div className="mt-4 text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p>
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
