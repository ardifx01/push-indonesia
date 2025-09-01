const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3300";

// Types for API responses
type ApiResponse<T> = {
    content: T;
    err?: any;
    status?: string;
};

export type Contribution = {
    id: number;
    title: string;
    category: string;
    region: string;
    contributor: string;
    status: "pending" | "approved" | "rejected";
    attachments: number;
    createdAt: string;
};

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

// Contributions API
export const contributionsApi = {
    // GET /api/contributions
    list: async (): Promise<Contribution[]> => {
        const response = await apiCall<ApiResponse<Contribution[]>>("/api/contributions");
        return response.content;
    },

    // PATCH /api/contributions/{id}
    updateStatus: async (id: number, status: "pending" | "approved" | "rejected"): Promise<{ id: number; status: string }> => {
        const response = await apiCall<ApiResponse<{ id: number; status: string }>>(`/api/contributions/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });
        return response.content;
    },
};

// Error handling helper
export class ApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = "ApiError";
    }
}
