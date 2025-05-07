const model = require('./model')

module.exports = {
   DASHBOARD: async (req, res) => {
      try {
         const monthlyAmountBranches = await model.monthlyAmountBranches()
         const currentMonthStatis = await model.currentMonthStatis()
         const totalAmount = await model.totalAmount()
         const totalBonus = await model.totalBonus()
         const totalUser = await model.totalUser()
         const totalReceipt = await model.totalReceipt()

         return res.status(200).json({
            status: 200,
            message: "Success",
            data: {
               monthly_amount: monthlyAmountBranches,
               current_month: currentMonthStatis,
               total_amount: totalAmount.sum,
               total_bonus: totalBonus.sum,
               total_user: totalUser.count,
               total_receipt: totalReceipt.count
            }
         })

      } catch (error) {
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   }
}