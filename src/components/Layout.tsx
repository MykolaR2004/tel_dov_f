import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTopButton from "./ScrollToTopButton";
import ExcelLogo from '../assets/Excellogo.png';

export default function Layout() {
    const navigate = useNavigate();

    const handleExportExcel = async () => {
        try {
            const res = await fetch("/api/contacts/export/excel", {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Помилка експорту");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Телефонний_довідник_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Не вдалося експортувати дані");
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <header className="sticky top-0 z-50 bg-gray-800 text-white px-6 py-4 shadow shrink-0">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-lg font-semibold">
                        Телефонний довідник
                    </h1>
                </div>

                <div className="max-w-7xl mx-auto flex justify-end gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2 cursor-pointer"
                    >
                        <img
                            src={ExcelLogo}
                            alt="Excel"
                            className="h-5 w-5 object-contain"
                            loading="eager"
                        />
                        Експорт в Excel
                    </button>
                    <button onClick={() => navigate("/")} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-400 rounded">
                        Головна
                    </button>
                    <button onClick={() => navigate("/edit")} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-400 rounded">
                        Редагування
                    </button>
                </div>
            </header>

            <main className="flex-1 min-h-0 overflow-hidden">
                <Outlet />
                <ScrollToTopButton />
            </main>
        </div>
    );
}