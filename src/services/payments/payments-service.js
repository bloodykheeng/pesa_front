import axiosAPI from "../axiosApi";

export async function getAllPayments(params = {}) {
    const response = await axiosAPI.get("payments", { params: params });
    return response;
}

export async function getPaymentById(id) {
    const response = await axiosAPI.get(`payments/` + id);
    return response;
}

export async function postPayment(data) {
    const response = await axiosAPI.post(`payments`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updatePayment(id, data) {
    const response = await axiosAPI.post(`payments/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deletePaymentById(id) {
    const response = await axiosAPI.delete(`payments/${id}`);
    return response;
}
