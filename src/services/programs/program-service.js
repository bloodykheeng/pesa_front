import axiosAPI from "../axiosApi";

export async function getAllPrograms(params = {}) {
  const response = await axiosAPI.get("programs", { params: params });
  return response;
}

export async function getProgramById(id) {
  const response = await axiosAPI.get(`programs/` + id);
  return response;
}

export async function postPrograms(data) {
  const response = await axiosAPI.post(`programs`, data);
  return response;
}

export async function updatePrograms(id, data) {
  const response = await axiosAPI.put(`programs/${id}`, data);
  return response;
}

export async function deleteProgramById(id) {
  const response = await axiosAPI.delete(`programs/${id}`);
  return response;
}
// "activity-logs";

export async function getProgramsHireachy(params = {}) {
  const response = await axiosAPI.get("programs-hierachy", { params: params });
  return response;
}
