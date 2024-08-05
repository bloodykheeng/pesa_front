import axiosAPI from "../axiosApi";

export async function getAllVillage(params = {}) {
    const response = await axiosAPI.get("village", { params: params });
    return response;
}

// parish-village/{id}
export const getVillageUnderParish = (ids) => {
    console.log("the ids to get data under : ", ids);
    let data = new Promise((resolve, reject) => {
        const getvillages = async () => {
            let response = [];
            //for of loop which collects all using ids in the array
            for await (let id of ids) {
                let apiresponse = await axiosAPI.get(`parish-village/${id}`);
                response = response.concat(apiresponse.data);
            }
            resolve(response);
            // return response;
        };
        getvillages();
        // resolve(getvillages());
    });
    return data;
};

export async function getVillageById(id) {
    const response = await axiosAPI.get(`village/` + id);
    return response;
}

export async function postVillage(data) {
    const response = await axiosAPI.post(`village`, data);
    return response;
}

export async function updateVillage(id, data) {
    const response = await axiosAPI.put(`village/${id}`, data);
    return response;
}

export async function deleteVillageById(id) {
    const response = await axiosAPI.delete(`village/${id}`);
    return response;
}
