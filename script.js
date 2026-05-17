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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled-nav');
            navbar.classList.add('py-2');
        } else {
            navbar.classList.remove('scrolled-nav');
            navbar.classList.remove('py-2');
        }
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

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
                    el.textContent = translations[lang][key];
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
});
