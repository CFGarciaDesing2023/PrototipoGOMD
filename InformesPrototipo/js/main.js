// Sistema de Autenticación con LocalStorage
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const btnIngresar = document.getElementById('btnIngresar');
    const btnRegistrar = document.getElementById('btnRegistrar');
    const modalTitle = document.getElementById('modalTitle');
    const forgotPassword = document.getElementById('forgotPassword');
    
    // Cambiar entre pestañas de Login y Registro
    loginTab.addEventListener('click', function(e) {
        e.preventDefault();
        switchAuthTab('login');
    });
    
    registerTab.addEventListener('click', function(e) {
        e.preventDefault();
        switchAuthTab('register');
    });
    
    // Función para cambiar entre pestañas
    function switchAuthTab(tab) {
        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            btnIngresar.style.display = 'block';
            btnRegistrar.style.display = 'none';
            modalTitle.textContent = 'Iniciar Sesión';
        } else {
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            btnIngresar.style.display = 'none';
            btnRegistrar.style.display = 'block';
            modalTitle.textContent = 'Registrarse';
        }
        
        // Limpiar mensajes de error
        clearAuthMessages();
    }
    
    // Limpiar mensajes de error
    function clearAuthMessages() {
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());
    }
    
    // Mostrar mensaje de error/éxito
    function showAuthMessage(type, message, form) {
        clearAuthMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}-message`;
        messageDiv.textContent = message;
        
        form.insertBefore(messageDiv, form.firstChild);
    }
    
    // Validar email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Guardar usuario en localStorage
    function saveUser(user) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verificar si el usuario ya existe
        const userExists = users.some(u => u.email === user.email);
        if (userExists) {
            return false;
        }
        
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    
    // Autenticar usuario
    function authenticateUser(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        return user || null;
    }
    
    // Manejar registro de usuario
    btnRegistrar.addEventListener('click', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Validaciones
        if (!name || !email || !password || !confirmPassword) {
            showAuthMessage('error', 'Todos los campos son obligatorios.', registerForm);
            return;
        }
        
        if (!isValidEmail(email)) {
            showAuthMessage('error', 'Por favor ingresa un correo electrónico válido.', registerForm);
            return;
        }
        
        if (password.length < 6) {
            showAuthMessage('error', 'La contraseña debe tener al menos 6 caracteres.', registerForm);
            return;
        }
        
        if (password !== confirmPassword) {
            showAuthMessage('error', 'Las contraseñas no coinciden.', registerForm);
            return;
        }
        
        // Crear usuario
        const user = {
            name,
            email,
            password, // Nota: En una aplicación real, NUNCA guardes contraseñas en texto plano
            createdAt: new Date().toISOString()
        };
        
        // Guardar usuario
        if (saveUser(user)) {
            showAuthMessage('success', '¡Registro exitoso! Ahora puedes iniciar sesión.', registerForm);
            
            // Limpiar formulario
            registerForm.reset();
            
            // Cambiar a pestaña de login
            setTimeout(() => switchAuthTab('login'), 1500);
        } else {
            showAuthMessage('error', 'Este correo electrónico ya está registrado.', registerForm);
        }
    });
    
    // Manejar inicio de sesión
    btnIngresar.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Validaciones
        if (!email || !password) {
            showAuthMessage('error', 'Todos los campos son obligatorios.', loginForm);
            return;
        }
        
        if (!isValidEmail(email)) {
            showAuthMessage('error', 'Por favor ingresa un correo electrónico válido.', loginForm);
            return;
        }
        
        // Autenticar usuario
        const user = authenticateUser(email, password);
        
        if (user) {
            // Guardar sesión (en un caso real usaríamos tokens JWT)
            sessionStorage.setItem('currentUser', JSON.stringify({
                name: user.name,
                email: user.email,
                loggedIn: true,
                lastLogin: new Date().toISOString()
            }));
            
            showAuthMessage('success', `¡Bienvenido, ${user.name}!`, loginForm);
            
            // Cerrar modal después de 1.5 segundos
            setTimeout(() => {
                modalAcceso.classList.remove('show');
                document.body.style.overflow = 'auto';
                
                // Actualizar UI para usuario logueado
                updateUIAfterLogin(user.name);
            }, 1500);
        } else {
            showAuthMessage('error', 'Correo electrónico o contraseña incorrectos.', loginForm);
        }
    });
    
    // Olvidé mi contraseña (simulado)
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        showAuthMessage('error', 'Por favor contacta al administrador para restablecer tu contraseña.', loginForm);
    });
    
    // Actualizar UI después del login
    function updateUIAfterLogin(userName) {
        const btnAcceso = document.getElementById('btnAcceso');
        
        // Cambiar el botón de Acceder por el nombre del usuario
        btnAcceso.textContent = userName;
        btnAcceso.classList.add('user-logged-in');
        btnAcceso.href = '#';
        btnAcceso.style.pointerEvents = 'none';
        
        // Aquí podrías añadir un menú desplegable con opciones de usuario
    }
    
    // Verificar si hay una sesión activa al cargar la página
    function checkLoggedInUser() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (currentUser && currentUser.loggedIn) {
            updateUIAfterLogin(currentUser.name);
        }
    }
    
    // Inicializar verificación de sesión
    checkLoggedInUser();
});