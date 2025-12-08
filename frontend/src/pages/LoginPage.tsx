import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage(credentials: LoginPayload) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { login, isLoading, error } = useAuth();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ username, password });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form
                onSubmit={submit}
                className="w-full max-w-md p-6 bg-white rounded-xl shadow space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Acesso ao Dashboard</h2>

                <input
                    placeholder="Usuário"
                    className="w-full p-2 border rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    className="w-full p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                    disabled={isLoading}
                    className="w-full p-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                >
                    {isLoading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}
