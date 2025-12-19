const shark = document.querySelector('.shark');
const soup = document.querySelector('.soup-svg');
const nourishmentCountEl = document.getElementById('nourishment-count');
let nourishmentCount = 0;
let popupShown = false;
let finishPopupShown = false;

// --- Soup random movement ---
let soupTargetX = 0;
let soupTargetY = 0;
let soupCurrentX = 0;
let soupCurrentY = 0;
const soupW = 120;
const soupH = 120;

function moveSoupRandomly() {
  // Pick a new random position, favoring more left/right movement
  const maxX = window.innerWidth - soupW;
  const maxY = window.innerHeight - soupH;
  // More likely to move left/right: pick X from full range, Y from a smaller range
  soupTargetX = Math.random() * maxX;
  soupTargetY = (Math.random() * 0.7 + 0.15) * maxY; // keep away from very top/bottom
  soup.style.transform = `translate(${soupTargetX}px, ${soupTargetY}px)`;
  setTimeout(moveSoupRandomly, 1500 + Math.random() * 700);
}

if (soup) {
  setTimeout(moveSoupRandomly, 1000);
}
let lastX = window.innerWidth / 2;
let targetX = window.innerWidth / 2;
let targetY = 80;
let currentX = window.innerWidth / 2;
let currentY = 80;
let soupHidden = false;

// Handle mouse movement
document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

// Handle touch movement
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    targetX = e.touches[0].clientX;
    targetY = e.touches[0].clientY;
  }
});

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function updateShark() {
  // Smooth interpolation factor (0.1 = slower, smoother movement)
  const smoothFactor = 0.08;
  
  // Interpolate position toward target
  currentX = lerp(currentX, targetX, smoothFactor);
  currentY = lerp(currentY, targetY, smoothFactor);
  
  // Calculate position relative to viewport
  let leftPercent = (currentX / window.innerWidth) * 100;
  
  // Clamp the value between 5% and 85% to keep shark visible
  leftPercent = Math.max(5, Math.min(85, leftPercent));
  
  // Clamp vertical position
  let clampedY = Math.max(50, Math.min(currentY, window.innerHeight - 100));
  
  // Update shark position
  shark.style.left = leftPercent + '%';
  shark.style.top = clampedY + 'px';
  
  // Flip shark based on direction of movement
  if (currentX < lastX) {
    // Moving left - flip shark to face left
    shark.style.transform = 'scaleX(-1)';
  } else if (currentX > lastX) {
    // Moving right - shark faces right
    shark.style.transform = 'scaleX(1)';
  }
  lastX = currentX;

  // Collision detection with soup bowl
  if (soup && !soupHidden) {
    const sharkRect = shark.getBoundingClientRect();
    const soupRect = soup.getBoundingClientRect();
    const overlap = !(
      sharkRect.right < soupRect.left ||
      sharkRect.left > soupRect.right ||
      sharkRect.bottom < soupRect.top ||
      sharkRect.top > soupRect.bottom
    );
    if (overlap) {
      soup.style.visibility = 'hidden';
      soupHidden = true;
      nourishmentCount++;
      if (nourishmentCountEl) nourishmentCountEl.textContent = nourishmentCount;
      // First popup
      if (!popupShown && nourishmentCount === 1) {
        popupShown = true;
        const popup = document.getElementById('shark-popup');
        if (popup) {
          popup.classList.add('show');
          const btn = document.getElementById('shark-popup-btn');
          if (btn) {
            btn.onclick = () => {
              popup.classList.remove('show');
            };
          }
        }
      }
      // Finish popup
      if (!finishPopupShown && nourishmentCount === 10) {
        finishPopupShown = true;
        const popup = document.getElementById('shark-popup-finish');
        if (popup) {
          popup.classList.add('show');
          const btn = document.getElementById('shark-popup-finish-btn');
          if (btn) {
            btn.onclick = () => {
              popup.classList.remove('show');
              // You can add a redirect or treat logic here
            };
          }
        }
      }
      setTimeout(() => {
        soup.style.visibility = 'visible';
        soupHidden = false;
        moveSoupRandomly(); // Immediately move after reappearing
      }, 3000);
    }
  }

  // Continue animation loop
  requestAnimationFrame(updateShark);
}

// Start the animation loop
updateShark();