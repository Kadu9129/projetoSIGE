
async function conexaoWebGet(endpoint) {
    const url = `https://api.curtiturismo.com.br:9090/${endpoint}`;  // Verifique se esta URL está correta

    console.log("Iniciando requisição para URL:", url);  // Log da URL

    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        },
        credentials: 'include' 
    };

    const timeout = 30000;  // Timeout de 30 segundos

    // Função de timeout
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout - A requisição demorou muito para responder')), timeout)
    );

    try {
        // Loga as opções da requisição antes de enviar
        console.log("Opções da requisição:", options);

        // Tenta fazer a requisição GET
        const response = await fetch(url, options);  // Sem timeout para isolar o problema

        if (!response.ok) {
            // Verifica se o servidor retornou um erro
            console.error(`Erro no servidor: ${response.statusText} (${response.status})`);
            throw new Error(`Erro na resposta do servidor: ${response.statusText} (${response.status})`);
        }

        // Loga o status da resposta antes de processar
        console.log("Resposta recebida com status:", response.status);

        // Retorna a resposta como JSON
        return await response.json();
    } catch (error) {
        // Loga o erro com detalhes para diagnóstico
        console.error("Erro na requisição GET:", error);
        throw error;
    }
}

async function conexaoWebPost(corpo, endpoint) {
    const url = `https://api.curtiturismo.com.br:9090/${endpoint}`; // Nota: usando https

    const mediaType = 'application/json; charset=utf-8';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': mediaType,
            'Accept': 'application/json'
        },
        body: JSON.stringify(corpo),
        credentials: 'include' // Inclui cookies de sessão na requisição
    };

    const timeout = 30000; // 30 segundos de timeout

    // Função para criar uma promessa de timeout
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout - A requisição demorou muito para responder')), timeout)
    );

    try {
        const response = await Promise.race([
            fetch(url, options),
            timeoutPromise
        ]);

        if (!response.ok) {
            throw new Error(`Erro na resposta: ${response.statusText} (${response.status})`);
        }

        return await response.json(); // Parseia a resposta JSON
    } catch (error) {
        console.error("Erro na requisição POST:", error);
        throw error;
    }
}




async function fazerLogin(email, password) {
    const endpoint = `Account/Login`;
    const corpo = { email, password };

    try {
        const response = await conexaoWebPost(corpo, endpoint);
        if (response.message === "Login bem-sucedido") {
            
            return true;
            //window.location.href = '/Home/Index'; // Redireciona para a página inicial protegida
        } else {
            console.warn("Falha no login:", response.message);
            // Exiba uma mensagem de erro ao usuário
            return false;
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        // Exiba uma mensagem de erro ao usuário
        alert("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
        return false;
    }
}

async function fazerLogout() {
    const endpoint = `Account/Logout`;

    try {
        const response = await conexaoWebPost({}, endpoint);
        if (response.message === "Logout bem-sucedido") {
            console.log("Usuário deslogado com sucesso!");
            window.location.href = '/Cadastro/Pagina/Consultar'; // Redireciona para a página de login
        } else {
            console.warn("Falha no logout:", response.message);
            // Exiba uma mensagem de erro ao usuário
            alert("Ocorreu um erro ao tentar fazer logout.");
        }
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        // Exiba uma mensagem de erro ao usuário
        alert("Ocorreu um erro ao tentar fazer logout.");
    }
}


function verificarSessao() {
    setInterval(async () => {
        try {
            const endpoint = `Session/Check`; // Endpoint para verificar a validade da sessão
            const resposta = await conexaoWebGet(endpoint);
            if (!resposta.valida) {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
                window.location.href = '/Cadastro/Pagina/Consultar';
            }
        } catch (error) {
            console.error("Erro ao verificar sessão:", error);

            window.location.href = '/Cadastro/Pagina/Consultar';
        }
    }, 5 * 60 * 1000); // Verifica a cada 5 minutos
}

// Inicializa a verificação de sessão ao carregar a página
window.onload = verificarSessao;




async function autenticarCliente(token, cpfLimpo) {
    try {
        const endpoint = `Mensagem/Cliente/Autenticar/${token}`;

        const resultado = await fazerLogin(cpfLimpo, "senha123");

        if (resultado) {
            const response = await conexaoWebPost(null, endpoint);

            // Ajuste conforme a estrutura da resposta do servidor
            return response && response.includes("sucesso"); // Verifica se contém "sucesso" ou outra indicação de sucesso
        }
    } catch (error) {
        console.error("Erro ao autenticar cliente:", error);
        return false;
    }
}



// Função para buscar cliente
async function buscarCliente(CPF_cliente) {
    const cpfLimpo = CPF_cliente.toString().replace(/[.-]/g, '');

    try {
        // Constrói o endpoint da API usando o CPF, login e senha
        const endpoint = `Site/Buscar/cliente/${cpfLimpo}`;

        //TEMPORARIO: Atualizar para o login real
        const resultado = await fazerLogin(cpfLimpo, "senha123");

        if(resultado){
            
           // Faz a requisição GET para o endpoint
            const response = await conexaoWebGet(endpoint);
    
            console.log("Resposta recebida:", response);
            
            // Verifica se a resposta foi recebida e contém os dados do cliente
            if (response && response.cadastro != null) {
    
                return {
                    Cadastro: {
                        CPF: response.cadastro?.cpf || null,
                        RG: response.cadastro?.rg || null,
                        Nome: response.cadastro?.nome || null,
                        DataNascimento: response.cadastro?.dataNascimento || null,
                        Vendedor: response.cadastro?.vendedor || null,
                        CriadoEm: response.cadastro?.criadoEm || null
                    },
                    Contato: {
                        CPF: response.contato?.cpf || null,
                        Telefone: response.contato?.telefone || null,
                        StatusTelefone: response.contato?.statusTelefone || null,
                        Email: response.contato?.email || null,
                        StatusEmail: response.contato?.statusEmail || null,
                        TelefoneEmer: response.contato?.telefoneEmer || null,
                        NomeEmer: response.contato?.nomeEmer || null
                    },
                    Identidade: response.identidade,
                    Endereco: response.endereco
                };
                
            } else {
                
            // Se os dados não forem encontrados, retorna um objeto vazio
                return {
                    Cadastro: { CPF: 0, RG: "", Nome: "", DataNascimento: "", Vendedor: "", CriadoEm: null },
                    Contato: { CPF: 0, Telefone: null, StatusTelefone: "", Email: "", StatusEmail: "", TelefoneEmer: "", NomeEmer: "" },
                    Identidade: false,
                    Endereco: false
                };
            }
        }
        
        return {
            Cadastro: { CPF: 0, RG: "", Nome: "", DataNascimento: "", Vendedor: "", CriadoEm: null },
            Contato: { CPF: 0, Telefone: null, StatusTelefone: "", Email: "", StatusEmail: "", TelefoneEmer: "", NomeEmer: "" },
            Identidade: false,
            Endereco: false
        };
        
        
    } catch (error) {
        // Loga o erro e lança a exceção para ser tratada em outro lugar
        console.error("Erro ao buscar o cliente:", error);
        throw error;
    }
}



// Função para cadastrar cliente
async function cadastrarCliente(Cliente, Cidade) {
    try {
        const requestBody = {
            ...Cliente
        };

        const endpoint = `Cliente/Cadastrar/Informacoes/${Cidade}`;


        const response = await conexaoWebPost(requestBody, endpoint);

        if (response === true) {
            return true; 
        } else {
            console.warn("Erro ao cadastrar cliente. Resposta recebida:", response);
            return false; 
        }
    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
        return false; 
    }
}

// Função para cadastrar endereço do cliente
async function cadastrarCliente_Endereco(Endereco) {
    try {
        const requestBody = {
            ...Endereco
        };

        const endpoint = `Cliente/Cadastrar/Endereco`;

        const response = await conexaoWebPost(requestBody, endpoint);

        if (typeof response === 'string') {
            return response.trim().toLowerCase() === "true";
        } else if (typeof response === 'boolean') {
            return response;
        } else {
            console.warn("Formato inesperado da resposta:", response);
            return false;
        }
    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
        return false;
    }
}



async function readFileAsBase64(uint8Array) {
    return new Promise((resolve, reject) => {
        const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // remove "data:application/octet-stream;base64,"
        reader.onerror = error => reject(error);
        reader.readAsDataURL(blob);
    });
}

function readAsBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const buffer = new Uint8Array(reader.result);
            resolve(buffer);
        };
        reader.onerror = function(e) {
            reject(e);
        };
        reader.readAsArrayBuffer(file);
    });
}


// Função para cadastrar identidade do cliente
async function cadastrarCliente_Identidade(clienteIdentidade) {
    try {
        
        const requestBody = {
            ...clienteIdentidade
        };

        const endpoint = `Cliente/Cadastrar/Identidade`;

        const response = await conexaoWebPost(requestBody, endpoint);

        if (typeof response === 'string') {
            return response.trim().toLowerCase() === "true";
        } else if (typeof response === 'boolean') {
            return response;
        } else {
            console.warn("Formato inesperado da resposta:", response);
            return false;
        }
    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
        return false;
    }
}

// Função para cadastrar contato do cliente
async function cadastrarCliente_contato(Cliente) {
    try {
        const requestBody = {
            ...Cliente
        };

        const endpoint = `Cliente/Cadastrar/Contato`;

        const response = await conexaoWebPost(requestBody, endpoint);

        if (typeof response === 'string') {
            return response.trim().toLowerCase() === "true";
        } else if (typeof response === 'boolean') {
            return response;
        } else {
            console.warn("Formato inesperado da resposta:", response);
            return false;
        }
    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
        return false;
    }
}