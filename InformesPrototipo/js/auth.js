document.addEventListener('DOMContentLoaded', function() {
    // Datos de usuarios de prueba (en un sistema real esto vendría de una base de datos)
    const users = {
        'operador1': { password: 'op123', role: 'operador' },
        'operador2': { password: 'op456', role: 'operador' },
        'coordinador1': { password: 'coord123', role: 'coordinador' },
        'coordinador2': { password: 'coord456', role: 'coordinador' },
        'cristian': { password: 'fabian123', role: 'operador' }
    };

    const loginForm = document.getElementById('loginForm');
    
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
            
            // Redirigir según el rol
            if (role === 'operador') {
                window.location.href = '../operador.html';
            } else if (role === 'coordinador') {
                window.location.href = '../coordinador.html';
            }
        } else {
            alert('Usuario, contraseña o rol incorrectos');
        }
    });
});