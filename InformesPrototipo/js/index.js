document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const btnAcceso = document.getElementById('btnAcceso');
    const modalAcceso = document.getElementById('modalAcceso');
    const modalCerrar = document.getElementById('modalCerrar');
    const btnCancelar = document.getElementById('btnCancelar');
    const carousel = document.getElementById('mainCarousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselIndicators = document.querySelectorAll('.indicator');
    const proyectosContainer = document.getElementById('proyectosContainer');
    
    // Datos de proyectos (simulados, en un caso real vendrían de una API)
    const proyectos = [
        {
            id: 1,
            titulo: 'PTAR San José del Guaviare',
            descripcion: 'Operación y mantenimiento de la planta de tratamiento de aguas residuales del municipio.',
            imagen: '/InformesPrototipo/img/5.jpg',
            fecha: 'Enero 2023 - Actualidad'
        },
        {
            id: 2,
            titulo: 'PTAP El Retorno',
            descripcion: 'Implementación y puesta en marcha de la planta de tratamiento de agua potable.',
            imagen: '/InformesPrototipo/img/planta-tratamiento-agua-potable-ptap-07.jpg',
            fecha: 'Julio 2022 - Diciembre 2022'
        },
        {
            id: 3,
            titulo: 'Mantenimiento PTAR Calamar',
            descripcion: 'Mantenimiento preventivo y correctivo de la planta de tratamiento.',
            imagen: '/InformesPrototipo/img/equipo.jpg',
            fecha: 'Marzo 2022 - Junio 2022'
        },
        {
            id: 4,
            titulo: 'Capacitación Operarios PTAR',
            descripcion: 'Programa de capacitación para operarios de plantas de tratamiento en el departamento.',
            imagen: '/InformesPrototipo/img/TimePhoto_20250510_143259.jpg',
            fecha: 'Noviembre 2021 - Febrero 2022'
        }
    ];
    
    // Función para inicializar el carrusel
    function initCarousel() {
        let currentIndex = 0;
        const totalItems = carouselItems.length;
        let carouselInterval;
        
        // Función para mostrar un slide específico
        function showSlide(index) {
            // Validar índice
            if (index >= totalItems) {
                index = 0;
            } else if (index < 0) {
                index = totalItems - 1;
            }
            
            // Ocultar todos los slides
            carouselItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Mostrar el slide actual
            carouselItems[index].classList.add('active');
            
            // Actualizar indicadores
            carouselIndicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            currentIndex = index;
        }
        
        // Función para avanzar al siguiente slide
        function nextSlide() {
            showSlide(currentIndex + 1);
        }
        
        // Función para retroceder al slide anterior
        function prevSlide() {
            showSlide(currentIndex - 1);
        }
        
        // Iniciar intervalo para cambio automático
        function startCarousel() {
            carouselInterval = setInterval(nextSlide, 5000);
        }
        
        // Detener intervalo
        function stopCarousel() {
            clearInterval(carouselInterval);
        }
        
        // Event listeners para controles
        carouselNext.addEventListener('click', () => {
            nextSlide();
            stopCarousel();
            startCarousel();
        });
        
        carouselPrev.addEventListener('click', () => {
            prevSlide();
            stopCarousel();
            startCarousel();
        });
        
        // Event listeners para indicadores
        carouselIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                stopCarousel();
                startCarousel();
            });
        });
        
        // Pausar carrusel al hacer hover
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
        
        // Iniciar carrusel
        showSlide(0);
        startCarousel();
    }
    
    // Función para cargar proyectos
    function loadProyectos() {
        proyectos.forEach(proyecto => {
            const proyectoHTML = `
                <div class="proyecto-card fade-in">
                    <div class="proyecto-imagen">
                        <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
                    </div>
                    <div class="proyecto-info">
                        <span class="proyecto-fecha">${proyecto.fecha}</span>
                        <h3>${proyecto.titulo}</h3>
                        <p>${proyecto.descripcion}</p>
                        <a href="#" class="btn btn-primary">Ver detalles</a>
                    </div>
                </div>
            `;
            
            proyectosContainer.insertAdjacentHTML('beforeend', proyectoHTML);
        });
    }
    
    // Función para manejar el scroll de la página
    function handleScroll() {
        // Efecto de navbar al hacer scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Animaciones al hacer scroll
        const fadeElements = document.querySelectorAll('.fade-in');
        
        fadeElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.animation = 'fadeIn 1s ease forwards';
            }
        });
    }
    
    // Event listeners
    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('show');
        
        // Animación del botón hamburguesa
        navbarToggle.classList.toggle('active');
    });
    
    btnAcceso.addEventListener('click', (e) => {
        e.preventDefault();
        modalAcceso.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    modalCerrar.addEventListener('click', () => {
        modalAcceso.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    btnCancelar.addEventListener('click', () => {
        modalAcceso.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modalAcceso.addEventListener('click', (e) => {
        if (e.target === modalAcceso) {
            modalAcceso.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('show')) {
                navbarMenu.classList.remove('show');
                navbarToggle.classList.remove('active');
            }
        });
    });
    
    // Inicialización de funciones
    initCarousel();
    loadProyectos();
    
    // Event listener para scroll
    window.addEventListener('scroll', handleScroll);
    
    // Mostrar elementos al cargar la página
    handleScroll();
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});