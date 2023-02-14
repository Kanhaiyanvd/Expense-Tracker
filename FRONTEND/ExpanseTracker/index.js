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
        addNewExpenseToUI(response.data.expenseDeatils);
    }).catch(err => console.log(err))

}

document.addEventListener('DOMContentLoaded', ()=>{
    axios.get('http://localhost:3000/expense/getexpenses')
     .then(response =>{
        response.data.expenses.forEach(expense=> {
          addNewExpenseToUI(expense)  
        }) 
          
     })
     .catch(err => console.log(err));
})

function addNewExpenseToUI(expense) {
    const parentElement = document.getElementById("listOfExpenses");
    const expenseElemId = `expense-${expense.id}`;
    //const expenseElemId = `${expense.id}`;
    parentElement.innerHTML +=
     `<li id=${expenseElemId}>
        ${expense.expenseamount} - ${expense.description} - ${expense.category}
        <button onclick='deleteExpense( ${expense.id})'>
           Delete Expense 
        </button>
    </li>`
   // parentNode.innerHTML = parentNode.innerHTML + childHTML;

}
function deleteExpense(expenseid) {
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseid}`)
    .then(() => {
    removeExpenseFromUI(expenseid);
  })
  .catch((err) => console.log(err));
 }
 
 function removeExpenseFromUI(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
 
//     const parentNode = document.getElementById("listOfExpense");
//     const childNodeToBeDeleted = document.getElementById(expenseid);
//     if (childNodeToBeDeleted) {
//      parentNode.removeChild(childNodeToBeDeleted);
//    }
 }