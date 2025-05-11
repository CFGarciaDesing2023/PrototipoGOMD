document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'coordinador') {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre de usuario
    document.getElementById('currentUser').textContent = `Usuario: ${currentUser.username}`;
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    });
    
    // Variables para paginación
    let currentPage = 1;
    const itemsPerPage = 6;
    let filteredInformes = [];
    
    // Elementos del modal
    const modal = document.getElementById('informeModal');
    const closeModal = document.querySelector('.close-modal');
    let currentInformeId = null;
    
    // Modal de confirmación
    const confirmModal = document.getElementById('confirmModal');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmAction = document.getElementById('confirmAction');
    let currentAction = null;
    
    // Inicializar
    loadInformes();
    setupEventListeners();
    
    // Función para configurar event listeners
    function setupEventListeners() {
        // Filtros
        document.getElementById('applyFilters').addEventListener('click', applyFilters);
        document.getElementById('resetFilters').addEventListener('click', resetFilters);
        document.getElementById('searchBtn').addEventListener('click', applyFilters);
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') applyFilters();
        });
        
        // Paginación
        document.getElementById('prevPage').addEventListener('click', goToPrevPage);
        document.getElementById('nextPage').addEventListener('click', goToNextPage);
        
        // Modal
        closeModal.addEventListener('click', closeModalWindow);
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModalWindow();
            }
            if (event.target === confirmModal) {
                closeConfirmModal();
            }
        });
        
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', switchTab);
        });
        
        // Botones del modal
        document.getElementById('markReviewed').addEventListener('click', markAsReviewed);
        document.getElementById('downloadInforme').addEventListener('click', downloadInforme);
        document.getElementById('deleteInforme').addEventListener('click', () => {
            showConfirmModal(
                'Eliminar Informe',
                '¿Estás seguro que deseas eliminar este informe? Esta acción no se puede deshacer.',
                deleteCurrentInforme
            );
        });
        
        // Eliminar todos los informes
        document.getElementById('deleteAllBtn').addEventListener('click', () => {
            showConfirmModal(
                'Eliminar Todos los Informes',
                '¿Estás seguro que deseas eliminar TODOS los informes? Esta acción es irreversible.',
                deleteAllInformes
            );
        });
        
        // Modal de confirmación
        confirmCancel.addEventListener('click', closeConfirmModal);
        confirmAction.addEventListener('click', () => {
            if (currentAction) {
                currentAction();
                closeConfirmModal();
            }
        });
    }
    
    // Función para cargar informes
    function loadInformes() {
        let informes = JSON.parse(localStorage.getItem('informes')) || [];
        
        // Inicializar estado si no existe
        informes = informes.map(informe => {
            if (!informe.estado) {
                return { ...informe, estado: 'pendiente' };
            }
            return informe;
        });
        
        localStorage.setItem('informes', JSON.stringify(informes));
        
        // Actualizar estadísticas
        updateStats(informes);
        
        // Aplicar filtros
        applyFilters();
    }
    
    // Función para aplicar filtros
    function applyFilters() {
        const sitioFilter = document.getElementById('filterSitio').value;
        const tipoFilter = document.getElementById('filterTipo').value;
        const fechaFilter = document.getElementById('filterFecha').value;
        const estadoFilter = document.getElementById('filterEstado').value;
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        
        let informes = JSON.parse(localStorage.getItem('informes')) || [];
        
        // Aplicar filtros
        filteredInformes = informes.filter(informe => {
            // Filtro por sitio
            if (sitioFilter && informe.sitio !== sitioFilter) return false;
            
            // Filtro por tipo
            if (tipoFilter && informe.tipoSitio !== tipoFilter) return false;
            
            // Filtro por fecha
            if (fechaFilter && informe.fecha !== fechaFilter) return false;
            
            // Filtro por estado
            if (estadoFilter && informe.estado !== estadoFilter) return false;
            
            // Búsqueda
            if (searchQuery) {
                const matchesOperador = informe.operador.toLowerCase().includes(searchQuery);
                const matchesSitio = informe.sitio.toLowerCase().includes(searchQuery);
                return matchesOperador || matchesSitio;
            }
            
            return true;
        });
        
        // Resetear a primera página
        currentPage = 1;
        
        // Mostrar informes
        displayInformes();
    }
    
    // Función para resetear filtros
    function resetFilters() {
        document.getElementById('filterSitio').value = '';
        document.getElementById('filterTipo').value = '';
        document.getElementById('filterFecha').value = '';
        document.getElementById('filterEstado').value = '';
        document.getElementById('searchInput').value = '';
        
        applyFilters();
    }
    
    // Función para mostrar informes con paginación
    function displayInformes() {
        const container = document.getElementById('informesList');
        container.innerHTML = '';
        
        if (filteredInformes.length === 0) {
            container.innerHTML = '<div class="no-results"><p>No se encontraron informes con los filtros seleccionados</p></div>';
            updatePaginationControls();
            return;
        }
        
        // Calcular índices para paginación
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredInformes.length);
        const paginatedInformes = filteredInformes.slice(startIndex, endIndex);
        
        // Mostrar informes paginados
        paginatedInformes.forEach(informe => {
            const card = document.createElement('div');
            card.className = 'informe-card';
            card.dataset.id = informe.id;
            
            // Estado
            const estadoBadge = document.createElement('span');
            estadoBadge.className = `status-badge ${informe.estado}`;
            estadoBadge.textContent = informe.estado === 'revisado' ? 'Revisado' : 'Pendiente';
            
            // Título
            const title = document.createElement('h3');
            title.textContent = `Informe #${informe.id}`;
            title.appendChild(estadoBadge);
            
            // Metadatos
            const meta = document.createElement('div');
            meta.className = 'informe-meta';
            meta.innerHTML = `
                <p><strong>Sitio:</strong> ${informe.sitio}</p>
                <p><strong>Tipo:</strong> ${informe.tipoSitio}</p>
                <p><strong>Operador:</strong> ${informe.operador}</p>
            `;
            
            // Archivos
            const filesInfo = document.createElement('div');
            filesInfo.className = 'informe-files';
            filesInfo.innerHTML = `
                <div class="file-count">
                    <i class="fas fa-camera"></i> ${informe.fotos.length}
                </div>
                <div class="file-count">
                    <i class="fas fa-video"></i> ${informe.videos.length}
                </div>
                <div class="file-count">
                    <i class="fas fa-file-alt"></i> ${informe.documentos.length}
                </div>
            `;
            
            // Fecha
            const dateInfo = document.createElement('div');
            dateInfo.className = 'informe-date';
            dateInfo.innerHTML = `
                <p><i class="far fa-calendar-alt"></i> ${informe.fecha}</p>
                <p><i class="far fa-clock"></i> ${new Date(informe.timestamp).toLocaleString()}</p>
            `;
            
            // Botones de acción
            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.title = 'Eliminar informe';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmModal(
                    'Eliminar Informe',
                    `¿Estás seguro que deseas eliminar el informe #${informe.id}? Esta acción no se puede deshacer.`,
                    () => deleteInforme(informe.id)
                );
            });
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'action-btn view';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.title = 'Ver detalles';
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openInformeModal(informe.id);
            });
            
            actionButtons.appendChild(viewBtn);
            actionButtons.appendChild(deleteBtn);
            
            // Contenedor de acciones
            const actions = document.createElement('div');
            actions.className = 'informe-actions';
            actions.appendChild(dateInfo);
            actions.appendChild(actionButtons);
            
            // Construir tarjeta
            card.appendChild(title);
            card.appendChild(meta);
            card.appendChild(filesInfo);
            card.appendChild(actions);
            
            // Click en la tarjeta para abrir modal
            card.addEventListener('click', () => {
                openInformeModal(informe.id);
            });
            
            container.appendChild(card);
        });
        
        // Actualizar controles de paginación
        updatePaginationControls();
    }
    
    // Función para actualizar controles de paginación
    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredInformes.length / itemsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Función para ir a página anterior
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayInformes();
        }
    }
    
    // Función para ir a página siguiente
    function goToNextPage() {
        const totalPages = Math.ceil(filteredInformes.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayInformes();
        }
    }
    
    // Función para actualizar estadísticas
    function updateStats(informes) {
        const total = informes.length;
        const revisados = informes.filter(i => i.estado === 'revisado').length;
        const pendientes = total - revisados;
        
        document.getElementById('totalInformes').textContent = total;
        document.getElementById('informesRevisados').textContent = revisados;
        document.getElementById('informesPendientes').textContent = pendientes;
    }
    
    // Función para abrir modal con detalles del informe
    function openInformeModal(informeId) {
        const informe = filteredInformes.find(i => i.id === informeId);
        if (!informe) return;
        
        currentInformeId = informeId;
        
        // Actualizar información del modal
        document.getElementById('modalTitle').textContent = `Informe #${informe.id}`;
        document.getElementById('modalOperador').textContent = informe.operador;
        document.getElementById('modalSitio').textContent = informe.sitio;
        document.getElementById('modalTipo').textContent = informe.tipoSitio;
        document.getElementById('modalFecha').textContent = informe.fecha;
        document.getElementById('modalEnviado').textContent = new Date(informe.timestamp).toLocaleString();
        document.getElementById('modalEstado').textContent = informe.estado === 'revisado' ? 'Revisado' : 'Pendiente';
        
        // Actualizar contadores de tabs
        document.getElementById('fotosCount').textContent = informe.fotos.length;
        document.getElementById('videosCount').textContent = informe.videos.length;
        document.getElementById('docsCount').textContent = informe.documentos.length;
        
        // Configurar botón de revisado
        const markBtn = document.getElementById('markReviewed');
        if (informe.estado === 'revisado') {
            markBtn.innerHTML = '<i class="fas fa-check-double"></i> Revisado';
            markBtn.style.backgroundColor = '#27ae60';
        } else {
            markBtn.innerHTML = '<i class="fas fa-check"></i> Marcar como Revisado';
            markBtn.style.backgroundColor = '#f39c12';
        }
        
        // Cargar archivos
        loadFilesForModal(informe);
        
        // Mostrar modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Función para cargar archivos en el modal
    function loadFilesForModal(informe) {
        // Limpiar contenedores
        document.getElementById('fotosGallery').innerHTML = '';
        document.getElementById('videosGallery').innerHTML = '';
        document.getElementById('documentosList').innerHTML = '';
        
        // Fotos
        if (informe.fotos.length > 0) {
            informe.fotos.forEach((foto, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = URL.createObjectURL(new Blob([''], { type: 'image/png' }));
                img.alt = `Foto ${index + 1}`;
                img.title = foto.name;
                
                const fileName = document.createElement('div');
                fileName.className = 'file-name';
                fileName.textContent = foto.name;
                
                item.appendChild(img);
                item.appendChild(fileName);
                document.getElementById('fotosGallery').appendChild(item);
            });
        } else {
            document.getElementById('fotosGallery').innerHTML = '<p class="no-files">No hay fotos en este informe</p>';
        }
        
        // Videos
        if (informe.videos.length > 0) {
            informe.videos.forEach((video, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                
                const vid = document.createElement('video');
                vid.src = URL.createObjectURL(new Blob([''], { type: 'video/mp4' }));
                vid.controls = true;
                vid.title = video.name;
                
                const fileName = document.createElement('div');
                fileName.className = 'file-name';
                fileName.textContent = video.name;
                
                item.appendChild(vid);
                item.appendChild(fileName);
                document.getElementById('videosGallery').appendChild(item);
            });
        } else {
            document.getElementById('videosGallery').innerHTML = '<p class="no-files">No hay videos en este informe</p>';
        }
        
        // Documentos
        if (informe.documentos.length > 0) {
            informe.documentos.forEach((doc, index) => {
                const item = document.createElement('div');
                item.className = 'document-item';
                
                const icon = document.createElement('i');
                icon.className = 'fas fa-file-pdf';
                
                const info = document.createElement('div');
                info.className = 'document-info';
                info.innerHTML = `
                    <div class="file-name">${doc.name}</div>
                    <div class="file-type">${doc.name.split('.').pop().toUpperCase()} - ${formatFileSize(doc.size)}</div>
                `;
                
                const download = document.createElement('button');
                download.className = 'download-file';
                download.innerHTML = '<i class="fas fa-download"></i>';
                download.addEventListener('click', () => {
                    downloadFile(doc.name, 'documento');
                });
                
                item.appendChild(icon);
                item.appendChild(info);
                item.appendChild(download);
                document.getElementById('documentosList').appendChild(item);
            });
        } else {
            document.getElementById('documentosList').innerHTML = '<p class="no-files">No hay documentos en este informe</p>';
        }
    }
    
    // Función para cerrar el modal
    function closeModalWindow() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Función para cambiar entre tabs
    function switchTab(e) {
        const tabId = e.target.dataset.tab;
        
        // Desactivar todos los tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activar tab seleccionado
        e.target.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }
    
    // Función para marcar informe como revisado
    function markAsReviewed() {
        let informes = JSON.parse(localStorage.getItem('informes')) || [];
        const informeIndex = informes.findIndex(i => i.id === currentInformeId);
        
        if (informeIndex !== -1) {
            const newStatus = informes[informeIndex].estado === 'revisado' ? 'pendiente' : 'revisado';
            informes[informeIndex].estado = newStatus;
            localStorage.setItem('informes', JSON.stringify(informes));
            
            // Actualizar vista
            updateStats(informes);
            applyFilters();
            openInformeModal(currentInformeId); // Recargar modal
        }
    }
    
    // Función para descargar archivos (simulada)
    function downloadFile(filename, type) {
        // En un sistema real, esto descargaría el archivo del servidor
        alert(`En un sistema real, se descargaría el ${type}: ${filename}`);
    }
    
    // Función para descargar todo el informe
    function downloadInforme() {
        const informe = filteredInformes.find(i => i.id === currentInformeId);
        if (!informe) return;
        
        // Crear un objeto con los datos del informe
        const informeData = {
            ...informe,
            // En un sistema real, aquí incluiríamos las URLs para descargar los archivos
            mensaje: 'En un sistema real, aquí se incluirían los enlaces para descargar los archivos del servidor'
        };
        
        // Crear un blob con los datos
        const blob = new Blob([JSON.stringify(informeData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Crear enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = `informe-${informe.id}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        alert(`Se ha descargado la información del informe #${informe.id}. En un sistema real, se descargarían los archivos asociados.`);
    }
    
    // Función para mostrar modal de confirmación
    function showConfirmModal(title, message, action) {
        document.getElementById('confirmModalTitle').textContent = title;
        document.getElementById('confirmModalMessage').textContent = message;
        currentAction = action;
        confirmModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Función para cerrar modal de confirmación
    function closeConfirmModal() {
        confirmModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentAction = null;
    }
    
    // Función para eliminar el informe actual
    function deleteCurrentInforme() {
        deleteInforme(currentInformeId);
        closeModalWindow();
    }
    
    // Función para eliminar un informe específico
    function deleteInforme(informeId) {
        let informes = JSON.parse(localStorage.getItem('informes')) || [];
        informes = informes.filter(i => i.id !== informeId);
        localStorage.setItem('informes', JSON.stringify(informes));
        
        // Actualizar vista
        updateStats(informes);
        applyFilters();
        
        // Mostrar feedback
        alert(`Informe #${informeId} eliminado correctamente`);
    }
    
    // Función para eliminar todos los informes
    function deleteAllInformes() {
        localStorage.setItem('informes', JSON.stringify([]));
        
        // Actualizar vista
        updateStats([]);
        applyFilters();
        
        // Mostrar feedback
        alert('Todos los informes han sido eliminados');
    }
    
    // Función auxiliar para formatear tamaño de archivo
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});