document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LENIS SMOOTH SCROLL ---
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: true, // Enable for better mobile feel
        touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // --- 2. CINEMATIC PRELOADER ---
    const tlPreloader = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
            initIntroAnimations();
        }
    });

    tlPreloader.to('.preloader-logo', { opacity: 1, duration: 1.5, ease: 'power2.inOut' })
               .to('.preloader-progress', { width: '100%', duration: 1.5, ease: 'power2.inOut' }, "-=0.5")
               .to('.preloader', { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, "+=0.2");


    // --- 3. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorFollower = document.querySelector('.cursor-follower');
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant dot attach
        gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0 });
        // Trailing follower
        gsap.to(cursorFollower, { x: mouseX, y: mouseY, duration: 0.6, ease: 'power3.out' });
    });

    magneticBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => cursorFollower.classList.add('hover-active'));
        btn.addEventListener('mouseleave', () => {
             cursorFollower.classList.remove('hover-active');
             // Reset magnetic button position
             gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        });

        // --- 4. MAGNETIC BUTTON EFFECT ---
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Pull the button towards mouse
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
            
            // Text/Icon inside the button moves a bit more for parallax feeling
            const spanText = btn.querySelector('.btn-text');
            const icon = btn.querySelector('.btn-icon');
            if(spanText) gsap.to(spanText, { x: x * 0.15, y: y * 0.15, duration: 0.4 });
            if(icon) gsap.to(icon, { x: x * 0.2, y: y * 0.2, duration: 0.4 });
        });
    });


    // --- 5. KINETIC TYPOGRAPHY (SPLIT TYPE) ---
    // Only split elements without the split-text class if using a different class name
    const splitTexts = document.querySelectorAll('.split-text');
    
    splitTexts.forEach(el => {
        // Run SplitType to break lines/words/chars
        const split = new SplitType(el, { types: 'lines, words, chars' });
        
        // Wrap characters to allow mask reveals
        split.chars.forEach(char => {
            const wrapper = document.createElement('span');
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'bottom';
            // Insert wrapper before char, move char inside wrapper
            char.parentNode.insertBefore(wrapper, char);
            wrapper.appendChild(char);
            
            // Set initial state for char
            gsap.set(char, { yPercent: 100, display: 'inline-block' });
        });

        // Setup ScrollTrigger for each text block
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(split.chars, {
                    yPercent: 0,
                    duration: 1.2,
                    ease: 'power4.out',
                    stagger: 0.02
                });
            }
        });
    });


    // --- 6. ADVANCED PARALLAX (ScrollTrigger) ---
    gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.fromTo(img, 
            { yPercent: -10 },
            {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.parentElement,
                    scrub: true,
                    start: 'top bottom',
                    end: 'bottom top'
                }
            }
        );
    });

    // Sub-elements fade up
    gsap.utils.toArray('.fade-up').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
        });
    });


    // --- 7. OVERLAY & HERO EFFECTS ---
    function initIntroAnimations() {
        // Hero image slight pan out
        gsap.from('.hero-video-wrapper', {
            scale: 1.1,
            duration: 3,
            ease: 'power2.out'
        });
        
        // Stagger hero UI if it has chars
        const heroTitleChars = document.querySelectorAll('.hero-content .char');
        if (heroTitleChars.length) {
            gsap.to(heroTitleChars, {
                yPercent: 0,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.02,
                delay: 0.2
            });
        }
    }

    // Navbar hiding on scroll down, showing on scroll up
    let lastScrollY = window.scrollY;
    const navbarItem = document.getElementById('navbar');
    
    // Using lenis callback instead of window event for smoothness
    lenis.on('scroll', (e) => {
        const currentScrollY = window.scrollY;
        if(navbarItem) {
            // Apply background
            if (currentScrollY > 50) {
                navbarItem.classList.add('scrolled');
            } else {
                navbarItem.classList.remove('scrolled');
            }

            // Hide/Show on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                navbarItem.classList.add('hidden'); // Scroll down (hide)
            } else {
                navbarItem.classList.remove('hidden'); // Scroll up (show)
            }
        }
        lastScrollY = currentScrollY;
    });

});
