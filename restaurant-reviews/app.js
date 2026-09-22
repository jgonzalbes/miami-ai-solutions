(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Datos de ejemplo — editar aquí para cambiar el feed de reviews.
     sent: "pos" | "neu" | "neg"
     --------------------------------------------------------------- */
  var REVIEWS = [
    { fecha: "Vie 28 ago", hora: "21:38", rating: 2, cat: "Servicio", sent: "neg",
      texto: "Reservamos para las 21:00 y nos sentaron a las 21:40. Nadie nos avisó nada mientras esperábamos parados en la entrada." },
    { fecha: "Sáb 22 ago", hora: "23:05", rating: 5, cat: "Ambiente", sent: "pos",
      texto: "La terraza frente al agua es preciosa, sobre todo al atardecer. Volvimos por tercera vez casi solo por eso." },
    { fecha: "Vie 21 ago", hora: "22:10", rating: 2, cat: "Servicio", sent: "neg",
      texto: "Otra vez media hora de demora con la reserva confirmada. El viernes anterior nos había pasado exactamente lo mismo." },
    { fecha: "Jue 20 ago", hora: "22:40", rating: 4, cat: "Comida", sent: "pos",
      texto: "El pulpo estaba excelente y la carta de vinos por copa es de las mejores de la zona. Lo único: pasadas las 22 el baño ya estaba bastante descuidado." },
    { fecha: "Mié 19 ago", hora: "21:20", rating: 3, cat: "Comida", sent: "neg",
      texto: "El salmón a la parrilla llegó tibio. El resto de la mesa bien, pero por ese precio esperaba otra cosa." },
    { fecha: "Sáb 15 ago", hora: "22:45", rating: 2, cat: "Limpieza", sent: "neg",
      texto: "Fuimos al baño cerca de las 22:30 y estaba sin papel y con el piso mojado. El resto del local, impecable." },
    { fecha: "Vie 14 ago", hora: "21:55", rating: 3, cat: "Servicio", sent: "neu",
      texto: "La comida muy buena, pero esperamos 35 minutos por la mesa a pesar de haber reservado con una semana de anticipación." },
    { fecha: "Mié 12 ago", hora: "21:15", rating: 5, cat: "Servicio", sent: "pos",
      texto: "Nos explicaron todo el menú del día con paciencia y sin apuro, y la mesa del ventanal tiene una vista espectacular." },
    { fecha: "Sáb 8 ago", hora: "23:20", rating: 2, cat: "Comida", sent: "neg",
      texto: "Pedimos lenguado a la parrilla y llegó frío en el centro. Lo devolvimos y el reemplazo tardó muchísimo." },
    { fecha: "Vie 7 ago", hora: "21:50", rating: 1, cat: "Servicio", sent: "neg",
      texto: "45 minutos de espera con reserva y sin ninguna explicación. Terminamos yendo a comer a otro lado." }
  ];

  var SENT_LABEL = { pos: "Positiva", neu: "Neutral", neg: "Negativa" };
  var STAR_PATH = "M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z";

  function starsMarkup(n) {
    var out = '<span class="stars" role="img" aria-label="' + n + ' de 5 estrellas">';
    for (var i = 1; i <= 5; i++) {
      out += '<svg viewBox="0 0 24 24" fill="currentColor" class="' + (i <= n ? "on" : "") + '" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg>';
    }
    return out + "</span>";
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- Render del feed ---------- */
  var feed = document.getElementById("feed");
  if (feed) {
    feed.innerHTML = REVIEWS.map(function (r) {
      return '<article class="review" data-sent="' + r.sent + '">' +
               '<div class="review-top">' +
                 starsMarkup(r.rating) +
                 '<span class="pill pill-cat" data-cat="' + r.cat.toLowerCase() + '"><span class="dot" aria-hidden="true"></span>' + r.cat + "</span>" +
                 '<span class="pill pill-' + r.sent + '"><span class="dot" aria-hidden="true"></span>' + SENT_LABEL[r.sent] + "</span>" +
                 '<span class="review-date">' + r.fecha + " · " + r.hora + "</span>" +
               "</div>" +
               '<p class="review-text">' + escapeHtml(r.texto) + "</p>" +
             "</article>";
    }).join("");
  }

  /* ---------- Pestañas ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
  var SLUGS = ["formulario", "dashboard", "alerta", "google"];

  function selectTab(index, focus) {
    tabs.forEach(function (tab, i) {
      var on = i === index;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) { tabs[index].focus(); }
    if (history.replaceState) {
      history.replaceState(null, "", "#" + SLUGS[index]);
    }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      selectTab(i, false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") { next = (i + 1) % tabs.length; }
      else if (e.key === "ArrowLeft") { next = (i - 1 + tabs.length) % tabs.length; }
      else if (e.key === "Home") { next = 0; }
      else if (e.key === "End") { next = tabs.length - 1; }
      if (next !== null) { e.preventDefault(); selectTab(next, true); }
    });
  });

  var fromHash = SLUGS.indexOf((location.hash || "").replace("#", ""));
  if (fromHash > -1) { selectTab(fromHash, false); }

  /* ---------- Divulgación progresiva (patrones y recomendaciones) ---------- */
  document.querySelectorAll(".disclose").forEach(function (btn) {
    var body = document.getElementById(btn.getAttribute("aria-controls"));
    var label = btn.querySelector("span");
    var opened = btn.textContent.indexOf("calculó") > -1 ? "Ocultar el cálculo" : "Ocultar detalle";
    var closed = label.textContent;
    btn.addEventListener("click", function () {
      var expand = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", expand ? "true" : "false");
      body.hidden = !expand;
      label.textContent = expand ? opened : closed;
    });
  });

  /* ---------- Acordeón del dashboard (solo en vista angosta) ---------- */
  var narrow = window.matchMedia("(max-width: 720px)");
  var blocks = Array.prototype.slice.call(document.querySelectorAll(".dash-toggle")).map(function (btn) {
    var body = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      if (!narrow.matches) { return; }
      var expand = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", expand ? "true" : "false");
      body.hidden = !expand;
    });
    return { btn: btn, body: body };
  });

  function syncAccordion() {
    blocks.forEach(function (b, i) {
      // En angosto: solo el primer bloque (feed) abierto. En ancho: todo visible.
      var open = narrow.matches ? i === 0 : true;
      b.btn.setAttribute("aria-expanded", open ? "true" : "false");
      b.body.hidden = !open;
    });
  }
  syncAccordion();
  if (narrow.addEventListener) { narrow.addEventListener("change", syncAccordion); }
  else if (narrow.addListener) { narrow.addListener(syncAccordion); }

  /* ---------- Recomendación → patrón que la generó ---------- */
  document.querySelectorAll("[data-goto]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.getElementById(link.getAttribute("data-goto"));
      if (!target) { return; }
      // Si el bloque de patrones está colapsado (acordeón mobile), abrirlo antes.
      var holder = target.closest(".dash-body");
      if (holder && holder.hidden) {
        holder.hidden = false;
        var opener = document.querySelector('.dash-toggle[aria-controls="' + holder.id + '"]');
        if (opener) { opener.setAttribute("aria-expanded", "true"); }
      }
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("flash");
      setTimeout(function () { target.classList.remove("flash"); }, 1600);
    });
  });

  /* ---------- Formulario (vista 1) ---------- */
  var rating = document.getElementById("rating");
  var caption = document.getElementById("rating-caption");
  var CAPTIONS = {
    "1": "1 de 5 — muy por debajo de lo esperado.",
    "2": "2 de 5 — hubo problemas.",
    "3": "3 de 5 — estuvo bien, con cosas para mejorar.",
    "4": "4 de 5 — muy buena experiencia.",
    "5": "5 de 5 — excelente."
  };
  if (rating) {
    rating.addEventListener("change", function (e) {
      if (e.target.name !== "rating") { return; }
      rating.setAttribute("data-rating", e.target.value);
      caption.textContent = CAPTIONS[e.target.value];
    });
  }

  var form = document.getElementById("feedback-form");
  var thanks = document.getElementById("thanks");
  var reset = document.getElementById("reset-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.hidden = true;
      thanks.hidden = false;
    });
  }
  if (reset) {
    reset.addEventListener("click", function () {
      thanks.hidden = true;
      form.hidden = false;
      form.reset();
      rating.setAttribute("data-rating", "0");
      caption.textContent = "Elige de 1 a 5 estrellas.";
    });
  }
})();
