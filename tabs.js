// BGP Learning — Portfolio page tab switcher.
// Supports multiple independent tab groups on the same page via
// data-group. The main category tabs (data-group="main") and the
// nested Design sub-tabs (data-group="design-sub") each operate
// independently, so switching one never affects the other.
//
// Implements the WAI-ARIA tabs pattern: role="tab"/"tabpanel",
// aria-selected, aria-controls, roving tabindex, and Left/Right/
// Home/End keyboard navigation within each tab bar.
document.addEventListener('DOMContentLoaded', function () {
  var allButtons = document.querySelectorAll('.tab-btn');
  if (!allButtons.length) return;

  var groups = {};
  allButtons.forEach(function (btn) {
    var g = btn.dataset.group || 'main';
    groups[g] = groups[g] || [];
    groups[g].push(btn);
  });

  // Wire up ARIA relationships between each tab and its panel.
  allButtons.forEach(function (btn) {
    var g = btn.dataset.group || 'main';
    var panel = document.querySelector(
      '.tab-panel[data-group="' + g + '"][data-panel="' + btn.dataset.tab + '"]'
    );
    btn.setAttribute('role', 'tab');
    if (!btn.id) btn.id = 'tab-' + g + '-' + btn.dataset.tab;
    if (panel) {
      if (!panel.id) panel.id = 'panel-' + btn.dataset.tab;
      btn.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', btn.id);
      panel.setAttribute('tabindex', '0');
    }
  });

  function activate(group, tabId, focusTab) {
    document.querySelectorAll('.tab-btn[data-group="' + group + '"]').forEach(function (b) {
      var selected = b.dataset.tab === tabId;
      b.classList.toggle('active', selected);
      b.setAttribute('aria-selected', selected ? 'true' : 'false');
      b.setAttribute('tabindex', selected ? '0' : '-1');
      if (selected && focusTab) b.focus();
    });
    document.querySelectorAll('.tab-panel[data-group="' + group + '"]').forEach(function (p) {
      p.classList.toggle('active', p.dataset.panel === tabId);
    });
  }

  Object.keys(groups).forEach(function (group) {
    var btns = groups[group];

    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var tabId = btn.dataset.tab;
        activate(group, tabId);
        if (group === 'main') {
          history.replaceState(null, '', '#panel-' + tabId);
          var bar = document.querySelector('.tab-bar-wrap');
          if (bar) bar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      btn.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % btns.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + btns.length) % btns.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = btns.length - 1;
        if (next !== null) {
          e.preventDefault();
          activate(group, btns[next].dataset.tab, true);
          if (group === 'main') history.replaceState(null, '', '#panel-' + btns[next].dataset.tab);
        }
      });
    });

    // Initialize aria-selected / roving tabindex from the markup's
    // starting .active states.
    var current = btns.filter(function (b) { return b.classList.contains('active'); })[0] || btns[0];
    activate(group, current.dataset.tab);
  });

  // Deep link support: #panel-writing on load opens that top-level tab.
  var hash = window.location.hash.replace('#panel-', '');
  if (hash && document.querySelector('.tab-btn[data-group="main"][data-tab="' + hash + '"]')) {
    activate('main', hash);
  }
});
