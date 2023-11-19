const  nameInput = document.getElementById('username');
const pwdInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-pwd');

document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const usernameOrEmail = nameInput.value;
    const password = pwdInput.value;
    const confirmPwd = confirmInput.value;

    try {
		const response = await fetch('/api/user/reset-password', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				usernameOrEmail,
				password,
				confirmPwd
			})
		});
      
		if (response.ok) {
			alert('Password reset successfully');
		} else {
			const data = await response.json();
			alert(data.message);
		}
    } catch (error) {
      console.error('Password reset error:', error);
    }
});