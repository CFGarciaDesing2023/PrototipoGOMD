document.addEventListener('DOMContentLoaded', function() {
    // Datos de usuarios de prueba (en un sistema real esto vendría de una base de datos)
    const users = {
        'operador1': { password: 'op123', role: 'operador' },
        'operador2': { password: 'op456', role: 'operador' },
        'coordinador1': { password: 'coord123', role: 'coordinador' },
        'coordinador2': { password: 'coord456', role: 'coordinador' },
        'cristian': { password: 'fabian123', role: 'operador' }
    };

    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');
    const btnCancelar = document.getElementById('btnCancelar');
    const modalAcceso = document.getElementById('modalAcceso');
    const modalCerrar = document.getElementById('modalCerrar');
    const btnAcceso = document.getElementById('btnAcceso');
    const forgotPassword = document.getElementById('forgotPassword');
    const notification = document.getElementById('notification');

    // Manejo del formulario de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // Verificar credenciales
        if (users[username] && users[username].password === password && users[username].role === role) {
            // Guardar sesión en localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                username: username,
                role: role
            }));
            
            // Mostrar notificación de éxito
            showNotification('success', 'Inicio de sesión exitoso');
            
            // Redirigir según el rol después de un breve retraso
            setTimeout(() => {
                if (role === 'operador') {
                    window.location.href = '/InformesPrototipo/operador.html';
                } else if (role === 'coordinador') {
                    window.location.href = '/InformesPrototipo/coordinador.html';
                }
            }, 1000);
        } else {
            showNotification('error', 'Usuario, contraseña o rol incorrectos');
        }
    });

    // Manejo del formulario de registro (ejemplo básico)
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;
        
        // Validación básica
        if (username.length < 4 || password.length < 4 || !role) {
            showNotification('error', 'Todos los campos son requeridos (mín. 4 caracteres)');
            return;
        }
        
        // Verificar si el usuario ya existe
        if (users[username]) {
            showNotification('error', 'El usuario ya existe');
            return;
        }
        
        // Registrar nuevo usuario (en un sistema real esto iría a una API)
        users[username] = { password: password, role: role };
        showNotification('success', 'Registro exitoso. Ahora puedes iniciar sesión.');
        
        // Cambiar a la pestaña de login
        loginTab.click();
    });

    // Funcionalidad de las pestañas
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

    // Botones del modal
    btnLogin.addEventListener('click', function() {
        loginForm.dispatchEvent(new Event('submit'));
    });

    btnRegister.addEventListener('click', function() {
        registerForm.dispatchEvent(new Event('submit'));
    });

    btnCancelar.addEventListener('click', function() {
        closeModal();
    });

    // Abrir modal
    btnAcceso.addEventListener('click', function(e) {
        e.preventDefault();
        modalAcceso.style.display = 'block';
    });

    // Cerrar modal
    modalCerrar.addEventListener('click', closeModal);

    // Cerrar modal haciendo clic fuera del contenido
    window.addEventListener('click', function(e) {
        if (e.target === modalAcceso) {
            closeModal();
        }
    });

    // Función para mostrar notificaciones
    function showNotification(type, message) {
        notification.textContent = message;
        notification.className = 'notification ' + type;
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 5000);
    }

    // Función para cerrar el modal
    function closeModal() {
        modalAcceso.style.display = 'none';
        // Resetear formularios
        loginForm.reset();
        registerForm.reset();
        // Ocultar notificación
        notification.classList.add('hidden');
    }

    // Manejo de "olvidé mi contraseña"
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('info', 'Por favor contacte al administrador para restablecer su contraseña');
    });
});