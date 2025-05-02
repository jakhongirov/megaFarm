const formatBalanceWithSpaces = (balance) => {
   return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(balance).replace(/,/g, ' ');
}

const formatDateAdvanced = (dateString) => {
   const date = new Date(dateString);

   if (isNaN(date)) {
      // Attempt to handle ISO 8601 with timezone offset directly
      const isoDate = new Date(dateString.replace(' ', 'T'));
      if (isNaN(isoDate)) {
         return "No aniq";
      }
      else {
         const day = String(isoDate.getDate()).padStart(2, '0');
         const month = String(isoDate.getMonth() + 1).padStart(2, '0');
         const year = isoDate.getFullYear();
         return `${day}.${month}.${year}`;
      }
   }

   const day = String(date.getDate()).padStart(2, '0');
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const year = date.getFullYear();

   return `${day}.${month}.${year}`;
}



module.exports = {
   formatBalanceWithSpaces,
   formatDateAdvanced,
}