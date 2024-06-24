import React, { useEffect, useMemo, useState } from "react";
import SidebarLayout from "../layout/SidebarLayout";
import Search from "../components/Search";
import Table from "../components/Table";
import axios from "axios";
import moment from "moment";

type Props = {};

export default function DataPesertaPage({}: Props) {
  const columns = useMemo(
    () => [
      {
        header: "Nama",
        accessorKey: "user.displayName",
        cell: ({ getValue }) => <div>{getValue() ?? "-"}</div>,
      },
      {
        header: "No Telepon",
        accessorKey: "mobile",
        cell: ({ getValue }) => <div>{getValue() ?? "-"}</div>,
      },
      {
        header: "Satuan Kerja",
        accessorKey: "branch",
        cell: ({ getValue }) => <div>{getValue() ?? "-"}</div>,
      },
      {
        header: "Winner",
        accessorKey: "isWinner",
        cell: ({ getValue }) => <div>{getValue() ? "win" : "-"}</div>,
      },
      {
        header: "Tanggal Daftar",
        accessorKey: "createdAt",
        cell: ({ getValue }) => (
          <div>
            {getValue() ? moment(getValue()).format("DD-MM-YYYY HH:mm") : "-"}
          </div>
        ),
      },
      {
        header: "Kode Unik",
        accessorKey: "uniqueCode",
        cell: ({ getValue }) => <div>{getValue() ?? "-"}</div>,
      },
      {
        header: "Aksi",
        accessorKey: "aksi",
        cell: ({ getValue, row }) => (
          <div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:bg-slate-400"
              onClick={async () => DeletePeserta(row.original.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    GetDataPeserta();
  }, []);

  function GetDataPeserta() {
    const query = {
      query: `query {
        transactions(userId: null, mobile: null, isWinner: null, uniqueCode: null, branch: null, startAt: null, endAt: null, offset: 0, limit: 0) {
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
    axios
      .post(`${import.meta.env.VITE_BASE_URL_API}/graphql`, query, {
        headers: {
          "Content-Type": "application/json",
          Authorization: import.meta.env.VITE_AUTH_TOKEN,
        },
      })
      .then((res) => {
        setData(res.data.data.transactions);
      });
  }

  function DeletePeserta(id) {
    const data = JSON.stringify({
      query: `mutation($id: String!) {
        removeTransaction(id: $id)
}`,
      variables: { id },
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_BASE_URL_API}/graphql`,
      headers: {
        "Content-Type": "application/json",
        Authorization: import.meta.env.VITE_AUTH_TOKEN,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        GetDataPeserta();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <SidebarLayout>
      <>
        <Table title="Data Peserta" columns={columns} data={data} />
      </>
    </SidebarLayout>
  );
}
