// --- 1. Advanced Brightness / Brightness Control System ---
const themeButtons = document.querySelectorAll('[data-theme-set]');
const systemDarkMatch = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
    let activeTheme = theme;
    if (theme === 'auto') {
        activeTheme = systemDarkMatch.matches ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', activeTheme);
    
    // Sync UI active state button
    themeButtons.forEach(btn => {
        if(btn.getAttribute('data-theme-set') === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setThemeSetting(theme) {
    localStorage.setItem('site-brightness-mode', theme);
    applyTheme(theme);
}

// Initialize theme tracking
const savedThemeMode = localStorage.getItem('site-brightness-mode') || 'auto';
applyTheme(savedThemeMode);

// Click Event Bindings
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        setThemeSetting(button.getAttribute('data-theme-set'));
    });
});

// Listen for system level modifications in real-time
systemDarkMatch.addEventListener('change', () => {
    if (localStorage.getItem('site-brightness-mode') === 'auto' || !localStorage.getItem('site-brightness-mode')) {
        applyTheme('auto');
    }
});


// --- 2. Typewriter Effect ---
const typingElement = document.querySelector('.typing-text');
const words = JSON.parse(typingElement.getAttribute('data-words'));
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500; 
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}
document.addEventListener('DOMContentLoaded', () => setTimeout(type, 500));


// --- 3. Scroll Progress & Dynamic Menu Tracking ---
const scrollProgress = document.getElementById('scroll-progress');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    }

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 120)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active');
        }
    });
});