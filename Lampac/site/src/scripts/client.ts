const COPY_MS = 1600;

function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(ta);
    }
  });
}

function initNav() {
  const hamburger = document.getElementById("hamburgerBtn");
  const dialog = document.getElementById("navDialog") as HTMLDialogElement | null;
  if (!hamburger || !dialog) return;

  function setExpanded(open: boolean) {
    hamburger!.setAttribute("aria-expanded", open ? "true" : "false");
    const close = hamburger!.getAttribute("data-label-close");
    const openLabel = hamburger!.getAttribute("data-label-open");
    hamburger!.setAttribute("aria-label", open ? close || "" : openLabel || "");
  }

  hamburger.addEventListener("click", () => {
    if (dialog.open) dialog.close();
    else {
      dialog.showModal();
      setExpanded(true);
    }
  });

  dialog.addEventListener("close", () => setExpanded(false));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (dialog.open) dialog.close();
    });
  });
}

function initTabs() {
  const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
  const panels = document.querySelectorAll<HTMLElement>('[role="tabpanel"]');
  if (!tabs.length) return;

  function activateTab(tab: HTMLElement) {
    const id = tab.getAttribute("data-tab");
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      const match = panel.id === `tab-${id}`;
      panel.classList.toggle("active", match);
      if (match) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
  }

  tabs.forEach((tab, index) => {
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next: HTMLElement | undefined;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (next) {
        event.preventDefault();
        next.focus();
        activateTab(next);
      }
    });
  });
}

function initCopy() {
  document.querySelectorAll<HTMLButtonElement>(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".code-wrap");
      const pre = wrap?.querySelector("pre");
      const text = pre?.innerText ?? "";
      const copied = btn.getAttribute("data-copied") || "Copied";
      const copy = btn.getAttribute("data-copy") || "Copy";
      copyText(text).then(() => {
        btn.classList.add("copied");
        btn.textContent = copied;
        window.setTimeout(() => {
          btn.classList.remove("copied");
          btn.textContent = copy;
        }, COPY_MS);
      }).catch(() => {
        /* keep original label */
      });
    });
  });
}

function initLangLinks() {
  document.querySelectorAll<HTMLAnchorElement>("[data-set-lang]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const lang = link.getAttribute("data-set-lang");
      if (lang === "en" || lang === "ru") {
        try {
          localStorage.setItem("lampac-lang", lang);
        } catch {
          /* ignore */
        }
      }
      const hash = window.location.hash;
      if (hash) {
        event.preventDefault();
        const url = new URL(link.href, window.location.origin);
        window.location.assign(`${url.pathname}${url.search}${hash}`);
      }
    });
  });
}

initNav();
initTabs();
initCopy();
initLangLinks();
