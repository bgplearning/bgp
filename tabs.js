// BGP Learning — Portfolio page tab switcher.
// Supports multiple independent tab groups on the same page via
// data-group. The main category tabs (data-group="main") and the
// nested Design sub-tabs (data-group="design-sub") each operate
// independently, so switching one never affects the other.
document.addEventListener('DOMContentLoaded', function () {
  var allButtons = document.querySelectorAll('.tab-btn');
  if (!allButtons.length) return;

  var groups = {};
  allButtons.forEach(function (btn) {
    var g = btn.dataset.group || 'main';
    groups[g] = groups[g] || [];
    groups[g].push(btn);
  });

  function activate(group, tabId) {
    document.querySelectorAll('.tab-btn[data-group="' + group + '"]').forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-panel[data-group="' + group + '"]').forEach(function (p) {
      p.classList.toggle('active', p.dataset.panel === tabId);
    });
  }

  Object.keys(groups).forEach(function (group) {
    groups[group].forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tabId = btn.dataset.tab;
        activate(group, tabId);
        if (group === 'main') {
          history.replaceState(null, '', '#panel-' + tabId);
          var bar = document.querySelector('.tab-bar-wrap');
          if (bar) bar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  });

  // deep link support: #panel-writing on load opens that top-level tab
  var hash = window.location.hash.replace('#panel-', '');
  if (hash && document.querySelector('.tab-btn[data-group="main"][data-tab="' + hash + '"]')) {
    activate('main', hash);
  }
});
