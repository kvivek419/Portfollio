// script.js

AOS.init({
    duration: 1200,
    once: true, // animations once
    mirror: false, // whether elements should animate out while scrolling past them
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu.classList.contains('flex')) {
            mobileMenu.classList.remove('flex');
            mobileMenu.classList.add('hidden');
        }
    });
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    mobileMenu.classList.toggle('flex-col');
});
