import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Search from "./Search";
import { useState } from "react";

type Props = {};

export default function Table({ title, data, columns }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data,
    columns,
    // filterFns: {
    //   fuzzy: fuzzyFilter,
    // },
    state: {
      //   columnFilters,
      globalFilter,
    },
    // onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="bg-white shadow-sm rounded border border-slate-200 relative">
      <header className="flex justify-between items-center px-5 py-4">
        <h2 className="font-semibold text-slate-800 ">
          {title}
          <span className="mx-1.5 text-sm text-slate-400  font-medium">
            248
          </span>
        </h2>
        <Search
          placeholder="Search…"
          value={globalFilter}
          setValue={setGlobalFilter}
        />
      </header>
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full ">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-slate-500  bg-slate-50  border-t border-b border-slate-200 ">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px text-start"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-slate-200 ">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
