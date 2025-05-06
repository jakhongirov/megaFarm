const { fetch, fetchALL } = require('./src/lib/postgres')

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
const createUser = (
   chatId,
   lang,
   code,
   qrcode_image,
   qrcode_image_url,
   step
) => {
   const QUERY = `
      INSERT INTO
         users (
            chat_id,
            bot_lang,
            code,
            qrcode_image,
            qrcode_image_url,
            bot_step
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      chatId,
      lang,
      code,
      qrcode_image,
      qrcode_image_url,
      step
   )
}
const editStep = (chatId, step) => {
   const QUERY = `
      UPDATE
         users
      SET
         bot_step = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, step)
}
const addPhoneUser = (chatId, phoneNumber) => {
   const QUERY = `
      UPDATE
         users
      SET
         phone_number = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, phoneNumber)
}
const addName = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         name = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}
const branches = (lang) => {
   const QUERY = `
      SELECT
         name_${lang} as name,
         phone_number,
         schedule,
         address_${lang} as address,
         landmark_${lang} as landmark,
         address_link,
         image_name
      FROM
         branches
      ORDER BY
         branch_id;
   `;

   return fetchALL(QUERY)
}
const historiesList = (chatId, offset) => {
   const QUERY = `
      SELECT
         id,
         amount,
         TO_CHAR(date::timestamp, 'DD.MM.YYYY') AS date_only
      FROM
         histories
      WHERE
         user_id = $1
      ORDER BY
         id DESC
      LIMIT 5
      OFFSET $2;
   `;

   return fetchALL(QUERY, chatId, offset)
}
const historiesCount = (chatId) => {
   const QUERY = `
      SELECT
         count(*)
      FROM
         histories
      WHERE
         user_id = $1;
   `;

   return fetch(QUERY, chatId)
}
const foundhistory = (id, lang) => {
   const QUERY = `
      SELECT
         h.id,
         b.name_${lang} as name,
         h.date,
         h.items,
         h.amount
      FROM
         histories h
      JOIN
         branches b
      ON
         b.branch_id = h.branch
      WHERE
         h.id = $1;
   `;

   return fetch(QUERY, id)
}
const foundnearBranch = (userLatitude, userLongitude, lang) => {
   const QUERY = `
      SELECT 
         name_${lang} as name,
         phone_number,
         schedule,
         address_${lang} as address,
         landmark_${lang} as landmark,
         address_link,
         image_name,
         (6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians($2)) + 
            sin(radians($1)) * sin(radians(latitude))
         )) AS distance
      FROM 
         branches
      ORDER BY 
         distance
      LIMIT 1;
   `;

   return fetch(QUERY, userLatitude, userLongitude)
}

module.exports = {
   foundUser,
   createUser,
   editStep,
   addPhoneUser,
   addName,
   branches,
   historiesList,
   historiesCount,
   foundhistory,
   foundnearBranch
}