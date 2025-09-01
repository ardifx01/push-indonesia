import { Category, DetailedItem } from "./budaya--data";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3300";

// Types for API responses
type ApiResponse<T> = {
    content: T;
    err?: any;
    status?: string;
};

type CategoryResponse = Category & { id: string };
type ItemResponse = DetailedItem;

// Helper function to handle API calls
async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.text();
        const errorMessage = `API Error: ${response.status} ${response.statusText}`;
        const fullError = errorData ? `${errorMessage} - ${errorData}` : errorMessage;
        throw new ApiError(fullError, response.status);
    }

    return response.json();
}

// Categories API
export const categoriesApi = {
    // GET /api/budaya/categories
    list: async (): Promise<CategoryResponse[]> => {
        const response = await apiCall<ApiResponse<CategoryResponse[]>>("/api/budaya/categories");
        return response.content;
    },

    // POST /api/budaya/categories
    create: async (category: Omit<CategoryResponse, "id">): Promise<CategoryResponse> => {
        const response = await apiCall<ApiResponse<CategoryResponse>>("/api/budaya/categories", {
            method: "POST",
            body: JSON.stringify(category),
        });
        return response.content;
    },

    // PUT /api/budaya/categories/{id}
    update: async (id: string, updates: Partial<Omit<CategoryResponse, "id">>): Promise<CategoryResponse> => {
        const response = await apiCall<ApiResponse<CategoryResponse>>(`/api/budaya/categories/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        });
        return response.content;
    },

    // DELETE /api/budaya/categories/{id}
    delete: async (id: string): Promise<{ ok: boolean }> => {
        return await apiCall<{ ok: boolean }>(`/api/budaya/categories/${id}`, {
            method: "DELETE",
        });
    },
};

// Items API
export const itemsApi = {
    // GET /api/budaya/items
    list: async (params?: { category?: string; q?: string }): Promise<ItemResponse[]> => {
        const searchParams = new URLSearchParams();
        if (params?.category) searchParams.set("category", params.category);
        if (params?.q) searchParams.set("q", params.q);

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/api/budaya/items?${queryString}` : "/api/budaya/items";

        const response = await apiCall<ApiResponse<ItemResponse[]>>(endpoint);
        return response.content;
    },

    // POST /api/budaya/items
    create: async (item: Omit<DetailedItem, "id">): Promise<ItemResponse> => {
        const response = await apiCall<ApiResponse<ItemResponse>>("/api/budaya/items", {
            method: "POST",
            body: JSON.stringify(item),
        });
        return response.content;
    },

    // PUT /api/budaya/items/{id}
    update: async (id: number, updates: Partial<Omit<DetailedItem, "id">>): Promise<ItemResponse> => {
        const response = await apiCall<ApiResponse<ItemResponse>>(`/api/budaya/items/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        });
        return response.content;
    },

    // DELETE /api/budaya/items/{id}
    delete: async (id: number): Promise<{ ok: boolean }> => {
        return await apiCall<{ ok: boolean }>(`/api/budaya/items/${id}`, {
            method: "DELETE",
        });
    },
};

// Error handling helper
export class ApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = "ApiError";
    }
}
