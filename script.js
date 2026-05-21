/* ============================================= */
/*  PARTICLES BACKGROUND                         */
/* ============================================= */
class ParticleCanvas {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
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
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 12000));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                // Mixed colors between primary (hue 250) and accent (cyan/blue)
                color: Math.random() > 0.5 ? 'rgba(108, 99, 255, ' : 'rgba(0, 212, 255, '
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
            this.ctx.fillStyle = p.color + p.opacity + ')';
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
                    this.ctx.strokeStyle = `rgba(108, 99, 255, ${0.1 * (1 - dist / 120)})`;
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
                    
                    // Draw line to mouse
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / this.mouse.radius)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
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
    if (!navbar) return;

    // Scroll class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (navToggle && navLinks) {
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
    }

    // Active link highlight on scroll
    const sections = document.querySelectorAll('section');
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
                link.style.color = 'var(--accent)';
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
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const target = document.querySelector(targetId);
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
/*  TYPEWRITER EFFECT                            */
/* ============================================= */
function initTypewriter() {
    const textElement = document.querySelector('.typewriter-text');
    if (!textElement) return;

    const roles = [
        "AI/ML Developer", 
        "Computer Vision Engineer", 
        "RL Researcher", 
        "CSE Student @ MVSR"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            textElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50; // Faster deleting
        } else {
            textElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100; // Normal typing
        }
        
        // Logic to switch between typing and deleting
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            isDeleting = true;
            typingDelay = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingDelay = 500; // Pause before new word
        }
        
        setTimeout(type, typingDelay);
    }
    
    // Start after slight delay
    setTimeout(type, 1000);
}

/* ============================================= */
/*  TILT EFFECT ON CARDS                         */
/* ============================================= */
function initTiltEffect() {
    // Only apply on non-touch devices
    if(window.matchMedia("(hover: none)").matches) return;
    
    const cards = document.querySelectorAll('.project-card, .skill-group, .achievement-card, .cert-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ============================================= */
/*  MARQUEE GALLERY JS LOGIC                     */
/* ============================================= */
function initMarqueeGallery() {
    // 1. Fallback for missing images
    const marqueeImages = document.querySelectorAll('.mcard-img-wrapper img');
    marqueeImages.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with a placeholder
            this.onerror = null;
            this.style.display = 'none'; // hide the broken image
            
            // Create fallback container
            const fallback = document.createElement('div');
            fallback.style.width = '100%';
            fallback.style.height = '100%';
            fallback.style.display = 'flex';
            fallback.style.flexDirection = 'column';
            fallback.style.alignItems = 'center';
            fallback.style.justifyContent = 'center';
            fallback.style.background = 'var(--bg-tertiary)';
            fallback.style.color = 'var(--text-muted)';
            fallback.style.fontSize = '2rem';
            
            // Add emoji and text
            fallback.innerHTML = '<div>📷</div><div style="font-size:0.8rem;margin-top:8px;">Photo unavailable</div>';
            
            this.parentElement.appendChild(fallback);
        });
    });

    // 2. Pause on tab hidden
    document.addEventListener('visibilitychange', () => {
        const tracks = document.querySelectorAll('.marquee-inner');
        tracks.forEach(t => {
            t.style.animationPlayState = document.hidden ? 'paused' : 'running';
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
    initTypewriter();
    initTiltEffect();
    initMarqueeGallery();
});
