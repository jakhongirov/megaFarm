const { fetch, fetchALL } = require('../../lib/postgres')

const foundUser = (chat_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1;
   `;

   return fetch(QUERY, chat_id)
}
const paidBonus = (id, value) => {
   const QUERY = `
      UPDATE
         users
      SET
         balance = balance - $2
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, value)
}
const addBonus = (id, value) => {
   const QUERY = `
      UPDATE
         users
      SET
         balance = balance + $2
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, value)
}
const addBonusHistory = (
   receipt_no,
   client,
   value,
   income
) => {
   const QUERY = `
      INSERT INTO
         histories_bonus (
            receipt_no,
            user_id,
            amount,
            income
         ) VALUES (
            $1,
            $2,
            $3,
            $4
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      receipt_no,
      client,
      value,
      income
   )
}
const addHistory = (
   receipt_no,
   type,
   client,
   branch,
   created_date,
   payments,
   totalPrice,
   items
) => {
   const QUERY = `
      INSERT INTO
         histories (
            receipt_no,
            type,
            user_id,
            branch,
            date,
            payments,
            amount,
            items
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      receipt_no,
      type,
      client,
      branch,
      created_date,
      payments,
      totalPrice,
      items
   )
}

module.exports = {
   foundUser,
   paidBonus,
   addBonus,
   addBonusHistory,
   addHistory
}