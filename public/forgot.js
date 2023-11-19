const emailInput = document.getElementById('email');
document.getElementById('forgotPasswordForm').addEventListener('submit', async (event) => {
	event.preventDefault();
    const email = emailInput.value;
	if (email.trim() !== ''){
    	try {
    		const response = await fetch('/api/user/forgot-password', {
          	method: 'POST',
          	headers: {
            	'Content-Type': 'application/json'
          	},
          	body: JSON.stringify({ email })
        });
        	if (response.ok) {
        		alert('Password reset link sent to your email');
        		emailInput.value = '';
        	} else {
        		const data = await response.json();
        		alert(data.message);
        	}
      	} catch (error) {
    		console.error('Password reset error:', error);
      	}
    } else {
      alert('Please check your email address')
    }
    
});