const BASE_URL = 'http://localhost:3000/api/user';

const userId = window.localStorage.getItem('id');
const isRegister = userId !== null;
// console.log(isRegister)

if (isRegister) {
  window.location.href = '/';
}

const form = document.getElementById('form');
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

			usernameInput.value = '';
			passwordInput.value = '';
			confirmInput.value = '';
			emailInput.value = '';

			return res.json().then((data) => {
				throw new Error(data.message);
			})
      	}
    	return res.json();
    })
    .then(({ token }) => {
    	window.localStorage.setItem('token', token);
    	window.location.href = '/';
    })
    .catch((err) => {
    	alert(err.message);
    });
};

form.addEventListener('submit', handleSubmit);