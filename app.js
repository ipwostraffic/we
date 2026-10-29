'use strict';

const photos = [
  {file:'first-evening', caption:'Тот самый вечер. 30 октября 2025.', alt:'Наш поцелуй на осенней улице в день, когда мы сошлись'},
  {file:'mirror', caption:'Нам лишь бы вместе в кадр.', alt:'Мы обнимаемся и фотографируемся в зеркале'},
  {file:'on-my-back', caption:'Тебя я всегда вывезу)', alt:'Я держу тебя на спине, а ты снимаешь нас в зеркале'},
  {file:'silly-us', caption:'Серьёзные отношения. Почти.', alt:'Мы оба показываем язык на селфи'},
  {file:'your-smile', caption:'Мне нравится, как ты смеёшься.', alt:'Ты смеёшься рядом со мной, я в серой шапке'},
  {file:'strong-us', caption:'Ну красавцы же.', alt:'Наше смешное фото в зеркале: я показываю мышцы за твоей спиной'},
  {file:'sunset', caption:'Хочу ещё много таких вечеров с тобой.', alt:'Мы целуемся на фоне оранжевого заката'}
];

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
let currentPhoto = 0;
let photoOpener = null;

function displayPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const photo = photos[currentPhoto];
  lightboxImage.src = 'assets/' + photo.file + '.webp';
  lightboxImage.alt = photo.alt;
  document.querySelector('#lightbox-caption').textContent = photo.caption;
  document.querySelector('#lightbox-counter').textContent = String(currentPhoto + 1).padStart(2, '0') + ' / 07';
}

for (const button of document.querySelectorAll('[data-photo]')) {
  button.addEventListener('click', () => {
    photoOpener = button;
    displayPhoto(Number(button.dataset.photo));
    lightbox.showModal();
    document.body.classList.add('modal-open');
    document.querySelector('#lightbox-close').focus();
  });
}
document.querySelector('#lightbox-close').addEventListener('click', () => lightbox.close());
document.querySelector('#lightbox-prev').addEventListener('click', () => displayPhoto(currentPhoto - 1));
document.querySelector('#lightbox-next').addEventListener('click', () => displayPhoto(currentPhoto + 1));
lightbox.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  photoOpener?.focus({preventScroll:true});
});
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
document.addEventListener('keydown', event => {
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') {event.preventDefault(); displayPhoto(currentPhoto - 1);}
  if (event.key === 'ArrowRight') {event.preventDefault(); displayPhoto(currentPhoto + 1);}
});
let swipeStart = null;
const stage = document.querySelector('#lightbox-stage');
stage.addEventListener('touchstart', event => {
  if (event.touches.length === 1) swipeStart = {x:event.touches[0].clientX,y:event.touches[0].clientY};
  else swipeStart = null;
}, {passive:true});
stage.addEventListener('touchend', event => {
  if (!swipeStart) return;
  const dx = event.changedTouches[0].clientX - swipeStart.x;
  const dy = event.changedTouches[0].clientY - swipeStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) displayPhoto(currentPhoto + (dx < 0 ? 1 : -1));
  swipeStart = null;
}, {passive:true});
stage.addEventListener('touchcancel', () => {swipeStart = null;}, {passive:true});

const openLetter = document.querySelector('#open-letter');
const letterPaper = document.querySelector('#letter-paper');
const envelope = document.querySelector('#envelope');
openLetter.addEventListener('click', () => {
  openLetter.setAttribute('aria-expanded', 'true');
  envelope.hidden = true;
  letterPaper.hidden = false;
  letterPaper.focus({preventScroll:true});
  letterPaper.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth', block:'start'});
});
document.querySelector('#close-letter').addEventListener('click', () => {
  letterPaper.hidden = true;
  envelope.hidden = false;
  openLetter.setAttribute('aria-expanded', 'false');
  openLetter.focus({preventScroll:true});
  envelope.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth', block:'center'});
});

const hugButton = document.querySelector('#hug-button');
let hugTimeout;
hugButton.addEventListener('click', () => {
  clearTimeout(hugTimeout);
  hugButton.querySelector('.hug-label').textContent = 'Обнимаю крепко';
  document.querySelector('#hug-message').textContent = 'А теперь давай по-настоящему.';
  const particles = document.querySelector('#hug-particles');
  particles.replaceChildren();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i=0;i<13;i++) {
      const heart = document.createElement('span');
      heart.className = 'hug-particle';
      heart.textContent = '♡';
      heart.style.setProperty('--dx', ((Math.random()-.5)*200)+'px');
      heart.style.setProperty('--turn', ((Math.random()-.5)*75)+'deg');
      heart.style.setProperty('--delay', (Math.random()*.45)+'s');
      particles.append(heart);
    }
  }
  hugTimeout = setTimeout(() => {
    hugButton.querySelector('.hug-label').textContent = 'Ещё обниму?';
    particles.replaceChildren();
  }, 3500);
});

const progress = document.querySelector('.reading-progress');
let ticking = false;
function updateProgress() {
  const height = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = 'scaleX(' + (height > 0 ? Math.min(1,Math.max(0,scrollY/height)) : 0) + ')';
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) {requestAnimationFrame(updateProgress);ticking=true;}
}, {passive:true});
addEventListener('resize', updateProgress);
if ('ResizeObserver' in window) new ResizeObserver(updateProgress).observe(document.body);
updateProgress();
