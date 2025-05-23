// Navegación Responsive
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    navbarToggle.addEventListener('click', function() {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('show');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarMenu.classList.contains('show')) {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('show');
            }
        });
    });
    
    // Cambiar navbar al hacer scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Modal de Acceso
    const modalAcceso = document.getElementById('modalAcceso');
    const btnAcceso = document.getElementById('btnAcceso');
    const modalCerrar = document.getElementById('modalCerrar');
    const btnCancelar = document.getElementById('btnCancelar');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');
    
    // Abrir modal
    btnAcceso.addEventListener('click', function(e) {
        e.preventDefault();
        modalAcceso.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar modal
    function cerrarModal() {
        modalAcceso.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    modalCerrar.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', cerrarModal);
    
    // Cerrar al hacer clic fuera del modal
    modalAcceso.addEventListener('click', function(e) {
        if (e.target === modalAcceso) {
            cerrarModal();
        }
    });
    
    // Cambiar entre pestañas de login y registro
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        btnLogin.style.display = 'block';
        btnRegister.style.display = 'none';
        document.getElementById('modalTitle').textContent = 'Acceder';
    });
    
    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        btnLogin.style.display = 'none';
        btnRegister.style.display = 'block';
        document.getElementById('modalTitle').textContent = 'Registrarse';
    });
    
   
    
    // Objeto con los sitios disponibles por base
const sitiosPorBase = {
    "Erones": ["PTAR", "PTAP"],
    "CPAMS": ["PTAR"],
    "CPMS IPIALES": ["PTAR", "PTAP"],
    "E.P Heliconias": ["PTAR"],
    "EPMSC:Leticia": ["PTAP"],
    "GAORI": ["PTAR", "CEA", "MANTENIMIENTO"],
    "GACAS": ["PTAR", "PTAP", "CEA", "MANTENIMIENTO"],
    "GAMAA": ["PTAR", "CEA", "MANTENIMIENTO"],
    "GACAR": ["MANTENIMIENTO"],
    "CACOM2": ["PTAR", "PTAP", "CEA", "MANTENIMIENTO"],
    "CACOM3": ["PTAR", "CEA", "MANTENIMIENTO"],
    "CACOM4": ["FLANDES", "MELGAR", "CERRO MARIA", "MANTENIMIENTO"],
    "CACOM5": ["PTAR", "MANTENIMIENTO"]
};

// Mapeo de departamentos a ciudades
const ciudadesPorDepartamento = {
    "Antioquia": ["Apartadó", "Heliconias", "Leticia", "Otras..."],
    "Caldas": ["Dorada", "Otras..."],
    "Nariño": ["Ipiales", "Otras..."],
    "Tolima": ["Flandes", "Melgar", "Otras..."],
    "Valle del Cauca": ["Cerro María", "Otras..."]
    // Agrega más según necesidad
};

// Evento para cargar ciudades cuando se selecciona departamento
document.getElementById('registerDepartamento').addEventListener('change', function() {
    const departamento = this.value;
    const ciudadSelect = document.getElementById('registerCiudad');
    
    ciudadSelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
    
    if (departamento && ciudadesPorDepartamento[departamento]) {
        ciudadesPorDepartamento[departamento].forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad;
            option.textContent = ciudad;
            ciudadSelect.appendChild(option);
        });
    }
});

// Evento para cargar sitios cuando se selecciona base
document.getElementById('registerBase').addEventListener('change', function() {
    const base = this.value;
    const sitiosContainer = document.getElementById('sitiosContainer');
    
    sitiosContainer.innerHTML = '';
    
    if (base && sitiosPorBase[base]) {
        sitiosPorBase[base].forEach(sitio => {
            const div = document.createElement('div');
            div.className = 'checkbox-group';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `sitio_${sitio}`;
            input.name = 'sitios';
            input.value = sitio;
            
            const label = document.createElement('label');
            label.htmlFor = `sitio_${sitio}`;
            label.textContent = sitio;
            
            div.appendChild(input);
            div.appendChild(label);
            sitiosContainer.appendChild(div);
        });
    } else {
        sitiosContainer.innerHTML = '<p>Primero seleccione una base/operación</p>';
    }
});

// Modificación de la función de registro para incluir los nuevos campos
btnRegister.addEventListener('click', function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    const departamento = document.getElementById('registerDepartamento').value;
    const ciudad = document.getElementById('registerCiudad').value;
    const base = document.getElementById('registerBase').value;
    
    // Obtener sitios seleccionados
    const sitiosSeleccionados = [];
    document.querySelectorAll('input[name="sitios"]:checked').forEach(checkbox => {
        sitiosSeleccionados.push(checkbox.value);
    });
    
    // Validaciones
    if (!username || !password || !role || !departamento || !ciudad || !base || sitiosSeleccionados.length === 0) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
    }
    
    if (username.length < 4 || password.length < 4) {
        showNotification('Usuario y contraseña deben tener al menos 4 caracteres', 'error');
        return;
    }
    
    // Simulación de registro con los nuevos datos
    const registro = {
        username,
        password,
        role,
        departamento,
        ciudad,
        base,
        sitios: sitiosSeleccionados
    };
    
    console.log('Registro completo:', registro);
    showNotification('Registro exitoso. Ahora puede iniciar sesión', 'success');
    
    setTimeout(() => {
        loginTab.click();
        document.getElementById('username').value = username;
        document.getElementById('password').value = password;
        document.getElementById('role').value = role;
    }, 1500);
});
    
    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type);
        
        setTimeout(() => {
            notification.classList.remove(type);
            notification.textContent = '';
        }, 5000);
    }
    
    // Carrusel
    const carousel = document.getElementById('mainCarousel');
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    const itemCount = carouselItems.length;
    
    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % itemCount;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + itemCount) % itemCount;
        updateCarousel();
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Navegación por indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Autoavance del carrusel
    let carouselInterval = setInterval(nextSlide, 5000);
    
    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 5000);
    });
    
    // Cargar proyectos dinámicamente
    const proyectosContainer = document.getElementById('proyectosContainer');
    
    const proyectos = [
        {
            titulo: 'PTAR San José del Guaviare',
            descripcion: 'Operación y mantenimiento de la planta de tratamiento de aguas residuales del municipio.',
            imagen: '../InformesPrototipo/img/IMG_20250425_111403.jpg',
            fecha: 'Enero 2024 - Actualidad'
        },
        {
            titulo: 'PTAP El Retorno',
            descripcion: 'Implementación de sistema de potabilización para comunidad rural en El Retorno.',
            imagen: '../InformesPrototipo/img/IMG_20250502_220217.jpg',
            fecha: 'Septiembre 2023 - Diciembre 2023'
        },
        {
            titulo: 'Mantenimiento Preventivo PTAR',
            descripcion: 'Programa de mantenimiento preventivo para equipos mecánicos en plantas de tratamiento.',
            imagen: '../InformesPrototipo/img/IMG_20250502_174838.jpg',
            fecha: 'Marzo 2023 - Junio 2023'
        }
    ];
    
    function cargarProyectos() {
        proyectosContainer.innerHTML = '';
        
        proyectos.forEach(proyecto => {
            const proyectoHTML = `
                <div class="proyecto-card">
                    <img src="${proyecto.imagen}" alt="${proyecto.titulo}" class="proyecto-img">
                    <div class="proyecto-info">
                        <h3>${proyecto.titulo}</h3>
                        <p>${proyecto.descripcion}</p>
                        <div class="proyecto-meta">
                            <span>${proyecto.fecha}</span>
                        </div>
                    </div>
                </div>
            `;
            
            proyectosContainer.insertAdjacentHTML('beforeend', proyectoHTML);
        });
    }
    
    cargarProyectos();
    
    // Efecto de scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mostrar año actual en el footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});