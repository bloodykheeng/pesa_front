// const fun = (prop) => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(`done ${prop}`), 1000);
//   });
// };

// const go = async () => {
//   const list = [1, 2, 3];

//   for (const prop of list) {
//     console.log(prop);
//     console.log(await fun(prop));
//   }

//   console.log("done all");
// };

// go();

const getCountyUnderDistrict = (ids) => {
  console.log("The ids we want to fetch : ", ids);
  let data = new Promise((resolve, reject) => {
    const getCounties = async () => {
      let response = [];
      //for of loop which collects all using ids in the array
      for await (let id of ids) {
        let apiresponse = await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(id + 1);
          }, 2000);
        });
        console.log("adding : ", id);
        response = response.concat(apiresponse);
      }
      resolve(response);
    };
    getCounties();
  });
  return data;
};

const list = [1, 2, 3];

getCountyUnderDistrict(list).then((data) => {
  console.log("data got from the fetch is : ", data);
});
