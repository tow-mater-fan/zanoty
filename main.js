/* ===== Settings: paste your links here ===== */
var STRIPE_LINKS = {
  one: '',   // Stripe Payment Link for the single notebook ($6.50)
  three: '', // Stripe Payment Link for the three pack ($19.50)
  class: ''  // Stripe Payment Link for the class set of 30 ($195.00)
};
var ORDER_EMAIL = 'hello@zanoty.com'; // Orders from the checkout page are emailed here
var SHIPPING = 4.99;      // Flat shipping
var FREE_SHIPPING_OVER = 35;
/* =========================================== */

(function () {
  var PRICES = { one: 6.5, three: 19.5, class: 195 };
  function money(v) { return '$' + v.toFixed(2); }

  /* Shop page */
  var buyBtn = document.getElementById('buyBtn');
  if (buyBtn) {
    var priceEl = document.getElementById('price');
    var status = document.getElementById('buyStatus');
    var radios = document.querySelectorAll('input[name="pack"]');
    var pick = new URLSearchParams(location.search).get('pack');
    if (pick && PRICES[pick]) {
      radios.forEach(function (r) { r.checked = r.value === pick; });
    }
    function current() {
      var c = document.querySelector('input[name="pack"]:checked');
      return c ? c.value : 'one';
    }
    function update() {
      var p = current();
      priceEl.textContent = money(PRICES[p]);
      buyBtn.textContent = 'Buy, ' + money(PRICES[p]);
      status.textContent = '';
    }
    radios.forEach(function (r) { r.addEventListener('change', update); });
    update();
    buyBtn.addEventListener('click', function () {
      var link = STRIPE_LINKS[current()];
      window.location.href = link ? link : 'checkout.html?pack=' + current();
    });

    var main = document.getElementById('galleryMain');
    document.querySelectorAll('.thumbs button').forEach(function (b) {
      b.addEventListener('click', function () {
        main.src = b.dataset.src;
        main.alt = b.dataset.alt;
        document.querySelectorAll('.thumbs button').forEach(function (x) {
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
      });
    });
  }

  /* Try a page: square graph from -10 to 10 */
  var plot = document.getElementById('plot');
  if (plot) {
    var svg = plot.querySelector('svg');
    var NS = 'http://www.w3.org/2000/svg';
    var g = '';
    for (var i = 0; i <= 20; i++) {
      var major = i % 5 === 0;
      var c = major ? '#8FA7B3' : '#D4DEE3';
      g += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="20" stroke="' + c + '" stroke-width="' + (major ? 1.2 : 0.8) + '" vector-effect="non-scaling-stroke"/>';
      g += '<line x1="0" y1="' + i + '" x2="20" y2="' + i + '" stroke="' + c + '" stroke-width="' + (major ? 1.2 : 0.8) + '" vector-effect="non-scaling-stroke"/>';
    }
    g += '<line x1="10" y1="0" x2="10" y2="20" stroke="#16293A" stroke-width="2" vector-effect="non-scaling-stroke"/>';
    g += '<line x1="0" y1="10" x2="20" y2="10" stroke="#16293A" stroke-width="2" vector-effect="non-scaling-stroke"/>';
    [-10, -5, 5, 10].forEach(function (n) {
      g += '<text x="' + (n + 10 + (n === 10 ? -0.35 : n === -10 ? 0.35 : 0)) + '" y="10.9" font-size="0.62" text-anchor="middle" fill="#16293A" font-family="Nunito, sans-serif">' + n + '</text>';
      g += '<text x="10.25" y="' + (10 - n + (n === 10 ? 0.6 : n === -10 ? -0.2 : 0.2)) + '" font-size="0.62" fill="#16293A" font-family="Nunito, sans-serif">' + n + '</text>';
    });
    g += '<text x="9.55" y="10.9" font-size="0.62" fill="#16293A" font-family="Nunito, sans-serif">0</text>';
    g += '<polyline id="poly" points="" fill="none" stroke="#1C7684" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>';
    g += '<g id="dots"></g>';
    svg.innerHTML = g;
    var pts = [];
    var coords = document.getElementById('coords');
    function draw() {
      document.getElementById('poly').setAttribute('points', pts.map(function (p) { return (p.x + 10) + ',' + (10 - p.y); }).join(' '));
      var dots = document.getElementById('dots');
      dots.innerHTML = '';
      pts.forEach(function (p) {
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', p.x + 10); c.setAttribute('cy', 10 - p.y); c.setAttribute('r', 0.32);
        c.setAttribute('fill', '#16293A'); c.setAttribute('stroke', '#FFFFFF'); c.setAttribute('stroke-width', 0.1);
        dots.appendChild(c);
      });
      coords.textContent = pts.length ? pts.map(function (p) { return '(' + p.x + ', ' + p.y + ')'; }).join('   ') : 'No points yet.';
    }
    plot.addEventListener('click', function (e) {
      var r = plot.getBoundingClientRect();
      var x = Math.round((e.clientX - r.left) / r.width * 20) - 10;
      var y = 10 - Math.round((e.clientY - r.top) / r.height * 20);
      pts.push({ x: Math.max(-10, Math.min(10, x)), y: Math.max(-10, Math.min(10, y)) });
      if (pts.length > 12) pts.shift();
      draw();
    });
    document.getElementById('clearPlot').addEventListener('click', function () { pts = []; draw(); });
    draw();
  }


  /* Checkout page */
  var orderForm = document.getElementById('orderForm');
  if (orderForm) {
    var NAMES = { one: 'Single notebook', three: 'Three pack', class: 'Class set of 30' };
    var IMGS = { one: 'images/pack-1.jpg', three: 'images/pack-3.jpg', class: 'images/pack-30.jpg' };
    var qty = 1;
    var startPack = new URLSearchParams(location.search).get('pack');
    if (startPack && PRICES[startPack]) {
      document.querySelectorAll('input[name="cpack"]').forEach(function (r) { r.checked = r.value === startPack; });
    }
    var hasCard = Object.keys(STRIPE_LINKS).some(function (k) { return STRIPE_LINKS[k]; });
    var cardRadio = document.getElementById('cardRadio');
    if (!hasCard) { cardRadio.disabled = true; document.getElementById('cardOpt').classList.add('disabled'); }
    else { document.getElementById('cardNote').textContent = 'Pay securely with Stripe'; }

    function pack() { return document.querySelector('input[name="cpack"]:checked').value; }
    function totals() {
      var sub = PRICES[pack()] * qty;
      var ship = sub >= FREE_SHIPPING_OVER ? 0 : SHIPPING;
      return { sub: sub, ship: ship, total: sub + ship };
    }
    function render() {
      var t = totals();
      document.getElementById('qty').textContent = qty;
      document.getElementById('sumName').textContent = NAMES[pack()];
      document.getElementById('sumEach').textContent = money(PRICES[pack()]) + ' each';
      document.getElementById('sumImg').src = IMGS[pack()];
      document.getElementById('tSub').textContent = money(t.sub);
      document.getElementById('tShip').textContent = t.ship ? money(t.ship) : 'Free';
      document.getElementById('tTotal').textContent = money(t.total);
    }
    document.querySelectorAll('input[name="cpack"]').forEach(function (r) { r.addEventListener('change', render); });
    document.getElementById('qtyMinus').addEventListener('click', function () { qty = Math.max(1, qty - 1); render(); });
    document.getElementById('qtyPlus').addEventListener('click', function () { qty = Math.min(99, qty + 1); render(); });
    render();

    var oStatus = document.getElementById('orderStatus');
    function done(text) {
      document.getElementById('checkoutArea').hidden = true;
      document.getElementById('confirmText').textContent = text;
      document.getElementById('confirm').hidden = false;
      window.scrollTo(0, 0);
    }
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      orderForm.querySelectorAll('[required]').forEach(function (f) {
        var ok = f.value.trim() !== '' && (f.type !== 'email' || f.value.indexOf('@') > 0);
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !bad) bad = f;
      });
      if (bad) { oStatus.textContent = 'Fill in the highlighted fields.'; bad.focus(); return; }
      var pay = orderForm.querySelector('input[name="payment"]:checked').value;
      if (pay === 'Card') { window.location.href = STRIPE_LINKS[pack()]; return; }

      var t = totals();
      var fd = new FormData(orderForm);
      var order = NAMES[pack()] + ' x ' + qty;
      fd.append('order', order);
      fd.append('subtotal', money(t.sub));
      fd.append('shipping', t.ship ? money(t.ship) : 'Free');
      fd.append('total', money(t.total));
      var next = pay === 'Interac e-Transfer'
        ? 'Total: ' + money(t.total) + '. E-Transfer details will be sent to ' + fd.get('email') + '.'
        : 'Total: ' + money(t.total) + ', paid on delivery.';

      {
        var lines = ['New Zanoty order', '', 'Order: ' + order, 'Total: ' + money(t.total) + ' (shipping ' + (t.ship ? money(t.ship) : 'free') + ')', 'Payment: ' + pay, '',
          'Name: ' + fd.get('name'), 'Email: ' + fd.get('email'), 'Phone: ' + fd.get('phone'),
          'Address: ' + fd.get('address') + ', ' + fd.get('city') + ', ' + fd.get('province') + ' ' + fd.get('postal') + ', ' + fd.get('country'),
          'Notes: ' + (fd.get('notes') || 'None')];
        window.location.href = 'mailto:' + ORDER_EMAIL + '?subject=' + encodeURIComponent('Zanoty order: ' + order) + '&body=' + encodeURIComponent(lines.join('\n'));
        done('Send the email that just opened to confirm. ' + next);
      }
    });
  }

})();
