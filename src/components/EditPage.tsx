import * as React from "react";
import AuthGuard from "./AuthGuard";
import { useEffect, useState } from "react";
import Select, { StylesConfig, components } from 'react-select';
import { useNavigate } from "react-router-dom";

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

type Department = { id: number; name: string };
type SubDepartment = { id: number; name: string };
type Position = { id: string; name: string };

type SelectNumOption = { value: number; label: string };   // для отделов/подразделений
type SelectStrOption = { value: string; label: string };   // для должностей

const selectStyles: StylesConfig<any, false> = {
    control: (base, state) => ({
        ...base,
        minHeight: 'auto',
        padding: '0 2px',
        border: state.isFocused ? '1px solid #3b82f6' : '1px solid #d1d5db',
        borderRadius: '0.375rem',
        boxShadow: state.isFocused ? '0 0 0 3px rgb(59 130 246 / 0.2)' : 'none',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: '#9ca3af' },
        fontFamily: "'Montserrat', serif"
    }),
    menu: (base) => ({
        ...base,
        zIndex: 99999,
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
    menuList: (base) => ({
        ...base,
        maxHeight: 240,
        overflowY: 'auto',
    }),
    option: (base, state) => ({
        ...base,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        cursor: 'pointer',
        backgroundColor: state.isFocused ? 'rgb(59 130 246 / 0.08)' : 'transparent',
        color: state.isSelected ? '#0e71b9' : state.isFocused ? '#3b82f6' : '#191516',
        fontWeight: state.isSelected ? 600 : 400,
    }),
};



export default function EditPage() {
    const navigate = useNavigate();

    const [rows, setRows] = useState<TelDowPeople[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<TelDowPeople>>({});
    const [isCreating, setIsCreating] = useState(false);

    const [departments, setDepartments] = useState<Department[]>([]);
    const [subDeps, setSubDeps] = useState<SubDepartment[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);

    useEffect(() => {
        void loadData();
        void loadDepartments();
        void loadPositions();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetch("/api/contacts/edit").then(r => r.json());
            setRows(data);
        } catch (err) {
            console.error('Load error:', err);
        }
    };

    const loadDepartments = async () => {
        try {
            const data = await fetch("/api/contacts/departments").then(r => r.json());
            setDepartments(data);
        } catch (err) { console.error(err); }
    };

    const loadSubDeps = async (depId: number) => {
        try {
            const data = await fetch(`/api/contacts/subdepartments/${depId}`).then(r => r.json());
            setSubDeps(data);
        } catch (err) { console.error(err); }
    };

    const loadPositions = async () => {
        try {
            const data = await fetch("/api/contacts/positions").then(r => r.json());
            setPositions(data);
        } catch (err) { console.error(err); }
    };

    const startEdit = (row: TelDowPeople) => {
        setEditingId(row.id);
        setEditData({ ...row });
        void loadSubDeps(row.idDepartment);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsCreating(false);
        setEditData({});
        setSubDeps([]);
    };

    const saveEdit = async () => {
        try {
            const payload = {
                pib: editData.pib ?? "",
                nKab: editData.nKab ?? "",
                tMg: editData.tMg ?? "",
                tInto: editData.tInto ?? "",
                tIp: editData.tIp ?? "",
                idDepartment: editData.idDepartment ?? null,
                idSubdepartment: editData.idSubdepartment ?? null,
                idShtat: editData.idShtat ?? ""
            };

            const res = await fetch(`/api/contacts/${editData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`Server error ${res.status}: ${errorText}`);
                alert(`Не вдалося зберегти: ${res.status}`);
                return;
            }

            setEditingId(null);
            await loadData();
        } catch (err: any) {
            console.error('Save error:', err.message);
            alert(`Не вдалося зберегти: ${err.message}`);
        }
    };

    const startCreate = () => {

        setEditingId(null);

        setIsCreating(true);

        setEditData({
            pib: "",
            nKab: "",
            tMg: "",
            tInto: "",
            tIp: "",
            idDepartment: undefined,
            idSubdepartment: null,
            idShtat: ""
        });

        setSubDeps([]);
    };

    const createEmployee = async () => {

        try {

            const payload = {
                pib: editData.pib ?? "",
                nKab: editData.nKab ?? "",
                tMg: editData.tMg ?? "",
                tInto: editData.tInto ?? "",
                tIp: editData.tIp ?? "",
                idDepartment: editData.idDepartment ?? null,
                idSubdepartment: editData.idSubdepartment ?? null,
                idShtat: editData.idShtat ?? ""
            };

            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            if (!res.ok) {

                const errorText = await res.text();

                throw new Error(errorText);
            }

            setIsCreating(false);

            setEditData({});

            await loadData();

        } catch (err: any) {

            console.error(err);

            alert(`Не вдалося створити співробітника: ${err.message}`);
        }
    };

    const deleteEmployee = async (id: number) => {
        if (!window.confirm(`Ви дійсно хочете видалити співробітника з ID ${id}?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/contacts/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server error ${res.status}: ${errorText}`);
            }

            // Перезавантаження сторінки
            await loadData();

            if (editingId === id) {
                cancelEdit();
            }
        } catch (err: any) {
            console.error('Delete error:', err.message);
            alert(`Не вдалося видалити: ${err.message}`);
        }
    };

    const moveEmployee = async (id: number, direction: 'up' | 'down') => {
        try {
            console.log(`Moving employee ${id} ${direction}...`);

            const res = await fetch(`/api/contacts/${id}/move?direction=${direction}`, {
                method: "PUT",
                credentials: "include"
            });

            const responseText = await res.text();
            console.log('Response status:', res.status);
            console.log('Response body:', responseText);

            if (!res.ok) {
                throw new Error(responseText || `HTTP ${res.status}`);
            }

            await loadData();
        } catch (err: any) {
            console.error('❌ Move error:', err.message);
            alert(`Не вдалося перемістити: ${err.message}`);
        }
    };

    const groupedRows = rows.reduce((acc, item) => {
        if (!acc[item.dep]) {
            acc[item.dep] = { codDep: item.codDep, subDeps: {} as any };
        }
        const key = item.subDep ?? "__no_subdep__";
        if (!acc[item.dep].subDeps[key]) {
            acc[item.dep].subDeps[key] = { subDep: item.subDep, employees: [] };
        }
        acc[item.dep].subDeps[key].employees.push(item);
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

    const departmentOptions: SelectNumOption[] = departments.map(d => ({ value: d.id, label: d.name }));
    const subDepOptions: SelectNumOption[] = subDeps.map(sd => ({ value: sd.id, label: sd.name }));
    const positionOptions: SelectStrOption[] = positions.map(p => ({ value: p.id, label: p.name }));

    const getSelectedDepartment = (): SelectNumOption | null =>
        departmentOptions.find(o => o.value === editData.idDepartment) || null;

    const getSelectedSubDep = (): SelectNumOption | null =>
        subDepOptions.find(o => o.value === editData.idSubdepartment) || null;

    const getSelectedPosition = (): SelectStrOption | null =>
        positionOptions.find(o => o.value === editData.idShtat) || null;

    const ColDefs = () => (
        <>
            {columns.map((col, i) => (
                <col key={`col-${i}`} style={{ width: col.width }} />
            ))}
            <col style={{ width: '8rem' }} /> {/* w-32 = 128px для колонки "Дії" */}
        </>
    );

    return (
        <AuthGuard>
            <div className="w-full h-full flex flex-col pt-0 px-0">
                <div className="flex-1 overflow-auto border border-gray-200 bg-white shadow-sm rounded-lg">

                    <div className="sticky top-0 z-30 bg-white shadow-sm">
                        {/* Заголовок + Кнопки */}
                        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white">
                            <h2 className="text-xl font-semibold text-gray-800">Редагування довідника</h2>
                            <div className="flex gap-2">
                                <button onClick={startCreate} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">Додати співробітника</button>
                                <button onClick={() => navigate("/edit/structure")} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition">Структура відділів</button>
                            </div>
                        </div>

                        {/* ШАПКА ТАБЛИЦЫ */}
                        <table className="my-table w-full table-fixed border-collapse">
                            <ColDefs /> {/* 👈 Явное задание ширины */}
                            <thead>
                            <tr className="bg-gray-50">
                                {columns.map(col => (
                                    <th key={col.key} className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">
                                        {col.header}
                                    </th>
                                ))}
                                <th className="text-center font-semibold text-gray-700 border-b border-gray-200">Дії</th>
                            </tr>
                            </thead>
                        </table>
                    </div>

                    {/* ТЕЛО ТАБЛИЦЫ */}
                    <table className="my-table w-full table-fixed border-collapse">
                        <ColDefs />
                        <tbody>
                        {isCreating && (
                            <tr className="bg-green-50/50">
                                <td className="px-2 py-2 align-top">
                                    <Select<SelectNumOption, false> options={departmentOptions} value={getSelectedDepartment()} onChange={(opt) => { const id = opt?.value; setEditData(prev => ({ ...prev, idDepartment: id, idSubdepartment: undefined })); if (id) void loadSubDeps(id); }} styles={selectStyles} placeholder="Оберіть відділ" menuPortalTarget={document.body} />
                                </td>
                                <td className="px-2 py-2 align-top">
                                    <Select<SelectNumOption, false> options={subDepOptions} value={getSelectedSubDep()} onChange={(option) => setEditData(prev => ({ ...prev, idSubdepartment: option?.value || null }))} styles={selectStyles} placeholder="—" isClearable menuPortalTarget={document.body} />
                                </td>
                                <td className="px-2 py-2 align-top">
                                    <Select<SelectStrOption, false> options={positionOptions} value={getSelectedPosition()} onChange={(opt) => { setEditData(prev => ({ ...prev, idShtat: opt?.value || "", pos: opt?.label || "" })); }} styles={selectStyles} placeholder="Оберіть посаду" isClearable menuPortalTarget={document.body} />
                                </td>
                                <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium" value={editData.pib ?? ""} onChange={e => setEditData(prev => ({ ...prev, pib: e.target.value }))} /></td>
                                <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium text-center" value={editData.nKab ?? ""} onChange={e => setEditData(prev => ({ ...prev, nKab: e.target.value }))} placeholder="№" /></td>
                                <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium text-center" value={editData.tMg ?? ""} onChange={e => setEditData(prev => ({ ...prev, tMg: e.target.value }))} placeholder="міськ." /></td>
                                <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium text-center" value={editData.tInto ?? ""} onChange={e => setEditData(prev => ({ ...prev, tInto: e.target.value }))} placeholder="внутр." /></td>
                                <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium text-center" value={editData.tIp ?? ""} onChange={e => setEditData(prev => ({ ...prev, tIp: e.target.value }))} placeholder="IP" /></td>
                                <td className="px-2 py-2 text-center">
                                    <button onClick={createEmployee} className="mr-1">💾</button>
                                    <button onClick={cancelEdit}>❌</button>
                                </td>
                            </tr>
                        )}

                        {Object.entries(groupedRows).map(([department, depData]: any) => (
                            <React.Fragment key={department}>
                                <tr className="table-dept">
                                    <td colSpan={columns.length + 1} className="px-4 py-3 font-bold text-left">{depData.codDep} - {department}</td>
                                </tr>
                                {Object.entries(depData.subDeps).map(([key, subDepData]: any) => (
                                    <React.Fragment key={key}>
                                        {subDepData.subDep && (
                                            <tr className="table-subdept">
                                                <td colSpan={columns.length + 1} className="px-4 py-2 font-semibold">{subDepData.subDep}</td>
                                            </tr>
                                        )}
                                        {subDepData.employees.map((emp: TelDowPeople) => (
                                            editingId === emp.id ? (
                                                <tr key={emp.id} className="bg-yellow-50">
                                                    <td className="px-2 py-2 align-top">
                                                        <Select<SelectNumOption, false> options={departmentOptions} value={getSelectedDepartment()} onChange={(opt) => { const id = opt?.value; setEditData(prev => ({ ...prev, idDepartment: id, idSubdepartment: undefined })); if (id) void loadSubDeps(id); }} styles={selectStyles} classNamePrefix="edit-select" placeholder="Оберіть відділ" menuPortalTarget={document.body} components={{ Option: (props) => (<components.Option {...props}><span className="block whitespace-normal break-words">{props.data.label}</span></components.Option>) }} />
                                                    </td>
                                                    <td className="px-2 py-2 align-top">
                                                        <Select<SelectNumOption, false> options={subDepOptions} value={getSelectedSubDep()} onChange={(option) => setEditData(prev => ({ ...prev, idSubdepartment: option?.value || null }))} styles={selectStyles} classNamePrefix="edit-select" placeholder="—" isClearable menuPortalTarget={document.body} components={{ Option: (props) => (<components.Option {...props}><span className="block whitespace-normal break-words">{props.data.label}</span></components.Option>) }} />
                                                    </td>
                                                    <td className="px-2 py-2 align-top">
                                                        <Select<SelectStrOption, false> options={positionOptions} value={getSelectedPosition()} onChange={(opt) => { const id = opt?.value; setEditData(prev => ({ ...prev, idShtat: id, pos: opt?.label ?? "" })); }} styles={selectStyles} classNamePrefix="edit-select" placeholder="Оберіть посаду" isClearable menuPortalTarget={document.body} components={{ Option: (props) => (<components.Option {...props}><span className="block whitespace-normal break-words" title={props.data.label}>{props.data.label}</span></components.Option>) }} />
                                                    </td>
                                                    <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium" value={editData.pib ?? ""} onChange={e => setEditData(prev => ({ ...prev, pib: e.target.value }))} /></td>
                                                    <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium text-center" value={editData.nKab ?? ""} onChange={e => setEditData(prev => ({ ...prev, nKab: e.target.value }))} placeholder="№" /></td>
                                                    <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium text-center" value={editData.tMg ?? ""} onChange={e => setEditData(prev => ({ ...prev, tMg: e.target.value }))} placeholder="міськ." /></td>
                                                    <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium text-center" value={editData.tInto ?? ""} onChange={e => setEditData(prev => ({ ...prev, tInto: e.target.value }))} placeholder="внутр." /></td>
                                                    <td className="px-2 py-2"><input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 font-medium text-center" value={editData.tIp ?? ""} onChange={e => setEditData(prev => ({ ...prev, tIp: e.target.value }))} placeholder="IP" /></td>
                                                    <td className="px-2 py-2 text-center whitespace-nowrap">
                                                        <button onClick={saveEdit} className="mr-1">💾</button>
                                                        <button onClick={cancelEdit}>❌</button>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr key={emp.id}>
                                                    {columns.map(col => (
                                                        <td key={col.key} className="px-2 py-2 break-words">
                                                            {emp[col.key as keyof TelDowPeople]}
                                                        </td>
                                                    ))}
                                                    <td className="px-2 py-2 text-center whitespace-nowrap">
                                                        <button onClick={() => moveEmployee(emp.id, 'up')} className="mr-1 hover:scale-110 transition opacity-70 hover:opacity-100" title="Перемістити вгору">⬆️</button>
                                                        <button onClick={() => startEdit(emp)} className="mx-1 hover:scale-110 transition" title="Редагувати">✏️</button>
                                                        <button onClick={() => moveEmployee(emp.id, 'down')} className="ml-1 hover:scale-110 transition opacity-70 hover:opacity-100" title="Перемістити вниз">⬇️</button>
                                                        <button onClick={() => deleteEmployee(emp.id)} className="ml-1 hover:scale-110 transition opacity-70 hover:opacity-100 text-red-600" title="Видалити">🗑️</button>
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
        </AuthGuard>
    );
}