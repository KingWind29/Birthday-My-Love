const fw = document.querySelector("#s1 .fireworks");
const ctx = fw.getContext("2d");
function resize() { fw.width = innerWidth; fw.height = innerHeight }
resize(); addEventListener("resize", resize);

class Firework {
  constructor() {
    this.x = Math.random() * fw.width;
    this.y = fw.height;
    // Điểm nổ ngẫu nhiên từ 10% đến 50% chiều cao màn hình
    this.ty = Math.random() * fw.height * .4 + fw.height * .1;
    this.v = Math.random() * 2 + 8; // Tốc độ bay lên nhanh hơn
    this.e = false; 
    this.p = [];
    this.c = `hsl(${Math.random() * 360}, 100%, 60%)`;
  }

  u() {
    if (!this.e) {
      this.y -= this.v;
      ctx.fillStyle = this.c;
      // Vẽ vệt đuôi khi bay lên
      ctx.fillRect(this.x, this.y, 2, 15);
      if (this.y <= this.ty) this.xp();
    } else {
      this.p.forEach((q, i) => {
        q.x += q.vx;
        q.y += q.vy;
        q.vy += 0.05; // Thêm trọng lực để hạt rơi nhẹ xuống
        q.vx *= 0.98; // Thêm lực cản không khí để nổ xòe ra rồi chậm lại
        q.vy *= 0.98;
        q.l--;

        ctx.globalAlpha = q.l / 100; // Mờ dần theo thời gian sống
        ctx.fillStyle = q.c;
        // Vẽ hạt pháo hoa to hơn (3x3)
        ctx.fillRect(q.x, q.y, 3, 3);

        if (q.l <= 0) this.p.splice(i, 1);
      });
    }
  }

  xp() {
    this.e = true;
    // Tăng số lượng hạt lên 180 để pháo nổ dày đặc
    const particleCount = 180; 
    for (let i = 0; i < particleCount; i++) {
      const a = Math.random() * Math.PI * 2;
      // Tăng s (speed) lên để pháo nở to hơn
      const s = Math.random() * 10 + 2; 
      this.p.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        l: Math.random() * 40 + 80, // Tăng thời gian sống (80-120 frames)
        c: this.c
      });
    }
  }
}

let fs = [];
(function loop() {
  // Thay đổi clearRect thành vẽ đè một lớp đen mờ để tạo hiệu ứng đuôi sáng (motion blur)
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, fw.width, fw.height);

  if (Math.random() < 0.04) fs.push(new Firework());
  
  fs.forEach((f, i) => {
    f.u();
    if (f.e && f.p.length === 0) fs.splice(i, 1);
  });
  requestAnimationFrame(loop);
})();