async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById('signup-message').innerText = data.message;

    if (response.ok) {
        // Redirect to login page after successful signup
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById('login-message').innerText = data.message;

    if (response.ok) {
        // Redirect to the main app page after successful login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}
