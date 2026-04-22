"use client";

import * as React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";
import type { UserProps } from "@/lib/types/UserProps";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserTableProps {
    users?: UserProps[] | null;
}

export default function UserTable({ users }: UserTableProps) {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<any>([] as any);
    const [filter, setFilter] = React.useState("");
    const [deletingId, setDeletingId] = React.useState<number | null>(null);
    const [pageSize, setPageSize] = React.useState(10);

    const data = React.useMemo<UserProps[]>(() => (Array.isArray(users) ? users : []), [users]);

    async function handleDelete(id: number) {
        if (!confirm("Confirmer la suppression de cet utilisateur ?")) return;
        try {
            setDeletingId(id);
            const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Erreur lors de la suppression.");
            }
            router.refresh();
        } catch (e: any) {
            alert(e.message ?? "Erreur interne.");
        } finally {
            setDeletingId(null);
        }
    }

    const columns = React.useMemo<ColumnDef<UserProps>[]>(
        () => [
            {
                accessorKey: "icone",
                header: "",
                cell: ({ row }) => (
                    <img
                        src={
                            row.original.icone
                                ? `data:image/jpeg;base64,${row.original.icone}`
                                : "/assets/defaultProfilPicture.webp"
                        }
                        alt={`${row.original.firstName} ${row.original.lastName}`}
                        className="h-8 w-8 rounded-full object-cover"
                    />
                ),
            },
            {
                accessorKey: "firstName",
                header: ({ column }) => (
                    <button
                        type="button"
                        className="inline-flex items-center gap-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Prénom <ArrowUpDown className="h-4 w-4" />
                    </button>
                ),
                cell: ({ row }) => row.original.firstName ?? "",
            },
            {
                accessorKey: "lastName",
                header: ({ column }) => (
                    <button
                        type="button"
                        className="inline-flex items-center gap-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Nom <ArrowUpDown className="h-4 w-4" />
                    </button>
                ),
                cell: ({ row }) => row.original.lastName ?? "",
            },
            { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email ?? "" },
            { accessorKey: "role", header: "Rôle", cell: ({ row }) => row.original.role ?? "" },
            {
                accessorKey: "dob",
                header: "Date de naissance",
                cell: ({ row }) => {
                    const d = new Date(row.original.dob as any);
                    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR");
                },
            },
            {
                accessorKey: "createdAt",
                header: "Créé le",
                cell: ({ row }) => {
                    const d = new Date(row.original.createdAt as any);
                    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR");
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push(`/profil/edit/${user.id}`)}
                                className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100">
                                <Edit className="inline-block h-4 w-4 text-blue-500" />
                            </button>
                            <button
                                onClick={() => handleDelete(user.id)}
                                disabled={deletingId === user.id}
                                className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-50">
                                {deletingId === user.id ? (
                                    <span className="text-gray-400">...</span>
                                ) : (
                                    <Trash2 className="inline-block h-4 w-4 text-red-500" />
                                )}
                            </button>
                        </div>
                    );
                },
            },
        ],
        [deletingId, router]
    );

    const filtered = React.useMemo(() => {
        const q = filter.toLowerCase();
        return data.filter(
            (u) =>
                (u.firstName ?? "").toLowerCase().includes(q) ||
                (u.lastName ?? "").toLowerCase().includes(q) ||
                (u.email ?? "").toLowerCase().includes(q)
        );
    }, [data, filter]);

    const table = useReactTable({
        data: filtered,
        columns,
        state: {
            sorting,
            pagination: {
                pageIndex: 0,
                pageSize,
            },
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    React.useEffect(() => {
        table.setPageSize(pageSize);
    }, [pageSize, table]);

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="font-oswald text-2xl font-semibold">Utilisateurs</h1>
                <div className="flex items-center gap-2">
                    <input
                        placeholder="Rechercher..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-60 rounded border px-3 py-2"
                    />
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="rounded border px-2 py-2 text-sm"
                        aria-label="Lignes par page">
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>
                                {n} / page
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-md border bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th key={header.id} className="px-4 py-2 font-medium text-gray-700">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-t">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-4 py-6 text-center text-gray-500" colSpan={columns.length}>
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
                    <div>
                        Page <strong>{table.getState().pagination.pageIndex + 1}</strong> sur{" "}
                        <strong>{table.getPageCount() || 1}</strong> — {filtered.length} au total
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="rounded border px-2 py-1 disabled:opacity-50"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}>
                            «
                        </button>
                        <button
                            className="rounded border px-2 py-1 disabled:opacity-50"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}>
                            Précédent
                        </button>
                        <button
                            className="rounded border px-2 py-1 disabled:opacity-50"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}>
                            Suivant
                        </button>
                        <button
                            className="rounded border px-2 py-1 disabled:opacity-50"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}>
                            »
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
