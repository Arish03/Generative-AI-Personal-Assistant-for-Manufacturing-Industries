const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const api = {
    get: async (endpoint: string) => {
        try {
            const res = await fetch(`${BASE_URL}${endpoint}`);
            if (!res.ok) throw new Error("API Error");
            return res.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
        }
    },
    getProjects: async () => {
        try {
            const res = await fetch(`${BASE_URL}/projects`);
            if (!res.ok) throw new Error("API Error");
            return { data: await res.json() };
        } catch (error) {
            console.error("Error fetching projects:", error);
            return { data: [] };
        }
    }
};

export default api;
