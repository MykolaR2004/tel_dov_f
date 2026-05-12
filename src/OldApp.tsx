// import * as React from "react";
// import {useEffect, useState} from "react";
//
// export type TelDowPeople = {
//     id: number;
//     codDep: string;
//     dep: string;
//     subDep: string | null;
//     pos: string;
//     pib: string;
//     nKab: string;
//     tMg: string;
//     tInto: string;
//     tIp: string;
//
//     idDepartment: number;
//     idSubdepartment: number | null;
//     idShtat: string;
// };
//
// type Department = {
//     id: number;
//     name: string;
// };
//
// type SubDepartment = {
//     id: number;
//     name: string;
// };
//
// export default function EditPage() {
//
//     const [rows, setRows] = useState<TelDowPeople[]>([]);
//     const [editingId, setEditingId] = useState<number | null>(null);
//     const [editData, setEditData] = useState<any>({});
//
//     const [departments, setDepartments] = useState<Department[]>([]);
//     const [subDeps, setSubDeps] = useState<SubDepartment[]>([]);
//
//     useEffect(() => {
//         loadData();
//         loadDepartments();
//     }, []);
//
//     const loadData = () => {
//         fetch("/api/contacts/edit")
//             .then(res => res.json())
//             .then(setRows);
//     };
//
//     const loadDepartments = () => {
//         fetch("/api/contacts/departments")
//             .then(res => res.json())
//             .then(setDepartments);
//     };
//
//     const loadSubDeps = (depId: number) => {
//         fetch(`/api/contacts/subdepartments/${depId}`)
//             .then(res => res.json())
//             .then(setSubDeps);
//     };
//
//     const startEdit = (row: TelDowPeople) => {
//         setEditingId(row.id);
//         setEditData({...row});
//         loadSubDeps(row.idDepartment);
//     };
//
//     const cancelEdit = () => {
//         setEditingId(null);
//         setEditData({});
//     };
//
//     const saveEdit = async () => {
//         await fetch(`/api/contacts/${editData.id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 pib: editData.pib,
//                 nKab: editData.nKab,
//                 idDepartment: editData.idDepartment,
//                 idSubdepartment: editData.idSubdepartment
//             })
//         });
//
//         setEditingId(null);
//         loadData();
//     };
//
//     const groupedRows = rows.reduce((acc, item) => {
//         if (!acc[item.dep]) {
//             acc[item.dep] = {
//                 codDep: item.codDep,
//                 subDeps: {}
//             };
//         }
//
//         const subDepKey = item.subDep ?? "__no_subdep__";
//
//         if (!acc[item.dep].subDeps[subDepKey]) {
//             acc[item.dep].subDeps[subDepKey] = {
//                 subDep: item.subDep,
//                 employees: []
//             };
//         }
//
//         acc[item.dep].subDeps[subDepKey].employees.push(item);
//
//         return acc;
//     }, {} as any);
//
//     const columns = [
//         { key: "dep", header: "Відділ", width: "250px" },
//         { key: "subDep", header: "Підрозділ", width: "250px" },
//         { key: "pos", header: "Посада", width: "300px" },
//         { key: "pib", header: "ПІБ", width: "400px" },
//         { key: "nKab", header: "Кабінет", width: "50px" },
//         { key: "tMg", header: "Міський", width: "150px" },
//         { key: "tInto", header: "Внутрішній", width: "120px" },
//         { key: "tIp", header: "IP", width: "120px" },
//     ];
//
//     return (
//         <div className="pt-16 px-6">
//             <div className="flex justify-center">
//                 <div className="w-full min-w-400 overflow-x-auto">
//
//                     <table className="w-full table-fixed border border-gray-300">
//
//                         <thead>
//                         <tr>
//                             {columns.map(col => (
//                                 <th key={col.key} style={{width: col.width}}
//                                     className="px-4 py-2 border text-center">
//                                     {col.header}
//                                 </th>
//                             ))}
//                             <th className="w-30">Дії</th>
//                         </tr>
//                         </thead>
//
//                         <tbody>
//                         {Object.entries(groupedRows).map(([department, depData]: any) => (
//                             <React.Fragment key={department}>
//
//                                 <tr className="bg-gray-200">
//                                     <td
//                                         colSpan={columns.length + 1}
//                                         className="px-4 py-3 font-bold text-left break-words whitespace-normal"
//                                     >
//                                         {depData.codDep} - {department}
//                                     </td>
//                                 </tr>
//
//                                 {Object.entries(depData.subDeps).map(([key, subDepData]: any) => (
//                                     <React.Fragment key={key}>
//
//                                         {subDepData.subDep && (
//                                             <tr className="bg-gray-100">
//                                                 <td
//                                                     colSpan={columns.length + 1}
//                                                     className="px-4 py-2 font-semibold text-left break-words whitespace-normal"
//                                                 >
//                                                     {subDepData.subDep}
//                                                 </td>
//                                             </tr>
//                                         )}
//
//                                         {subDepData.employees.map((emp: TelDowPeople) => (
//                                             editingId === emp.id ? (
//                                                 <tr key={emp.id} className="bg-yellow-50">
//                                                     {/* DEPARTMENT */}
//                                                     <td
//                                                         style={{ width: columns[0].width }}
//                                                         className="px-2 py-2 border"
//                                                     >
//                                                         <select
//                                                             className="w-full min-w-0 px-2 py-1 box border rounded break-words whitespace-normal"
//                                                             value={editData.idDepartment}
//                                                             onChange={e => {
//                                                                 const newDepId = Number(e.target.value);
//
//                                                                 setEditData({
//                                                                     ...editData,
//                                                                     idDepartment: newDepId,
//                                                                     idSubdepartment: null // сброс
//                                                                 });
//
//                                                                 loadSubDeps(newDepId);
//                                                             }}
//                                                         >
//                                                             {departments.map(dep => (
//                                                                 <option key={dep.id} value={dep.id}>
//                                                                     {dep.name}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     </td>
//
//                                                     {/* SUBDEPARTMENT */}
//                                                     <td
//                                                         style={{ width: columns[1].width }}
//                                                         className="px-2 py-2 border"
//                                                     >
//                                                         <select
//                                                             className="w-full box-border px-2 py-1 border rounded"
//                                                             value={editData.idSubdepartment ?? ""}
//                                                             onChange={e => setEditData({
//                                                                 ...editData,
//                                                                 idSubdepartment: e.target.value ? Number(e.target.value) : null
//                                                             })}
//                                                         >
//                                                             <option value="">—</option>
//
//                                                             {subDeps.map(sd => (
//                                                                 <option key={sd.id} value={sd.id}>
//                                                                     {sd.name}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     </td>
//
//                                                     {/* POS */}
//                                                     <td
//                                                         style={{ width: columns[2].width }}
//                                                         className="px-2 py-2 border"
//                                                     >
//                                                         <input
//                                                             className="w-full box-border px-2 py-1 border rounded"
//                                                             value={editData.pos}
//                                                             onChange={e => setEditData({...editData, pos: e.target.value})}
//                                                         />
//                                                     </td>
//
//                                                     {/* PIB */}
//                                                     <td
//                                                         style={{ width: columns[3].width }}
//                                                         className="px-2 py-2 border"
//                                                     >
//                                                         <input
//                                                             className="w-full box-border px-2 py-1 border rounded"
//                                                             value={editData.pib}
//                                                             onChange={e => setEditData({...editData, pib: e.target.value})}
//                                                         />
//                                                     </td>
//
//                                                     <td
//                                                         style={{ width: columns[4].width }}
//                                                         className="px-2 py-2 border text-center"
//                                                     >
//                                                         {emp.nKab}
//                                                     </td>
//
//                                                     <td
//                                                         style={{ width: columns[5].width }}
//                                                         className="px-2 py-2 border text-center"
//                                                     >
//                                                         {emp.tMg}
//                                                     </td>
//
//                                                     <td
//                                                         style={{ width: columns[6].width }}
//                                                         className="px-2 py-2 border text-center"
//                                                     >
//                                                         {emp.tInto}
//                                                     </td>
//
//                                                     <td
//                                                         style={{ width: columns[7].width }}
//                                                         className="px-2 py-2 border text-center"
//                                                     >
//                                                         {emp.tIp}
//                                                     </td>
//
//                                                     {/* ACTIONS */}
//                                                     <td>
//                                                         <button onClick={saveEdit}>💾</button>
//                                                         <button onClick={cancelEdit}>❌</button>
//                                                     </td>
//
//                                                 </tr>
//                                             ) : (
//                                                 <tr key={emp.id}>
//
//                                                     {columns.map(col => (
//                                                         <td
//                                                             key={col.key}
//                                                             style={{ width: col.width }}
//                                                             className="px-2 py-2 border break-words whitespace-normal"
//                                                         >
//                                                             {emp[col.key as keyof TelDowPeople]}
//                                                         </td>
//                                                     ))}
//
//                                                     <td className="px-2 py-2 border text-center">
//                                                         <button onClick={() => startEdit(emp)}>✏️</button>
//                                                     </td>
//                                                 </tr>
//                                             )
//                                         ))}
//
//                                     </React.Fragment>
//                                 ))}
//
//                             </React.Fragment>
//                         ))}
//                         </tbody>
//                     </table>
//
//                 </div>
//             </div>
//         </div>
//     );
// }