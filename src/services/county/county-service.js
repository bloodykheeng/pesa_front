import axiosAPI from "../axiosApi";

export async function getAllCounty(params = {}) {
  const response = await axiosAPI.get("county", { params: params });
  return response;
}

export async function getCountyById(id) {
  const response = await axiosAPI.get(`county` + id);
  return response;
}

// district-county/{id}

export const getCountyUnderDistrict = (ids) => {
  console.log("The district ids we are going to use to fetch counties : ", ids);
  let data = new Promise((resolve, reject) => {
    const getCounties = async () => {
      let response = [];
      //for of loop which collects all using ids in the array
      for await (let id of ids) {
        let apiresponse = await axiosAPI.get(`district-county/${id}`);
        response = response.concat(apiresponse.data);
      }
      resolve(response);
      // return response;
    };
    getCounties();
    // resolve(getCounties());
  });
  return data;
};

export async function postCounty(data) {
  const response = await axiosAPI.post(`county`, data);
  return response;
}

export async function updateCounty(id, data) {
  const response = await axiosAPI.put(`county/${id}`, data);
  return response;
}

export async function deleteCountyById(id) {
  const response = await axiosAPI.delete(`county/${id}`);
  return response;
}

// {"completion": "24324",
// "completion_status": "undefined",
// "contract_amount": "42454",
// "contractor": "whatsapp",
// "department_id": "8",
// "estimated_cost": "332433",
// "funding": "42423",
// "location_type": "Inter-District",
// "name":"pumping",
// "o_m_structure": "we are pumping water",
// "per_capita_investment_cost": "44323",
// "procurement_no": "234324",
// "project_id": "3",
// "proposed_end_date": "2023-01-05",
// "start_date": "2023-01-06",
// "status": "Ongoing",
// "supervisor": "Internal"}
