const shark = document.querySelector('.shark');
let lastX = window.innerWidth / 2;
let targetX = window.innerWidth / 2;
let targetY = 80;
let currentX = window.innerWidth / 2;
let currentY = 80;

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
  
  // Continue animation loop
  requestAnimationFrame(updateShark);
}

// Start the animation loop
updateShark();

