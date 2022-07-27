'use strict';

import {accounts} from './accounts.js'

if(localStorage.length){
  for(let i = 0; i < localStorage.length; i++){
      accounts.push(JSON.parse(`${localStorage.getItem(localStorage.key(i))}`))
      // console.log(accounts);
  }
}


/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.logout-btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const register = document.querySelector('.register');
const formLogin = document.querySelector('.login');


window.onload = () => {
  register.style.display = 'block';
}

//? >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FUNCTIONS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const formatMovementDate = function(date, locale){

  const calcDaysPassed = (date1, date2) => 
                                      //?ms * s / m / h = day
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  
  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`
    // const day = `${date.getDate()}`.padStart(2,0)
    // const month = `${date.getMonth() + 1}`.padStart(2,0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
}

const formatCur = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value)
}

const displayMovements = function(acc, sort = false){

  containerMovements.innerHTML = '';
  
                        //?slice is neccesary to avoid to mutate the acc
  const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;

  movs.forEach((mov,idx) => {

    const date = new Date(acc.movementsDates[idx]);
    const displayDate = formatMovementDate(date, acc.locale);

    const type = mov > 0 ? 'deposit' : 'withdrawal' 

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html =  
      `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${idx + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
       </div>`
      //  <div class="movements__value">$${mov.toFixed(2)}</div>
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

// console.log(containerMovements);

const createUserNames = function(accs){
  accs.forEach(acc => acc.username =  acc.owner.toLowerCase().split(' ')
      .map(e => e[0]).join(''))
  // Object.keys(localStorage).forEach(key => {
  //   const parsedKey = JSON.parse(localStorage.getItem(key))
  //   parsedKey['username'] = parsedKey.owner.toLowerCase().split(' ').map(e => e[0]).join('')
  //   localStorage.setItem(key, JSON.stringify(parsedKey));
  // })
} 
// createUserNames(accounts); //enrique ortiz --> eo
createUserNames(accounts);

// console.log(accounts);

// const calcDisplayBalance = function(movements){
//   const balance = movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = `$${balance}`;
// }
const calcDisplayBalance = function(acc){
  // Object.keys(localStorage).forEach(key => {
  //   const parsedKey = JSON.parse(localStorage.getItem(key))
  //   parsedKey['username'] = parsedKey.owner.toLowerCase().split(' ').map(e => e[0]).join('')
  //   localStorage.setItem(key, JSON.stringify(parsedKey));
  // })
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  // labelBalance.textContent = `$${acc.balance.toFixed(2)}`;
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
}

const calcDisplaySummary = function(acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0)
  // labelSumIn.textContent = `$${incomes.toFixed(2)}`;
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  const outcomes = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0)
  // labelSumOut.textContent = `$${Math.abs(outcomes.toFixed(2))}`;
  labelSumOut.textContent = formatCur(Math.abs(outcomes), acc.locale, acc.currency);
  
  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate) / 100)
  .filter(el => {
    // console.log(el); //?check if an interest is below 1
    return el >= 1}) //?interest >= 1?
  .reduce((acc, mov) => acc + mov, 0);
  // labelSumInterest.textContent = `$${interest.toFixed(2)}`;
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}

const updateUI = function(acc){
  //*2) Display Movements
  displayMovements(acc);
  calcDisplayBalance(acc);
  //*3) Display Summary
  calcDisplaySummary(acc);
}

const startLogOutTimer = function(){
  //? set time
  let time = 600;

  function tick(){
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);

    //*in each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`

    //*is 0? stop timer and log out user
    if(time === 0){
      labelTimer.textContent = 'About to log off...'
      clearInterval(timer);
      setTimeout(() => {
        labelWelcome.textContent = `Log in to get started`
        containerApp.style.opacity = 0;
      }, 3000);
    }
    //*Decrease 1s
    time--;
  
  
  } //*tick end
  tick();
  
  //? call the timer every sec
  const timer = setInterval(tick,1000);
  return timer;
};

//?VARIABLES
let currentAccount, timer;

//*FAKE ALWAYS LOGGED IN XP
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100


//? >>>>>>>>>>>>>>> EVENT LISTENERS TO THE DOM <<<<<<<<<<<<<<<<<<<<<<
btnLogin.addEventListener('click', function(e){
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  // currentAccount = Object.keys(localStorage).find(key => 
  //   JSON.parse(localStorage.getItem(key)).username === inputLoginUsername.value)
  // accounts.find(acc => acc.username === inputLoginUsername.value)
  // console.log(currentAccount);


  //if(currentAccount && currentAccount.pin ....)
  if(currentAccount?.pin === +(inputLoginPin.value)){
    
    
    //*1) Display UI and message
    // console.log('todo fine bro');
    
    register.style.display = 'none';
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`
    containerApp.style.opacity = 100;
    document.querySelector('.logout-container').style.display = 'flex';
    formLogin.style.display = 'none';
    
    //?OUTDATED VERSION OF PRINTING DATE ;)
    // const day = `${currentDate.getDate()}`.padStart(2,0)
    // const month = `${currentDate.getMonth() + 1}`.padStart(2,0);
    // const year = currentDate.getFullYear();
    // const hours = `${currentDate.getHours()}`.padStart(2,0);
    // const min = `${currentDate.getMinutes()}`.padStart(2,0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;
    
    //?Experimenting with the INTL(API OF INTERNATIONALIZING)
    const currentDate = new Date();
    const options = {
      hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', 
      year: 'numeric', weekday: 'short'};

    //*          = 'es-MX'
    // const locale = navigator.language; //?set it to the current navigator language

    //?this is the cool one ;)
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(currentDate);


    //?CLEAR INPUT FIELDS(EARLY)
    inputLoginPin.value = inputLoginUsername.value = '' ;
    inputLoginPin.blur();


    //?timer
    if(timer) {
      
      clearInterval(timer);
      // console.log('Timer cleared!');
    }
    timer = startLogOutTimer();

    updateUI(currentAccount);
    // console.log(currentAccount);
    
  }
})

btnTransfer.addEventListener('click', function(e){
  //?WE WILL ALWAYS USE THIS WHEN WE TALK ABOUT A FORM
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  // console.log(amount, receiverAcc);

  inputTransferTo.value = inputTransferAmount.value = ''
  if(amount > 0 && currentAccount.balance >= amount && receiverAcc //?exists?
  && receiverAcc.username !== currentAccount.username){
    // console.log('Transfer completed!');

    //?DOING THE TRANSFER
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //?ADD TRANSFER DATE
    currentAccount.movementsDates.push(new Date().toISOString()); //? :o
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    //?Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();

  }else{
    alert('The user doesn\'t exist or the amount is insufficient! ')
  }
});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = +(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * .1)){
    
    setTimeout(() => {
      //?ADD THE MOVEMENT TO THE CURRENT ACCOUNT
      currentAccount.movements.push(amount);
      //?ADD LOAN DATE

      currentAccount.movementsDates.push(new Date().toISOString()); //? :o
      
      
      //?UPDATE UI
      updateUI(currentAccount);
      alert('Transaction completed!')
    }, 3000);

    //?Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
    
  }
  inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  // currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  if(currentAccount.username === inputCloseUsername.value
    && currentAccount.pin === +(inputClosePin.value)){
    
      const index = accounts.findIndex(acc => acc.username === currentAccount.username)
      // console.log(index);
      
      //*DELETE ACCOUNT
      const confirmation = confirm('Are you sure to delete your account? You wont be able to retrieve it anymore')
      if(confirmation){
        accounts.splice(index, 1);
  
        //*HIDE UI
        containerApp.style.opacity = 0;
      }
  }
  inputTransferTo.value = inputTransferAmount.value = ''
  formLogin.style.display = 'block';
  btnLogout.style.display = 'none';
  labelWelcome.textContent = 'Login to get Started';
  register.style.display = 'block';
})

btnLogout.addEventListener('click', function(){
  clearInterval(timer);
  labelTimer.textContent = 'Logging off..'
  setTimeout(() => {
    containerApp.style.opacity = 0;
    document.querySelector('.logout-container').style.display = 'none';
    register.style.display = 'block';
    formLogin.style.display = 'block';
    labelWelcome.textContent = 'Log in to get started';
    inputLoginUsername = inputLoginPin = '';
  }, 3000); 
})
// console.log(currentAccount);


let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted; //?we flip the boolean to unsort it back again
})
