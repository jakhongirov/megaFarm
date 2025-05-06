const { fetch, fetchALL } = require('../../lib/postgres')

const usersList = (limit, page, phone) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      ${phone ? `WHERE phone_number ilike '%${phone}%'` : ""}
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const usersCount = (phone) => {
   const QUERY = `
      SELECT
         count(*)
      FROM
         users
      ${phone ? `WHERE phone_number ilike '%${phone}%'` : ""}
   `;

   return fetchALL(QUERY)
}
const foundUser = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const findUserCode = (code) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         code = $1;
   `;

   return fetch(QUERY, code)
}
const editName = (id, name) => {
   const QUERY = `
      UPDATE
         users
      SET
         name = $2
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, name)
}
const editBalance = (id, balance) => {
   const QUERY = `
      UPDATE
         users
      SET
         balance = $2
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, balance)
}
const deleteUser = (id) => {
   const QUERY = `
      DELETE FROM
         users
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   usersList,
   usersCount,
   foundUser,
   findUserCode,
   editName,
   editBalance,
   deleteUser
}