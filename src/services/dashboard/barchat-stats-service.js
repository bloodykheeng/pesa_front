import axiosAPI from "../axiosApi";

export async function getAllProductBarChartStatistics(params = {}) {
    const response = await axiosAPI.get("product-barchat-stats", { params: params });
    return response;
}

export async function getAllCustomerBarChartStatistics(params = {}) {
    const response = await axiosAPI.get("customer-barchart-stats", { params: params });
    return response;
}
