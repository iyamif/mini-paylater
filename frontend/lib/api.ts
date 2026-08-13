const isProduction =
    typeof window !== "undefined"
        ? window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
        : process.env.NODE_ENV === "production";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (isProduction
        ? "https://mini-paylater-api.onrender.com"
        : "http://localhost:8080");

export interface CreateLoanRequest {
    customer_name: string;
    loan_amount: number;
    tenor: number;
    interest_rate: number;
}

export interface Installment {
    id: number;
    month_number: number;
    due_date: string;
    amount_due: number;
    status: string;
}

export interface Loan {
    id: number;
    customer_name: string;
    loan_amount: number;
    tenor: number;
    interest_rate: number;
    total_interest: number;
    total_amount: number;
    created_at: string;
    installments: Installment[];
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export async function createLoan(
    payload: CreateLoanRequest
): Promise<Loan> {
    const response = await fetch(`${API_URL}/api/loans`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const result: ApiResponse<Loan> = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to create loan");
    }

    return result.data;
}

export async function getLoan(id: number): Promise<Loan> {
    const response = await fetch(`${API_URL}/api/loans/${id}`);

    const result: ApiResponse<Loan> = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to get loan");
    }

    return result.data;
}