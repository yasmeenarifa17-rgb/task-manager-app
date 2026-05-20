import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration Successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const loginUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Task Manager
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="w-full border p-3 rounded-lg mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={loginUser}
          className="w-full bg-blue-600 text-white p-3 rounded-lg mb-4"
        >
          Login
        </button>

        <button
          onClick={registerUser}
          className="w-full bg-green-600 text-white p-3 rounded-lg"
        >
          Register
        </button>
      </div>
    </div>
  );
}