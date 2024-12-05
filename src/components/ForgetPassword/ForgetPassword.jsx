import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = (e) => {
    e.preventDefault();
    // Placeholder for password reset logic
    toast.success("Password reset link has been sent to your email");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <ToastContainer />
        <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="block mb-2">
              Enter your email to reset your password
            </label>
            <input
              type="email"
              id="email"
              className="form-control p-3 rounded border border-gray-300 w-full"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-block p-3 rounded bg-primary hover:bg-green-400 hover:text-black text-white font-semibold"
           style={{color:"white"}}
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;



// import React from 'react';

// const ForgotPassword = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
//         <p className="mb-4">Enter your email address to reset your password.</p>
//         <form>
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full mb-4 p-3 rounded border border-primary outline-none"
//           />
//           <button
//             type="submit"
//             className="w-full bg-green-500 text-white p-3 rounded"
//             style={{color:"white"}}
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
