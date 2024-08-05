import axiosAPI from '../axiosApi'

export async function getAllDistricts(params = {}) {
  const response = await axiosAPI.get('districts', { params: params })
  return response
}

export async function getDistrictsById(id) {
  const response = await axiosAPI.get(`districts/` + id)
  return response
}

export async function postDistricts(data) {
  const response = await axiosAPI.post(`districts`, data)
  return response
}

export async function updateDistricts(id, data) {
  const response = await axiosAPI.put(`districts/${id}`, data)
  return response
}

export async function deleteDistrictById(id) {
  const response = await axiosAPI.delete(`districts/${id}`)
  return response
}
