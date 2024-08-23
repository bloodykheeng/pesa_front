import axiosAPI from "../axiosApi";

export async function postMessage(data) {
    const response = await axiosAPI.post(`chat-messages`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}
