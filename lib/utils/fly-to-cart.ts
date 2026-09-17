/**
 * Hardware-accelerated "Fly to Cart" animation utility.
 * Clones/animates the product thumbnail in a smooth parabolic arc toward the navbar cart icon.
 * Fully responsive and cross-platform (Mobile & Desktop).
 */

export function flyToCart(
  startElement: HTMLElement | null,
  imageUrl?: string,
  onComplete?: () => void
): void {
  if (typeof window === 'undefined') {
    onComplete?.();
    return;
  }

  // Respect accessibility preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targetElement = document.getElementById('nav-cart-button');
    if (targetElement) {
      targetElement.classList.remove('animate-cart-bounce');
      void targetElement.offsetWidth;
      targetElement.classList.add('animate-cart-bounce');
      setTimeout(() => targetElement.classList.remove('animate-cart-bounce'), 500);
    }
    onComplete?.();
    return;
  }

  const targetElement = document.getElementById('nav-cart-button');
  if (!startElement || !targetElement) {
    onComplete?.();
    return;
  }

  const startRect = startElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  if (startRect.width === 0 || targetRect.width === 0) {
    onComplete?.();
    return;
  }

  const size = 52; // Initial size in px
  const startCenterX = startRect.left + startRect.width / 2;
  const startCenterY = startRect.top + startRect.height / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  const deltaX = targetCenterX - startCenterX;
  const deltaY = targetCenterY - startCenterY;

  // Create flying ghost node
  const flyingEl = document.createElement('div');
  flyingEl.setAttribute('aria-hidden', 'true');
  flyingEl.style.position = 'fixed';
  flyingEl.style.left = `${startCenterX - size / 2}px`;
  flyingEl.style.top = `${startCenterY - size / 2}px`;
  flyingEl.style.width = `${size}px`;
  flyingEl.style.height = `${size}px`;
  flyingEl.style.zIndex = '9999';
  flyingEl.style.pointerEvents = 'none';
  flyingEl.style.borderRadius = '16px';
  flyingEl.style.overflow = 'hidden';
  flyingEl.style.backgroundColor = 'var(--card, #ffffff)';
  flyingEl.style.border = '1.5px solid var(--border, rgba(0,0,0,0.1))';
  flyingEl.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
  flyingEl.style.display = 'flex';
  flyingEl.style.alignItems = 'center';
  flyingEl.style.justifyContent = 'center';
  flyingEl.style.padding = '4px';
  flyingEl.style.willChange = 'transform, opacity';

  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    flyingEl.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.style.width = '16px';
    placeholder.style.height = '16px';
    placeholder.style.borderRadius = '50%';
    placeholder.style.backgroundColor = 'var(--primary, #000)';
    flyingEl.appendChild(placeholder);
  }

  document.body.appendChild(flyingEl);

  // Parabolic natural arc animation via Web Animations API
  const arcHeight = Math.min(Math.abs(deltaY) * 0.2 + 25, 60);

  const animation = flyingEl.animate(
    [
      {
        transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
        opacity: 1,
      },
      {
        transform: `translate3d(${deltaX * 0.35}px, ${deltaY * 0.2 - arcHeight}px, 0) scale(0.9) rotate(8deg)`,
        opacity: 0.95,
        offset: 0.35,
      },
      {
        transform: `translate3d(${deltaX * 0.75}px, ${deltaY * 0.65}px, 0) scale(0.55) rotate(14deg)`,
        opacity: 0.8,
        offset: 0.75,
      },
      {
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.18) rotate(20deg)`,
        opacity: 0.15,
      },
    ],
    {
      duration: 550,
      easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
      fill: 'forwards',
    }
  );

  animation.onfinish = () => {
    flyingEl.remove();

    // Tactile bounce on the target cart button
    targetElement.classList.remove('animate-cart-bounce');
    void targetElement.offsetWidth; // Force CSS reflow
    targetElement.classList.add('animate-cart-bounce');

    setTimeout(() => {
      targetElement.classList.remove('animate-cart-bounce');
    }, 500);

    onComplete?.();
  };

  animation.oncancel = () => {
    flyingEl.remove();
    onComplete?.();
  };
}
