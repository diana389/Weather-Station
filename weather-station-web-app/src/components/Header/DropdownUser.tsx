import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, onValue, ref } from "firebase/database";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import database, { auth } from "@/app/firebaseConfig"; // Import auth and database configuration

const DropdownUser = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userGender, setUserGender] = useState("other");
  const [userEmail, setUserEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch all users from the database
  const fetchAllUsers = async () => {
    try {
      const usersRef = ref(database, "users"); // Path to all users in the database
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Returns all user data
      } else {
        console.log("No users found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  };

  // Match logged-in user with a user from the database by email
  const matchUserByEmail = (users: any, email: string) => {
    for (let userId in users) {
      if (users[userId].email === email) {
        return userId; // Return the user ID
      }
    }
    return null;
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || "No email available");
        setIsSignedIn(true);

        // Fetch all users and match by email
        const users = await fetchAllUsers();
        if (users) {
          const userId = matchUserByEmail(users, user.email || "");

          if (userId) {
            setUserName(users[userId].name || "User");
            setUserGender(users[userId].gender || "other");
            console.log("User data:", users[userId]);
          } else {
            console.log("User not found in database");
            setUserName("User");
            setUserGender("other");
          }
        }
      } else {
        setIsSignedIn(false);
        setUserName("Guest");
        setUserEmail("");
      }
    });

    // Fetch user data in real-time when the user is signed in
    const userRef = ref(database, "users");
    onValue(userRef, async (snapshot) => {
      if (isSignedIn) {
        const users = snapshot.val();
        if (users) {
          const userId = matchUserByEmail(users, userEmail);
          if (userId) {
            setUserName(users[userId].name || "User");
            setUserGender(users[userId].gender || "other");
          }
        }
      }
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, [isSignedIn, userEmail]);

  // Handle sign-out
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase signOut function
      setIsSignedIn(false);
      setUserName("Guest");
      setUserEmail("");
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getProfileImage = () => {
    if (!isSignedIn) {
      return "/images/user/default-avatar.png";
    }
    switch (userGender) {
      case "female":
        return "/images/user/woman-icon.png";
      case "male":
        return "/images/user/man-icon.png";
      default:
        return "/images/user/default-avatar.png";
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={getProfileImage()}
            style={{
              width: "auto",
              height: "auto"
            }}
            alt="User"
            className="overflow-hidden rounded-full"
          />
        </span>

        <span className="flex items-center gap-2 font-medium text-dark dark:text-dark-6">
          <span className="hidden lg:block">{userName}</span>

          <svg
            className={`fill-current duration-200 ease-in ${dropdownOpen && "rotate-180"}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.6921 7.09327C3.91674 6.83119 4.3113 6.80084 4.57338 7.02548L9.99997 11.6768L15.4266 7.02548C15.6886 6.80084 16.0832 6.83119 16.3078 7.09327C16.5325 7.35535 16.5021 7.74991 16.24 7.97455L10.4067 12.9745C10.1727 13.1752 9.82728 13.1752 9.59322 12.9745L3.75989 7.97455C3.49781 7.74991 3.46746 7.35535 3.6921 7.09327Z"
            />
          </svg>
        </span>
      </Link>

      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
            <span className="relative block h-12 w-12 rounded-full">
              <Image
                width={112}
                height={112}
                src={getProfileImage()}
                style={{
                  width: "auto",
                  height: "auto"
                }}
                alt="User"
                className="overflow-hidden rounded-full"
              />
            </span>

            <span className="block">
              <span className="block font-medium text-dark dark:text-white">
                {userName}
              </span>
              <span className="block font-medium text-dark-5 dark:text-dark-6">
                {userEmail}
              </span>
            </span>
          </div>
          <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
            <li>
              {isSignedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.00001 1.0625C5.44758 1.0625 2.4375 4.07258 2.4375 7.625C2.4375 11.1774 5.44758 14.1875 9.00001 14.1875C12.5524 14.1875 15.5625 11.1774 15.5625 7.625C15.5625 4.07258 12.5524 1.0625 9.00001 1.0625ZM9.00001 12.1875C6.35035 12.1875 4.0625 9.89964 4.0625 7.625C4.0625 5.35035 6.35035 3.0625 9.00001 3.0625C11.6497 3.0625 13.9375 5.35035 13.9375 7.625C13.9375 9.89964 11.6497 12.1875 9.00001 12.1875Z"
                    />
                  </svg>
                  <span>Log out</span>
                </button>
              ) : (
                <Link
                  href="/auth/signin" // Link to your login page
                  className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.00001 1.0625C5.44758 1.0625 2.4375 4.07258 2.4375 7.625C2.4375 11.1774 5.44758 14.1875 9.00001 14.1875C12.5524 14.1875 15.5625 11.1774 15.5625 7.625C15.5625 4.07258 12.5524 1.0625 9.00001 1.0625ZM9.00001 12.1875C6.35035 12.1875 4.0625 9.89964 4.0625 7.625C4.0625 5.35035 6.35035 3.0625 9.00001 3.0625C11.6497 3.0625 13.9375 5.35035 13.9375 7.625C13.9375 9.89964 11.6497 12.1875 9.00001 12.1875Z"
                    />
                  </svg>
                  <span>Log in</span>
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
