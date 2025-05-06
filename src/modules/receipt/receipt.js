const model = require('./model')
const JWT = require('../../lib/jwt')

module.exports = {
   LOGIN: async (req, res) => {
      try {
         const { login, password } = req.body

         if (login === "megaFarm" && password == "megaFarm123") {
            const token = await new JWT({ status: "OK" }).sign()
            return res.status(200).json({
               code: 0,
               message: "OK",
               data: { token: token }
            })
         } else {
            return res.status(401).json({
               status: 401,
               message: 'Unauthorized'
            })
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   CREATE_RECEIPT: async (req, res) => {
      try {
         const { method, params } = req.body
         const authHeader = req.headers['authorization'];
         const token = authHeader?.split(' ')[1] || null;
         const userStatus = new JWT(token).verify()

         if (!token && !userStatus) {
            return res.status(401).json({
               status: 401,
               message: 'Unauthorized'
            })
         }

         if (method !== "CreateReceipt") {
            return res.status(400).json({
               status: 400,
               message: "Baq request"
            })
         }

         const foundUser = await model.foundUser(params?.client)
         const totalPrice = params.payments.reduce((sum, payment) => sum + payment.value, 0);
         const bonus = totalPrice * 0.05;
         const paidBonus = params?.payments?.find(e => e.name === "BONUS" && e.value > 0) || null

         if (paidBonus) {
            await model.paidBonus(foundUser.id, paidBonus.value)
            await model.addBonusHistory(
               params.receipt_no,
               params?.client,
               paidBonus.value,
               false
            )
         }

         if (bonus > 0) {
            await model.addBonus(foundUser.id, bonus)
            await model.addBonusHistory(
               params.receipt_no,
               params?.client,
               bonus,
               true
            )
         }

         const addHistory = await model.addHistory(
            params.receipt_no,
            params.type,
            params.client,
            params.branch,
            params.created_date,
            params.payments,
            totalPrice,
            params.items
         )

         if (addHistory) {
            return res.status(200).json({
               code: 0,
               message: "OK",
               data: "OK"
            })
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad requests"
            })
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   }
}