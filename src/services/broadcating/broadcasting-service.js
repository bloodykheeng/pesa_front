import axiosAPI from "../axiosApi";

export async function postBroadcast(data) {
    const response = await axiosAPI.post(`packages`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}
