'use strict';

const account1 = {
  owner: 'Enrique Ortiz',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-06-09T17:01:17.194Z',
    '2022-06-14T23:36:17.929Z',
    '2022-06-15T10:51:36.790Z',
  ],
  currency: 'MXN',
  locale: 'es-MX', // de-DE
};

const account2 = {
  owner: 'Albert Jones',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-05-25T18:49:59.371Z',
    '2022-05-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Santiago Perez',
  movements: [3000, 2000, -50, 700, -2000, -1000, 500, -70],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2021-12-01T13:15:33.035Z',
    '2021-12-30T09:48:16.867Z',
    '2022-01-25T06:04:23.907Z',
    '2022-02-04T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-05-25T18:49:59.371Z',
    '2022-05-26T12:01:20.894Z',
  ],
  currency: 'MXN',
  locale: 'es-MX',
};

const accounts = [account1, account2, account3];

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

/////////////////////////////////////////////////
// Functions


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

} 
createUserNames(accounts); //enrique ortiz --> eo


// console.log(accounts);

// const calcDisplayBalance = function(movements){
//   const balance = movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = `$${balance}`;
// }
const calcDisplayBalance = function(acc){
  
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
  // console.log(currentAccount);

  //if(currentAccount && currentAccount.pin ....)
  if(currentAccount?.pin === +(inputLoginPin.value)){
    
    
    //*1) Display UI and message
    // console.log('todo fine bro');
    
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`
    containerApp.style.opacity = 100;
    document.querySelector('.logout-container').style.display = 'flex';
    
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

    // console.log(currentAccount);
    
    // //TODO EXCHANGE THEIR CURRENT VALUES (JUST TESTING XP)
    // //?IT WILL BE REDUCING OR ADDING FOR EVERY LOGIN LOL, GOOD TRY XP
    // let newMovement;
    // if(currentAccount.currency === 'MXN') {
    //   newMovement = currentAccount.movements.map(e => e * 20)
    //   currentAccount.movements = [...newMovement]
    // }
    // else if(currentAccount.currency === 'EUR'){
    //   newMovement = currentAccount.movements.map(e => e * .9)
    //   currentAccount.movements = [...newMovement]
    // }

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
      accounts.splice(index, 1);

      //*HIDE UI
      containerApp.style.opacity = 0;
  }
  inputTransferTo.value = inputTransferAmount.value = ''
})

btnLogout.addEventListener('click', function(){
  clearInterval(timer);
  labelTimer.textContent = 'Logging off..'
  setTimeout(() => {
    containerApp.style.opacity = 0;
    document.querySelector('.logout-container').style.display = 'none';
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

const num = 2318384.2
const options = {
  style: 'currency', //percent|currency
  unit: 'mile-per-hour', //celsius
  currency: 'EUR', //?it must to be stablished manually
  // useGrouping: false

}

// console.log('Germany: ', new Intl.NumberFormat('de-DE',options).format(num));
// console.log(navigator.language, new Intl.NumberFormat(navigator.language,options).format(num));



/////////////////////////////////////////////////
/////////////////////////////////////////////////

// console.log(.1 + .2 === .3); //? :o, it makes sense...?

// //?conversion
// console.log(Number('20'));
// console.log(+'23'); //? :o

// //?parsing
// console.log(parseInt('30px', 10)); //?it works
// console.log(parseInt('px30', 10)); //! it won't
// console.log(parseInt('1001',2)); //*binary
// console.log(parseFloat('10.7rem')); //*float
// console.log(isNaN(20)); //?Is not a number(NaN)?
// console.log(isNaN(+'20x'));
// console.log(isNaN(20 / 0)); //?Infinity != NaN

// //*Checking if value is number
// console.log(isFinite(10/3));
// console.log(isFinite('10/3'));
// console.log(isFinite(10/0));

//? MATH AND ROUNDING METHODS <<<<<<<<<<<<<<<<<<

// console.log(Math.max(1,4,8,10,7));
// console.log(Math.max(1,4,8,'10',7));
// console.log(Math.max(1,4,8,'10px',7)); //?error here
// console.log(Math.min(1,4,8,10,7));
// console.log(Math.PI ** 2);
// console.log(Math.ceil(Math.random() * 10));

// const randomInt = (min,max) => Math.floor(Math.random() * (max - min) + min)
// console.log(randomInt(10, 30));

// //*ROUNDING
// console.log(Math.trunc(-23.2));
// console.log(Math.floor(-23.2)); //?it's the cool for pos and neg

// console.log((2.7).toFixed(0)); //*it returns a string NOT a number
// console.log(+(2.2371).toFixed(2));

//?REMAINDER OPERATOR (%)
// console.log(5%2);

// labelBalance.addEventListener('click', function(){
//   [...document.querySelectorAll('.movements__row')]
//   .forEach((row, i) => {
//     if(i % 2 === 0)row.style.backgroundColor = 'orangered'; 
//     if(i % 3 === 0) row.style.backgroundColor = 'blue';  
//   })
// })

//?NUMERIC SEPARATORS
// const sunDiameter = 287_460_000_000; //? :o
// console.log(sunDiameter);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// console.log(Number('230000'));
// console.log(Number('230_000')); //! X WRONG, underscores doesn't work in strings
// console.log(parseInt('230_000')); //?CHECK DIFFERENCE WITH ABOVE...

//?BIG NUMBERS
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53  + 1);

// //?BigInt
// console.log(212348123425712374132415751276n);
// console.log(BigInt(517171973449574971579613232717));

// const huge = 102394019234812394719324n;
// const num = 20;
// console.log(huge * BigInt(num));

// console.log(20n === 20);
// console.log(typeof 20n, typeof 20);
// console.log(20n == 20);

// //BigInt Divisions
// console.log(11n / 3n);
// console.log(11 / 3);

//TODO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DATES <<<<<<<<<<<<<<<<<<<<<<<<<<<<

// const now = new Date()
// console.log(now);

// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2023, 11, 31)); //?second parameter(month) starts with 0
// console.log(new Date(0 * 24 * 60 * 60 * 1000)); //?miliseconds(first is -1) eg. 2 -> 1
const future = new Date(2037, 11, 12);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.toISOString());
// console.log(future.getTime());
// console.log(new Date(1652643765487));
// console.log(Date.now());
// future.setFullYear(2022);
// console.log(future);

// console.log(+future);

const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)

const days1 = calcDaysPassed(new Date(2037, 11, 12), new Date(2037, 11, 3))
// console.log(days1);











//TODO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////

// // let arr = ['a', 'b', 'c', 'd',' e', 'f']

// //?SLICE METHOD
// // console.log(arr.slice(2));
// // console.log(arr.slice(-3));
// // console.log(arr.slice(1,-2));

// //?SPLICE METHOD (IT MUTATES THE ARRAY, SLICE NOT)
// // console.log(arr.splice(2));
// // console.log(arr); //*ELEMENTS ABOVE GONE
// // arr.splice(-1);
// // arr.splice(1,2); //?DIFERENCE: THE SECOND ARGUMENT IS THE DELETECOUNT
// // console.log(arr);

// // //?REVERSE (MUTATES THE CURRENT ARRAY)
// // const arr2 = ['z', 'y', 'x', 'w', 'v', 'u'];
// // // console.log(arr2.reverse());

// // //?CONCAT
// // const letter = arr.concat(arr2.reverse());
// // // console.log(letter);
// // // console.log([...arr, ...arr2]); //*SPREAD OPERATOR IS THE SAME AS CONCAT

// // //?JOIN
// // console.log(letter.join(' ̣─ '));

// // const arr = [20,10,30];
// // // console.log(arr[0]);
// // // console.log(arr.at(0));

// // //?GETTING THE LAST ELEMENT
// // console.log(arr[arr.length - 1]);
// // console.log(arr.slice(-1)[0]);
// // console.log(arr.at(-1));

// // console.log('kike'.at(-1));

// //TODO >>>>>>>>>>>>>>>>>>>>>>>>> ARRAY LOOPS <<<<<<<<<<<<<<<<<<<<<<<<<<<<

// const movement = [200,300-100,400,150,900,-300];

// //*for of
// //?for of as in ordered parameters [index, element]
// // for(const move of movement){

// //   move > 0 ? console.log(`You deposited ${move}`) : console.log(`You withdrew ${Math.abs(move)}`);
  
// // }

// //*forEach rules bruh
// //?forEach as in ordered parameters([element, index, array]) plus...
// //!you can't continue/break it
// // movement.forEach((move,idx,arr) => move > 0 ? console.log(`Movement ${idx+1} You deposited ${move}`) : console.log(`You withdrew ${Math.abs(move)}`))

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// //*forEach with Maps
// // currencies.forEach((value, key, map) =>{
// //   console.log(`${key}: ${value}`);
// // })

// //*with Set
// const uniqueCurrencies = new Set(['MXN', 'USD', 'EURO', 'GBP', 'KRW'])
// uniqueCurrencies.forEach((value, _, set) => { //?Set hasn't keys or indexes
//   console.log(`${value}: ${value}`); //?that's why key takes the value of value
  
// })

// function checkDogs(dogsJulia, dogsKate){

//   //?1)delete elements from dogsJulia
//   let currentJuliaDogs = dogsJulia.slice(1,-2)
//   // console.log(currentJuliaDogs);
//   //?2)join currentJuliaDog with kate's dogs
//   let onlyDogs = [...currentJuliaDogs, ...dogsKate];
//   console.log(onlyDogs);
//   //?3)show if the dog is an adult(>= 3) or a puppy(< 3)
//   onlyDogs.forEach((el, idx) => {
//     el >= 3 ? console.log(`Dog number ${idx + 1} is an adult`) : console.log(`Dog number ${idx + 1} is a puppy`);   
//   })
// }

// checkDogs([3,5,2,12,7],[4,1,15,8,3])
// checkDogs([9,16,6,8,3],[10,5,6,1,4])

const movements = [...account1.movements]

const eurToUsd = 1.1;
const euroMovements = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(euroMovements);

const movementsDescription = movements.map((mov,i) => 
`Movement ${i+1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
) 
// console.log(movementsDescription);

//?FILTER METHOD
// const deposits = movements.filter(mov => mov > 0)
// // console.log(deposits);

//?REDUCE METHOD                //accumulator, current, index, array
// const balance = movements.reduce( function(acc, cur, i){
//   console.log(`Iteration ${i}: accumulator ${acc}`);
//   return acc + cur;
// },0);
// console.log(balance);

//*MAXIMUM VALUE USING REDUCE METHOD
// const maximumValue = movements.reduce((acc, mov) => acc > mov ? acc : mov ,
//  movements[0]); //?movement[0] to start applying the if since that value

// console.log(maximumValue);

//TODO >>>>>>>>>>>>>> EXERCISES WITH MAP, FILTER AND REDUCE <<<<<<<<<<<<<<<<<<<<<

// //?1) CONVERT DOG'S AGE TO HUMAN WITH THE NEXT FORMULA:
// //?DOG < 2 ? DOG * 2 ELSE 16 + DOG * 4
// //*NOTE: WE WILL USE HIGH ORDER FUNCTIONS ON THIS EXAMPLE ;)
// const calcAverageHumanAge = function(dogsJulia, dogsKate){
//   let humanDogAgeJulia = dogsJulia.map(e => e <= 2 ? e*2 : 16 + e*4)
//   let humanDogAgeKate = dogsKate.map(e => e <= 2 ? e*2 : 16 + e*4)
//   const humanDogAge = [...humanDogAgeJulia, ...humanDogAgeKate]
//   console.log(`Dog's age to human --> ${humanDogAge}`);
//   //?2)EXCLUDE ALL DOGS THAT ARE HUMAN UNDERAGE(18-)
//   const dogHumanUpper18s = (array) => array.filter(el => el > 18);
//   console.log(dogHumanUpper18s(humanDogAge));
//   //?3)CALC THE AVERAGE AGE OF ALL ADULTDOGS
//   const averageAdults = (array) => array.reduce((acc,el) => Math.ceil(acc + el),0) / array.length;
//   console.log(averageAdults(humanDogAge));
// }
// calcAverageHumanAge([3,5,2,12,7],[4,1,15,8,3]);

//TODO USING CHAINING METHODS IN THE FUNCTION CALCAVHUMANAGE
// const calcAverageHumanAgeChain = array => array
//   .map(e => e <=2 ? e*2 : 16 + e*4)
//   .filter(e => {console.log(e);
//    return e > 18})
//   .reduce((acc,el,i,arr) => acc + el / arr.length ,0 );
// console.log(calcAverageHumanAgeChain([3,5,2,12,7.4,1,15,8,3]));
 

//?PIPELINING (CHAINING METHODS)
// const totalDepositsInEURO = movements
//   .filter(mov => mov > 0)
//   .map((mov,i,arr) => {
//     // console.log(arr); 
//     return mov * eurToUsd})
//   .reduce((acc,mov) => acc + mov,0)
// console.log(totalDepositsInEURO);

//?FIND METHOD RETURNS THE FIRST ELEMENT THAT SATISFIES THE CONDITION
// const firstWithDrawal = movement.find(mov => mov < 0)

// console.log(accounts);

// const account = accounts.find(acc => acc.owner.startsWith('Jessica'))
// console.log(account);

// console.log(movements);
//?INCLUDES METHOD
// console.log(movements.includes(1500)); //?IT FINDS A SPECIFIC ELEMENT

//?SOME METHOD
// const anyDeposits = movements.some(mov => mov > 1500) //?IT FINDS THROUGH A CALLBACK
// console.log(anyDeposits);

// //*SEPARATE CALLBACK(GOOD TRICK BRO ;) )
// const deposit = mov => mov > 0;

// //?EVERY METHOD( ALL OF THE ELEMENTS IN THE ARRAY ARE TRUE)
// console.log(movements.every(deposit));
// console.log(account4.movements.every(deposit));

//? FLAT AND FLATMAP METHODS
// const arr = [[1,2,3], [4,5,6], 7,8]
// console.log(arr.flat()); //? DEFAULT, 1 DEPTH LEVEL

// const arrDeep = [[[1,2], 3], [4, [5,6], 7]]
// console.log(arrDeep.flat(2)); //?DEEPING 2 LEVEL

// const accountMovements = accounts.map(acc => acc.movements)
// console.log(accountMovements);
// const allMovements = accountMovements.flat()
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

//?CHAINING THE EARLY STUFF.
// const overallBalanceChained = accounts
//   // .map(mov => mov.movements)
//   // .flat() //?WE FLAT THE WHOLE ARRAYS INTO ONE
//   .flatMap(mov => mov.movements) //*INSTEAD...YOU CAN COMBINE FLAT AND MAP WITH IT!
//   //*BUT...YOU CAN ONLY DEEP 1 LEVEL WITH IT, OTHERWISE, USE FLAT METHOD.
//   .reduce((acc, mov) => acc + mov,0)
// console.log(overallBalanceChained);

//?SORT METHOD(!IMPORTANT)
//*ARRAY OF STRINGS
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners) //?THE ARRAY WAS MUTATED(MODIFIED)

//*ARRAY OF NUMBERS
// console.log(movements);
// console.log(movements.sort()); //! X WRONG

//* return < 0, A, B (keep order)
//* return > 0, B, A (switch order)
//*sort
// movements.sort((a,b) => {
//   if(a > b) return 1; if( a < b) return -1; //? < or > 0 is the rule in the return
// })
//?shortcut
// movements.sort((a,b) => a - b);

//*reverse
// console.log(movements);
// // movements.sort((a,b) => {
// //   if(a > b) return -1; if( a < b) return 1;
// // })
//?reverse shortcut
// movements.sort((a,b) => b - a);
// console.log(movements);

// ?MORE WAYS OF CREATING AND FILLING ARRAYS
// const newArray = [1,2,3,4,5,6,7]

// //?EMPTY ARRAY + FILL METHOD
// const x = new Array(7);
// // console.log(x);
// // console.log(x.map(() => 5)); //*NANCHIS, BUT...
// // console.log(x.fill(1)); //?IT WORKS!
// // console.log(x.fill(1,3,5)); //?(value, start, end)
// // console.log(newArray.fill(10, -2));
 
// //?Array.from method
// const y = Array.from({length: 7}, () => 1)
// // console.log(y);

// const z = Array.from({length: 7}, (_, i) => i + 1)

// // const rand = Array.from({length: 20}, (_, i) => Math.ceil(Math.random()*6))
// // console.log(rand);

// labelBalance.addEventListener('click', function(){
//                       //?REMEMBERING QSA TAKES A NODELIST(ARRAY LIKE STRUCTURE)
//                       //?AND IT'S CONVERTED AS AN ARRAY WITH ARRAY.FROM ;)
//                       //*second from parameter is a mapping function
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value'),
//   el => +(el.textContent.replace('$','')));
//   console.log(movementsUI);
// })

//TODO ------------------> ARRAY METHODS PRACTICE <--------------------------

// const bankDepositSum = accounts.flatMap(acc => acc.movements)
//   .filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)

// console.log(bankDepositSum);

//?>>>>>>>  2)
// const numDeposits1000 = accounts.flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0)

// console.log(numDeposits1000);

// let a = 10;
// console.log(a++); //?IT'S 11, BUT WE ARE SHOWING THE EARLY VALUE BEFORE THAN THE NEW
// console.log(a); //? NOW IT'S 11 ;)
// console.log(++a); //*THIS IS THE GOOD ONE (PREFIX INCREMENT)

//? >>>>>>> 3)
// const {deposits, withdrawals} = accounts.flatMap(acc => acc.movements)
//   .reduce((sums, cur) => {
//     // cur > 0 ? sums.deposits += cur : sums.withdrawals += -cur;
//     sums[cur > 0 ? 'deposits' : 'withdrawals'] += Math.abs(cur);
//     return sums;
//   }, {deposits: 0, withdrawals: 0})

// console.log(deposits, withdrawals);

//? >>>>>>> 4)

// const titleCase = function(title){
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const titleCase = title.toLowerCase();
//   return titleCase.split(' ').map(el => !exceptions.includes(el) ? el.charAt(0).toUpperCase() + el.slice(1) : el).join(' ')
// }

// console.log(titleCase('this is a title case'));
// console.log(titleCase('i will go with you'));

//TODO >>>>>>>>>>>>> ARRAY METHODS EXERCISE WITH THE DOGS <<<<<<<<<<<<<<<<<<<

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob']},
//   { weight: 8, curFood: 200, owners: ['Matilda']},
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John']},
//   { weight: 32, curFood: 340, owners: ['Michael']}
// ];

// //? >>>> 1) Create new property recommendedFood = weight ** .75 * 28

// dogs.forEach(dog => dog.recommendedFood = Math.trunc(dog.weight ** .75 * 28));
// // console.log(dogs);

// //? >>>> 2) Show if Sarah's dog is eating too much or little.

// // const sarahDog = dogs.find(dog => {
// //   if(dog.owners.includes('Sarah')){
// //     console.log(dog.curFood > dog.recommendedFood ? 'Much' : 'Little');
// //   }
// // })

// // sarahDog; //*CALLING THE VARIABLE

// //? >>>> 3) create array with dogs eatings much and little

// const gluttonyDogs = dogs.filter(dog => dog.curFood > dog.recommendedFood).flatMap(dog => dog.owners)

// const malnourishedDogs = dogs.filter(dog => dog.curFood < dog.recommendedFood).flatMap(dog => dog.owners)

// // console.log(gluttonyDogs);
// // console.log(malnourishedDogs);

// //? >>>> 4) LOOP THE EARLY FUNCTIONS AND PRINT EM IN A FORMATTED WAY

// // console.log(` ${gluttonyDogs.join(' and ')} dogs eat too much!`);
// // console.log(` ${malnourishedDogs.join(' and ')} dogs eat too much!`);

// //? >>>> 5) RETURN TRUE OR FALSE IF CURFOOD === RECOMMENDEDFOOD
// // console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// //? >>>> 6) RETURN TRUE OR FALSE IF DOG AV. EATING IS OK
// const isAverage = dog => dog.curFood < dog.recommendedFood * 1.1 && dog.curFood > dog.recommendedFood * .9;

// // console.log(dogs.some(isAverage))

// //? >>>> 7) FILTER HOW MANY DOGS FROM THE 6TH PT.
// // console.log(dogs.filter(isAverage));
 
// //? >>>> 8) COPY AN ARRAY AND SORT IT BASED ON THE CURRENT FOOD

// const dogsCopySorted = [...dogs].sort((a,b) => a.recommendedFood - b.recommendedFood)
// console.log(dogsCopySorted);

//TODO >>>>>>>>>>>>>>>>>>>>>> setTimeOut/intervals <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const ingredients = ['olives', 'spin'];
const pizzaTimer = setTimeout((ing1,ing2) => {
  console.log(`Here\'s your pizza with ${ing1} and ${ing2}`);
}, 3000, ...ingredients);
// console.log('Waiting...');
if(ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//?setInterval

setInterval(() => {
  const now = new Date();
  // console.log(now.toString().slice(16,24));
}, 1000);