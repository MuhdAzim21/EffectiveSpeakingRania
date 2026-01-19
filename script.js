document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

const video = document.querySelector('.content-video');

if (video) {
  video.addEventListener('play', () => {
    video.classList.add('playing');
  });

  video.addEventListener('pointerdown', () => {
    if (video.muted) {
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
    }
  });
}

document.querySelectorAll('img, video').forEach(el => {
  el.addEventListener('load', () => el.classList.add('loaded'));
});


document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loading');
});

window.addEventListener('load', () => {
  document.body.classList.remove('loading');
});

  // =========================
  // 1️⃣ AOS (SAFE)
  // =========================
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }

  // =========================
  // 2️⃣ Scroll Lock
  // =========================
  function enableScrollLock() {
    body.classList.add('lock-scroll');
  }

  function disableScrollLock() {
    body.classList.remove('lock-scroll');
  }

  if (body.hasAttribute('data-lock-scroll')) {
    enableScrollLock();
  }

const sections = document.querySelectorAll('.hero-section, .content-section');

let scrollTimeout = null;
let isAutoScrolling = false;
let isDragging = false;

// Drag detection
document.addEventListener('dragstart', () => isDragging = true);
document.addEventListener('dragend', () => isDragging = false);
document.addEventListener('touchstart', () => isDragging = true, { passive: true });
document.addEventListener('touchend', () => isDragging = false);

window.addEventListener('scroll', () => {
  if (isAutoScrolling) return;
  if (isDragging) return;
  if (document.body.classList.contains('lock-scroll')) return;

  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    let closestSection = null;
    let minDistance = Infinity;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top);

      if (distance < minDistance) {
        minDistance = distance;
        closestSection = section;
      }
    });

    if (!closestSection) return;

    isAutoScrolling = true;

    closestSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Unlock after scroll animation
    setTimeout(() => {
      isAutoScrolling = false;
    }, 700);

  }, 200); // wait for scroll to STOP
});



  // =========================
  // 4️⃣ Drag & Drop
  // =========================
  function initDragAndDrop({ onComplete } = {}) {
    const bowl = document.getElementById('bowl');
    const bowl2 = document.getElementById('bowl2');
    const foods = document.querySelectorAll('.food, .food2');

    if ((!bowl && !bowl2) || !foods.length) return;

    const bowlContainer = bowl ? bowl.parentElement : bowl2.parentElement;
    let draggedItem = null;
    let droppedCount = 0;

    foods.forEach(food => {
      food.addEventListener('dragstart', () => {
        draggedItem = food;
        setTimeout(() => food.style.visibility = 'hidden', 0);
      });

      food.addEventListener('dragend', () => {
        if (draggedItem) draggedItem.style.visibility = 'visible';
        draggedItem = null;
      });
    });

    bowlContainer.addEventListener('dragover', e => e.preventDefault());
    bowlContainer.addEventListener('drop', handleDrop);

    function handleDrop() {
      if (!draggedItem) return;
      draggedItem.style.display = 'none';
      draggedItem = null;
      droppedCount++;
      if (droppedCount === foods.length) onComplete?.();
    }
  }

  // =========================
  // 5️⃣ Drag Bowl Modes
  // =========================
  if (body.hasAttribute('data-drag-bowl')) {
    initDragAndDrop({
      onComplete: () => {
        const bowl = document.getElementById('bowl');
        const lockedContent = document.getElementById('lockedContent');

        if (bowl) {
          const img = new Image();
          img.src = 'img/point1/bowlmix.gif';

          img.decode().then(() => {
            bowl.src = img.src;
          });
          bowl.classList.add('bowlclass');
        }

        setTimeout(() => {
          disableScrollLock();
          lockedContent?.classList.add('show');
          document.getElementById('intro1')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1000);
      }
    });
  }

  if (body.hasAttribute('data-drag-bowl-simple')) {
    initDragAndDrop({
      onComplete: () => {
        const bowl = document.getElementById('bowl2');
        if (bowl) {
          const img = new Image();
          img.src = 'img/intro/introgif.gif';

          img.decode().then(() => {
            bowl.src = img.src;
          });
          bowl.classList.add('bowl2class');
        }
      }
    });
  }

});

