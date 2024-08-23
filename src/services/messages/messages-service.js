import axiosAPI from "../axiosApi";

export async function getAllMessages(params = {}) {
    const response = await axiosAPI.get("chat-messages", { params: params });
    return response;
}

export async function postMessage(data) {
    const response = await axiosAPI.post(`chat-messages`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateMessage(id, data) {
    const response = await axiosAPI.post(`chat-messages/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteMessageById(id) {
    const response = await axiosAPI.delete(`chat-messages/${id}`);
    return response;
}
