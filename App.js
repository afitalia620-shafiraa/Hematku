/* ================================================
   HEMATKU — App.js  (v2 — Fresh Candy Redesign)
   ================================================ */

var user  = null;
var kat   = 'Makan';
var tipsI = 0;
var dark  = false;

var TIPS = [
  '🥗 Bawa bekal dari rumah bisa hemat Rp15.000–25.000 per hari!',
  '🧋 Kurangi minuman kekinian — 1 minuman Rp20.000 × 5x seminggu = Rp100.000!',
  '📝 Catat setiap pengeluaran, sekecil apapun. Kesadaran adalah kunci hemat!',
  '🚶 Jika jarak dekat, coba jalan kaki — sehat dan hemat ongkos!',
  '💳 Hindari belanja impulsif. Tunggu 24 jam sebelum membeli barang tak direncanakan.',
  '🎯 Tentukan anggaran harian di awal dan jangan melewatinya!',
  '🤝 Patungan makanan dengan teman bisa lebih hemat daripada beli sendiri!',
  '📚 Gunakan perpustakaan sekolah sebelum beli buku baru!',
  '💰 Sisihkan minimal 10% dari uang saku untuk ditabung sebelum belanja!',
  '🏷️ Bandingkan harga sebelum membeli — selisih kecil bisa besar dalam sebulan!',
  '🍳 Masak mi instan di kos lebih hemat daripada beli di warung tiap hari!',
  '📲 Manfaatkan promo dan cashback aplikasi dompet digital dengan bijak!',
];

var ICON   = { Makan:'🍛', Transport:'🚌', Jajan:'🍭', Belajar:'📚', Lainnya:'📦' };
var ICCLS  = { Makan:'ic-makan', Transport:'ic-transport', Jajan:'ic-jajan', Belajar:'ic-belajar', Lainnya:'ic-lainnya' };
var BARCOL = { Makan:'#FFB020', Transport:'#6C3BFF', Jajan:'#FF4D8D', Belajar:'#00D4AA', Lainnya:'#9B5FFF' };

/* ── INIT ── */
window.addEventListener('DOMContentLoaded', function () {
  loadDark();
  var saved = localStorage.getItem('hku_user');
  if (saved) { user = JSON.parse(saved); initApp(); }
  else goto('page-login');
  setToday();
  pickTips();
});

function setToday() {
  var el = document.getElementById('i-tgl');
  if (el) el.value = new Date().toISOString().slice(0, 10);
}

/* ── NAVIGASI ── */
function goto(id) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) pages[i].classList.remove('active');
  var pg = document.getElementById(id);
  if (pg) { pg.classList.add('active'); window.scrollTo(0, 0); }
}

function switchTab(btn) {
  var btns   = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');
  for (var i = 0; i < btns.length; i++)   btns[i].classList.remove('active');
  for (var j = 0; j < panels.length; j++) panels[j].classList.remove('active');
  btn.classList.add('active');
  var panel = document.getElementById(btn.getAttribute('data-tab'));
  if (panel) panel.classList.add('active');
  renderAll();
  window.scrollTo(0, 0);
}

function goTab(id) {
  var btn = document.querySelector('[data-tab="' + id + '"]');
  if (btn) switchTab(btn);
}

/* ── AUTH ── */
function doLogin() {
  var email = (document.getElementById('li-email').value || '').trim();
  var pass  = document.getElementById('li-pass').value || '';
  if (!email || !pass)             { toast('Peringatan', 'Email dan password harus diisi!', 'warn');  return; }
  if (email.indexOf('@') === -1)   { toast('Format Salah', 'Masukkan email yang valid!', 'error');     return; }

  var users = JSON.parse(localStorage.getItem('hku_users') || '[]');
  var found = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].pass === pass) { found = users[i]; break; }
  }
  if (!found) { toast('Gagal Masuk', 'Email atau password salah!', 'error'); return; }

  user = found;
  localStorage.setItem('hku_user', JSON.stringify(user));
  toast('Yeay! 🎉', 'Selamat datang, ' + user.name + '!', 'success');
  initApp();
}

function doRegister() {
  var name  = (document.getElementById('rg-name').value  || '').trim();
  var email = (document.getElementById('rg-email').value || '').trim();
  var pass  =  document.getElementById('rg-pass').value  || '';
  if (!name || !email || !pass) { toast('Peringatan', 'Semua kolom harus diisi!', 'warn');         return; }
  if (email.indexOf('@') === -1){ toast('Format Salah', 'Masukkan email yang valid!', 'error');     return; }
  if (pass.length < 6)          { toast('Password Lemah', 'Password minimal 6 karakter!', 'warn'); return; }

  var users = JSON.parse(localStorage.getItem('hku_users') || '[]');
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) { toast('Email Dipakai', 'Email sudah terdaftar!', 'error'); return; }
  }

  var u = { name: name, email: email, pass: pass, at: Date.now() };
  users.push(u);
  localStorage.setItem('hku_users', JSON.stringify(users));
  user = u;
  localStorage.setItem('hku_user', JSON.stringify(u));
  toast('Akun Dibuat! ', 'Halo ' + name + ', selamat bergabung!', 'success');
  initApp();
}

function doLogout() {
  user = null;
  localStorage.removeItem('hku_user');
  goto('page-login');
  document.getElementById('li-email').value = '';
  document.getElementById('li-pass').value  = '';
  toast('Sampai Jumpa! ', 'Kamu berhasil keluar.', 'info');
}

/* ── INIT DASHBOARD ── */
function initApp() {
  goto('page-dashboard');
  var h     = new Date().getHours();
  var salam = h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
  document.getElementById('greeting').textContent = salam + ', ' + user.name.split(' ')[0] + '!';
  var tgl = new Date(user.at).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
  document.getElementById('profile-info').textContent = '📧 ' + user.email + ' • Bergabung ' + tgl;
  var ib = document.getElementById('i-batas');
  if (ib) ib.value = getBatas();
  pickTips();
  renderAll();
}

/* ── DATA HELPERS ── */
function key(k)    { return 'hku_' + user.email + '_' + k; }
function getData() { return JSON.parse(localStorage.getItem(key('trx')) || '[]'); }
function saveData(d){ localStorage.setItem(key('trx'), JSON.stringify(d)); }
function getBatas() { return parseInt(localStorage.getItem(key('batas')) || '300000'); }

/* ── AKSI ── */
function pilihKat(btn) {
  var pills = document.querySelectorAll('.pill');
  for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
  btn.classList.add('active');
  kat = btn.getAttribute('data-kat');
}

function simpan() {
  var tgl  = document.getElementById('i-tgl').value;
  var jml  = parseInt(document.getElementById('i-jml').value);
  var note = (document.getElementById('i-note').value || '').trim();
  if (!tgl)          { toast('Peringatan', 'Pilih tanggal dulu!', 'warn');             return; }
  if (!jml || jml <= 0) { toast('Peringatan', 'Masukkan jumlah yang valid!', 'warn'); return; }
  var data = getData();
  data.unshift({ id: Date.now(), tanggal: tgl, jumlah: jml, kategori: kat, catatan: note });
  saveData(data);
  document.getElementById('i-jml').value  = '';
  document.getElementById('i-note').value = '';
  toast('Tersimpan!', 'Rp ' + jml.toLocaleString('id-ID') + ' — ' + kat, 'success');
  cekBatas(data);
  renderAll();
}

function hapusTrx(id) {
  var data = getData().filter(function (t) { return t.id !== id; });
  saveData(data);
  renderAll();
  toast('Dihapus', 'Transaksi telah dihapus.', 'info');
}

function hapusSemua() {
  if (getData().length === 0) { toast('Kosong', 'Tidak ada data untuk dihapus.', 'info'); return; }
  if (confirm('Hapus semua riwayat pengeluaran? Tindakan ini tidak bisa dibatalkan.')) {
    saveData([]); renderAll();
    toast('Dihapus', 'Semua riwayat berhasil dihapus.', 'success');
  }
}

function simpanBatas() {
  var v = parseInt(document.getElementById('i-batas').value);
  if (!v || v <= 0) { toast('Peringatan', 'Masukkan batas yang valid!', 'warn'); return; }
  localStorage.setItem(key('batas'), v);
  toast('Tersimpan!', 'Batas diset ke Rp ' + v.toLocaleString('id-ID') + '.', 'success');
  renderAll();
}

/* ── RENDER ── */
function renderAll() { renderBeranda(); renderRiwayat(); renderStats(); }

function renderBeranda() {
  var data  = getData();
  var batas = getBatas();
  var today = new Date().toISOString().slice(0, 10);
  var mo    = today.slice(0, 7);
  var tHari = 0, tBulan = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].tanggal === today)              tHari  += data[i].jumlah;
    if (data[i].tanggal.indexOf(mo) === 0)      tBulan += data[i].jumlah;
  }
  var sisa = Math.max(batas - tBulan, 0);

  // 4 summary cards
  document.getElementById('s-hari').textContent  = 'Rp ' + tHari.toLocaleString('id-ID');
  document.getElementById('s-bulan').textContent = 'Rp ' + tBulan.toLocaleString('id-ID');
  document.getElementById('s-sisa').textContent  = 'Rp ' + sisa.toLocaleString('id-ID');
  document.getElementById('s-trx').textContent   = data.filter(function(t){ return t.tanggal.indexOf(mo)===0; }).length + ' trx';

  // Progress
  var pct  = Math.min((tBulan / batas) * 100, 100);
  var fill = document.getElementById('b-fill');
  fill.style.width = pct + '%';
  fill.className = 'progress-fill' + (pct >= 90 ? ' danger' : pct >= 70 ? ' warn' : '');
  document.getElementById('b-pct').textContent  = Math.round(pct) + '%';
  document.getElementById('b-used').textContent = 'Terpakai: Rp ' + tBulan.toLocaleString('id-ID');
  document.getElementById('b-lim').textContent  = 'Batas: Rp ' + batas.toLocaleString('id-ID');

  // Kat bars
  var kt = {};
  var bulanData = data.filter(function(t){ return t.tanggal.indexOf(mo)===0; });
  for (var j = 0; j < bulanData.length; j++) {
    kt[bulanData[j].kategori] = (kt[bulanData[j].kategori] || 0) + bulanData[j].jumlah;
  }
  var katEl = document.getElementById('kat-bars');
  if (!katEl) return;
  var katKeys = Object.keys(kt);
  if (!katKeys.length) {
    katEl.innerHTML = '<p style="font-size:13px;color:var(--txt3);text-align:center;padding:20px 0;font-weight:700;">Belum ada pengeluaran bulan ini 📭</p>';
  } else {
    var mx = 0;
    for (var k in kt) if (kt[k] > mx) mx = kt[k];
    katKeys.sort(function(a,b){ return kt[b]-kt[a]; });
    var html = '';
    for (var ki = 0; ki < katKeys.length; ki++) {
      var k2 = katKeys[ki];
      var pctK = ((kt[k2]/mx)*100).toFixed(1);
      html += '<div class="kat-bar-item">' +
        '<div class="kat-bar-hd"><span class="kat-bar-lbl">'+(ICON[k2]||'📦')+' '+k2+'</span>' +
        '<span class="kat-bar-val">Rp '+kt[k2].toLocaleString('id-ID')+'</span></div>' +
        '<div class="kat-bar-track"><div class="kat-bar-fill" style="width:'+pctK+'%;background:'+(BARCOL[k2]||'#9B5FFF')+'"></div></div>' +
        '</div>';
    }
    katEl.innerHTML = html;
  }

  // Recent
  var rl = document.getElementById('recent-list');
  if (!rl) return;
  if (!data.length) {
    rl.innerHTML = '<div class="empty-state"><span class="empty-icon">📭</span><p>Belum ada pengeluaran dicatat.</p></div>';
  } else {
    var rh = '';
    for (var ri = 0; ri < Math.min(5, data.length); ri++) rh += trxHTML(data[ri], false);
    rl.innerHTML = rh;
  }
}

function renderRiwayat() {
  var fkEl = document.getElementById('f-kat');
  var fsEl = document.getElementById('f-sort');
  var fk   = fkEl ? fkEl.value : '';
  var fs   = fsEl ? fsEl.value : 'baru';
  var data = getData();
  if (fk) data = data.filter(function(t){ return t.kategori===fk; });
  if      (fs === 'lama')  data.sort(function(a,b){ return a.tanggal.localeCompare(b.tanggal); });
  else if (fs === 'besar') data.sort(function(a,b){ return b.jumlah - a.jumlah; });
  else                     data.sort(function(a,b){ return b.id - a.id; });
  var el = document.getElementById('riwayat-list');
  if (!el) return;
  if (!data.length) {
    el.innerHTML = '<div class="empty-state"><span class="empty-icon">🔍</span><p>Tidak ada transaksi ditemukan.</p></div>';
  } else {
    var h = '';
    for (var i = 0; i < data.length; i++) h += trxHTML(data[i], true);
    el.innerHTML = h;
  }
}

function renderStats() {
  var data = getData();
  document.getElementById('st-total').textContent = data.length;
  if (data.length) {
    var mx = 0, mn = Infinity;
    for (var i = 0; i < data.length; i++) {
      if (data[i].jumlah > mx) mx = data[i].jumlah;
      if (data[i].jumlah < mn) mn = data[i].jumlah;
    }
    document.getElementById('st-max').textContent = 'Rp '+mx.toLocaleString('id-ID');
    document.getElementById('st-min').textContent = 'Rp '+mn.toLocaleString('id-ID');
  } else {
    document.getElementById('st-max').textContent = 'Rp 0';
    document.getElementById('st-min').textContent = 'Rp 0';
  }
}

function trxHTML(t, del) {
  var k    = t.kategori || 'Lainnya';
  var cls  = ICCLS[k]   || 'ic-lainnya';
  var ico  = ICON[k]    || '📦';
  var tgl  = new Date(t.tanggal).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
  var note = t.catatan  || 'Tidak ada catatan';
  var delBtn = del ? '<button class="trx-del" type="button" onclick="hapusTrx('+t.id+')">🗑️</button>' : '';
  return '<div class="trx-item">' +
    '<div class="trx-icon '+cls+'">'+ico+'</div>' +
    '<div class="trx-info">' +
      '<span class="trx-kat">'+k+'</span>' +
      '<span class="trx-note">'+note+'</span>' +
      '<span class="trx-date">'+tgl+'</span>' +
    '</div>' +
    '<div class="trx-right">' +
      '<span class="trx-amt">- Rp '+t.jumlah.toLocaleString('id-ID')+'</span>' +
      delBtn +
    '</div></div>';
}

/* ── CEK BATAS ── */
function cekBatas(data) {
  var batas = getBatas();
  var mo = new Date().toISOString().slice(0,7);
  var tot = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].tanggal.indexOf(mo)===0) tot += data[i].jumlah;
  }
  var pct = (tot/batas)*100;
  if      (pct >= 100) toast('⚠️ Batas Terlampaui!', 'Pengeluaranmu bulan ini sudah melebihi batas Rp '+batas.toLocaleString('id-ID')+'!', 'error', 7000);
  else if (pct >=  80) toast('🔔 Hampir Habis!', 'Sudah '+Math.round(pct)+'% dari batas pengeluaran bulan ini!', 'warn', 5000);
}

/* ── TIPS ── */
function pickTips() {
  tipsI = Math.floor(Math.random() * TIPS.length);
  var el = document.getElementById('tips-txt');
  if (el) el.textContent = TIPS[tipsI];
}
function nextTips() {
  tipsI = (tipsI+1) % TIPS.length;
  var el = document.getElementById('tips-txt');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(function(){ el.textContent = TIPS[tipsI]; el.style.opacity = '1'; }, 220);
}

/* ── DARK MODE ── */
function loadDark() { dark = localStorage.getItem('hku_dark')==='true'; applyDark(); }
function toggleDark() { dark = !dark; localStorage.setItem('hku_dark', dark); applyDark(); }
function applyDark() {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  var ck  = document.getElementById('dark-check');
  var btn = document.getElementById('dark-btn');
  if (ck)  ck.checked     = dark;
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
}

/* ── PASSWORD TOGGLE ── */
function togglePass(id, btn) {
  var inp = document.getElementById(id);
  if (!inp) return;
  if (inp.type === 'password') { inp.type='text';     btn.textContent='🙈'; }
  else                         { inp.type='password'; btn.textContent='👁️'; }
}

/* ── TOAST ── */
function toast(title, msg, type, dur) {
  dur = dur || 3500;
  var ico = { success:'', warn:'⚠️', error:'❌', info:'' };
  var box = document.getElementById('toast-box');
  var el  = document.createElement('div');
  el.className = 'toast t-'+type;
  el.innerHTML =
    '<span class="toast-ico">'+(ico[type]||'')+'</span>' +
    '<div class="toast-body"><div class="toast-title">'+title+'</div><div class="toast-msg">'+msg+'</div></div>' +
    '<button class="toast-x" type="button" onclick="closeToast(this.parentElement)">✕</button>';
  el.addEventListener('click', function(){ closeToast(el); });
  box.appendChild(el);
  setTimeout(function(){ closeToast(el); }, dur);
}
function closeToast(el) {
  if (!el || !el.parentElement) return;
  el.classList.add('hide');
  setTimeout(function(){ if (el.parentElement) el.remove(); }, 380);
}
