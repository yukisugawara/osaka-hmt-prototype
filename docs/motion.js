/* motion.js — 現代的な動きを付与する軽量スクリプト
   - スクロールでのフェードイン（IntersectionObserver）
   - 5専攻ボタンのスタッガー登場
   - ヘッダーのスクロール圧縮
   - お知らせタブのクロスフェード
   - prefers-reduced-motion 尊重
*/
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js-motion');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 1) 5専攻ボタンのスタッガー（CSSアニメ発火用の変数を付与）----
  var heroCards = document.querySelectorAll('.majors .major-card');
  heroCards.forEach(function (el, i) {
    el.style.setProperty('--stagger', (i * 0.08) + 's');
  });

  // ---- 2) スクロール連動のフェードイン ----
  var revealTargets = document.querySelectorAll(
    '.news-card, .course, .major-hero__grid > *, .major-lead, .major-courses__header, .section-title'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    // フォールバック：全て表示
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- 3) ヘッダーのスクロール圧縮 ----
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- 4) お知らせタブのクロスフェード ----
  var tabs = document.querySelectorAll('.news-tabs [role="tab"]');
  var panels = document.querySelectorAll('[data-panel]');

  // 初期に可視のパネルには .is-active を付与（CSS で opacity:1）
  panels.forEach(function (p) {
    if (!p.hidden) p.classList.add('is-active');
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      panels.forEach(function (p) {
        var shouldShow = (p.dataset.panel === tab.dataset.tab);
        if (shouldShow) {
          p.hidden = false;
          // 次フレームで is-active を付与してフェードイン
          requestAnimationFrame(function () {
            p.classList.add('is-active');
          });
        } else {
          p.classList.remove('is-active');
          // フェード完了後に hidden に
          setTimeout(function () {
            if (!p.classList.contains('is-active')) p.hidden = true;
          }, 260);
        }
      });
    });
  });
})();
