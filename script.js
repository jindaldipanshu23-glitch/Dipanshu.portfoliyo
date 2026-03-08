document.addEventListener('DOMContentLoaded', () => {

    // --- Premium Preloader Sequence ---
    const preloader = document.getElementById('preloader');
    const gibberishText = document.getElementById('gibberish-text');
    const progressBar = document.querySelector('.progress-bar-loader');

    if (preloader) {
        const phrases = [
            "Authenticating user protocols...",
            "Loading neural pathways...",
            "Decrypting project archives...",
            "Compiling syntax trees...",
            "Initializing Agentic AI..."
        ];

        let phraseIndex = 0;
        let progress = 0;

        // Change text every 400ms
        const textInterval = setInterval(() => {
            if (phraseIndex < phrases.length) {
                gibberishText.textContent = phrases[phraseIndex];
                phraseIndex++;
            }
        }, 400);

        // Web Audio API for UI Sounds (No external files needed)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx;

        // Initialize AudioContext on first user interaction to bypass browser autoplay policies
        function initAudio() {
            if (!audioCtx) {
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }

        // Add a global listener to ensure audio can play
        document.body.addEventListener('click', initAudio, { once: true });
        document.body.addEventListener('keydown', initAudio, { once: true });

        function playSound(type) {
            if (!audioCtx) return; // Prevent errors before interaction
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            if (type === 'hover') {
                // Hacker terminal bip
                osc.type = 'square';
                osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.05);
            } else if (type === 'click') {
                // Solid terminal clack
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.1);
            } else if (type === 'boot') {
                // Cyberpunk boot up sweep
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.8);
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.4);
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.8);
            } else if (type === 'type') {
                // Short, sharp mechanical keyboard click
                osc.type = 'square';
                const randPitch = Math.random() * 100 + 350; // Tighter pitch variation
                osc.frequency.setValueAtTime(randPitch, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(randPitch / 2, audioCtx.currentTime + 0.01);

                // Very abrupt envelope for a "click" feel
                gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);

                osc.start();
                osc.stop(audioCtx.currentTime + 0.02);
            }
        }

        // Simulate loading progress
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                progressBar.style.width = '100%';
                clearInterval(progressInterval);
                clearInterval(textInterval);
                gibberishText.textContent = "SYSTEM_READY";
                gibberishText.style.color = "#4ade80"; // Bright green

                playSound('boot'); // Play boot sound

                // Hide preloader after short delay
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    document.body.classList.remove('loading');
                    typeTagline(); // Trigger typing effect when loaded
                }, 800);
            } else {
                progressBar.style.width = progress + '%';
            }
        }, 200);
    }

    // --- Custom Cursor Blob ---
    const blob = document.createElement('div');
    blob.classList.add('cursor-blob');
    document.body.appendChild(blob);

    window.addEventListener('mousemove', (e) => {
        blob.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 3000, fill: "forwards" });
    });

    // --- Magnetic Buttons & Sound Triggers ---
    const magneticElements = document.querySelectorAll('.btn, .social-links a, .nav-links a');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = `translate(0px, 0px)`;
        });

        // Add Sound Effects
        elem.addEventListener('mouseenter', () => playSound('hover'));
        elem.addEventListener('mousedown', () => playSound('click'));
    });

    // --- Typewriter Effect for Tagline ---
    const taglineElement = document.querySelector('.tagline');
    const taglineHTML = taglineElement.innerHTML; // Store original html with span
    taglineElement.innerHTML = ''; // Clear for typing

    function typeTagline() {
        let currentHTML = "";
        let i = 0;

        // Remove the hardcoded text first to ensure it's blank before typing
        taglineElement.innerHTML = '';

        function typeChar() {
            if (i < taglineHTML.length) {
                let char = taglineHTML.charAt(i);

                // Handle HTML tags so they are typed instantly without sound
                if (char === '<') {
                    let fullTag = "";
                    while (taglineHTML.charAt(i) !== '>' && i < taglineHTML.length) {
                        fullTag += taglineHTML.charAt(i);
                        i++;
                    }
                    fullTag += '>'; // add the closing bracket
                    currentHTML += fullTag;
                    i++; // move past closing bracket
                    taglineElement.innerHTML = currentHTML + '<span class="cursor">|</span>';
                    setTimeout(typeChar, 10); // Tiny delay for HTML
                    return;
                }

                currentHTML += char;
                taglineElement.innerHTML = currentHTML + '<span class="cursor">|</span>';

                // Play sound precisely as DOM updates (skip some spaces naturally)
                if (char !== ' ' || Math.random() > 0.8) {
                    playSound('type');
                }

                i++;

                // Typing speed - faster for a hacker feel
                let speed = Math.random() * 30 + 15;
                setTimeout(typeChar, speed);
            } else {
                taglineElement.innerHTML = currentHTML; // Finished
            }
        }

        // Ensure AudioContext is running before trying to type automatically 
        initAudio();
        // Give a slight delay before typing starts to sound like someone sitting down to type.
        setTimeout(typeChar, 1000);
    }

    // --- Set current year in footer ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Navbar & Parallax Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    const heroImage = document.querySelector('.hero-image-wrapper');
    const glitchText = document.querySelector('.glitch');

    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;

        // Navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Parallax Effect
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        if (glitchText) {
            glitchText.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            // Very simple toggle for mobile menu display
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 5, 5, 0.95)';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.padding = '2rem 0';
            }
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                if (window.innerWidth <= 992 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none'; // Close menu on click
                }
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('active');

            // Special case for skill bars: trigger width animation when in view
            if (entry.target.classList.contains('skills-dsa')) {
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.transition = 'width 1.5s ease-in-out';
                        bar.style.width = width;
                    }, 300);
                });
            }

            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Particle Canvas Background Animation ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray;

    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    // Particle Object
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = 'rgba(0, 240, 255, 0.4)'; // Cyber blue
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Connect close particles with lines
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(138, 43, 226, ${Math.max(0, opacityValue * 0.2)})`; // Purple lines
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Init Particles
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;

        // Cap particles to avoid performance issues
        if (numberOfParticles > 100) numberOfParticles = 100;

        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }

        connect();
        requestAnimationFrame(animate);
    }

    // Start particle engine
    init();
    animate();

    // --- Contact Form Submission handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            // Simulate network request
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                btn.style.background = '#4ade80';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

});
