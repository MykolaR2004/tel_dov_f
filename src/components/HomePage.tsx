import * as React from "react";
import {
    createColumnHelper
} from "@tanstack/react-table";
import {useEffect, useState} from "react";

export type TelDowPeople = {
    cod_dep: string;
    dep: string;
    sub_dep: string;
    pos: string;
    pib: string;
    n_kab: string;
    t_mg: string;
    t_into: string;
    t_ip: string;
};

const columnHelper = createColumnHelper<TelDowPeople>();

export default function HomePage() {
    const [rows, setRows] = useState<TelDowPeople[]>([]);

    useEffect(() => {
        fetch("/api/contacts")
            .then(res => {
                if (!res.ok) throw new Error("Data load error");
                return res.json();
            })
            .then(data => setRows(data))
            .catch(err => console.error(err));

    }, []);

    const groupedRows = rows.reduce((acc, item) => {
        if (!acc[item.dep]) {
            acc[item.dep] = {
                cod_dep: item.cod_dep,
                subDeps: {}
            };
        }

        const subDepKey = item.sub_dep ?? "__no_subdep__";

        if (!acc[item.dep].subDeps[subDepKey]) {
            acc[item.dep].subDeps[subDepKey] = {
                sub_dep: item.sub_dep,
                employees: []
            };
        }

        acc[item.dep].subDeps[subDepKey].employees.push(item);

        return acc;
    }, {} as Record<
        string,
        {
            cod_dep: string;
            subDeps: Record<
                string,
                {
                    sub_dep: string | null;
                    employees: TelDowPeople[];
                }
            >;
        }
    >);

    type Column = {
        key: keyof TelDowPeople;
        header: string;
        width: string;
    };

    const columns: Column[] = [
        { key: "pos", header: "Посада", width: "300px" },
        { key: "pib", header: "ПІБ", width: "400px" },
        { key: "n_kab", header: "Кабінет", width: "90px" },
        { key: "t_mg", header: "Міський", width: "200px" },
        { key: "t_into", header: "Внутрішній", width: "120px" },
        { key: "t_ip", header: "IP", width: "120px" },
    ];

    return (
        <div className="pt-0 px-6">
            <div className="flex justify-center">
                <div
                    className="w-full max-w-7xl overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm"
                    style={{ maxHeight: 'calc(100vh - 100px)' }} // Высота = экран минус хедер + отступы
                >
                    <table className="my-table w-full">
                        <thead className="sticky top-0 z-30 bg-gray-50 border-b-2 border-gray-300 shadow-sm">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    style={{ width: col.width }}
                                    className="px-4 py-3 text-center font-semibold whitespace-nowrap"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {Object.entries(groupedRows).map(([department, depData]) => (
                            <React.Fragment key={department}>
                                <tr>
                                    <td colSpan={columns.length} className="table-dept">
                                        {depData.cod_dep} - {department}
                                    </td>
                                </tr>
                                {Object.entries(depData.subDeps).map(([key, subDepData]) => (
                                    <React.Fragment key={key}>
                                        {subDepData.sub_dep && (
                                            <tr>
                                                <td colSpan={columns.length} className="table-subdept">
                                                    {subDepData.employees[0].cod_dep} — {subDepData.sub_dep}
                                                </td>
                                            </tr>
                                        )}
                                        {subDepData.employees.map((employee) => (
                                            <tr key={employee.pib}>
                                                {columns.map((col) => (
                                                    <td key={col.key} style={{ width: col.width }}>
                                                        {employee[col.key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}