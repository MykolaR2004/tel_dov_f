import { useEffect, useState, Fragment } from "react";
import AuthGuard from "./AuthGuard";

type StructureRow = {
    id: number;

    cod_dep: string;
    name: string;
    is_actual: number;
    is_spec: number;

    sub_id: number | null;
    cod_sub_dep: string | null;
    name_sub_dep: string | null;
    sub_actual: number | null;
};

export default function StructurePage() {

    const [rows, setRows] = useState<StructureRow[]>([]);

    const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);

    const [editDepartmentData, setEditDepartmentData] = useState({
        cod_dep: "",
        name: "",
        is_actual: 1,
        is_spec: 0
    });

    const [editingSubDepId, setEditingSubDepId] = useState<number | null>(null);

    const [subDepEditData, setSubDepEditData] = useState({
        id: 0,
        cod_dep: "",
        name: "",
        is_actual: 1
    });

    const [editingSubDepartmentId, setEditingSubDepartmentId] = useState<number | null>(null);

    const [editSubDepartmentData, setEditSubDepartmentData] = useState({
        cod_dep: "",
        name: "",
        is_actual: 1
    });

    const [showInactive, setShowInactive] = useState(false);

    const [showAddDepartmentForm, setShowAddDepartmentForm] = useState(false);
    const [newDepartmentData, setNewDepartmentData] = useState({
        cod_dep: "",
        name: "",
        is_actual: 1,
        is_spec: 0
    });

    const [addingSubDepFor, setAddingSubDepFor] = useState<number | null>(null);
    const [newSubDepData, setNewSubDepData] = useState({
        cod_dep: "",
        name: "",
        is_actual: 1,
        id_main: 0
    });

    useEffect(() => {
        void loadData();
    }, []);


    const addDepartment = async () => {
        if (!newDepartmentData.cod_dep.trim() || !newDepartmentData.name.trim()) {
            alert("Код та назва відділу обов'язкові");
            return;
        }

        try {
            const res = await fetch("/api/contacts/structure/department", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDepartmentData),
                credentials: "include"
            });

            if (!res.ok) throw new Error(await res.text());

            setShowAddDepartmentForm(false);
            setNewDepartmentData({ cod_dep: "", name: "", is_actual: 1, is_spec: 0 });
            await loadData();
        } catch (err: any) {
            console.error(err);
            alert(`Помилка додавання: ${err.message}`);
        }
    };

    const addSubDepartment = async (departmentId: number) => {
        if (!newSubDepData.cod_dep.trim() || !newSubDepData.name.trim()) {
            alert("Код та назва підрозділу обов'язкові");
            return;
        }

        try {
            const res = await fetch("/api/contacts/structure/subdepartment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newSubDepData, id_main: departmentId }),
                credentials: "include"
            });

            if (!res.ok) throw new Error(await res.text());

            setAddingSubDepFor(null);
            setNewSubDepData({ cod_dep: "", name: "", is_actual: 1, id_main: 0 });
            await loadData();
        } catch (err: any) {
            console.error(err);
            alert(`Помилка додавання: ${err.message}`);
        }
    };

    const cancelAddSubDep = () => {
        setAddingSubDepFor(null);
        setNewSubDepData({ cod_dep: "", name: "", is_actual: 1, id_main: 0 });
    };

    const loadData = async () => {
        try {
            const res = await fetch("/api/contacts/structure", {
                credentials: "include"
            });

            if (!res.ok) {
                if (res.status === 401) {
                    console.warn("Сессия истекла, требуется вход");
                    window.location.href = "/login";
                    return;
                }
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            setRows(data);
        } catch (err) {
            console.error("Load structure error:", err);
        }
    };

    const startDepartmentEdit = (row: StructureRow) => {

        setEditingDepartmentId(row.id);

        setEditDepartmentData({
            cod_dep: row.cod_dep,
            name: row.name,
            is_actual: row.is_actual,
            is_spec: row.is_spec
        });
    };

    const startSubDepartmentEdit = (sub: any) => {

        setEditingSubDepartmentId(sub.id);

        setEditSubDepartmentData({
            cod_dep: sub.cod_sub_dep,
            name: sub.name_sub_dep,
            is_actual: sub.sub_actual
        });
    };

    const cancelSubDepartmentEdit = () => {

        setEditingSubDepartmentId(null);

        setEditSubDepartmentData({
            cod_dep: "",
            name: "",
            is_actual: 1
        });
    };

    const saveSubDepartmentEdit = async (id: number) => {

        try {

            const res = await fetch(
                `/api/contacts/structure/subdepartment/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(editSubDepartmentData),
                    credentials: "include"
                }
            );

            if (!res.ok) {
                throw new Error(await res.text());
            }

            setEditingSubDepartmentId(null);

            await loadData();

        } catch (err: any) {

            console.error(err);

            alert(err.message);
        }
    };

    const deleteSubDepartment = async (id: number) => {

        if (!window.confirm("Видалити підрозділ?")) {
            return;
        }

        try {

            const res = await fetch(
                `/api/contacts/structure/subdepartment/${id}`,
                {
                    method: "DELETE", credentials: "include"
                }
            );

            if (!res.ok) {
                throw new Error(await res.text());
            }

            await loadData();

        } catch (err: any) {

            console.error(err);

            alert(err.message);
        }
    };

    const cancelDepartmentEdit = () => {

        setEditingDepartmentId(null);

        setEditDepartmentData({
            cod_dep: "",
            name: "",
            is_actual: 1,
            is_spec: 0
        });
    };

    const saveDepartmentEdit = async (id: number) => {

        try {

            const response = await fetch(`/api/contacts/structure/department/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editDepartmentData),
                credentials: "include"
            });

            if (!response.ok) {

                const text = await response.text();

                throw new Error(text);
            }

            setEditingDepartmentId(null);

            await loadData();

        } catch (err: any) {

            console.error(err);

            alert(`Помилка збереження: ${err.message}`);
        }
    };

    const deleteDepartment = async (id: number) => {

        if (!window.confirm("Видалити відділ?")) {
            return;
        }

        try {

            const res = await fetch(
                `/api/contacts/structure/department/${id}`,
                {
                    method: "DELETE", credentials: "include"
                }
            );

            if (!res.ok) {
                throw new Error(await res.text());
            }

            await loadData();

        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    const groupedRows = rows.reduce((acc: any, item) => {
        if (!acc[item.id]) {
            acc[item.id] = {
                department: {
                    id: item.id,
                    cod_dep: item.cod_dep,
                    name: item.name,
                    is_actual: item.is_actual,
                    is_spec: item.is_spec
                },
                subDepartments: []
            };
        }

        if (item.sub_id) {
            acc[item.id].subDepartments.push({
                id: item.sub_id,
                cod_sub_dep: item.cod_sub_dep,
                name_sub_dep: item.name_sub_dep,
                sub_actual: item.sub_actual
            });
        }

        return acc;
    }, {} as Record<number, any>);

    let displayGroups = Object.values(groupedRows);

    if (!showInactive) {
        displayGroups = displayGroups.filter((group: any) => {
            const dep = group.department;
            if (dep.is_actual !== 1) return false;

            group.subDepartments = group.subDepartments.filter(
                (sub: any) => sub.sub_actual === 1
            );
            return true;
        });
    }

    displayGroups.sort((a: any, b: any) => {
        const codeA = (a.department.cod_dep || "").trim();
        const codeB = (b.department.cod_dep || "").trim();

        const depCompare = codeA.localeCompare(
            codeB,
            'uk',
            { numeric: true, sensitivity: 'base' }
        );

        if (depCompare !== 0) {
            return depCompare;
        }

        return a.department.name.localeCompare(b.department.name, 'uk');
    });

    displayGroups.forEach((group: any) => {
        group.subDepartments.sort((subA: any, subB: any) => {
            const codeA = (subA.cod_sub_dep || "").trim();
            const codeB = (subB.cod_sub_dep || "").trim();
            return codeA.localeCompare(codeB, 'uk', { numeric: true });
        });
    });

    return (
    <AuthGuard>
        <div className="pt-16 px-6 h-full flex flex-col">

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-2xl font-semibold">
                    Структура відділів
                </h1>

                <div className="flex items-center gap-3 ml-auto">
                    <span className="text-sm text-gray-800">Тільки активні</span>
                    <button
                        onClick={() => setShowInactive(!showInactive)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            showInactive ? 'bg-gray-400' : 'bg-green-500'
                        }`}
                        title={showInactive ? 'Показати всі' : 'Показати тільки активні'}
                    >
        <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                showInactive ? 'left-7' : 'left-1'
            }`}
        />
                    </button>
                    <span className="text-sm text-gray-600">Всі</span>
                </div>

            </div>

            {/* === Форма додавання відділу === */}
            {showAddDepartmentForm ? (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold mb-3">Додати новий відділ</h3>
                    <div className="grid grid-cols-5 gap-3 items-end">
                        {/* Код */}
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Код</label>
                            <input
                                className="w-full border rounded px-2 py-1"
                                value={newDepartmentData.cod_dep}
                                onChange={e => setNewDepartmentData(prev => ({ ...prev, cod_dep: e.target.value }))}
                                placeholder="напр. 01"
                            />
                        </div>
                        {/* Назва */}
                        <div className="col-span-2">
                            <label className="block text-xs text-gray-600 mb-1">Назва</label>
                            <input
                                className="w-full border rounded px-2 py-1"
                                value={newDepartmentData.name}
                                onChange={e => setNewDepartmentData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Назва відділу"
                            />
                        </div>
                        {/* Активний */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="new-dep-actual"
                                checked={newDepartmentData.is_actual === 1}
                                onChange={e => setNewDepartmentData(prev => ({ ...prev, is_actual: e.target.checked ? 1 : 0 }))}
                            />
                            <label htmlFor="new-dep-actual" className="text-sm">Активний</label>
                        </div>
                        {/* Спец */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="new-dep-spec"
                                checked={newDepartmentData.is_spec === 1}
                                onChange={e => setNewDepartmentData(prev => ({ ...prev, is_spec: e.target.checked ? 1 : 0 }))}
                            />
                            <label htmlFor="new-dep-spec" className="text-sm">Спец.</label>
                        </div>
                    </div>
                    {/* Кнопки */}
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={addDepartment}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            💾 Зберегти
                        </button>
                        <button
                            onClick={() => {
                                setShowAddDepartmentForm(false);
                                setNewDepartmentData({ cod_dep: "", name: "", is_actual: 1, is_spec: 0 });
                            }}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                            ❌ Скасувати
                        </button>
                    </div>
                </div>
            ) : (
                /* Показати форму */
                <div className="mb-4">
                    <button
                        onClick={() => setShowAddDepartmentForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        ➕ Додати відділ
                    </button>
                </div>
            )}

            <div className="overflow-x-auto border border-gray-300 rounded">

                <table className="my-table">

                    <thead>

                    <tr>

                        <th className="w-[100px] ">
                            Код
                        </th>

                        <th className="w-[420px] ">
                            Назва
                        </th>

                        <th className="w-[120px] ">
                            Активний
                        </th>

                        <th className="w-[120px] ">
                            Спец.
                        </th>

                        <th className="w-[140px] ">
                            Дії
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    {displayGroups.map((group: any) => {

                        const dep = group.department;
                        const canDeleteDepartment = dep.is_actual === 0 && (dep.subDepartments?.length ?? 0) === 0;
                        const isEditing = editingDepartmentId === dep.id;

                        return (

                            <Fragment key={dep.id}>

                                {/* DEPARTMENT */}

                                <tr>

                                    {isEditing ? (
                                        <>

                                            <td>

                                                <input
                                                    className="w-full border rounded px-2 py-1"
                                                    value={editDepartmentData.cod_dep}
                                                    onChange={e =>
                                                        setEditDepartmentData(prev => ({
                                                            ...prev,
                                                            cod_dep: e.target.value
                                                        }))
                                                    }
                                                />

                                            </td>

                                            <td>

                                                <input
                                                    className="w-full border rounded px-2 py-1"
                                                    value={editDepartmentData.name}
                                                    onChange={e =>
                                                        setEditDepartmentData(prev => ({
                                                            ...prev,
                                                            name: e.target.value
                                                        }))
                                                    }
                                                />

                                            </td>

                                            <td className =" text-center">

                                                <input
                                                    type="checkbox"
                                                    checked={editDepartmentData.is_actual === 1}
                                                    onChange={e =>
                                                        setEditDepartmentData(prev => ({
                                                            ...prev,
                                                            is_actual: e.target.checked ? 1 : 0
                                                        }))
                                                    }
                                                />

                                            </td>

                                            <td className=" text-center">

                                                <input
                                                    type="checkbox"
                                                    checked={editDepartmentData.is_spec === 1}
                                                    onChange={e =>
                                                        setEditDepartmentData(prev => ({
                                                            ...prev,
                                                            is_spec: e.target.checked ? 1 : 0
                                                        }))
                                                    }
                                                />

                                            </td>

                                            <td className="text-center">

                                                <button
                                                    onClick={() => saveDepartmentEdit(dep.id)}
                                                    className="mr-2"
                                                    title="Зберегти"
                                                >
                                                    💾
                                                </button>

                                                <button
                                                    onClick={cancelDepartmentEdit}
                                                    title="Скасувати"
                                                >
                                                    ❌
                                                </button>

                                            </td>

                                        </>
                                    ) : (
                                        <>

                                            <td className="font-bold">
                                                {dep.cod_dep}
                                            </td>

                                            <td className="font-bold break-words whitespace-normal">
                                                {dep.name}
                                            </td>

                                            <td className="text-center">
                                                {dep.is_actual ? "Так" : "Ні"}
                                            </td>

                                            <td className="text-center">
                                                {dep.is_spec ? "Так" : "Ні"}
                                            </td>

                                            <td className="text-center">

                                                <button
                                                    onClick={() => startDepartmentEdit(dep)}
                                                    className="hover:scale-110 transition"
                                                    title="Редагувати"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => setAddingSubDepFor(dep.id)}
                                                    className="hover:scale-110 transition mr-1 text-green-600"
                                                    title="Додати підрозділ"
                                                >
                                                    ➕
                                                </button>
                                                <button
                                                    disabled={!canDeleteDepartment}
                                                    onClick={() => {
                                                        if (!canDeleteDepartment) return;
                                                        deleteDepartment(dep.id);
                                                    }}
                                                    className={!canDeleteDepartment ? "opacity-30 cursor-not-allowed" : ""}
                                                >
                                                    🗑️
                                                </button>

                                            </td>

                                        </>
                                    )}

                                </tr>

                                {/* === Форма додавання підрозділу === */}
                                {addingSubDepFor === dep.id && (
                                    <tr className="bg-green-50">
                                        <td className="">
                                            <input
                                                className="w-full border rounded px-2 py-1"
                                                value={newSubDepData.cod_dep}
                                                onChange={e => setNewSubDepData(prev => ({ ...prev, cod_dep: e.target.value }))}
                                                placeholder="Код"
                                            />
                                        </td>
                                        <td className="">
                                            <input
                                                className="w-full border rounded px-2 py-1"
                                                value={newSubDepData.name}
                                                onChange={e => setNewSubDepData(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="Назва підрозділу"
                                            />
                                        </td>
                                        <td className=" text-center">
                                            <input
                                                type="checkbox"
                                                checked={newSubDepData.is_actual === 1}
                                                onChange={e => setNewSubDepData(prev => ({ ...prev, is_actual: e.target.checked ? 1 : 0 }))}
                                            />
                                        </td>
                                        <td className="">—</td>
                                        <td className=" text-center">
                                            <button
                                                onClick={() => addSubDepartment(dep.id)}
                                                className="mr-1"
                                                title="Зберегти"
                                            >
                                                💾
                                            </button>
                                            <button
                                                onClick={cancelAddSubDep}
                                                title="Скасувати"
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                )}


                                {/* SUBDEPARTMENTS */}

                                {group.subDepartments.map((sub: any, index: number) => {

                                    const isSubEditing = editingSubDepartmentId === sub.id;
                                    const canDeleteSub = sub.sub_actual === 0;

                                    return (

                                        <tr
                                            key={sub.id ?? `${dep.id}-${index}`}
                                            className="hover:bg-gray-50"
                                        >

                                            {isSubEditing ? (
                                                <>

                                                    <td className="">

                                                        <input
                                                            className="w-full border rounded px-2 py-1"
                                                            value={editSubDepartmentData.cod_dep}
                                                            onChange={e =>
                                                                setEditSubDepartmentData(prev => ({
                                                                    ...prev,
                                                                    cod_dep: e.target.value
                                                                }))
                                                            }
                                                        />

                                                    </td>

                                                    <td className=" pl-6">

                                                        <input
                                                            className="w-full border rounded px-2 py-1"
                                                            value={editSubDepartmentData.name}
                                                            onChange={e =>
                                                                setEditSubDepartmentData(prev => ({
                                                                    ...prev,
                                                                    name: e.target.value
                                                                }))
                                                            }
                                                        />

                                                    </td>

                                                    <td className=" text-center">

                                                        <input
                                                            type="checkbox"
                                                            checked={editSubDepartmentData.is_actual === 1}
                                                            onChange={e =>
                                                                setEditSubDepartmentData(prev => ({
                                                                    ...prev,
                                                                    is_actual: e.target.checked ? 1 : 0
                                                                }))
                                                            }
                                                        />

                                                    </td>

                                                    <td className=" text-center">
                                                        —
                                                    </td>

                                                    <td className=" text-center">

                                                        <button
                                                            onClick={() => saveSubDepartmentEdit(sub.id)}
                                                            className="mr-2"
                                                            title="Зберегти"
                                                        >
                                                            💾
                                                        </button>

                                                        <button
                                                            onClick={cancelSubDepartmentEdit}
                                                            className="mr-2"
                                                            title="Скасувати"
                                                        >
                                                            ❌
                                                        </button>

                                                        <button
                                                            disabled={!canDeleteSub}
                                                            onClick={() => canDeleteSub && deleteSubDepartment(sub.id)}
                                                            className={`hover:scale-110 transition ${!canDeleteSub ? "opacity-30 cursor-not-allowed" : ""}`}
                                                            title="Видалити"
                                                        >
                                                            🗑️
                                                        </button>

                                                    </td>

                                                </>
                                            ) : (
                                                <>

                                                    <td className=" text-center">
                                                        {sub.cod_sub_dep}
                                                    </td>

                                                    <td className=" pl-10 break-words whitespace-normal">
                                                        {sub.name_sub_dep}
                                                    </td>

                                                    <td className=" text-center">
                                                        {sub.sub_actual ? "Так" : "Ні"}
                                                    </td>

                                                    <td className="">
                                                        —
                                                    </td>

                                                    <td className=" text-center">

                                                        <button
                                                            onClick={() => startSubDepartmentEdit(sub)}
                                                            className="mr-2 hover:scale-110 transition"
                                                            title="Редагувати"
                                                        >
                                                            ✏️
                                                        </button>

                                                        <button
                                                            disabled={!canDeleteSub}
                                                            onClick={() => canDeleteSub && deleteSubDepartment(sub.id)}
                                                            className={`hover:scale-110 transition ${!canDeleteSub ? "opacity-30 cursor-not-allowed" : ""}`}
                                                            title="Видалити"
                                                        >
                                                            🗑️
                                                        </button>

                                                    </td>

                                                </>
                                            )}

                                        </tr>
                                    );
                                })}

                            </Fragment>
                        );
                    })}

                    </tbody>

                </table>

            </div>

        </div>
        </AuthGuard>
    );
}


