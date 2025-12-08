import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "@/pages/loginPage";

interface LoginPayload {
    username: string;
    password: string;
}

interface AuthResponse {
    access_token: string;
}

interface AuthHook {
    login: (credentials: LoginPayload) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export const useAuth = (): AuthHook => {
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return !!localStorage.getItem("token");
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(
        async (credentials: LoginPayload) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await LoginPage(credentials);
                const { access_token } = response as unknown as AuthResponse;

                localStorage.setItem("token", access_token);
                setIsAuthenticated(true);

                navigate("/", { replace: true });
            } catch (err: any) {
                const msg =
                    err?.response?.data?.message ||
                    "Falha na conexão ou credenciais inválidas.";

                setError(msg);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        },
        [navigate]
    );

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
    }, [navigate]);

    return {
        login,
        logout,
        isAuthenticated,
        isLoading,
        error,
    };
};
