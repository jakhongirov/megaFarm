const { fetch, fetchALL } = require('../../lib/postgres')

const monthlyAmountBranches = () => {
   const QUERY = `
      SELECT
         b.branch_id,
         b.name_uz,
         TO_CHAR(DATE_TRUNC('month', h.date::timestamp), 'Month') AS month,
         SUM(h.amount) AS total_amount
      FROM
         histories h
      JOIN
         branches b
      ON
         h.branch = b.branch_id
      WHERE
         h.date::timestamp >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months'
      GROUP BY
         b.branch_id, b.name_uz, DATE_TRUNC('month', h.date::timestamp)
      ORDER BY 
         b.branch_id, month;
   `;

   return fetchALL(QUERY)
}
const currentMonthStatis = () => {
   const QUERY = `
      WITH history_totals AS (
         SELECT
            b.branch_id,
            b.name_uz,
            SUM(h.amount) AS total_amount
         FROM histories h
         JOIN branches b ON h.branch = b.branch_id
         WHERE DATE_TRUNC('month', h.date::timestamp) = DATE_TRUNC('month', CURRENT_DATE)
         GROUP BY b.branch_id, b.name_uz
      ),
      bonus_total AS (
         SELECT
            SUM(CASE WHEN hb.income THEN hb.amount ELSE -hb.amount END) AS total_bonus
         FROM histories_bonus hb
         JOIN histories h ON hb.receipt_no = h.receipt_no
         WHERE DATE_TRUNC('month', h.date::timestamp) = DATE_TRUNC('month', CURRENT_DATE)
      ),
      user_counts AS (
         SELECT COUNT(DISTINCT user_id) AS unique_users
         FROM (
            SELECT user_id FROM histories
            WHERE DATE_TRUNC('month', date::timestamp) = DATE_TRUNC('month', CURRENT_DATE)
            UNION
            SELECT hb.user_id FROM histories_bonus hb
            JOIN histories h ON hb.receipt_no = h.receipt_no
            WHERE DATE_TRUNC('month', h.date::timestamp) = DATE_TRUNC('month', CURRENT_DATE)
         ) AS all_users
      )
      SELECT
         ht.branch_id,
         ht.name_uz,
         ht.total_amount,
         bt.total_bonus,
         uc.unique_users
      FROM history_totals ht
      CROSS JOIN bonus_total bt
      CROSS JOIN user_counts uc
      ORDER BY ht.branch_id;
   `;

   return fetchALL(QUERY)
}
const totalAmount = () => {
   const QUERY = `
      SELECT
         sum(amount)
      FROM
         histories;
   `;

   return fetch(QUERY)
}
const totalBonus = () => {
   const QUERY = `
      SELECT
         sum(amount)
      FROM
         histories_bonus;
   `;

   return fetch(QUERY)
}
const totalUser = () => {
   const QUERY = `
      SELECT
         count(chat_id)
      FROM
         users;
   `;

   return fetch(QUERY)
}
const totalReceipt = () => {
   const QUERY = `
      SELECT
         count(receipt_no)
      FROM
         histories;
   `;

   return fetch(QUERY)
}

module.exports = {
   monthlyAmountBranches,
   currentMonthStatis,
   totalAmount,
   totalBonus,
   totalUser,
   totalReceipt,
}