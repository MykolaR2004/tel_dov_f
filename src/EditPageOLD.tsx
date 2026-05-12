import * as React from "react";
import { useEffect, useState } from "react";
import Select, { StylesConfig, components } from 'react-select';

export type TelDowPeople = {
    id: number;
    codDep: string;
    dep: string;
    subDep: string | null;
    pos: string;
    pib: string;
    nKab: string;
    tMg: string;
    tInto: string;
    tIp: string;

    idDepartment: number;
    idSubdepartment: number | null;
    idShtat: string;
};

type Department = {
    id: number;
    name: string;
};

type SubDepartment = {
    id: number;
    name: string;
};

type SelectOption = {
    value: number;
    label: string;
};

// Стили для react-select: включаем перенос текста
const selectStyles: StylesConfig<SelectOption, false> = {
    control: (base) => ({
        ...base,
        minHeight: 'auto',
        padding: '0',
        border: '1px solid #e5e7eb', // gray-300
        borderRadius: '0.375rem',     // rounded
        boxShadow: 'none',
        '&:hover': { borderColor: '#fa6060' } // hover:border-blue-400
    })
};

export default function EditPage() {

    const [rows, setRows] = useState<TelDowPeople[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<any>({});

    const [departments, setDepartments] = useState<Department[]>([]);
    const [subDeps, setSubDeps] = useState<SubDepartment[]>([]);

    useEffect(() => {
        loadData();
        loadDepartments();
    }, []);

    const loadData = () => {
        fetch("/api/contacts/edit")
            .then(res => res.json())
            .then(setRows);
    };

    const loadDepartments = () => {
        fetch("/api/contacts/departments")
            .then(res => res.json())
            .then(setDepartments);
    };

    const loadSubDeps = (depId: number) => {
        fetch(`/api/contacts/subdepartments/${depId}`)
            .then(res => res.json())
            .then(setSubDeps);
    };

    const startEdit = (row: TelDowPeople) => {
        setEditingId(row.id);
        setEditData({ ...row });
        loadSubDeps(row.idDepartment);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const saveEdit = async () => {
        await fetch(`/api/contacts/${editData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pib: editData.pib,
                nKab: editData.nKab,
                idDepartment: editData.idDepartment,
                idSubdepartment: editData.idSubdepartment
            })
        });

        setEditingId(null);
        loadData();
    };

    const groupedRows = rows.reduce((acc, item) => {
        if (!acc[item.dep]) {
            acc[item.dep] = {
                codDep: item.codDep,
                subDeps: {}
            };
        }

        const subDepKey = item.subDep ?? "__no_subdep__";

        if (!acc[item.dep].subDeps[subDepKey]) {
            acc[item.dep].subDeps[subDepKey] = {
                subDep: item.subDep,
                employees: []
            };
        }

        acc[item.dep].subDeps[subDepKey].employees.push(item);

        return acc;
    }, {} as any);

    const columns = [
        { key: "dep", header: "Відділ", width: "250px" },
        { key: "subDep", header: "Підрозділ", width: "250px" },
        { key: "pos", header: "Посада", width: "250px" },
        { key: "pib", header: "ПІБ", width: "350px" },
        { key: "nKab", header: "Кабінет", width: "100px" },
        { key: "tMg", header: "Міський", width: "150px" },
        { key: "tInto", header: "Внутрішній", width: "120px" },
        { key: "tIp", header: "IP", width: "120px" },
    ];

    // Хелперы для преобразования данных в формат react-select
    const departmentOptions: SelectOption[] = departments.map(dep => ({
        value: dep.id,
        label: dep.name
    }));

    const subDepOptions: SelectOption[] = subDeps.map(sd => ({
        value: sd.id,
        label: sd.name
    }));

    // Функция для получения текущей опции отдела
    const getSelectedDepartment = (): SelectOption | undefined => {
        return departmentOptions.find(opt => opt.value === editData.idDepartment);
    };

    // Функция для получения текущей опции подразделения
    const getSelectedSubDep = (): SelectOption | undefined => {
        return subDepOptions.find(opt => opt.value === editData.idSubdepartment);
    };

    return (
        <div className="pt-16 px-6">
            <div className="flex justify-center">
                <div className="w-full min-w-400 overflow-x-auto">

                    <table className="w-full table-fixed border border-gray-300">

                        <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} style={{ width: col.width }}
                                    className="px-4 py-2 border text-center">
                                    {col.header}
                                </th>
                            ))}
                            <th className="w-30">Дії</th>
                        </tr>
                        </thead>

                        <tbody>
                        {Object.entries(groupedRows).map(([department, depData]: any) => (
                            <React.Fragment key={department}>

                                <tr className="bg-gray-200">
                                    <td
                                        colSpan={columns.length + 1}
                                        className="px-4 py-3 font-bold text-left break-words whitespace-normal"
                                    >
                                        {depData.codDep} - {department}
                                    </td>
                                </tr>

                                {Object.entries(depData.subDeps).map(([key, subDepData]: any) => (
                                    <React.Fragment key={key}>

                                        {subDepData.subDep && (
                                            <tr className="bg-gray-100">
                                                <td
                                                    colSpan={columns.length + 1}
                                                    className="px-4 py-2 font-semibold text-left break-words whitespace-normal"
                                                >
                                                    {subDepData.subDep}
                                                </td>
                                            </tr>
                                        )}

                                        {subDepData.employees.map((emp: TelDowPeople) => (
                                            editingId === emp.id ? (
                                                <tr key={emp.id} className="bg-yellow-50">
                                                    {/* DEPARTMENT */}
                                                    <td style={{ width: columns[0].width }} className="edit-table-cell">
                                                        <div className="edit-select-wrapper">
                                                            <Select
                                                                options={departmentOptions}
                                                                value={getSelectedDepartment()}
                                                                onChange={(option) => {
                                                                    const newDepId = option?.value || null;
                                                                    setEditData({
                                                                        ...editData,
                                                                        idDepartment: newDepId,
                                                                        idSubdepartment: null
                                                                    });
                                                                    if (newDepId) loadSubDeps(newDepId);
                                                                    else setSubDeps([]);
                                                                }}
                                                                styles={selectStyles}
                                                                classNamePrefix="edit-select"
                                                                placeholder="Оберіть відділ"
                                                                noOptionsMessage={() => "Немає відділів"}
                                                                components={{
                                                                    Option: (props) => (
                                                                        <components.Option {...props}>
                        <span
                            className="edit-option-wrap"
                            title={props.data.label}
                        >
                            {props.data.label}
                        </span>
                                                                        </components.Option>
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </td>

                                                    {/* SUBDEPARTMENT */}
                                                    <td style={{ width: columns[1].width }} className="edit-table-cell">
                                                        <div className="edit-select-wrapper">
                                                            <Select
                                                                options={subDepOptions}
                                                                value={getSelectedSubDep()}
                                                                onChange={(option) => setEditData({
                                                                    ...editData,
                                                                    idSubdepartment: option?.value || null
                                                                })}
                                                                styles={selectStyles}
                                                                classNamePrefix="edit-select"
                                                                placeholder="—"
                                                                noOptionsMessage={() => "Спочатку виберіть відділ"}
                                                                isClearable
                                                                components={{
                                                                    Option: (props) => (
                                                                        <components.Option {...props}>
                        <span className="edit-option-wrap" title={props.data.label}>
                            {props.data.label}
                        </span>
                                                                        </components.Option>
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </td>

                                                    {/* POS */}
                                                    <td
                                                        style={{ width: columns[2].width }}
                                                        className="px-2 py-2 border"
                                                    >
                                                        <input
                                                            className="w-full box-border px-2 py-1 border rounded"
                                                            value={editData.pos}
                                                            onChange={e => setEditData({ ...editData, pos: e.target.value })}
                                                        />
                                                    </td>

                                                    {/* PIB */}
                                                    <td
                                                        style={{ width: columns[3].width }}
                                                        className="px-2 py-2 border"
                                                    >
                                                        <input
                                                            className="w-full box-border px-2 py-1 border rounded"
                                                            value={editData.pib}
                                                            onChange={e => setEditData({ ...editData, pib: e.target.value })}
                                                        />
                                                    </td>

                                                    <td
                                                        style={{ width: columns[4].width }}
                                                        className="px-2 py-2 border text-center"
                                                    >
                                                        {emp.nKab}
                                                    </td>

                                                    <td
                                                        style={{ width: columns[5].width }}
                                                        className="px-2 py-2 border text-center"
                                                    >
                                                        {emp.tMg}
                                                    </td>

                                                    <td
                                                        style={{ width: columns[6].width }}
                                                        className="px-2 py-2 border text-center"
                                                    >
                                                        {emp.tInto}
                                                    </td>

                                                    <td
                                                        style={{ width: columns[7].width }}
                                                        className="px-2 py-2 border text-center"
                                                    >
                                                        {emp.tIp}
                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td>
                                                        <button onClick={saveEdit}>💾</button>
                                                        <button onClick={cancelEdit}>❌</button>
                                                    </td>

                                                </tr>
                                            ) : (
                                                <tr key={emp.id}>

                                                    {columns.map(col => (
                                                        <td
                                                            key={col.key}
                                                            style={{ width: col.width }}
                                                            className="px-2 py-2 border break-words whitespace-normal"
                                                        >
                                                            {emp[col.key as keyof TelDowPeople]}
                                                        </td>
                                                    ))}

                                                    <td className="px-2 py-2 border text-center">
                                                        <button onClick={() => startEdit(emp)}>✏️</button>
                                                    </td>
                                                </tr>
                                            )
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
