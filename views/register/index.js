const BASE_URL = 'http://localhost:3000/api/user';

const userId = window.localStorage.getItem('id');
const isRegister = userId !== null;
// console.log(isRegister)

if (isRegister) {
  window.location.href = '/';
}

const form = document.getElementById('register-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-pwd');
const emailInput = document.getElementById('email');

const handleSubmit = (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const confirmPwd = confirmInput.value;
  const email = emailInput.value;

  fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      confirmPwd,
      email
    }),
  })
    .then((res) => {
      if (!res.ok) {
        alert('Failed to Register!');
        return;
      }
      return res.json();
    })
    .then(({ token }) => {
      // after signup, set the token and username to the localStorage, you don't have to set the username in localStorage, it is just for display purposes
      window.localStorage.setItem('token', token);
    //   window.localStorage.setItem('username', username);
    })
    .then(() => (window.location.href = '/'))
    .catch((err) => {
      alert(err.message);
    });
};

form.addEventListener('submit', handleSubmit);