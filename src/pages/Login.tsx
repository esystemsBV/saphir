import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo";
import Error from "@/components/ui/Error";
import LoadingLogo from "@/components/others/LoadingLogo";
import { def } from "@/data/Links";
import axios from "axios";

export default function LoginPage() {
  axios.defaults.withCredentials = true;

  const [loginInfos, setLoginInfos] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const navigate = useNavigate();

  if (loading) return <LoadingLogo />;

  const submitLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${def}/auth/login`, loginInfos, {
        withCredentials: true,
        withXSRFToken: true,
      });
      if (response.data.success) {
        navigate("/");
      } else {
        setError("Erreur veuillez entrer des informations valides!");
      }
    } catch (error) {
      setError("Erreur veuillez entrer des informations valides!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLoginInfos((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <section className="flex items-center justify-center h-screen flex-col">
      <Logo className="w-36 text-main" />
      <div className="py-6 space-y-4 md:space-y-6 sm:py-8">
        <h1 className="text-3xl text-center font-bold">
          Ravis de vous revoir!
        </h1>
        <form onSubmit={submitLogin} className="space-y-4 md:space-y-6 w-full">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Votre email
            </label>
            <input
              type="email"
              value={loginInfos.email}
              onChange={handleChange}
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="nom@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Votre mot de passe
            </label>
            <input
              type="password"
              value={loginInfos.password}
              onChange={handleChange}
              name="password"
              placeholder="•••••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required
            />
          </div>

          {error && <Error color="red" title={error} />}
          <button
            type="submit"
            className="w-full mt-5 text-white bg-main py-2.5 duration-300 hover:opacity-70 rounded-lg"
          >
            {"Se connecter"}
          </button>
        </form>
      </div>
    </section>
  );
}
