document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'operador') {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre de usuario
    document.getElementById('currentUser').textContent = `Usuario: ${currentUser.username}`;
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Variables globales
    let informes = [];
    let filteredInformes = [];
    let currentModalInforme = null;
    
    // Elementos del DOM
    const informesGrid = document.getElementById('informesGrid');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const detailsModal = document.getElementById('detailsModal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Inicializar la página
    loadInformes();
    setupEventListeners();
    
    // Cargar informes del localStorage
    function loadInformes() {
        const allInformes = JSON.parse(localStorage.getItem('informes')) || [];
        // Filtrar solo los informes del usuario actual
        informes = allInformes.filter(informe => informe.operador === currentUser.username);
        filteredInformes = [...informes];
        renderInformes();
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Filtros
        searchInput.addEventListener('input', applyFilters);
        statusFilter.addEventListener('change', applyFilters);
        dateFilter.addEventListener('change', applyFilters);
        resetFiltersBtn.addEventListener('click', resetFilters);
        
        // Modal
        closeModalBtn.addEventListener('click', () => detailsModal.style.display = 'none');
        document.getElementById('closeModalBtn').addEventListener('click', () => detailsModal.style.display = 'none');
        
        // Cerrar modal al hacer clic fuera del contenido
        window.addEventListener('click', (event) => {
            if (event.target === detailsModal) {
                detailsModal.style.display = 'none';
            }
        });
        
        // Tabs del modal
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                openTab(tabId, this);
            });
        });
    }
    
    // Renderizar informes en el grid
    function renderInformes() {
        if (filteredInformes.length === 0) {
            informesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No se encontraron informes con los filtros aplicados</p>
                    <button id="resetFiltersBtn" class="btn primary">
                        <i class="fas fa-undo"></i> Reiniciar filtros
                    </button>
                </div>
            `;
            document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
            return;
        }
        
        informesGrid.innerHTML = '';
        
        // Ordenar informes por fecha (más recientes primero)
        filteredInformes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        filteredInformes.forEach(informe => {
            const informeCard = document.createElement('div');
            informeCard.className = 'informe-card';
            informeCard.innerHTML = `
                <h3>${informe.sitio}</h3>
                <div class="informe-meta">
                    <p>Tipo: ${informe.tipoSitio}</p>
                    <p>Fecha: ${formatDate(informe.fecha)}</p>
                </div>
                <div class="informe-files">
                    <div class="file-count">
                        <i class="fas fa-camera"></i>
                        <span>${informe.fotos.length}</span>
                    </div>
                    <div class="file-count">
                        <i class="fas fa-video"></i>
                        <span>${informe.videos.length}</span>
                    </div>
                    <div class="file-count">
                        <i class="fas fa-file"></i>
                        <span>${informe.documentos.length}</span>
                    </div>
                </div>
                <div class="informe-footer">
                    <span class="status-badge ${informe.estado}">${informe.estado === 'pendiente' ? 'Pendiente' : 'Revisado'}</span>
                    <button class="view-btn" data-id="${informe.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </div>
            `;
            
            informesGrid.appendChild(informeCard);
        });
        
        // Agregar event listeners a los botones de ver
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const informeId = parseInt(this.getAttribute('data-id'));
                openInformeDetails(informeId);
            });
        });
    }
    
    // Abrir modal con detalles del informe
    function openInformeDetails(informeId) {
        const informe = informes.find(i => i.id === informeId);
        if (!informe) return;
        
        currentModalInforme = informe;
        
        // Actualizar información básica
        document.getElementById('modalTitle').textContent = `Informe: ${informe.sitio}`;
        document.getElementById('modalSitio').textContent = informe.sitio;
        document.getElementById('modalTipo').textContent = informe.tipoSitio;
        document.getElementById('modalFecha').textContent = formatDate(informe.fecha);
        document.getElementById('modalEnvio').textContent = formatDateTime(informe.timestamp);
        
        // Actualizar estado
        const statusBadge = document.getElementById('modalStatus');
        statusBadge.textContent = informe.estado === 'pendiente' ? 'Pendiente' : 'Revisado';
        statusBadge.className = `status-badge ${informe.estado}`;
        
        // Cargar archivos
        renderFilesInModal('fotosGallery', informe.fotos, 'image');
        renderFilesInModal('videosGallery', informe.videos, 'video');
        renderDocumentsInModal('documentosList', informe.documentos);
        
        // Mostrar modal
        detailsModal.style.display = 'block';
        // Activar primera pestaña
        openTab('fotos-tab', document.querySelector('.tab-btn'));
    }
    
    // Renderizar archivos en el modal
    function renderFilesInModal(containerId, files, type) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        if (files.length === 0) {
            container.innerHTML = '<p class="no-files">No hay archivos de este tipo</p>';
            return;
        }
        
        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'gallery-item';
            
            if (type === 'image') {
                fileItem.innerHTML = `
                    <div class="img-container">
                        <img src="#" alt="${file.name}" data-id="${currentModalInforme.id}" data-index="${index}" data-type="foto">
                    </div>
                    <div class="file-info">
                        <div class="file-name">${truncateFileName(file.name, 20)}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                `;
            } else {
                fileItem.innerHTML = `
                    <div class="video-container">
                        <video controls data-id="${currentModalInforme.id}" data-index="${index}" data-type="video">
                            Tu navegador no soporta la reproducción de videos.
                        </video>
                    </div>
                    <div class="file-info">
                        <div class="file-name">${truncateFileName(file.name, 20)}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                `;
            }
            
            container.appendChild(fileItem);
        });
    }
    
    // Renderizar documentos en el modal
    function renderDocumentsInModal(containerId, documents) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        if (documents.length === 0) {
            container.innerHTML = '<p class="no-files">No hay documentos</p>';
            return;
        }
        
        documents.forEach((doc, index) => {
            const docItem = document.createElement('div');
            docItem.className = 'document-item';
            docItem.innerHTML = `
                <div class="document-icon">
                    ${getFileIcon(doc.name)}
                </div>
                <div class="document-info">
                    <div class="file-name">${doc.name}</div>
                    <div class="file-size">${formatFileSize(doc.size)}</div>
                </div>
                <button class="download-file" data-id="${currentModalInforme.id}" data-index="${index}" data-type="documento" title="Descargar">
                    <i class="fas fa-download"></i>
                </button>
            `;
            
            container.appendChild(docItem);
        });
    }
    
    // Aplicar filtros
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const dateRange = dateFilter.value;
        
        filteredInformes = informes.filter(informe => {
            // Filtrar por búsqueda
            const matchesSearch = 
                informe.sitio.toLowerCase().includes(searchTerm) || 
                informe.fecha.includes(searchTerm) ||
                informe.tipoSitio.toLowerCase().includes(searchTerm);
            
            // Filtrar por estado
            const matchesStatus = status === 'all' || informe.estado === status;
            
            // Filtrar por fecha
            let matchesDate = true;
            if (dateRange !== 'all') {
                const informeDate = new Date(informe.timestamp);
                const today = new Date();
                
                switch(dateRange) {
                    case 'today':
                        matchesDate = isSameDay(informeDate, today);
                        break;
                    case 'week':
                        const startOfWeek = new Date(today);
                        startOfWeek.setDate(today.getDate() - today.getDay());
                        matchesDate = informeDate >= startOfWeek;
                        break;
                    case 'month':
                        matchesDate = informeDate.getMonth() === today.getMonth() && 
                                     informeDate.getFullYear() === today.getFullYear();
                        break;
                }
            }
            
            return matchesSearch && matchesStatus && matchesDate;
        });
        
        renderInformes();
    }
    
    // Reiniciar filtros
    function resetFilters() {
        searchInput.value = '';
        statusFilter.value = 'all';
        dateFilter.value = 'all';
        filteredInformes = [...informes];
        renderInformes();
    }
    
    // Cambiar pestañas en el modal
    function openTab(tabId, button) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Desactivar todos los botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostrar la pestaña seleccionada
        document.getElementById(tabId).classList.add('active');
        button.classList.add('active');
    }
    
    // Funciones auxiliares
    function formatDate(dateString) {
        if (!dateString) return 'No especificada';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
    
    function formatDateTime(dateTimeString) {
        if (!dateTimeString) return 'No especificada';
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateTimeString).toLocaleDateString('es-ES', options);
    }
    
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    function truncateFileName(name, length) {
        if (name.length <= length) return name;
        return name.substring(0, length) + '...' + name.split('.').pop();
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        switch(extension) {
            case 'pdf':
                return '<i class="fas fa-file-pdf"></i>';
            case 'doc':
            case 'docx':
                return '<i class="fas fa-file-word"></i>';
            case 'xls':
            case 'xlsx':
                return '<i class="fas fa-file-excel"></i>';
            default:
                return '<i class="fas fa-file"></i>';
        }
    }
});