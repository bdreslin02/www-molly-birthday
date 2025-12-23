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
  const maxX = window.innerWidth - soupW;
  const maxY = window.innerHeight - soupH;
  // Add more randomness: sometimes big jumps, sometimes small, sometimes diagonal, sometimes just X or Y
  let nextX, nextY;
  if (isMobile()) {
    // On mobile, favor more erratic jumps and directions
    if (Math.random() < 0.5) {
      // Big jump
      nextX = Math.random() * maxX;
      nextY = Math.random() * maxY;
    } else {
      // Small jump near current
      nextX = Math.min(maxX, Math.max(0, soupTargetX + (Math.random() - 0.5) * maxX * 0.6));
      nextY = Math.min(maxY, Math.max(0, soupTargetY + (Math.random() - 0.5) * maxY * 0.6));
    }
    // Occasionally move only X or Y
    if (Math.random() < 0.3) nextX = Math.random() * maxX;
    if (Math.random() < 0.3) nextY = Math.random() * maxY;
  } else {
    // Desktop: keep some randomness but less erratic
    nextX = Math.random() * maxX;
    nextY = (Math.random() * 0.7 + 0.15) * maxY;
  }
  soupTargetX = nextX;
  soupTargetY = nextY;
  soup.style.transition = 'transform 1.1s cubic-bezier(0.7,0.2,0.2,1)';
  soup.style.transform = `translate(${soupTargetX}px, ${soupTargetY}px)`;
  setTimeout(() => {
    soup.style.transition = '';
    moveSoupRandomly();
  }, 900 + Math.random() * 1200);
}
if (soup) {
  // Hide soup initially, then show and start moving after cake/candle drop (4.3s)
  soup.style.visibility = 'hidden';
  setTimeout(() => {
    if (isMobile()) {
      // Place soup at bottom center, animate up, then start random movement
      const startX = (window.innerWidth - soupW) / 2;
      const startY = window.innerHeight - soupH - 10;
      soup.style.transform = `translate(${startX}px, ${startY}px)`;
      soup.style.visibility = 'visible';
      // Animate up to a visible position (e.g., 70% height)
      setTimeout(() => {
        const midY = window.innerHeight * 0.7;
        soup.style.transition = 'transform 0.7s cubic-bezier(0.68,-0.55,0.27,1.55)';
        soup.style.transform = `translate(${startX}px, ${midY}px)`;
        setTimeout(() => {
          soup.style.transition = '';
          moveSoupRandomly();
        }, 700);
      }, 100);
    } else {
      soup.style.visibility = 'visible';
      moveSoupRandomly();
    }
  }, 4300);
}
let lastX = window.innerWidth / 2;
let targetX = window.innerWidth / 2;
let targetY = 80;
let currentX = window.innerWidth / 2;
let currentY = 80;
let soupHidden = false;
// Tooltip for source code button (mobile tap support)
document.addEventListener('DOMContentLoaded', function() {
  var tooltipIcon = document.getElementById('source-tooltip-icon');
  var tooltipPopup = document.getElementById('source-tooltip-popup');
  if (tooltipIcon && tooltipPopup) {
    // Desktop: show on hover
    tooltipIcon.addEventListener('mouseenter', function() {
      tooltipPopup.style.display = 'block';
    });
    tooltipIcon.addEventListener('mouseleave', function() {
      tooltipPopup.style.display = 'none';
    });
    // Mobile: show on touch
    tooltipIcon.addEventListener('touchstart', function(e) {
      e.stopPropagation();
      if (tooltipPopup.style.display === 'block') {
        tooltipPopup.style.display = 'none';
      } else {
        tooltipPopup.style.display = 'block';
      }
    });
    // Hide tooltip if tap elsewhere on mobile
    document.body.addEventListener('touchstart', function(e) {
      if (!tooltipIcon.contains(e.target)) {
        tooltipPopup.style.display = 'none';
      }
    });
  }
});
// Detect mobile device
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
let tiltEnabled = false;
function setupTiltControls() {
  if (!window.DeviceOrientationEvent) return;
  window.addEventListener('deviceorientation', (event) => {
    if (!tiltEnabled) return;
    const gamma = event.gamma || 0; // left/right
    const beta = event.beta || 0;   // up/down
    // Map gamma to X position
    const minGamma = -45, maxGamma = 45;
    const minX = 0, maxX = window.innerWidth;
    targetX = ((gamma - minGamma) / (maxGamma - minGamma)) * (maxX - minX) + minX;
    // Map beta to Y position (limit range for comfort)
    const minBeta = 20, maxBeta = 70;
    const minY = 40, maxY = window.innerHeight - 100;
    let mappedY = ((beta - minBeta) / (maxBeta - minBeta)) * (maxY - minY) + minY;
    mappedY = Math.max(minY, Math.min(maxY, mappedY));
    targetY = mappedY;
  });
}
if (isMobile() && window.DeviceOrientationEvent) {
  // Show overlay and request permission on iOS 13+ AFTER cake/candle drop (4.3s)
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const overlay = document.getElementById('tilt-permission-overlay');
      if (overlay) overlay.style.display = 'flex';
      const btn = document.getElementById('enable-tilt-btn');
      if (btn) {
        btn.onclick = function() {
          function enableTilt() {
            tiltEnabled = true;
            if (overlay) overlay.style.display = 'none';
          }
          if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then((response) => {
              if (response === 'granted') {
                enableTilt();
              } else {
                alert('Permission denied. Tilt controls will not work.');
              }
            }).catch(() => {
              alert('Permission denied. Tilt controls will not work.');
            });
          } else {
            enableTilt();
          }
        };
      }
    }, 4300); // Wait for cake/candle drop to finish
  });
  setupTiltControls();
} else {
  // Desktop fallback: mouse and touch
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      targetX = e.touches[0].clientX;
      targetY = e.touches[0].clientY;
    }
  });
}
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
  // Collision detection with soup bowl (smaller activation zone)
  if (soup && !soupHidden) {
    const sharkRect = shark.getBoundingClientRect();
    const soupRect = soup.getBoundingClientRect();
    // Use the center of the shark and a smaller central zone of the soup
    const sharkCenterX = (sharkRect.left + sharkRect.right) / 2;
    const sharkCenterY = (sharkRect.top + sharkRect.bottom) / 2;
    // Define a smaller activation zone (e.g., 40% width/height of soup)
    const zoneWidth = soupRect.width * 0.4;
    const zoneHeight = soupRect.height * 0.4;
    const zoneLeft = soupRect.left + (soupRect.width - zoneWidth) / 2;
    const zoneTop = soupRect.top + (soupRect.height - zoneHeight) / 2;
    const inZone =
      sharkCenterX > zoneLeft &&
      sharkCenterX < zoneLeft + zoneWidth &&
      sharkCenterY > zoneTop &&
      sharkCenterY < zoneTop + zoneHeight;
    if (inZone) {
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