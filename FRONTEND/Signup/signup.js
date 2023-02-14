async function signup(event) {
  event.preventDefault();
    try{
       // console.log(event.target.email.value);

        const signupDetails = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value
        }
        console.log(signupDetails);
        const response = await axios.post('http://localhost:3000/user/signup', signupDetails)
        console.log(response.data)
          if(response.status ===201){
            window.location.href = "../Login/login.html"
          }else{
             throw new Error('Failed to login');
          }
    } catch(err){
        document.body.innerHTML += `<div style="color:red">${err} </div>`
    }
}
