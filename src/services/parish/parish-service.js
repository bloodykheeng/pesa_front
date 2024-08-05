import axiosAPI from "../axiosApi";

export async function getAllParish(params = {}) {
  const response = await axiosAPI.get("parish", { params: params });
  return response;
}

// subcounty-parish/{id}
export const getParishUnderSubCounty = (ids) => {
  let data = new Promise((resolve, reject) => {
    const getparishes = async () => {
      let response = [];
      //for of loop which collects all using ids in the array
      for await (let id of ids) {
        let apiresponse = await axiosAPI.get(`subcounty-parish/${id}`);
        response = response.concat(apiresponse.data);
      }
      resolve(response);
      // return response;
    };
    getparishes();
    // resolve(getparishes());
  });
  return data;
};
export async function getParishById(id) {
  const response = await axiosAPI.get(`parish` + id);
  return response;
}

export async function postParish(data) {
  const response = await axiosAPI.post(`parish`, data);
  return response;
}

export async function updateParish(id, data) {
  const response = await axiosAPI.put(`parish/${id}`, data);
  return response;
}

export async function deleteParishById(id) {
  const response = await axiosAPI.delete(`parish/${id}`);
  return response;
}
