const { fetch, fetchALL } = require('../../lib/postgres')

const messages = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         messages
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const messagesCount = () => {
   const QUERY = `
      SELECT
         count(*)
      FROM
         messages;
   `;

   return fetch(QUERY)
}
const foundMessage = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         messages
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const foundUsers = (balance_from, balance_to, bot_lang) => {
   const QUERY = `
      SELECT
         chat_id
      FROM
         users
      WHERE
         bot_lang = $1
         ${balance_from ? `and balance >= ${balance_from}` : ''}
         ${balance_to ? `and balance <= ${balance_to}` : ''}
      ORDER BY
         id DESC;

   `;

   return fetchALL(QUERY, bot_lang)
}
const addMessage = (
   text,
   balance_from,
   balance_to,
   bot_lang,
   fileUrl,
   fileName,
   mimeType
) => {
   const QUERY = `
      INSERT INTO
         messages (
            text,
            balance_from,
            balance_to,
            bot_lang,
            file_url,
            file_name,
            file_type
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      text,
      balance_from,
      balance_to,
      bot_lang,
      fileUrl,
      fileName,
      mimeType
   )
}
const deleteMessage = (id) => {
   const QUERY = `
      DELETE FROM 
         messages
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   messages,
   messagesCount,
   foundMessage,
   foundUsers,
   deleteMessage
}