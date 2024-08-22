import axiosAPI from "../axiosApi";

export async function getAllProducts(params = {}) {
    const response = await axiosAPI.get("products", { params: params });
    return response;
}

export async function getProductById(id) {
    const response = await axiosAPI.get(`products/` + id);
    return response;
}

export async function postProduct(data) {
    const response = await axiosAPI.post(`products`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateProduct(id, data) {
    const response = await axiosAPI.post(`products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteProductById(id) {
    const response = await axiosAPI.delete(`products/${id}`);
    return response;
}
