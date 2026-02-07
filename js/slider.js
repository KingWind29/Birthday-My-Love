// slider.js
function setHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.getElementById('app').style.height = `${window.innerHeight}px`;
}

window.addEventListener('resize', setHeight);
window.addEventListener('orientationchange', setHeight);
setHeight();

const slides = document.querySelectorAll(".slide");
let current = 0;
const DURATION = 8000;
let slideInterval;

function showSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
    current = index;

    // QUAN TRỌNG: Nếu là slide cuối cùng, dừng tự động chuyển trang
    if (current === slides.length - 1) {
        stopInterval();
        console.log("Đã đến slide cuối, dừng tự động chuyển để mở quà.");
    }
}

function nextSlide() {
    let next = (current + 1) % slides.length;
    showSlide(next);
}

function prevSlide() {
    let prev = (current - 1 + slides.length) % slides.length;
    showSlide(prev);
}

function startInterval() {
    stopInterval();
    slideInterval = setInterval(nextSlide, DURATION);
}

function stopInterval() {
    clearInterval(slideInterval);
}

// Khởi tạo vòng lặp ban đầu
startInterval();

// --- Xử lý Vuốt (Swipe) ---
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (Math.abs(touchStartX - touchEndX) > 50) {
        if (touchStartX - touchEndX > 50) nextSlide();
        else prevSlide();
        // Nếu người dùng vuốt thủ công và không phải slide cuối, khởi động lại timer
        if (current !== slides.length - 1) startInterval();
    }
}, false);

// --- Xử lý Âm thanh ---
const music = document.getElementById("bgm");
function handleMusic() {
    if (music && music.paused) {
        music.play();
        let v = 0;
        const fade = setInterval(() => {
            if (v < 0.6) {
                v += 0.02;
                music.volume = Math.min(v, 0.6);
            } else {
                clearInterval(fade);
            }
        }, 150);
    }
}
document.addEventListener('click', handleMusic, { once: true });
document.addEventListener('touchstart', handleMusic, { once: true });

// --- Các hiệu ứng trang trí ---
function createStars() {
    const s2 = document.querySelector('#s2');
    if (!s2) return;
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'star-dust';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');
        star.style.setProperty('--delay', Math.random() * 5 + 's');
        s2.appendChild(star);
    }
}
createStars();


function createSparkles() {
  const s3b = document.getElementById('s3b');
  for (let i = 0; i < 50; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.width = Math.random() * 3 + 'px';
    sparkle.style.height = sparkle.style.width;
    sparkle.style.backgroundColor = '#fff';
    sparkle.style.borderRadius = '50%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.opacity = Math.random();
    sparkle.style.filter = 'blur(1px)';
    
    // Hiệu ứng lấp lánh
    sparkle.animate([
      { opacity: 0, transform: 'scale(0)' },
      { opacity: 0.8, transform: 'scale(1.2)' },
      { opacity: 0, transform: 'scale(0)' }
    ], {
      duration: Math.random() * 3000 + 2000,
      iterations: Infinity,
      delay: Math.random() * 5000
    });
    
    s3b.appendChild(sparkle);
  }
}
createSparkles();