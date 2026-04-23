/* ============================================= */
/*  PARTICLES BACKGROUND                         */
/* ============================================= */
class ParticleCanvas {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Move
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around
            if (p.x > this.canvas.width) p.x = 0;
            if (p.x < 0) p.x = this.canvas.width;
            if (p.y > this.canvas.height) p.y = 0;
            if (p.y < 0) p.y = this.canvas.height;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(250, 80%, 72%, ${p.opacity})`;
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `hsla(250, 60%, 60%, ${0.08 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }

            // Mouse interaction
            if (this.mouse.x) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (1 - dist / this.mouse.radius) * 0.02;
                    p.x += dx * force;
                    p.y += dy * force;
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

/* ============================================= */
/*  NAVBAR SCROLL EFFECT                         */
/* ============================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    // Scroll class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active link highlight on scroll
    const sections = document.querySelectorAll('.section, .hero');
    const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinkEls.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--primary-light)';
            } else {
                link.style.color = '';
            }
        });
    });
}

/* ============================================= */
/*  SCROLL ANIMATIONS                            */
/* ============================================= */
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================= */
/*  COUNTER ANIMATION                            */
/* ============================================= */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let animated = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'));
                        const duration = 2000;
                        const start = performance.now();

                        function update(currentTime) {
                            const elapsed = currentTime - start;
                            const progress = Math.min(elapsed / duration, 1);

                            // Ease out cubic
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = Math.round(eased * target);

                            counter.textContent = current.toLocaleString();

                            if (progress < 1) {
                                requestAnimationFrame(update);
                            }
                        }

                        requestAnimationFrame(update);
                    });
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(counter => observer.observe(counter));
}

/* ============================================= */
/*  SMOOTH SCROLL FOR ANCHOR LINKS               */
/* ============================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth',
                });
            }
        });
    });
}

/* ============================================= */
/*  TYPING EFFECT FOR TAGLINE                    */
/* ============================================= */
function initTypingEffect() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';
    tagline.style.borderRight = '2px solid var(--primary)';

    let i = 0;
    function type() {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(type, 30);
        } else {
            // Remove cursor after typing
            setTimeout(() => {
                tagline.style.borderRight = 'none';
            }, 1500);
        }
    }

    // Start after hero animations
    setTimeout(type, 800);
}

/* ============================================= */
/*  TILT EFFECT ON PROJECT CARD                  */
/* ============================================= */
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .skill-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ============================================= */
/*  PLACEHOLDER IMAGE HANDLER                    */
/* ============================================= */
function initPlaceholderImages() {
    // Create gradient placeholder for images that fail to load
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', () => {
            // Create a canvas to generate a placeholder
            const canvas = document.createElement('canvas');
            const size = Math.max(img.width || 200, img.height || 200);
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Gradient background
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, 'hsl(250, 30%, 18%)');
            gradient.addColorStop(1, 'hsl(330, 30%, 18%)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);

            // Initials or icon
            ctx.fillStyle = 'hsla(250, 60%, 60%, 0.4)';
            ctx.font = `${size / 3}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const alt = img.alt || '';
            const initials = alt.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
            ctx.fillText(initials || '?', size / 2, size / 2);

            img.src = canvas.toDataURL();
        });
    });
}

/* ============================================= */
/*  INITIALIZE EVERYTHING                        */
/* ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    new ParticleCanvas();
    initNavbar();
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    initTypingEffect();
    initTiltEffect();
    initPlaceholderImages();
});
