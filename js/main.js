(function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var days = Array.prototype.slice.call(document.querySelectorAll("[data-date]"));
  if (days.length) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    days.forEach(function (el) {
      var date = new Date(el.getAttribute("data-date") + "T00:00:00");
      if (date.getTime() === today.getTime()) el.classList.add("is-today");
      else if (date < today) el.classList.add("is-past");
      else el.classList.add("is-upcoming");
    });
    document.querySelectorAll(".home-schedule").forEach(function (list) {
      var upcoming = list.querySelector(".is-today, .is-upcoming");
      if (!upcoming) list.classList.add("show-past");
    });
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var text = [
        "お名前: " + data.get("name"),
        "メール: " + data.get("email"),
        "電話: " + (data.get("tel") || "未記入"),
        "学年: " + data.get("grade"),
        "",
        data.get("message")
      ].join("\n");
      var url = "mailto:kitatoyonaka.post@gmail.com?subject=" +
        encodeURIComponent("【ホームページ】体験・入団の問い合わせ") +
        "&body=" + encodeURIComponent(text);
      window.location.href = url;
    });
  }

  mountInstagram();
  mountSlideshow();
  mountReveal();
  mountMonths();
})();

function mountSlideshow() {
  var root = document.querySelector("[data-slideshow]");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
  var pending = slides.length;
  if (!pending) return;

  slides.forEach(function (slide) {
    var img = slide.querySelector("img");
    function finish(ok) {
      if (!ok) slide.remove();
      pending -= 1;
      if (pending === 0) startSlideshow(root);
    }
    if (!img) {
      finish(false);
      return;
    }
    if (img.complete) finish(img.naturalWidth > 0);
    else {
      img.addEventListener("load", function () { finish(true); });
      img.addEventListener("error", function () { finish(false); });
    }
  });
}

function startSlideshow(root) {
  var track = root.querySelector(".slideshow-track");
  var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
  var prev = root.querySelector(".slide-prev");
  var next = root.querySelector(".slide-next");
  var dots = root.querySelector(".slide-dots");

  if (!slides.length) {
    var empty = document.createElement("figure");
    empty.className = "shot slide is-active";
    empty.innerHTML = "<figcaption>北豊中友好会</figcaption>";
    track.appendChild(empty);
    root.classList.add("is-single", "is-ready");
    return;
  }

  if (slides.length < 2) {
    slides[0].classList.add("is-active");
    root.classList.add("is-single", "is-ready");
    return;
  }

  var index = Math.max(0, slides.findIndex(function (slide) {
    return slide.classList.contains("is-active");
  }));
  var timer = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slide-dot";
    dot.setAttribute("aria-label", (i + 1) + "枚目の写真");
    dot.addEventListener("click", function () { show(i); });
    dots.appendChild(dot);
  });

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (slide, n) {
      var active = n === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    Array.prototype.forEach.call(dots.children, function (dot, n) {
      var active = n === index;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function stop() { window.clearInterval(timer); }
  function start() {
    if (reduce) return;
    stop();
    timer = window.setInterval(function () { show(index + 1); }, 10000);
  }

  prev.addEventListener("click", function () { show(index - 1); start(); });
  next.addEventListener("click", function () { show(index + 1); start(); });
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", function (event) {
    if (!root.contains(event.relatedTarget)) start();
  });

  show(index);
  root.classList.add("is-ready");
  start();
}

function revealVisible(root) {
  var scope = root || document;
  Array.prototype.forEach.call(scope.querySelectorAll(".rise:not(.is-in)"), function (el) {
    var rect = el.getBoundingClientRect();
    var view = window.innerHeight || document.documentElement.clientHeight;
    if (rect.height > 0 && rect.bottom > 0 && rect.top < view * 0.92) {
      el.classList.add("is-in");
    }
  });
}

function mountMonths() {
  var nav = document.querySelector("[data-month-nav]");
  if (!nav) return;
  var buttons = Array.prototype.slice.call(nav.querySelectorAll("[data-month]"));
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-month-panel]"));
  if (!buttons.length || !panels.length) return;

  function show(id) {
    var panel = null;
    buttons.forEach(function (btn) {
      var on = btn.getAttribute("data-month") === id;
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(function (item) {
      var on = item.getAttribute("data-month-panel") === id;
      item.hidden = !on;
      if (on) panel = item;
    });
    if (panel) {
      window.requestAnimationFrame(function () { revealVisible(panel); });
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-month");
      show(id);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#" + id);
      }
    });
  });

  var hash = (location.hash || "").replace("#", "");
  var known = buttons.some(function (btn) { return btn.getAttribute("data-month") === hash; });
  var initial = known ? hash : buttons[0].getAttribute("data-month");
  if (!known) {
    var now = new Date();
    var month = now.getMonth() + 1;
    var key = String(now.getFullYear()) + (month < 10 ? "0" : "") + month;
    if (buttons.some(function (btn) { return btn.getAttribute("data-month") === key; })) initial = key;
  }
  show(initial);
}

function mountReveal() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var selector = [
    "main h1", "main h2", "main h3",
    "main p", "main li", "main time",
    "main figcaption", "main label",
    "main .badge", "main .big", "main .score-meta",
    "main .section-head > a",
    "main blockquote > footer",
    "main .motto", "main table"
  ].join(", ");

  var nodes = Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function (el) {
    if (el.closest("[data-slideshow], .nav, .skip, .site-footer")) return false;
    if (el.closest(".motto") && !el.classList.contains("motto")) return false;
    return true;
  });
  nodes = nodes.filter(function (el) {
    return !nodes.some(function (other) {
      return other !== el && other.contains(el);
    });
  });
  if (!nodes.length) return;

  nodes.forEach(function (el) { el.classList.add("rise"); });
  document.documentElement.classList.add("reveal-ready");

  var observer = new IntersectionObserver(function (entries) {
    var visible = entries.filter(function (entry) { return entry.isIntersecting; });
    visible.sort(function (a, b) {
      return a.boundingClientRect.top - b.boundingClientRect.top;
    });
    visible.forEach(function (entry, index) {
      entry.target.style.transitionDelay = Math.min(index, 7) * 65 + "ms";
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.18 });

  nodes.forEach(function (el) { observer.observe(el); });
}

function mountInstagram() {
  var mount = document.querySelector("[data-instagram]");
  if (!mount) return;

  // 投稿グリッドを自動更新したいときは、LightWidget や SnapWidget などで
  // 発行された iframe の URL をここに貼る。空のままならカードは出さない。
  var widgetSrc = "";

  if (widgetSrc) {
    var frame = document.createElement("iframe");
    frame.className = "ig-frame";
    frame.src = widgetSrc;
    frame.title = "北豊中友好会のInstagram";
    frame.loading = "lazy";
    mount.appendChild(frame);
    return;
  }

  mount.remove();
}
