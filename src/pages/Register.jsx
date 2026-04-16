import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/register", form);
      alert("Registered successfully");
      navigate("/");
    } catch {
      alert("User already exists");
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center">
      <div className="auth-card p-4">
        <h3 className="text-center mb-4">📝 Register</h3>

        <input
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn btn-success w-100" onClick={handleRegister}>
          Register
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;