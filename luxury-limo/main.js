import * as THREE from 'three';
import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

GSAP.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => { GSAP.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' }); });
document.querySelectorAll('a, button, .service-card, .gallery-item, .faq-question').forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

lenis.on('scroll', ({ progress }) => { document.querySelector('.scroll-progress').style.width = `${progress * 100}%`; });
lenis.on('scroll', ({ scroll }) => { document.querySelector('.header').classList.toggle('scrolled', scroll > 100); });

function initHero() {
  const heroTitle = document.querySelector('.hero-title');
  'LUXURY REDEFINED'.split('').forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    heroTitle.appendChild(span);
  });
  const tl = GSAP.timeline({ delay: 0.5 });
  tl.to(heroTitle, { opacity: 1, duration: 0.1 })
    .to(heroTitle.children, { opacity: 1, y: 0, stagger: 0.03, duration: 0.8, ease: 'power4.out' })
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
  const heroBg = document.getElementById('hero-bg');
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.animationDuration = `${15 + Math.random() * 10}s`;
    heroBg.appendChild(particle);
  }
  lenis.on('scroll', ({ scroll }) => {
    if (scroll < window.innerHeight) {
      document.getElementById('hero-car').style.transform = `translateY(${scroll * 0.3}px) rotate(${scroll * 0.01}deg)`;
    }
  });
}

function initAbout() {
  const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.querySelector('.about-image').classList.add('revealed'); } }); }, { threshold: 0.3 });
  observer.observe(document.querySelector('.about'));
}

function initWedding() {
  const petalsContainer = document.getElementById('wedding-petals');
  for (let i = 0; i < 30; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 15}s`;
    petal.style.animationDuration = `${10 + Math.random() * 10}s`;
    petalsContainer.appendChild(petal);
  }
  GSAP.from('.wedding-content', { scrollTrigger: { trigger: '.wedding', start: 'top 70%', end: 'bottom 30%', scrub: 1 }, y: 100, opacity: 0 });
}

function initServices() {
  document.querySelectorAll('.service-card').forEach((card, index) => {
    GSAP.to(card, { scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 50%', scrub: 1 }, opacity: 1, y: 0, delay: index * 0.1 });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      GSAP.to(card, { rotateX: (y - rect.height / 2) / 20, rotateY: (rect.width / 2 - x) / 20, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => { GSAP.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' }); });
  });
}

function initWebGLExperience() {
  const container = document.getElementById('webgl-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const carGroup = new THREE.Group();
  const bodyGeometry = new THREE.BoxGeometry(4, 0.8, 1.8);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.9, roughness: 0.2 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.6;
  body.castShadow = true;
  carGroup.add(body);

  const cabinGeometry = new THREE.BoxGeometry(2.5, 0.7, 1.5);
  const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.95, roughness: 0.1 });
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.set(-0.3, 1.2, 0);
  cabin.castShadow = true;
  carGroup.add(cabin);

  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3 });
  [{ x: 1.3, z: 0.9 }, { x: 1.3, z: -0.9 }, { x: -1.3, z: 0.9 }, { x: -1.3, z: -0.9 }].forEach((pos) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos.x, 0.4, pos.z);
    wheel.castShadow = true;
    carGroup.add(wheel);
  });

  const headlightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });
  [-0.7, 0.7].forEach((z) => {
    const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight.position.set(2, 0.7, z);
    carGroup.add(headlight);
    const taillight = new THREE.Mesh(headlightGeometry, new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 }));
    taillight.position.set(-2, 0.7, z);
    carGroup.add(taillight);
  });

  scene.add(carGroup);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.9, roughness: 0.1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const mainLight = new THREE.SpotLight(0xc9a962, 2);
  mainLight.position.set(5, 8, 5);
  mainLight.angle = Math.PI / 6;
  mainLight.penumbra = 0.5;
  mainLight.castShadow = true;
  scene.add(mainLight);
  scene.add(new THREE.DirectionalLight(0x4a6fa5, 1));

  let targetRotationY = 0, targetRotationX = 0, scrollProgress = 0;
  container.addEventListener('mousemove', (e) => {
    targetRotationY = ((e.clientX / window.innerWidth) * 2 - 1) * 0.5;
    targetRotationX = ((e.clientY / window.innerHeight) * 2 - 1) * 0.3;
  });
  ScrollTrigger.create({ trigger: '.experience-3d', start: 'top bottom', end: 'bottom top', onUpdate: (self) => { scrollProgress = self.progress; } });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    carGroup.rotation.y += (targetRotationY - carGroup.rotation.y) * 0.05;
    carGroup.rotation.x += (targetRotationX - carGroup.rotation.x) * 0.05;
    carGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.02;
    camera.position.z = 5 - scrollProgress * 2;
    camera.position.y = scrollProgress * 0.5;
    carGroup.rotation.y = scrollProgress * Math.PI * 0.5;
    mainLight.intensity = 2 + Math.sin(elapsedTime * 0.5) * 0.2;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

function initFAQ() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
  GSAP.from('.faq-item', { scrollTrigger: { trigger: '.faq-container', start: 'top 70%' }, y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' });
}

function initGallery() {
  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    GSAP.from(item, { scrollTrigger: { trigger: item, start: 'top 85%' }, y: 100, opacity: 0, scale: 0.9 });
  });
}

function initTestimonials() {
  const carousel = document.querySelector('.testimonials-carousel');
  let currentIndex = 0;
  setInterval(() => {
    currentIndex = (currentIndex + 1) % carousel.children.length;
    GSAP.to(carousel, { x: -currentIndex * 430, duration: 1, ease: 'power3.inOut' });
  }, 5000);
  GSAP.from('.testimonial-card', { scrollTrigger: { trigger: '.testimonials', start: 'top 70%' }, y: 100, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out' });
}

function initWhyChoose() {
  document.querySelectorAll('.why-item').forEach((item, index) => {
    GSAP.from(item.querySelector('.why-icon'), { scrollTrigger: { trigger: item, start: 'top 80%' }, scale: 0, rotation: -180, duration: 1 });
    GSAP.from(item, { scrollTrigger: { trigger: item, start: 'top 85%' }, y: 50, opacity: 0, delay: index * 0.1, duration: 0.8, ease: 'power3.out' });
  });
}

function initVisionMission() {
  ['vision-particles', 'mission-particles'].forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'vm-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      container.appendChild(particle);
    }
  });
  GSAP.from('.vision-section', { scrollTrigger: { trigger: '.vision-mission', start: 'top 70%' }, x: -100, opacity: 0 });
  GSAP.from('.mission-section', { scrollTrigger: { trigger: '.vision-mission', start: 'middle 50%' }, x: 100, opacity: 0 });
}

function initFooter() {
  GSAP.from('.footer-top', { scrollTrigger: { trigger: '.footer', start: 'top 80%' }, y: 100, opacity: 0 });
  document.querySelectorAll('.footer-social a').forEach((icon) => {
    icon.addEventListener('mouseenter', () => { GSAP.to(icon, { scale: 1.2, duration: 0.3, ease: 'back.out(1.7)' }); });
    icon.addEventListener('mouseleave', () => { GSAP.to(icon, { scale: 1, duration: 0.3, ease: 'power2.out' }); });
  });
}

function initMagneticButtons() {
  document.querySelectorAll('.hero-cta').forEach((button) => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      GSAP.to(button, { x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3, duration: 0.3, ease: 'power2.out' });
    });
    button.addEventListener('mouseleave', () => { GSAP.to(button, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }); });
  });
}

function initNavigation() {
  document.querySelectorAll('.nav-menu a, .hero-cta').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) lenis.scrollTo(target, { offset: -80, duration: 1.5 });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHero(); initAbout(); initWedding(); initServices(); initWebGLExperience();
  initFAQ(); initGallery(); initTestimonials(); initWhyChoose(); initVisionMission();
  initFooter(); initMagneticButtons(); initNavigation();
  console.log('✨ Luxury Limo Experience Initialized');
});
