const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const mobileSignUpButton = document.getElementById('mobileSignUp');
const mobileSignInButton = document.getElementById('mobileSignIn');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Eventos para os botões em telas menores
mobileSignUpButton.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.add("right-panel-active");
});

mobileSignInButton.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.remove("right-panel-active");
});

// Mock database
let users = [];

// Handle Registration
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Simple validation
    if (users.find(user => user.email === email)) {
        alert('Email já cadastrado!');
    } else {
        users.push({ name, email, password });
        alert('Cadastro realizado com sucesso!');
        container.classList.remove("right-panel-active");
        registerForm.reset();
    }
});

// Handle Login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        alert(`Bem-vindo, ${user.name}!`);
        // Redirecionar para a página inicial ou dashboard
        window.location.href = '/navegacao/navegacao.html';
    } else {
        alert('Email ou senha incorretos!');
    }
});
