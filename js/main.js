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
