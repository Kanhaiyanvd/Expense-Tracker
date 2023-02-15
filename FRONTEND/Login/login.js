function login(event) {
  event.preventDefault();

  const loginDetails = {
    email: event.target.email.value,
    password: event.target.password.value
  }
  console.log(loginDetails);
  axios.post('http://localhost:3000/user/login', loginDetails)
   .then(response => {
    alert(response.data.message)
    localStorage.setItem('token',response.data.token)
    window.location.href = "../ExpanseTracker/index.html"
   })
   .catch(err => {
    console.log(JSON.stringify(err))
    document.body.innerHTML += `<div style="color:red;">${err.message} </div>`
   })
}