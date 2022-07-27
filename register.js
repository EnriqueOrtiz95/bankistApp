
const inputName = document.querySelector('#input-name');
const inputPIN = document.querySelector('#input-pin');
const form = document.querySelector('.formulario');

const fullName = /^[a-zA-Z]+ [a-zA-Z]+$/;

form.addEventListener('submit', function(e){
  e.preventDefault();
  if(!fullName.test(inputName.value) || inputPIN.value === ''){
      return showAlert('You havent passed the validation', 'error');
  }
    alert(`Your username is ${inputName.value.toLowerCase().split(' ').map(e => e[0]).join('')}`)
    createAccount(); //?CREATING AN ACCOUNT
    showAlert('Registration successful!');
    setTimeout(() => {
      location.href = 'index.html'
    }, 4000);
})

const showAlert = function(message, type){
    const divMessage = document.createElement('div');
    divMessage.classList.add('text-center', 'alert');

      if(type === 'error'){
          divMessage.classList.add('alert-danger');
      }else{
          divMessage.classList.add('alert-success');
      }

      //error msg
      divMessage.textContent = message;

      //HTML insert
      document.querySelector('.registration').insertBefore(divMessage, form);
  
      setTimeout(() => {
          divMessage.remove();
      }, 3000);
}


  
// const objetos = [];
let createAccount = function(){
    
    let id = Number(Date.now().toString().slice(-4));
    const objecto = {
      owner: inputName.value,
      movements: [500],
      interestRate: 1.3,
      pin: Number(inputPIN.value),
      movementsDates: [new Date().toISOString()],
      currency: 'MXN',
      locale: 'es-MX',
      id
    }

    localStorage.setItem('movement' + id, JSON.stringify(objecto))
    setTimeout(() => {
        location.href = 'index.html'
    }, 2000);
    // accounts.at(-1).username = account.at(-1).owner.toLowerCase().split(' ').map(e => e[0]).join('')
    // return accounts.push(account4);

    // account[`account${i}`].owner = inputName.textContent;
    // account[`account${i}`].movements = [];
    // account[`account${i}`].interestRate = 1.3;
    // account[`account${i}`].pin = Number(inputPIN.textContent);
    // account[`account${i}`].movementsDates = [];
    // account[`account${i}`].currency = 'MXN';
    // account[`account${i}`].locale = 'es-MX';
}