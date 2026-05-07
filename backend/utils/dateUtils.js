const calculateOverdueDays = (dueDate, returnedDate = new Date()) => {
  const due = new Date(dueDate);
  const returned = new Date(returnedDate);
  const diff = returned.getTime() - due.getTime();
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

const calculateFine = (overdueDays, amountPerDay = 50) => overdueDays * amountPerDay;

const isOverdue = (dueDate, returnedDate = new Date()) => calculateOverdueDays(dueDate, returnedDate) > 0;

module.exports = { calculateOverdueDays, calculateFine, isOverdue };
