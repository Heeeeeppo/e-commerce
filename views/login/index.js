const BASE_URL = 'http://localhost:3000/api/user';

const userId = window.localStorage.getItem('id');
const isLoggedIn = userId !== null;

if (isLoggedIn) {
  window.location.href = '/';
}

const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const handleSubmit = (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        alert('Failed to login');
        return;
      }
      return res.json();
    })
    .then(({ token }) => {
      // after login, set the token and username to the localStorage, you don't have to set the username in localStorage, it is just for display purposes
      window.localStorage.setItem('token', token);
    //   window.localStorage.setItem('username', username);
    })
    .then(() => (window.location.href = '/')) // after setting everything in localStorage, redirect to home page
    .catch((err) => {
      alert(err.message);
    });
};

form.addEventListener('submit', handleSubmit);
