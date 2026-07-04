import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Bot, LogIn } from "lucide-react";
import { getApiError } from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isBootstrapping) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader label="Loading MyGPT" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      navigate("/");
    } catch (apiError) {
      setError(getApiError(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-zinc-100">
      <section className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900/95 p-6 shadow-soft">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-emerald-400 text-zinc-950">
            <Bot size={24} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">MyGPT</h1>
            <p className="text-sm text-zinc-400">Welcome back</p>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">Email</span>
            <input
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-400"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">Password</span>
            <input
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-400"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader size="sm" /> : <LogIn size={18} aria-hidden="true" />}
            <span>Log in</span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          New here?{" "}
          <Link className="font-medium text-emerald-300 hover:text-emerald-200" to="/signup">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;

