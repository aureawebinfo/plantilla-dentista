// Variables para el carrusel
let slideIndex = 0;
let intervalo;
let totalGrupos = 3;

// Iniciar el carrusel automático
function iniciarCarrusel() {
    intervalo = setInterval(() => {
        moverCarrusel(1);
    }, 5000);
}

// Mover el carrusel en la dirección indicada
function moverCarrusel(direccion) {
    const slides = document.querySelectorAll('.miembro');
    const indicadores = document.querySelectorAll('.indicador');

    slideIndex += direccion;

    if (slideIndex < 0) {
        slideIndex = totalGrupos - 1;
    } else if (slideIndex >= totalGrupos) {
        slideIndex = 0;
    }

    // Calcular el desplazamiento (cada "grupo" ocupa 100%)
    const desplazamiento = -slideIndex * 100;
    const carrusel = document.querySelector('.equipo-carrusel');
    if (carrusel) carrusel.style.transform = `translateX(${desplazamiento}%)`;

    // Actualizar indicadores
    actualizarIndicadores();

    // Reiniciar el temporizador
    reiniciarTemporizador();
}

// Ir a un slide específico
function irASlide(index) {
    const diferencia = index - slideIndex;
    moverCarrusel(diferencia);
}

// Actualizar indicadores activos
function actualizarIndicadores() {
    const indicadores = document.querySelectorAll('.indicador');
    indicadores.forEach((indicador, index) => {
        if (index === slideIndex) {
            indicador.classList.add('active');
        } else {
            indicador.classList.remove('active');
        }
    });
}

// Reiniciar el temporizador del carrusel
function reiniciarTemporizador() {
    clearInterval(intervalo);
    iniciarCarrusel();
}

// Animaciones al hacer scroll
function observarElementos() {
    const elementos = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elementos.forEach(elemento => {
        observer.observe(elemento);
    });
}

/* =============================
   MENÚ HAMBURGUESA (mejorado)
   ============================= */
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    // Crear overlay si no existe
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        overlay.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Toggle al hacer click en el hamburger
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = hamburger.classList.contains('active');
        if (isOpen) closeMenu(); else openMenu();
    });

    // Cerrar al pulsar overlay
    overlay.addEventListener('click', closeMenu);

    // Cerrar al pulsar cualquier enlace del menú
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Cerrar menú al redimensionar a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* =============================
   Ajustar carrusel según ancho
   ============================= */
function ajustarCarrusel() {
    const slides = document.querySelectorAll('.miembro');
    const anchoVentana = window.innerWidth;

    if (anchoVentana < 768) {
        totalGrupos = 6; // 1 slide por vista
    } else if (anchoVentana < 1024) {
        totalGrupos = 3; // 2 slides por vista
    } else {
        totalGrupos = 2; // 3 slides por vista
    }

    // Recalcular indicadores si es necesario
    const indicadoresContainer = document.querySelector('.carrusel-indicadores');
    if (!indicadoresContainer) return;
    const indicadoresExistentes = indicadoresContainer.querySelectorAll('.indicador');

    if (indicadoresExistentes.length !== totalGrupos) {
        indicadoresContainer.innerHTML = '';
        for (let i = 0; i < totalGrupos; i++) {
            const indicador = document.createElement('span');
            indicador.className = 'indicador';
            if (i === 0) indicador.classList.add('active');
            indicador.addEventListener('click', () => irASlide(i));
            indicadoresContainer.appendChild(indicador);
        }
    }

    moverCarrusel(0);
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Carrusel
    ajustarCarrusel();
    iniciarCarrusel();

    // Event listeners para controles del carrusel (si existen)
    const prevBtn = document.querySelector('.carrusel-control.prev');
    const nextBtn = document.querySelector('.carrusel-control.next');
    if (prevBtn) prevBtn.addEventListener('click', () => moverCarrusel(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moverCarrusel(1));

    // Menú hamburguesa (unificado)
    setupHamburgerMenu();

    // Animaciones al scroll
    observarElementos();

    // Ajustar carrusel al redimensionar
    window.addEventListener('resize', ajustarCarrusel);

    // Cerrar menú al hacer clic en un enlace (seguro — doble comprobación)
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
            const navMenu = document.getElementById('main-nav') || document.querySelector('.nav-menu');
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                const overlay = document.querySelector('.menu-overlay');
                if (overlay) overlay.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            }
        });
    });

    // Formulario de contacto
    const contactoForm = document.querySelector('.contacto-form');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
            this.reset();
        });
    }

    // Mejorar experiencia táctil en móviles
    if ('ontouchstart' in window) {
        document.querySelectorAll('.btn, .servicio, .miembro').forEach(element => {
            element.style.cursor = 'pointer';
        });
    }
});

// Efecto de header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--color-white)';
        header.style.backdropFilter = 'none';
    }
});

/* =============================
   SISTEMA DE CARGA ENTRE PÁGINAS
   ============================= */
function setupPageTransitions() {
    // Crear pantalla de carga si no existe
    if (!document.querySelector('.loading-screen')) {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen hidden';
        loadingScreen.innerHTML = `
            <div class="tooth-loader"></div>
            <div class="loading-text">Cargando sonrisas...</div>
        `;
        document.body.appendChild(loadingScreen);
    }

    // Interceptar clicks en enlaces internos
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes(window.location.origin) && 
            !link.href.includes('#') && link.target !== '_blank') {
            
            const href = link.getAttribute('href');
            if (href && !href.startsWith('javascript') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                e.preventDefault();
                
                // Mostrar pantalla de carga
                const loadingScreen = document.querySelector('.loading-screen');
                loadingScreen.classList.remove('hidden');
                
                // Navegar después de un breve delay para que se vea la animación
                setTimeout(() => {
                    window.location.href = href;
                }, 800);
            }
        }
    });

    // Ocultar pantalla de carga cuando la página esté lista
    window.addEventListener('load', function() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    });
}

// Inicializar en DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente ...
    
    // Agregar esta línea:
    setupPageTransitions();
    
    // ... resto del código existente ...
});
