const { fetch, fetchALL } = require('../../lib/postgres')

const branchesList = () => {
   const QUERY = `
      SELECT
         *
      FROM
         branches
      ORDER BY
         id DESC;
   `;

   return fetchALL(QUERY)
}
const branchesCount = () => {
   const QUERY = `
      SELECT
         count(*)
      FROM
         branches;
   `;

   return fetch(QUERY)
}
const foundBranch = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         branches
      WHERE 
         id = $1;
   `;

   return fetch(QUERY, id)
}
const addBranch = (
   branch_id,
   name_uz,
   name_ru,
   phone_number,
   schedule,
   address_uz,
   address_ru,
   landmark_uz,
   landmark_ru,
   address_link,
   latitude,
   longitude,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO
         branches (
            branch_id,
            name_uz,
            name_ru,
            phone_number,
            schedule,
            address_uz,
            address_ru,
            landmark_uz,
            landmark_ru,
            address_link,
            latitude,
            longitude,
            image_url,
            image_name
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      branch_id,
      name_uz,
      name_ru,
      phone_number,
      schedule,
      address_uz,
      address_ru,
      landmark_uz,
      landmark_ru,
      address_link,
      latitude,
      longitude,
      imgUrl,
      imgName
   )
}
const editBranch = (
   id,
   branch_id,
   name_uz,
   name_ru,
   phone_number,
   schedule,
   address_uz,
   address_ru,
   landmark_uz,
   landmark_ru,
   address_link,
   latitude,
   longitude,
   imgUrl,
   imgName
) => {
   const QUERY = `
      UPDATE
         branches
      SET
         branch_id = $2,
         name_uz = $3,
         name_ru = $4,
         phone_number = $5,
         schedule = $6,
         address_uz = $7,
         address_ru = $8,
         landmark_uz = $9,
         landmark_ru = $10,
         address_link = $11,
         latitude = $12,
         longitude = $13,
         image_url = $14,
         image_name = $15
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      branch_id,
      name_uz,
      name_ru,
      phone_number,
      schedule,
      address_uz,
      address_ru,
      landmark_uz,
      landmark_ru,
      address_link,
      latitude,
      longitude,
      imgUrl,
      imgName
   )
}
const deleteBranch = (id) => {
   const QUERY = `
      DELETE FROM
         branches
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   branchesList,
   branchesCount,
   foundBranch,
   addBranch,
   editBranch,
   deleteBranch
}