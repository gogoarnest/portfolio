document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const navLinksContainer = document.querySelector(".links");
  const navLinks = document.querySelectorAll('.links a[href^="#"]');
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll("section[id], main[id]");

  /* =================================
     Dynamic CSS
  ================================= */
  const dynamicStyles = document.createElement("style");

  dynamicStyles.textContent = `
    html {
      scroll-behavior: smooth;
    }

    body.menu-open {
      overflow: hidden;
    }

    .header {
      transition:
        box-shadow 0.3s ease,
        background-color 0.3s ease,
        transform 0.3s ease;
    }

    .header.scrolled {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .reveal-element {
      opacity: 0;
      transform: translateY(35px);
      transition:
        opacity 0.7s ease,
        transform 0.7s ease;
      transition-delay: var(--reveal-delay, 0ms);
    }

    .reveal-element.reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .links a.active {
      position: relative;
    }

    .links a.active::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -6px;
      height: 2px;
      border-radius: 10px;
      background: currentColor;
    }

    .menu-toggle {
      display: none;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
      position: relative;
      z-index: 1001;
    }

    .menu-toggle span {
      display: block;
      width: 26px;
      height: 2px;
      margin: 6px auto;
      border-radius: 10px;
      background: currentColor;
      transition:
        transform 0.3s ease,
        opacity 0.3s ease;
    }

    .menu-toggle.active span:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    .menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .menu-toggle.active span:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }

    .dynamic-role {
      min-height: 28px;
      margin-top: 14px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .typing-cursor {
      display: inline-block;
      margin-left: 3px;
      animation: cursorBlink 0.8s infinite;
    }

    @keyframes cursorBlink {
      0%, 50% {
        opacity: 1;
      }

      51%, 100% {
        opacity: 0;
      }
    }

    .project,
    .card,
    .contact-item {
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
    }

    .project:hover,
    .card:hover {
      transform: translateY(-7px);
    }

    .contact-item:hover {
      transform: translateY(-3px);
    }

    .project-image.image-fallback {
      min-height: 220px;
      display: grid;
      place-items: center;
      border-radius: inherit;
      background:
        linear-gradient(
          135deg,
          rgba(20, 33, 61, 0.95),
          rgba(55, 88, 126, 0.85)
        );
    }

    .image-fallback-text {
      padding: 20px;
      color: #ffffff;
      font-weight: 700;
      text-align: center;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: block;
      }

      .links {
        position: fixed;
        top: 0;
        right: -100%;
        width: min(320px, 85%);
        height: 100vh;
        padding: 100px 30px 40px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 25px;
        background: #ffffff;
        box-shadow: -12px 0 35px rgba(0, 0, 0, 0.12);
        transition: right 0.35s ease;
        z-index: 1000;
      }

      .links.open {
        right: 0;
      }

      .links a {
        width: 100%;
        font-size: 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }

      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      .reveal-element {
        opacity: 1;
        transform: none;
      }
    }
  `;

  document.head.appendChild(dynamicStyles);

  /* =================================
     Mobile Navigation
  ================================= */
  if (nav && navLinksContainer) {
    const menuButton = document.createElement("button");

    menuButton.className = "menu-toggle";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    nav.appendChild(menuButton);

    const closeMenu = () => {
      menuButton.classList.remove("active");
      navLinksContainer.classList.remove("open");
      document.body.classList.remove("menu-open");

      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = navLinksContainer.classList.toggle("open");

      menuButton.classList.toggle("active", isOpen);
      document.body.classList.toggle("menu-open", isOpen);

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu",
      );
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  /* =================================
     Smooth Scrolling
  ================================= */
  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  /* =================================
     Header Scroll Effect
  ================================= */
  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* =================================
     Reveal Elements on Scroll
  ================================= */
  const revealElements = document.querySelectorAll(
    ".section .title, .section .text, .project, .card, .skills li, .contact-item, .hero-text, .hero-card",
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal-element");
    element.style.setProperty(
      "--reveal-delay",
      `${Math.min(index % 4, 3) * 90}ms`,
    );
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("reveal-visible");
    });
  }

  /* =================================
     Active Navigation Link
  ================================= */
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${currentId}`,
            );
          });
        });
      },
      {
        threshold: 0.35,
        rootMargin: "-15% 0px -55% 0px",
      },
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =================================
     Hero Dynamic Typing Text
  ================================= */
  const subtitle = document.querySelector(".hero-text .subtitle");

  if (subtitle) {
    const dynamicRole = document.createElement("p");

    dynamicRole.className = "dynamic-role";
    dynamicRole.setAttribute("aria-live", "polite");

    subtitle.insertAdjacentElement("afterend", dynamicRole);

    const roles = [
      "Responsive Web Interfaces",
      "Clean Front-End Code",
      "Modern User Experiences",
      "HTML, CSS, JavaScript & React",
    ];

    let roleIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    const typeText = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        characterIndex--;
      } else {
        characterIndex++;
      }

      dynamicRole.innerHTML = `
        ${currentRole.slice(0, characterIndex)}
        <span class="typing-cursor">|</span>
      `;

      let typingSpeed = isDeleting ? 45 : 80;

      if (!isDeleting && characterIndex === currentRole.length) {
        typingSpeed = 1500;
        isDeleting = true;
      } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 350;
      }

      window.setTimeout(typeText, typingSpeed);
    };

    typeText();
  }

  /* =================================
     Project Image Fallback
  ================================= */
  const images = document.querySelectorAll(".project-image img");

  images.forEach((image) => {
    image.addEventListener("error", () => {
      const imageContainer = image.closest(".project-image");

      if (!imageContainer) return;

      const projectTitle =
        image
          .closest(".project")
          ?.querySelector(".project-head h3")
          ?.textContent.trim() || "Project Preview";

      image.remove();
      imageContainer.classList.add("image-fallback");

      const fallbackText = document.createElement("span");
      fallbackText.className = "image-fallback-text";
      fallbackText.textContent = projectTitle;

      imageContainer.appendChild(fallbackText);
    });
  });

  /* =================================
     Automatically Update Footer Year
  ================================= */
  const footerCopyright = document.querySelector(".footer-row p");

  if (footerCopyright) {
    footerCopyright.textContent = `© ${new Date().getFullYear()} George`;
  }

  /* =================================
     Secure External Links
  ================================= */
  const externalLinks = document.querySelectorAll('a[target="_blank"]');

  externalLinks.forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });
});
