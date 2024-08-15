import axiosAPI from "../axiosApi";

export async function getAllProductTypes(params = {}) {
    const response = await axiosAPI.get("product-types", { params: params });
    return response;
}

export async function getProductTypeById(id) {
    const response = await axiosAPI.get(`product-types/` + id);
    return response;
}

export async function postProductType(data) {
    const response = await axiosAPI.post(`product-types`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateProductType(id, data) {
    const response = await axiosAPI.post(`product-types/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteProductTypeById(id) {
    const response = await axiosAPI.delete(`product-types/${id}`);
    return response;
}
