/* js/main.js - Custo Zero e Proteção O2O */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO CARROSSEL HERO ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const slideInterval = 4000; 

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
            if(i === index) slide.removeAttribute('aria-hidden');
            else slide.setAttribute('aria-hidden', 'true');
        });
    }

    window.nextSlide = function() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    window.prevSlide = function() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    if(slides.length > 0) setInterval(window.nextSlide, slideInterval);

    // --- LÓGICA DE BUSCA OVERLAY ---
    window.toggleSearch = function() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('global-search');
        if(overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
            setTimeout(() => { 
                overlay.classList.remove('opacity-0'); 
                input.focus(); 
            }, 10);
        } else {
            overlay.classList.add('opacity-0');
            setTimeout(() => { overlay.classList.add('hidden'); input.value = ''; }, 300);
        }
    }

    // --- BANNER DE COOKIES LGPD ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('lgpd_dgconcept')) {
        if(cookieBanner) cookieBanner.classList.remove('hidden');
    }

    if(acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('lgpd_dgconcept', 'aceito');
            cookieBanner.classList.add('hidden');
        });
    }

    // --- OBFUSCAÇÃO DE LINKS EXTERNOS CONTRA SPAM BOTS ---
    window.startWhatsAppService = function() {
        const num = atob('NTUzNDk3NjY4OTg3'); // +55 34 9766-8987
        window.open(`https://wa.me/${num}?text=Olá, tudo bem? Gostaria de conhecer mais sobre a loja e receber atendimento VIP.`, '_blank');
    }
    
    window.handleInstaRedirect = function() {
        const handle = atob('YWJvdXRpcXVlX2FuZ2Vs');
        window.open(`https://www.instagram.com/${handle}`, '_blank');
    }

    window.handleMapsRedirect = function() {
        window.open('https://abre.ai/maps-dgconcept', '_blank');
    }
    
    // Bloqueio de ferramentas de desenvolvedor para mitigar Bots
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.onkeydown = function(e) {
        if(e.keyCode == 123) return false;
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
        if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
    }
});