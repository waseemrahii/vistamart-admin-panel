import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Layout/header/Header.jsx";
import LoginPage from "./components/LoginPage/LoginPage";
import Footer from "./components/Layout/footer/footer.jsx";
import { RiMenuUnfold3Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/slices/admin/authSlice"; // Adjust the import path if necessary
import AllRoutes from "./Routes.jsx";
import "./App.css";
import Sidebar from "./components/Layout/sidebar/sidebar.jsx";
import LoadingSpinner from "./components/LoodingSpinner/LoadingSpinner.jsx";
import ForgotPassword from "./components/ForgetPassword/forgetPassword.jsx";
import ResetPassword from "./components/ForgetPassword/ResetPassword.jsx";
import { ColorScheam } from "./utils/ColorScheam.js";
import ForgotPasswordViaPhone from "./components/ForgetPassword/ForgotPasswordViaPhone.jsx";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Local loading state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const initializeColors = async () => {
      await ColorScheam();
      setLoading(false); // Finish loading after colors are applied
    };

    initializeColors();
  }, []);
  useEffect(() => {
    // Check for authentication on mount
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // User is logged in
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser); // Set user data from local storage
    }
    setLoading(false); // Finished loading
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };
  if (loading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    ); // Show a loading state

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          {isLoggedIn ? (
            <>
              <Header user={user} handleLogout={handleLogout} />

              <div className="flex flex-1">
                <div
                  className={`fixed inset-0 z-30 ${
                    isSidebarOpen ? "block" : "hidden"
                  } lg:block lg:relative lg:w-2/12`}
                >
                  <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={toggleSidebar}
                  ></div>
                  <Sidebar toggleSidebar={toggleSidebar} />
                </div>
                <main className="flex-1 lg:w-10/12 md:ml-5 overflow-hidden px-3 py-6">
                  <button className="p-4 lg:hidden" onClick={toggleSidebar}>
                    {isSidebarOpen ? (
                      "Close"
                    ) : (
                      <RiMenuUnfold3Fill className="text-[1rem] h-6 w-6 mt-5 font-semibold" />
                    )}
                  </button>
                  <AllRoutes />
                  <Footer />
                </main>
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/forgot-password-sms" element={<ForgotPasswordViaPhone />} />
              <Route
                path="/auth/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/login"
                element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
              />

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
