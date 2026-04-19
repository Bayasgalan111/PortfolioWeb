/* ========================================
   Particle Background Animation
======================================== */
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = this.getParticleCount();
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    getParticleCount() {
        const width = window.innerWidth;
        if (width < 480) return 30;
        if (width < 768) return 50;
        return 80;
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particleCount = this.getParticleCount();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    connectParticles() {
        const maxDistance = 120;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a + 1; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update(this.mouse, this.canvas);
            particle.draw(this.ctx);
        });

        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.baseSpeedX = this.speedX;
        this.baseSpeedY = this.speedY;
    }

    update(mouse, canvas) {
        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.speedX = this.baseSpeedX - Math.cos(angle) * force * 2;
                this.speedY = this.baseSpeedY - Math.sin(angle) * force * 2;
            } else {
                this.speedX = this.baseSpeedX;
                this.speedY = this.baseSpeedY;
            }
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ========================================
   Initialize Particle System
======================================== */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles');
    if (canvas) {
        new ParticleSystem(canvas);
    }
});

/* ========================================
   Navigation
======================================== */
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

/* ========================================
   Scroll Indicator
======================================== */
const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollIndicator.style.width = scrolled + '%';
});

/* ========================================
   Section Reveal Animation
======================================== */
const sections = document.querySelectorAll('.section');

const revealSection = () => {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', revealSection);
window.addEventListener('load', revealSection);

/* ========================================
   Modal Functions
======================================== */
const modal = document.getElementById('contactModal');

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

/* ========================================
   Contact Form Handling
======================================== */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate sending (replace with actual EmailJS integration)
    try {
        // For EmailJS integration, uncomment and configure:
        // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data);
        
        // Simulated delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#22c55e';
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            closeModal();
        }, 2000);
        
    } catch (error) {
        console.error('Error sending message:', error);
        submitBtn.textContent = 'Error - Try Again';
        submitBtn.style.background = '#ef4444';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 2000);
    }
});

/* ========================================
   Smooth Scroll for Anchor Links
======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========================================
   Active Navigation Link Highlight
======================================== */
const highlightNavLink = () => {
    const scrollPos = window.scrollY + 100;
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNavLink);

/* ========================================
   Add CSS for Active Nav Link
======================================== */
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--color-text);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

/* ========================================
   Preloader (Optional Enhancement)
======================================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelector('.hero')?.classList.add('visible');
    }, 100);
});

/* ========================================
   Particle Text Animation for Contact Section
======================================== */
class ParticleTextAnimation {
    constructor(canvas, text) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.text = text;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.animationPhase = 'formed'; // 'formed', 'scattering', 'flowing', 'reforming'
        this.phaseTimer = 0;
        this.phaseDuration = {
            formed: 3000,
            scattering: 1500,
            flowing: 2000,
            reforming: 1500
        };
        this.isHovering = false;
        this.initialized = false;
        
        this.init();
    }

    init() {
        this.resize();
        this.setupEventListeners();
        this.createParticlesFromText();
        this.animate();
    }

    resize() {
        const wrapper = this.canvas.parentElement;
        const rect = wrapper.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(dpr, dpr);
        
        this.width = rect.width;
        this.height = rect.height;
        
        if (this.initialized) {
            this.createParticlesFromText();
        }
    }

    createParticlesFromText() {
        this.particles = [];

        const W = this.width;
        const H = this.height;

        // Use an off-screen canvas at logical (CSS) resolution to avoid dpr mismatch
        const offscreen = document.createElement('canvas');
        offscreen.width  = W;
        offscreen.height = H;
        const offCtx = offscreen.getContext('2d');

        const fontSize = Math.min(W / 10, 60);

        offCtx.clearRect(0, 0, W, H);
        offCtx.fillStyle = '#ffffff';
        offCtx.font = `bold ${fontSize}px Inter, sans-serif`;
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(this.text, W / 2, H / 2);

        const imageData = offCtx.getImageData(0, 0, W, H);
        const data = imageData.data;

        const gap = 4;
        const particleSize = 2;

        for (let y = 0; y < H; y += gap) {
            for (let x = 0; x < W; x += gap) {
                const index = (y * W + x) * 4;
                if (data[index + 3] > 128) {
                    this.particles.push(new TextParticle(x, y, particleSize, W, H));
                }
            }
        }

        this.initialized = true;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mouseenter', () => {
            this.isHovering = true;
            if (this.animationPhase === 'formed') {
                this.startPhase('scattering');
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    startPhase(phase) {
        this.animationPhase = phase;
        this.phaseTimer = 0;
        
        if (phase === 'scattering') {
            this.particles.forEach(p => p.scatter());
        } else if (phase === 'flowing') {
            this.particles.forEach(p => p.startFlow());
        } else if (phase === 'reforming') {
            this.particles.forEach(p => p.reform());
        }
    }

    updatePhase(deltaTime) {
        this.phaseTimer += deltaTime;
        
        const currentDuration = this.phaseDuration[this.animationPhase];
        
        if (this.phaseTimer >= currentDuration) {
            switch (this.animationPhase) {
                case 'formed':
                    if (!this.isHovering) {
                        this.startPhase('scattering');
                    }
                    break;
                case 'scattering':
                    this.startPhase('flowing');
                    break;
                case 'flowing':
                    this.startPhase('reforming');
                    break;
                case 'reforming':
                    this.animationPhase = 'formed';
                    this.phaseTimer = 0;
                    break;
            }
        }
    }

    animate(timestamp = 0) {
        const deltaTime = timestamp - (this.lastTimestamp || 0);
        this.lastTimestamp = timestamp;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.updatePhase(deltaTime);
        
        // Draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse, this.animationPhase, this.phaseTimer / this.phaseDuration[this.animationPhase]);
            particle.draw(this.ctx);
        });
        
        requestAnimationFrame((t) => this.animate(t));
    }
}

class TextParticle {
    constructor(x, y, size, canvasWidth, canvasHeight) {
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.size = size;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Animation properties
        this.scatterX = 0;
        this.scatterY = 0;
        this.flowAngle = Math.random() * Math.PI * 2;
        this.flowRadius = 0;
        this.flowSpeed = 0.5 + Math.random() * 1;
        
        // Color gradient based on position
        this.hue = 210 + (x / canvasWidth) * 60; // Blue to purple gradient
        this.baseColor = `hsla(${this.hue}, 80%, 65%, 1)`;
    }

    scatter() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        this.scatterX = Math.cos(angle) * distance;
        this.scatterY = Math.sin(angle) * distance;
    }

    startFlow() {
        this.flowAngle = Math.random() * Math.PI * 2;
        this.flowRadius = 20 + Math.random() * 40;
    }

    reform() {
        // Reset scatter values gradually
    }

    update(mouse, phase, progress) {
        let targetX = this.originX;
        let targetY = this.originY;
        
        switch (phase) {
            case 'formed':
                // Slight floating effect when formed
                targetX = this.originX + Math.sin(Date.now() * 0.001 + this.originX * 0.01) * 2;
                targetY = this.originY + Math.cos(Date.now() * 0.001 + this.originY * 0.01) * 2;
                break;
                
            case 'scattering':
                // Ease out to scattered position
                const scatterEase = this.easeOutCubic(progress);
                targetX = this.originX + this.scatterX * scatterEase;
                targetY = this.originY + this.scatterY * scatterEase;
                break;
                
            case 'flowing':
                // Circular flowing motion
                this.flowAngle += this.flowSpeed * 0.02;
                const flowX = Math.cos(this.flowAngle) * this.flowRadius;
                const flowY = Math.sin(this.flowAngle) * this.flowRadius;
                targetX = this.originX + this.scatterX + flowX;
                targetY = this.originY + this.scatterY + flowY;
                break;
                
            case 'reforming':
                // Ease back to original position
                const reformEase = this.easeInOutCubic(progress);
                const currentScatterX = this.scatterX + Math.cos(this.flowAngle) * this.flowRadius;
                const currentScatterY = this.scatterY + Math.sin(this.flowAngle) * this.flowRadius;
                targetX = this.originX + currentScatterX * (1 - reformEase);
                targetY = this.originY + currentScatterY * (1 - reformEase);
                break;
        }
        
        // Mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                targetX += Math.cos(angle) * force * 30;
                targetY += Math.sin(angle) * force * 30;
            }
        }
        
        // Smooth interpolation
        this.x += (targetX - this.x) * 0.1;
        this.y += (targetY - this.y) * 0.1;
    }

    draw(ctx) {
        // Dynamic opacity based on distance from origin
        const dx = this.x - this.originX;
        const dy = this.y - this.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const opacity = Math.max(0.3, 1 - distance / 200);
        
        ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

/* ========================================
   Initialize Particle Text Animation
======================================== */
document.addEventListener('DOMContentLoaded', () => {
    const textCanvas = document.getElementById('textParticles');
    if (textCanvas) {
        // Small delay to ensure layout is complete
        setTimeout(() => {
            new ParticleTextAnimation(textCanvas, "Let's Work Together");
        }, 100);
    }
});

/* ========================================
   Custom Cursor
======================================== */
(function initCustomCursor() {
    // Skip on touch devices
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    // Current mouse position (instant)
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;

    // Ring trailing position (lerped)
    let ringX = mouseX;
    let ringY = mouseY;

    // Lerp factor for the trailing ring
    const LERP = 0.12;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Hover detection on interactive elements
    const interactiveSelector = 'a, button, [role="button"], label, input, textarea, select, .project-card, .skill-tag, .nav-logo';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelector)) {
            dot.classList.add('hovering');
            ring.classList.add('hovering');

            // Magnetic pull: nudge ring toward element center
            const el = e.target.closest(interactiveSelector);
            if (el) {
                const rect = el.getBoundingClientRect();
                const elCX = rect.left + rect.width  / 2;
                const elCY = rect.top  + rect.height / 2;
                const dx = (elCX - mouseX) * 0.15;
                const dy = (elCY - mouseY) * 0.15;
                ringX += dx;
                ringY += dy;
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelector)) {
            dot.classList.remove('hovering');
            ring.classList.remove('hovering');
        }
    });

    // Click feedback
    document.addEventListener('mousedown', () => {
        dot.classList.add('clicking');
        ring.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        dot.classList.remove('clicking');
        ring.classList.remove('clicking');
    });

    // Hide when cursor leaves window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });

    // Animation loop using rAF
    function animate() {
        // Dot follows instantly
        dot.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;

        // Ring lerps toward mouse
        ringX += (mouseX - ringX) * LERP;
        ringY += (mouseY - ringY) * LERP;
        ring.style.transform = `translate3d(calc(${ringX}px - 50%), calc(${ringY}px - 50%), 0)`;

        requestAnimationFrame(animate);
    }

    animate();
})();

/* ========================================
   Console Easter Egg
======================================== */
console.log('%cHello there, curious developer!', 'font-size: 24px; font-weight: bold; color: #3b82f6;');
console.log('%cThis portfolio was crafted with pure HTML, CSS, and JavaScript.', 'font-size: 14px; color: #71717a;');
console.log('%cFeel free to explore the code!', 'font-size: 14px; color: #71717a;');
