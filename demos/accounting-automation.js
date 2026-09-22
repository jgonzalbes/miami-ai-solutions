/* Accounting automation illustrative demo — invoice → ledger row → notification.
   All vendors and amounts are fictional sample data. */
(function () {
  'use strict';

  var LEDGER = [
    ['Sep 3, 2026', 'Example Utilities', 'EU-20931', 'Utilities', 412.18, 'Sep 25, 2026', 'Paid'],
    ['Sep 8, 2026', 'Sample Software Co.', 'SSC-5510', 'Software', 1200.00, 'Oct 8, 2026', 'Scheduled'],
    ['Sep 12, 2026', 'Demo Coffee Supply', 'DCS-0772', 'Break room', 186.40, 'Sep 26, 2026', 'Paid'],
    ['Sep 15, 2026', 'Test Insurance Group', 'TIG-3318', 'Insurance', 2350.00, 'Oct 15, 2026', 'Scheduled']
  ];

  var INVOICES = [
    {
      vendor: 'Example Supplies LLC', number: 'ES-10482', date: 'Sep 22, 2026', due: 'Oct 22, 2026',
      terms: 'Net 30', category: 'Office supplies', taxRate: 0.07,
      lines: [['Printer paper, case', 10, 42.00], ['Toner cartridge', 4, 118.50], ['Desk organizer', 12, 15.75]]
    },
    {
      vendor: 'Riverside Cleaning Services', number: 'RCS-2026-09', date: 'Sep 21, 2026', due: 'Oct 6, 2026',
      terms: 'Net 15', category: 'Facilities', taxRate: 0,
      lines: [['Monthly office cleaning', 1, 950.00], ['Window cleaning', 1, 180.00]]
    },
    {
      vendor: 'Placeholder Freight Inc.', number: 'PF-88317', date: 'Sep 20, 2026', due: 'Oct 4, 2026',
      terms: 'Net 14', category: 'Shipping', taxRate: 0,
      lines: [['Pallet shipment, Miami → Atlanta', 2, 385.00], ['Fuel surcharge', 1, 61.60]]
    }
  ];

  var money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var inbox = document.querySelector('[data-inbox]');
  var invoiceEl = document.querySelector('[data-invoice]');
  var sheet = document.querySelector('[data-sheet]');
  var notices = document.querySelector('[data-notices]');
  var extracted = document.querySelector('[data-extracted]');
  var pending = document.querySelector('[data-pending]');
  var runBtn = document.querySelector('[data-run]');
  var resetBtn = document.querySelector('[data-reset]');
  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));
  if (!inbox || !invoiceEl || !sheet) { return; }

  var current = 0;
  var processed = [];
  var timers = [];

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) { node.className = cls; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function totals(inv) {
    var sub = inv.lines.reduce(function (s, l) { return s + l[1] * l[2]; }, 0);
    var tax = Math.round(sub * inv.taxRate * 100) / 100;
    return { sub: sub, tax: tax, total: sub + tax };
  }

  function renderInbox() {
    inbox.innerHTML = '';
    INVOICES.forEach(function (inv, i) {
      var b = el('button', 'filter', inv.vendor + (processed[i] ? ' ✓' : ''));
      b.type = 'button';
      b.setAttribute('aria-pressed', i === current ? 'true' : 'false');
      b.addEventListener('click', function () {
        current = i;
        clearTimers();
        setSteps(processed[i] ? 3 : -1);
        renderAll();
      });
      inbox.appendChild(b);
    });
    var left = INVOICES.length - processed.filter(Boolean).length;
    if (pending) { pending.textContent = left ? left + ' waiting' : 'All processed'; }
  }

  function renderInvoice() {
    var inv = INVOICES[current];
    var t = totals(inv);
    invoiceEl.innerHTML = '';
    if (processed[current]) { invoiceEl.appendChild(el('span', 'stamp', 'Logged')); }
    invoiceEl.appendChild(el('h3', '', 'INVOICE'));

    var dl = el('dl', 'inv-head');
    [['From', inv.vendor], ['Bill to', 'Your Company (sample)'], ['Invoice #', inv.number],
     ['Date', inv.date], ['Terms', inv.terms], ['Due', inv.due]].forEach(function (p) {
      var d = el('div');
      d.appendChild(el('dt', '', p[0]));
      d.appendChild(el('dd', '', p[1]));
      dl.appendChild(d);
    });
    invoiceEl.appendChild(dl);

    var table = el('table', 'inv-lines');
    var thead = el('thead');
    var hr = el('tr');
    [['Item', ''], ['Qty', 'num'], ['Unit', 'num'], ['Amount', 'num']].forEach(function (h) {
      var th = el('th', h[1], h[0]);
      th.scope = 'col';
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);
    var tbody = el('tbody');
    inv.lines.forEach(function (l) {
      var tr = el('tr');
      tr.appendChild(el('td', '', l[0]));
      tr.appendChild(el('td', 'num', String(l[1])));
      tr.appendChild(el('td', 'num', money.format(l[2])));
      tr.appendChild(el('td', 'num', money.format(l[1] * l[2])));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    var tfoot = el('tfoot');
    [['Subtotal', t.sub], ['Tax', t.tax], ['Total due', t.total]].forEach(function (r) {
      var tr = el('tr');
      var label = el('td', '', r[0]);
      label.colSpan = 3;
      tr.appendChild(label);
      tr.appendChild(el('td', 'num', money.format(r[1])));
      tfoot.appendChild(tr);
    });
    table.appendChild(tfoot);
    invoiceEl.appendChild(table);

    runBtn.disabled = Boolean(processed[current]);
    runBtn.textContent = processed[current] ? 'Already processed' : 'Run automation';
  }

  function renderExtracted(show) {
    extracted.innerHTML = '';
    if (!show) { return; }
    var inv = INVOICES[current];
    ['Vendor: ' + inv.vendor, 'Invoice #: ' + inv.number, 'Total: ' + money.format(totals(inv).total),
     'Due: ' + inv.due, 'Category: ' + inv.category].forEach(function (f) {
      var li = el('li');
      li.appendChild(el('span', 'tag', f));
      extracted.appendChild(li);
    });
  }

  function renderSheet(freshIndex) {
    while (sheet.rows.length > 1) { sheet.deleteRow(1); }
    var rows = LEDGER.slice();
    var owners = rows.map(function () { return -1; });
    processed.forEach(function (p, i) {
      if (!p) { return; }
      var inv = INVOICES[i];
      rows.push([inv.date, inv.vendor, inv.number, inv.category, totals(inv).total, inv.due, 'To pay']);
      owners.push(i);
    });
    rows.forEach(function (r, n) {
      var tr = el('tr');
      if (owners[n] === freshIndex && freshIndex > -1) { tr.className = 'is-new'; }
      tr.appendChild(el('td', 'rn', String(n + 2)));
      r.forEach(function (v, c) {
        tr.appendChild(el('td', c === 4 ? 'num' : '', c === 4 ? money.format(v) : v));
      });
      sheet.appendChild(tr);
    });
  }

  function renderNotices(freshIndex) {
    notices.innerHTML = '';
    var order = [];
    processed.forEach(function (p, i) { if (p) { order.push({ i: i, at: p }); } });
    order.sort(function (a, b) { return b.at - a.at; });
    if (!order.length) {
      notices.appendChild(el('li', 'empty', 'Nothing yet — run an invoice through to see the notification.'));
      return;
    }
    order.forEach(function (o) {
      var inv = INVOICES[o.i];
      var li = el('li', 'notice' + (o.i === freshIndex ? ' is-fresh' : ''));
      var icon = el('span', 'notice-icon', 'AP');
      icon.setAttribute('aria-hidden', 'true');
      li.appendChild(icon);
      var body = el('div');
      body.appendChild(el('p', 't', 'Invoice logged — ' + inv.vendor));
      body.appendChild(el('p', '', money.format(totals(inv).total) + ' · ' + inv.category + ' · due ' + inv.due));
      body.appendChild(el('p', 's', 'Invoice ' + inv.number + ' added to the ledger, row ' + (LEDGER.length + 1 + rank(o.i)) + ' · just now'));
      li.appendChild(body);
      notices.appendChild(li);
    });
  }

  // Position of a processed invoice among the processed ones, in ledger order.
  function rank(i) {
    var r = 0;
    for (var k = 0; k <= i; k++) { if (processed[k]) { r++; } }
    return r;
  }

  function setSteps(n) {
    steps.forEach(function (s, i) {
      s.classList.toggle('is-done', i < n);
      s.classList.toggle('is-active', i === n);
    });
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function renderAll(freshIndex) {
    var fresh = freshIndex === undefined ? -1 : freshIndex;
    renderInbox();
    renderInvoice();
    renderExtracted(Boolean(processed[current]));
    renderSheet(fresh);
    renderNotices(fresh);
  }

  var tick = 0;
  runBtn.addEventListener('click', function () {
    var i = current;
    if (processed[i]) { return; }
    clearTimers();
    runBtn.disabled = true;
    var delay = reduce ? 0 : 700;

    setSteps(0);
    renderExtracted(true);
    timers.push(setTimeout(function () {
      processed[i] = ++tick;
      setSteps(1);
      renderInbox();
      renderInvoice();
      renderSheet(i);
      timers.push(setTimeout(function () {
        setSteps(3);
        renderNotices(i);
      }, delay));
    }, delay));
  });

  resetBtn.addEventListener('click', function () {
    clearTimers();
    processed = [];
    current = 0;
    setSteps(-1);
    renderAll();
  });

  renderAll();
}());
