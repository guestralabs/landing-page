/*
    File: script.js
    Deskripsi: Mengelola interaksi UI, animasi GSAP, dan logika LocalStorage Guestra.
*/

document.addEventListener("DOMContentLoaded", (event) => {
    // --- 1. GSAP Animations Setup ---
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Animation
    gsap.from("#navbar", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    });

    // Hero Content Animation
    const tlHero = gsap.timeline();
    tlHero.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 })
          .from(".hero-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
          .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
          .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(".hero-image", { x: 50, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.8");

    // --- NEW: Elegant Cards Staggered Animation & 3D Tilt ---
    
    // 1. Entrance Animation (Stagger)
    gsap.from(".elegant-card", {
        scrollTrigger: {
            trigger: "#manfaat",
            start: "top 80%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // 2. 3D Tilt Effect on Hover (Desktop Only)
    const elegantCards = document.querySelectorAll('.elegant-card');
    if (window.matchMedia("(min-width: 768px)").matches) {
        elegantCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5deg
                const rotateY = ((x - centerX) / centerX) * 5;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    ease: "power1.out",
                    duration: 0.5
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    ease: "power3.out",
                    duration: 0.5
                });
            });
        });
    }

    // --- Bento Grid Spotlight & Stagger ---
    const bentoGrid = document.getElementById('bento-grid');
    if (bentoGrid) {
        const bentoCards = bentoGrid.querySelectorAll('.bento-card');
        
        // Spotlight Effect
        bentoGrid.addEventListener('mousemove', (e) => {
            bentoCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });
        });

        // Stagger Animation
        gsap.from(".bento-card", {
            scrollTrigger: {
                trigger: "#fitur",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
});

// --- 2. Guest Book Demo Logic (LocalStorage) ---
const guestForm = document.getElementById('guestForm');
const guestList = document.getElementById('guestList');
const emptyState = document.getElementById('emptyState');

if (guestList) {
    loadGuests();
}

if (guestForm) {
    guestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('guestName');
        const categoryInput = document.getElementById('guestCategory');
        const paxInput = document.getElementById('guestPax');

        const name = nameInput.value;
        const category = categoryInput.value;
        const pax = paxInput.value;
        const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        const guest = { id: Date.now(), name, category, pax, time };

        let guests = JSON.parse(localStorage.getItem('guestra_guests')) || [];
        guests.unshift(guest); 
        localStorage.setItem('guestra_guests', JSON.stringify(guests));

        renderGuest(guest, true); 
        
        guestForm.reset();
        
        const btnSubmit = guestForm.querySelector('button');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = `<i class="fas fa-check"></i> Sukses!`;
        btnSubmit.classList.remove('bg-brand-600');
        btnSubmit.classList.add('bg-green-500');
        
        setTimeout(() => {
            btnSubmit.innerHTML = originalText;
            btnSubmit.classList.add('bg-brand-600');
            btnSubmit.classList.remove('bg-green-500');
        }, 2000);
    });
}

function loadGuests() {
    const guests = JSON.parse(localStorage.getItem('guestra_guests')) || [];
    guestList.innerHTML = '';
    
    if (guests.length === 0) {
        guestList.appendChild(emptyState);
    } else {
        guests.forEach(guest => renderGuest(guest, false));
    }
}

function renderGuest(guest, animate) {
    if (document.getElementById('emptyState')) {
        document.getElementById('emptyState').remove();
    }

    let badgeColor = 'bg-blue-500';
    if(guest.category === 'VIP') badgeColor = 'bg-yellow-500';
    if(guest.category === 'Keluarga') badgeColor = 'bg-green-500';
    if(guest.category === 'Media') badgeColor = 'bg-purple-500';

    const div = document.createElement('div');
    div.className = `bg-white/10 p-3 rounded-lg flex justify-between items-center border border-white/10`;
    
    div.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase">
                ${guest.name.charAt(0)}
            </div>
            <div>
                <p class="font-semibold text-white text-sm">${guest.name}</p>
                <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${badgeColor}">${guest.category}</span>
            </div>
        </div>
        <div class="text-right">
            <p class="text-blue-200 text-xs font-mono">${guest.time}</p>
            <p class="text-white text-xs font-bold">${guest.pax} Pax</p>
        </div>
    `;

    if (animate) {
        guestList.prepend(div);
        gsap.from(div, { x: -20, opacity: 0, duration: 0.5, ease: "back.out" });
    } else {
        guestList.appendChild(div);
    }
}

window.clearData = function() {
    if(confirm('Hapus semua data tamu simulasi?')) {
        localStorage.removeItem('guestra_guests');
        if (guestList && emptyState) {
            guestList.innerHTML = '';
            guestList.appendChild(emptyState);
        }
    }
}