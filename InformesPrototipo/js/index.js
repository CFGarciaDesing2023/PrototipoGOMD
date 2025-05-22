document.addEventListener('DOMContentLoaded', function () {
    // ========================
    // ANIMACIONES AL HACER SCROLL
    // ========================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card, .galeria-item, .section-title, .proyecto-card');
        elements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // ========================
    // LIGHTBOX SIMULADO
    // ========================
    document.querySelectorAll('.galeria-item').forEach(item => {
        item.addEventListener('click', () => {
            const src = item.querySelector('img').src;
            console.log('Mostrar imagen en lightbox:', src);
            // Aquí puedes agregar tu lógica personalizada o una librería.
        });
    });

    // ========================
    // VALIDACIÓN DE FORMULARIO
    // ========================
    const contactoForm = document.getElementById('contactoForm');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !email || !mensaje) {
                alert('Por favor complete todos los campos');
                return;
            }
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor ingrese un email válido');
                return;
            }

            console.log('Formulario enviado:', { nombre, email, mensaje });
            alert('Gracias por su mensaje. Nos pondremos en contacto pronto.');
            contactoForm.reset();
        });
    }



    // Modal de empresa
const modalEmpresa = document.getElementById('modalEmpresa');
const abrirEmpresa = document.getElementById('abrirModalEmpresa');
const cerrarEmpresa = document.getElementById('cerrarModalEmpresa');

abrirEmpresa.addEventListener('click', (e) => {
  e.preventDefault();
  modalEmpresa.style.display = 'flex';
});

cerrarEmpresa.addEventListener('click', () => {
  modalEmpresa.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modalEmpresa) {
    modalEmpresa.style.display = 'none';
  }
});

    // ========================
    // CARGAR MÁS PROYECTOS
    // ========================
    const btnCargarMas = document.getElementById('btnCargarMas');
    const proyectosContainer = document.getElementById('proyectosContainer');
    if (btnCargarMas && proyectosContainer) {
        btnCargarMas.addEventListener('click', function () {
            this.textContent = 'Cargando...';
            this.disabled = true;

            setTimeout(() => {
                const nuevosProyectos = [
                    {
                        titulo: 'Proyecto de Conservación Hídrica',
                        descripcion: 'Programa de conservación de fuentes hídricas en áreas protegidas.',
                        imagen: '../InformesPrototipo/img/proyecto4.jpg',
                        fecha: 'Julio 2023 - Noviembre 2023'
                    },
                    {
                        titulo: 'Capacitación Comunitaria',
                        descripcion: 'Talleres de educación ambiental para comunidades rurales.',
                        imagen: '../InformesPrototipo/img/proyecto5.jpg',
                        fecha: 'Febrero 2023 - Abril 2023'
                    }
                ];

                nuevosProyectos.forEach(proyecto => {
                    const html = `
                        <div class="proyecto-card animate__animated animate__fadeInUp">
                            <img src="${proyecto.imagen}" alt="${proyecto.titulo}" class="proyecto-img">
                            <div class="proyecto-info">
                                <h3>${proyecto.titulo}</h3>
                                <p>${proyecto.descripcion}</p>
                                <div class="proyecto-meta"><span>${proyecto.fecha}</span></div>
                            </div>
                        </div>`;
                    proyectosContainer.insertAdjacentHTML('beforeend', html);
                });

                this.textContent = 'Ver más proyectos';
                this.disabled = false;
                animateOnScroll(); // Para animar los nuevos elementos
            }, 1500);
        });
    }

    // ========================
    // NAVBAR TOGGLE (RESPONSIVE)
    // ========================
    const navToggle = document.querySelector('.navbar-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.querySelector('.navbar-nav').classList.toggle('active');
        });
    }

    // ========================
    // MODAL INICIO DE SESIÓN / REGISTRO
    // ========================
    const modal = document.getElementById('modal');
    const modalOpen = document.getElementById('modal-open');
    const modalClose = document.getElementById('modal-close');

    if (modal && modalOpen && modalClose) {
        modalOpen.addEventListener('click', () => modal.style.display = 'flex');
        modalClose.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', e => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    // ========================
    // TABS LOGIN / REGISTER
    // ========================
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    authTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            authForms[index].classList.add('active');
        });
    });

    // ========================
    // CARRUSEL MANUAL
    // ========================
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');

    let currentIndex = 0;
    const updateCarousel = (index) => {
        const width = carouselItems[0]?.clientWidth || 0;
        carouselInner.style.transform = `translateX(-${index * width}px)`;
        indicators.forEach(i => i.classList.remove('active'));
        if (indicators[index]) indicators[index].classList.add('active');
    };

    if (prevBtn && nextBtn && carouselItems.length) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            updateCarousel(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            updateCarousel(currentIndex);
        });

        indicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel(currentIndex);
            });
        });

        // Auto-slide (opcional)
        setInterval(() => {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            updateCarousel(currentIndex);
        }, 5000);
    }
});
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalContacto');
  const abrir = document.getElementById('abrirModalContacto');
  const cerrar = document.getElementById('cerrarModalContacto');
  const form = document.getElementById('formularioContacto');

  // Mostrar modal
  abrir.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  // Cerrar modal
  cerrar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Cerrar al hacer clic fuera del contenido
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Función de sanitización básica
  function sanitizeInput(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
  }

  // Validar y enviar formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = sanitizeInput(document.getElementById('nombre').value);
    const email = sanitizeInput(document.getElementById('email').value);
    const mensaje = sanitizeInput(document.getElementById('mensaje').value);

    if (!nombre || !email || !mensaje) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Correo inválido.");
      return;
    }

    // Aquí podrías hacer un fetch/AJAX para enviar al servidor
    console.log({ nombre, email, mensaje });
    alert("Gracias por contactarnos. Te responderemos pronto.");
    form.reset();
    modal.style.display = 'none';
  });
});
