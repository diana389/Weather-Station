"use client";
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "@/app/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database"; // Realtime Database imports
import SignupWithPassword from "../SignupWithPassword";
import database from "@/app/firebaseConfig"; // Import Realtime Database

export default function Signup() {
  const [formData, setFormData] = useState<{ name: string; email: string; password: string; gender: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle form submission with Firebase signup
  const handleFormSubmit = async (data: { name: string; email: string; password: string; gender: string }) => {
    setLoading(true);
    setError(null); // Reset error before submission

    const { name, email, password, gender } = data;

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed up:", user);

      // After signing up, store additional data (name and gender) in Realtime Database
      await set(ref(database, "users/" + user.uid), { // Using Realtime Database path
        name,
        email,
        gender,
        createdAt: new Date().toISOString() // Save timestamp as string
      });

      setFormData(data); // Store the form data after successful signup
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message); // Set error message to display
        console.log(`Error signing up: ${error.name} - ${error.message}`);
      } else {
        setError("An unknown error occurred.");
        console.log("Unknown error occurred during signup");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <div>
        <SignupWithPassword onSubmit={handleFormSubmit} />
      </div>

      {/* Display the form data after successful submission */}
      {formData && (
        <div>
          <h3>Form Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}

      {/* Display error message if signup fails */}
      {error && (
        <div className="text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Show loading state */}
      {loading && <div>Loading...</div>}

      <div className="mt-6 text-center">
        <p>
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
