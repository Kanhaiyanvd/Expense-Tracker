//let link = document.getElementsByClassName("link");
let pagination = document.getElementById('pagination')
//let currentValue = 1;

// function activeLink(){
//     for(l of link){
//         l.classList.remove("active");
//     }
//     event.target.classList.add("active");
//     currentValue = event.target.value;
// }
// function backBtn(){
//     if(currentValue > 1){
//         for(l of link){
//        l.classList.remove("active") 
//       }
//       currentValue--;
//       link[currentValue-1].classList.add("active");
//     }
// }
// function nextBtn(){
//     if(currentValue < 5){
//         for(l of link){
//        l.classList.remove("active") 
//       }
//       currentValue++;
//       link[currentValue-1].classList.add("active");
//     }
// }

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
        addNewExpenseToUI(response.data.expense);
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

document.addEventListener('DOMContentLoaded',async ()=>{
   // const page = 1;

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    console.log(decodedToken)
    const ispremiumuser = decodedToken.ispremiumuser;
    if(ispremiumuser){
        showPremiumuserMessage();
        showLeaderboard();
    };

     axios.get(`http://localhost:3000/expense/getexpenses`, { headers: {'Authorization': token}})
     .then((response) =>{
        response.data.expense.forEach(expense=> {
          addNewExpenseToUI(expense);
         // showPagination(response.pageData)
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

// function showPagination({currentPage,hasNextPage,
//       nextPage,
//     hasPreviousPage,
//     previousPage,
//     lastPage,
// }){
//     pagination.innerHTML='';

//     if(hasPreviousPage){
//         const btn2 = document.createElement('button');
//         btn2.innerHTML = previousPage
//         btn2.addEventListener('click', ()=>getPages(previousPage))
//         pagination.appendChild(btn2)
//     }
//     const btn1 = document.createElement('button')
//     btn1.innerHTML= `<h1>${currentPage}</h3>`
//     btn1.addEventListener('click', ()=>getPages(currentPage))
//     pagination.appendChild(btn1)

//     if(hasNextPage){
//         const btn3 = document.createElement('button')
//         btn3.innerHTML = nextPage
//         btn3.addEventListener('click',()=>getPages)
//         pagination.appendChild(btn3)
//     };
// }

// function getItem(page){
//     axios.get(`http://localhost:3000/expense/getexpenses?page-${page}`)
//     .then(({data:{expense, ...pageData}})=>{
//         addNewExpenseToUI(expense);
//           showPagination(pageData)
//     }).catch(err=>console.log(err))
// }

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

 function download(){
    const token = localStorage.getItem('token')
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 200){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        console.log(err)
    });
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
       leaderboardElem.innerHTML += '<h3> Leader Board</h3>'
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
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
       });

}