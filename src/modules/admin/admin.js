const model = require('./model')
const JWT = require('../../lib/jwt')
const bcryptjs = require('bcryptjs')

module.exports = {
   GET_ADMIN: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const adminList = await model.adminList(limit, page)

            if (adminList) {
               return res.json({
                  status: 200,
                  message: "Success",
                  data: adminList
               })
            } else {
               return res.json({
                  status: 404,
                  message: "Bad request"
               })
            }

         } else {
            return res.json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error)
         res.json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   },

   REGISTER_ADMIN: async (req, res) => {
      try {
         const { admin_email, admin_password, role } = req.body
         const checkAdmin = await model.checkAdmin(admin_email)
         if (!checkAdmin) {
            const pass_hash = await bcryptjs.hash(admin_password, 10)
            const registerAdmin = await model.registerAdmin(admin_email, pass_hash, role)

            if (registerAdmin) {
               const token = await new JWT({ id: registerAdmin.user_id }).sign()

               return res.json({
                  status: 200,
                  message: "Success",
                  data: registerAdmin,
                  token: token
               })
            }

         } else {
            return res.json({
               status: 302,
               message: "Found"
            })
         }

      } catch (error) {
         console.log(error)
         res.json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   },

   LOGIN_ADMIN: async (req, res) => {
      try {
         const { admin_email, admin_password } = req.body
         const checkAdmin = await model.checkAdmin(admin_email)

         if (checkAdmin) {
            const validPass = await bcryptjs.compare(admin_password, checkAdmin.admin_password)

            if (validPass) {
               const token = await new JWT({ id: checkAdmin.admin_id }).sign()
               return res.json({
                  status: 200,
                  message: "Success",
                  data: checkAdmin,
                  token: token
               })
            } else {
               return res.json({
                  status: 401,
                  message: "Unauthorized"
               })
            }

         } else {
            return res.json({
               status: 404,
               message: "Not Found"
            })
         }

      } catch (error) {
         console.log(error)
         res.json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   },

   EDIT_ADMIN: async (req, res) => {
      try {
         const { admin_id, admin_email, admin_password, role } = req.body
         const checkAdminById = await model.checkAdminById(admin_id)

         if (checkAdminById) {
            if (admin_password) {
               const pass_hash = await bcryptjs.hash(admin_password, 10)
               const editAdminPass = await model.editAdminPass(admin_id, admin_email, pass_hash, role)

               if (editAdminPass) {
                  return res.json({
                     status: 200,
                     message: "Success",
                     data: editAdminPass
                  })
               } else {
                  return res.json({
                     status: 400,
                     message: "Bad request"
                  })
               }

            } else {
               const editEmail = await model.editEmail(admin_id, admin_email, role)

               if (editEmail) {
                  return res.json({
                     status: 200,
                     message: "Success",
                     data: editEmail
                  })
               } else {
                  return res.json({
                     status: 400,
                     message: "Bad request"
                  })
               }
            }

         } else {
            return res.json({
               status: 404,
               message: "Not found"
            })
         }

      } catch (error) {
         console.log(error)
         res.json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   },

   DELETE_ADMIN: async (req, res) => {
      try {
         const { admin_id } = req.body

         if (admin_id) {
            const deleteAdmin = await model.deleteAdmin(admin_id)
            if (deleteAdmin) {
               return res.json({
                  status: 200,
                  message: "Success",
                  data: deleteAdmin
               })
            }
         } else {
            return res.json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error)
         res.json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   }
}