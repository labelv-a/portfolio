// --- Legge le variabili CSS per sincronizzare i timing con il CSS ---
const cssVars = getComputedStyle(document.documentElement);
const ANIMATION_DURATION = parseInt(cssVars.getPropertyValue('--animation-duration')) || 317;
const ANIMATION_HIDE_DELAY = parseInt(cssVars.getPropertyValue('--animation-hide-delay')) || 350;
const CLOSE_BUTTON_DELAY = parseInt(cssVars.getPropertyValue('--close-button-delay')) || 750;

// --- Checkbox Animation Logic ---
document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-target]');

    checkboxes.forEach((cb) => {
        const targets = document.querySelectorAll('.' + cb.dataset.target);
        if (!targets.length)
            return;

        // Initialize: hide all targets that should be hidden on load
        targets.forEach(el => {
            if (!cb.checked) {
                el.style.display = "none";
                if (el.classList.contains("sfondo-telefono")) {
                    el.classList.remove("visible");
                }
            } else {
                el.style.display = "";
                if (el.classList.contains("sfondo-telefono")) {
                    el.classList.add("visible");
                }
            }
        });

        const showElements = () => {
            targets.forEach((el, i) => {
                el.style.display = "";
                if (el.classList.contains("sfondo-telefono")) {
                    el.classList.add("visible");
                }
                el.hidden = false;
                el.classList.remove("fade-out-down");
                el.classList.remove("fade-in-up");

                void el.offsetWidth;

                const baseDelay = 0.27;
                const stagger = 0.12;
                el.style.animationDelay = `${baseDelay + i * stagger}s`;

                el.classList.add("fade-in-up");
            });
        };

        const hideElements = () => {
            targets.forEach((el, i) => {
                el.classList.remove("fade-in-up");

                const baseDelay = 0;
                const stagger = 0.12;
                el.style.animationDelay = `${baseDelay + i * stagger}s`;

                el.classList.add("fade-out-down");

                const handler = () => {
                    el.hidden = true;
                    el.style.display = "";
                    if (el.classList.contains("sfondo-telefono")) {
                        el.classList.remove("visible");
                    }
                    el.removeEventListener("animationend", handler);
                };

                el.addEventListener("animationend", handler, { once: true });
            });
        };

        cb.addEventListener("change", () => {
            if (cb.checked) {
                checkboxes.forEach((other) => {
                    if (other !== cb && other.checked) {
                        other.checked = false;
                        const otherTargets = document.querySelectorAll("." + other.dataset.target);
                        otherTargets.forEach((el, i) => {
                            el.classList.remove("fade-in-up");
                            el.style.animationDelay = `${i * 0.15}s`;
                            el.classList.add("fade-out-down");

                            const handler = () => {
                                el.hidden = true;
                                el.style.display = "";
                                if (el.classList.contains("sfondo-telefono")) {
                                    el.classList.remove("visible");
                                }
                                el.removeEventListener("animationend", handler);
                            };

                            el.addEventListener("animationend", handler, { once: true });
                        });
                    }
                });
                showElements();
            } else {
                hideElements();
            }
        });

        targets.forEach((el) => (el.hidden = !cb.checked));
    });
});

// --- Grid Visibility Toggle ---
document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("editorialcheckbox");
    const grid = document.querySelector(".griglia-lavori");

    if (!checkbox || !grid)
        return;

    // Initialize grid state immediately
    if (checkbox.checked) {
        grid.style.display = "grid";
        grid.classList.add("fade-in-up");
    } else {
        grid.style.display = "none";
    }

    const updateGridVisibility = () => {
        const globalBackBtn = document.getElementById("globalBackFromGriglia");

        if (checkbox.checked) {
            grid.style.display = "grid";
            grid.classList.remove("hidden-grid");
            grid.classList.remove("fade-out-down");
            setTimeout(() => {
                grid.classList.add("fade-in-up");
            }, 10);

            if (globalBackBtn) {
                setTimeout(() => {
                    globalBackBtn.classList.remove("hidden");
                    globalBackBtn.classList.remove("fade-out-down");
                    void globalBackBtn.offsetWidth;
                    globalBackBtn.classList.add("fade-in-up");
                }, 300);
            }
        } else {
            grid.classList.remove("fade-in-up");
            grid.classList.add("fade-out-down");

            if (globalBackBtn) {
                globalBackBtn.classList.add("hidden");
                globalBackBtn.classList.remove("fade-in-up");
                globalBackBtn.classList.remove("active");
            }

            const handler = () => {
                grid.style.display = "none";
                grid.classList.add("hidden-grid");
                grid.removeEventListener("animationend", handler);
            };
            grid.addEventListener("animationend", handler, { once: true });
        }
    };

    checkbox.addEventListener("change", updateGridVisibility);
});

// --- Overlay Logic (CON SCROLL RESET) ---
document.addEventListener("DOMContentLoaded", () => {
    const projects = document.querySelectorAll(".progetto");

    projects.forEach((proj) => {
        proj.addEventListener("click", () => {
            const projId = proj.id;
            const overlay = document.getElementById(`overlay-${projId}`);

            if (!overlay)
                return;

            const closeBtn = overlay.querySelector(".closeOverlay");
            const overlayContent = overlay.querySelector(".overlay-content");
            const globalCloseBtn = document.getElementById("globalCloseOverlay");

            // Show overlay with animation — usa classe is-open invece di style inline
            overlay.classList.add("is-open");
            overlay.classList.remove("hidden");
            overlay.classList.remove("fade-out-down");
            overlay.classList.remove("is-closing");

            requestAnimationFrame(() => {
                overlay.classList.add("show");
                overlay.classList.add("fade-in-up");
            });

            if (globalCloseBtn) {
                globalCloseBtn.classList.remove("hidden");
                globalCloseBtn.classList.remove("fade-out-down");
                void globalCloseBtn.offsetWidth;
                globalCloseBtn.classList.add("fade-in-up");
            }

            proj.classList.add("active");
            document.body.style.overflow = "hidden";

            if (overlayContent) {
                overlayContent.scrollTop = 0;
            }

            const closeHandler = () => {
                if (globalCloseBtn)
                    globalCloseBtn.classList.add("active");

                setTimeout(() => {
                    // Usa classe is-closing per bloccare i pointer events via CSS
                    overlay.classList.add("is-closing");
                    if (overlayContent) overlayContent.style.pointerEvents = "none";
                    overlay.classList.remove("show");
                    overlay.classList.remove("fade-in-up");
                    overlay.classList.add("fade-out-down");
                    proj.classList.remove("active");

                    document.body.style.overflow = "auto";

                    if (overlayContent)
                        overlayContent.scrollTop = 0;

                    if (globalCloseBtn) {
                        globalCloseBtn.classList.add("hidden");
                        globalCloseBtn.classList.remove("fade-in-up");
                        globalCloseBtn.classList.remove("active");
                    }

                    setTimeout(() => {
                        overlay.classList.remove("is-open");
                        overlay.classList.remove("is-closing");
                        overlay.classList.remove("fade-out-down");
                        overlay.classList.add("hidden");
                        if (overlayContent) overlayContent.style.pointerEvents = "";
                    }, ANIMATION_HIDE_DELAY);
                }, CLOSE_BUTTON_DELAY);
            };

            if (closeBtn) {
                closeBtn.removeEventListener("click", closeHandler);
                closeBtn.addEventListener("click", closeHandler);
            }
        });
    });
});

// --- Global Close Button ---
document.addEventListener("DOMContentLoaded", () => {
    const globalCloseBtn = document.getElementById("globalCloseOverlay");

    if (!globalCloseBtn)
        return;

    globalCloseBtn.addEventListener("click", () => {
        const openOverlay = document.querySelector(".overlay.show");
        if (!openOverlay)
            return;

        globalCloseBtn.classList.add("active");

        setTimeout(() => {
            const overlayContent = openOverlay.querySelector(".overlay-content");
            const activeProject = document.querySelector(".progetto.active");

            openOverlay.classList.add("is-closing");
            if (overlayContent) overlayContent.style.pointerEvents = "none";
            openOverlay.classList.remove("show");
            openOverlay.classList.remove("fade-in-up");
            openOverlay.classList.add("fade-out-down");
            if (activeProject)
                activeProject.classList.remove("active");

            document.body.style.overflow = "auto";
            if (overlayContent)
                overlayContent.scrollTop = 0;

            globalCloseBtn.classList.add("hidden");
            globalCloseBtn.classList.remove("fade-in-up");
            globalCloseBtn.classList.remove("active");

            setTimeout(() => {
                openOverlay.classList.remove("is-open");
                openOverlay.classList.remove("is-closing");
                openOverlay.classList.remove("fade-out-down");
                openOverlay.classList.add("hidden");
                if (overlayContent) overlayContent.style.pointerEvents = "";
            }, ANIMATION_HIDE_DELAY);
        }, CLOSE_BUTTON_DELAY);
    });
});

// --- Global Back From Griglia ---
document.addEventListener("DOMContentLoaded", () => {
    const globalBackBtn = document.getElementById("globalBackFromGriglia");
    const editorialCheckbox = document.getElementById("editorialcheckbox");

    if (!globalBackBtn || !editorialCheckbox)
        return;

    globalBackBtn.addEventListener("click", () => {
        globalBackBtn.classList.add("active");

        setTimeout(() => {
            editorialCheckbox.checked = false;
            editorialCheckbox.dispatchEvent(new Event("change"));
        }, CLOSE_BUTTON_DELAY);
    });
});

// --- Intersection Observer per mostrare descrizioni su mobile ---
document.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const desc = entry.target.closest(".editorial-group")?.querySelector(".divdesc");
            if (entry.isIntersecting) {
                if (desc) desc.style.opacity = "1";
                entry.target.classList.add("visible");
            } else {
                if (desc) desc.style.opacity = "0";
                entry.target.classList.remove("visible");
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: "0px"
    });

    const observeImages = () => {
        const images = document.querySelectorAll(".griglia-lavori .progetto");
        images.forEach(img => observer.observe(img));
    };

    observeImages();

    const editorialCheckbox = document.getElementById("editorialcheckbox");
    if (editorialCheckbox) {
        editorialCheckbox.addEventListener("change", () => {
            if (editorialCheckbox.checked) {
                setTimeout(observeImages, 50);
            }
        });
    }
});

// --- Back Button per chiudere la chat ---
document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("backFromChat");
    const aboutCheckbox = document.getElementById("aboutcheckbox");

    if (backButton && aboutCheckbox) {
        backButton.addEventListener("click", () => {
            backButton.classList.add("active");

            setTimeout(() => {
                backButton.classList.remove("active");
                aboutCheckbox.checked = false;
                aboutCheckbox.dispatchEvent(new Event('change'));
            }, CLOSE_BUTTON_DELAY);
        });
    }
});

// --- Back Button per chiudere la griglia lavori ---
document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("backFromGrigliaLavori");
    const editorialCheckbox = document.getElementById("editorialcheckbox");

    if (backButton && editorialCheckbox) {
        backButton.addEventListener("click", () => {
            backButton.classList.add("active");

            setTimeout(() => {
                backButton.classList.remove("active");
                editorialCheckbox.checked = false;
                editorialCheckbox.dispatchEvent(new Event('change'));
            }, CLOSE_BUTTON_DELAY);
        });
    }
});

// --- Overlay: wrap colonna destra per scroll indipendente ---
document.addEventListener("DOMContentLoaded", () => {
    const overlays = document.querySelectorAll(".overlay");

    overlays.forEach(overlay => {
        const content = overlay.querySelector(".overlay-content");
        if (!content) return;

        const prima = content.querySelector(".blocco-testo.prima");
        if (!prima) return;

        const rightItems = [...content.children].filter(el => el !== prima);
        if (!rightItems.length) return;

        const wrapper = document.createElement("div");
        wrapper.className = "overlay-right";
        rightItems.forEach(item => wrapper.appendChild(item));
        content.appendChild(wrapper);
    });
});

// --- immagini hover ---
document.addEventListener("DOMContentLoaded", () => {
    const preview = document.getElementById("preview");
    const items = document.querySelectorAll(".hover-item");

    if (!preview || !items.length) return;

    items.forEach(item => {
        item.addEventListener("mouseenter", () => {
            preview.src = item.dataset.img;
            preview.style.opacity = 1;
        });
        item.addEventListener("mouseleave", () => {
            preview.style.opacity = 0;
        });
    });

    document.addEventListener("mousemove", e => {
        preview.style.top = e.clientY + 20 + "px";
        preview.style.left = e.clientX + 20 + "px";
    });
});