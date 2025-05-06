const { fetch, fetchALL } = require('../../lib/postgres')

const historiesList = (limit, page, user_id, receipt_no) => {
   const QUERY = `
      SELECT
         *
      FROM
         histories
      ${user_id && receipt_no ? `WHERE user_id = ${user_id} and receipt_no = ${receipt_no}` : user_id ? `WHERE user_id = ${user_id}` : receipt_no ? `WHERE receipt_no = ${receipt_no}` : ''}
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const historiesCount = (user_id, receipt_no) => {
   const QUERY = `
      SELECT
         count(*)
      FROM
         histories
      ${user_id && receipt_no ? `WHERE user_id = ${user_id} and receipt_no = ${receipt_no}` : user_id ? `WHERE user_id = ${user_id}` : receipt_no ? `WHERE receipt_no = ${receipt_no}` : ''}
   `;

   return fetch(QUERY)
}
const foundHistory = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         histories
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const bonusHistoriesList = (
   limit,
   page,
   user_id,
   receipt_no
) => {
   const QUERY = `
      SELECT
         *
      FROM
         histories_bonus
      ${user_id && receipt_no ? `WHERE user_id = ${user_id} and receipt_no = ${receipt_no}` : user_id ? `WHERE user_id = ${user_id}` : receipt_no ? `WHERE receipt_no = ${receipt_no}` : ''}
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const foundBonusHistory = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         histories_bonus
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}


module.exports = {
   historiesList,
   historiesCount,
   foundHistory,
   bonusHistoriesList,
   foundBonusHistory
}