// Helper functions untuk konsistensi API calls
export class ApiError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export async function apiFetch(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
            // Jika response bukan JSON
        }
        throw new ApiError(errorMessage, response.status);
    }

    try {
        return await response.json();
    } catch {
        return null;
    }
}

export async function apiPost(url, data, options = {}) {
    return apiFetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
    });
}

export async function apiPut(url, data, options = {}) {
    return apiFetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options,
    });
}

export async function apiDelete(url, options = {}) {
    return apiFetch(url, {
        method: 'DELETE',
        ...options,
    });
}

export async function apiUpload(url, formData, options = {}) {
    return apiFetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            // Jangan set Content-Type untuk FormData, browser akan set otomatis
            ...(options.headers || {}),
        },
        ...options,
    });
}

// Helper untuk validasi
export function validateRequired(value, fieldName) {
    if (!value || value.trim().length === 0) {
        throw new ApiError(`${fieldName} wajib diisi`, 400);
    }
    return value.trim();
}

export function validateMinLength(value, fieldName, minLength) {
    if (value.length < minLength) {
        throw new ApiError(`${fieldName} minimal ${minLength} karakter`, 400);
    }
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError('Format email tidak valid', 400);
    }
}

// Helper untuk response format

export function successResponse(data, message = 'Success') {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
}

export function errorResponse(message, status = 500) {
    return {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
    };
}