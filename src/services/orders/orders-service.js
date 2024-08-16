import axiosAPI from "../axiosApi";

export async function getAllOrders(params = {}) {
    const response = await axiosAPI.get("orders", { params: params });
    return response;
}

export async function getOrderById(id) {
    const response = await axiosAPI.get(`orders/` + id);
    return response;
}

export async function postOrder(data) {
    const response = await axiosAPI.post(`orders`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateOrder(id, data) {
    const response = await axiosAPI.post(`orders/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteOrderById(id) {
    const response = await axiosAPI.delete(`orders/${id}`);
    return response;
}
