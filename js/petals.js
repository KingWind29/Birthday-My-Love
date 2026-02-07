const container = document.querySelector("#s1 .petals");
const petalTypes = ["🌸", "🏵️"]; // Hoa đào và hoa mai

for (let i = 0; i < 30; i++) { // Tăng lên 30 cánh cho dày hơn
  const p = document.createElement("div");
  p.className = "petal";
  
  // Lấy ngẫu nhiên hoa đào hoặc hoa mai
  p.innerHTML = petalTypes[Math.floor(Math.random() * petalTypes.length)];
  
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = 12 + Math.random() * 20 + "px";
  
  // Thời gian rơi ngẫu nhiên từ 5s đến 12s
  const duration = 5 + Math.random() * 7;
  p.style.animationDuration = duration + "s";
  
  // Độ trễ ngẫu nhiên để hoa không rơi cùng lúc
  p.style.animationDelay = Math.random() * 10 + "s";
  
  // Độ mờ ngẫu nhiên
  p.style.opacity = 0.5 + Math.random() * 0.5;

  container.appendChild(p);
}