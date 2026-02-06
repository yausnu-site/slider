const comic = document.querySelector('[data-comic]');
const pages = [...comic.querySelectorAll('.page')];
const prevBtn = comic.querySelector('.prev');
const nextBtn = comic.querySelector('.next');
const counter = comic.querySelector('.counter');
const stack = comic.querySelector('.comic-stack');
const sound = document.getElementById('page-sound');

let index = 0; // 0 = cover
let isAnimating = false;

// ---------- UI ----------
function updateUI() {
  if (index === 0) {
    counter.textContent = 'Cover';
  } else {
    counter.textContent = `${index} / ${pages.length - 1}`;
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === pages.length - 1;

  pages.forEach((p, i) => {
    p.classList.remove('active', 'behind');
    if (i === index) p.classList.add('active');
    if (i === index + 1) p.classList.add('behind');
  });
}

// ---------- CORE ANIMATION ----------
function animateTo(newIndex, direction) {
  if (isAnimating || newIndex < 0 || newIndex >= pages.length) return;
  isAnimating = true;

  const page = pages[newIndex];
  page.classList.add('animating');

  if (sound) {
    sound.currentTime = 0;
    sound.volume = 0.25;
    sound.play().catch(() => {});
  }

  gsap.fromTo(
    page,
    {
      rotateY: 38 * direction,
      x: 50 * direction,
      opacity: 0
    },
    {
      duration: 0.65,
      rotateY: 0,
      x: 0,
      opacity: 1,
      ease: 'power3.inOut',
      onComplete: () => {
        page.classList.remove('animating');
        index = newIndex;
        isAnimating = false;
        updateUI();
      }
    }
  );
}

// ---------- NAV ----------
function goNext() {
  animateTo(index + 1, 1);
}

function goPrev() {
  animateTo(index - 1, -1);
}

// ---------- CLICK ZONES ----------
stack.addEventListener('click', e => {
  const rect = stack.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if (x < rect.width / 2) goPrev();
  else goNext();
});

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);

// ---------- SWIPE ----------
let startX = null;

comic.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

comic.addEventListener('touchend', e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (dx < -40) goNext();
  if (dx > 40) goPrev();
  startX = null;
});
