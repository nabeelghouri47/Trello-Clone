import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  // AuthContext mein se login function use karna
  const { login } = useContext(AuthContext); 
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setIsLoading(true);
    try {
      await login(form);
      nav("/boards"); 
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed. Check server console or credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 bg-gray-50">
      
      <h1 className="text-3xl font-bold text-[#026AA7] mb-6 tracking-wide">
        Trello Clone
      </h1>
      
      <form 
        onSubmit={submit} 
        className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 w-full max-w-sm"
      >
        <h2 className="text-xl font-medium text-center mb-6 text-gray-700">
          Log in to Trello Clone
        </h2>

        {err && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm font-medium border border-red-300">{err}</div>}

        <input
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="Enter email"
          type="email"
          required
          className="w-full p-2.5 border border-gray-300 mb-3 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />

        <input
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="Enter password"
          required
          className="w-full p-2.5 border border-gray-300 mb-4 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />

        <button 
          className={`w-full py-2 rounded-md font-semibold transition duration-150 ease-in-out ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#5aac44] hover:bg-[#519839] text-white'
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>

        <div className="mt-6 text-center text-sm">
          <hr className="my-6 border-gray-300" />
          
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 hover:underline">
            Sign up for an account
          </Link>
        </div>
      </form>
    </div>
  );
}