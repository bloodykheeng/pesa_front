import axiosAPI from "../axiosApi";

export async function getAllProductCategoryBrands(params = {}) {
    const response = await axiosAPI.get("category-brands", { params: params });
    return response;
}

export async function getProductCategoryBrandById(id) {
    const response = await axiosAPI.get(`category-brands/` + id);
    return response;
}

export async function postProductCategoryBrand(data) {
    const response = await axiosAPI.post(`category-brands`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateProductCategoryBrand(id, data) {
    const response = await axiosAPI.post(`category-brands/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteProductCategoryBrandById(id) {
    const response = await axiosAPI.delete(`category-brands/${id}`);
    return response;
}
