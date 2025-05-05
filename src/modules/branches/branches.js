require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')

module.exports = {
   GET_LIST: async (req, res) => {
      try {
         const branchesList = await model.branchesList()

         if (branchesList?.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: branchesList
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

   GET_ID: async (req, res) => {
      try {
         const { id } = req.params

         const foundBranch = await model.foundBranch(id)

         if (foundBranch) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundBranch
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

   ADD_BRANCH: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            branch_id,
            name_uz,
            name_ru,
            phone_number,
            schedule,
            address_uz,
            address_ru,
            landmark_uz,
            landmark_ru,
            address_link,
            latitude,
            longitude
         } = req.body
         const imgUrl = uploadPhoto ? `${process.env.BACKEND_URL}/${uploadPhoto?.filename}` : null;
         const imgName = uploadPhoto ? uploadPhoto?.filename : null;

         const addBranch = await model.addBranch(
            branch_id,
            name_uz,
            name_ru,
            JSON.parse(phone_number),
            schedule,
            address_uz,
            address_ru,
            landmark_uz,
            landmark_ru,
            address_link,
            latitude,
            longitude,
            imgUrl,
            imgName
         )

         if (addBranch) {
            return res.status(201).json({
               status: 201,
               message: "Success",
               data: addBranch
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

   EDIT_BRANCH: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            id,
            branch_id,
            name_uz,
            name_ru,
            phone_number,
            schedule,
            address_uz,
            address_ru,
            landmark_uz,
            landmark_ru,
            address_link,
            latitude,
            longitude
         } = req.body
         const foundBranch = await model.foundBranch(id)
         let imgUrl = '';
         let imgName = '';

         if (!foundBranch) {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }

         if (uploadPhoto) {
            if (foundBranch?.image_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundBranch?.image_name}`))
               deleteOldAvatar.delete()
            }
            imgUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
            imgName = uploadPhoto?.filename;
         } else {
            imgUrl = foundBranch?.image_url
            imgName = foundBranch?.image_name;
         }

         const editBranch = await model.editBranch(
            id,
            branch_id,
            name_uz,
            name_ru,
            JSON.parse(phone_number),
            schedule,
            address_uz,
            address_ru,
            landmark_uz,
            landmark_ru,
            address_link,
            latitude,
            longitude,
            imgUrl,
            imgName
         )

         if (editBranch) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: editBranch
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

   DELETE_BRANCH: async (req, res) => {
      try {
         const { id } = req.params
         const foundBranch = await model.foundBranch(id)

         if (!foundBranch) {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }

         const deleteBranch = await model.deleteBranch(id)

         if (deleteBranch) {
            if (deleteBranch?.image_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${deleteBranch?.image_name}`))
               deleteOldAvatar.delete()
            }

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