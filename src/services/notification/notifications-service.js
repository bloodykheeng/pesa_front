import axiosAPI from "../axiosApi";

export async function postTosendNotification(data) {
    const response = await axiosAPI.post(`send-notification`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}
