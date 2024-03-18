import { useState } from "react";
import logo from "../assets/img/logo.png";
import logoBumn from "../assets/img/logo-bumn.png";
import logoKopri from "../assets/img/logo-kopri.svg";
import logoBri from "../assets/img/logo-bri.png";
import axios from "axios";
import Swal from "sweetalert2";
import { LoaderCircle } from "lucide-react";
import _ from "lodash";

type Props = {};
export default function FormRegistrasiPage({}: Props) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const generateUniqueCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let code = "";

    // Generate 4 random letters
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Generate 4 random numbers
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    // Shuffle the code to mix letters and numbers
    code = code
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    return code;
  };

  const handleRegistrasi = async () => {
    setIsLoading(true);
    const query = {
      query: `mutation {
          createTransaction(createTransactionInput: {
              mobile: "${formData.no_telepon ?? ""}",
              isWinner: false,
              uniqueCode: "${generateUniqueCode()}",
              branch: "${formData.satker ?? ""}"
          }, createUserInput: {
              userName: "${formData.nama ?? ""}"
              displayName: "${formData.nama ?? ""}"
              status: ACTIVE
          }) {
              id
              user {
                  id
                  userName
                  displayName
                  type
                  status
                  createdAt
                  updatedAt
                  deletedAt
              }
              mobile
              isWinner
              uniqueCode
              branch
              createdAt
              updatedAt
              deletedAt
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
        let data = res.data;
        if (_.has(data, "errors")) {
          const error = data?.errors[0]?.message;
          Swal.fire({
            title: `Error`,
            icon: "error",
            text: `${error}`,
          });
        } else {
          data = data.data?.createTransaction;
          Swal.fire({
            title: `Kode Unik <strong>${data.uniqueCode}</strong>`,
            icon: "success",
            html: `
            <p>
              Hallo ${data?.user?.displayName}, Berikut kode unik anda
              <b>${data.uniqueCode}</b>,
              screenshoot kode unik ini
            </p>
  `,
          });
        }
      });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center items-center space-x-2">
          <img className=" h-6 w-auto" src={logoBumn} alt="BUMN" />
          {/* <img className="mx-auto h-10 w-auto" src={logo} alt="BKN" />
          <img className="mx-auto h-10 w-auto" src={logoKopri} alt="Kopri" /> */}
          <img className=" h-8 w-auto" src={logoBri} alt="BRI" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Registrasi Partisipan
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              NAMA LENGKAP
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
                    nama: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              NOMOR TELEPON
            </label>
            <div className="mt-2">
              <input
                id="no-telepon"
                name="no-telepon"
                type="text"
                required
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    no_telepon: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              UNIT / SATUAN / CABANG
            </label>
            <div className="mt-2">
              <input
                id="satker-bkn"
                name="satker-bkn"
                type="text"
                required
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    satker: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <button
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-slate-300"
              onClick={() => handleRegistrasi()}
              disabled={
                !formData.nama ||
                !formData.no_telepon ||
                !formData.satker ||
                isLoading
              }
            >
              {isLoading && (
                <span className="mx-2">
                  <LoaderCircle className="animate-spin" />
                </span>
              )}
              Registrasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
