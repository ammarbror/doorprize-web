import { useState } from "react";
import logo from "../assets/img/logo.png";
import logoBumn from "../assets/img/logo-bumn.png";
import logoKopri from "../assets/img/logo-kopri.svg";
import logoBri from "../assets/img/logo-bri.png";
import axios from "axios";
import Swal from "sweetalert2";
import { LoaderCircle } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import _ from "lodash";

type Props = {};
export default function LoginPage() {
  const user = JSON.parse(localStorage.getItem("doorprize_app_user") ?? "{}");

  const navigation = useNavigate();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const generateUniqueCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let code = "";

    // Generate 4 random letters
    for (let i = 0; i < 4; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Generate 4 random numbers
    for (let i = 0; i < 4; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    // Shuffle the code to mix letters and numbers
    code = code
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    return code;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const query = {
      query: `mutation {
        login(userName: "${formData.userName}", password: "${formData.password}") {
            id
            displayName
        }
    }`,
      variables: {},
    };
    await axios
      .post(`${import.meta.env.VITE_BASE_URL_API}/graphql`, query, {
        headers: {
          "Content-Type": "application/json",
          Authorization: import.meta.env.VITE_AUTH_TOKEN,
        },
      })
      .then((res) => {
        const data = res.data.data.login;
        if (!_.isEmpty(data)) {
          localStorage.setItem("doorprize_app_user", JSON.stringify(data));
          navigation("/admin/data-peserta");
        }
      });
    setIsLoading(false);
  };

  if (!_.isEmpty(user)) {
    return <Navigate to="/admin/data-peserta" replace />;
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center items-center space-x-3">
          <img className="h-6 w-auto" src={logoBumn} alt="BUMN" />
          {/* <img className="mx-auto h-10 w-auto" src={logo} alt="BKN" />
          <img className="mx-auto h-10 w-auto" src={logoKopri} alt="Kopri" /> */}
          <img className="h-8 w-auto" src={logoBri} alt="BRI" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Login Akun
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="nama"
                name="nama"
                type="text"
                required
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    userName: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <button
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-slate-300"
              onClick={() => handleLogin()}
              disabled={!formData.userName || !formData.password || isLoading}
            >
              {isLoading && (
                <span className="mx-2">
                  <LoaderCircle className="animate-spin" />
                </span>
              )}
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
