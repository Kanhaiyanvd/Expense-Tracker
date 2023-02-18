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
        addNewExpenseToUI(response.data.expenseDetails);
    }).catch(err => console.log(err))

}

function showPremiumuserMessage(){
    document.getElementById('rzp-button1').style.visibility = "hidden";
    document.getElementById('message').innerHTML = "You are a Premium User Now";
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.addEventListener('DOMContentLoaded', ()=>{
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    console.log(decodedToken)
    const ispremiumuser = decodedToken.ispremiumuser;
    if(ispremiumuser){
        showPremiumuserMessage();
        showLeaderboard();
    }

    axios.get('http://localhost:3000/expense/getexpenses', { headers: {'Authorization': token}})
     .then(response =>{
        response.data.expense.forEach(expense=> {
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

function showLeaderboard(){
    const inputElement = document.createElement('input');
    inputElement.type = "button";
    inputElement.value = 'Show Leaderboard';
    inputElement.onclick = async() =>{
       const token = localStorage.getItem('token')
       const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard',{ headers: {'Authorization': token}} )
       console.log(userLeaderBoardArray);

       var leaderboardElem = document.getElementById('leaderboard')
       leaderboardElem.innerHTML += '<h1> Leader Board</h1>'
       userLeaderBoardArray.data.forEach((userDetails)=> {
         leaderboardElem.innerHTML += `<li>Name -${userDetails.name} Total Expense -${userDetails.totalExpenses || 0} </li>`
       })
    }
    document.getElementById("message").appendChild(inputElement);
} 

document.getElementById("rzp-button1").onclick = async function(e){
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premiummembership',{ headers: {"Authorization" : token}})
    console.log(response);
    var options = 
    {
        "key_id": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
           const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
               order_id: options.order_id,
               payment_id: response.razorpay_payment_id,
            },{headers: {"Authorization": token }})
            alert('You are a Premium User Now')
            document.getElementById('rzp-button1').style.visibility = "hidden";
            document.getElementById('message').innerHTML = "You are a Premium User Now";
            localStorage.setItem('token', res.data.token);
            showLeaderboard()
        },
    };

const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed', function (response){
    console.log(response);
    alert('Something went wrong')
})
}