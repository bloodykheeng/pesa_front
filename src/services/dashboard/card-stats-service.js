import axiosAPI from "../axiosApi";

export async function getAllOrderStatistics(params = {}) {
    const response = await axiosAPI.get("order-statistics", { params: params });
    return response;
}

export async function getAllPackageStatistics(params = {}) {
    const response = await axiosAPI.get("package-statistics", { params: params });
    return response;
}

export async function getAllCustomerStatistics(params = {}) {
    const response = await axiosAPI.get("customer-statistics", { params: params });
    return response;
}

export async function getAllTransactionStatistics(params = {}) {
    const response = await axiosAPI.get("transaction-statistics", { params: params });
    return response;
}
