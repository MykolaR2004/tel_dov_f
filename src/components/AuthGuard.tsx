import React, { useEffect, useState } from "react";

type AuthGuardProps = {
    children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        void checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch("/api/auth/check", {
                method: "GET",
                credentials: "include"
            });

            if (res.ok) {
                setIsAuthenticated(true);
            } else if (res.status === 401) {
                setIsAuthenticated(false);
                setShowLogin(true);
            }
        } catch {
            setIsAuthenticated(false);
            setShowLogin(true);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const res = await fetch("/perform-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData.toString(),
                credentials: "include"
            });

            if (res.ok) {
                setIsAuthenticated(true);
                setShowLogin(false);
                setUsername("");
                setPassword("");
            } else {
                setError("Невірний логін або пароль");
            }
        } catch {
            setError("Помилка підключення до сервера");
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/perform-logout", {
                method: "POST",
                credentials: "include"
            });

            setIsAuthenticated(false);
            setShowLogin(true);
        } catch {
            setIsAuthenticated(false);
            setShowLogin(true);
        }
    };

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
            <div className="my-spinner"></div>
                </div>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    if (showLogin) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-center">🔐 Вхід до системи</h2>

        {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
                </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Логін</label>
            <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="my-input w-full"
        placeholder="Login"
        required
        autoFocus
        />
        </div>
        <div>
        <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="my-input w-full"
        placeholder="Password"
        required
        />
        </div>
        <button type="submit" className="my-button w-full">
            Увійти
            </button>

            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
            Сесія завершиться після закриття браузера
        </p>
        </div>
        </div>
    );
    }

    return null;
}