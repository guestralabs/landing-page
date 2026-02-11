/*
    File: script.js
    Deskripsi: Mengelola interaksi UI, animasi GSAP, dan logika LocalStorage Guestra.
*/

document.addEventListener("DOMContentLoaded", (event) => {
    // --- 1. GSAP Animations Setup ---
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Animation: Slide down dari atas
    gsap.from("#navbar", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    });

    // Hero Content Animation: Muncul bertahap (Staggered)
    const tlHero = gsap.timeline();
    tlHero.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 })
          .from(".hero-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
          .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
          .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(".hero-image", { x: 50, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.8");

    // Benefits Section Animation: Kartu muncul satu per satu saat di-scroll
    gsap.from(".benefit-card", {
        scrollTrigger: {
            trigger: "#manfaat",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Features Section Animation
    gsap.from(".feature-item", {
        scrollTrigger: {
            trigger: "#fitur",
            start: "top 75%",
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power1.out"
    });
});

// --- 2. Mobile Menu Logic ---
// Note: Kode hamburger menu lama telah dihapus karena diganti bottom navbar CSS-based

// --- 3. Guest Book Demo Logic (LocalStorage) ---
const guestForm = document.getElementById('guestForm');
const guestList = document.getElementById('guestList');
const emptyState = document.getElementById('emptyState');

// Load data saat aplikasi dimulai
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

        // Save to LocalStorage
        let guests = JSON.parse(localStorage.getItem('guestra_guests')) || [];
        guests.unshift(guest); // Add to top
        localStorage.setItem('guestra_guests', JSON.stringify(guests));

        // UI Feedback & Render
        renderGuest(guest, true); // true = animate entry
        
        // Reset Form
        guestForm.reset();
        
        // Simple toast notification (feedback tombol)
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
    // Remove empty state if exists
    if (document.getElementById('emptyState')) {
        document.getElementById('emptyState').remove();
    }

    // Determine badge color
    let badgeColor = 'bg-blue-500';
    if(guest.category === 'VIP') badgeColor = 'bg-yellow-500';
    if(guest.category === 'Keluarga') badgeColor = 'bg-green-500';
    if(guest.category === 'Media') badgeColor = 'bg-purple-500';

    const div = document.createElement('div');
    // Note: animate-new-item class can be added in CSS if preferred, or handled by GSAP below
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
        // GSAP animation for new item entering the DOM
        guestList.prepend(div);
        gsap.from(div, { x: -20, opacity: 0, duration: 0.5, ease: "back.out" });
    } else {
        guestList.appendChild(div);
    }
}

// Fungsi global agar bisa dipanggil via onclick di HTML
window.clearData = function() {
    if(confirm('Hapus semua data tamu simulasi?')) {
        localStorage.removeItem('guestra_guests');
        if (guestList && emptyState) {
            guestList.innerHTML = '';
            guestList.appendChild(emptyState);
        }
    }
}