const express = require("express")
const router = express.Router()

//Middlawares
const {
   AUTH
} = require('../middleware/auth')
const FileUpload = require('../middleware/multer')

// files
const admin = require('./admin/admin')
const users = require('./users/users')
const branches = require('./branches/branches')
const receipt = require('./receipt/receipt')
const histories = require('./histories/histories')

router

   /**
    * components:
    *    securitySchemes:
    *       token:
    *       type: apiKey
    *       in: header
    *       name: token
    */

   /**
    * components:
    *    securitySchemes:
    *       bearerAuth:
    *         type: http
    *         scheme: bearer
    *         bearerFormat: JWT
    */

   // ADMIN API
   /** 
   * @swagger
   * components: 
   *     schemas: 
   *       Admin:
   *          type: object
   *          required: 
   *             - admin_email
   *             - admin_password
   *          properties:
   *             admin_id: 
   *                type: integer
   *                description: auto generate
   *             admin_email: 
   *                type: string
   *                description: admin's email
   *             admin_password:
   *                type: string
   *                description: admin put password for login and it hashing
   *             admin_create_at:
   *                type: string
   *                description: admin created date
   *          example:
   *             admin_id: 1
   *             admin_email: diyor.jakhongirov@gmail.com
   *             admin_password: 2jk3jnnj3nj43nb4j3bjeb3b23j
   *             admin_create_at: 2024-01-23 10:52:41 +0000
  */

   /**
   * @swagger
   * tags:
   *    name: Admin
   *    description: Admin managing API
   */

   /**
   * @swagger
   * /admin/list:
   *   get:
   *     summary: Returns the list of all the admins for Frontend developer
   *     tags: [Admin]
   *     security:
   *       - token: []
   *     parameters:
   *        - in: header
   *          name: token
   *          required: true
   *          schema:
   *             type: string
   *          description: Authentication token
   *        - in: query
   *          name: limit
   *          schema:
   *             type: integer
   *          description: limit of list
   *        - in: query
   *          name: page
   *          schema:
   *             type: integer
   *          description: page of list
   *     responses:
   *       '200':
   *          description: The list of the admins
   *          content:
   *             application/json:
   *                schema:
   *                   type: array
   *                items:
   *                   $ref: '#/components/schemas/Admin'
   *          headers:
   *             token:
   *                description: Token for authentication
   *                schema:
   *                type: string
   *       '500':
   *          description: Some server error
   */
   .get('/admin/list', AUTH, admin.GET_ADMIN)

   /**
   * @swagger
   * /admin/register:
   *    post:
   *       summary: Register new admin for Frontend developer
   *       tags: [Admin]
   *       requestBody:
   *          required: true
   *          content: 
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: Created new admin
   *             content:
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin'
   *          500:
   *             description: Some server error
   */
   .post('/admin/register', admin.REGISTER_ADMIN)

   /**
   * @swagger
   * /admin/login:
   *    post:
   *       summary: Login admin for Frontend developer
   *       tags: [Admin]
   *       requestBody:
   *          required: true
   *          content:
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: You logined
   *             content: 
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin' 
   *          500:
   *             description: Server error
   */
   .post('/admin/login', admin.LOGIN_ADMIN)

   /**
   * @swagger
   * /admin/edit:
   *    put:
   *       summary: Change admin's email and password for Frontend developer
   *       tags: [Admin]
   *       parameters:
   *        - in: header
   *          name: token
   *          required: true
   *          schema:
   *             type: string
   *          description: Authentication token      
   *       security:
   *          - token: []
   *       requestBody:
   *          required: true
   *          content:
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: Changed data
   *             content: 
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin' 
   *             headers:
   *                token:
   *                   description: Token for authentication
   *                   schema:
   *                   type: string
   *          500:
   *             description: Server error
   */
   .put('/admin/edit', AUTH, admin.EDIT_ADMIN)

   /**
    * @swagger
    * /admin/delete:
    *    delete:
    *       summary: Delete admin for Frontend developer
    *       tags: [Admin]
    *       parameters:
    *        - in: header
    *          name: token
    *          required: true
    *          schema:
    *             type: string
    *          description: Authentication token 
    *       security:
    *          - token: []
    *       requestBody:
    *          required: true
    *          content:
    *             application/json:
    *                schema:
    *                   $ref: '#/components/schemas/Admin'
    *       responses:
    *          200:
    *             description: Deleted admin
    *             content: 
    *                application/json:
    *                   schema:
    *                      $ref: '#/components/schemas/Admin' 
    *             headers:
    *                token:
    *                   description: Token for authentication
    *                   schema:
    *                   type: string
    *          500:
    *             description: Server error
    */
   .delete('/admin/delete', AUTH, admin.DELETE_ADMIN)

   // USERS
   /**
    * @swagger
    * components:
    *   schemas:
    *     Users:
    *       type: object
    *       properties:
    *         id:
    *           type: integer
    *           example: 1
    *         name:
    *           type: string
    *           example: John Doe
    *         phone_number:
    *           type: string
    *           example: "+1234567890"
    *         code:
    *           type: string
    *           example: "ABCD1234"
    *         balance:
    *           type: integer
    *           example: 100000
    *         qrcode_image:
    *           type: string
    *           example: "qrcodes/1234.png"
    *         qrcode_image_url:
    *           type: string
    *           example: "https://yourdomain.com/qrcodes/1234.png"
    *         chat_id:
    *           type: integer
    *           example: 123456789
    *         bot_lang:
    *           type: string
    *           example: "en"
    *         bot_step:
    *           type: string
    *           example: "step_1"
    *         created_at:
    *           type: string
    *           format: date-time
    *           example: "2025-04-28T12:34:56.789Z"
    */

   /**
    * @swagger
    * tags:
    *    name: Users
    *    description: Users managing API
    */

   /**
    * @swagger
    * /users/list:
    *   get:
    *     summary: Get a list of users
    *     tags: [Users]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *       - in: query
    *         name: limit
    *         required: true
    *         schema:
    *           type: integer
    *         description: Number of users per page
    *       - in: query
    *         name: page
    *         required: true
    *         schema:
    *           type: integer
    *         description: Page number
    *       - in: query
    *         name: phone
    *         required: false
    *         schema:
    *           type: string
    *         description: Filter users by phone number
    *     responses:
    *       '200':
    *         description: List of users successfully retrieved
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/Users'
    *       '400':
    *         description: Bad request (missing limit or page)
    *       '404':
    *         description: No users found
    *       '500':
    *         description: Server error
    */
   .get('/users/list', AUTH, users.GET_LIST)

   /**
    * @swagger
    * /user/{id}:
    *   get:
    *     summary: Get user by ID
    *     tags: [Users]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: User ID
    *     responses:
    *       '200':
    *         description: User found successfully
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/User'
    *       '404':
    *         description: User not found
    *       '500':
    *         description: Server error
    */
   .get('/user/:id', AUTH, users.GET_ID)

   /**
    * @swagger
    * /user:
    *   post:
    *     summary: Get user balance by scan code. It is for ePos
    *     tags: [Users]
    *     security:
    *       - bearerAuth: []
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               method:
    *                 type: string
    *                 example: GetBalance
    *               params:
    *                 type: object
    *                 properties:
    *                   scan_code:
    *                     type: string
    *                     example: "your_scan_code_here"
    *     responses:
    *       '200':
    *         description: User balance retrieved successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 code:
    *                   type: integer
    *                   example: 0
    *                 message:
    *                   type: string
    *                   example: OK
    *                 data:
    *                   type: object
    *                   properties:
    *                     id:
    *                       type: integer
    *                       example: 123456789
    *                     name:
    *                       type: string
    *                       example: John Doe
    *                     balance:
    *                       type: integer
    *                       example: 50000
    *                     scan_code:
    *                       type: string
    *                       example: "your_scan_code_here"
    *       '400':
    *         description: Bad request (wrong method or invalid input)
    *       '404':
    *         description: User not found
    *       '500':
    *         description: Server error
    */
   .post('/user', users.GET_CODE)

   /**
    * @swagger
    * /user/edit:
    *   put:
    *     summary: Edit user details (name and/or balance)
    *     tags: [Users]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               id:
    *                 type: integer
    *                 example: 1
    *               name:
    *                 type: string
    *                 example: John Doe
    *               balance:
    *                 type: integer
    *                 example: 10000
    *             required:
    *               - id
    *     responses:
    *       '200':
    *         description: User updated successfully
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Users'
    *       '400':
    *         description: Bad request
    *       '404':
    *         description: User not found
    *       '500':
    *         description: Server error
    */
   .put('/user/edit', AUTH, users.EDIT_USER)

   /**
    * @swagger
    * /user/delete/{id}:
    *   delete:
    *     summary: Delete a user by ID
    *     tags: [Users]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: User's ID to delete
    *     responses:
    *       '200':
    *         description: User deleted successfully
    *       '400':
    *         description: Bad request (e.g., user not found)
    *       '500':
    *         description: Server error
    */
   .delete('/user/delete/:id', AUTH, users.DELETE_USER)

   // BRANCHES

   /**
    * @swagger
    * components:
    *   schemas:
    *     Branch:
    *       type: object
    *       properties:
    *         id:
    *           type: integer
    *         branch_id:
    *           type: integer
    *         name_uz:
    *           type: string
    *         name_ru:
    *           type: string
    *         phone_number:
    *           type: array
    *           items:
    *             type: string
    *         schedule:
    *           type: string
    *         address_uz:
    *           type: string
    *         address_ru:
    *           type: string
    *         landmark_uz:
    *           type: string
    *         landmark_ru:
    *           type: string
    *         address_link:
    *           type: string
    *         image_url:
    *           type: string
    *         image_name:
    *           type: string
    *         latitude:
    *           type: number
    *           format: double
    *         longitude:
    *           type: number
    *           format: double
    *         created_at:
    *           type: string
    *           format: date-time
    */

   /**
    * @swagger
    * tags:
    *    name: Branches
    *    description: Branches managing API
    */

   /**
    * @swagger
    * /branches/list:
    *   get:
    *     summary: Get list of all branches
    *     tags: [Branches]
    *     security:
    *       - token: []
    *     responses:
    *       200:
    *         description: List of branches retrieved successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/Branch'
    *       404:
    *         description: No branches found
    *       500:
    *         description: Interval Server Error
    */
   .get('/branches/list', AUTH, branches.GET_LIST)

   /**
    * @swagger
    * /branch/{id}:
    *   get:
    *     summary: Get branch information by ID
    *     tags: [Branches]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: Authorization
    *         required: true
    *         schema:
    *           type: string
    *         description: Bearer token for authentication
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: Branch ID
    *     responses:
    *       200:
    *         description: Branch retrieved successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/Branch'
    *       404:
    *         description: Branch not found
    *       500:
    *         description: Interval Server Error
    */
   .get('/branch/:id', AUTH, branches.GET_ID)

   /**
    * @swagger
    * /branch/add:
    *   post:
    *     summary: Add a new branch
    *     tags: [Branches]
    *     security:
    *       - token: []
    *     requestBody:
    *       required: true
    *       content:
    *         multipart/form-data:
    *           schema:
    *             type: object
    *             properties:
    *               branch_id:
    *                 type: integer
    *               name_uz:
    *                 type: string
    *               name_ru:
    *                 type: string
    *               phone_number:
    *                 type: array
    *                 items:
    *                   type: string
    *               schedule:
    *                 type: string
    *               address_uz:
    *                 type: string
    *               address_ru:
    *                 type: string
    *               landmark_uz:
    *                 type: string
    *               landmark_ru:
    *                 type: string
    *               address_link:
    *                 type: string
    *               latitude:
    *                 type: number
    *                 format: double
    *               longitude:
    *                 type: number
    *                 format: double
    *               image:
    *                 type: string
    *                 format: binary
    *     responses:
    *       201:
    *         description: Branch added successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 201
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/Branch'
    *       400:
    *         description: Bad request
    *       500:
    *         description: Interval Server Error
    */
   .post('/branch/add', AUTH, FileUpload.single('image'), branches.ADD_BRANCH)

   /**
    * @swagger
    * /branch/edit:
    *   put:
    *     summary: Edit an existing branch
    *     tags: [Branches]
    *     security:
    *       - token: []
    *     requestBody:
    *       required: true
    *       content:
    *         multipart/form-data:
    *           schema:
    *             type: object
    *             properties:
    *               id:
    *                 type: integer
    *                 description: ID of the branch to edit
    *               branch_id:
    *                 type: integer
    *               name_uz:
    *                 type: string
    *               name_ru:
    *                 type: string
    *               phone_number:
    *                 type: array
    *                 items:
    *                   type: string
    *               schedule:
    *                 type: string
    *               address_uz:
    *                 type: string
    *               address_ru:
    *                 type: string
    *               landmark_uz:
    *                 type: string
    *               landmark_ru:
    *                 type: string
    *               address_link:
    *                 type: string
    *               latitude:
    *                 type: number
    *                 format: double
    *               longitude:
    *                 type: number
    *                 format: double
    *               image:
    *                 type: string
    *                 format: binary
    *                 description: New image to upload (optional)
    *     responses:
    *       200:
    *         description: Branch updated successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/Branch'
    *       400:
    *         description: Bad request
    *       404:
    *         description: Branch not found
    *       500:
    *         description: Interval Server Error
    */
   .put('/branch/edit', AUTH, FileUpload.single('image'), branches.EDIT_BRANCH)

   /**
    * @swagger
    * /branch/delete/{id}:
    *   delete:
    *     summary: Delete a branch
    *     tags: [Branches]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: path
    *         name: id
    *         schema:
    *           type: integer
    *         required: true
    *         description: ID of the branch to delete
    *     responses:
    *       200:
    *         description: Branch deleted successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *       400:
    *         description: Bad request
    *       404:
    *         description: Branch not found
    *       500:
    *         description: Interval Server Error
    */
   .delete('/branch/delete/:id', AUTH, branches.DELETE_BRANCH)

   // RECEIPT

   /**
   * @swagger
   * tags:
   *    name: POS
   *    description: POS managing API
   */

   /**
    * @swagger
    * /authPOS:
    *   post:
    *     summary: Admin login
    *     tags: [POS]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               login:
    *                 type: string
    *                 example: megaFarm
    *               password:
    *                 type: string
    *                 example: megaFarm123
    *     responses:
    *       200:
    *         description: Successful login
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 code:
    *                   type: integer
    *                   example: 0
    *                 message:
    *                   type: string
    *                   example: OK
    *                 data:
    *                   type: object
    *                   properties:
    *                     token:
    *                       type: string
    *                       example: your.jwt.token
    *       401:
    *         description: Unauthorized
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 401
    *                 message:
    *                   type: string
    *                   example: Unauthorized
    *       500:
    *         description: Internal Server Error
    */
   .post('/authPOS', receipt.LOGIN)

   /**
    * @swagger
    * /create-receipt:
    *   post:
    *     summary: Create a receipt and apply bonus logic
    *     tags: [POS]
    *     security:
    *       - bearerAuth: []
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               method:
    *                 type: string
    *                 example: CreateReceipt
    *               params:
    *                 type: object
    *                 properties:
    *                   receipt_no:
    *                     type: string
    *                     example: "RCP-001"
    *                   type:
    *                     type: string
    *                     example: "SALE"
    *                   client:
    *                     type: string
    *                     example: "client-123"
    *                   branch:
    *                     type: string
    *                     example: "branch-456"
    *                   created_date:
    *                     type: string
    *                     format: date-time
    *                     example: "2025-04-29T12:00:00Z"
    *                   payments:
    *                     type: array
    *                     items:
    *                       type: object
    *                       properties:
    *                         name:
    *                           type: string
    *                           example: CASH
    *                         value:
    *                           type: number
    *                           example: 100000
    *                   items:
    *                     type: array
    *                     items:
    *                       type: object
    *                       properties:
    *                         name:
    *                           type: string
    *                           example: "Product A"
    *                         quantity:
    *                           type: number
    *                           example: 2
    *                         price:
    *                           type: number
    *                           example: 50000
    *     responses:
    *       200:
    *         description: Receipt successfully created
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 code:
    *                   type: integer
    *                   example: 0
    *                 message:
    *                   type: string
    *                   example: OK
    *                 data:
    *                   type: string
    *                   example: OK
    *       400:
    *         description: Bad request or wrong method
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 400
    *                 message:
    *                   type: string
    *                   example: Bad request
    *       401:
    *         description: Unauthorized access
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 401
    *                 message:
    *                   type: string
    *                   example: Unauthorized
    *       500:
    *         description: Internal server error
    */
   .post('/create-receipt', receipt.CREATE_RECEIPT)

   // HISTORIES
   /**
    * @swagger
    * components:
    *   schemas:
    *     History:
    *       type: object
    *       properties:
    *         id:
    *           type: integer
    *         receipt_no:
    *           type: integer
    *         type:
    *           type: string
    *         user_id:
    *           type: integer
    *         branch:
    *           type: integer
    *         date:
    *           type: string
    *         payments:
    *           type: array
    *           items:
    *             type: object
    *             properties:
    *               name:
    *                 type: string
    *                 example: CASH
    *               value:
    *                 type: number
    *                 example: 10000
    *         amount:
    *           type: integer
    *         items:
    *           type: array
    *           items:
    *             type: object
    *             properties:
    *               product_id:
    *                 type: integer
    *                 example: 101
    *               name:
    *                 type: string
    *                 example: Paracetamol
    *               quantity:
    *                 type: integer
    *                 example: 2
    *               price:
    *                 type: number
    *                 example: 5000
    *         created_at:
    *           type: string
    *           format: date-time
    */

   /**
    * @swagger
    * components:
    *   schemas:
    *     HistoryBonus:
    *       type: object
    *       properties:
    *         id:
    *           type: integer
    *         receipt_no:
    *           type: integer
    *         user_id:
    *           type: integer
    *         amount:
    *           type: integer
    *         income:
    *           type: boolean
    *           default: true
    *         created_at:
    *           type: string
    *           format: date-time
    */

   /**
   * @swagger
   * tags:
   *    name: Histories
   *    description: Histories managing API
   */

   /**
    * @swagger
    * /receipts/list:
    *   get:
    *     summary: Get list of receipt histories
    *     tags:
    *       - Histories
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *            type: string
    *         description: Authentication token
    *       - in: query
    *         name: limit
    *         required: true
    *         schema:
    *           type: integer
    *       - in: query
    *         name: page
    *         required: true
    *         schema:
    *           type: integer
    *       - in: query
    *         name: user_id
    *         required: false
    *         schema:
    *           type: integer
    *       - in: query
    *         name: receipt_no
    *         required: false
    *         schema:
    *           type: integer
    *     responses:
    *       200:
    *         description: List of receipts successfully retrieved
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/History'
    *       400:
    *         description: Bad request (missing limit or page)
    *       404:
    *         description: No receipts found
    *       500:
    *         description: Internal server error
    */
   .get('/receipts/list', AUTH, histories.GET_HISTORIES)

   /**
    * @swagger
    * /receipt/{id}:
    *   get:
    *     summary: Get a specific receipt by ID
    *     tags:
    *       - Histories
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *            type: string
    *         description: Authentication token
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: ID of the receipt
    *     responses:
    *       200:
    *         description: Receipt found successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/History'
    *       404:
    *         description: Receipt not found
    *       500:
    *         description: Internal server error
    */
   .get('/receipt/:id', AUTH, histories.GET_HISTORY_ID)

   /**
    * @swagger
    * /bonuses/list:
    *   get:
    *     summary: Get list of bonus histories
    *     tags:
    *       - Histories
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *            type: string
    *         description: Authentication token
    *       - in: query
    *         name: limit
    *         required: true
    *         schema:
    *           type: integer
    *       - in: query
    *         name: page
    *         required: true
    *         schema:
    *           type: integer
    *       - in: query
    *         name: user_id
    *         required: false
    *         schema:
    *           type: integer
    *       - in: query
    *         name: receipt_no
    *         required: false
    *         schema:
    *           type: integer
    *     responses:
    *       200:
    *         description: List of bonus successfully retrieved
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/HistoryBonus'
    *       400:
    *         description: Bad request (missing limit or page)
    *       404:
    *         description: No receipts found
    *       500:
    *         description: Internal server error
    */
   .get('/bonuses/list', AUTH, histories.GET_BONUS_HISTORY)

   /**
    * @swagger
    * /bonus/{id}:
    *   get:
    *     summary: Get a specific bonus by ID
    *     tags:
    *       - Histories
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *            type: string
    *         description: Authentication token
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: ID of the bonus
    *     responses:
    *       200:
    *         description: Bonus found successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/HistoryBonus'
    *       404:
    *         description: Receipt not found
    *       500:
    *         description: Internal server error
    */
   .get('/bonus/:id', AUTH, histories.GET_BONUS_HISTORY_ID)

module.exports = router