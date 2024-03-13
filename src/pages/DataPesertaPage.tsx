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
        cell: ({ getValue }) => <div>{getValue() ?? "-"}</div>,
      },
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <SidebarLayout>
      <>
        <Table title="Data Peserta" columns={columns} data={data} />
      </>
    </SidebarLayout>
  );
}
