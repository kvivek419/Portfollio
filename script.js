// script.js

if (window.AOS) {
    AOS.init({
        duration: 850,
        once: true, // animations once
        mirror: false, // whether elements should animate out while scrolling past them
        offset: 60,
    });
}

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const siteNav = document.getElementById('site-nav');
const scrollProgress = document.getElementById('scroll-progress');
const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link')];
const mobileNavLinks = [...document.querySelectorAll('.mobile-menu a')];
const allNavLinks = [...navLinks, ...mobileNavLinks];
const sections = [...document.querySelectorAll('main section[id]')];

const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenuButton) return;

    mobileMenu.classList.remove('flex');
    mobileMenu.classList.add('hidden');
    mobileMenuButton.classList.remove('open');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    mobileMenuButton.setAttribute('aria-label', 'Open navigation');
};

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Close mobile menu if open
        closeMobileMenu();
    });
});

// Mobile menu toggle
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        const opening = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden', !opening);
        mobileMenu.classList.toggle('flex', opening);
        mobileMenuButton.classList.toggle('open', opening);
        mobileMenuButton.setAttribute('aria-expanded', String(opening));
        mobileMenuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMobileMenu();
    });
    document.addEventListener('click', event => {
        if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) closeMobileMenu();
    });
}

const updatePageState = () => {
    const scrollTop = window.scrollY;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    if (siteNav) siteNav.classList.toggle('scrolled', scrollTop > 24);

    const activeSection = [...sections].reverse().find(section => scrollTop + 180 >= section.offsetTop);
    allNavLinks.forEach(link => {
        const isActive = Boolean(activeSection) && link.getAttribute('href') === `#${activeSection.id}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
};

window.addEventListener('scroll', updatePageState, { passive: true });
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMobileMenu();
    updatePageState();
});

updatePageState();

const aiNetworkCanvas = document.getElementById('ai-network-canvas');

if (aiNetworkCanvas) {
    const context = aiNetworkCanvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let frameId = 0;
    let previousFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let networkNodes = [];
    let globePoints = [];

    const createScene = () => {
        const nodeCount = width < 600 ? 20 : Math.min(48, Math.floor(width / 28));
        networkNodes = Array.from({ length: nodeCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.12,
            size: 0.7 + Math.random() * 1.6,
            phase: Math.random() * Math.PI * 2,
        }));
        globePoints = Array.from({ length: width < 600 ? 42 : 72 }, (_, index, points) => {
            const y = 1 - (index / (points - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const angle = Math.PI * (3 - Math.sqrt(5)) * index;
            return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
        });
    };

    const resizeCanvas = () => {
        const bounds = aiNetworkCanvas.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        width = bounds.width;
        height = bounds.height;
        aiNetworkCanvas.width = Math.max(1, Math.floor(width * ratio));
        aiNetworkCanvas.height = Math.max(1, Math.floor(height * ratio));
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        createScene();
    };

    const drawNetwork = time => {
        const connectionDistance = width < 600 ? 105 : 145;

        networkNodes.forEach(node => {
            if (!reduceMotion.matches) {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < -10 || node.x > width + 10) node.vx *= -1;
                if (node.y < -10 || node.y > height + 10) node.vy *= -1;
            }
        });

        for (let first = 0; first < networkNodes.length; first += 1) {
            for (let second = first + 1; second < networkNodes.length; second += 1) {
                const a = networkNodes[first];
                const b = networkNodes[second];
                const distance = Math.hypot(a.x - b.x, a.y - b.y);
                if (distance >= connectionDistance) continue;

                context.beginPath();
                context.moveTo(a.x + pointerX, a.y + pointerY);
                context.lineTo(b.x + pointerX, b.y + pointerY);
                context.strokeStyle = `rgba(72, 214, 190, ${(1 - distance / connectionDistance) * 0.18})`;
                context.lineWidth = 0.65;
                context.stroke();
            }
        }

        networkNodes.forEach(node => {
            const pulse = reduceMotion.matches ? 1 : 0.72 + Math.sin(time * 0.0015 + node.phase) * 0.28;
            context.beginPath();
            context.arc(node.x + pointerX, node.y + pointerY, node.size * pulse, 0, Math.PI * 2);
            context.fillStyle = 'rgba(104, 224, 205, 0.55)';
            context.fill();
        });
    };

    const drawGlobe = time => {
        const centerX = width * (width < 900 ? 0.72 : 0.79) + pointerX * 1.8;
        const centerY = height * 0.44 + pointerY * 1.8;
        const radius = Math.min(width, height) * (width < 600 ? 0.22 : 0.27);
        const rotation = reduceMotion.matches ? 0.5 : time * 0.000055;
        const cosine = Math.cos(rotation);
        const sine = Math.sin(rotation);
        const tiltCosine = Math.cos(0.24);
        const tiltSine = Math.sin(0.24);
        const projected = globePoints.map(point => {
            const rotatedX = point.x * cosine + point.z * sine;
            const rotatedZ = -point.x * sine + point.z * cosine;
            const rotatedY = point.y * tiltCosine - rotatedZ * tiltSine;
            const depth = point.y * tiltSine + rotatedZ * tiltCosine;
            const scale = 1 + depth * 0.13;
            return {
                x: centerX + rotatedX * radius * scale,
                y: centerY + rotatedY * radius * scale,
                depth,
                source: point,
            };
        });

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(104, 168, 255, 0.12)';
        context.lineWidth = 1;
        context.stroke();

        for (let first = 0; first < projected.length; first += 1) {
            for (let second = first + 1; second < projected.length; second += 1) {
                const a = projected[first];
                const b = projected[second];
                const sourceDistance = Math.hypot(a.source.x - b.source.x, a.source.y - b.source.y, a.source.z - b.source.z);
                if (sourceDistance > 0.48 || a.depth < -0.35 || b.depth < -0.35) continue;

                context.beginPath();
                context.moveTo(a.x, a.y);
                context.lineTo(b.x, b.y);
                context.strokeStyle = `rgba(104, 168, 255, ${0.035 + Math.min(a.depth, b.depth) * 0.045})`;
                context.lineWidth = 0.55;
                context.stroke();
            }
        }

        projected.forEach(point => {
            const visibility = Math.max(0.12, (point.depth + 1) * 0.32);
            context.beginPath();
            context.arc(point.x, point.y, point.depth > 0.25 ? 1.7 : 1, 0, Math.PI * 2);
            context.fillStyle = `rgba(118, 218, 255, ${visibility})`;
            context.fill();
        });
    };

    const renderScene = time => {
        if (time - previousFrame < 32 && !reduceMotion.matches) {
            frameId = requestAnimationFrame(renderScene);
            return;
        }

        previousFrame = time;
        context.clearRect(0, 0, width, height);
        drawNetwork(time);
        drawGlobe(time);
        if (!reduceMotion.matches) frameId = requestAnimationFrame(renderScene);
    };

    const startScene = () => {
        cancelAnimationFrame(frameId);
        previousFrame = 0;
        frameId = requestAnimationFrame(renderScene);
    };

    resizeCanvas();
    startScene();

    window.addEventListener('resize', () => {
        resizeCanvas();
        startScene();
    });
    window.addEventListener('pointermove', event => {
        pointerX = (event.clientX / window.innerWidth - 0.5) * 8;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 8;
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(frameId);
        else startScene();
    });
    reduceMotion.addEventListener('change', startScene);
}
