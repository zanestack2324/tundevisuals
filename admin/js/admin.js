(function() {
  'use strict';

  if (!sessionStorage.getItem('tv_admin')) {
    window.location.href = 'index.html';
    return;
  }

  var $ = function(id) { return document.getElementById(id); };

  /* ─── DEFAULTS ─── */
  var DEFAULT_GALLERY = [
    { src: '../PHOTOS/ALBUM%20ART/Img%207.jpeg', category: 'albumart', label: 'Album Art' },
    { src: '../PHOTOS/ALBUM%20ART/Img8.jpeg', category: 'albumart', label: 'Album Art' },
    { src: '../PHOTOS/BIRTHDAYS/1(1).jpg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/7%20(2).jpg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/Image%2010.jpeg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/Image%206.jpeg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/img%204.jpeg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/Img%205.jpeg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/IMG_1221.JPG.jpeg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/IMG_1367.JPG.jpeg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/IMG_1773.JPG.jpeg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/IMG_1775.JPG.jpeg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/BIRTHDAYS/IMG_1934.JPG.jpeg', category: 'birthdays', label: 'Birthday' },
    { src: '../PHOTOS/COUPLES/Image%2011.JPEG', category: 'couples', label: 'Couples' },
    { src: '../PHOTOS/COUPLES/Image%2012.jpeg', category: 'couples', label: 'Couples' },
    { src: '../PHOTOS/COUPLES/Image%209.jpeg', category: 'couples', label: 'Couples' }
  ];

  var DEFAULT_SERVICES = [
    { title: 'Birthday / Portrait', desc: "Celebrate life's moments with stunning portraits and birthday shoots that tell your unique story." },
    { title: 'Headshots & Branding', desc: 'Professional headshots and brand imagery that capture your personality and elevate your presence.' },
    { title: 'Weddings', desc: 'Cinematic wedding films and timeless photographs that weave your love story into lasting memories.' },
    { title: 'Music Videos', desc: 'Dynamic music video production — from concept development to final cut — for artists and labels.' },
    { title: 'Event Coverage', desc: 'Full-day event coverage with multi-camera setups, aerial shots, and same-day edits available.' }
  ];

  var DEFAULT_REVIEWS = [
    { author: 'Sarah & Michael', role: 'Wedding Clients', text: 'Tunde Visuals brought our wedding vision to life in ways we never imagined. The cinematic quality of our highlight film still moves us to tears every time we watch it.' },
    { author: 'Damilola Adebayo', role: 'Recording Artist', text: 'Working with Tunde on our music video was an incredible experience. He understood our artistic vision from day one and delivered beyond expectations.' },
    { author: 'Oluwaseun Bankole', role: 'Brand Director', text: "The attention to detail, quick turnaround, and professional demeanor made the entire process seamless. Highly recommended!" }
  ];

  /* ─── DATA HELPERS ─── */
  function getData(key, fallback) {
    try {
      var val = localStorage.getItem('tv_' + key);
      return val ? JSON.parse(val) : fallback;
    } catch(e) { return fallback; }
  }

  function setData(key, val) {
    localStorage.setItem('tv_' + key, JSON.stringify(val));
  }

  /* ─── TABS ─── */
  var tabs = [].slice.call(document.querySelectorAll('.nav-tab'));
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      tabs.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      var target = this.getAttribute('data-tab');
      [].slice.call(document.querySelectorAll('.admin-tab')).forEach(function(t) { t.classList.remove('active'); });
      var el = document.getElementById('tab-' + target);
      if (el) el.classList.add('active');
    });
  });

  /* ─── LOGOUT ─── */
  $('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    sessionStorage.removeItem('tv_admin');
    window.location.href = 'index.html';
  });

  /* ─── DASHBOARD STATS ─── */
  function updateStats() {
    var gallery = getData('gallery', DEFAULT_GALLERY);
    var services = getData('services', DEFAULT_SERVICES);
    var reviews = getData('reviews', DEFAULT_REVIEWS);
    $('statGallery').textContent = gallery.length;
    $('statServices').textContent = services.length;
    $('statReviews').textContent = reviews.length;
  }
  updateStats();

  /* ─── GALLERY ─── */
  function renderAdminGallery() {
    var grid = $('adminGalleryGrid');
    var gallery = getData('gallery', DEFAULT_GALLERY);
    grid.innerHTML = '';
    gallery.forEach(function(item, i) {
      var div = document.createElement('div');
      div.className = 'admin-gallery-item';
      div.innerHTML = '<img src="' + item.src + '" alt="' + item.label + '" loading="lazy">' +
        '<span class="item-category">' + item.category + '</span>' +
        '<button class="item-remove" data-index="' + i + '">&#10005;</button>';
      div.querySelector('.item-remove').addEventListener('click', function() {
        removeGalleryItem(parseInt(this.getAttribute('data-index')));
      });
      grid.appendChild(div);
    });
  }

  function removeGalleryItem(index) {
    var gallery = getData('gallery', DEFAULT_GALLERY);
    gallery.splice(index, 1);
    setData('gallery', gallery);
    renderAdminGallery();
    updateStats();
  }

  $('addGalleryBtn').addEventListener('click', function() {
    var category = $('galleryCategory').value;
    var file = $('galleryFile').files[0];
    var url = $('galleryUrl').value.trim();
    var status = $('galleryStatus');

    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var gallery = getData('gallery', DEFAULT_GALLERY);
        gallery.push({ src: e.target.result, category: category, label: category.charAt(0).toUpperCase() + category.slice(1) });
        setData('gallery', gallery);
        renderAdminGallery();
        updateStats();
        $('galleryFile').value = '';
        status.textContent = 'Image added successfully!';
        status.className = 'form-status success';
      };
      reader.readAsDataURL(file);
    } else if (url) {
      var gallery = getData('gallery', DEFAULT_GALLERY);
      gallery.push({ src: url, category: category, label: category.charAt(0).toUpperCase() + category.slice(1) });
      setData('gallery', gallery);
      renderAdminGallery();
      updateStats();
      $('galleryUrl').value = '';
      status.textContent = 'Image added successfully!';
      status.className = 'form-status success';
    } else {
      status.textContent = 'Please select a file or enter a URL.';
      status.className = 'form-status error';
    }
  });

  $('resetGalleryBtn').addEventListener('click', function() {
    if (confirm('Reset gallery to default images? This removes all custom additions.')) {
      setData('gallery', DEFAULT_GALLERY);
      renderAdminGallery();
      updateStats();
      $('galleryStatus').textContent = 'Gallery reset to default.';
      $('galleryStatus').className = 'form-status success';
    }
  });

  renderAdminGallery();

  /* ─── CONTENT ─── */
  function loadContent() {
    var content = getData('content', {});
    if (content.heroSub) $('content-heroSub').value = content.heroSub;
    if (content.about1) $('content-about1').value = content.about1;
    if (content.about2) $('content-about2').value = content.about2;
  }
  loadContent();

  $('saveContentBtn').addEventListener('click', function() {
    var content = {
      heroSub: $('content-heroSub').value,
      about1: $('content-about1').value,
      about2: $('content-about2').value
    };
    setData('content', content);
    var status = $('contentStatus');
    status.textContent = 'Content saved successfully!';
    status.className = 'form-status success';
    setTimeout(function() { status.className = 'form-status'; }, 3000);
  });

  /* ─── SERVICES ─── */
  function renderServicesEditor() {
    var container = $('servicesEditor');
    var services = getData('services', DEFAULT_SERVICES);
    container.innerHTML = '';
    services.forEach(function(svc, i) {
      var div = document.createElement('div');
      div.className = 'service-edit-card';
      div.innerHTML =
        '<div class="full-width"><label>Title</label><input type="text" class="svc-title" value="' + escHtml(svc.title) + '"></div>' +
        '<div class="full-width"><label>Description</label><textarea class="svc-desc" rows="2">' + escHtml(svc.desc) + '</textarea></div>';
      container.appendChild(div);
    });
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  renderServicesEditor();

  $('saveServicesBtn').addEventListener('click', function() {
    var cards = [].slice.call(document.querySelectorAll('.service-edit-card'));
    var services = cards.map(function(card) {
      return {
        title: card.querySelector('.svc-title').value,
        desc: card.querySelector('.svc-desc').value
      };
    });
    setData('services', services);
    var status = $('servicesStatus');
    status.textContent = 'Services saved successfully!';
    status.className = 'form-status success';
    updateStats();
    setTimeout(function() { status.className = 'form-status'; }, 3000);
  });

  /* ─── REVIEWS ─── */
  function renderReviewsEditor() {
    var container = $('reviewsEditor');
    var reviews = getData('reviews', DEFAULT_REVIEWS);
    container.innerHTML = '';
    reviews.forEach(function(rev, i) {
      var div = document.createElement('div');
      div.className = 'review-edit-card';
      div.innerHTML =
        '<button class="remove-review" data-index="' + i + '">&#10005;</button>' +
        '<label>Author Name</label><input type="text" class="rev-author" value="' + escHtml(rev.author) + '">' +
        '<label>Role</label><input type="text" class="rev-role" value="' + escHtml(rev.role) + '">' +
        '<label>Review Text</label><textarea class="rev-text" rows="3">' + escHtml(rev.text) + '</textarea>';
      div.querySelector('.remove-review').addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-index'));
        var reviews = getData('reviews', DEFAULT_REVIEWS);
        reviews.splice(idx, 1);
        setData('reviews', reviews);
        renderReviewsEditor();
        updateStats();
      });
      container.appendChild(div);
    });
  }

  renderReviewsEditor();

  $('addReviewBtn').addEventListener('click', function() {
    var reviews = getData('reviews', DEFAULT_REVIEWS);
    reviews.push({ author: 'New Client', role: 'Client', text: 'Amazing work! Highly recommend.' });
    setData('reviews', reviews);
    renderReviewsEditor();
    updateStats();
  });

  $('saveReviewsBtn').addEventListener('click', function() {
    var cards = [].slice.call(document.querySelectorAll('.review-edit-card'));
    var reviews = cards.map(function(card) {
      return {
        author: card.querySelector('.rev-author').value,
        role: card.querySelector('.rev-role').value,
        text: card.querySelector('.rev-text').value
      };
    });
    setData('reviews', reviews);
    var status = $('reviewsStatus');
    status.textContent = 'Reviews saved successfully!';
    status.className = 'form-status success';
    updateStats();
    setTimeout(function() { status.className = 'form-status'; }, 3000);
  });

})();
