import axiosAPI from "../axiosApi";

export async function getAllOutcomeIndicatorTypes(params = {}) {
  const response = await axiosAPI.get("outcomeIndicatorTypes", {
    params: params
  });
  return response;
}

export async function getOutcomeIndicatorTypeById(id) {
  const response = await axiosAPI.get(`outcomeIndicatorTypes/${id}`);
  return response;
}

export async function postOutcomeIndicatorType(data) {
  const response = await axiosAPI.post(`outcomeIndicatorTypes`, data);
  return response;
}

export async function updateOutcomeIndicatorType(id, data) {
  const response = await axiosAPI.put(`outcomeIndicatorTypes/${id}`, data);
  return response;
}

export async function deleteOutcomeIndicatorTypeById(id) {
  const response = await axiosAPI.delete(`outcomeIndicatorTypes/${id}`);
  return response;
}
