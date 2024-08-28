import axiosAPI from "../axiosApi";

export async function getAllPackagePayments(params = {}) {
    const response = await axiosAPI.get("package-payments", { params: params });
    return response;
}

export async function getPackagePaymentById(id) {
    const response = await axiosAPI.get(`package-payments/` + id);
    return response;
}

export async function postPackagePayment(data) {
    const response = await axiosAPI.post(`package-payments`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updatePackagePayment(id, data) {
    const response = await axiosAPI.post(`package-payments/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deletePackagePaymentById(id) {
    const response = await axiosAPI.delete(`package-payments/${id}`);
    return response;
}
