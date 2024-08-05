import axiosAPI from "../axiosApi";

export async function getAllSubcounty(params = {}) {
  const response = await axiosAPI.get("subcounty", { params: params });
  return response;
}

// county-subcounty/{id}
export const getSubcountyUnderCounty = (ids) => {
  console.log("the ids to get data under : ", ids);
  let data = new Promise((resolve, reject) => {
    const getSubCounties = async () => {
      let response = [];
      //for of loop which collects all using ids in the array
      for await (let id of ids) {
        let apiresponse = await axiosAPI.get(`county-subcounty/${id}`);
        response = response.concat(apiresponse.data);
      }
      resolve(response);
      // return response;
    };
    getSubCounties();
    // resolve(getSubCounties());
  });
  return data;
};
export async function getSubcountyById(id) {
  const response = await axiosAPI.get(`subcounty` + id);
  return response;
}

export async function postSubcounty(data) {
  const response = await axiosAPI.post(`subcounty`, data);
  return response;
}

export async function updateSubcounty(id, data) {
  const response = await axiosAPI.put(`subcounty/${id}`, data);
  return response;
}

export async function deleteSubcountyById(id) {
  const response = await axiosAPI.delete(`subcounty/${id}`);
  return response;
}
