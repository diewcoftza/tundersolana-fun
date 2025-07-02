const container = document.getElementById("lightning-container");
const lightningImages = ["assets/tunder22.png", "assets/tunder2.png"];
const sound = new Audio("assets/thunderstorm-ambiance-191991.mp3");

// สร้างสายฟ้าแบบสุ่ม
function spawnLightning() {
  const lightning = document.createElement("img");
  const randomImage = lightningImages[Math.floor(Math.random() * lightningImages.length)];
  lightning.src = randomImage;
  lightning.className = "lightning";

  lightning.style.top = Math.random() * window.innerHeight + "px";
  lightning.style.left = Math.random() * window.innerWidth + "px";

  if (container) {
    container.appendChild(lightning);
    setTimeout(() => {
      if (container.contains(lightning)) {
        container.removeChild(lightning);
      }
    }, 2000);
  }
}

// เล่นเสียงแบบสุ่ม
function playSoundRandomly() {
  sound.currentTime = 0;
  sound.play().catch((err) => {
    console.warn("ไม่สามารถเล่นเสียงได้: ", err);
  });

  setTimeout(() => {
    sound.pause();
  }, 5000);

  const delays = [20000, 25000, 30000];
  const nextDelay = delays[Math.floor(Math.random() * delays.length)];
  setTimeout(playSoundRandomly, nextDelay);
}

// กำหนดความถี่สายฟ้าให้เหมาะกับอุปกรณ์
function getLightningInterval() {
  if (window.matchMedia("(max-width: 600px)").matches) {
    return 8000;
  }
  return 5000;
}

// เริ่มทำงานเมื่อโหลดหน้า
window.addEventListener("DOMContentLoaded", () => {
  setInterval(spawnLightning, getLightningInterval());

  const startSoundOnce = () => {
    playSoundRandomly();
    window.removeEventListener("click", startSoundOnce);
    window.removeEventListener("touchstart", startSoundOnce);
  };

  window.addEventListener("click", startSoundOnce);
  window.addEventListener("touchstart", startSoundOnce);
});
