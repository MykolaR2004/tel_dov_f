import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTopButton from "./ScrollToTopButton";

export default function Layout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">

            {/* Верхнее меню */}
            <header className="bg-gray-800 text-white px-6 py-4 shadow">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-lg font-semibold">
                        Телефонний довідник
                    </h1>
                </div>

                <div className="max-w-7xl mx-auto flex justify-end gap-3">

                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-400 rounded"
                    >
                        Головна
                    </button>

                    <button
                        onClick={() => navigate("/edit")}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-400 rounded"
                    >
                        Редагування
                    </button>

                </div>

            </header>

            {/* Контент */}
            <main className="flex-1">
                <Outlet />

                <ScrollToTopButton />
            </main>

        </div>
    );
}