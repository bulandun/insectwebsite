(() => {
  const revealSurface = document.querySelector('.cursor-reveal');

  if (!revealSurface) {
    return;
  }

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) {
    return;
  }

  const state = {
    targetX: 0.5,
    targetY: 0.5,
    currentX: 0.5,
    currentY: 0.5,
    intensity: 0,
    targetIntensity: 0,
    rafId: 0,
  };

  const positionToCss = () => {
    revealSurface.style.setProperty('--reveal-x', `${(state.currentX * 100).toFixed(2)}%`);
    revealSurface.style.setProperty('--reveal-y', `${(state.currentY * 100).toFixed(2)}%`);
    revealSurface.style.setProperty('--reveal-strength', state.intensity.toFixed(3));
  };

  const animate = () => {
    // Higher lagFactor = less lag, lower lagFactor = more trailing.
    const lagFactor = 0.12;
    const fadeFactor = 0.09;

    state.currentX += (state.targetX - state.currentX) * lagFactor;
    state.currentY += (state.targetY - state.currentY) * lagFactor;
    state.intensity += (state.targetIntensity - state.intensity) * fadeFactor;

    positionToCss();

    const keepAnimating =
      Math.abs(state.targetX - state.currentX) > 0.0008 ||
      Math.abs(state.targetY - state.currentY) > 0.0008 ||
      Math.abs(state.targetIntensity - state.intensity) > 0.001;

    state.rafId = keepAnimating ? requestAnimationFrame(animate) : 0;
  };

  const requestTick = () => {
    if (!state.rafId) {
      state.rafId = requestAnimationFrame(animate);
    }
  };

  const updateTargetFromEvent = (event) => {
    const bounds = revealSurface.getBoundingClientRect();
    state.targetX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    state.targetY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
  };

  revealSurface.addEventListener('pointerenter', (event) => {
    updateTargetFromEvent(event);
    state.targetIntensity = 1;
    revealSurface.classList.add('is-active');
    requestTick();
  });

  revealSurface.addEventListener('pointermove', (event) => {
    updateTargetFromEvent(event);
    state.targetIntensity = 1;
    requestTick();
  });

  revealSurface.addEventListener('pointerleave', () => {
    state.targetIntensity = 0;
    revealSurface.classList.remove('is-active');
    requestTick();
  });

  positionToCss();
})();
