/* AI SDR illustrative demo — sample leads and a qualification detail view.
   All companies are fictional; every value below is sample data. */
(function () {
  'use strict';

  var VERDICT = {
    qualified: { label: 'Qualified', cls: 'verdict--qualified' },
    review: { label: 'Needs review', cls: 'verdict--review' },
    nofit: { label: 'Not a fit', cls: 'verdict--nofit' }
  };

  // mark: pass | part | fail
  var LEADS = [
    {
      name: 'Example Co.', industry: 'B2B software', size: '120 employees', location: 'Miami, FL',
      contact: 'VP of Operations', score: 86, verdict: 'qualified',
      criteria: [
        ['pass', 'Industry matches the target profile', 'B2B software'],
        ['pass', 'Company size in range (50–500)', '120'],
        ['pass', 'Contact can make the buying decision', 'VP level'],
        ['pass', 'Recent buying signal', 'Hiring ops roles']
      ],
      reasoning: 'Strong fit on every criterion. Three open operations roles suggest the team is stretched on exactly the manual work the offer removes, and the contact owns that budget.',
      signals: ['3 open ops roles', 'New office opened', 'Website mentions scaling support'],
      next: ['Sent to the CRM as a qualified lead', 'Assigned to sales with the reasoning attached, so the first call starts from context.']
    },
    {
      name: 'Riverside Manufacturing', industry: 'Industrial manufacturing', size: '340 employees', location: 'Columbus, OH',
      contact: 'Director of Procurement', score: 78, verdict: 'qualified',
      criteria: [
        ['pass', 'Industry matches the target profile', 'Manufacturing'],
        ['pass', 'Company size in range (50–500)', '340'],
        ['pass', 'Contact can make the buying decision', 'Director'],
        ['part', 'Recent buying signal', 'Indirect only']
      ],
      reasoning: 'Good profile fit and a decision-maker contact. The buying signal is indirect — a supplier-portal job post rather than a stated project — so it is qualified with a lower score than a lead showing active intent.',
      signals: ['Supplier-portal job post', 'Expanded to a second plant'],
      next: ['Sent to the CRM as a qualified lead', 'Flagged “indirect signal” so outreach leads with a question, not a pitch.']
    },
    {
      name: 'Placeholder Health Group', industry: 'Outpatient clinics', size: '210 employees', location: 'Tampa, FL',
      contact: 'Chief Operating Officer', score: 81, verdict: 'qualified',
      criteria: [
        ['pass', 'Industry matches the target profile', 'Healthcare services'],
        ['pass', 'Company size in range (50–500)', '210'],
        ['pass', 'Contact can make the buying decision', 'C-level'],
        ['pass', 'Recent buying signal', 'Hiring front-desk staff']
      ],
      reasoning: 'Clear fit. Repeated front-desk hiring across locations points to intake volume the team is absorbing by hand, and the COO is the right owner for that problem.',
      signals: ['Front-desk roles at 4 locations', 'Patient-intake page redesigned'],
      next: ['Sent to the CRM as a qualified lead', 'Assigned to sales with the reasoning attached.']
    },
    {
      name: 'Sample Logistics Inc.', industry: 'Freight & logistics', size: '55 employees', location: 'Houston, TX',
      contact: 'Owner', score: 64, verdict: 'review',
      criteria: [
        ['pass', 'Industry matches the target profile', 'Logistics'],
        ['part', 'Company size in range (50–500)', '55 — low edge'],
        ['pass', 'Contact can make the buying decision', 'Owner'],
        ['fail', 'Recent buying signal', 'None found']
      ],
      reasoning: 'The fit is plausible but thin: size sits at the bottom of the range and nothing points to an active project. Not strong enough to send on its own, not weak enough to drop — a person should look.',
      signals: ['No recent signal'],
      next: ['Held for human review', 'Not sent to the CRM until someone on the team confirms it.']
    },
    {
      name: 'Fictional Foods Co.', industry: 'Food distribution', size: '150 employees', location: 'Atlanta, GA',
      contact: 'IT Support Lead', score: 58, verdict: 'review',
      criteria: [
        ['pass', 'Industry matches the target profile', 'Distribution'],
        ['pass', 'Company size in range (50–500)', '150'],
        ['fail', 'Contact can make the buying decision', 'Individual contributor'],
        ['part', 'Recent buying signal', 'Tech-stack change']
      ],
      reasoning: 'The company fits, the contact does not. Worth keeping if a decision-maker can be found at the same company; the enrichment step is asked to look for one.',
      signals: ['Changed order-management tool'],
      next: ['Held for human review', 'Enrichment re-run to find a decision-maker contact.']
    },
    {
      name: 'Acme Industrial Supply', industry: 'Industrial wholesale', size: '1,900 employees', location: 'Chicago, IL',
      contact: 'Regional Sales Manager', score: 41, verdict: 'nofit',
      criteria: [
        ['pass', 'Industry matches the target profile', 'Wholesale'],
        ['fail', 'Company size in range (50–500)', '1,900'],
        ['fail', 'Contact can make the buying decision', 'Wrong function'],
        ['fail', 'Recent buying signal', 'None found']
      ],
      reasoning: 'Well outside the size range, and the contact sits in sales rather than operations. Sending this to the CRM would only add noise for the sales team.',
      signals: ['No recent signal'],
      next: ['Not sent to the CRM', 'Logged with the reason, so the same company is not re-scored next week.']
    },
    {
      name: 'Demo Dental Partners', industry: 'Dental practice', size: '18 employees', location: 'Orlando, FL',
      contact: 'Office Manager', score: 32, verdict: 'nofit',
      criteria: [
        ['part', 'Industry matches the target profile', 'Adjacent'],
        ['fail', 'Company size in range (50–500)', '18'],
        ['part', 'Contact can make the buying decision', 'Shared decision'],
        ['fail', 'Recent buying signal', 'None found']
      ],
      reasoning: 'Too small for the offer and no sign of a project. Dropped rather than parked.',
      signals: ['No recent signal'],
      next: ['Not sent to the CRM', 'Logged with the reason.']
    },
    {
      name: 'Test Property Management', industry: 'Property management', size: '75 employees', location: 'Fort Lauderdale, FL',
      contact: 'Leasing Coordinator', score: 45, verdict: 'nofit',
      criteria: [
        ['fail', 'Industry matches the target profile', 'Outside target'],
        ['pass', 'Company size in range (50–500)', '75'],
        ['fail', 'Contact can make the buying decision', 'Coordinator'],
        ['part', 'Recent buying signal', 'Generic hiring']
      ],
      reasoning: 'Right size, wrong industry and wrong contact. The hiring signal is generic and does not point to the problem the offer solves.',
      signals: ['General hiring'],
      next: ['Not sent to the CRM', 'Logged with the reason.']
    }
  ];

  var list = document.querySelector('[data-leads]');
  var detail = document.querySelector('[data-detail]');
  var shown = document.querySelector('[data-shown]');
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  if (!list || !detail) { return; }

  var selected = 0;
  var filter = 'all';

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) { node.className = cls; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function verdictPill(v) {
    return el('span', 'verdict ' + VERDICT[v].cls, VERDICT[v].label);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (n) {
    var kind = n.getAttribute('data-count');
    n.textContent = String(LEADS.filter(function (l) { return kind === 'all' || l.verdict === kind; }).length);
  });

  function renderList() {
    list.innerHTML = '';
    var count = 0;
    LEADS.forEach(function (lead, i) {
      if (filter !== 'all' && lead.verdict !== filter) { return; }
      count++;
      var li = el('li');
      var btn = el('button', 'lead');
      btn.type = 'button';
      btn.setAttribute('aria-current', i === selected ? 'true' : 'false');
      btn.appendChild(el('span', 'lead-name', lead.name));
      btn.appendChild(el('span', 'lead-meta', lead.industry + ' · ' + lead.size));
      var score = el('span', 'lead-score');
      score.appendChild(el('b', '', String(lead.score)));
      score.appendChild(verdictPill(lead.verdict));
      btn.appendChild(score);
      btn.addEventListener('click', function () {
        selected = i;
        renderList();
        renderDetail();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
    if (shown) { shown.textContent = count + ' of ' + LEADS.length; }
  }

  function renderDetail() {
    var lead = LEADS[selected];
    detail.innerHTML = '';

    var top = el('div', 'detail-top');
    var head = el('div');
    head.appendChild(el('h2', '', lead.name));
    head.appendChild(el('p', '', lead.industry + ' · ' + lead.size + ' · ' + lead.location));
    head.appendChild(el('p', '', 'Contact: ' + lead.contact));
    var pillWrap = el('p');
    pillWrap.appendChild(verdictPill(lead.verdict));
    pillWrap.className = 'mt';
    head.appendChild(pillWrap);
    top.appendChild(head);

    var ring = el('div', 'ring');
    ring.style.setProperty('--p', String(lead.score));
    ring.setAttribute('role', 'img');
    ring.setAttribute('aria-label', 'Fit score ' + lead.score + ' out of 100');
    var inner = el('div');
    inner.appendChild(el('b', '', String(lead.score)));
    inner.appendChild(el('small', '', 'fit / 100'));
    ring.appendChild(inner);
    top.appendChild(ring);
    detail.appendChild(top);

    detail.appendChild(el('h3', '', 'Criteria checked'));
    var crit = el('ul', 'criteria');
    var MARK = { pass: '✓', part: '~', fail: '✕' };
    var SR = { pass: 'Met', part: 'Partly met', fail: 'Not met' };
    lead.criteria.forEach(function (c) {
      var li = el('li', c[0]);
      var mark = el('span', 'mark', MARK[c[0]]);
      mark.setAttribute('aria-hidden', 'true');
      li.appendChild(mark);
      var label = el('span', '', c[1]);
      label.appendChild(el('span', 'visually-hidden', ' — ' + SR[c[0]]));
      li.appendChild(label);
      li.appendChild(el('span', 'val', c[2]));
      crit.appendChild(li);
    });
    detail.appendChild(crit);

    detail.appendChild(el('h3', '', 'Why the agent scored it this way'));
    detail.appendChild(el('p', 'reasoning', lead.reasoning));

    detail.appendChild(el('h3', '', 'Signals found during enrichment'));
    var sig = el('ul', 'signals');
    lead.signals.forEach(function (s) {
      var li = el('li');
      li.appendChild(el('span', 'tag', s));
      sig.appendChild(li);
    });
    detail.appendChild(sig);

    var next = el('div', 'next-step');
    next.appendChild(el('strong', '', lead.next[0]));
    next.appendChild(el('span', '', lead.next[1]));
    detail.appendChild(next);
  }

  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      filter = f.getAttribute('data-filter');
      filters.forEach(function (o) { o.setAttribute('aria-pressed', o === f ? 'true' : 'false'); });
      // Keep the detail in step with the list: jump to the first visible lead.
      if (filter !== 'all' && LEADS[selected].verdict !== filter) {
        for (var i = 0; i < LEADS.length; i++) {
          if (LEADS[i].verdict === filter) { selected = i; break; }
        }
        renderDetail();
      }
      renderList();
    });
  });

  renderList();
  renderDetail();
}());
