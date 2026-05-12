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
        <div className="pt-16 px-6">
            <div className="flex justify-center">
                <div className="w-full max-w-7xl overflow-x-auto">

                    <table className="w-full table-fixed border border-gray-300 rounded-lg overflow-hidden shadow-sm">

                        {/* Едина шапка таблиці */}
                        <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    style={{ width: col.width }}
                                    className="px-4 py-3 border-b border-gray-300 text-center"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody className="px-4 py-2 border-r border-gray-800 bg-white divide-y divide-gray-800">
                        {Object.entries(groupedRows).map(([department, depData]) => (
                            <React.Fragment key={department}>

                                {/* Заголовок відділу */}
                                <tr className="bg-gray-200">
                                    <td colSpan={columns.length}
                                        className="px-4 py-3 font-bold text-left">
                                        {depData.cod_dep} - {department}
                                    </td>
                                </tr>

                                {Object.entries(depData.subDeps).map(([key, subDepData]) => (
                                    <React.Fragment key={key}>

                                        {/* Заголовок підрозділу */}
                                        {subDepData.sub_dep && (
                                            <tr className="bg-gray-100">
                                                <td colSpan={columns.length} className="px-4 py-2 font-semibold text-left">
                                                    {subDepData.employees[0].cod_dep} — {subDepData.sub_dep}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Сотрудники */}
                                        {subDepData.employees.map((employee) => (
                                            <tr
                                                key={employee.pib}
                                                className="hover:bg-blue-100 transition-colors"
                                            >
                                                {columns.map((col) => (
                                                    <td
                                                        key={col.key}
                                                        style={{ width: col.width }}
                                                        className="px-4 py-2 text-center"
                                                    >
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