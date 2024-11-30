
function inicializarInicio() {
    
    /* Carrossel de Cards */
    const carousels = document.querySelectorAll('.carousel-container');

    if (carousels.length > 0) {
        carousels.forEach(carouselContainer => {
            const carousel = carouselContainer.querySelector('.cards-list');
            const leftBtn = carouselContainer.querySelector('.left-btn');
            const rightBtn = carouselContainer.querySelector('.right-btn');
            const card = carousel.querySelector('.card');

            if (card) {
                const cardWidth = card.offsetWidth + 15; // Largura do card + margem

                leftBtn.addEventListener('click', () => {
                    carousel.scrollBy({
                        top: 0,
                        left: -cardWidth,
                        behavior: 'smooth'
                    });
                });

                rightBtn.addEventListener('click', () => {
                    carousel.scrollBy({
                        top: 0,
                        left: cardWidth,
                        behavior: 'smooth'
                    });
                });
            } else {
                console.warn('Nenhum card encontrado no carrossel.');
            }
        });
    } else {
        console.warn('Nenhum carrossel encontrado.');
    }

    /* Carrossel de Depoimentos */
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    if (testimonials.length > 0) {
        const showTestimonial = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
        };

        const nextTestimonial = () => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        };

        // Mostrar o primeiro depoimento
        showTestimonial(currentTestimonial);

        // Mudar de depoimento a cada 5 segundos
        setInterval(nextTestimonial, 5000);
    } else {
        console.warn('Nenhum depoimento encontrado.');
    }

    /* Animação ao rolar a página */
    const scrollElements = document.querySelectorAll('.scroll-animation');

    if (scrollElements.length > 0) {
        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;

            return (
                elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };

        const displayScrollElement = (element) => {
            element.classList.add('active');
        };

        const hideScrollElement = (element) => {
            element.classList.remove('active');
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                } else {
                    hideScrollElement(el);
                }
            });
        };

        window.addEventListener('scroll', handleScrollAnimation);

        // Verificar imediatamente ao carregar a página
        handleScrollAnimation();
    } else {
        console.warn('Nenhum elemento de animação de rolagem encontrado.');
    }

    inicializarInformacoes();

}
