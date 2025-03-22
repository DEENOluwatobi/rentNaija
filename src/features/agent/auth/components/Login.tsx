'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { loginAgent } from '@/redux/agentSlice';
import Link from "next/link";
import { useAlert } from '@/contexts/AlertContext';

const Login: React.FC = () => {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const account_id = 2;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await dispatch(loginAgent({ email, password ,account_id})).unwrap();
      
      if (result.accountType !== "agents") {
        showAlert("Access denied. This login is for agents only. Please register as an agent or use the appropriate login page.", "error");
        return;
      }

      showAlert("Login successful. Welcome!", "success");
      navigate.push("/agents/dashboard");
    } catch (err: any) {
      showAlert(err?.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-600">
            Agent Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This login is exclusively for verified agents
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-[.9em] border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-[.9em] border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading 
                  ? 'bg-orange-400 cursor-not-allowed' 
                  : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="mb-2">Don't have an agent account?</p>
          <Link href="/agents/auth/register" className="text-orange-600 hover:text-orange-500 font-medium">
            Register as an Agent
          </Link>
          <p className="mt-4">
            Looking for customer login?{" "}
            <Link href="/auth/login" className="text-orange-600 hover:text-orange-500">
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
// 'use client';
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '@/redux/store';
// import { loginAgent } from '@/redux/agentSlice';
// import Link from "next/link";
// import { useAlert } from '@/contexts/AlertContext'; 

// const Login: React.FC = () => {
//   const { showAlert } = useAlert();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useRouter();
//   const dispatch = useDispatch<AppDispatch>();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const result = await dispatch(loginAgent({ email, password })).unwrap();
//       showAlert("Login successful. Welcome!", "success")
//       navigate.push("/agents/dashboard");
//     } catch (err: any) {
//       showAlert(err || "Login failed", "error");
//     }
//   };

//   return (
//     <div className=" flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-600">
//           Agent Login
//         </h2>
        
//         <form className="mt-8 space-y-6" onSubmit={handleLogin}>
//           <div className="rounded-md shadow-sm ">
//             <div>
//               <label htmlFor="email" className="sr-only">Email address</label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full text-[.9em] border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//             <div className="mt-4">
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full text-[.9em] border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
//             >
//               Login
//             </button>
//           </div>
//         </form>
//         <div className="text-center">
//           Don't have an account?{" "}
//           <Link href="/register" className="text-orange-600 hover:text-orange-500">
//             Register here
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;