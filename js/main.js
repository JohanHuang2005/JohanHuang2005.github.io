(() => {
  const COVER_KEY = "homepage-entered";

  const $ = (sel, root = document) => root.querySelector(sel);

  async function loadSite() {
    const res = await fetch("/data/site.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load site.json");
    return res.json();
  }

  function setMeta(meta) {
    if (meta.title) document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && meta.description) desc.setAttribute("content", meta.description);
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
      <section class="section" id="${id}">
        <p class="section-label">${label}</p>
        <h2 class="section-title">${title}</h2>
        ${bodyHtml}
      </section>
    `;
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
        (item) => `
      <li class="timeline-item">
        <div class="item-head">
          <h3 class="item-title">${escapeHtml(item.school)}</h3>
          <span class="item-period">${escapeHtml(item.period)}</span>
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
        (item) => `
      <li class="news-item">
        <span class="news-date">${escapeHtml(item.date)}</span>
        <p class="news-text">${escapeHtml(item.text)}</p>
      </li>`
      )
      .join("");
    return sectionShell("news", "Updates", "News", `<ul class="plain-list">${html}</ul>`);
  }

  function renderPublications(items) {
    const html = items
      .map((pub) => {
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
        <li class="pub-item ${hasImage ? "" : "no-image"}">
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
        (item) => `
      <li class="card-item">
        <div class="item-head">
          <h3 class="item-title">${escapeHtml(item.org)}</h3>
          <span class="item-period">${escapeHtml(item.period)}</span>
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
      .map((item) => {
        const link = item.links && item.links.code
          ? `<div class="pub-links"><a href="${item.links.code}" target="_blank" rel="noopener noreferrer">Code</a></div>`
          : "";
        return `
        <li class="card-item">
          <div class="item-head">
            <h3 class="item-title">${escapeHtml(item.title)}</h3>
            <span class="item-period">${escapeHtml(item.period || "")}</span>
          </div>
          <p class="item-sub">${escapeHtml(item.role)}</p>
          <p class="summary">${escapeHtml(item.summary)}</p>
          ${link}
        </li>`;
      })
      .join("");
    return sectionShell("projects", "Selected Work", "Projects", `<ul class="card-list">${html}</ul>`);
  }

  function renderAwards(items) {
    const html = items.map((a) => `<li class="card-item" style="padding:0.55rem 0">${escapeHtml(a)}</li>`).join("");
    return sectionShell("awards", "Honors", "Awards", `<ul class="card-list">${html}</ul>`);
  }

  function renderSkills(skills, hobbies) {
    const body = `
      <div class="skills-grid">
        <div class="skill-block">
          <h3>Languages</h3>
          <p>${escapeHtml((skills.languages || []).join(" · "))}</p>
        </div>
        <div class="skill-block">
          <h3>Tools</h3>
          <p>${escapeHtml((skills.tools || []).join(" · "))}</p>
        </div>
        <div class="skill-block">
          <h3>English</h3>
          <p>${escapeHtml(skills.english || "")}</p>
        </div>
        ${
          hobbies && hobbies.length
            ? `<div class="skill-block"><h3>Interests</h3><p>${escapeHtml(hobbies.join(" · "))}</p></div>`
            : ""
        }
      </div>`;
    return sectionShell("skills", "Toolkit", "Skills", body);
  }

  function renderContact(profile) {
    const rows = [
      ["Email", `<a href="mailto:${profile.email}">${escapeHtml(profile.email)}</a>`],
      ["GitHub", `<a href="${profile.github}" target="_blank" rel="noopener noreferrer">${escapeHtml(profile.github_username || "GitHub")}</a>`],
      ["CV", `<a href="${profile.cv}" target="_blank" rel="noopener noreferrer">English PDF</a>`]
    ];
    if (profile.cv_zh) {
      rows.push([
        "CV (中文)",
        `<a href="${profile.cv_zh}" target="_blank" rel="noopener noreferrer">Chinese PDF</a>`
      ]);
    }
    rows.push(["Location", escapeHtml(profile.location)]);
    const html = rows
      .map(
        ([label, value]) => `
      <li>
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
    const map = { paper: "Paper", code: "Code", project: "Project", video: "Video", arxiv: "arXiv" };
    return map[key] || key;
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function enterSite({ persist = true } = {}) {
    const cover = $("#cover");
    const site = $("#site");
    if (!cover || cover.classList.contains("is-leaving")) return;

    if (typeof window.stopFluid === "function") window.stopFluid();
    else {
      window.switchPage = window.switchPage || {};
      window.switchPage.switched = true;
      if (window.config) window.config.PAUSED = true;
    }

    cover.classList.add("is-leaving");
    site.hidden = false;

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
    }, 750);
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
        if ($("#cover").hasAttribute("hidden")) return;
        if (e.deltaY > 20) enterSite();
      },
      { passive: true }
    );
    window.addEventListener("keydown", (e) => {
      if ($("#cover").hasAttribute("hidden")) return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        enterSite();
      }
    });
  }

  async function init() {
    try {
      const data = await loadSite();
      setMeta(data.meta);
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
      if (skipCover || location.hash) {
        enterSite({ persist: true });
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
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
