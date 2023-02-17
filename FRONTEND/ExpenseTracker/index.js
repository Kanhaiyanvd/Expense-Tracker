function addNewExpense(e){
    e.preventDefault();

    const expenseDetails ={
        expenseamount: e.target.expenseamount.value,
        description: e.target.description.value,
        category: e.target.category.value,
    
    }
    console.log(expenseDetails);
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/expense/addexpense', expenseDetails, { headers:{"Authorization": token} })
    .then((response) =>{
        addNewExpenseToUI(response.data.expenseDeatils);
    }).catch(err => console.log(err))

}

document.addEventListener('DOMContentLoaded', ()=>{
    const token = localStorage.getItem('token')
    axios.get('http://localhost:3000/expense/getexpenses', { headers: {'Authorization': token}})
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
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`,{ headers: {'Authorization': token}})
    .then(() => {
    removeExpenseFromUI(expenseid);
  })
  .catch((err) => console.log(err));
 }
 
 function removeExpenseFromUI(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
 }

 document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options = {
        "key": response.data.key_id, // Enter the key ID genreated from the dashboard
        "order_id": response.data.order_id, // for one time paymrnt
        //this handler function will handle the success payment
        "handler": async function(response) {
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: {"Authorization": token } })

            alert('You are a Premium User Now')
        }

    }
 

 const rzpl = new Razorpay(options);
 rzpl.open();
 e.preventDefault();

 rzpl.on('payment.failed', function (response){
    console.log(response)
    alert('Somthing went wrong')
 });
};
