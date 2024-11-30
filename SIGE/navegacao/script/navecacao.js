document.addEventListener('DOMContentLoaded', function() {
    const scripts = [
        '../navegacao/paginas/inicio/script/inicio.js',
        '../navegacao/paginas/inicio/script/informacoes.js'
    ];

    const styles = [
        '../navegacao/paginas/inicio/styles/inicio.css',
        '../navegacao/paginas/inicio/styles/responsividade.css'
    ];

    carregarPagina('paginas/inicio/inicio.html', scripts, styles);
});

const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
const navLinks = document.querySelector('.nav-links');

mobileMenuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Função para carregar páginas dinamicamente
function carregarPagina(url, scripts, styles, id = null) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const conteudoElement = document.getElementById('centroExibicao');
            if (conteudoElement) {
                conteudoElement.innerHTML = html;
                carregarEstilos(styles);
                reinicializarScripts(scripts, () => {
                    
                });
            } else {
                console.error('Elemento #centroExibicao não encontrado no DOM.');
            }
        })
        .catch(error => console.error('Erro ao carregar página:', error));
}

async function reinicializarScripts(scripts, callback) {
    // Remove scripts dinâmicos anteriores
    document.querySelectorAll('.dynamic-script').forEach(script => script.remove());

    try {
        for (const src of scripts) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.classList.add('dynamic-script');
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Erro ao carregar o script: ${src}`));
                document.body.appendChild(script);
            });
        }

        if (callback) callback();
    } catch (error) {
        console.error(error);
    }
}

// Função para carregar estilos dinamicamente
function carregarEstilos(styles) {
    // Remove estilos dinâmicos anteriores
    document.querySelectorAll('.dynamic-style').forEach(style => style.remove());

    // Adiciona novos estilos
    styles.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.classList.add('dynamic-style');
        document.head.appendChild(link);
    });
}

// Eventos nos itens do menu
document.querySelectorAll('.menuElement').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const fundoClass = this.getAttribute('data-fundo');
        selecionarPagina(fundoClass);
    });
});

function selecionarPagina(fundoClass) {
    let url;
    let scripts = [];
    let styles = [];

    switch(fundoClass) {
        case 'menu1-fundo':
        case 'Inicio':
            url = '../navegacao/paginas/inicio/inicio.html';

            scripts = [
                '../navegacao/paginas/inicio/script/inicio.js',
                '../navegacao/paginas/inicio/script/informacoes.js'
            ];
            styles = [
                '../navegacao/paginas/inicio/styles/inicio.css',
                '../navegacao/paginas/inicio/styles/responsividade.css'
            ];

            break;
        case 'menu2-fundo':

        case 'Programas':
            url = 'paginas/programas/programas.html';
            scripts = [
                'paginas/programas/programas.js'
            ];
            styles = [
                'paginas/programas/programas.css'
            ];
            break;
        case 'menu3-fundo':
        case 'Entrar':
            window.location.href = "../navegacao/paginas/login/login.html";
            break;
        case 'Sobre':
            url = 'paginas/inicio/login.html';
            scripts = [];
            styles = [
                'paginas/sobre/sobre.css'
            ];
            break;
        case 'Contatos':
            url = 'paginas/contatos/contatos.html';
            scripts = [];
            styles = [
                'paginas/contatos/contatos.css'
            ];
            break;
        default:
            console.error('Fundo desconhecido:', fundoClass);
            return;
    }

    // Fecha o menu móvel se estiver aberto
    if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
    }

    if (fundoClass !== 'Entrar') {
        carregarPagina(url, scripts, styles);
    }
}
