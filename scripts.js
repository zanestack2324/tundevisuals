(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var $footerCopy = $('footerCopy');
  if ($footerCopy) {
    $footerCopy.textContent = '\u00A9 ' + new Date().getFullYear() + ' Tunde Visuals Studio. All rights reserved.';
  }

  var bgMusic = $('bgMusic');
  var clickSound = $('clickSound');
  var audioToggle = $('audioToggle');
  var musicIndicator = $('musicIndicator');
  var isPlaying = false;
  var audioStarted = false;

  try {
    var saved = sessionStorage.getItem('tv_audio');
    if (saved && bgMusic) {
      var state = JSON.parse(saved);
      if (state.currentTime) bgMusic.currentTime = state.currentTime;
      if (state.isPlaying) {
        bgMusic.play().catch(function(){});
        isPlaying = true;
        audioStarted = true;
        if (musicIndicator) musicIndicator.classList.add('active');
      }
    }
  } catch(e) {}

  window.addEventListener('beforeunload', function() {
    if (bgMusic) {
      sessionStorage.setItem('tv_audio', JSON.stringify({
        currentTime: bgMusic.currentTime,
        isPlaying: isPlaying
      }));
    }
  });

  function startBgMusic() {
    if (audioStarted) return;
    audioStarted = true;
    bgMusic.play().catch(function(){});
    isPlaying = true;
    if (musicIndicator) musicIndicator.classList.add('active');
  }

  function toggleBgMusic(e) {
    if (e) e.stopPropagation();
    if (!audioStarted) {
      audioStarted = true;
      bgMusic.play().catch(function(){});
      isPlaying = true;
      if (musicIndicator) musicIndicator.classList.add('active');
      return;
    }
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
    } else {
      bgMusic.play().catch(function(){});
      isPlaying = true;
    }
    if (musicIndicator) musicIndicator.classList.toggle('active', isPlaying);
  }

  function playClickSound(e) {
    if (!clickSound || !audioStarted) return;
    var target = e.target;
    if (target.matches('a, button, input, textarea, select, .btn-press, .gallery-tab, .hamburger, .audio-toggle, .scroll-top, .social-link, .lightbox-close, .lightbox-nav, .testimonial-dot')) {
      clickSound.currentTime = 0;
      clickSound.play().catch(function(){});
    }
  }

  document.addEventListener('click', function(e) {
    if (!audioStarted) startBgMusic();
    playClickSound(e);
  });
  document.addEventListener('touchstart', function() {
    if (!audioStarted) startBgMusic();
  });

  if (audioToggle) {
    audioToggle.addEventListener('click', toggleBgMusic);
  }
  if (musicIndicator) {
    musicIndicator.addEventListener('click', toggleBgMusic);
  }

  var navbar = $('navbar');
  if (navbar) {
    var tickingNav = false;
    window.addEventListener('scroll', function() {
      if (!tickingNav) {
        tickingNav = true;
        requestAnimationFrame(function() {
          navbar.classList.toggle('scrolled', (window.pageYOffset || document.documentElement.scrollTop) > 60);
          tickingNav = false;
        });
      }
    }, { passive: true });
  }

  var heroVideo = $('heroVideo');
  if (heroVideo) {
    var videoDuration = 0;
    var targetTime = 0;
    var seeking = false;
    var scrollTicking = false;

    heroVideo.addEventListener('loadedmetadata', function() {
      videoDuration = heroVideo.duration;
    });

    heroVideo.load();

    window.addEventListener('scroll', function() {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(function() {
          var scrollY = window.pageYOffset || document.documentElement.scrollTop;
          var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (!videoDuration || maxScroll <= 0) { scrollTicking = false; return; }
          var newTarget = Math.min(scrollY / maxScroll, 1) * videoDuration;
          if (Math.abs(newTarget - heroVideo.currentTime) > 0.04) {
            heroVideo.currentTime = newTarget;
          }
          scrollTicking = false;
        });
      }
    }, { passive: true });
  }

  (function() {
    var navBtns = document.querySelectorAll('.nav-links button[data-target]');
    for (var i = 0; i < navBtns.length; i++) {
      navBtns[i].addEventListener('click', function() {
        var target = this.getAttribute('data-target');
        if (target) {
          if (target.charAt(0) === '#') {
            var el = document.querySelector(target);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = target;
          }
        }
      });
    }
  })();

  (function() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var isHomePage = page === 'index.html' || page === '';
    var navItems = document.querySelectorAll('.nav-links > button, .nav-links > a');
    for (var i = 0; i < navItems.length; i++) {
      var item = navItems[i];
      var target = item.getAttribute('data-target') || item.getAttribute('href');
      if (isHomePage) {
        if (target === '#home' || target === 'index.html' || target === '#') {
          item.classList.add('active');
          break;
        }
      } else if (target === page) {
        item.classList.add('active');
        break;
      }
    }
  })();

  var hamburger = $('hamburger');
  var navLinks = $('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      var expanded = hamburger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
      hamburger.setAttribute('aria-expanded', expanded);
    });
  }

  var scrollTop = $('scrollTop');
  if (scrollTop) {
    scrollTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-zoom, .reveal-rotate, .reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-slide-up, .reveal-slide-down';
  var revealElements = [].slice.call(document.querySelectorAll(revealSelectors));

  if (window.IntersectionObserver) {
    var revealObserver = new IntersectionObserver(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('visible');
          revealObserver.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    for (var i = 0; i < revealElements.length; i++) {
      revealObserver.observe(revealElements[i]);
    }
  } else {
    for (var i = 0; i < revealElements.length; i++) {
      revealElements[i].classList.add('visible');
    }
  }

})();
