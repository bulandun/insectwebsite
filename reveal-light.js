(() => {
  const revealSurface = document.querySelector('.background-stage');

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
  const config = {
    lagFactor: 0.105,
    fadeFactor: 0.095,
  };

  const positionToCss = () => {
    revealSurface.style.setProperty('--reveal-x', `${(state.currentX * 100).toFixed(2)}%`);
    revealSurface.style.setProperty('--reveal-y', `${(state.currentY * 100).toFixed(2)}%`);
    revealSurface.style.setProperty('--reveal-strength', state.intensity.toFixed(3));
  };

  const animate = () => {
    // Higher lagFactor = less lag, lower lagFactor = more trailing.
    state.currentX += (state.targetX - state.currentX) * config.lagFactor;
    state.currentY += (state.targetY - state.currentY) * config.lagFactor;
    state.intensity += (state.targetIntensity - state.intensity) * config.fadeFactor;

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
    state.targetX = Math.min(1, Math.max(0, event.clientX / window.innerWidth));
    state.targetY = Math.min(1, Math.max(0, event.clientY / window.innerHeight));
  };

  window.addEventListener('pointerenter', (event) => {
    updateTargetFromEvent(event);
    state.targetIntensity = 1;
    revealSurface.classList.add('is-active');
    requestTick();
  });

  window.addEventListener('pointermove', (event) => {
    updateTargetFromEvent(event);
    state.targetIntensity = 1;
    requestTick();
  });

  window.addEventListener('pointerleave', () => {
    state.targetIntensity = 0;
    requestTick();
  });

  window.addEventListener('blur', () => {
    state.targetIntensity = 0;
    requestTick();
  });

  revealSurface.classList.add('is-active');
  positionToCss();
})();


(() => {
  const panels = document.querySelectorAll('.panel');

  if (!panels.length) {
    return;
  }

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const resetPanel = (panel) => {
    panel.style.setProperty('--mx', '50%');
    panel.style.setProperty('--my', '50%');
    panel.style.setProperty('--tilt-x', '0deg');
    panel.style.setProperty('--tilt-y', '0deg');
    panel.style.setProperty('--hover-strength', '0');
  };

  panels.forEach((panel) => {
    resetPanel(panel);

    if (!canHover) {
      return;
    }

    panel.addEventListener('pointermove', (event) => {
      const rect = panel.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      panel.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
      panel.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
      panel.style.setProperty('--tilt-y', `${((x - 0.5) * 2.3).toFixed(3)}deg`);
      panel.style.setProperty('--tilt-x', `${((0.5 - y) * 1.8).toFixed(3)}deg`);
      panel.style.setProperty('--hover-strength', '1');
    });

    panel.addEventListener('pointerenter', () => {
      panel.style.setProperty('--hover-strength', '1');
    });

    panel.addEventListener('pointerleave', () => {
      panel.style.setProperty('--hover-strength', '0');
      panel.style.setProperty('--tilt-x', '0deg');
      panel.style.setProperty('--tilt-y', '0deg');
      panel.style.setProperty('--mx', '50%');
      panel.style.setProperty('--my', '50%');
    });
  });
})();
