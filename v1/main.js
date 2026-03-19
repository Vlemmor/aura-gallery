document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initial Loader Animation
    const tlLoader = gsap.timeline();
    tlLoader.to('.loader-content', {
        opacity: 0,
        duration: 1,
        delay: 1.5
    })
    .to('.loader', {
        height: 0,
        duration: 1.2,
        ease: 'expo.inOut'
    }, "-=0.2")
    .from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 1
    })
    .to('.reveal-text', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power4.out'
    }, "-=0.5")
    .to('.reveal-text-sub', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    }, "-=0.8")
    .from('.hero-bg-image', {
        scale: 1.2,
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true
    }, "<");

    // Scroll Animations
    gsap.utils.toArray('.artist-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
            },
            y: 100,
            opacity: 0,
            duration: 1.5,
            delay: i * 0.2,
            ease: 'expo.out'
        });
    });

    // Gallery Dynamic Content
    const galleryItems = [
        { title: "Vórtice de Oro", artist: "Julian Voss", img: "assets/art1.png", style: "Abstracto" },
        { title: "Silencio de Mármol", artist: "Elena Rossi", img: "assets/art2.png", style: "Escultura" }
    ];

    const artistsGrid = document.querySelector('.artists-grid');
    if (artistsGrid) {
        galleryItems.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('artist-card');
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="card-overlay">
                        <span class="view-btn">Ver Detalle</span>
                    </div>
                </div>
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p>${item.artist} | ${item.style}</p>
                </div>
            `;
            artistsGrid.appendChild(card);
        });
    }

    // AI Curator Interaction
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');

    if (sendBtn && userInput && chatWindow) {
        const responses = {
            greeting: "Es un honor asistirle. Buscamos piezas que no solo decoren, sino que trasciendan. ¿Tiene alguna preferencia por materiales como el oro, el mármol o quizás el lienzo tradicional?",
            oro: "Excelente elección. El oro en el arte contemporáneo simboliza la permanencia. Tenemos una pieza de Julian Voss, 'Vórtice de Oro', que utiliza pan de oro de 24 quilates sobre una base de obsidiana. ¿Desea ver los detalles técnicos?",
            mármol: "El mármol evoca la eternidad clásica. Elena Rossi ha redefinido el minimalismo con su serie de figuras en mármol de Carrara. 'Silencio de Mármol' es su obra más cotizada actualmente.",
            default: "Entiendo su visión. Permítame filtrar nuestra colección privada para mostrarle lo más exclusivo que se ajuste a su perfil de coleccionista."
        };

        const addMessage = (text, sender) => {
            const msg = document.createElement('div');
            msg.classList.add('message', sender);
            msg.innerText = text;
            chatWindow.appendChild(msg);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        };

        sendBtn.addEventListener('click', () => {
            const text = userInput.value.toLowerCase();
            if (!text) return;

            addMessage(userInput.value, 'user');
            userInput.value = '';

            setTimeout(() => {
                let response = responses.default;
                if (text.includes("hola") || text.includes("buen")) response = responses.greeting;
                else if (text.includes("oro")) response = responses.oro;
                else if (text.includes("mármol") || text.includes("marmol")) response = responses.mármol;
                
                addMessage(response, 'system');
            }, 800);
        });

        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendBtn.click();
        });
    }
});
