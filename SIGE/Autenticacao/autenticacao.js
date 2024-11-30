
function getTokenFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
}


async function generateHash(cpfInput, token) {
    const data = new TextEncoder().encode(cpfInput + token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    // Função mais robusta para converter o Uint8Array para Base64
    const base64Hash = arrayBufferToBase64(hashArray);
    return base64Hash;
}

// Função para converter Uint8Array para Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

document.getElementById('authForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'flex';
    
    const cpfInput = document.getElementById('cpf').value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const token = getTokenFromURL(); // Assegure-se de que retorna uma string

    // Função para esconder o loading screen
    function hideLoading() {
        loadingScreen.style.display = 'none';
    }

    if (!validarCPF(cpfInput)) {
        document.getElementById('message').textContent = 'CPF inválido. Por favor, tente novamente.';
        document.getElementById('message').style.color = 'red';
        hideLoading();
        return;
    }

    if (!token) {
        document.getElementById('message').textContent = 'Token não encontrado. Link inválido.';
        document.getElementById('message').style.color = 'red';
        hideLoading();
        return;
    }

    try {
        const codigo = await generateHash(cpfInput, token);
        console.log('Valor de código gerado:', codigo);

        const autenticado = await autenticarCliente(codigo, cpfInput);
        
        console.log('Resultado da autenticação:', autenticado);

        if (autenticado) {
            document.getElementById('message').style.color = 'green';
            document.getElementById('message').textContent = 'Autenticação realizada com sucesso!';
        } else {
            document.getElementById('message').style.color = 'red';
            document.getElementById('message').textContent = 'Falha na autenticação. Verifique seus dados.';
        }
        
        hideLoading();
    } catch (error) {
        console.error("Erro durante o processo de autenticação:", error);
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').textContent = 'Ocorreu um erro. Tente novamente mais tarde.';
        
        hideLoading();
    }
});




// Função para aplicar a máscara ao CPF
function aplicarMascaraCPF(input) {
    let cpf = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length > 9) {
        cpf = cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6, 9) + '-' + cpf.substring(9, 11);
    } else if (cpf.length > 6) {
        cpf = cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6);
    } else if (cpf.length > 3) {
        cpf = cpf.substring(0, 3) + '.' + cpf.substring(3);
    }

    input.value = cpf; // Atualiza o valor do input com a máscara
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ''); 
    if (cpf.length !== 11) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

    return parseInt(cpf.charAt(9)) === digitoVerificador1 && parseInt(cpf.charAt(10)) === digitoVerificador2;
}

