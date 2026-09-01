(() => {
  const COVER_KEY = "homepage-entered";
  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, root = document) => root.querySelector(sel);

  async function loadSite() {
    const res = await fetch("/data/site.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load site.json");
    return res.json();
  }

  function setMeta(meta, analytics) {
    if (meta.title) document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && meta.description) desc.setAttribute("content", meta.description);

    const verification = analytics?.googleSiteVerification?.trim();
    if (verification) {
      let metaEl = document.querySelector('meta[name="google-site-verification"]');
      if (!metaEl) {
        metaEl = document.createElement("meta");
        metaEl.setAttribute("name", "google-site-verification");
        document.head.appendChild(metaEl);
      }
      metaEl.setAttribute("content", verification);
    }
  }

  function initGa4(measurementId) {
    const id = measurementId?.trim();
    if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return;
    if (window.__ga4Initialized) return;
    window.__ga4Initialized = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
  }

  function renderCover(data) {
    const { cover, profile } = data;
    $("#cover-name").textContent = cover.name;
    $("#cover-tagline").textContent = cover.tagline;
    $("#cover-enter").textContent = cover.cta || "Enter";

    const links = $("#cover-links");
    links.innerHTML = "";
    if (profile.github) {
      const a = document.createElement("a");
      a.href = profile.github;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "GitHub";
      links.appendChild(a);
    }
    if (profile.email) {
      const a = document.createElement("a");
      a.href = `mailto:${profile.email}`;
      a.textContent = "Email";
      links.appendChild(a);
    }

    requestAnimationFrame(() => {
      $("#cover-content")?.classList.add("is-ready");
    });
  }

  function renderNav(nav) {
    const el = $("#nav");
    el.innerHTML = nav
      .map((item) => `<a href="#${item.id}">${item.label}</a>`)
      .join("");
    $("#topbar-brand").textContent = "Youhan Huang";
  }

  function sectionShell(id, label, title, bodyHtml) {
    return `
      <section class="section reveal" id="${id}">
        <p class="section-label">${label}</p>
        <h2 class="section-title">${title}</h2>
        ${bodyHtml}
      </section>
    `;
  }

  function periodHtml(period) {
    const text = escapeHtml(period || "");
    const isNow = /present|current/i.test(period || "");
    return `<span class="item-period">${text}${
      isNow ? '<span class="badge-now">Now</span>' : ""
    }</span>`;
  }

  function renderAbout(profile) {
    const chips = (profile.interests || [])
      .map((i) => `<span class="chip">${escapeHtml(i)}</span>`)
      .join("");
    return sectionShell(
      "about",
      "Profile",
      "About",
      `
      <div class="about-grid">
        <img class="about-avatar" src="${profile.avatar}" alt="Portrait of ${escapeHtml(profile.name)}" width="140" height="140">
        <div>
          <p class="about-role">${escapeHtml(profile.role)}</p>
          <p class="about-meta">${escapeHtml(profile.affiliation)} · ${escapeHtml(profile.location)}</p>
          <p class="about-bio">${escapeHtml(profile.bio)}</p>
          <div class="chip-row">${chips}</div>
        </div>
      </div>
      `
    );
  }

  function renderEducation(items) {
    const html = items
      .map(
        (item, i) => `
      <li class="timeline-item reveal" style="--d:${i * 60}ms">
        <div class="item-head">
          <h3 class="item-title">${escapeHtml(item.school)}</h3>
          ${periodHtml(item.period)}
        </div>
        <p class="item-sub">${escapeHtml(item.degree)}</p>
        <ul class="detail-list">
          ${(item.details || []).map((d) => `<li>${escapeHtml(d)}</li>`).join("")}
        </ul>
      </li>`
      )
      .join("");
    return sectionShell("education", "Background", "Education", `<ul class="timeline">${html}</ul>`);
  }

  function renderNews(items) {
    const html = items
      .map(
        (item, i) => `
      <li class="news-item reveal" style="--d:${i * 50}ms">
        <span class="news-date">${escapeHtml(item.date)}</span>
        <p class="news-text">${escapeHtml(item.text)}</p>
      </li>`
      )
      .join("");
    return sectionShell("news", "Updates", "News", `<ul class="plain-list">${html}</ul>`);
  }

  function renderPublications(items) {
    const html = items
      .map((pub, i) => {
        const hasImage = !!pub.image;
        const status =
          pub.status === "accepted"
            ? "Accepted"
            : pub.status === "under_review"
              ? "Under Review"
              : escapeHtml(pub.status || "");
        const links = Object.entries(pub.links || {})
          .filter(([, url]) => url)
          .map(
            ([key, url]) =>
              `<a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(labelForLink(key))}</a>`
          )
          .join("");
        return `
        <li class="pub-item reveal ${hasImage ? "" : "no-image"}" style="--d:${i * 60}ms">
          ${hasImage ? `<img class="pub-thumb" src="${pub.image}" alt="" width="96" height="72">` : ""}
          <div>
            <span class="pub-status">${status}</span>
            <h3 class="pub-title">${escapeHtml(pub.title)}</h3>
            <p class="pub-authors">${pub.authors}</p>
            <p class="pub-venue">${escapeHtml(pub.venue)}</p>
            ${links ? `<div class="pub-links">${links}</div>` : ""}
          </div>
        </li>`;
      })
      .join("");
    return sectionShell(
      "publications",
      "Research Output",
      "Publications",
      `<ul class="pub-list">${html}</ul>`
    );
  }

  function renderExperienceCards(items, id, label, title) {
    const html = (items || [])
      .map(
        (item, i) => `
      <li class="card-item reveal" style="--d:${i * 60}ms">
        <div class="item-head">
          <h3 class="item-title">${escapeHtml(item.org)}</h3>
          ${periodHtml(item.period)}
        </div>
        <p class="item-sub">${escapeHtml(item.role)}</p>
        <p class="summary">${escapeHtml(item.summary)}</p>
      </li>`
      )
      .join("");
    return sectionShell(id, label, title, `<ul class="card-list">${html}</ul>`);
  }

  function renderResearch(items) {
    return renderExperienceCards(items, "research", "Experience", "Research");
  }

  function renderIntern(items) {
    if (!items || !items.length) return "";
    return renderExperienceCards(items, "intern", "Industry", "Intern");
  }

  function renderProjects(items) {
    const html = items
      .map((item, i) => {
        const links = Object.entries(item.links || {})
          .filter(([, url]) => url)
          .map(
            ([key, url]) =>
              `<a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(labelForLink(key))}</a>`
          )
          .join("");
        return `
        <li class="card-item reveal" style="--d:${i * 60}ms">
          <div class="item-head">
            <h3 class="item-title">${escapeHtml(item.title)}</h3>
            ${periodHtml(item.period)}
          </div>
          <p class="item-sub">${escapeHtml(item.role)}</p>
          <p class="summary">${escapeHtml(item.summary)}</p>
          ${links ? `<div class="pub-links">${links}</div>` : ""}
        </li>`;
      })
      .join("");
    return sectionShell("projects", "Selected Work", "Projects", `<ul class="card-list">${html}</ul>`);
  }

  function renderAwards(items) {
    const html = (items || [])
      .map((a, i) => {
        if (typeof a === "string") {
          return `<li class="award-item reveal" style="--d:${i * 45}ms"><p class="award-title">${escapeHtml(a)}</p></li>`;
        }
        return `
        <li class="award-item reveal" style="--d:${i * 45}ms">
          <p class="award-title">${escapeHtml(a.title)}</p>
          <p class="award-meta">${escapeHtml(a.meta || "")}</p>
        </li>`;
      })
      .join("");
    return sectionShell("awards", "Honors", "Awards", `<ul class="award-list">${html}</ul>`);
  }

  function renderSkills(skills, hobbies) {
    const body = `
      <div class="skills-grid">
        <div class="skill-block reveal">
          <h3>Languages</h3>
          <p>${escapeHtml((skills.languages || []).join(" · "))}</p>
        </div>
        <div class="skill-block reveal" style="--d:50ms">
          <h3>Tools</h3>
          <p>${escapeHtml((skills.tools || []).join(" · "))}</p>
        </div>
        <div class="skill-block reveal" style="--d:100ms">
          <h3>English</h3>
          <p>${escapeHtml(skills.english || "")}</p>
        </div>
        ${
          hobbies && hobbies.length
            ? `<div class="skill-block reveal" style="--d:150ms"><h3>Interests</h3><p>${escapeHtml(hobbies.join(" · "))}</p></div>`
            : ""
        }
      </div>`;
    return sectionShell("skills", "Toolkit", "Skills", body);
  }

  function cvMailto(email, lang) {
    const isZh = lang === "zh";
    const subject = isZh
      ? "索取个人简历（中文）"
      : "Request for CV (English)";
    const body = isZh
      ? "您好，希望索取您的中文个人简历，谢谢。"
      : "Hello,\n\nI would like to request your English CV.\n\nThank you.";
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function renderContact(profile) {
    const rows = [
      [
        "Email",
        `<a class="contact-cta" href="mailto:${profile.email}">${escapeHtml(profile.email)}</a>`
      ],
      [
        "GitHub",
        `<a href="${profile.github}" target="_blank" rel="noopener noreferrer">${escapeHtml(profile.github_username || "GitHub")}</a>`
      ],
      [
        "CV",
        `<a href="${cvMailto(profile.email, "en")}">Request via email</a>`
      ],
      [
        "CV (中文)",
        `<a href="${cvMailto(profile.email, "zh")}">Request via email</a>`
      ],
      ["Location", escapeHtml(profile.location)]
    ];
    const html = rows
      .map(
        ([label, value], i) => `
      <li class="reveal" style="--d:${i * 40}ms">
        <span class="contact-label">${label}</span>
        <span>${value}</span>
      </li>`
      )
      .join("");
    return sectionShell("contact", "Get in Touch", "Contact", `<ul class="contact-list">${html}</ul>`);
  }

  function renderMain(data) {
    const main = $("#main");
    main.innerHTML = [
      renderAbout(data.profile),
      renderEducation(data.education),
      renderNews(data.news),
      renderPublications(data.publications),
      renderResearch(data.research),
      renderIntern(data.intern),
      renderProjects(data.projects),
      renderAwards(data.awards),
      renderSkills(data.skills, data.hobbies),
      renderContact(data.profile)
    ].join("");

    const year = new Date().getFullYear();
    $("#footer").textContent = (data.footer || "© {year} Youhan Huang.").replace("{year}", year);
  }

  function labelForLink(key) {
    const map = {
      paper: "Paper",
      code: "Code",
      project: "Project",
      website: "Website",
      site: "Website",
      video: "Video",
      arxiv: "arXiv"
    };
    return map[key] || key;
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function haltFluid() {
    if (typeof window.stopFluid === "function") window.stopFluid();
    else {
      window.switchPage = window.switchPage || {};
      window.switchPage.switched = true;
      if (window.config) window.config.PAUSED = true;
    }
  }

  function enterSite({ persist = true } = {}) {
    const cover = $("#cover");
    const site = $("#site");
    if (!cover || cover.classList.contains("is-leaving")) return;

    haltFluid();
    cover.classList.add("is-leaving");
    site.hidden = false;
    requestAnimationFrame(() => site.classList.add("is-visible"));

    if (persist) {
      try {
        sessionStorage.setItem(COVER_KEY, "1");
      } catch (_) {
        /* ignore */
      }
    }

    window.setTimeout(() => {
      cover.setAttribute("hidden", "");
      cover.style.display = "none";
    }, REDUCE_MOTION ? 0 : 950);

    setupReveal();
    setupProgress();
  }

  function setupReveal() {
    const nodes = [...document.querySelectorAll(".reveal")];
    if (REDUCE_MOTION) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = getComputedStyle(el).getPropertyValue("--d").trim() || "0ms";
          el.style.transitionDelay = delay;
          el.classList.add("is-in");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    nodes.forEach((n) => observer.observe(n));
  }

  function setupProgress() {
    const bar = $("#read-progress");
    if (!bar) return;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function setupNav() {
    const toggle = $("#nav-toggle");
    const nav = $("#nav");

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    const links = [...nav.querySelectorAll("a")];
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  function setupCoverEnter() {
    $("#cover-enter").addEventListener("click", () => enterSite());
    window.addEventListener(
      "wheel",
      (e) => {
        if ($("#cover").hasAttribute("hidden") || $("#cover").classList.contains("is-leaving")) return;
        if (e.deltaY > 20) enterSite();
      },
      { passive: true }
    );
    window.addEventListener("keydown", (e) => {
      if ($("#cover").hasAttribute("hidden") || $("#cover").classList.contains("is-leaving")) return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        enterSite();
      }
    });
  }

  async function init() {
    try {
      const data = await loadSite();
      setMeta(data.meta, data.analytics);
      initGa4(data.analytics?.ga4MeasurementId);
      renderCover(data);
      renderNav(data.nav);
      renderMain(data);
      setupNav();
      setupCoverEnter();

      let skipCover = false;
      try {
        skipCover = sessionStorage.getItem(COVER_KEY) === "1";
      } catch (_) {
        skipCover = false;
      }

      if (skipCover || location.hash || document.documentElement.classList.contains("skip-cover")) {
        const site = $("#site");
        site.hidden = false;
        site.classList.add("is-visible");
        const cover = $("#cover");
        cover.setAttribute("hidden", "");
        cover.style.display = "none";
        haltFluid();
        setupReveal();
        setupProgress();
        if (location.hash) {
          requestAnimationFrame(() => {
            const target = document.querySelector(location.hash);
            if (target) target.scrollIntoView();
          });
        }
      }
    } catch (err) {
      console.error(err);
      $("#cover-tagline").textContent = "Failed to load content. Please refresh.";
      $("#cover-content")?.classList.add("is-ready");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
