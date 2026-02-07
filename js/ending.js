// Khai báo các biến
const endSection = document.getElementById("s4");
const lixiWrapper = document.getElementById('lixi-wrapper');
const lixiCard = document.getElementById('lixi-card');
const luckyAmountDisplay = document.getElementById('lucky-amount');
const rewardNotify = document.getElementById('reward-notification');
const appElement = document.getElementById('app'); // Đã thêm khai báo này

const luckyNumbers = [
  "170.298đ", "130.925đ", "88.888đ", "686.860đ",
  "290.602đ", "99.999đ", "1.234.567đ"
];

// 1. Theo dõi khi Slide 4 được kích hoạt
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.classList.contains('active')) {
      setTimeout(() => {
        lixiWrapper.classList.add('show');
      }, 4000);
    } else {
        // Nếu chuyển slide khác thì ẩn lì xì đi để reset
        lixiWrapper.classList.remove('show');
        lixiCard.classList.remove('open');
        rewardNotify.classList.remove('show-reward');
    }
  });
});

observer.observe(endSection, { attributes: true });

// 2. Xử lý khi click vào bao lì xì
lixiCard.addEventListener('click', function () {
  if (!this.classList.contains('open')) {
    // Chọn số tiền ngẫu nhiên
    const amount = luckyNumbers[Math.floor(Math.random() * luckyNumbers.length)];
    luckyAmountDisplay.innerText = amount;
    document.getElementById('reward-amount').innerText = amount;

    // Mở bao lì xì
    this.classList.add('open');
    
    // Rung màn hình
    appElement.classList.add('shake-ani');
    setTimeout(() => appElement.classList.remove('shake-ani'), 500);

    // Ẩn hướng dẫn
    const hint = document.querySelector('.tap-hint');
    if(hint) hint.style.opacity = '0';

    // Tạo tim bay
    createHeartExplosion();

    // Hiển thị thông báo tiền sau 0.6s
    setTimeout(() => {
      rewardNotify.classList.add('show-reward');

      // Tự động quay lại slide đầu sau 10s (Tùy chọn)
      setTimeout(() => {
          if(typeof showSlide === "function") {
              showSlide(0); 
              if(typeof startInterval === "function") startInterval();
          }
      }, 10000); 

    }, 600);
  }
});

// 3. Hàm tạo mưa trái tim
function createHeartExplosion() {
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'temp-heart';
    heart.style.position = 'absolute';
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.zIndex = '300';
    lixiWrapper.appendChild(heart);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 10 + 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    let posX = 0;
    let posY = 0;
    let opacity = 1;

    const moveHeart = setInterval(() => {
      posX += vx;
      posY += vy;
      posY += 0.5; 
      opacity -= 0.02;
      heart.style.transform = `translate(${posX}px, ${posY}px) rotate(${posX}deg)`;
      heart.style.opacity = opacity;
      if (opacity <= 0) {
        clearInterval(moveHeart);
        heart.remove();
      }
    }, 20);
  }
}

// 4. Tạo các đốm sáng trang trí nền slide 4
function createSparkles() {
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    const size = Math.random() * 4;
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.animationDelay = Math.random() * 5 + "s";
    endSection.appendChild(s);
  }
}
createSparkles();