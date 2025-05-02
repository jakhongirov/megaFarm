const model = require('./model')

module.exports = {
   GET_HISTORIES: async (req, res) => {
      try {
         const { limit, page, user_id, receipt_no } = req.query

         if (limit && page) {
            const historiesList = await model.historiesList(limit, page, user_id, receipt_no)

            if (historiesList?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: historiesList
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
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

   GET_HISTORY_ID: async (req, res) => {
      try {
         const { id } = req.params
         const foundHistory = await model.foundHistory(id)

         if (foundHistory) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundHistory
            })
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
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

   GET_BONUS_HISTORY: async (req, res) => {
      try {
         const { limit, page, user_id, receipt_no } = req.query

         if (limit && page) {
            const bonusHistoriesList = await model.bonusHistoriesList(
               limit,
               page,
               user_id,
               receipt_no
            )

            if (bonusHistoriesList?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: bonusHistoriesList
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
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

   GET_BONUS_HISTORY_ID: async (req, res) => {
      try {
         const { id } = req.params
         const foundBonusHistory = await model.foundBonusHistory(id)

         if (foundBonusHistory) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundBonusHistory
            })
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
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
}