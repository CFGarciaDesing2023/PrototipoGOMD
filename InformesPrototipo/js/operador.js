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
    
    // Variables para almacenar archivos seleccionados
    let fotos = [];
    let videos = [];
    let documentos = [];
    
    // Configurar eventos para subida de archivos
    document.getElementById('fotos').addEventListener('change', function(e) {
        fotos = handleFileSelect(e, 'fotosPreview', fotos, 'image');
        updateReviewSection();
    });
    
    document.getElementById('videos').addEventListener('change', function(e) {
        videos = handleFileSelect(e, 'videosPreview', videos, 'video');
        updateReviewSection();
    });
    
    document.getElementById('documentos').addEventListener('change', function(e) {
        documentos = handleFileSelect(e, 'documentosPreview', documentos, 'document');
        updateReviewSection();
    });
    
    // Manejar envío del formulario
    document.getElementById('informeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const sitio = document.getElementById('sitio').value;
        const tipoSitio = document.getElementById('tipoSitio').value;
        const fecha = document.getElementById('fecha').value;
        
        if (!sitio || !tipoSitio || !fecha) {
            alert('Por favor complete todos los campos requeridos');
            goToStep(1);
            return;
        }
        
        if (fotos.length === 0 && videos.length === 0 && documentos.length === 0) {
            alert('Por favor agregue al menos un archivo (foto, video o documento)');
            goToStep(2);
            return;
        }
        
        // Crear objeto de informe
        const informe = {
            id: Date.now(),
            operador: currentUser.username,
            sitio,
            tipoSitio,
            fecha,
            fotos: fotos.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            videos: videos.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            documentos: documentos.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            timestamp: new Date().toISOString(),
            estado: 'pendiente'
        };
        
        // Guardar informe en localStorage
        saveInforme(informe);
        
        // Mostrar modal de confirmación
        document.getElementById('confirmModal').style.display = 'block';
        document.getElementById('confirmClose').addEventListener('click', function() {
            document.getElementById('confirmModal').style.display = 'none';
            resetForm();
        }, { once: true });
    });
    
    // Función para manejar la selección de archivos
    function handleFileSelect(event, previewId, fileArray, fileType) {
        const files = event.target.files;
        const previewContainer = document.getElementById(previewId);
        previewContainer.innerHTML = '';
        
        const newFiles = Array.from(files);
        const updatedArray = [...fileArray, ...newFiles];
        
        if (updatedArray.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'empty-message';
            emptyMsg.textContent = fileType === 'image' ? 'No hay fotos seleccionadas' : 
                                  fileType === 'video' ? 'No hay videos seleccionados' : 
                                  'No hay documentos seleccionados';
            previewContainer.appendChild(emptyMsg);
            return updatedArray;
        }
        
        updatedArray.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.dataset.index = index;
            
            // Contenedor de previsualización
            const previewContent = document.createElement('div');
            previewContent.className = 'preview-content';
            
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                previewContent.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                previewContent.appendChild(video);
            } else {
                const fileIcon = document.createElement('div');
                fileIcon.className = 'file-icon';
                fileIcon.innerHTML = getFileIcon(file.name);
                previewContent.appendChild(fileIcon);
            }
            
            // Información del archivo
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            
            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = truncateFileName(file.name, 20);
            fileName.title = file.name;
            
            const fileSize = document.createElement('div');
            fileSize.className = 'file-size';
            fileSize.textContent = formatFileSize(file.size);
            
            fileInfo.appendChild(fileName);
            fileInfo.appendChild(fileSize);
            
            // Botón de eliminar
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.title = 'Eliminar archivo';
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                updatedArray.splice(index, 1);
                previewItem.remove();
                
                if (updatedArray.length === 0) {
                    const emptyMsg = document.createElement('p');
                    emptyMsg.className = 'empty-message';
                    emptyMsg.textContent = fileType === 'image' ? 'No hay fotos seleccionadas' : 
                                          fileType === 'video' ? 'No hay videos seleccionados' : 
                                          'No hay documentos seleccionados';
                    previewContainer.appendChild(emptyMsg);
                }
                
                // Actualizar el array de archivos
                if (previewId === 'fotosPreview') {
                    fotos = updatedArray;
                } else if (previewId === 'videosPreview') {
                    videos = updatedArray;
                } else {
                    documentos = updatedArray;
                }
                
                updateReviewSection();
            });
            
            previewItem.appendChild(previewContent);
            previewItem.appendChild(fileInfo);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        });
        
        return updatedArray;
    }
    
    // Función para guardar informe en localStorage
    function saveInforme(informe) {
        let informes = JSON.parse(localStorage.getItem('informes')) || [];
        informes.push(informe);
        localStorage.setItem('informes', JSON.stringify(informes));
    }
    
    // Función para actualizar la sección de revisión
    function updateReviewSection() {
        document.getElementById('reviewSitio').textContent = document.getElementById('sitio').value || 'No seleccionado';
        document.getElementById('reviewTipo').textContent = document.getElementById('tipoSitio').value || 'No seleccionado';
        document.getElementById('reviewFecha').textContent = document.getElementById('fecha').value || 'No seleccionada';
        
        updateFileReviewSection('reviewFotos', fotos, 'foto');
        updateFileReviewSection('reviewVideos', videos, 'video');
        updateFileReviewSection('reviewDocumentos', documentos, 'documento');
    }
    
    function updateFileReviewSection(sectionId, files, type) {
        const section = document.getElementById(sectionId);
        section.innerHTML = '';
        
        if (files.length === 0) {
            section.innerHTML = `<p>No hay ${type}s seleccionados</p>`;
            return;
        }
        
        const fileList = document.createElement('ul');
        fileList.className = 'file-list';
        
        files.forEach(file => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <i class="fas ${type === 'foto' ? 'fa-camera' : type === 'video' ? 'fa-video' : 'fa-file'}"></i>
                <span class="file-name">${truncateFileName(file.name, 30)}</span>
                <span class="file-size">(${formatFileSize(file.size)})</span>
            `;
            fileList.appendChild(listItem);
        });
        
        const count = document.createElement('p');
        count.className = 'file-count';
        count.textContent = `${files.length} ${type}${files.length !== 1 ? 's' : ''}`;
        
        section.appendChild(count);
        section.appendChild(fileList);
    }
    
    // Función para resetear el formulario
    function resetForm() {
        document.getElementById('informeForm').reset();
        fotos = [];
        videos = [];
        documentos = [];
        
        document.getElementById('fotosPreview').innerHTML = '<p class="empty-message">No hay fotos seleccionadas</p>';
        document.getElementById('videosPreview').innerHTML = '<p class="empty-message">No hay videos seleccionados</p>';
        document.getElementById('documentosPreview').innerHTML = '<p class="empty-message">No hay documentos seleccionados</p>';
        
        updateReviewSection();
        goToStep(1);
    }
    
    // Funciones auxiliares
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
});

// Funciones para navegación entre pasos (globales para acceso desde HTML)
function nextStep(currentStep) {
    // Validar paso actual antes de avanzar
    if (currentStep === 1) {
        const sitio = document.getElementById('sitio').value;
        const tipoSitio = document.getElementById('tipoSitio').value;
        const fecha = document.getElementById('fecha').value;
        
        if (!sitio || !tipoSitio || !fecha) {
            alert('Por favor complete todos los campos del formulario');
            return;
        }
    }
    
    document.getElementById(`step${currentStep}`).classList.remove('active-step');
    document.querySelector(`.progress-steps .step:nth-child(${currentStep})`).classList.remove('active');
    
    const nextStepNum = currentStep + 1;
    document.getElementById(`step${nextStepNum}`).classList.add('active-step');
    document.querySelector(`.progress-steps .step:nth-child(${nextStepNum})`).classList.add('active');
    
    // Actualizar sección de revisión cuando llegamos al último paso
    if (nextStepNum === 5) {
        updateReviewSection();
    }
}

function prevStep(currentStep) {
    document.getElementById(`step${currentStep}`).classList.remove('active-step');
    document.querySelector(`.progress-steps .step:nth-child(${currentStep})`).classList.remove('active');
    
    const prevStepNum = currentStep - 1;
    document.getElementById(`step${prevStepNum}`).classList.add('active-step');
    document.querySelector(`.progress-steps .step:nth-child(${prevStepNum})`).classList.add('active');
}

function goToStep(stepNumber) {
    // Ocultar todos los pasos
    document.querySelectorAll('.form-section').forEach(step => {
        step.classList.remove('active-step');
    });
    
    // Desactivar todos los indicadores de progreso
    document.querySelectorAll('.progress-steps .step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostrar el paso seleccionado
    document.getElementById(`step${stepNumber}`).classList.add('active-step');
    document.querySelector(`.progress-steps .step:nth-child(${stepNumber})`).classList.add('active');
}