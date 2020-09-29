window.addEventListener('load', start);

const html = {
  input: document.querySelector('form input'),
  button: document.querySelector('form button'),
  form: document.querySelector('form')
};

let usersData;

function start() {
  preventPageReload();
}

function preventPageReload() {
  function handleSubmit(event) {
    event.preventDefault();
    fetchData();
  }

  html.form.addEventListener('submit', handleSubmit)
}

async function fetchData() {
  const res = await window.fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=US&noinfo');
  const json = await res.json();
  usersData = json.results.map( user => {
    const { gender, name, dob, picture } = user;

    return {
      gender,
      name: `${name.first} ${name.last}`,
      age: dob.age,
      picture: picture.large
    }
  });

  render();
}

function render() {
  searchUsers();
  sortUsers();
}

function searchUsers() {
  const users = [];
  usersData.forEach( user => {
    const { gender, name, age, picture } = user;

    if (name.toLowerCase()
      .indexOf(html.input.value.toLowerCase()) > -1) {
        users.push(user)
      }
  });
  
  sortUsers(users);
}

function sortUsers(users) {

  if (users === undefined) {
    return;
  }

  users.sort( (a, b) => {
    return a.name.localeCompare(b.name);
  });
  renderUsersList(users);
  renderStats(users);
}

function renderUsersList(users) {
  const usersList = document.querySelector('.users-box ul');
  usersList.innerHTML = '';

  users.forEach( user => {
    const userItem = document.createElement('li');

    const userPicture = document.createElement('img');
    userPicture.setAttribute('src', user.picture);
    const userProfile = document.createElement('span');
    userProfile.textContent = `${user.name}, ${user.age} anos`;

    usersList.appendChild(userItem);
    userItem.appendChild(userPicture);
    userItem.appendChild(userProfile);

    document.querySelector('#numberOfUsers').textContent = users.length;
  })
}

function renderStats(users) {
  const maleUsersHtml = document.querySelector('#maleUsers');
  const femaleUsersHtml = document.querySelector('#femaleUsers');
  const sumOfAgesHtml = document.querySelector('#sumOfAges');
  const averageAgesHtml = document.querySelector('#averageAges');

  let maleUsersCount = 0;
  let femaleUsersCount = 0;
  let sumOfAgesNumber = 0;
  let averageAgesNumber = 0;

  users.forEach( user => {
    if (user.gender === 'male') 
      maleUsersCount += 1;
    if (user.gender === 'female') 
      femaleUsersCount += 1;

    sumOfAgesNumber += user.age; 
  })

  averageAgesNumber = sumOfAgesNumber / users.length;

  maleUsersHtml.textContent = maleUsersCount;
  femaleUsersHtml.textContent = femaleUsersCount;
  sumOfAgesHtml.textContent = sumOfAgesNumber;
  averageAgesHtml.textContent = maxDecimals(averageAgesNumber, 2);
}

function maxDecimals(number, dec) {
  number = String(number);
  const entireNumber = number.slice(0, number.indexOf('.') + 1);
  const decimalNumber = number.slice(number.indexOf('.') + 1, number.length);
  const fullNumber = Number(entireNumber + decimalNumber)

  if(dec >= decimalNumber.length) {
    return Number(number);
  } else {
    return Number(fullNumber.toFixed(dec));
  }
}