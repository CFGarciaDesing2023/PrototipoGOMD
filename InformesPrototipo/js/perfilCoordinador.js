document.addEventListener('DOMContentLoaded', function() {
    // Aplicar tema guardado
    applySavedTheme();
    
    // Inicializar componentes
    initDropdowns();
    initSubmenus();
    initTabs();
    initForms();
    initAvatarUpload();
    initPasswordModal();
    initPasswordStrength();
    initNotificationSwitches();
    
    // Configurar eventos
    setupThemeToggle();
  });
  
  // Funciones compartidas
  function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    document.body.classList.toggle('light-mode', savedTheme === 'light');
    
    updateThemeIcon();
  }
  
  function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('light-mode');
      
      const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', currentTheme);
      
      updateThemeIcon();
    });
  }
  
  function updateThemeIcon() {
    const themeToggle = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
      themeToggle.classList.replace('fa-moon', 'fa-sun');
    } else {
      themeToggle.classList.replace('fa-sun', 'fa-moon');
    }
  }
  
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.user-dropdown');
    
    dropdowns.forEach(dropdown => {
      const button = dropdown.querySelector('.user-profile');
      
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        dropdown.querySelector('.dropdown-menu').classList.toggle('show', !isExpanded);
      });
    });
    
    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener('click', function() {
      dropdowns.forEach(dropdown => {
        dropdown.querySelector('.user-profile').setAttribute('aria-expanded', 'false');
        dropdown.querySelector('.dropdown-menu').classList.remove('show');
      });
    });
  }
  
  function initSubmenus() {
    const submenuButtons = document.querySelectorAll('.has-submenu > a');
    
    submenuButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
      });
    });
  }
  
  // Funciones específicas del perfil
  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Desactivar todas las pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Desactivar todos los contenidos
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Activar la pestaña seleccionada
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  function initForms() {
    const editButtons = document.querySelectorAll('.btn-edit-form');
    
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        const form = this.closest('form');
        const inputs = form.querySelectorAll('.form-control:not([type="submit"])');
        const saveBtn = form.querySelector('.btn-save-form');
        
        inputs.forEach(input => {
          input.disabled = !input.disabled;
        });
        
        saveBtn.disabled = !saveBtn.disabled;
        
        // Cambiar ícono y texto del botón
        if (this.querySelector('.fa-edit')) {
          this.innerHTML = '<i class="fas fa-times"></i> Cancelar';
        } else {
          this.innerHTML = '<i class="fas fa-edit"></i> Editar';
        }
      });
    });
    
    // Manejar envío de formularios
    document.querySelectorAll('.profile-form').forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular guardado de datos
        const saveBtn = this.querySelector('.btn-save-form');
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        
        setTimeout(() => {
          saveBtn.innerHTML = '<i class="fas fa-check"></i> Guardado';
          saveBtn.disabled = true;
          
          // Deshabilitar inputs
          const inputs = this.querySelectorAll('.form-control:not([type="submit"])');
          inputs.forEach(input => {
            input.disabled = true;
          });
          
          // Restaurar botón de editar
          const editBtn = this.querySelector('.btn-edit-form');
          editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar';
          
          // Mostrar notificación
          showNotification('Los cambios se han guardado correctamente', 'success');
          
          // Restaurar botón de guardar después de 2 segundos
          setTimeout(() => {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
          }, 2000);
        }, 1500);
      });
    });
  }
  
  function initAvatarUpload() {
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const removeAvatarBtn = document.getElementById('removeAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('avatarPreview');
    
    changeAvatarBtn.addEventListener('click', function() {
      avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
          avatarPreview.src = event.target.result;
          showNotification('Avatar actualizado correctamente', 'success');
        };
        
        reader.readAsDataURL(file);
      }
    });
    
    removeAvatarBtn.addEventListener('click', function() {
      avatarPreview.src = 'assets/img/default_avatar.jpg';
      avatarUpload.value = '';
      showNotification('Avatar eliminado', 'info');
    });
  }
  
  function initPasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    changePasswordBtn.addEventListener('click', function() {
      passwordModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        passwordModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Cerrar al hacer clic fuera
    passwordModal.querySelector('.modal-overlay').addEventListener('click', function() {
      passwordModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && passwordModal.classList.contains('active')) {
        passwordModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Toggle para mostrar/ocultar contraseña
    document.querySelectorAll('.btn-password-toggle').forEach(button => {
      button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
      });
    });
    
    // Validar formulario de contraseña
    const passwordForm = document.getElementById('changePasswordForm');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordMatch = document.querySelector('.password-match');
    
    passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simular cambio de contraseña
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
      
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Contraseña actualizada';
        showNotification('Tu contraseña ha sido actualizada correctamente', 'success');
        
        // Cerrar modal después de 1.5 segundos
        setTimeout(() => {
          passwordModal.classList.remove('active');
          document.body.style.overflow = '';
          submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Contraseña';
          passwordForm.reset();
        }, 1500);
      }, 1500);
    });
    
    // Validar coincidencia de contraseñas
    confirmPassword.addEventListener('input', function() {
      if (this.value && this.value === newPassword.value) {
        passwordMatch.classList.add('visible');
      } else {
        passwordMatch.classList.remove('visible');
      }
    });
  }
  
  function initPasswordStrength() {
    const newPassword = document.getElementById('newPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    const requirements = {
      length: document.querySelector('.req-length'),
      uppercase: document.querySelector('.req-uppercase'),
      number: document.querySelector('.req-number'),
      special: document.querySelector('.req-special')
    };
    
    newPassword.addEventListener('input', function() {
      const password = this.value;
      let strength = 0;
      
      // Validar requisitos
      const hasLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      // Actualizar íconos de requisitos
      requirements.length.classList.toggle('valid', hasLength);
      requirements.uppercase.classList.toggle('valid', hasUppercase);
      requirements.number.classList.toggle('valid', hasNumber);
      requirements.special.classList.toggle('valid', hasSpecial);
      
      // Calcular fortaleza
      if (hasLength) strength += 25;
      if (hasUppercase) strength += 25;
      if (hasNumber) strength += 25;
      if (hasSpecial) strength += 25;
      
      // Actualizar barra de fortaleza
      strengthBar.style.width = `${strength}%`;
      
      // Actualizar texto y color
      if (strength < 50) {
        strengthBar.style.backgroundColor = 'var(--danger-color)';
        strengthText.textContent = 'Débil';
      } else if (strength < 75) {
        strengthBar.style.backgroundColor = 'var(--warning-color)';
        strengthText.textContent = 'Media';
      } else {
        strengthBar.style.backgroundColor = 'var(--secondary-color)';
        strengthText.textContent = 'Fuerte';
      }
    });
  }
  
  function initNotificationSwitches() {
    // Guardar estado de las notificaciones
    document.getElementById('notificationsForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
      
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Configuración guardada';
        showNotification('Tus preferencias de notificación han sido guardadas', 'success');
        
        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Configuración';
        }, 2000);
      }, 1000);
    });
  }
  
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Objeto global para funciones accesibles
  window.app = {
    showProfileTab: function(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
          btn.classList.add('active');
        }
      });
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
        }
      });
    }
  };