function addNewExpense(e){
    e.preventDefault();

    const expenseDetails ={
        expenseamount: e.target.expenseamount.value,
        description: e.target.description.value,
        category: e.target.category.value
    }
    console.log(expenseDetails);
    axios.post('http://localhost:3000/expense/addexpense', expenseDetails)
    .then((response) =>{
        addNewExpenseToUI(response.data.expenseDetails);
    }).catch(err => console.log(err))

}

window.addEventListener('DOMContentLoaded', async()=>{
    axios.get('http://localhost:3000/expense/getexpenses')
     .then(response =>{
        response.data.expenses.forEach(expense=> {
          addNewExpenseToUI(expense)  
        })
        
     })
})

function addNewExpenseToUI(expense) {
    const parentNode = document.getElementById("listOfExpenses");
    //const expenseElemId = `expense-${expense.id}`;
    const childHTML = `<li id=${expense.id}>${expense.expenseamount} - ${expense.description} - ${expense.category}
    <button onclick='deleteExpense(event, ${expense.id})'>Delete Expense </button></li>`
    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}
function deleteExpense(expenseid) {
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseid}`)
    .then((response) => {
    removeExpenseFromScreen(expenseid);
  })
  .catch((err) => console.log(err));
 }
 
 function removeExpenseFromScreen(expenseid) {
 
    const parentNode = document.getElementById("listOfExpense");
    const childNodeToBeDeleted = document.getElementById(expenseid);
    if (childNodeToBeDeleted) {
     parentNode.removeChild(childNodeToBeDeleted);
   }
 }