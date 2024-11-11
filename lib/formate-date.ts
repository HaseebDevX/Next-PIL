export const formateToDDMMYY = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based (0 = January)
  const year = String(date.getFullYear()).slice(-2); // Get the last 2 digits of the year

  // Format as dd-mm-yy
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
};
