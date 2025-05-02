const model = require('./model')

module.exports = {
   GET_LIST: async (req, res) => {
      try {
         const { limit, page, phone } = req.query

         if (limit && page) {
            const usersList = await model.usersList(limit, page, phone)

            if (usersList?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: usersList
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

   GET_ID: async (req, res) => {
      try {
         const {
            id
         } = req.params
         const foundUser = await model.foundUser(id)

         if (foundUser) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundUser
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

   GET_CODE: async (req, res) => {
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

         if (method !== "GetBalance") {
            return res.status(400).json({
               status: 400,
               message: "Baq request"
            })
         }

         const findUserCode = await model.findUserCode(params?.scan_code)

         if (findUserCode) {
            return res.status(200).json({
               code: 0,
               message: "OK",
               data: {
                  id: findUserCode.chat_id,
                  name: findUserCode.name,
                  balance: findUserCode.balance,
                  scan_code: findUserCode.code
               }
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

   EDIT_USER: async (req, res) => {
      try {
         const {
            id,
            name,
            balance
         } = req.body
         const checkUser = await model.foundUser(id)

         if (!checkUser) {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }

         if (name && name !== 'null') {
            await model.editName(id, name)
         }

         if (balance && balance !== 'null') {
            await model.editBalance(id, balance)
         }

         const foundUser = await model.foundUser(id)

         if (foundUser) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundUser
            })
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

   DELETE_USER: async (req, res) => {
      try {
         const { id } = req.params

         const deleteUser = await model.deleteUser(id)

         if (deleteUser) {
            return res.status(200).json({
               status: 200,
               message: "Success"
            })
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
   }
}