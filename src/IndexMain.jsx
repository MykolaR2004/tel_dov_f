// import { useEffect, useState } from "react";
//
// function IndexMain() {
//     const [contacts, setContacts] = useState([]);
//
//     useEffect(() => {
//         fetch("/api/contacts")
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error("Ошибка при получении данных");
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("Полученные данные:", data);
//                 setContacts(data);
//             })
//             .catch(error => {
//                 console.error("Ошибка:", error);
//             });
//     }, []);
//
//     return (
//         <div>
//             <h1>Телефонний довідник</h1>
//
//             {contacts.length === 0 ? (
//                 <p>Дані відсутні</p>
//             ) : (
//                 contacts.map((item) => (
//                     <div
//                         key={item.id}
//                         style={{
//                             border: "1px solid #ccc",
//                             padding: "10px",
//                             marginBottom: "10px",
//                             borderRadius: "5px"
//                         }}
//                     >
//                         <div><strong>Підрозділ:</strong> {item.name}</div>
//                         <div><strong>Посада:</strong> {item.pos}</div>
//                         <div><strong>ID:</strong> {item.id}</div>
//                         <div><strong>ПІБ:</strong> {item.pib}</div>
//                         <div><strong>Кабінет:</strong> {item.n_kab}</div>
//                         <div><strong>Порядковий №:</strong> {item.npp}</div>
//                         <div><strong>Міський телефон:</strong> {item.t_mg}</div>
//                         <div><strong>Внутрішній телефон:</strong> {item.t_into}</div>
//                         <div><strong>IP телефон:</strong> {item.t_ip}</div>
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// }
//
// export default IndexMain;
//


// import { createRoot } from 'react-dom/client'
//
// console.log("Entry point loaded");
//
// const root = document.getElementById('app');
// console.log("app element:", root);
//
// if (root) {
//     createRoot(root).render(
//         <div style={{padding: 40, background: '#e8f5e9', borderRadius: 8}}>
//             <h1 style={{color: '#2e7d32'}}>REACT MOUNTED</h1>
//             <p>Time: {new Date().toLocaleTimeString()}</p>
//         </div>
//     );
//     console.log("Rendered");
// } else {
//     console.error("#app not found in DOM");
// }

// import { useEffect, useState } from "react";
//
// function IndexMain() {
//     const [contacts, setContacts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         fetch("/api/contacts")
//             .then(res => {
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);
//                 return res.json();
//             })
//             .then(data => {
//                 setContacts(data);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 setError(err.message);
//                 setLoading(false);
//             });
//     }, []);
//
//     if (loading) return <div className="status">Загрузка...</div>;
//     if (error) return <div className="status error">Ошибка: {error}</div>;
//     if (contacts.length === 0) return <div className="status">Список пуст</div>;
//
//
//     return (
//         <div>
//             <h1>Перелік працівників</h1>
//             {contacts.map(item => (
//                 <div key={item.id}>
//                     {item.name} |
//                     {item.pos} |
//                     {item.id} |
//                     {item.pib} |
//                     {item.n_kab} |
//                     {item.npp} |
//                     {item.t_mg} |
//                     {item.t_into} |
//                     {item.t_ip}
//                </div>))}
//         </div>
//     );
// }
// export default IndexMain;