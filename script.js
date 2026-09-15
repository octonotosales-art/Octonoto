document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Elements
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const langBtns = document.querySelectorAll('.lang-btn');
    const langBtnsMobile = document.querySelectorAll('.lang-btn-mobile');
    const i18nElements = document.querySelectorAll('[data-i18n]');
    
    // State
    let currentLang = 'en';

    // Navbar Scroll Effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled-nav');
                navbar.classList.add('py-2');
            } else {
                navbar.classList.remove('scrolled-nav');
                navbar.classList.remove('py-2');
            }
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Language Switcher Logic
    function setLanguage(lang) {
        currentLang = lang;
        
        // Update Body Font
        if (lang === 'th') {
            document.body.classList.remove('lang-en');
            document.body.classList.add('lang-th');
        } else {
            document.body.classList.remove('lang-th');
            document.body.classList.add('lang-en');
        }

        // Update Text Content
        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Determine if element is an input placeholder or text content
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        // Update Desktop Buttons
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active-lang');
                btn.classList.remove('text-gray-500');
            } else {
                btn.classList.remove('active-lang');
                btn.classList.add('text-gray-500');
            }
        });

        // Update Mobile Buttons
        langBtnsMobile.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('text-navy');
                btn.classList.remove('text-gray-500');
            } else {
                btn.classList.remove('text-navy');
                btn.classList.add('text-gray-500');
            }
        });
    }

    // Bind click events to language buttons
    [...langBtns, ...langBtnsMobile].forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedLang = e.target.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });

    // Initialize default language
    setLanguage(currentLang);

    // Contact Form Logic
    const contactForm = document.getElementById('contact-form');
    const formSuccessState = document.getElementById('form-success-state');
    const submitBtn = document.getElementById('submit-btn');
    const formValidationMsg = document.getElementById('form-validation-msg');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (contactForm) {
        const submitBtnText = submitBtn.querySelector('span');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formValidationMsg.classList.add('hidden');

            const formData = new FormData(contactForm);
            
            // Basic frontend validation
            if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
                formValidationMsg.classList.remove('hidden');
                return;
            }

            // Update button state
            submitBtnText.textContent = translations[currentLang]['form_submitting'] || 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    contactForm.classList.add('hidden');
                    formSuccessState.classList.remove('hidden');
                    formSuccessState.classList.add('flex');
                    contactForm.reset();
                } else {
                    console.error(response);
                    alert(translations[currentLang]['form_error'] || 'Oops! Something went wrong.');
                }
            })
            .catch(error => {
                console.error(error);
                alert(translations[currentLang]['form_error'] || 'Oops! Something went wrong.');
            })
            .finally(() => {
                submitBtnText.textContent = translations[currentLang]['form_submit'] || 'Send Message';
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            });
        });
        
        resetFormBtn.addEventListener('click', () => {
            formSuccessState.classList.add('hidden');
            formSuccessState.classList.remove('flex');
            contactForm.classList.remove('hidden');
        });
    }

    // Lightbox Logic for Product Images
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'fixed inset-0 z-[100] hidden bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
    
    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-95 transition-transform duration-300';
    lightbox.appendChild(lightboxImg);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-6 right-6 text-white hover:text-gold transition-colors';
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    lightbox.appendChild(closeBtn);

    document.body.appendChild(lightbox);

    // Target all images except logos and QR codes
    const zoomableImages = document.querySelectorAll('img:not([src="logo.png"]):not([src="catalogue-qr.jpg"]):not([src="line-qr.jpg"])');
    
    zoomableImages.forEach(img => {
        img.classList.add('cursor-zoom-in', 'transition-transform', 'hover:opacity-90');
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
            void lightbox.offsetWidth; // Trigger reflow
            lightbox.classList.remove('opacity-0');
            lightboxImg.classList.remove('scale-95');
            lightboxImg.classList.add('scale-100');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.add('opacity-0');
        lightboxImg.classList.remove('scale-100');
        lightboxImg.classList.add('scale-95');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
});
