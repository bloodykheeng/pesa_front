import axiosAPI from '../axiosApi'

export async function getAllTowncity(params = {}) {
  const response = await axiosAPI.get('town-city', { params: params })
  return response
}

export async function getTowncityById(id) {
  const response = await axiosAPI.get(`town-city` + id)
  return response
}
// district-towncity

export const gettowncityUnderDistrict = (ids) => {
  console.log(ids)
  let data = new Promise((resolve, reject) => {
    const gettowncities = async () => {
      let response = []
      //for of loop which collects all using ids in the array
      for await (let id of ids) {
        let apiresponse = await axiosAPI.get(`district-towncity/${id}`)
        response = response.concat(apiresponse.data)
      }
      return response
    }
    resolve(gettowncities())
  })
  return data
}

export async function postTowncity(data) {
  const response = await axiosAPI.post(`town-city`, data)
  return response
}

export async function updateTowncity(id, data) {
  const response = await axiosAPI.put(`town-city/${id}`, data)
  return response
}

export async function deleteTowncityById(id) {
  const response = await axiosAPI.delete(`town-city/${id}`)
  return response
}
