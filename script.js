/* ==========================================================
   PORTFOLIO — script.js (JavaScript vanilla, sans dépendance)
   ========================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const $ = (sel) => document.querySelector(sel);

  /* ---------- 1. Menu hamburger mobile ---------- */
  const burger = $("#burger");
  const navLinks = $("#nav-links");

  function closeMenu() {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  // Ferme le menu après un clic sur un lien ou avec la touche Échap
  navLinks.addEventListener("click", (e) => { if (e.target.tagName === "A") closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---------- 2. Scroll fluide ----------
     Géré par CSS (scroll-behavior: smooth) ; désactivé si l'utilisateur
     demande moins d'animations. */

  /* ---------- 3 & 9. Dark / Light mode + localStorage ---------- */
  const themeBtn = $("#theme-toggle");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeBtn.textContent = theme === "dark" ? "☾" : "☀";
    try { localStorage.setItem("theme", theme); } catch (e) { /* stockage indisponible */ }
  }
  applyTheme(root.dataset.theme === "light" ? "light" : "dark");
  themeBtn.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  /* ---------- 4. Section active dans la navbar ---------- */
  const links = document.querySelectorAll(".nav-links a");
  const sections = [...links].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  function updateActive() {
    const y = window.scrollY + 120;
    let current = null;
    sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
  }
  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  /* ---------- 5. Animations au scroll (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible")); // anciens navigateurs
  }

  /* ---------- 6. Bouton « Retour en haut » ---------- */
  $("#to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- 7 & 8. Validation du formulaire + message ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");

  function setError(id, msg) { $("#err-" + id).textContent = msg; }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const data = {};
    ["name", "email", "subject", "message"].forEach((id) => {
      data[id] = form.elements[id].value.trim();
      setError(id, "");
    });

    if (data.name.length < 2) { setError("name", "Indiquez votre nom (2 caractères minimum)."); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setError("email", "Indiquez une adresse email valide."); valid = false; }
    if (data.subject.length < 3) { setError("subject", "Indiquez un sujet (3 caractères minimum)."); valid = false; }
    if (data.message.length < 10) { setError("message", "Votre message doit contenir au moins 10 caractères."); valid = false; }

    status.hidden = false;
    if (!valid) { status.textContent = "Le formulaire contient des erreurs : corrigez les champs indiqués."; return; }

    /* Le formulaire est valide, mais RIEN n'est envoyé : un site statique n'a pas de serveur.
       Pour un vrai envoi, branchez un service (Formspree, EmailJS…) ou un backend ici
       (voir README.md), par exemple avec fetch("URL_DU_SERVICE", { method: "POST", ... }). */
    status.textContent = "Formulaire valide, mais le message n'a pas été envoyé : ce formulaire nécessite un service backend ou d'envoi d'emails pour être réellement fonctionnel.";
    form.reset();
  });

  /* ---------- Année du copyright ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
