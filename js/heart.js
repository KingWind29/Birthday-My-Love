/* heart.js */
const canvas = document.getElementById('pinkboard');
const context = canvas.getContext('2d');

// Cấu hình trái tim
const settings = {
    particles: { length: 1500, duration: 2, velocity: 80, effect: -0.75, size: 13 },
};

class Point {
    constructor(x, y) { this.x = x || 0; this.y = y || 0; }
    clone() { return new Point(this.x, this.y); }
    length(l) {
        if (typeof l == 'undefined') return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize(); this.x *= l; this.y *= l; return this;
    }
    normalize() {
        let l = this.length();
        this.x /= l; this.y /= l; return this;
    }
}

class Particle {
    constructor() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
    }
    initialize(x, y, dx, dy) {
        this.position.x = x; this.position.y = y;
        this.velocity.x = dx; this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
    }
    update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
    }
    draw(context, image) {
        const ease = (t) => (--t) * t * t + 1;
        let size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
    }
}

class ParticlePool {
    constructor(length) {
        this.particles = new Array(length);
        for (let i = 0; i < length; i++) this.particles[i] = new Particle();
        this.firstActive = 0; this.firstFree = 0;
    }
    add(x, y, dx, dy) {
        this.particles[this.firstFree].initialize(x, y, dx, dy);
        this.firstFree++;
        if (this.firstFree == this.particles.length) this.firstFree = 0;
        if (this.firstActive == this.firstFree) this.firstActive++;
        if (this.firstActive == this.particles.length) this.firstActive = 0;
    }
    update(dt) {
        let i;
        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++) this.particles[i].update(dt);
        } else if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++) this.particles[i].update(dt);
            for (i = 0; i < this.firstFree; i++) this.particles[i].update(dt);
        }
        while (this.particles[this.firstActive].age >= settings.particles.duration && this.firstActive != this.firstFree) {
            this.firstActive++;
            if (this.firstActive == this.particles.length) this.firstActive = 0;
        }
    }
    draw(ctx, img) {
        let i;
        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++) this.particles[i].draw(ctx, img);
        } else if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++) this.particles[i].draw(ctx, img);
            for (i = 0; i < this.firstFree; i++) this.particles[i].draw(ctx, img);
        }
    }
}

const particles = new ParticlePool(settings.particles.length);
let time;

// Vẽ trái tim nhỏ làm hạt
const heartImage = (function() {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    c.width = settings.particles.size;
    c.height = settings.particles.size;
    ctx.beginPath();
    for (let t = -Math.PI; t < Math.PI; t += 0.1) {
        let x = 8 + 7 * Math.pow(Math.sin(t), 3);
        let y = 7 - (6 * Math.cos(t) - 2.5 * Math.cos(2*t) - Math.cos(3*t) - 0.5 * Math.cos(4*t));
        ctx.lineTo(x * (settings.particles.size/16), y * (settings.particles.size/16));
    }
    ctx.fillStyle = '#ff3a6f';
    ctx.fill();
    const img = new Image(); img.src = c.toDataURL();
    return img;
})();

function pointOnHeart(t) {
    // scale tùy chỉnh theo màn hình
    const scale = Math.min(canvas.width, canvas.height) / 35;
    return new Point(
        16 * Math.pow(Math.sin(t), 3) * scale,
        (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * -scale
    );
}

function render() {
    requestAnimationFrame(render);
    const newTime = new Date().getTime() / 1000;
    const dt = newTime - (time || newTime);
    time = newTime;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const amount = (settings.particles.length / settings.particles.duration) * dt;
    for (let i = 0; i < amount; i++) {
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().length(settings.particles.velocity);
        particles.add(canvas.width / 2 + pos.x, canvas.height / 2 + pos.y, dir.x, dir.y);
    }
    particles.update(dt);
    particles.draw(context, heartImage);
}

// FIX: Quan trọng nhất - Luôn lấy kích thước thực của cửa sổ
function resize() {
    canvas.width = canvas.clientWidth; // Lấy kích thước thực tế của thẻ canvas
    canvas.height = canvas.clientHeight;
}

window.addEventListener('resize', resize);
setTimeout(resize, 100);
render();