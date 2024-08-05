import axiosAPI from "../axiosApi";

export async function getAllDepartments(params = {}) {
    const response = await axiosAPI.get("departments", { params: params });
    return response;
}
export async function getDepartmentsForDahboardFilters(params = {}) {
    const response = await axiosAPI.get("getDepartmentsForDahboardFilters", {
        params: params,
    });
    return response;
}
export async function getDepartmentByProgramId(id) {
    const response = await axiosAPI.get(`departments/by-program/` + id);
    return response;
}

export async function getDepartmentApprovalDetails(id) {
    const response = await axiosAPI.get(`department-approval-details/` + id);
    return response;
}

export async function postDepartmentApprovalDetails(id, data) {
    const response = await axiosAPI.post(`department-approval-details/` + id, data);
    return response;
}

export async function getDepartmentById(id) {
    const response = await axiosAPI.get(`departments/` + id);
    return response;
}

export async function postDepartments(data) {
    const response = await axiosAPI.post(`departments`, data);
    return response;
}

export async function postToGetDepartmentDetailsWithOutcomes(data) {
    const response = await axiosAPI.post(`getDepartmentDetailsWithOutcomes`, data);
    return response;
}

export async function updateDepartments(id, data) {
    const response = await axiosAPI.put(`departments/${id}`, data);
    return response;
}

export async function deleteDepartmentById(id) {
    const response = await axiosAPI.delete(`departments/${id}`);
    return response;
}
