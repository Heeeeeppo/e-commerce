const BASE_URL = 'http://localhost:3000/api/user';

const userId = window.localStorage.getItem('id');
const isLoggedIn = userId !== null;

if (isLoggedIn) {
  window.location.href = '/';
}

const form = document.getElementById('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const handleSubmit = (e) => {
	e.preventDefault();
	const usernameOrEmail = usernameInput.value;
	const password = passwordInput.value;

	fetch(`${BASE_URL}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			usernameOrEmail,
			password,
		}),
	})
    .then((res) => {
    	if (!res.ok) {

			usernameInput.value = '';
			passwordInput.value = '';
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
    	// console.log(err.message)
    	alert(err.message);
    });
};

form.addEventListener('submit', handleSubmit);
