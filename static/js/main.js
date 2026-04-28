// ─── Theme Toggle ─────────────────────────────────────────────
(function () {
  const html   = document.documentElement;
  const STORAGE_KEY = 'qlkh-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Theme is already applied by the inline script in <head>.
  // Wire up the button once DOM is ready.
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
})();

// ─── App Init ─────────────────────────────────────────────────
// Auto-dismiss alerts
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => { alert.style.animation = 'slideIn .3s ease reverse'; setTimeout(() => alert.remove(), 300); }, 5000);
    alert.querySelector('.alert-close')?.addEventListener('click', () => {
      alert.style.animation = 'slideIn .3s ease reverse';
      setTimeout(() => alert.remove(), 300);
    });
  });

  // Auto-calculate total amount
  const qtyEl   = document.getElementById('id_quantity');
  const priceEl = document.getElementById('id_unit_price');
  const totalEl = document.getElementById('id_total_amount');
  if (qtyEl && priceEl && totalEl) {
    const calc = () => {
      const q = parseInt(qtyEl.value) || 0;
      const p = parseInt(priceEl.value) || 0;
      if (q > 0 && p > 0) totalEl.value = q * p;
    };
    qtyEl.addEventListener('input', calc);
    priceEl.addEventListener('input', calc);
  }

  // Format currency inputs on blur
  document.querySelectorAll('#id_unit_price, #id_total_amount').forEach(el => {
    el.addEventListener('blur', () => {
      const v = parseInt(el.value.replace(/\D/g,'')) || 0;
      el.value = v;
    });
  });

  // Confirm delete
  document.querySelectorAll('[data-confirm]').forEach(btn => {
    btn.addEventListener('click', e => {
      if (!confirm(btn.dataset.confirm)) e.preventDefault();
    });
  });

  // Mobile sidebar toggle
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  toggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));
});

// Format number to VND
function formatVND(n) {
  return new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'}).format(n);
}
