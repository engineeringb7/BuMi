/* ================================================================
   BUMI — Building Maintenance Monitoring Integration
   script.js v4.1 — All features fully implemented
   ================================================================ */

'use strict';

/* ════════════════════════════════════════════════════════════════
   KONFIGURASI — Ganti URL ini setelah deploy Apps Script
════════════════════════════════════════════════════════════════ */
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyvBpa_9w9iDzUsSPTKs9qpxuiuFdl8qeEyRbKHdidKr6S_UvDgiiRA-SGeXpG_UD4T/exec';
/* ════════════════════════════════════════════════════════════════ */

/* ── DATA STATIS ─────────────────────────────────────────────── */
const USERS = [
  { nik:'K0003701',    password:'spvipal123', nama:'Safril',   role:'supervisor-ipal', avatarLetter:'S' },
  { nik:'PEG26041248', password:'spvac123',   nama:'Ria',      role:'supervisor-ac',   avatarLetter:'R' },
  { nik:'200200083',   password:'ac123',      nama:'Nasikin',  role:'teknisi-ac',      avatarLetter:'N' },
  { nik:'993840356',   password:'ac123',      nama:'Nasikhun', role:'teknisi-ac',      avatarLetter:'N' },
  { nik:'25400155',    password:'ipal123',    nama:'Saepul',   role:'teknisi-ipal',    avatarLetter:'S' },
  { nik:'200500111',   password:'ipal123',    nama:'Ricky',    role:'teknisi-ipal',    avatarLetter:'R' },
  { nik:'20050090',    password:'ipal123',    nama:'Maulana',  role:'teknisi-ipal',    avatarLetter:'M' },
];

const ROLE_LABELS = {
  'teknisi-ipal':    'Teknisi IPAL',
  'teknisi-ac':      'Teknisi AC',
  'supervisor-ipal': 'Supervisor IPAL',
  'supervisor-ac':   'Supervisor AC',
};

const ROLE_CHIP_CLASS = {
  'teknisi-ipal':    'chip-ipal',
  'teknisi-ac':      'chip-ac',
  'supervisor-ipal': 'chip-sup',
  'supervisor-ac':   'chip-supac',
};

const AC_UNITS = [
  'AC 1 (R. PW 2 - 1.5 PK)','AC 2 (R. PW 3 - 1.5 PK)','AC 3 (Tempat Alat BM - 1.5 PK)',
  'AC 4 (Office BM - 2 PK)','AC 5 (Serbaguna GA - 2 PK)','AC 6 (Serbaguna GA - 2 PK)',
  'AC 7 (R. Gudang Peralatan GA - 1 PK)','AC 8 (R. Karaoke - 1 PK)','AC 9 (Panel PAC - 1 PK)',
  'AC 10 (Arsip - 1 PK)','AC 11 (R. CS - 1 PK)','AC 12 (R. Olahraga - 2 PK)',
  'AC 13 (PPIC - 2 PK)','AC 14 (PPIC - 1 PK)','AC 15 (Area Office TS - 5 PK)',
  'AC 16 (Area Office TS - 2.5 PK)','AC 17 (Area Office TS - 1 PK)','AC 18 (Area Office TS - 1 PK)',
  'AC 19 (Manager TS - 1 PK)','AC 20 (Ruang Kerja TS - 1.5 PK)','AC 21 (Ruang Kerja TS - 1.5 PK)',
  'AC 22 (R. Meeting Puyer - 2 PK)','AC 23 (R. Meeting Puyer - 2 PK)','AC 24 (Office HRD - 2 PK)',
  'AC 25 (Office QS - 5 PK)','AC 26 (Office QS - 2 PK)','AC 27 (Lab TS - 5 PK)',
  'AC 28 (Lab TS - 1.5 PK)','AC 29 (R. Sensory - 1 PK)','AC 30 (Gudang - 2 PK)',
  'AC 31 (Gudang - 2 PK)','AC 32 (Office QA - 5 PK)','AC 33 (Office QA - 5 PK)',
  'AC 34 (Office QA - 5 PK)','AC 35 (Manager QA Operation - 2 PK)','AC 36 (Manager QA Compliance - 2 PK)',
  'AC 37 (Instrumen - 5 PK)','AC 38 (Instrumen - 5 PK)','AC 39 (PDCA QC - 1 PK)',
  'AC 40 (PDCA QC - 1 PK)','AC 41 (QC Analis - 5 PK)','AC 42 (QC Analis - 5 PK)',
  'AC 43 (QC Analis - 2 PK)','AC 44 (QC Analis - 2 PK)','AC 45 (QC Analis - 2 PK)',
  'AC 46 (QC Analis - 2 PK)','AC 47 (QC Analis - 2 PK)',
  'AC 48 (Retained Sample - 2 PK)','AC 49 (Retained Sample - 2 PK)',
  'AC 50 (Koperasi - 1 PK)','AC 51 (Server - 1 PK)','AC 52 (QO Head - 1 PK)',
  'AC 53 (UPS - 1 PK)','AC 54 (Supervisor QC dan Admin - 1 PK)','AC 55 (Supervisor QC dan Admin - 1 PK)',
  'AC 56 (AAS - 1 PK)','AC 57 (BOD Head - 2 PK)','AC 58 (Site Senior Manager - 1.5 PK)',
  'AC 59 (Site PG Head - 1.5 PK)','AC 60 (GA - 5 PK)','AC 61 (R. Meeting Komix - 5 PK)',
  'AC 62 (R. Meeting Komix - 2 PK)','AC 63 (R. Meeting Komix - 2 PK)',
  'AC 64 (Batch Record QA 1 - 1 PK)','AC 65 (Batch Record QA 1 - 1 PK)','AC 66 (Batch Record QA 1 - 1 PK)',
  'AC 67 (R. Alat QA - 1.5 PK)','AC 68 (Manager QC - 1 PK)','AC 69 (Arsip QC - 1 PK)',
  'AC 70 (Arsip QC - 1 PK)','AC 71 (R. Retained Sample Bahan Baku - 1 PK)',
  'AC 72 (Reagent - 2 PK)','AC 73 (R. Asam - 2 PK)','AC 74 (R. Timbang 1 - 1 PK)',
  'AC 75 (R. Timbang 2 - 1 PK)','AC 76 (R. Tanur - 1 PK)','AC 77 (Packaging 3 - 5 PK)',
  'AC 78 (Packaging 3 - 5 PK)','AC 79 (Packaging 3 - 5 PK)','AC 80 (Packaging 3 - 5 PK)',
  'AC 81 (Packaging 3 - 5 PK)','AC 82 (Packaging 3 - 5 PK)','AC 83 (Packaging 3 - 5 PK)',
  'AC 84 (Packaging 3 - 2.5 PK)','AC 85 (Packaging 3 - 1 PK)',
  'AC 86 (Server - 2 PK)','AC 87 (Server - 1 PK)','AC 88 (Sparepart - 1 PK)',
  'AC 89 (R. PW 1 - 2.5 PK)','AC 90 (R. Repair - 2.5 PK)','AC 91 (Workshop - 1.5 PK)',
  'AC 92 (Office Teknik - 2.5 PK)','AC 93 (Office Utility - 2 PK)',
  'AC 94 (Packaging 1 - 5 PK)','AC 95 (Packaging 1 - 5 PK)','AC 96 (Packaging 1 - 5 PK)',
  'AC 97 (Packaging 1 - 5 PK)','AC 98 (Packaging 2 - 5 PK)','AC 99 (Packaging 2 - 5 PK)',
  'AC 100 (Packaging 2 - 5 PK)','AC 101 (Packaging 2 - 5 PK)','AC 102 (Packaging 2 - 5 PK)',
  'AC 103 (Packaging 2 - 5 PK)','AC 104 (Packaging 2 - 5 PK)','AC 105 (Packaging 2 - 2.5 PK)',
  'AC 106 (R. Office 2 - 2 PK)','AC 107 (Manager Liquid - 2 PK)','AC 108 (R. Office 1 - 2 PK)',
  'AC 109 (R. Meeting - 1.5 PK)','AC 110 (Gudang Bahan Baku 2 - 2 PK)',
  'AC 111 (Gudang Bahan Baku 1 - 2 PK)','AC 112 (Gudang Bahan Baku 1 - 1.5 PK)',
  'AC 113 (GD Bahan Baku 4 - 2 PK)','AC 114 (GD Bahan Baku 4 - 1.5 PK)',
  'AC 115 (Manager Warehouse - 1 PK)','AC 116 (Gudang Bahan Baku 3 - 5 PK)',
  'AC 117 (Gudang Bahan Baku 3 - 2 PK)','AC 118 (Gudang Bahan Baku 3 - 1 PK)',
  'AC 119 (Lobby - 5 PK)','AC 120 (Booth 1 - 2 PK)','AC 121 (Booth 2 - 2 PK)',
  'AC 122 (R. CCTV - 1 PK)','AC 123 (R. Office OMC - 2 PK)','AC 124 (Gudang Bahan Baku - 2 PK)',
  'AC 125 (Gudang Bahan Baku - 1 PK)','AC 126 (R. Office IMC - 2 PK)',
];

const JENIS_GANGGUAN_AC = [
  'AC Tidak Dingin',
  'AC Bocor Air',
  'AC Berisik',
  'AC Tidak Menyala',
  'Outdoor Tidak Berputar',
  'Evaporator Membeku',
  'Kompresor Tidak Start',
  'AC Mati Hidup Sendiri',
  'AC Mengeluarkan Bau Tidak Sedap',
  'Pipa AC Berembun Berlebihan',
  'MCB Sering Turun Saat AC Dinyalakan',
  'Indoor Fan Lemah atau Tidak Berputar',
  'Remote AC Tidak Berfungsi',
  'Tekanan Freon Tidak Normal',
  'AC Kurang Optimal Saat Cuaca Panas',
  'Kebocoran Pada Pipa Tembaga',
  'Getaran Berlebih Pada Outdoor',
  'Kondensor Kotor atau Korosi',
  'Sambungan Pipa Retak',
  'Dudukan Outdoor Keropos atau Patah',
  'Lainnya',
];

const PENYEBAB_KERUSAKAN_AC = [
  'Freon berkurang atau bocor',
  'Saluran drain tersumbat',
  'Baut atau komponen fan kendor',
  'MCB turun atau kabel putus',
  'Kapasitor outdoor rusak',
  'Filter udara terlalu kotor',
  'Overload kompresor aktif',
  'Sensor suhu atau PCB error',
  'Evaporator berjamur dan kotor',
  'Insulasi pipa rusak',
  'Konsleting listrik pada unit AC',
  'Motor blower indoor lemah',
  'Baterai remote habis atau sensor rusak',
  'Kebocoran freon atau pipa kapiler tersumbat',
  'Kondensor kotor dan suhu outdoor terlalu panas',
  'Pipa tembaga berlubang akibat korosi',
  'Baut mounting outdoor longgar',
  'Penumpukan debu dan karat pada kondensor',
  'Sambungan brazing/pengelasan retak atau bocor',
  'Dudukan outdoor terkena korosi dan beban berlebih',
  'Lainnya',
];

const TINDAKAN_PERBAIKAN_AC = [
  'Cek kebocoran dan isi ulang freon',
  'Bersihkan saluran drain AC',
  'Kencangkan baut dan periksa fan',
  'Periksa instalasi listrik dan MCB',
  'Ganti kapasitor outdoor',
  'Bersihkan filter dan evaporator',
  'Periksa overload dan kondisi kompresor',
  'Reset atau ganti sensor dan PCB',
  'Cleaning evaporator menggunakan disinfectant',
  'Ganti insulasi pipa AC',
  'Periksa jalur kabel dan komponen listrik',
  'Servis atau ganti motor blower indoor',
  'Ganti baterai atau remote AC',
  'Perbaiki kebocoran dan cek tekanan freon',
  'Bersihkan kondensor dan optimalkan ventilasi outdoor',
  'Lakukan pengelasan/brazing pada pipa tembaga yang bocor',
  'Kencangkan mounting dan tambahkan peredam getaran',
  'Cleaning kondensor dan lakukan pelapisan anti karat',
  'Lakukan pengelasan ulang pada sambungan pipa AC',
  'Las atau ganti dudukan outdoor yang rusak dan korosi',
  'Lainnya',
];

/* IPAL zones — ordered per supervisor request:
   Dashboard: Ekualisasi 2, Anaerob, Aerasi 1, Aerasi 2, Aerasi 4
   + Flow zones for inlet/outlet/ras/recycle */
const IPAL_ZONES = [
  { id:'inlet',   name:'Inlet',        type:'flow',  hasSVI:false },
  { id:'outlet',  name:'Outlet',       type:'flow',  hasSVI:false },
  { id:'ras',     name:'RAS',          type:'flow',  hasSVI:false },
  { id:'recycle', name:'Recycle',      type:'flow',  hasSVI:false },
  { id:'ekual2',  name:'Ekualisasi 2', type:'gauge', hasSVI:false },
  { id:'anaerob', name:'Anaerob',      type:'gauge', hasSVI:false },
  { id:'aerasi1', name:'Aerasi 1',     type:'gauge', hasSVI:true  },
  { id:'aerasi2', name:'Aerasi 2',     type:'gauge', hasSVI:true  },
  { id:'aerasi4', name:'Aerasi 4',     type:'gauge', hasSVI:true  },
];

/* Supervisor IPAL gauge zones — display order */
const IPAL_GAUGE_ZONES_ORDERED = ['ekual2','anaerob','aerasi1','aerasi2','aerasi4'];

/* Zones with charts — per spec */
const IPAL_CHART_ZONES = {
  ekual2:  { name:'Ekualisasi 2', params:['ph','suhu'] },
  anaerob: { name:'Anaerob',      params:['ph','suhu'] },
  aerasi1: { name:'Aerasi 1',     params:['ph','suhu','svi30'] },
  aerasi2: { name:'Aerasi 2',     params:['ph','suhu','svi30'] },
  aerasi4: { name:'Aerasi 4',     params:['ph','suhu','svi30'] },
};

/* Flow zones with charts */
const IPAL_FLOW_CHART_ZONES = {
  inlet:   { name:'Inlet' },
  outlet:  { name:'Outlet' },
  ras:     { name:'RAS' },
  recycle: { name:'Recycle' },
};

const IPAL_THRESHOLDS = { ph:{max:14,warnMin:7}, suhu:{max:50,warn:40}, debit:{warn:150}, svi30:{max:100,warn:50} };
/* Threshold khusus Anaerob: merah <4; kuning 4–4.2; hijau >4.2–5.8; kuning 5.9–6; merah >6 */
const ANAEROB_PH_MIN = 4;
const ANAEROB_PH_MAX = 6;

/* ── PER-ZONE THRESHOLDS ─────────────────────────────────────── */
/* Setiap zona punya fungsi getGaugeColor(param, value) → 'green'|'yellow'|'red' */
const ZONE_THRESHOLDS = {
  /* 1. Debit Total Inlet — dipakai di flow card */
  inlet_debit: v => v <= 130 ? 'green' : v < 150 ? 'yellow' : 'red',

  /* 2. Ekualisasi 2 — pH */
  ekual2_ph:   v => v < 7 ? 'red' : v < 7.2 ? 'yellow' : 'green',
  /* 3. Ekualisasi 2 — Suhu */
  ekual2_suhu: v => v <= 38 ? 'green' : v <= 40 ? 'yellow' : 'red',

  /* 4. Anaerob — pH: merah <4; kuning 4–4.2; hijau >4.2–5.8; kuning 5.9–6; merah >6 */
  anaerob_ph:  v => v < 4 ? 'red' : v <= 4.2 ? 'yellow' : v <= 5.8 ? 'green' : v <= 6 ? 'yellow' : 'red',
  /* 5. Anaerob — Suhu */
  anaerob_suhu: v => v <= 38 ? 'green' : v <= 40 ? 'yellow' : 'red',

  /* 6. Aerasi 1 — pH */
  aerasi1_ph:  v => v < 7 ? 'red' : v < 7.2 ? 'yellow' : 'green',
  /* 7. Aerasi 1 — Suhu */
  aerasi1_suhu: v => v <= 38 ? 'green' : v <= 40 ? 'yellow' : 'red',
  /* 8. Aerasi 1 — SVI30 */
  aerasi1_svi30: v => v < 48 ? 'green' : v <= 50 ? 'yellow' : 'red',

  /* 9. Aerasi 2 — pH */
  aerasi2_ph:  v => v < 7 ? 'red' : v < 7.2 ? 'yellow' : 'green',
  /* 10. Aerasi 2 — Suhu */
  aerasi2_suhu: v => v <= 38 ? 'green' : v <= 40 ? 'yellow' : 'red',
  /* 11. Aerasi 2 — SVI30 */
  aerasi2_svi30: v => v < 48 ? 'green' : v <= 50 ? 'yellow' : 'red',

  /* 12. Aerasi 4 — pH */
  aerasi4_ph:  v => v < 7 ? 'red' : v < 7.2 ? 'yellow' : 'green',
  /* 13. Aerasi 4 — Suhu */
  aerasi4_suhu: v => v <= 38 ? 'green' : v <= 40 ? 'yellow' : 'red',
  /* 14. Aerasi 4 — SVI30 */
  aerasi4_svi30: v => v < 48 ? 'green' : v <= 50 ? 'yellow' : 'red',
};

const COLOR_HEX = { green:'#22C55E', yellow:'#F59E0B', red:'#EF4444' };

/** Hitung warna gauge sesuai zona dan parameter */
function getZoneColor(zoneId, param, value) {
  if(value == null || isNaN(parseFloat(value))) return 'green';
  const v = parseFloat(value);
  const key = `${zoneId}_${param}`;
  const fn = ZONE_THRESHOLDS[key];
  return fn ? fn(v) : 'green';
}

/** Apakah nilai menyebabkan "warn" (kuning atau merah) → untuk status dot */
function isZoneWarn(zoneId, param, value) {
  const c = getZoneColor(zoneId, param, value);
  return c === 'yellow' || c === 'red';
}

/* ── STATE ───────────────────────────────────────────────────── */
let currentUser    = null;
let clockInterval  = null;
let autoFetchInterval = null;   // real-time polling
let AUTO_FETCH_MS = 600000;     // poll setiap 10 menit (dapat diubah user)
let chartInstances = {};
let currentACPeriod = 'monthly';
let currentACUnit   = '';
let ipalChartData   = null;
let activeChartParam= 'ph';
let activeChartZone = 'ekual2';
let activeFlowChartZone = 'inlet';
let activeFlowChartParam = 'debit';
let _attnDismissed  = false;  /* true = user klik hapus, sembunyikan sampai refresh berikutnya */
let _attnFilterMode = 'today'; /* 'today' | 'all' */

/* Helper: filter attn items by today vs all */
function _isAttnToday(a) {
  if(!a.ts) return false;
  const todayStr = getTodayDate();
  const nowDate  = new Date();
  const todayDay = nowDate.getDate();
  const todayMon = nowDate.getMonth();
  const ID_MONTHS2 = ['jan','feb','mar','apr','mei','jun','jul','agu','sep','okt','nov','des'];
  const ts = String(a.ts).trim();
  /* "DD-MM-YYYY" */
  const mFull = ts.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if(mFull) return `${mFull[3]}-${mFull[2]}-${mFull[1]}` === todayStr;
  /* "DD/MM/YYYY" */
  const mDate = ts.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if(mDate) return `${mDate[3]}-${mDate[2].padStart(2,'0')}-${mDate[1].padStart(2,'0')}` === todayStr;
  /* Demo "17 Mei, 10:30" */
  const mID = ts.match(/^(\d{1,2})\s+([a-zA-Z]+)/);
  if(mID) {
    const day = parseInt(mID[1],10);
    const mon = ID_MONTHS2.indexOf(mID[2].toLowerCase().substring(0,3));
    return (day===todayDay && mon===todayMon);
  }
  return true; /* kalau format tidak dikenali, tampilkan */
}

function _renderAttnBody(allItems, mode) {
  const attnBody  = $('ipal-attn-body');
  const attnCount = $('ipal-attn-count');
  if(!attnBody) return;

  if(_attnDismissed) {
    if(attnCount) attnCount.textContent = 0;
    attnBody.innerHTML = `<div class="attention-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg><p>Semua Parameter Normal</p><span>Notifikasi telah dibersihkan</span></div>`;
    return;
  }

  const items = mode === 'today' ? allItems.filter(_isAttnToday) : allItems;
  if(attnCount) attnCount.textContent = items.length;
  if($('sup-stat-attn')) $('sup-stat-attn').textContent = allItems.filter(_isAttnToday).length;

  if(!items.length) {
    const emptyMsg = mode==='today' ? 'Tidak ada notifikasi hari ini' : 'Tidak ada threshold terlampaui atau catatan teknisi';
    attnBody.innerHTML = `<div class="attention-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg><p>Semua Parameter Normal</p><span>${emptyMsg}</span></div>`;
    return;
  }

  const itemsHTML = items.map(a => a.isKeterangan ? `
    <div class="ipal-attn-item ipal-attn-item-note">
      <div class="ipal-attn-item-bak">${escHtml(a.bak)}</div>
      <div class="ipal-attn-item-param">📝 Keterangan Tambahan</div>
      <div class="ipal-attn-item-val" style="white-space:pre-wrap;font-size:0.78rem">${escHtml(a.val)}</div>
      <div class="ipal-attn-item-ts">${escHtml(a.ts)}</div>
    </div>` : `
    <div class="ipal-attn-item">
      <div class="ipal-attn-item-bak">${escHtml(a.bak)}</div>
      <div class="ipal-attn-item-param">${escHtml(a.param)}</div>
      <div class="ipal-attn-item-val">${escHtml(a.val)}</div>
      <div class="ipal-attn-item-ts">${escHtml(a.ts)}</div>
    </div>`).join('');
  attnBody.innerHTML = `<div class="ipal-attn-scroll"><div class="ipal-attn-grid">${itemsHTML}</div></div>`;
}

/* ── FLOWMETER BASIS — disinkronkan via GAS (Sheet: Flow Basis) ── */
/* Cache in-memory sebagai fallback saat offline */
const FLOW_ZONES_LIST = ['inlet','outlet','ras','recycle'];
let _flowBasisCache = { inlet:0, outlet:0, ras:0, recycle:0 };

function getFlowBasis(zone) {
  return parseFloat(_flowBasisCache[zone]) || 0;
}
function setFlowBasisLocal(zone, val) {
  _flowBasisCache[zone] = parseFloat(val) || 0;
  /* Tetap simpan ke localStorage sebagai fallback offline */
  localStorage.setItem(`bumi_flowBasis_${zone}`, String(_flowBasisCache[zone]));
}

/* Load basis dari GAS — dipanggil saat app pertama dibuka */
async function loadFlowBasisFromGAS() {
  try {
    const res = await gasFetch({ action: 'getFlowBasis' });
    if (res.status === 'ok' && res.data) {
      FLOW_ZONES_LIST.forEach(z => {
        _flowBasisCache[z] = parseFloat(res.data[z]) || 0;
        localStorage.setItem(`bumi_flowBasis_${z}`, String(_flowBasisCache[z]));
      });
    }
  } catch(e) {
    /* Offline fallback: baca dari localStorage */
    FLOW_ZONES_LIST.forEach(z => {
      _flowBasisCache[z] = parseFloat(localStorage.getItem(`bumi_flowBasis_${z}`) || '0');
    });
  }
}

/* Simpan basis baru ke GAS setelah submit atau set-param */
async function pushFlowBasisToGAS(updatedBy) {
  try {
    await gasPost({
      formType:  'SET_FLOW_BASIS',
      inlet:     _flowBasisCache.inlet,
      outlet:    _flowBasisCache.outlet,
      ras:       _flowBasisCache.ras,
      recycle:   _flowBasisCache.recycle,
      updatedBy: updatedBy || '',
    });
  } catch(e) { console.warn('[FlowBasis] Gagal sinkronisasi ke GAS:', e); }
}

/* Hitung debit dari flowmeter sekarang - basis; min 0 */
function calcDebit(zone, flowNow) {
  const basis = getFlowBasis(zone);
  return Math.max(0, +(parseFloat(flowNow) - basis).toFixed(2));
}
/* Setelah submit berhasil, simpan flowmeter sekarang sebagai basis berikutnya */
async function advanceFlowBasis(zone, flowNow) {
  setFlowBasisLocal(zone, flowNow);
}



/* Debit total dihitung dari SUM semua debit hari ini yang dikembalikan server (ipalChartData).
   Tidak lagi menggunakan akumulasi localStorage untuk menghindari double-count saat polling. */
function calcDebitTotalFromChartData(zone) {
  /* ipalChartData.zones[zone].debit adalah array nilai debit tiap entry hari ini */
  if (!ipalChartData || !ipalChartData.zones) return 0;
  const debitArr = ipalChartData.zones[zone]?.debit;
  if (!Array.isArray(debitArr) || !debitArr.length) return 0;
  return +debitArr.reduce((sum, v) => sum + (parseFloat(v) || 0), 0).toFixed(2);
}
function updateDebitTotalDisplay() {
  ['inlet','outlet','ras','recycle'].forEach(zone => {
    const el = $(`fdebit-total-${zone}`);
    if (el) el.textContent = calcDebitTotalFromChartData(zone).toFixed(2);
  });
}

/* ── DAILY RESET — Debit Total, Max, Min, Avg, Debit ───────── */
/* Setiap hari baru, tampilan flow card direset ke nol sebelum data server tiba */
function checkAndApplyDailyFlowReset() {
  const today = getTodayDate();
  const lastReset = localStorage.getItem('bumi_flow_reset_date');
  if (lastReset !== today) {
    /* Hari baru: reset semua tampilan flow stat ke —/0 */
    FLOW_ZONES_LIST.forEach(z => {
      const fields = ['fflow','fdebit','fmax','fmin','favg'];
      fields.forEach(f => { const el = $(`${f}-${z}`); if(el) el.textContent = '—'; });
      const totalEl = $(`fdebit-total-${z}`); if(totalEl) totalEl.textContent = '0.00';
    });
    localStorage.setItem('bumi_flow_reset_date', today);
  }
}


const $ = id => document.getElementById(id);
const qs = (sel, ctx=document) => ctx.querySelector(sel);
const qsa = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

/* ── THEME ───────────────────────────────────────────────────── */
const html = document.documentElement;
function initTheme() { setTheme(localStorage.getItem('bumi-theme') || 'light'); }
function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('bumi-theme', t);
  ['icon-sun-login','icon-moon-login','icon-sun','icon-moon'].forEach(id => {
    const el=$(id); if(!el) return;
    el.style.display = (t==='light') === id.includes('sun') ? 'block' : 'none';
  });
}

/* ── CLOCK ───────────────────────────────────────────────────── */
function startClock() {
  if (clockInterval) clearInterval(clockInterval);
  tick(); clockInterval = setInterval(tick, 1000);
}
function tick() {
  const now = new Date(); const pad = n => String(n).padStart(2,'0');
  const t = $('topbar-time'), d = $('topbar-date');
  if (t) t.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  if (d) d.textContent = now.toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
}

/* ── UTILS ───────────────────────────────────────────────────── */
const delay = ms => new Promise(r => setTimeout(r, ms));
const escHtml = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const rnd = (min,max,dec=1) => +((Math.random()*(max-min)+min).toFixed(dec));
const demoTs = (minsAgo=0) => {
  const d = new Date(Date.now()-minsAgo*60000);
  return d.toLocaleString('id-ID',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
};

function getNowTimestamp() {
  return new Date().toLocaleString('id-ID',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).replace(/\//g,'-');
}

/**
 * Format waktuMulaiRusak dari berbagai kemungkinan format menjadi "13 Mei 2026, 10.03"
 * Google Sheets menyimpan nilai time-only sebagai Excel serial decimal (misal 0.41871...)
 * Browser kadang menampilkannya sebagai "Sat Dec 30 1899 HH:MM:SS GMT+..." — epoch Excel.
 * Fungsi ini menangani semua kasus tersebut dan mengembalikan tanggal hari ini + waktu yang benar.
 */
function formatWaktuRusak(val) {
  if (!val || val === '—') return val || '—';
  const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  function fmt(h, m) {
    const now = new Date();
    return `${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}, ${String(h).padStart(2,'0')}.${String(m).padStart(2,'0')}`;
  }

  const s = String(val).trim();

  /* 1. Pure time string: "09:47" atau "09:47:56" */
  const timeMatch = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (timeMatch) return fmt(parseInt(timeMatch[1],10), parseInt(timeMatch[2],10));

  /* 2. Date string yang mengandung tahun 1899 (Excel epoch dari Sheets) → ambil jam:menit saja */
  const epochMatch = s.match(/1899.*?(\d{1,2}):(\d{2}):\d{2}/);
  if (epochMatch) return fmt(parseInt(epochMatch[1],10), parseInt(epochMatch[2],10));

  /* 3. Excel/Sheets serial decimal murni (e.g. 0.40829) */
  const num = parseFloat(s);
  if (!isNaN(num) && /^[\d.]+$/.test(s)) {
    /* Ambil bagian desimal saja (waktu dalam hari) */
    const frac = num - Math.floor(num);
    const totalMin = Math.round(frac * 1440);
    return fmt(Math.floor(totalMin / 60), totalMin % 60);
  }

  /* 4. Full Date string / ISO — parse, tapi jika tahunnya 1899 (Excel epoch) ambil jam:menit */
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    return fmt(parsed.getHours(), parsed.getMinutes());
  }

  return s; /* fallback */
}

function getTodayDate() {
  const n=new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`;
}

/**
 * Normalisasi berbagai format tanggal dari Google Sheets → selalu "YYYY-MM-DD"
 * Sheets bisa mengirim: Date object string "Mon May 19 2026...", "19/05/2026", "2026-05-19", dsb.
 */
function normalizeTanggal(val) {
  if (!val) return '';
  const s = String(val).trim();
  // Sudah YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // DD/MM/YYYY atau DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;
  // Format dari Date.toString() atau ISO — misal "Mon May 19 2026 00:00:00 GMT+0700"
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth()+1).padStart(2,'0');
    const d = String(parsed.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }
  return s; // fallback
}
/**
 * Format tanggal PM dari berbagai kemungkinan format menjadi "20 Mei 2026, 13.47"
 * Menangani format panjang seperti "Wed May 20 2026 00:00:00 GMT+0700 (Waktu Indochina)"
 * maupun format standar "YYYY-MM-DD", "DD/MM/YYYY", dsb.
 * Jika ada timestamp terpisah, gabungkan tanggal + waktu dari timestamp.
 */
function formatTanggalPM(tanggalVal, timestampVal) {
  const BULAN_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  if (!tanggalVal && !timestampVal) return '—';

  let d = null;

  /* 1. Coba parse tanggal */
  if (tanggalVal) {
    const s = String(tanggalVal).trim();
    /* YYYY-MM-DD */
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y,m,dy] = s.split('-').map(Number);
      d = new Date(y, m-1, dy);
    } else {
      const parsed = new Date(s);
      if (!isNaN(parsed.getTime())) d = parsed;
    }
  }

  /* 2. Coba ambil waktu dari timestamp */
  let jam = null, menit = null;
  if (timestampVal) {
    const ts = String(timestampVal).trim();
    /* Format getNowTimestamp: "20-05-2026, 13.47.00" atau "20-05-2026 13.47.00" */
    const mTs = ts.match(/(\d{1,2})[.:](\d{2})(?:[.:](\d{2}))?(?:\s*(AM|PM))?$/i);
    if (mTs) {
      let h = parseInt(mTs[1], 10);
      const mn = parseInt(mTs[2], 10);
      const ampm = (mTs[4]||'').toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      jam = h; menit = mn;
    }
  }

  if (!d || isNaN(d.getTime())) return escHtml(String(tanggalVal||'—'));

  const day   = d.getDate();
  const month = BULAN_ID[d.getMonth()];
  const year  = d.getFullYear();

  if (jam !== null && menit !== null) {
    return `${day} ${month} ${year}, ${String(jam).padStart(2,'0')}.${String(menit).padStart(2,'0')}`;
  }
  return `${day} ${month} ${year}`;
}

function getCurrentTime() {
  const n=new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}
function getGreeting() {
  const h=new Date().getHours();
  if(h<11)return'Selamat pagi,'; if(h<15)return'Selamat siang,';
  if(h<18)return'Selamat sore,'; return'Selamat malam,';
}

function setButtonLoading(btn, on) {
  if(!btn)return;
  btn.disabled=on;
  const t=btn.querySelector('.btn-text'), l=btn.querySelector('.btn-loader');
  if(t) t.style.display=on?'none':'inline';
  if(l) l.style.display=on?'inline-flex':'none';
}

async function fileToBase64(file) {
  if(!file)return'';
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>res(r.result.split(',')[1]);
    r.onerror=()=>rej(new Error('Gagal membaca file.'));
    r.readAsDataURL(file);
  });
}

/* Generate nama file deskriptif.
   label   : kategori foto, misal "SVI30", "AC Rusak", "PM Sebelum"
   origName: nama file asli (untuk ambil ekstensi)
   tanggal : string tanggal opsional "YYYY-MM-DD" — kalau tidak diisi pakai hari ini
   extra   : info tambahan opsional misal nama teknisi atau unit (dipotong 25 karakter)
   Hasil   : "SVI30 - Saepul - 21-05-2026 09.13.05.jpg"
*/
function generateFotoName(label, origName, tanggal, extra) {
  const now = new Date();
  let tgl;
  if (tanggal && /\d{4}-\d{2}-\d{2}/.test(tanggal)) {
    const [yr, mo, dy] = tanggal.split('-');
    tgl = `${dy}-${mo}-${yr}`;
  } else {
    tgl = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
  }
  const h  = String(now.getHours()).padStart(2,'0');
  const mi = String(now.getMinutes()).padStart(2,'0');
  const s  = String(now.getSeconds()).padStart(2,'0');
  const ts = `${tgl} ${h}.${mi}.${s}`;
  const ext = (origName||'').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g,'') || 'jpg';
  const extraClean = extra ? ' - ' + String(extra).replace(/[/\\:*?"<>|]/g,'').trim().substring(0,25) : '';
  return `${label}${extraClean} - ${ts}.${ext}`;
}

/* ── NOTIFICATION ────────────────────────────────────────────── */
let notifTO=null;
function showNotif(type,title,desc) {
  const notif=$('notification'); if(!notif)return;
  $('notif-title').textContent=title; $('notif-desc').textContent=desc;
  const ok=$('notif-icon-success'), er=$('notif-icon-error');
  if(type==='success'){notif.classList.remove('error');ok.style.display='block';er.style.display='none';}
  else{notif.classList.add('error');ok.style.display='none';er.style.display='block';}
  notif.classList.add('show');
  if(notifTO) clearTimeout(notifTO);
  notifTO=setTimeout(()=>notif.classList.remove('show'),6000);
}
function hideNotif(){$('notification')?.classList.remove('show');}

/* ── GAS COMMUNICATION ───────────────────────────────────────── */
const IS_DEMO = !GAS_URL || GAS_URL.includes('YOUR_DEPLOYMENT_ID');

async function gasFetch(params) {
  if(IS_DEMO){ console.log('[DEMO GET]',params); await delay(700); return getDemoData(params); }
  const url=new URL(GAS_URL);
  Object.entries(params).forEach(([k,v])=>url.searchParams.append(k,v));
  url.searchParams.append('_t', Date.now()); // cache-busting
  let res;
  try {
    res = await fetch(url.toString(), { cache:'no-store', redirect:'follow' });
  } catch(networkErr) {
    throw new Error('Tidak dapat terhubung ke server: ' + networkErr.message);
  }
  if (!res.ok) throw new Error('Server error: ' + res.status);
  const text = await res.text();
  try { return JSON.parse(text); } catch(e) { throw new Error('Respons server bukan JSON yang valid.'); }
}
async function gasPost(payload) {
  if(IS_DEMO){ console.log('[DEMO POST]',payload); await delay(1200); return{status:'ok',message:'Demo mode — data tidak dikirim.'}; }
  let res;
  try {
    res = await fetch(GAS_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });
  } catch(networkErr) {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet. (' + networkErr.message + ')');
  }
  if (!res.ok) {
    throw new Error('Server mengembalikan status ' + res.status + '. Coba deploy ulang Apps Script.');
  }
  let data;
  try {
    const text = await res.text();
    data = JSON.parse(text);
  } catch(parseErr) {
    throw new Error('Respons server tidak valid (bukan JSON). Pastikan Web App sudah di-deploy dengan benar.');
  }
  if (data && data.status === 'error') {
    throw new Error(data.message || 'GAS mengembalikan error tanpa pesan.');
  }
  return data;
}

/* ── DEMO DATA ───────────────────────────────────────────────── */
function getDemoData(p) {
  if(p.action==='getIPALLatest')      return buildDemoIPALLatest();
  if(p.action==='getIPALChart')       return buildDemoIPALChart();
  if(p.action==='getIPALHistory')     return buildDemoIPALHistory();
  if(p.action==='getACStats')         return buildDemoACStats(p.period);
  if(p.action==='getACHistory')       return buildDemoACHistory(p.period,p.unit||'');
  if(p.action==='getOwnHistory')      return buildDemoOwnHistory(p.role);
  if(p.action==='getPMStats')         return buildDemoPMStats();
  if(p.action==='getPMLaporanHistory')return buildDemoPMLaporanHistory();
  if(p.action==='getPMSchedules')     return { status:'ok', data: [] };
  return{status:'ok',data:[]};
}

function buildDemoPMStats() {
  return { status:'ok', data: { todayTotal: 4, todayDone: 2, monthDone: 18, monthFixed: 23 } };
}

function buildDemoPMLaporanHistory() {
  const units = AC_UNITS.slice(0,8);
  return { status:'ok', data: Array.from({length:12},(_,i)=>({
    timestamp: demoTs(rnd(0, 720, 0)),
    pmId: `pm_demo_${i}`,
    unitAC: units[i % units.length],
    tanggal: getTodayDate(),
    namaTeknisi: ['Nasikin','Nasikhun'][i%2],
    nikTeknisi: ['200200083','993840356'][i%2],
    suhu_before: rnd(25,32,1), suhu_after: rnd(20,26,1),
    tekanan_before: rnd(60,80,1), tekanan_after: rnd(65,85,1),
    ampere_before: rnd(3,6,1), ampere_after: rnd(3,6,1),
    discharge_before: rnd(40,60,1), discharge_after: rnd(35,55,1),
    evaporator_before: 'Kotor', evaporator_after: 'Bersih',
    filter_before: 'Kotor', filter_after: 'Bersih',
    kondensor_before: 'Kotor', kondensor_after: 'Bersih',
    freon_before: 'Kurang', freon_after: 'Normal',
    drain_before: 'Lancar', drain_after: 'Lancar',
    listrik_before: 'Normal', listrik_after: 'Normal',
    tindakan: 'Pembersihan evaporator (indoor coil); Pembersihan filter udara',
    catatan: i%3===0 ? 'Kondensasi berlebih, perlu dipantau' : '',
    statusAkhir: i%4===0 ? 'Perlu tindak lanjut' : 'Normal — AC berfungsi baik',
    fotoBeforeUrl: i % 2 === 0 ? 'https://drive.google.com/uc?id=demo_before_placeholder&export=view' : '',
    fotoAfterUrl:  i % 2 === 0 ? 'https://drive.google.com/uc?id=demo_after_placeholder&export=view'  : '',
  }))};
}

function buildDemoIPALLatest() {
  const zones={};
  IPAL_ZONES.forEach(z=>{
    const ph=rnd(6.2,8.8); const suhu=rnd(26,38);
    const debit=rnd(65,185); const svi30=rnd(18,54);
    const vals={
      ph,suhu,ts:demoTs(rnd(0,45,0)),
      maxPh:rnd(ph,ph+0.8,2), minPh:rnd(ph-0.8,ph,2), avgPh:rnd(ph-0.4,ph+0.4,2),
      maxSuhu:rnd(suhu,suhu+2,1), minSuhu:rnd(suhu-2,suhu,1), avgSuhu:rnd(suhu-1,suhu+1,1),
    };
    if(z.type==='flow'){vals.flowmeter=rnd(120,380);vals.debit=debit;vals.maxDebit=rnd(debit,debit+20);vals.minDebit=rnd(debit-20,debit);vals.avgDebit=rnd(debit-10,debit+10);vals.maxFlow=rnd(350,400);vals.minFlow=rnd(100,150);vals.avgFlow=rnd(200,300);}
    if(z.hasSVI){vals.svi30=svi30;vals.maxSVI=rnd(svi30,svi30+8);vals.minSVI=rnd(svi30-8,svi30);vals.avgSVI=svi30;}
    zones[z.id]=vals;
  });
  return{status:'ok',data:zones};
}

function buildDemoIPALChart() {
  const hrs=Array.from({length:12},(_,i)=>`${String(i*2).padStart(2,'0')}:00`);
  const zones={};
  IPAL_ZONES.forEach(z=>{
    if(z.type==='flow') {
      /* Flow zones: debit per entry, debitCumulative for total */
      const debitVals = hrs.map(()=>rnd(60,185));
      let cumulative = 0;
      zones[z.id]={
        debit: debitVals,
        debitTotal: debitVals.map(v=>{ cumulative+=v; return +cumulative.toFixed(2); }),
        ph:hrs.map(()=>rnd(6.2,8.8)),
        suhu:hrs.map(()=>rnd(26,38)),
      };
    } else {
      zones[z.id]={
        ph:hrs.map(()=>rnd(6.2,8.8)),
        suhu:hrs.map(()=>rnd(26,38)),
        ...(z.hasSVI?{svi30:hrs.map(()=>rnd(18,72))}:{}),
      };
    }
  });
  return{status:'ok',data:{labels:hrs,zones}};
}

function buildDemoIPALHistory() {
  return{status:'ok',data:Array.from({length:30},(_,i)=>({
    timestamp:demoTs(rnd(0,300,0)),
    namaTeknisi:['Saepul','Eko'][i%2],
    inletDebit:rnd(80,180,2), outletDebit:rnd(60,160,2),
    eq2Ph:rnd(6.5,8.5,2), anarobPh:rnd(6.2,8.0,2),
    aerasi1Ph:rnd(6.8,8.6,2), aerasi1Svi30:rnd(20,68,1),
    aerasi2Ph:rnd(6.8,8.6,2), aerasi2Svi30:rnd(20,68,1),
    aerasi4Ph:rnd(6.8,8.6,2), aerasi4Svi30:rnd(20,68,1),
    keteranganTambahan:i%5===0?'Busa berlebih pada bak aerasi':'',
    fotoSviUrl:'',
    status:Math.random()>0.8?'Perlu Perhatian':'Normal',
  }))};
}

function buildDemoACStats(period='monthly') {
  const t=period==='weekly'?18:period==='monthly'?62:220;
  const ok=Math.round(t*rnd(0.78,0.95,2));
  const units={};
  /* Generate more unit entries so Top 15 is meaningful */
  AC_UNITS.slice(0,20).forEach(u=>{ const v=rnd(0,8,0); if(v>0)units[u]=v; });
  const types={};
  ['AC tidak dingin','AC bocor','AC berisik','AC mati total','Remote rusak','AC trip','Bau tidak sedap'].forEach(x=>{ types[x]=rnd(1,20,0); });
  const penyebab={};
  PENYEBAB_KERUSAKAN_AC.forEach(x=>{ penyebab[x]=rnd(1,18,0); });
  const actions={};
  ['Pengisian Freon dan Pembersihan Evaporator','Pembersihan Saluran Drainase AC','Perbaikan Sistem Kelistrikan / Penggantian Fuse','Pengencangan Baut dan Pemeriksaan Kipas Blower','Penggantian Baterai atau Remote AC','Pencucian AC dan Pembersihan Filter Udara','Reset Sistem dan Pemeriksaan Kode Error','Perbaikan Korsleting atau Pemeriksaan Kompresor','Lainnya'].forEach(x=>{ actions[x]=rnd(1,25,0); });
  const timeline = buildDemoTimeline(period,t);
  return{status:'ok',data:{totalReports:t,berhasil:ok,kambuh:t-ok,byUnit:units,byType:types,byPenyebab:penyebab,byAction:actions,timeline}};
}

function buildDemoTimeline(period,total) {
  if(period==='daily'){
    return Array.from({length:24},(_,i)=>({label:`${String(i).padStart(2,'0')}:00`,count:Math.max(0,Math.floor(rnd(0,Math.ceil(total/8),0)))}));
  } else if(period==='weekly'){
    return [{label:'Sen'},{label:'Sel'},{label:'Rab'},{label:'Kam'},{label:'Jum'},{label:'Sab'},{label:'Min'}].map(d=>({...d,count:rnd(0,8,0)}));
  } else if(period==='monthly'){
    return Array.from({length:30},(_,i)=>({label:`${i+1}`,count:rnd(0,5,0)}));
  } else {
    return ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'].map(m=>({label:m,count:rnd(0,25,0)}));
  }
}

function buildDemoACHistory(period='monthly',unit='') {
  const g=['AC tidak dingin','AC bocor','AC berisik','AC mati total','Remote tidak berfungsi','AC sering trip'];
  const tind=['Pengisian Freon','Pembersihan Drainase','Perbaikan Kelistrikan','Reset Sistem','Pencucian AC'];
  const deskRusakArr=['Evaporator mengeluarkan air berlebihan','Suhu ruangan tidak turun meski sudah dinyalakan lama','Unit bergetar dan mengeluarkan bunyi berisik','AC mati total tidak ada respons dari remote','Tekanan freon di bawah normal'];
  const deskFixArr=['Freon diisi ulang dan drain dibersihkan','Filter dan evaporator dicuci bersih','Baut mounting dikencangkan, fan balance diperiksa','PCB dan kapasitor diganti, MCB direset','Penggantian kapasitor dan cek ulang kelistrikan'];
  const penyebabArr=PENYEBAB_KERUSAKAN_AC;
  /* Nama & NIK teknisi yang valid sesuai USERS — penting untuk filter "Saya" */
  const teknisiPool=[
    {nama:'Nasikin',  nik:'200200083'},
    {nama:'Nasikhun', nik:'993840356'},
  ];
  /* URL gambar placeholder yang benar-benar bisa dibuka (via picsum.photos) */
  const placeholderRusakUrls=[
    'https://picsum.photos/seed/rusak1/600/400',
    'https://picsum.photos/seed/rusak2/600/400',
    'https://picsum.photos/seed/rusak3/600/400',
  ];
  const placeholderFixUrls=[
    'https://picsum.photos/seed/fix1/600/400',
    'https://picsum.photos/seed/fix2/600/400',
    'https://picsum.photos/seed/fix3/600/400',
  ];
  const count=period==='weekly'?14:period==='monthly'?45:120;
  return{status:'ok',data:Array.from({length:count},(_,i)=>{
    const tek=teknisiPool[i%teknisiPool.length];
    const hasFoto = i%3===0; /* ~1/3 entri punya foto — realistis karena foto baru wajib setelah sistem foto diaktifkan */
    return {
      timestamp:demoTs(rnd(0,count*60,0)),
      namaTeknisi:tek.nama,
      nikTeknisi:tek.nik,
      unitAC:unit||AC_UNITS[Math.floor(Math.random()*AC_UNITS.length)],
      jenisGangguan:g[Math.floor(Math.random()*g.length)],
      waktuMulaiRusak: new Date(Date.now()-rnd(1,72,0)*3600000).toISOString(),
      penyebabKerusakan:penyebabArr[Math.floor(Math.random()*penyebabArr.length)],
      deskripsiRusak:deskRusakArr[i%deskRusakArr.length],
      tindakan:tind[Math.floor(Math.random()*tind.length)],
      deskripsiPerbaikan:deskFixArr[i%deskFixArr.length],
      kambuh:Math.random()>0.87?'Ya':'Tidak',
      fotoRusakUrl: hasFoto ? placeholderRusakUrls[i%placeholderRusakUrls.length] : '',
      fotoFixUrl:   hasFoto ? placeholderFixUrls[i%placeholderFixUrls.length]   : '',
    };
  })};
}

function buildDemoOwnHistory(role) {
  if(role==='teknisi-ac') return buildDemoACHistory('monthly','');
  return buildDemoIPALHistory();
}

/* ════════════════════════════════════════════════════════════════
   HTML BUILDERS — SIDEBAR & TOPBAR
════════════════════════════════════════════════════════════════ */
function getSidebarHTML(user) {
  const isSupervisor = user.role.includes('supervisor');
  const chip = ROLE_CHIP_CLASS[user.role] || 'chip-ipal';
  const roleLabel = ROLE_LABELS[user.role] || user.role;

  const isTeknisiAC = user.role === 'teknisi-ac';

  let navItems = `
    <button class="nav-item active" data-section="dashboard">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>
      <span>${isTeknisiAC ? 'Preventive Maintenance' : 'Dashboard'}</span>
    </button>`;

  if(!isSupervisor) {
    navItems += `
    <button class="nav-item" data-section="input">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <span>${isTeknisiAC ? 'Breakdown Maintenance' : 'Input Data'}</span>
    </button>`;
    if(user.role === 'teknisi-ipal') {
      navItems += `
    <button class="nav-item" data-section="setparam">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/><path d="M17.66 7.34a6 6 0 010 8.49M6.34 7.34a6 6 0 000 8.49"/></svg>
      <span>Set Parameter Awal</span>
    </button>`;
    }
    /* teknisi-ac: tidak ada menu History PM terpisah — PM history digabung di dashboard */
  }

  if(isSupervisor) {
    navItems = `
    <button class="nav-item active" data-section="dashboard">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      <span>Dashboard</span>
    </button>`;
    if(user.role === 'supervisor-ac') {
      navItems += `
    <button class="nav-item" data-section="preventive">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>
      <span>Preventive Maintenance</span>
    </button>`;
    }
    navItems += `
    <button class="nav-item" data-section="input">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <span>${user.role === 'supervisor-ac' ? 'Breakdown Maintenance' : 'Input Data'}</span>
    </button>
    <button class="nav-item" data-section="history">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span>History</span>
    </button>`;
    /* supervisor-ipal: tidak ada History PM sama sekali */
    /* supervisor-ac: tidak ada menu History PM terpisah — PM history digabung di History */
    if(user.role === 'supervisor-ipal') {
      navItems += `
    <button class="nav-item" data-section="setparam">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/><path d="M17.66 7.34a6 6 0 010 8.49M6.34 7.34a6 6 0 000 8.49"/></svg>
      <span>Set Parameter Awal</span>
    </button>`;
    }
  }

  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="bm-mark-sm">
          <div class="bm-inner-sm">
            <span class="bm-sm-B">B</span>
            <span class="bm-sm-M">M</span>
          </div>
        </div>
        <div>
          <span class="sidebar-brand-wordmark">BuMi</span>
          <span class="sidebar-brand-sub">Monitoring Integration</span>
        </div>
      </div>
      <button class="sidebar-close" id="sidebar-close">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="sidebar-user">
      <div class="user-avatar">${escHtml(user.avatarLetter)}</div>
      <div class="user-info">
        <span class="user-name">${escHtml(user.nama)}</span>
        <span class="user-role-chip ${chip}">${escHtml(roleLabel)}</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <span class="nav-section-label">Menu</span>
      ${navItems}
    </nav>

    <div class="sidebar-footer">
      <button class="btn-logout" id="logout-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Keluar
      </button>
    </div>
  </aside>
  <div class="sidebar-overlay" id="sidebar-overlay"></div>`;
}

function getTopbarHTML(user, title='Dashboard', sub='Selamat datang kembali') {
  return `
  <header class="topbar">
    <div class="topbar-left">
      <button class="menu-toggle" id="menu-toggle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div>
        <p class="topbar-title" id="topbar-title">${escHtml(title)}</p>
        <p class="topbar-sub" id="topbar-sub">${escHtml(sub)}</p>
      </div>
    </div>
    <div class="topbar-right">
      <div class="topbar-datetime">
        <span class="topbar-date" id="topbar-date">—</span>
        <span class="topbar-time" id="topbar-time">—</span>
      </div>
      <div class="autofetch-timer" id="autofetch-indicator" style="display:none">
        <div class="autofetch-timer-top">
          <span class="autofetch-timer-icon">↻</span>
          <span class="autofetch-timer-label">Update dalam</span>
          <span class="autofetch-timer-count" id="autofetch-countdown">15</span>
          <span class="autofetch-timer-unit">dtk</span>
        </div>
        <div class="autofetch-bar-track">
          <div class="autofetch-bar-fill" id="autofetch-bar"></div>
        </div>
      </div>
      <div class="autofetch-interval-wrap" id="autofetch-interval-wrap" style="display:none">
        <span class="autofetch-interval-label">↻</span>
        <div class="autofetch-pills" id="autofetch-pills">
          <button class="autofetch-pill" data-ms="60000">1m</button>
          <button class="autofetch-pill autofetch-pill-active" data-ms="600000">10m</button>
          <button class="autofetch-pill" data-ms="1800000">30m</button>
        </div>

      </div>
      <button class="topbar-refresh-btn topbar-refresh-btn-icon" id="topbar-refresh-btn" title="Refresh data" style="display:none">
        <svg id="topbar-refresh-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
      </button>
      <button class="theme-toggle" id="theme-toggle" title="Ganti tema">
        <svg id="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg id="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      </button>
      <div class="topbar-user">
        <div class="user-avatar user-avatar-sm">${escHtml(user.avatarLetter)}</div>
        <span class="topbar-username">${escHtml(user.nama)}</span>
      </div>
    </div>
  </header>`;
}

/* ════════════════════════════════════════════════════════════════
   WELCOME HERO
════════════════════════════════════════════════════════════════ */
function getWelcomeHero(user) {
  const roleLabel = ROLE_LABELS[user.role] || user.role;
  const icons = {
    'teknisi-ipal':    `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    'teknisi-ac':      `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="3"/><path d="M6 21V7M18 21V7M12 21V7"/></svg>`,
    'supervisor-ipal': `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    'supervisor-ac':   `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
  };
  return `
  <div class="welcome-hero">
    <div class="welcome-hero-content">
      <p class="welcome-greeting">${getGreeting()}</p>
      <h2 class="welcome-name">${escHtml(user.nama)} 👋</h2>
      <p class="welcome-desc">Login sebagai ${escHtml(roleLabel)}</p>
      <span class="welcome-role-pill">${escHtml(roleLabel)}</span>
    </div>
    <div class="welcome-hero-deco">
      <div class="deco-badge">${icons[user.role]||''}</div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════
   DASHBOARD — TEKNISI
════════════════════════════════════════════════════════════════ */
function getDashTeknisi(user) {
  const isIPAL = user.role === 'teknisi-ipal';
  const driveFolderName = isIPAL ? 'BUMI - Monitoring IPAL' : 'BUMI - Maintenance AC';
  const driveCardClass  = isIPAL ? 'drive-folder-card-ipal' : 'drive-folder-card-ac';

  /* Preventive Maintenance card — only for teknisi AC */
  const pmCard = !isIPAL ? `
  <div class="dash-card" style="margin-bottom:16px">
    <div class="dash-card-header" style="flex-wrap:wrap;gap:10px">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="stat-icon stat-blue" style="width:32px;height:32px;border-radius:8px;flex-shrink:0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>
        </div>
        <h3>Jadwal Preventive Maintenance</h3>
      </div>
      <div class="pm-filter-group" style="margin-left:auto">
        <select class="pm-filter-select" id="tek-pm-filter-month" title="Pilih bulan"></select>
        <input type="number" class="pm-filter-select pm-filter-select-year" id="tek-pm-filter-year" title="Ketik tahun" min="2000" max="2199" style="width:72px;text-align:center" />
        <button class="pm-month-nav-btn pm-today-btn" id="tek-pm-goto-today" title="Kembali ke bulan ini">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/></svg>
        </button>
      </div>
    </div>
    <div id="teknisi-pm-wrap" style="padding:4px 0"></div>
  </div>` : '';

  /* Stat cards berbeda untuk AC vs IPAL */
  const statCards = isIPAL ? `
  <div class="stats-grid-3" style="margin-bottom:20px">
    <div class="stat-card">
      <div class="stat-icon stat-blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
      <div class="stat-info"><span class="stat-label">Total Semua Entry</span><span class="stat-value" id="tstat-total">—</span><span class="stat-sub">Seluruh tim</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="stat-info"><span class="stat-label">Status Normal</span><span class="stat-value" id="tstat-ok">—</span><span class="stat-sub">Semua parameter OK</span></div>
    </div>
    <div class="stat-card stat-card-warning">
      <div class="stat-icon stat-orange"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg></div>
      <div class="stat-info"><span class="stat-label">Perlu Perhatian</span><span class="stat-value" id="tstat-attn">—</span><span class="stat-sub">Threshold terlampaui</span></div>
    </div>
  </div>` : ``;

  return `
  ${statCards}
  ${pmCard}
  ${isIPAL ? `<a href="https://drive.google.com/drive/folders" target="_blank" rel="noopener noreferrer" class="drive-folder-card ${driveCardClass}" id="drive-folder-link-ipal" title="Buka folder Google Drive ${driveFolderName}">
    <div class="drive-folder-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
    </div>
    <div class="drive-folder-info">
      <span class="drive-folder-label">Google Drive</span>
      <span class="drive-folder-name">${driveFolderName}</span>
    </div>
    <div class="drive-folder-arrow">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  </a>` : ''}
  ${isIPAL ? `<div class="dash-card">
    <div class="dash-card-header" style="flex-wrap:wrap;gap:8px">
      <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
        <h3 style="white-space:nowrap">Riwayat Semua Entry</h3>
        <span class="dash-badge" id="teknisi-history-badge">100 terakhir</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div class="teknisi-history-filter">
          <button class="teknisi-hist-tab active" data-thist="all">Semua</button>
          <button class="teknisi-hist-tab" data-thist="mine">Saya</button>
        </div>
        <div class="teknisi-hist-search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="teknisi-hist-search" class="teknisi-hist-search" placeholder="Cari nama, zona…" />
        </div>
        <button class="btn-refresh-icon" id="teknisi-refresh-history-btn" title="Refresh data">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
        </button>
      </div>
    </div>
    <div id="teknisi-history"><div class="history-loading"><div class="spinner spinner-dark"></div>&nbsp;Memuat data…</div></div>
  </div>` : ''}`;
}

/* ════════════════════════════════════════════════════════════════
   DASHBOARD — SUPERVISOR IPAL
   Card order: Ekualisasi 2, Anaerob, Aerasi 1, Aerasi 2, Aerasi 4, Perlu Perhatian
════════════════════════════════════════════════════════════════ */
function getDashSupervisorIPAL() {
  const flowZones  = IPAL_ZONES.filter(z=>z.type==='flow');
  const gaugeZones = IPAL_GAUGE_ZONES_ORDERED.map(id=>IPAL_ZONES.find(z=>z.id===id)).filter(Boolean);

  /* Icons identical to form input card-icons */
  const FLOW_ICONS = {
    inlet:   { cls:'flow-card-icon-sky',    svg:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M5 12l4-4M5 12l4 4"/></svg>` },
    outlet:  { cls:'flow-card-icon-teal',   svg:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M19 12l-4 4M19 12l-4-4"/></svg>` },
    ras:     { cls:'flow-card-icon-indigo',  svg:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>` },
    recycle: { cls:'flow-card-icon-blue',   svg:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M3.51 9a9 9 0 105.06-3.55"/></svg>` },
  };
  const GAUGE_ICONS = {
    ekual2:  { cls:'gauge-card-icon-sky',   svg:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
    anaerob: { cls:'gauge-card-icon-sky',   svg:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
    aerasi1: { cls:'gauge-card-icon-blue',  svg:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
    aerasi2: { cls:'gauge-card-icon-blue',  svg:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
    aerasi4: { cls:'gauge-card-icon-blue',  svg:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
  };

  const flowHTML = flowZones.map(z=>{
    const ico = FLOW_ICONS[z.id] || FLOW_ICONS.inlet;
    const hasTotal = true;
    return `
    <div class="flow-card" id="flow-${z.id}">
      <div class="flow-card-header">
        <div class="flow-card-header-left">
          <div class="flow-card-icon ${ico.cls}">${ico.svg}</div>
          <span class="flow-card-name">${z.name}</span>
        </div>
        <div class="flow-status-dot dot-ok" id="fdot-${z.id}"></div>
      </div>
      <div class="flow-main">
        <div class="flow-main-item">
          <div class="flow-main-label">Flowmeter</div>
          <div class="flow-main-value" id="fflow-${z.id}">—</div>
          <div class="flow-main-unit"></div>
        </div>
        <div class="flow-main-item">
          <div class="flow-main-label">Debit</div>
          <div class="flow-main-value" id="fdebit-${z.id}">—</div>
          <div class="flow-main-unit">m³/waktu</div>
        </div>
        ${hasTotal ? `
        <div class="flow-main-item flow-main-item-total">
          <div class="flow-main-label">Debit Total</div>
          <div class="flow-main-value flow-total-value" id="fdebit-total-${z.id}">0.00</div>
          <div class="flow-main-unit">m³ / hari ini</div>
        </div>` : ''}
      </div>
      <div class="flow-stats">
        <div class="flow-stat"><div class="flow-stat-label">MAX</div><div class="flow-stat-value" id="fmax-${z.id}">—</div></div>
        <div class="flow-stat"><div class="flow-stat-label">MIN</div><div class="flow-stat-value" id="fmin-${z.id}">—</div></div>
        <div class="flow-stat"><div class="flow-stat-label">AVG</div><div class="flow-stat-value" id="favg-${z.id}">—</div></div>
      </div>
      <div class="flow-ts" id="fts-${z.id}">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Memuat…
      </div>
    </div>`;
  }).join('');

  const gaugeHTML = gaugeZones.map(z=>{
    const ico = GAUGE_ICONS[z.id] || GAUGE_ICONS.ekual2;
    return `
    <div class="gauge-card" id="gauge-${z.id}">
      <div class="gauge-card-header">
        <div class="gauge-card-header-left">
          <div class="gauge-card-icon ${ico.cls}">${ico.svg}</div>
          <span class="gauge-card-name">${z.name}</span>
        </div>
        <div class="flow-status-dot dot-ok" id="gdot-${z.id}"></div>
      </div>
      <div class="gauges-row" id="gauges-${z.id}">
        <div class="history-loading" style="padding:12px"><div class="spinner spinner-dark"></div></div>
      </div>
      <div class="gauge-ts" id="gts-${z.id}">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Memuat…
      </div>
    </div>`;
  }).join('');

  /* Build unified chart zone select — flow zones + gauge zones + combined views */
  const allChartZoneOpts = [
    `<optgroup label="Gabungan">`,
    `<option value="combined:debit">Debit</option>`,
    `<option value="combined:ph">pH</option>`,
    `<option value="combined:suhu">Suhu</option>`,
    `<option value="combined:svi30">SVI30</option>`,
    `</optgroup>`,
    `<optgroup label="Aliran">`,
    ...Object.entries(IPAL_FLOW_CHART_ZONES).map(([id,z])=>`<option value="flow:${id}">${z.name}</option>`),
    `</optgroup>`,
    `<optgroup label="Parameter Bak">`,
    ...Object.entries(IPAL_CHART_ZONES).map(([id,z])=>`<option value="gauge:${id}">${z.name}</option>`),
    `</optgroup>`,
  ].join('');

  return `
  <div class="stats-grid">
    <div class="stat-card stat-card-ms"><div class="stat-icon stat-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><div class="stat-info"><span class="stat-label">Data MS</span><span class="stat-value" id="sup-stat-ok">—</span><span class="stat-sub">Memenuhi Syarat</span></div></div>
    <div class="stat-card stat-card-tms"><div class="stat-icon stat-red"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div><div class="stat-info"><span class="stat-label">Data TMS</span><span class="stat-value" id="sup-stat-today">—</span><span class="stat-sub">Tidak Memenuhi Syarat</span></div></div>
    <div class="stat-card stat-card-warning"><div class="stat-icon stat-orange"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg></div><div class="stat-info"><span class="stat-label">Perlu Perhatian</span><span class="stat-value" id="sup-stat-attn">—</span><span class="stat-sub">Threshold terlampaui</span></div></div>
    <div class="stat-card"><div class="stat-icon stat-blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div><div class="stat-info"><span class="stat-label">Data Hari Ini</span><span class="stat-value" id="sup-stat-entries">—</span><span class="stat-sub">Input hari ini</span></div></div>
  </div>

  <p style="font-size:0.75rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin:4px 0 10px">⬡ Aliran Air — Inlet · Outlet · RAS · Recycle</p>
  <div class="ipal-tanks-grid" style="grid-template-columns:repeat(4,1fr)">${flowHTML}</div>

  <p style="font-size:0.75rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin:4px 0 10px">⬡ Parameter Bak — pH · Suhu · SVI30</p>
  <!-- ROW 1: Ekualisasi 2 · Anaerob · Perlu Perhatian -->
  <div class="ipal-gauge-row" id="ipal-gauge-row-top">
    ${gaugeZones.filter(z=>['ekual2','anaerob'].includes(z.id)).map(z=>{
      const ico = GAUGE_ICONS[z.id] || GAUGE_ICONS.ekual2;
      return `
    <div class="gauge-card" id="gauge-${z.id}">
      <div class="gauge-card-header">
        <div class="gauge-card-header-left">
          <div class="gauge-card-icon ${ico.cls}">${ico.svg}</div>
          <span class="gauge-card-name">${z.name}</span>
        </div>
        <div class="flow-status-dot dot-ok" id="gdot-${z.id}"></div>
      </div>
      <div class="gauges-row" id="gauges-${z.id}">
        <div class="history-loading" style="padding:12px"><div class="spinner spinner-dark"></div></div>
      </div>
      <div class="gauge-ts" id="gts-${z.id}">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Memuat…
      </div>
    </div>`;}).join('')}
    <!-- Perlu Perhatian — kanan atas -->
    <div class="ipal-attn-cell">
      <div class="ipal-attn-card" id="ipal-attn-card">
        <div class="ipal-attn-header">
          <span class="ipal-attn-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            Perlu Perhatian
          </span>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <div class="attn-filter-toggle" id="attn-filter-toggle">
              <button class="attn-filter-btn active" data-attn-filter="today">Hari Ini</button>
              <button class="attn-filter-btn" data-attn-filter="all">Semua</button>
            </div>
            <span class="ipal-attn-count" id="ipal-attn-count">0</span>
          </div>
        </div>
        <div id="ipal-attn-body">
          <div class="attention-empty">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg>
            <p>Semua Parameter Normal</p><span>Tidak ada threshold terlampaui</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- ROW 2: Aerasi 1 · Aerasi 2 · Aerasi 4 -->
  <div class="ipal-gauge-row" id="ipal-gauge-row-bottom">
    ${gaugeZones.filter(z=>['aerasi1','aerasi2','aerasi4'].includes(z.id)).map(z=>{
      const ico = GAUGE_ICONS[z.id] || GAUGE_ICONS.ekual2;
      return `
    <div class="gauge-card" id="gauge-${z.id}">
      <div class="gauge-card-header">
        <div class="gauge-card-header-left">
          <div class="gauge-card-icon ${ico.cls}">${ico.svg}</div>
          <span class="gauge-card-name">${z.name}</span>
        </div>
        <div class="flow-status-dot dot-ok" id="gdot-${z.id}"></div>
      </div>
      <div class="gauges-row" id="gauges-${z.id}">
        <div class="history-loading" style="padding:12px"><div class="spinner spinner-dark"></div></div>
      </div>
      <div class="gauge-ts" id="gts-${z.id}">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Memuat…
      </div>
    </div>`;}).join('')}
  </div>

  <!-- Grafik Gabungan — satu grafik dengan semua zona -->
  <div class="dash-card" style="margin-top:16px">
    <div class="dash-card-header">
      <h3>Grafik Monitoring IPAL</h3>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <select id="unified-chart-zone-select" class="form-select" style="width:auto;font-size:0.75rem;padding:4px 28px 4px 10px">
          ${allChartZoneOpts}
        </select>
        <div class="chart-controls" id="unified-chart-params">
          <!-- param buttons rendered dynamically -->
        </div>
      </div>
    </div>
    <div class="chart-container" style="height:240px"><canvas id="ipal-unified-chart"></canvas></div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════
   DASHBOARD — SUPERVISOR AC
   RESET: only top analytics (4 line charts) + penyelesaian kerusakan chart
════════════════════════════════════════════════════════════════ */
function getDashSupervisorAC() {
  const topFilterHTML = (id) => `
    <div class="top-filter-wrap">
      <span class="top-filter-label">Tampilkan:</span>
      <div class="top-filter-toggle" data-filter-group="${id}">
        <button class="top-filter-btn" data-top="3">Top 3</button>
        <button class="top-filter-btn active" data-top="5">Top 5</button>
        <button class="top-filter-btn" data-top="10">Top 10</button>
        <button class="top-filter-btn" data-top="15">Top 15</button>
      </div>
    </div>`;

  return `
  <!-- Riwayat AC per Unit -->
  <div class="dash-card" style="margin-bottom:16px">
    <div class="dash-card-header" style="margin-bottom:12px">
      <div class="ac-card-title-row">
        <div class="ac-analytics-icon ac-analytics-icon-blue">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="10" rx="3"/><path d="M6 21V7M18 21V7M12 21V7"/></svg>
        </div>
        <h3>Riwayat per Unit AC</h3>
      </div>
    </div>
    <div class="ac-unit-lookup-wrap">
      <div class="ac-unit-lookup-search" id="ac-unit-lookup-dropdown">
        <div class="searchable-select-wrapper" style="position:relative">
          <input type="text" id="ac-unit-lookup-search" class="form-input" placeholder="Cari unit AC…" autocomplete="off" style="padding-right:80px" />
          <button type="button" id="ac-unit-lookup-clear" class="searchable-clear" style="display:none">✕</button>
          <svg class="searchable-chevron" id="ac-unit-lookup-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="searchable-list" id="ac-unit-lookup-list"></div>
      </div>
      <button type="button" class="btn-primary btn-sm" id="ac-unit-lookup-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Cari Riwayat
      </button>
    </div>
    <input type="hidden" id="ac-unit-lookup-value" />
    <div id="ac-unit-lookup-result" style="margin-top:12px"></div>
  </div>

  <!-- 4 top analytics charts — 2x2 grid, all equal height -->
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin:0 0 12px">
    <p style="font-size:0.75rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin:0">⬡ Top Analytics</p>
    <div class="period-toggle" id="ac-period-toggle">
      <button class="period-toggle-btn" data-period="daily">Harian</button>
      <button class="period-toggle-btn" data-period="weekly">Mingguan</button>
      <button class="period-toggle-btn active" data-period="monthly">Bulanan</button>
      <button class="period-toggle-btn" data-period="yearly">Tahunan</button>
    </div>
  </div>
  <div class="ac-analytics-grid">
    <div class="dash-card">
      <div class="dash-card-header-stack">
        <div class="dash-card-header-row">
          <div class="ac-card-title-row">
            <div class="ac-analytics-icon ac-analytics-icon-blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="5" rx="2"/><path d="M5 8v10a1 1 0 001 1h12a1 1 0 001-1V8"/><path d="M9 12h6M9 15h4"/><path d="M7 3v2M17 3v2"/></svg>
            </div>
            <h3>AC dengan Kerusakan</h3>
          </div>
        </div>
        ${topFilterHTML('ac-top-units')}
      </div>
      <div id="ac-top-units"><div class="history-loading"><div class="spinner spinner-dark"></div></div></div>
    </div>
    <div class="dash-card">
      <div class="dash-card-header-stack">
        <div class="dash-card-header-row">
          <div class="ac-card-title-row">
            <div class="ac-analytics-icon ac-analytics-icon-orange">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3>Jenis Kerusakan</h3>
          </div>
        </div>
        ${topFilterHTML('ac-top-types')}
      </div>
      <div id="ac-top-types"><div class="history-loading"><div class="spinner spinner-dark"></div></div></div>
    </div>
    <div class="dash-card">
      <div class="dash-card-header-stack">
        <div class="dash-card-header-row">
          <div class="ac-card-title-row">
            <div class="ac-analytics-icon ac-analytics-icon-violet">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v3l2 2"/></svg>
            </div>
            <h3>Penyebab Kerusakan</h3>
          </div>
        </div>
        ${topFilterHTML('ac-top-penyebab')}
      </div>
      <div id="ac-top-penyebab"><div class="history-loading"><div class="spinner spinner-dark"></div></div></div>
    </div>
    <div class="dash-card">
      <div class="dash-card-header-stack">
        <div class="dash-card-header-row">
          <div class="ac-card-title-row">
            <div class="ac-analytics-icon ac-analytics-icon-green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <h3>Tindakan Perbaikan</h3>
          </div>
        </div>
        ${topFilterHTML('ac-top-actions')}
      </div>
      <div id="ac-top-actions"><div class="history-loading"><div class="spinner spinner-dark"></div></div></div>
    </div>
  </div>

  <!-- Grafik Penyelesaian Kerusakan -->
  <div class="dash-card ac-completion-card">
    <div class="ac-completion-header">
      <h3 class="ac-completion-title">Grafik Penyelesaian Kerusakan</h3>
      <div class="period-toggle" id="ac-chart-period-toggle">
        <button class="period-toggle-btn" data-chart-period="daily">Harian</button>
        <button class="period-toggle-btn" data-chart-period="weekly">Mingguan</button>
        <button class="period-toggle-btn active" data-chart-period="monthly">Bulanan</button>
        <button class="period-toggle-btn" data-chart-period="yearly">Tahunan</button>
      </div>
    </div>
    <div class="ac-completion-chart-wrap"><canvas id="ac-completion-chart"></canvas></div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════
   HISTORY — SUPERVISOR (separate section)
════════════════════════════════════════════════════════════════ */
function getHistoryIPALHTML() {
  return `
  <div class="section-header">
    <div><h2 class="section-title">History Monitoring IPAL</h2><p class="section-sub">Data realtime dari Google Spreadsheet</p></div>
    <button class="btn-refresh-icon" id="refresh-history-btn" title="Refresh data">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
    </button>
  </div>
  <a href="https://drive.google.com/drive/folders" target="_blank" rel="noopener noreferrer" class="drive-folder-card drive-folder-card-ipal" id="drive-folder-link-ipal" title="Buka folder Google Drive BUMI - Monitoring IPAL">
    <div class="drive-folder-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
    </div>
    <div class="drive-folder-info">
      <span class="drive-folder-label">Google Drive</span>
      <span class="drive-folder-name">BUMI - Monitoring IPAL</span>
    </div>
    <div class="drive-folder-arrow">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  </a>
  <div class="dash-card">
    <div id="sup-history-wrap"><div class="history-loading"><div class="spinner spinner-dark"></div>&nbsp;Memuat data…</div></div>
  </div>`;
}

function getHistoryACHTML() {
  return `
  <div class="section-header">
    <div><h2 class="section-title">History Maintenance AC</h2><p class="section-sub">Data realtime dari Google Spreadsheet</p></div>
    <button class="btn-refresh-icon" id="refresh-history-btn" title="Refresh data">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
    </button>
  </div>
  <a href="https://drive.google.com/drive/folders" target="_blank" rel="noopener noreferrer" class="drive-folder-card drive-folder-card-ac" id="drive-folder-link-ac" title="Buka folder Google Drive BUMI - Maintenance AC">
    <div class="drive-folder-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
    </div>
    <div class="drive-folder-info">
      <span class="drive-folder-label">Google Drive</span>
      <span class="drive-folder-name">BUMI - Maintenance AC</span>
    </div>
    <div class="drive-folder-arrow">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  </a>
  <div class="dash-card">
    <div id="sup-history-wrap"><div class="history-loading"><div class="spinner spinner-dark"></div>&nbsp;Memuat data\u2026</div></div>
  </div>

  <div style="margin-top:24px">
    <div class="section-header" style="margin-bottom:12px">
      <div><h2 class="section-title">History Preventive Maintenance</h2><p class="section-sub">Laporan PM yang sudah selesai dikerjakan</p></div>
      <button class="btn-refresh-icon" id="pm-history-refresh-btn" title="Refresh data PM">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
      </button>
    </div>
    <a href="https://drive.google.com/drive/folders" target="_blank" rel="noopener noreferrer" class="drive-folder-card drive-folder-card-pm" id="drive-folder-link-pm" title="Buka folder Google Drive BUMI - Preventive Maintenance AC">
      <div class="drive-folder-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
      </div>
      <div class="drive-folder-info">
        <span class="drive-folder-label">Google Drive</span>
        <span class="drive-folder-name">BUMI - Preventive Maintenance AC</span>
      </div>
      <div class="drive-folder-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </a>
    <div class="dash-card">
      <div id="pm-history-wrap"><div class="history-loading"><div class="spinner spinner-dark"></div>&nbsp;Memuat data PM…</div></div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════
   PM HISTORY — Section untuk teknisi AC dan supervisor AC
════════════════════════════════════════════════════════════════ */
function getPMHistoryHTML(isSupervisor) {
  /* Tampilan identik untuk supervisor maupun teknisi — satu code, fitur lengkap */
  void isSupervisor; /* parameter dipertahankan untuk kompatibilitas pemanggil lama */
  return `
  <div class="section-header">
    <div><h2 class="section-title">History Preventive Maintenance</h2><p class="section-sub">Laporan PM yang sudah selesai dikerjakan</p></div>
    <button class="btn-refresh-icon" id="pm-history-refresh-btn" title="Refresh data PM">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
    </button>
  </div>
  <div class="dash-card">
    <div id="pm-history-wrap"><div class="history-loading"><div class="spinner spinner-dark"></div>&nbsp;Memuat data…</div></div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════
   FORM — IPAL (with Keterangan Tambahan)
════════════════════════════════════════════════════════════════ */
function getIPALFormHTML() {
  return `
  <div class="section-header">
    <div><h2 class="section-title">Input Monitoring IPAL</h2><p class="section-sub">Data real-time sistem pengolahan air limbah</p></div>
  </div>
  <form id="form-ipal" novalidate>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-blue"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
        <div><h3 class="card-title">Informasi Monitoring</h3><p class="card-subtitle">Tanggal, waktu, dan timestamp sistem</p></div>
      </div>
      <div class="form-grid form-grid-3">
        <div class="form-group"><label class="form-label required">Tanggal</label><input type="date" id="ipal-tanggal" class="form-input" required /><span class="field-error" id="err-ipal-tanggal"></span></div>
        <div class="form-group"><label class="form-label required">Waktu</label><input type="time" id="ipal-waktu" class="form-input" step="1" required /><span class="field-error" id="err-ipal-waktu"></span></div>
        <div class="form-group"><label class="form-label">Timestamp Sistem</label><input type="text" id="ipal-timestamp" class="form-input input-readonly" readonly /></div>
      </div>
    </div>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-sky"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M5 12l4-4M5 12l4 4"/></svg></div>
        <div><h3 class="card-title">A. Data Inlet</h3><p class="card-subtitle">Masukkan nilai flowmeter saat ini</p></div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label class="form-label required">Nilai Flowmeter Inlet</label>
          <div class="input-wrapper"><input type="number" id="ipal-inlet-flow" class="form-input" placeholder="Contoh: 97231.15" step="0.01" required /><span class="input-suffix">m³</span></div>
          <span class="field-hint" id="hint-inlet">Nilai Sebelumnya: <b id="hint-inlet-basis">—</b></span>
          <span class="field-error" id="err-ipal-inlet-flow"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Debit Inlet (otomatis)</label>
          <div class="input-wrapper"><input type="number" id="ipal-inlet-debit" class="form-input input-readonly" placeholder="0.00" step="0.01" readonly /><span class="input-suffix">m³</span></div>
        </div>
      </div>
    </div>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-teal"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M19 12l-4 4M19 12l-4-4"/></svg></div>
        <div><h3 class="card-title">B. Data Outlet</h3><p class="card-subtitle">Masukkan nilai flowmeter saat ini</p></div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label class="form-label required">Nilai Flowmeter Outlet</label>
          <div class="input-wrapper"><input type="number" id="ipal-outlet-flow" class="form-input" placeholder="Contoh: 97231.15" step="0.01" required /><span class="input-suffix">m³</span></div>
          <span class="field-hint" id="hint-outlet">Nilai Sebelumnya: <b id="hint-outlet-basis">—</b></span>
          <span class="field-error" id="err-ipal-outlet-flow"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Debit Outlet (otomatis)</label>
          <div class="input-wrapper"><input type="number" id="ipal-outlet-debit" class="form-input input-readonly" placeholder="0.00" step="0.01" readonly /><span class="input-suffix">m³</span></div>
        </div>
      </div>
    </div>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-indigo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg></div>
        <div><h3 class="card-title">C. Data RAS</h3><p class="card-subtitle">Masukkan nilai flowmeter saat ini</p></div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label class="form-label required">Nilai Flowmeter RAS</label>
          <div class="input-wrapper"><input type="number" id="ipal-ras-flow" class="form-input" placeholder="Contoh: 97231.15" step="0.01" required /><span class="input-suffix">m³</span></div>
          <span class="field-hint" id="hint-ras">Nilai Sebelumnya: <b id="hint-ras-basis">—</b></span>
          <span class="field-error" id="err-ipal-ras-flow"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Debit RAS (otomatis)</label>
          <div class="input-wrapper"><input type="number" id="ipal-ras-debit" class="form-input input-readonly" placeholder="0.00" step="0.01" readonly /><span class="input-suffix">m³</span></div>
        </div>
      </div>
    </div>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-blue"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M3.51 9a9 9 0 105.06-3.55"/></svg></div>
        <div><h3 class="card-title">D. Data Recycle</h3><p class="card-subtitle">Masukkan nilai flowmeter saat ini</p></div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label class="form-label required">Nilai Flowmeter Recycle</label>
          <div class="input-wrapper"><input type="number" id="ipal-rec-flow" class="form-input" placeholder="Contoh: 97231.15" step="0.01" required /><span class="input-suffix">m³</span></div>
          <span class="field-hint" id="hint-recycle">Nilai Sebelumnya: <b id="hint-recycle-basis">—</b></span>
          <span class="field-error" id="err-ipal-rec-flow"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Debit Recycle (otomatis)</label>
          <div class="input-wrapper"><input type="number" id="ipal-rec-debit" class="form-input input-readonly" placeholder="0.00" step="0.01" readonly /><span class="input-suffix">m³</span></div>
        </div>
      </div>
    </div>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-sky"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
        <div><h3 class="card-title">E. Parameter Bak</h3><p class="card-subtitle">pH, suhu, dan SVI30 setiap zona</p></div>
      </div>

      <div class="param-section">
        <div class="param-label">Ekualisasi 2</div>
        <div class="form-grid form-grid-2">
          <div class="form-group"><label class="form-label required">pH Ekualisasi 2</label><input type="number" id="ipal-eq2-ph" class="form-input" placeholder="7.0" step="0.01" min="0" max="14" required /><span class="field-error" id="err-ipal-eq2-ph"></span></div>
          <div class="form-group"><label class="form-label required">Suhu Ekualisasi 2 (°C)</label><div class="input-wrapper"><input type="number" id="ipal-eq2-suhu" class="form-input" placeholder="28.0" step="0.1" required /><span class="input-suffix">°C</span></div><span class="field-error" id="err-ipal-eq2-suhu"></span></div>
        </div>
      </div>

      <div class="param-section">
        <div class="param-label">Anaerob</div>
        <div class="form-grid form-grid-2">
          <div class="form-group"><label class="form-label required">pH Anaerob</label><input type="number" id="ipal-anrb-ph" class="form-input" placeholder="7.0" step="0.01" min="0" max="14" required /><span class="field-error" id="err-ipal-anrb-ph"></span></div>
          <div class="form-group"><label class="form-label required">Suhu Anaerob (°C)</label><div class="input-wrapper"><input type="number" id="ipal-anrb-suhu" class="form-input" placeholder="28.0" step="0.1" required /><span class="input-suffix">°C</span></div><span class="field-error" id="err-ipal-anrb-suhu"></span></div>
        </div>
      </div>

      <div class="param-section">
        <div class="param-label">Aerasi 1</div>
        <div class="form-grid form-grid-3">
          <div class="form-group"><label class="form-label required">pH Aerasi 1</label><input type="number" id="ipal-aer1-ph" class="form-input" placeholder="7.0" step="0.01" min="0" max="14" required /><span class="field-error" id="err-ipal-aer1-ph"></span></div>
          <div class="form-group"><label class="form-label required">Suhu Aerasi 1 (°C)</label><div class="input-wrapper"><input type="number" id="ipal-aer1-suhu" class="form-input" placeholder="28.0" step="0.1" required /><span class="input-suffix">°C</span></div><span class="field-error" id="err-ipal-aer1-suhu"></span></div>
          <div class="form-group"><label class="form-label">SVI30 Aerasi 1 <span style="font-size:0.62rem;background:var(--sky-light);color:var(--sky);padding:1px 7px;border-radius:12px;margin-left:4px;font-weight:600">Opsional</span></label><div class="input-wrapper"><input type="number" id="ipal-aer1-svi" class="form-input" placeholder="—" step="0.1" /><span class="input-suffix">mL/g</span></div><span class="field-error" id="err-ipal-aer1-svi"></span></div>
        </div>
      </div>

      <div class="param-section">
        <div class="param-label">Aerasi 2</div>
        <div class="form-grid form-grid-3">
          <div class="form-group"><label class="form-label required">pH Aerasi 2</label><input type="number" id="ipal-aer2-ph" class="form-input" placeholder="7.0" step="0.01" min="0" max="14" required /><span class="field-error" id="err-ipal-aer2-ph"></span></div>
          <div class="form-group"><label class="form-label required">Suhu Aerasi 2 (°C)</label><div class="input-wrapper"><input type="number" id="ipal-aer2-suhu" class="form-input" placeholder="28.0" step="0.1" required /><span class="input-suffix">°C</span></div><span class="field-error" id="err-ipal-aer2-suhu"></span></div>
          <div class="form-group"><label class="form-label">SVI30 Aerasi 2 <span style="font-size:0.62rem;background:var(--sky-light);color:var(--sky);padding:1px 7px;border-radius:12px;margin-left:4px;font-weight:600">Opsional</span></label><div class="input-wrapper"><input type="number" id="ipal-aer2-svi" class="form-input" placeholder="—" step="0.1" /><span class="input-suffix">mL/g</span></div><span class="field-error" id="err-ipal-aer2-svi"></span></div>
        </div>
      </div>

      <div class="param-section">
        <div class="param-label">Aerasi 4</div>
        <div class="form-grid form-grid-3">
          <div class="form-group"><label class="form-label required">pH Aerasi 4</label><input type="number" id="ipal-aer4-ph" class="form-input" placeholder="7.0" step="0.01" min="0" max="14" required /><span class="field-error" id="err-ipal-aer4-ph"></span></div>
          <div class="form-group"><label class="form-label required">Suhu Aerasi 4 (°C)</label><div class="input-wrapper"><input type="number" id="ipal-aer4-suhu" class="form-input" placeholder="28.0" step="0.1" required /><span class="input-suffix">°C</span></div><span class="field-error" id="err-ipal-aer4-suhu"></span></div>
          <div class="form-group"><label class="form-label">SVI30 Aerasi 4 <span style="font-size:0.62rem;background:var(--sky-light);color:var(--sky);padding:1px 7px;border-radius:12px;margin-left:4px;font-weight:600">Opsional</span></label><div class="input-wrapper"><input type="number" id="ipal-aer4-svi" class="form-input" placeholder="—" step="0.1" /><span class="input-suffix">mL/g</span></div><span class="field-error" id="err-ipal-aer4-svi"></span></div>
        </div>
      </div>

    </div>

    <!-- Keterangan Tambahan -->
    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-orange"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
        <div><h3 class="card-title">Keterangan Tambahan</h3><p class="card-subtitle">Perbaikan, kasus kerusakan, catatan operator, kondisi khusus, dan lainnya</p></div>
      </div>
      <div class="form-group">
        <textarea id="ipal-keterangan" class="form-textarea" rows="4" placeholder="Tuliskan catatan tambahan, kondisi khusus, perbaikan yang dilakukan, atau informasi lain yang relevan…" style="border-radius:var(--radius-md);font-size:0.875rem"></textarea>
      </div>
    </div>

    <!-- Foto SVI30 -->
    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-sky"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
        <div><h3 class="card-title">Foto SVI30 <span style="font-size:0.62rem;background:var(--sky-light);color:var(--sky);padding:1px 7px;border-radius:12px;margin-left:4px;font-weight:600">Opsional</span></h3><p class="card-subtitle">Upload foto hasil pengukuran SVI30 — akan tersimpan di Google Drive folder BUMI - Monitoring IPAL</p></div>
      </div>
      <div class="foto-upload-group">
        <div class="upload-area" id="ipal-svi-area">
          <input type="file" id="ipal-foto-svi" accept="image/*" style="display:none" />
          <div class="upload-placeholder">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <p>Klik atau seret foto SVI30 ke sini</p>
            <span>JPG, PNG, WebP — maks. 10 MB</span>
          </div>
          <div class="upload-preview" id="ipal-svi-preview" style="display:none">
            <img id="ipal-svi-img" src="" alt="Preview SVI30" />
            <button type="button" class="upload-remove" id="ipal-svi-remove" title="Hapus foto">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" id="ipal-reset-btn">Reset Form</button>
      <button type="submit" class="btn-primary" id="ipal-submit-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
        <span class="btn-text">Kirim Data Monitoring</span>
        <span class="btn-loader" style="display:none"><span class="spinner"></span></span>
      </button>
    </div>
  </form>`;
}

/* ════════════════════════════════════════════════════════════════
   FORM — AC (with Penyebab Kerusakan dropdown)
════════════════════════════════════════════════════════════════ */
function getACFormHTML() {
  return `
  <div class="section-header">
    <div><h2 class="section-title">Input Maintenance AC</h2><p class="section-sub">Laporan kerusakan dan perbaikan unit AC</p></div>
  </div>
  <form id="form-ac" novalidate>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-blue"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
        <div><h3 class="card-title">Informasi Maintenance</h3><p class="card-subtitle">Tanggal, waktu, dan teknisi</p></div>
      </div>
      <div class="form-grid form-grid-3">
        <div class="form-group"><label class="form-label required">Tanggal</label><input type="date" id="ac-tanggal" class="form-input" required /><span class="field-error" id="err-ac-tanggal"></span></div>
        <div class="form-group"><label class="form-label required">Waktu</label><input type="time" id="ac-waktu" class="form-input" step="60" required /><span class="field-error" id="err-ac-waktu"></span></div>
        <div class="form-group"><label class="form-label">Timestamp Sistem</label><input type="text" id="ac-timestamp" class="form-input input-readonly" readonly /></div>
      </div>
    </div>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-sky"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="3"/><path d="M6 21V7M18 21V7M12 21V7"/></svg></div>
        <div><h3 class="card-title">Unit AC &amp; Gangguan</h3><p class="card-subtitle">Pilih unit dan jenis gangguan</p></div>
      </div>
      <div class="form-grid form-grid-1">
        <div class="form-group">
          <label class="form-label required">Unit AC</label>
          <div class="searchable-dropdown" id="ac-unit-dropdown">
            <div class="searchable-input-wrapper" id="ac-unit-wrapper">
              <input type="text" class="searchable-input" id="ac-unit-search" placeholder="Ketik nomor atau nama untuk mencari unit AC…" autocomplete="off" />
              <button type="button" class="searchable-clear" id="ac-unit-clear">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <svg class="searchable-chevron" id="ac-unit-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="searchable-list" id="ac-unit-list"></div>
          </div>
          <input type="hidden" id="ac-unit-value" />
          <span class="field-error" id="err-ac-unit"></span>
        </div>
        <div class="form-grid form-grid-2">
          <div class="form-group">
            <label class="form-label required">Jenis Gangguan</label>
            <div class="searchable-dropdown" id="ac-gangguan-dropdown">
              <div class="searchable-input-wrapper" id="ac-gangguan-wrapper">
                <input type="text" class="searchable-input" id="ac-gangguan-search" placeholder="Ketik atau pilih jenis gangguan…" autocomplete="off" />
                <button type="button" class="searchable-clear" id="ac-gangguan-clear">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <svg class="searchable-chevron" id="ac-gangguan-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              <div class="searchable-list" id="ac-gangguan-list"></div>
            </div>
            <input type="hidden" id="ac-gangguan-value" />
            <span class="field-error" id="err-ac-gangguan"></span>
          </div>
          <div class="form-group">
            <label class="form-label required">Waktu Mulai Kerusakan</label>
            <input type="time" id="ac-waktu-rusak" class="form-input time-24h" step="60" required />
            <span class="field-error" id="err-ac-waktu-rusak"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-indigo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
        <div><h3 class="card-title">Dokumentasi Kerusakan</h3><p class="card-subtitle">Foto, penyebab, dan deskripsi kondisi kerusakan</p></div>
      </div>
      <div class="form-grid form-grid-1">
        <div class="form-group">
          <label class="form-label required">Penyebab Kerusakan</label>
          <div class="searchable-dropdown" id="ac-penyebab-dropdown">
            <div class="searchable-input-wrapper" id="ac-penyebab-wrapper">
              <input type="text" class="searchable-input" id="ac-penyebab-search" placeholder="Ketik atau pilih penyebab kerusakan…" autocomplete="off" />
              <button type="button" class="searchable-clear" id="ac-penyebab-clear">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <svg class="searchable-chevron" id="ac-penyebab-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="searchable-list" id="ac-penyebab-list"></div>
          </div>
          <input type="hidden" id="ac-penyebab-value" />
          <span class="field-error" id="err-ac-penyebab"></span>
        </div>
        <div class="form-group">
          <label class="form-label required">Deskripsi Penyebab / Gejala</label>
          <textarea id="ac-deskripsi-rusak" class="form-textarea" rows="3" placeholder="Jelaskan gejala dan penyebab kerusakan secara detail…" required></textarea>
          <span class="field-error" id="err-ac-deskripsi-rusak"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Foto Penyebab Kerusakan</label>
          <div class="upload-area" id="ac-rusak-area">
            <input type="file" id="ac-foto-rusak" accept="image/*" class="upload-input" />
            <div class="upload-placeholder">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <p>Foto penyebab kerusakan</p><span>PNG/JPG · Maks 10MB · Opsional</span>
            </div>
            <div class="upload-preview" id="ac-rusak-preview" style="display:none">
              <img id="ac-rusak-img" src="" alt="Preview" />
              <button type="button" class="upload-remove" id="ac-rusak-remove">✕ Hapus</button>
            </div>
          </div>
          <span class="field-error" id="err-ac-foto-rusak"></span>
        </div>
      </div>
    </div>

    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon card-icon-teal"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div>
        <div><h3 class="card-title">Tindakan Perbaikan</h3><p class="card-subtitle">Langkah dan hasil perbaikan</p></div>
      </div>
      <div class="form-grid form-grid-1">
        <div class="form-group">
          <label class="form-label required">Tindakan Perbaikan</label>
          <div class="searchable-dropdown" id="ac-tindakan-dropdown">
            <div class="searchable-input-wrapper" id="ac-tindakan-wrapper">
              <input type="text" class="searchable-input" id="ac-tindakan-search" placeholder="Ketik atau pilih tindakan perbaikan…" autocomplete="off" />
              <button type="button" class="searchable-clear" id="ac-tindakan-clear">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <svg class="searchable-chevron" id="ac-tindakan-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="searchable-list" id="ac-tindakan-list"></div>
          </div>
          <input type="hidden" id="ac-tindakan-value" />
          <span class="field-error" id="err-ac-tindakan"></span>
        </div>
        <div class="form-group">
          <label class="form-label required">Deskripsi Langkah Perbaikan</label>
          <textarea id="ac-deskripsi-perbaikan" class="form-textarea" rows="3" placeholder="Jelaskan langkah-langkah perbaikan yang dilakukan…" required></textarea>
          <span class="field-error" id="err-ac-deskripsi-perbaikan"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Foto Tindakan Perbaikan</label>
          <div class="upload-area" id="ac-fix-area">
            <input type="file" id="ac-foto-fix" accept="image/*" class="upload-input" />
            <div class="upload-placeholder">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <p>Foto setelah perbaikan</p><span>PNG/JPG · Maks 10MB · Opsional</span>
            </div>
            <div class="upload-preview" id="ac-fix-preview" style="display:none">
              <img id="ac-fix-img" src="" alt="Preview" />
              <button type="button" class="upload-remove" id="ac-fix-remove">✕ Hapus</button>
            </div>
          </div>
          <span class="field-error" id="err-ac-foto-fix"></span>
        </div>
        <div class="form-group">
          <label class="form-label required">Apakah gangguan kembali terjadi setelah 15 menit pengamatan?</label>
          <div class="radio-group">
            <label class="radio-card">
              <input type="radio" name="ac-kambuh" value="Ya" />
              <span class="radio-box"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
              <span class="radio-label">Ya, gangguan kembali</span>
            </label>
            <label class="radio-card">
              <input type="radio" name="ac-kambuh" value="Tidak" />
              <span class="radio-box"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
              <span class="radio-label">Tidak, perbaikan berhasil</span>
            </label>
          </div>
          <span class="field-error" id="err-ac-kambuh"></span>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" id="ac-reset-btn">Reset Form</button>
      <button type="submit" class="btn-primary" id="ac-submit-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
        <span class="btn-text">Kirim Laporan Maintenance</span>
        <span class="btn-loader" style="display:none"><span class="spinner"></span></span>
      </button>
    </div>
  </form>`;
}

/* ════════════════════════════════════════════════════════════════
   SET PARAMETER AWAL — Halaman setting basis flowmeter
════════════════════════════════════════════════════════════════ */
function getSetParamHTML() {
  const zones = [
    { id:'inlet',   label:'Inlet',   icon:`<path d="M5 12h14M5 12l4-4M5 12l4 4"/>`, cls:'card-icon-sky' },
    { id:'outlet',  label:'Outlet',  icon:`<path d="M19 12H5M19 12l-4 4M19 12l-4-4"/>`, cls:'card-icon-teal' },
    { id:'ras',     label:'RAS',     icon:`<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>`, cls:'card-icon-indigo' },
    { id:'recycle', label:'Recycle', icon:`<path d="M1 4v6h6"/><path d="M3.51 9a9 9 0 105.06-3.55"/>`, cls:'card-icon-blue' },
  ];
  const rows = zones.map(z => `
    <div class="form-card glass-card">
      <div class="card-header">
        <div class="card-icon ${z.cls}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${z.icon}</svg></div>
        <div><h3 class="card-title">Flowmeter ${z.label}</h3><p class="card-subtitle" id="sp-current-${z.id}">Basis saat ini: <b>—</b></p></div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label class="form-label required">Nilai Flowmeter Awal ${z.label}</label>
          <div class="input-wrapper">
            <input type="number" id="sp-flow-${z.id}" class="form-input" placeholder="Contoh: 97231.15" step="0.01" />
            <span class="input-suffix">m³</span>
          </div>
          <span class="field-error" id="err-sp-${z.id}"></span>
        </div>
      </div>
    </div>`).join('');

  return `
  <div class="section-header">
    <div>
      <h2 class="section-title">Set Parameter Awal Flowmeter</h2>
      <p class="section-sub">Atur nilai flowmeter awal sebagai basis perhitungan debit</p>
    </div>
  </div>
  <div class="form-card glass-card" style="margin-bottom:16px;background:var(--sky-light);border:1.5px solid var(--sky)">
    <div style="display:flex;gap:10px;align-items:flex-start">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" stroke-width="2" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.6">
        <b>Cara penggunaan:</b> Isikan nilai flowmeter yang tertera saat ini sebagai titik awal (basis). Setelah disimpan, setiap kali teknisi menginput data, debit akan dihitung otomatis sebagai <b>flowmeter sekarang − basis</b>. Basis otomatis diperbarui setiap kali data berhasil dikirim.
      </div>
    </div>
  </div>
  ${rows}
  <div class="form-actions">
    <button type="button" class="btn-primary" id="sp-save-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      Simpan Parameter Awal
    </button>
  </div>`;
}


function getAppFooterHTML() {
  return `<footer class="app-footer"><span class="app-footer-text">Created with Curiousity by <a href="https://www.linkedin.com/in/muhamad-adha-ismail" target="_blank" rel="noopener noreferrer" class="app-footer-link"><strong>Adha</strong></a> (BTS Batch 5)</span></footer>`;
}

/* ════════════════════════════════════════════════════════════════
   PREVENTIVE MAINTENANCE — GAS-synced scheduling (real-time)
   localStorage is used as local cache / offline fallback only.
════════════════════════════════════════════════════════════════ */
const PM_STORAGE_KEY = 'bumi_preventive_schedules';

/* --- Local cache helpers ---------------------------------------- */
function getPMSchedules() {
  try { return JSON.parse(localStorage.getItem(PM_STORAGE_KEY) || '[]'); } catch(e) { return []; }
}
function savePMSchedules(arr) {
  localStorage.setItem(PM_STORAGE_KEY, JSON.stringify(arr));
}
function deletePMScheduleLocal(id) {
  savePMSchedules(getPMSchedules().filter(s => s.id !== id));
}

/* --- GAS fetch helpers ------------------------------------------ */
async function loadPMSchedulesFromGAS() {
  try {
    const res = await gasFetch({ action: 'getPMSchedules' });
    if (res.status === 'ok' && Array.isArray(res.data)) {
      savePMSchedules(res.data);
      return res.data;
    }
  } catch(e) { console.warn('[PM] loadFromGAS error', e); }
  return getPMSchedules(); // fallback to cache
}

async function savePMScheduleToGAS(schedule) {
  try {
    const res = await gasPost({ formType: 'PM_SCHEDULE', action: 'addPMSchedule', schedule });
    if (res.status === 'ok') {
      /* Refresh from GAS to get the canonical list */
      await loadPMSchedulesFromGAS();
    }
  } catch(e) {
    console.warn('[PM] saveToGAS error — storing locally only', e);
    const existing = getPMSchedules();
    if (!existing.find(s => s.id === schedule.id)) {
      existing.push(schedule);
      savePMSchedules(existing);
    }
  }
}

async function deletePMScheduleFromGAS(id) {
  /* Ambil data schedule sebelum dihapus lokal, untuk dikirim ke GAS */
  const schedules = getPMSchedules();
  const schedule  = schedules.find(s => s.id === id) || {};
  deletePMScheduleLocal(id); /* optimistic local removal */
  try {
    await gasPost({ formType: 'PM_SCHEDULE', action: 'deletePMSchedule', id, schedule });
    await loadPMSchedulesFromGAS(); /* re-sync */
  } catch(e) { console.warn('[PM] deleteFromGAS error', e); }
}

/* Poll PM schedules from GAS every N ms (when preventive section is open) */
let _pmPollInterval = null;
const PM_POLL_MS = 30000; // 30 seconds

/* Filter bulan untuk Daftar Jadwal PM (supervisor) — default bulan ini */
let _pmFilterYear  = new Date().getFullYear();
let _pmFilterMonth = new Date().getMonth(); // 0-based

/* Filter bulan untuk Jadwal PM teknisi — default bulan ini */
let _tekPMFilterYear  = new Date().getFullYear();
let _tekPMFilterMonth = new Date().getMonth(); // default bulan saat ini

function startPMPolling() {
  stopPMPolling();
  _pmPollInterval = setInterval(async () => {
    const onPreventive = $('section-preventive')?.classList.contains('active-section');
    const onDash = $('section-dashboard')?.classList.contains('active-section');
    if (!onPreventive && !onDash) return;
    await loadPMSchedulesFromGAS();
    if (onPreventive) renderPMList();
    /* Also refresh teknisi PM card in dashboard */
    if (onDash && currentUser && !currentUser.role.includes('supervisor')) {
      renderTeknisiPMCard();
    }
  }, PM_POLL_MS);
}

function stopPMPolling() {
  if (_pmPollInterval) { clearInterval(_pmPollInterval); _pmPollInterval = null; }
}

function getPreventiveMaintHTML() {
  const acOpts = AC_UNITS.map(u => `<option value="${escHtml(u)}">${escHtml(u)}</option>`).join('');
  return `
  <div class="section-header">
    <div>
      <h2 class="section-title">Penjadwalan Preventive Maintenance</h2>
      <p class="section-sub">Buat jadwal PM untuk teknisi AC</p>
    </div>
  </div>

  <div class="form-card glass-card" style="margin-bottom:20px">
    <div class="card-header">
      <div class="card-icon card-icon-blue">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      </div>
      <div><h3 class="card-title">Tambah Jadwal PM Baru</h3><p class="card-subtitle">Jadwal akan langsung terlihat di dashboard teknisi AC</p></div>
    </div>
    <form id="pm-form" novalidate>
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label class="form-label required">Unit AC</label>
          <div class="searchable-dropdown" id="pm-unit-dropdown">
            <div class="searchable-input-wrapper" id="pm-unit-wrapper">
              <input type="text" class="searchable-input" id="pm-unit-search" placeholder="Ketik atau pilih unit AC…" autocomplete="off" />
              <button type="button" class="searchable-clear" id="pm-unit-clear">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <svg class="searchable-chevron" id="pm-unit-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="searchable-list" id="pm-unit-list"></div>
          </div>
          <input type="hidden" id="pm-unit-value" />
          <span class="field-error" id="err-pm-unit"></span>
        </div>
        <div class="form-group">
          <label class="form-label required">Tanggal PM</label>
          <input type="date" id="pm-tanggal" class="form-input" required />
          <span class="field-error" id="err-pm-tanggal"></span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Keterangan Khusus</label>
        <textarea id="pm-keterangan" class="form-textarea" rows="3" placeholder="Contoh: Cek freon, bersihkan evaporator dan filter, cek kondensor…"></textarea>
      </div>
      <div class="form-actions" style="margin-top:12px">
        <button type="button" class="btn-secondary" id="pm-reset-btn">Reset</button>
        <button type="submit" class="btn-primary" id="pm-submit-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>
          <span class="btn-text">Simpan Jadwal PM</span>
          <span class="btn-loader" style="display:none"><span class="spinner"></span></span>
        </button>
      </div>
    </form>
  </div>

  <div class="dash-card">
    <div class="dash-card-header" style="flex-wrap:wrap;gap:10px">
      <h3>Daftar Jadwal PM</h3>
      <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap">
        <div class="pm-filter-group">
          <select class="pm-filter-select" id="pm-filter-month" title="Pilih bulan"></select>
          <input type="number" class="pm-filter-select pm-filter-select-year" id="pm-filter-year" title="Ketik tahun" min="2000" max="2199" style="width:72px;text-align:center" />
          <button class="pm-month-nav-btn pm-today-btn" id="pm-goto-today" title="Kembali ke bulan ini">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/></svg>
          </button>
          <button class="btn-pdf" id="pm-schedule-pdf-btn" title="Unduh PDF Jadwal Bulan Ini" style="height:32px;padding:0 12px;font-size:0.78rem;display:inline-flex;align-items:center;gap:5px">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Unduh PDF
          </button>
        </div>
        <span class="dash-badge" id="pm-list-count">0 jadwal</span>
      </div>
    </div>
    <div id="pm-schedule-list"></div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════
   PM LIST SHARED RENDERER
   mode: 'supervisor' → tampilkan tombol hapus, filter bulan
         'teknisi'    → tampilkan tombol laporan PM, semua bulan mendatang
════════════════════════════════════════════════════════════════ */

/**
 * Render daftar jadwal PM ke dalam elemen `wrap`.
 * @param {HTMLElement} wrap      - target container
 * @param {Array}       schedules - data dari GAS (sudah dinormalisasi tanggalnya)
 * @param {'supervisor'|'teknisi'} mode
 * @param {string}      monthKey  - filter "YYYY-MM" (hanya untuk supervisor)
 */
function _buildPMListIntoWrap(wrap, schedules, mode, monthKey) {
  const today = getTodayDate();
  const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  /* Filter bulan untuk supervisor */
  let filtered = schedules;
  if (mode === 'supervisor' && monthKey) {
    filtered = schedules.filter(s => s.tanggal && s.tanggal.startsWith(monthKey));
  }
  /* Untuk teknisi: jika monthKey diberikan → filter bulan itu; jika null → semua mendatang */
  if (mode === 'teknisi') {
    if (monthKey) {
      filtered = schedules.filter(s => s.tanggal && s.tanggal.startsWith(monthKey));
    } else {
      filtered = schedules.filter(s => s.tanggal >= today && (!s.status || s.status.trim() !== 'Sudah'));
    }
  }

  if (!filtered.length) {
    const msg = mode === 'supervisor'
      ? 'Belum ada jadwal PM bulan ini'
      : (monthKey ? 'Belum ada jadwal PM di bulan ini' : 'Belum ada jadwal PM di bulan ini');
    const sub = mode === 'supervisor'
      ? 'Tambahkan jadwal PM baru menggunakan form di atas'
      : (monthKey ? 'Coba pilih bulan lain' : 'Supervisor belum membuat jadwal, atau semua jadwal sudah selesai');
    wrap.innerHTML = `<div class="attention-empty" style="padding:32px 16px">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <p>${msg}</p><span>${sub}</span></div>`;
    return;
  }

  /* Group by tanggal, urutkan */
  const byDate = {};
  filtered.forEach(s => {
    const key = s.tanggal || 'unknown';
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(s);
  });

  const pastDates     = Object.keys(byDate).filter(d => d < today).sort().reverse(); /* terbaru dulu */
  const todayDates    = Object.keys(byDate).filter(d => d === today);
  const upcomingDates = Object.keys(byDate).filter(d => d > today).sort(); /* terdekat dulu */
  /* Urutan berdasarkan kedekatan dengan hari ini:
     1. Hari ini (paling dekat)
     2. Mendatang: terdekat → terjauh (ascending)
     3. Lampau: terdekat → terjauh dari hari ini (descending) */
  const orderedDates = [...todayDates, ...upcomingDates, ...pastDates];

  /* Summary counts — tidak ditampilkan, tetap dihitung untuk keperluan logika lain */

  function formatDateHeader(dateKey) {
    const [y, m, d] = dateKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    return `${days[dateObj.getDay()]}, ${d} ${MONTHS_ID[m - 1]} ${y}`;
  }

  function buildDateBlock(dateKey) {
    const items = byDate[dateKey] || [];
    const isToday = dateKey === today;
    const isPast  = dateKey < today;
    const headerLabel = isToday
      ? `<span class="pm-list-date-label">${formatDateHeader(dateKey)}</span><span class="pm-today-badge" style="margin-left:8px">Hari Ini</span>`
      : `<span class="pm-list-date-label">${formatDateHeader(dateKey)}</span>`;
    const blockClass = isToday ? 'pm-list-date-block pm-list-today'
                     : isPast  ? 'pm-list-date-block pm-list-past'
                     :           'pm-list-date-block pm-list-upcoming';

    const rows = items.map(s => {
      const isSudah = s.status && s.status.trim() === 'Sudah';
      const statusClass = isSudah    ? 'pm-status-done'
                        : isPast     ? 'pm-status-past'
                        : isToday    ? 'pm-status-today'
                        :              'pm-status-upcoming'; /* tetap untuk blockClass styling */

      /* Action buttons: berbeda antara supervisor dan teknisi */
      let actionBtns = '';
      if (mode === 'supervisor' && !isSudah) {
        actionBtns = `<button class="pm-delete-btn pm-list-del-btn" data-pmid="${escHtml(s.id)}" title="Hapus jadwal">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Hapus
        </button>`;
      } else if (mode === 'teknisi' && !isSudah) {
        actionBtns = `<button class="btn-primary pm-laporan-btn" data-pmid="${escHtml(s.id)}" data-unit="${escHtml(s.unitAC)}" data-tanggal="${escHtml(s.tanggal)}" style="font-size:0.78rem;padding:5px 13px;margin-top:2px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Laporan PM
        </button>`;
      }

      return `
      <div class="pm-list-item">
        <div class="pm-list-item-left">
          <div class="pm-list-unit">${escHtml(s.unitAC || '—')}</div>
          ${(s.keterangan || s.deskripsi) ? `<div class="pm-list-desc">${escHtml(s.keterangan || s.deskripsi)}</div>` : ''}
          ${s.selesaiOleh ? `<div class="pm-list-done-by">✓ Dikerjakan oleh: ${escHtml(s.selesaiOleh)}</div>` : ''}
        </div>
        <div class="pm-list-item-right">
          ${actionBtns}
        </div>
      </div>`;
    }).join('');

    return `
    <div class="${blockClass}">
      <div class="pm-list-date-header">${headerLabel}</div>
      <div class="pm-list-items">${rows}</div>
    </div>`;
  }

  /* Simpan data yang sudah difilter untuk dipakai tombol PDF */
  if (mode === 'supervisor') window._pmScheduleDataForPDF = filtered;

  wrap.innerHTML = `
  <div class="pm-list-wrap">
    ${orderedDates.map(buildDateBlock).join('')}
  </div>`;

  /* Attach supervisor delete buttons */
  wrap.querySelectorAll('.pm-list-del-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      await deletePMScheduleFromGAS(btn.dataset.pmid);
      renderPMList();
      showNotif('success','Berhasil','Jadwal PM berhasil dihapus.');
    });
  });

  /* Attach teknisi laporan PM buttons */
  wrap.querySelectorAll('.pm-laporan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openPMLaporanModal(btn.dataset.pmid, btn.dataset.unit, btn.dataset.tanggal);
    });
  });
}

/* ── Supervisor: renderPMList dengan filter bulan ──────────────── */
function renderPMList() {
  const wrap    = $('pm-schedule-list');
  const countEl = $('pm-list-count');
  if (!wrap) return;

  const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  /* ── Populate dropdown bulan (sekali, atau refresh pilihan aktif) */
  const monthSel = $('pm-filter-month');
  const yearSel  = $('pm-filter-year');

  if (monthSel && !monthSel.dataset.ready) {
    monthSel.innerHTML = MONTHS_ID.map((m, i) =>
      `<option value="${i}">${m}</option>`).join('');
    monthSel.dataset.ready = '1';
    monthSel.addEventListener('change', () => {
      _pmFilterMonth = parseInt(monthSel.value, 10);
      renderPMList();
    });
  }
  if (monthSel) monthSel.value = String(_pmFilterMonth);

  /* ── Tahun: input teks bebas, tidak dibatasi */
  if (yearSel && !yearSel.dataset.ready) {
    yearSel.dataset.ready = '1';
    yearSel.addEventListener('change', () => {
      const v = parseInt(yearSel.value, 10);
      if (!isNaN(v) && v > 1900 && v < 2200) {
        _pmFilterYear = v;
        renderPMList();
      }
    });
    yearSel.addEventListener('keydown', e => {
      if (e.key === 'Enter') { yearSel.dispatchEvent(new Event('change')); }
    });
  }
  if (yearSel) yearSel.value = String(_pmFilterYear);

  /* ── Tombol "kembali ke bulan ini" */
  const todayBtn = $('pm-goto-today');
  if (todayBtn && !todayBtn.dataset.ready) {
    todayBtn.dataset.ready = '1';
    todayBtn.addEventListener('click', () => {
      const now = new Date();
      _pmFilterMonth = now.getMonth();
      _pmFilterYear  = now.getFullYear();
      renderPMList();
    });
  }

  /* ── Tombol "Unduh PDF" di header */
  const pdfBtn = $('pm-schedule-pdf-btn');
  if (pdfBtn) {
    pdfBtn.onclick = () => {
      const mk = `${_pmFilterYear}-${String(_pmFilterMonth + 1).padStart(2,'0')}`;
      /* Ambil data fresh dari state, filter ketat sesuai bulan yang dipilih di dropdown */
      const allSchedules = getPMSchedules().map(s => ({ ...s, tanggal: normalizeTanggal(s.tanggal) }));
      const dataForPDF = allSchedules.filter(s => s.tanggal && s.tanggal.startsWith(mk));
      printPMSchedulePDF(dataForPDF, mk);
    };
  }

  /* Ambil & normalisasi data */
  const rawSchedules = getPMSchedules();
  const schedules = rawSchedules.map(s => ({ ...s, tanggal: normalizeTanggal(s.tanggal) }));

  /* Filter bulan aktif untuk badge count di header */
  const monthKey = `${_pmFilterYear}-${String(_pmFilterMonth + 1).padStart(2,'0')}`;
  const monthCount = schedules.filter(s => s.tanggal && s.tanggal.startsWith(monthKey)).length;
  if (countEl) countEl.textContent = `${monthCount} jadwal`;

  /* Render list dengan filter bulan */
  _buildPMListIntoWrap(wrap, schedules, 'supervisor', monthKey);
}

/* ── Teknisi: renderTeknisiPMCard (dashboard teknisi AC) ───────── */
function renderTeknisiPMCard() {
  const wrap = $('teknisi-pm-wrap');
  if (!wrap) return;

  const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  /* ── Setup dropdown bulan */
  const monthSel = $('tek-pm-filter-month');
  const yearSel  = $('tek-pm-filter-year');

  if (monthSel && !monthSel.dataset.ready) {
    monthSel.innerHTML = MONTHS_ID.map((m, i) => `<option value="${i}">${m}</option>`).join('');
    monthSel.dataset.ready = '1';
    monthSel.addEventListener('change', () => {
      _tekPMFilterMonth = parseInt(monthSel.value, 10);
      renderTeknisiPMCard();
    });
  }
  if (monthSel) monthSel.value = String(_tekPMFilterMonth);

  if (yearSel && !yearSel.dataset.ready) {
    yearSel.dataset.ready = '1';
    yearSel.addEventListener('change', () => {
      const v = parseInt(yearSel.value, 10);
      if (!isNaN(v) && v > 1900 && v < 2200) {
        _tekPMFilterYear = v;
        renderTeknisiPMCard();
      }
    });
    yearSel.addEventListener('keydown', e => {
      if (e.key === 'Enter') { yearSel.dispatchEvent(new Event('change')); }
    });
  }
  if (yearSel) yearSel.value = String(_tekPMFilterYear);

  /* Year input selalu aktif */
  if (yearSel) yearSel.disabled = false;

  /* Tombol kembali ke bulan ini */
  const todayBtn = $('tek-pm-goto-today');
  if (todayBtn && !todayBtn.dataset.ready) {
    todayBtn.dataset.ready = '1';
    todayBtn.addEventListener('click', () => {
      const now = new Date();
      _tekPMFilterMonth = now.getMonth();
      _tekPMFilterYear  = now.getFullYear();
      renderTeknisiPMCard();
    });
  }

  wrap.innerHTML = `<div class="history-loading" style="padding:18px"><div class="spinner spinner-dark"></div>&nbsp;Memuat jadwal…</div>`;

  /* Tentukan monthKey dari filter bulan yang dipilih */
  const monthKey = `${_tekPMFilterYear}-${String(_tekPMFilterMonth + 1).padStart(2,'0')}`;

  loadPMSchedulesFromGAS().then(rawSchedules => {
    const schedules = rawSchedules.map(s => ({ ...s, tanggal: normalizeTanggal(s.tanggal) }));
    _buildPMListIntoWrap(wrap, schedules, 'teknisi', monthKey);
    startPMPolling();
  }).catch(() => {
    const fallback = getPMSchedules().map(s => ({ ...s, tanggal: normalizeTanggal(s.tanggal) }));
    _buildPMListIntoWrap(wrap, fallback, 'teknisi', monthKey);
  });
}


/* ════════════════════════════════════════════════════════════════
   LAPORAN PM MODAL — Teknisi AC
════════════════════════════════════════════════════════════════ */
function openPMLaporanModal(pmId, unitAC, tanggal) {
  /* Remove existing modal if any */
  const existing = document.getElementById('pm-laporan-modal');
  if (existing) existing.remove();

  const dateObj = new Date(tanggal + 'T00:00:00');
  const dateStr = dateObj.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'});

  const modal = document.createElement('div');
  modal.id = 'pm-laporan-modal';
  modal.className = 'pm-laporan-overlay';
  modal.innerHTML = `
  <div class="pm-laporan-box">
    <div class="pm-laporan-header">
      <div>
        <h3 class="pm-laporan-title">Laporan Preventive Maintenance</h3>
        <p class="pm-laporan-sub">${escHtml(unitAC)} &bull; ${escHtml(dateStr)}</p>
      </div>
      <button class="pm-laporan-close" id="pm-laporan-close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="pm-laporan-body">
      <form id="pm-laporan-form" novalidate>

        <!-- Kondisi AC -->
        <div class="pm-laporan-section-title">Kondisi Unit AC — Sebelum PM</div>
        <div class="pm-kondisi-grid">
          <!-- Suhu sebelum/sesudah -->
          <div class="pm-kondisi-card">
            <div class="pm-kondisi-card-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>
              Suhu Ruangan (°C)
            </div>
            <div class="pm-before-after-row">
              <div class="form-group pm-ba-field">
                <label class="form-label required">Sebelum PM</label>
                <input type="number" id="pml-suhu-before" class="form-input" placeholder="mis. 28" min="10" max="50" step="0.5" />
                <span class="field-error" id="err-pml-suhu-before"></span>
              </div>
              <div class="pm-ba-arrow">→</div>
              <div class="form-group pm-ba-field">
                <label class="form-label required">Sesudah PM</label>
                <input type="number" id="pml-suhu-after" class="form-input" placeholder="mis. 24" min="10" max="50" step="0.5" />
                <span class="field-error" id="err-pml-suhu-after"></span>
              </div>
            </div>
          </div>
          <!-- Tekanan Freon sebelum/sesudah -->
          <div class="pm-kondisi-card">
            <div class="pm-kondisi-card-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              Tekanan Freon (psi)
            </div>
            <div class="pm-before-after-row">
              <div class="form-group pm-ba-field">
                <label class="form-label required">Sebelum PM</label>
                <input type="number" id="pml-tekanan-before" class="form-input" placeholder="mis. 55" min="0" max="500" step="1" />
                <span class="field-error" id="err-pml-tekanan-before"></span>
              </div>
              <div class="pm-ba-arrow">→</div>
              <div class="form-group pm-ba-field">
                <label class="form-label required">Sesudah PM</label>
                <input type="number" id="pml-tekanan-after" class="form-input" placeholder="mis. 68" min="0" max="500" step="1" />
                <span class="field-error" id="err-pml-tekanan-after"></span>
              </div>
            </div>
          </div>
          <!-- Ampere Indoor sebelum/sesudah -->
          <div class="pm-kondisi-card">
            <div class="pm-kondisi-card-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Arus Indoor (A)
            </div>
            <div class="pm-before-after-row">
              <div class="form-group pm-ba-field">
                <label class="form-label required">Sebelum PM</label>
                <input type="number" id="pml-ampere-before" class="form-input" placeholder="mis. 4.2" min="0" max="50" step="0.1" />
                <span class="field-error" id="err-pml-ampere-before"></span>
              </div>
              <div class="pm-ba-arrow">→</div>
              <div class="form-group pm-ba-field">
                <label class="form-label required">Sesudah PM</label>
                <input type="number" id="pml-ampere-after" class="form-input" placeholder="mis. 3.8" min="0" max="50" step="0.1" />
                <span class="field-error" id="err-pml-ampere-after"></span>
              </div>
            </div>
          </div>
          <!-- Suhu Discharge Pipa sebelum/sesudah -->
          <div class="pm-kondisi-card">
            <div class="pm-kondisi-card-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
              Suhu Pipa Discharge (°C)
            </div>
            <div class="pm-before-after-row">
              <div class="form-group pm-ba-field">
                <label class="form-label required">Sebelum PM</label>
                <input type="number" id="pml-discharge-before" class="form-input" placeholder="mis. 65" min="0" max="120" step="0.5" />
                <span class="field-error" id="err-pml-discharge-before"></span>
              </div>
              <div class="pm-ba-arrow">→</div>
              <div class="form-group pm-ba-field">
                <label class="form-label required">Sesudah PM</label>
                <input type="number" id="pml-discharge-after" class="form-input" placeholder="mis. 58" min="0" max="120" step="0.5" />
                <span class="field-error" id="err-pml-discharge-after"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tindakan PM -->
        <div class="pm-laporan-section-title" style="margin-top:16px">Tindakan yang Dilakukan</div>
        <div class="form-group">
          <label class="form-label required">Checklist Tindakan PM</label>
          <div class="pm-checklist-wrap">
            ${['Pembersihan evaporator (indoor coil)','Pembersihan filter udara','Pembersihan kondensor (outdoor coil)','Pengecekan & pengisian freon','Pembersihan saluran drainase','Pengecekan kelistrikan & MCB','Pelumasan komponen bergerak','Pengecekan tekanan freon','Pengecekan suhu ruangan','Pengecekan fan indoor & outdoor'].map((t,i)=>`
            <label class="pm-check-item">
              <input type="checkbox" class="pm-check-input" value="${escHtml(t)}" id="pml-chk-${i}" />
              <span class="pm-check-box"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
              <span class="pm-check-label">${escHtml(t)}</span>
            </label>`).join('')}
          </div>
          <span class="field-error" id="err-pml-checklist"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Catatan Tambahan / Temuan Lain</label>
          <textarea id="pml-catatan" class="form-textarea" rows="3" placeholder="Tuliskan temuan atau catatan teknis lainnya…"></textarea>
        </div>

        <!-- Foto -->
        <div class="pm-laporan-section-title" style="margin-top:16px">Dokumentasi Foto</div>
        <div class="form-grid form-grid-2">
          <div class="form-group">
            <label class="form-label">Foto Sebelum PM</label>
            <div class="upload-area" id="pml-before-area">
              <input type="file" id="pml-foto-before" accept="image/*" class="upload-input" />
              <div class="upload-placeholder">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p>Foto sebelum PM</p><span>PNG/JPG · Maks 10MB · Opsional</span>
              </div>
              <div class="upload-preview" id="pml-before-preview" style="display:none">
                <img id="pml-before-img" src="" alt="Preview" />
                <button type="button" class="upload-remove" id="pml-before-remove">✕ Hapus</button>
              </div>
            </div>
            <span class="field-error" id="err-pml-foto-before"></span>
          </div>
          <div class="form-group">
            <label class="form-label">Foto Setelah PM</label>
            <div class="upload-area" id="pml-after-area">
              <input type="file" id="pml-foto-after" accept="image/*" class="upload-input" />
              <div class="upload-placeholder">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p>Foto setelah PM</p><span>PNG/JPG · Maks 10MB · Opsional</span>
              </div>
              <div class="upload-preview" id="pml-after-preview" style="display:none">
                <img id="pml-after-img" src="" alt="Preview" />
                <button type="button" class="upload-remove" id="pml-after-remove">✕ Hapus</button>
              </div>
            </div>
            <span class="field-error" id="err-pml-foto-after"></span>
          </div>
        </div>

        <!-- Status Akhir -->
        <div class="pm-laporan-section-title" style="margin-top:16px">Status Akhir</div>
        <div class="form-group">
          <label class="form-label required">Status Setelah PM</label>
          <div class="radio-group">
            <label class="radio-card">
              <input type="radio" name="pml-status" value="Normal — AC berfungsi baik" />
              <span class="radio-box"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
              <span class="radio-label">Normal — AC berfungsi baik</span>
            </label>
            <label class="radio-card">
              <input type="radio" name="pml-status" value="Perlu tindak lanjut" />
              <span class="radio-box"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
              <span class="radio-label">Perlu tindak lanjut</span>
            </label>
            <label class="radio-card">
              <input type="radio" name="pml-status" value="Perlu penggantian spare part" />
              <span class="radio-box"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
              <span class="radio-label">Perlu penggantian spare part</span>
            </label>
          </div>
          <span class="field-error" id="err-pml-status"></span>
        </div>

        <div class="form-actions" style="margin-top:16px;justify-content:flex-end">
          <button type="button" class="btn-secondary" id="pm-laporan-cancel">Batal</button>
          <button type="submit" class="btn-primary" id="pm-laporan-submit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
            <span class="btn-text">Kirim Laporan PM</span>
            <span class="btn-loader" style="display:none"><span class="spinner"></span></span>
          </button>
        </div>
      </form>
    </div>
  </div>`;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.classList.add('open'), 10);

  /* Init photo uploads */
  initUpload('pml-foto-before','pml-before-preview','pml-before-img','pml-before-remove','pml-before-area');
  initUpload('pml-foto-after','pml-after-preview','pml-after-img','pml-after-remove','pml-after-area');

  function closeModal() {
    modal.classList.remove('open');
    setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 280);
  }

  $('pm-laporan-close')?.addEventListener('click', closeModal);
  $('pm-laporan-cancel')?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  $('pm-laporan-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      ['pml-suhu-before','err-pml-suhu-before','Suhu ruangan sebelum PM wajib diisi.'],
      ['pml-suhu-after','err-pml-suhu-after','Suhu ruangan sesudah PM wajib diisi.'],
      ['pml-tekanan-before','err-pml-tekanan-before','Tekanan freon sebelum PM wajib diisi.'],
      ['pml-tekanan-after','err-pml-tekanan-after','Tekanan freon sesudah PM wajib diisi.'],
      ['pml-ampere-before','err-pml-ampere-before','Arus indoor sebelum PM wajib diisi.'],
      ['pml-ampere-after','err-pml-ampere-after','Arus indoor sesudah PM wajib diisi.'],
      ['pml-discharge-before','err-pml-discharge-before','Suhu discharge sebelum PM wajib diisi.'],
      ['pml-discharge-after','err-pml-discharge-after','Suhu discharge sesudah PM wajib diisi.'],
    ];
    fields.forEach(([id, errId, msg]) => {
      const el = $(id); const errEl = $(errId);
      if (!el || !el.value.trim()) { if(errEl) errEl.textContent = msg; valid = false; }
      else { if(errEl) errEl.textContent = ''; }
    });

    const checkedItems = [...document.querySelectorAll('.pm-check-input:checked')].map(c => c.value);
    if (!checkedItems.length) { $('err-pml-checklist').textContent = 'Centang minimal satu tindakan PM.'; valid = false; }
    else { $('err-pml-checklist').textContent = ''; }

    const statusVal = document.querySelector('input[name="pml-status"]:checked')?.value;
    if (!statusVal) { $('err-pml-status').textContent = 'Pilih status akhir AC.'; valid = false; }
    else { $('err-pml-status').textContent = ''; }

    const fotoBeforeFile = $('pml-foto-before')?.files?.[0];
    const fotoAfterFile  = $('pml-foto-after')?.files?.[0];
    $('err-pml-foto-before').textContent = '';
    $('err-pml-foto-after').textContent = '';

    if (!valid) return;

    const submitBtn = $('pm-laporan-submit');
    setButtonLoading(submitBtn, true);

    const [fotoBeforeB64, fotoAfterB64] = await Promise.all([
      fileToBase64(fotoBeforeFile),
      fileToBase64(fotoAfterFile),
    ]);

    const payload = {
      formType: 'PM_LAPORAN',
      pmId,
      unitAC,
      tanggal,
      kondisi: {
        suhu_before:       parseFloat($('pml-suhu-before').value)    || 0,
        suhu_after:        parseFloat($('pml-suhu-after').value)     || 0,
        tekanan_before:    parseFloat($('pml-tekanan-before').value) || 0,
        tekanan_after:     parseFloat($('pml-tekanan-after').value)  || 0,
        ampere_before:     parseFloat($('pml-ampere-before')?.value) || 0,
        ampere_after:      parseFloat($('pml-ampere-after')?.value)  || 0,
        discharge_before:  parseFloat($('pml-discharge-before')?.value) || 0,
        discharge_after:   parseFloat($('pml-discharge-after')?.value)  || 0,
      },
      tindakan:    checkedItems.join('; '),
      catatan:     $('pml-catatan')?.value || '',
      statusAkhir: statusVal,
      namaTeknisi: currentUser?.nama || '',
      nikTeknisi:  currentUser?.nik  || '',
      timestamp:   getNowTimestamp(),
      fotoBeforeName: fotoBeforeFile ? generateFotoName('PM Sebelum', fotoBeforeFile.name, tanggal, unitAC) : '',
      fotoAfterName:  fotoAfterFile  ? generateFotoName('PM Sesudah', fotoAfterFile.name,  tanggal, unitAC) : '',
      fotoBeforeData: fotoBeforeB64,
      fotoAfterData:  fotoAfterB64,
    };

    try {
      const res = await gasPost(payload);
      setButtonLoading(submitBtn, false);
      closeModal();

      /* Tandai jadwal sebagai "Sudah" di local cache */
      const allSched = getPMSchedules();
      const idx = allSched.findIndex(s => s.id === pmId);
      if (idx !== -1) {
        allSched[idx].status = 'Sudah';
        savePMSchedules(allSched);
      }
      /* Tandai "Sudah" di GAS (kolom Status → "Sudah", bukan hapus)
         Kirim unitAC + tanggal untuk pencocokan baris di spreadsheet,
         dan id (sheet_N) untuk fallback pencarian berdasarkan nomor baris. */
      try {
        await gasPost({
          formType: 'PM_SCHEDULE',
          action: 'markPMDone',
          id: pmId,
          unitAC,
          tanggal,
          namaTeknisi: currentUser?.nama || '',
        });
      } catch(e) {}

      showNotif('success', 'Laporan PM Terkirim', `Laporan PM ${unitAC} berhasil dikirim.`);

      /* Refresh PM card di dashboard teknisi */
      renderTeknisiPMCard();
      /* Reload PM stats */
      loadACPMStats();
    } catch(err) {
      setButtonLoading(submitBtn, false);
      showNotif('error', 'Gagal', 'Terjadi kesalahan saat mengirim laporan. Coba lagi.');
    }
  });
}

function attachPreventiveForm(user) {
  initSearchableDropdown('pm-unit-dropdown','pm-unit-search','pm-unit-list','pm-unit-clear','pm-unit-chevron','pm-unit-value', AC_UNITS);

  /* Set default date to today */
  const pmDate = $('pm-tanggal');
  if (pmDate) pmDate.value = getTodayDate();

  $('pm-reset-btn')?.addEventListener('click', () => {
    if ($('pm-unit-search')) { $('pm-unit-search').value=''; $('pm-unit-value').value=''; }
    if (pmDate) pmDate.value = getTodayDate();
    if ($('pm-keterangan')) $('pm-keterangan').value = '';
    ['err-pm-unit','err-pm-tanggal'].forEach(id => { const el=$(id); if(el)el.textContent=''; });
  });

  $('pm-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const unit      = $('pm-unit-value')?.value?.trim() || $('pm-unit-search')?.value?.trim();
    const tanggal   = $('pm-tanggal')?.value?.trim();
    const keterangan = $('pm-keterangan')?.value?.trim();

    let valid = true;
    if (!unit) { $('err-pm-unit').textContent = 'Pilih unit AC terlebih dahulu.'; valid=false; }
    else { $('err-pm-unit').textContent = ''; }
    if (!tanggal) { $('err-pm-tanggal').textContent = 'Pilih tanggal PM.'; valid=false; }
    else { $('err-pm-tanggal').textContent = ''; }
    if (!valid) return;

    const btn = $('pm-submit-btn');
    setButtonLoading(btn, true);

    const schedule = {
      id: `pm_${Date.now()}_${Math.floor(Math.random()*9999)}`,
      unitAC: unit,
      tanggal,
      keterangan,
      createdBy: user.nama,
      createdAt: getNowTimestamp(),
    };

    /* Save locally first (optimistic), then sync to GAS */
    const existing = getPMSchedules();
    existing.push(schedule);
    savePMSchedules(existing);
    renderPMList();
    setButtonLoading(btn, false);
    showNotif('success','Jadwal PM Tersimpan',`PM untuk ${unit} pada ${new Date(tanggal+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})} berhasil dijadwalkan.`);

    /* Reset form */
    if ($('pm-unit-search')) { $('pm-unit-search').value=''; $('pm-unit-value').value=''; }
    if ($('pm-keterangan')) $('pm-keterangan').value = '';
    if (pmDate) pmDate.value = getTodayDate();

    /* Background sync to GAS */
    savePMScheduleToGAS(schedule).then(() => {
      /* Re-render after GAS confirms to pick up server-side data */
      renderPMList();
    });
  });

  /* Initial load from GAS */
  loadPMSchedulesFromGAS().then(() => renderPMList());
  startPMPolling();
}

/* ════════════════════════════════════════════════════════════════
   BUILD APP SHELL
════════════════════════════════════════════════════════════════ */
function buildAppShell(user) {
  const root = $('app-root'); if(!root) return;
  const isSupervisor = user.role.includes('supervisor');

  let dashHTML = getWelcomeHero(user);
  if (user.role==='teknisi-ipal' || user.role==='teknisi-ac') dashHTML += getDashTeknisi(user);
  if (user.role==='supervisor-ipal') dashHTML += getDashSupervisorIPAL();
  if (user.role==='supervisor-ac')   dashHTML += getDashSupervisorAC();

  let inputHTML = '';
  if (user.role==='teknisi-ac')   inputHTML = getACFormHTML();
  if (user.role==='teknisi-ipal') inputHTML = getIPALFormHTML();
  // Supervisors also have input (to add entries manually)
  if (user.role==='supervisor-ipal') inputHTML = getIPALFormHTML();
  if (user.role==='supervisor-ac')   inputHTML = getACFormHTML();

  let historyHTML = '';
  if (user.role==='supervisor-ipal') historyHTML = getHistoryIPALHTML();
  if (user.role==='supervisor-ac')   historyHTML = getHistoryACHTML();

  const isIPAL = user.role === 'teknisi-ipal' || user.role === 'supervisor-ipal';
  const setParamHTML = isIPAL ? getSetParamHTML() : '';

  const isPreventiveAC = user.role === 'supervisor-ac';
  const hasPMHistory = false; /* PM History sekarang digabung di section history (supervisor-ac) dan dashboard (teknisi-ac) */

  root.innerHTML = `
  <div id="page-app" class="page active">
    ${getSidebarHTML(user)}
    <main class="main-content" id="main-content">
      ${getTopbarHTML(user)}
      <div class="content-body">
        <section id="section-dashboard" class="form-section active-section">${dashHTML}${getAppFooterHTML()}</section>
        <section id="section-input" class="form-section">${inputHTML}${getAppFooterHTML()}</section>
        ${isSupervisor ? `<section id="section-history" class="form-section">${historyHTML}${getAppFooterHTML()}</section>` : ''}
        ${isIPAL ? `<section id="section-setparam" class="form-section">${setParamHTML}${getAppFooterHTML()}</section>` : ''}
        ${isPreventiveAC ? `<section id="section-preventive" class="form-section">${getPreventiveMaintHTML()}${getAppFooterHTML()}</section>` : ''}
        ${hasPMHistory ? `<section id="section-pm-history" class="form-section">${getPMHistoryHTML(user.role === 'supervisor-ac')}${getAppFooterHTML()}</section>` : ''}
      </div>
    </main>
  </div>`;

  const lp=$('page-login');
  if(lp){ lp.style.display='none'; lp.classList.remove('active'); }

  setTheme(html.getAttribute('data-theme')||'light');
  attachListeners(user);
  startClock();

  /* Load actual Drive folder URLs from GAS */
  loadDriveFolderUrls(user);
}

/* ── AUTO-FETCH (real-time polling) ─────────────────────────── */
function startAutoFetch(user) {
  if(autoFetchInterval) clearInterval(autoFetchInterval);
  let isFetching = false;

  autoFetchInterval = setInterval(async () => {
    /* Cek apakah section yang relevan sedang aktif */
    const onDashboard = $('section-dashboard')?.classList.contains('active-section');
    const onHistory   = $('section-history')?.classList.contains('active-section');
    if(!onDashboard && !onHistory) return;

    /* Guard: skip kalau fetch sebelumnya belum selesai */
    if(isFetching) return;
    isFetching = true;

    try {
      if(user.role === 'supervisor-ipal') {
        if(onDashboard) {
          checkAndApplyDailyFlowReset();
          const [latestRes, chartRes, historyRes] = await Promise.all([
            gasFetch({action:'getIPALLatest'}),
            gasFetch({action:'getIPALChart', date:getTodayDate()}),
            gasFetch({action:'getIPALHistory'}),
          ]);
          ipalChartData = chartRes.data || {};
          window._ipalHistoryData = historyRes.data||[];
          const keteranganItems = (historyRes.data||[]).filter(d=>
            d.keteranganTambahan && d.keteranganTambahan.trim()
          );
          renderIPALMonitorCards(latestRes.data || {}, keteranganItems);
          updateDebitTotalDisplay();
          renderIPALUnifiedChart(ipalChartData, _activeUnifiedZone, _activeUnifiedParam);
          _renderUnifiedParamBtns(_activeUnifiedZone, _activeUnifiedParam);
          _attachUnifiedParamListeners();
          /* Sinkron basis flowmeter */
          await loadFlowBasisFromGAS(); refreshFlowHints();
        }
        if(onHistory) {
          await loadSupervisorHistory(user);
        }
        /* Sinkronkan basis saat section input aktif */
        const onInput = $('section-input')?.classList.contains('active-section');
        if(onInput) { await loadFlowBasisFromGAS(); refreshFlowHints(); }
      } else if(user.role === 'supervisor-ac') {
        if(onDashboard) await loadACDashboard(currentACPeriod);
        if(onHistory)   await loadSupervisorHistory(user);
      } else if(user.role === 'teknisi-ipal') {
        if(onDashboard) {
          await loadOwnHistory(user);
          await loadFlowBasisFromGAS(); refreshFlowHints();
        }
        /* Juga sinkronkan basis saat section input sedang aktif */
        const onInput = $('section-input')?.classList.contains('active-section');
        if(onInput) { await loadFlowBasisFromGAS(); refreshFlowHints(); }
      } else if(user.role === 'teknisi-ac') {
        if(onDashboard) await loadOwnHistory(user);
      }
      showAutoFetchPulse();
    } catch(e){ console.warn('[AutoFetch]', e); }
    finally { isFetching = false; }
  }, AUTO_FETCH_MS);
}

/* ── IMMEDIATE REFRESH — dipanggil tepat setelah submit berhasil ── */
/**
 * Langsung fetch ulang data dashboard & history tanpa menunggu interval 15 detik.
 * Juga me-reset countdown timer agar sinkron dengan fetch yang baru saja dilakukan.
 */
async function triggerImmediateRefresh(user) {
  /* Reset countdown visual agar tidak membingungkan */
  if(_countdownInterval) clearInterval(_countdownInterval);
  const countEl = $('autofetch-countdown');
  const barEl   = $('autofetch-bar');
  if(countEl) countEl.textContent = '…';
  if(barEl)   { barEl.style.transition='none'; barEl.style.width='100%'; }

  try {
    if(user.role === 'teknisi-ipal' || user.role === 'supervisor-ipal') {
      checkAndApplyDailyFlowReset();
      const [latestRes, chartRes, historyRes] = await Promise.all([
        gasFetch({action:'getIPALLatest'}),
        gasFetch({action:'getIPALChart', date:getTodayDate()}),
        gasFetch({action:'getIPALHistory'}),
      ]);
      ipalChartData = chartRes.data || {};
      window._ipalHistoryData = historyRes.data || [];
      const keteranganItems = (historyRes.data||[]).filter(d =>
        d.keteranganTambahan && d.keteranganTambahan.trim()
      );
      renderIPALMonitorCards(latestRes.data || {}, keteranganItems);
      updateDebitTotalDisplay();
      renderIPALUnifiedChart(ipalChartData, _activeUnifiedZone, _activeUnifiedParam);
      _renderUnifiedParamBtns(_activeUnifiedZone, _activeUnifiedParam);
      _attachUnifiedParamListeners();
      await loadFlowBasisFromGAS(); refreshFlowHints();
      /* Refresh history jika teknisi */
      if(user.role === 'teknisi-ipal') loadOwnHistory(user);
    } else if(user.role === 'teknisi-ac' || user.role === 'supervisor-ac') {
      await loadACDashboard(currentACPeriod);
      if(user.role === 'teknisi-ac') loadOwnHistory(user);
    }
    showAutoFetchPulse(); /* flash indikator & restart countdown */
  } catch(e) { console.warn('[ImmediateRefresh]', e); }
}

let _countdownInterval = null;

function startCountdownTimer() {
  const totalMs = AUTO_FETCH_MS;
  let remaining = totalMs;
  const countEl = $('autofetch-countdown');
  const barEl   = $('autofetch-bar');
  const unitEl  = document.querySelector('.autofetch-timer-unit');
  const labelEl = document.querySelector('.autofetch-timer-label');
  const useMinutes = totalMs >= 60000;
  if(_countdownInterval) clearInterval(_countdownInterval);
  /* Reset */
  if(countEl) countEl.textContent = useMinutes ? Math.ceil(totalMs / 60000) : Math.ceil(totalMs / 1000);
  if(unitEl)  unitEl.textContent  = useMinutes ? 'mnt' : 'dtk';
  if(barEl)   { barEl.style.transition = 'none'; barEl.style.width = '100%'; }
  _countdownInterval = setInterval(() => {
    remaining -= 250;
    if(remaining < 0) remaining = 0;
    const pct = (remaining / totalMs) * 100;
    if(countEl) countEl.textContent = useMinutes ? Math.ceil(remaining / 60000) || 1 : Math.ceil(remaining / 1000);
    if(barEl)   { barEl.style.transition = 'width 0.25s linear'; barEl.style.width = pct + '%'; }
    if(remaining <= 0) clearInterval(_countdownInterval);
  }, 250);
}

function showAutoFetchPulse() {
  const timerEl = $('autofetch-indicator');
  if(!timerEl) return;
  /* Flash on fetch success */
  timerEl.classList.remove('autofetch-pulse');
  void timerEl.offsetWidth;
  timerEl.classList.add('autofetch-pulse');
  /* Restart countdown */
  startCountdownTimer();
}

/* ── TOPBAR REFRESH BUTTON — semua role ──────────────────────── */
/**
 * Tampilkan tombol Refresh di topbar dan pasang handler-nya.
 * Mendukung semua role: AC (supervisor-ac, teknisi-ac) maupun IPAL (supervisor-ipal, teknisi-ipal).
 * Timer 1m/10m/30m untuk IPAL tetap aktif — tombol ini bersifat manual refresh tambahan.
 * Setiap klik akan:
 *  1. Spin ikon refresh selama fetch berlangsung
 *  2. Memanggil semua fungsi load yang relevan dengan section yang sedang aktif
 */
function _setupTopbarRefreshBtn(user) {
  const btn = $('topbar-refresh-btn');
  if (!btn) return;
  btn.style.display = '';

  btn.addEventListener('click', async () => {
    if (btn.disabled) return;
    btn.disabled = true;
    const icon = $('topbar-refresh-icon');
    if (icon) icon.classList.add('spinning');
    try {
      const isIPAL = user.role === 'teknisi-ipal' || user.role === 'supervisor-ipal';
      if (isIPAL) {
        await _refreshCurrentSectionIPAL(user);
        showAutoFetchPulse(); /* reset countdown visual setelah manual refresh */
      } else {
        await _refreshCurrentSectionAC(user);
      }
    } finally {
      btn.disabled = false;
      if (icon) icon.classList.remove('spinning');
    }
  });
}

/**
 * Refresh semua data pada section yang sedang aktif untuk role AC.
 * Dipanggil oleh tombol Refresh di topbar.
 */
async function _refreshCurrentSectionAC(user) {
  const onDashboard  = $('section-dashboard')?.classList.contains('active-section');
  const onHistory    = $('section-history')?.classList.contains('active-section');
  const onPreventive = $('section-preventive')?.classList.contains('active-section');
  const onInput      = $('section-input')?.classList.contains('active-section');

  if (user.role === 'supervisor-ac') {
    if (onDashboard) {
      await Promise.all([
        loadACDashboard(currentACPeriod),
        loadACPMMonthStat(),
      ]);
    }
    if (onHistory) {
      await Promise.all([
        loadSupervisorHistory(user),
        loadPMHistory(user),
      ]);
    }
    if (onPreventive) {
      renderPMList();
    }
    /* section-input tidak perlu refresh data (form kosong) */
  } else if (user.role === 'teknisi-ac') {
    if (onDashboard) {
      await Promise.all([
        loadOwnHistory(user),
        loadACPMStats(),
        (async () => { renderTeknisiPMCard(); })(),
        loadPMHistory(user),
      ]);
    }
    /* section-input tidak perlu refresh data (form kosong) */
  }
}

/**
 * Refresh semua data pada section yang sedang aktif untuk role IPAL.
 * Dipanggil oleh tombol Refresh di topbar.
 */
async function _refreshCurrentSectionIPAL(user) {
  const onDashboard = $('section-dashboard')?.classList.contains('active-section');
  const onHistory   = $('section-history')?.classList.contains('active-section');
  const onInput     = $('section-input')?.classList.contains('active-section');

  if (user.role === 'supervisor-ipal') {
    if (onDashboard) {
      checkAndApplyDailyFlowReset();
      const [latestRes, chartRes, historyRes] = await Promise.all([
        gasFetch({action:'getIPALLatest'}),
        gasFetch({action:'getIPALChart', date:getTodayDate()}),
        gasFetch({action:'getIPALHistory'}),
      ]);
      ipalChartData = chartRes.data || {};
      window._ipalHistoryData = historyRes.data || [];
      const keteranganItems = (historyRes.data || []).filter(d =>
        d.keteranganTambahan && d.keteranganTambahan.trim()
      );
      renderIPALMonitorCards(latestRes.data || {}, keteranganItems);
      updateDebitTotalDisplay();
      renderIPALUnifiedChart(ipalChartData, _activeUnifiedZone, _activeUnifiedParam);
      _renderUnifiedParamBtns(_activeUnifiedZone, _activeUnifiedParam);
      _attachUnifiedParamListeners();
      await loadFlowBasisFromGAS(); refreshFlowHints();
    }
    if (onHistory) {
      await loadSupervisorHistory(user);
    }
    if (onInput) {
      await loadFlowBasisFromGAS(); refreshFlowHints();
    }
  } else if (user.role === 'teknisi-ipal') {
    if (onDashboard) {
      await loadOwnHistory(user);
      await loadFlowBasisFromGAS(); refreshFlowHints();
    }
    if (onInput) {
      await loadFlowBasisFromGAS(); refreshFlowHints();
    }
  }
}

function destroyAppShell() {
  if(clockInterval){ clearInterval(clockInterval); clockInterval=null; }
  if(autoFetchInterval){ clearInterval(autoFetchInterval); autoFetchInterval=null; }
  if(_countdownInterval){ clearInterval(_countdownInterval); _countdownInterval=null; }
  stopPMPolling();
  AUTO_FETCH_MS = 15000; /* reset ke default saat logout */
  Object.values(chartInstances).forEach(c=>{try{c.destroy();}catch(e){}});
  chartInstances={};
  _teknisiHistoryCache=[];
  _teknisiHistoryFilter='all';
  _teknisiHistoryControlsBound=false;
  _attnDismissed=false;
  _attnFilterMode='today';
  const root=$('app-root'); if(root) root.innerHTML='';
  const lp=$('page-login');
  if(lp){ lp.style.display=''; lp.classList.add('active'); }
  [$('nik'),$('password')].forEach(el=>{if(el)el.value='';});
  if($('login-error')) $('login-error').textContent='';
}

/* ── Load real Drive folder URLs from GAS and apply to each card by ID ── */
async function loadDriveFolderUrls(user) {
  const fallbackUrl = 'https://drive.google.com/drive/my-drive';

  /* Mapping: card element ID → folder param yang dikirim ke GAS */
  const cardMap = user.role.includes('ipal')
    ? [ { id: 'drive-folder-link-ipal', param: 'ipal' } ]
    : [
        { id: 'drive-folder-link-ac', param: 'ac' },
        { id: 'drive-folder-link-pm', param: 'pm' },
      ];

  /* Set fallback dulu */
  cardMap.forEach(({ id }) => { const el = $(id); if (el) el.href = fallbackUrl; });

  if (IS_DEMO) return;

  /* Fetch masing-masing folder URL secara paralel */
  await Promise.all(cardMap.map(async ({ id, param }) => {
    const el = $(id); if (!el) return;
    try {
      const res = await gasFetch({ action: 'getDriveFolderUrl', folder: param });
      if (res.status === 'ok' && res.url) el.href = res.url;
    } catch(e) { /* biarkan fallback */ }
  }));
}

/* ════════════════════════════════════════════════════════════════
   ATTACH LISTENERS
════════════════════════════════════════════════════════════════ */
function attachListeners(user) {
  const isSupervisor = user.role.includes('supervisor');

  const sectionLabels = {
    dashboard: user.role === 'teknisi-ac'
      ? ['Preventive Maintenance','Jadwal dan monitoring PM AC']
      : ['Dashboard','Selamat datang kembali'],
    input:[
      user.role === 'teknisi-ac' ? 'Breakdown Maintenance' : 'Input Data',
      user.role.includes('ipal') ? 'Form Monitoring IPAL' : 'Form Maintenance AC'
    ],
    history:['History','Data realtime dari spreadsheet'],
    setparam:['Set Parameter Awal','Atur nilai flowmeter awal sebagai basis debit'],
    preventive:['Preventive Maintenance','Jadwal PM untuk teknisi AC'],
    'pm-history':['History PM','Laporan Preventive Maintenance yang sudah selesai'],
  };

  qsa('.nav-item[data-section]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const sec=btn.dataset.section;
      showSection(sec);
      updateTopbar(...(sectionLabels[sec]||['Dashboard','']));
      closeSidebar();
    });
  });

  $('menu-toggle')?.addEventListener('click',()=>{
    const sidebar = $('sidebar');
    const overlay = $('sidebar-overlay');
    const isOpening = !sidebar?.classList.contains('open');
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('visible');
    if(isOpening) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
      document.body.style.top = '';
    }
  });
  $('sidebar-close')?.addEventListener('click',closeSidebar);
  $('sidebar-overlay')?.addEventListener('click',closeSidebar);
  $('theme-toggle')?.addEventListener('click',()=>setTheme(html.getAttribute('data-theme')==='dark'?'light':'dark'));
  $('logout-btn')?.addEventListener('click',()=>{ if(!confirm('Yakin ingin keluar?')) return; currentUser=null; destroyAppShell(); });
  $('notif-close')?.addEventListener('click',hideNotif);

  /* Teknisi IPAL */
  if(user.role==='teknisi-ipal') {
    initUpload('ipal-foto-svi','ipal-svi-preview','ipal-svi-img','ipal-svi-remove','ipal-svi-area');
    attachIPALForm(user);
    attachFlowDebitAutoCalc();
    attachSetParam();
    loadOwnHistory(user);
    setAutoTimestamps();
    startAutoFetch(user);
    loadFlowBasisFromGAS().then(refreshFlowHints);
    /* Topbar refresh button — teknisi IPAL */
    _setupTopbarRefreshBtn(user);
  }
  if(user.role==='teknisi-ac') {
    initSearchableDropdown('ac-unit-dropdown','ac-unit-search','ac-unit-list','ac-unit-clear','ac-unit-chevron','ac-unit-value',AC_UNITS);
    initSearchableDropdown('ac-gangguan-dropdown','ac-gangguan-search','ac-gangguan-list','ac-gangguan-clear','ac-gangguan-chevron','ac-gangguan-value',JENIS_GANGGUAN_AC);
    initSearchableDropdown('ac-penyebab-dropdown','ac-penyebab-search','ac-penyebab-list','ac-penyebab-clear','ac-penyebab-chevron','ac-penyebab-value',PENYEBAB_KERUSAKAN_AC);
    initSearchableDropdown('ac-tindakan-dropdown','ac-tindakan-search','ac-tindakan-list','ac-tindakan-clear','ac-tindakan-chevron','ac-tindakan-value',TINDAKAN_PERBAIKAN_AC);
    initUpload('ac-foto-rusak','ac-rusak-preview','ac-rusak-img','ac-rusak-remove','ac-rusak-area');
    initUpload('ac-foto-fix','ac-fix-preview','ac-fix-img','ac-fix-remove','ac-fix-area');
    attachACForm(user);
    renderTeknisiPMCard();
    loadOwnHistory(user);
    loadACPMStats();
    setAutoTimestamps();
    /* Topbar refresh button — teknisi AC */
    _setupTopbarRefreshBtn(user);
    /* PM History refresh */
    document.addEventListener('click', e => {
      if(e.target.closest('#pm-history-refresh-btn')) loadPMHistory(user);
    });
  }
  /* Supervisor IPAL */
  if(user.role==='supervisor-ipal') {
    loadIPALDashboard();
    startAutoFetch(user);
    initUpload('ipal-foto-svi','ipal-svi-preview','ipal-svi-img','ipal-svi-remove','ipal-svi-area');
    attachIPALForm(user);
    attachFlowDebitAutoCalc();
    attachSetParam();
    setAutoTimestamps();
    loadFlowBasisFromGAS().then(refreshFlowHints);
    /* Topbar refresh button — supervisor IPAL */
    _setupTopbarRefreshBtn(user);
    /* history section */
    $('refresh-history-btn') && document.addEventListener('click', e=>{
      if(e.target.closest('#refresh-history-btn')) loadSupervisorHistory(user);
    });
  }
  /* Supervisor AC */
  if(user.role==='supervisor-ac') {
    attachACDashFilters();
    attachACUnitLookup();
    initSearchableDropdown('ac-unit-dropdown','ac-unit-search','ac-unit-list','ac-unit-clear','ac-unit-chevron','ac-unit-value',AC_UNITS);
    initSearchableDropdown('ac-gangguan-dropdown','ac-gangguan-search','ac-gangguan-list','ac-gangguan-clear','ac-gangguan-chevron','ac-gangguan-value',JENIS_GANGGUAN_AC);
    initSearchableDropdown('ac-penyebab-dropdown','ac-penyebab-search','ac-penyebab-list','ac-penyebab-clear','ac-penyebab-chevron','ac-penyebab-value',PENYEBAB_KERUSAKAN_AC);
    initSearchableDropdown('ac-tindakan-dropdown','ac-tindakan-search','ac-tindakan-list','ac-tindakan-clear','ac-tindakan-chevron','ac-tindakan-value',TINDAKAN_PERBAIKAN_AC);
    initUpload('ac-foto-rusak','ac-rusak-preview','ac-rusak-img','ac-rusak-remove','ac-rusak-area');
    initUpload('ac-foto-fix','ac-fix-preview','ac-fix-img','ac-fix-remove','ac-fix-area');
    attachACForm(user);
    attachPreventiveForm(user);
    loadACDashboard('monthly');
    loadACPMMonthStat();
    setAutoTimestamps();
    /* Topbar refresh button — supervisor AC */
    _setupTopbarRefreshBtn(user);
    document.addEventListener('click', e=>{
      if(e.target.closest('#refresh-history-btn')) loadSupervisorHistory(user);
      if(e.target.closest('#pm-history-refresh-btn')) loadPMHistory(user);
    });
  }
  /* Badge auto-refresh di topbar — hanya untuk role IPAL */
  const isIPALRole = user.role === 'teknisi-ipal' || user.role === 'supervisor-ipal';
  const afBadgeAll = document.getElementById('autofetch-indicator');
  if(afBadgeAll && isIPALRole){ afBadgeAll.style.display=''; startCountdownTimer(); }

  /* Interval pill buttons — hanya untuk IPAL */
  const intervalWrap = $('autofetch-interval-wrap');
  if(intervalWrap && isIPALRole) intervalWrap.style.display = '';
  const pillsWrap = $('autofetch-pills');
  if(pillsWrap && isIPALRole) {
    /* Set active pill to match current AUTO_FETCH_MS */
    pillsWrap.querySelectorAll('.autofetch-pill').forEach(btn => {
      btn.classList.toggle('autofetch-pill-active', parseInt(btn.dataset.ms,10) === AUTO_FETCH_MS);
    });
    pillsWrap.addEventListener('click', e => {
      const pill = e.target.closest('.autofetch-pill');
      if(!pill) return;
      AUTO_FETCH_MS = parseInt(pill.dataset.ms, 10);
      pillsWrap.querySelectorAll('.autofetch-pill').forEach(b => b.classList.remove('autofetch-pill-active'));
      pill.classList.add('autofetch-pill-active');
      startAutoFetch(user);
      if(_countdownInterval) clearInterval(_countdownInterval);
      startCountdownTimer();
    });
  }
}

function _showSectionCore(sec) {
  qsa('.form-section').forEach(s=>s.classList.remove('active-section'));
  $(`section-${sec}`)?.classList.add('active-section');
  qsa('.nav-item[data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section===sec));
}
function updateTopbar(title,sub='') {
  const t=$('topbar-title'),s=$('topbar-sub');
  if(t)t.textContent=title; if(s)s.textContent=sub;
}
function closeSidebar() {
  $('sidebar')?.classList.remove('open');
  $('sidebar-overlay')?.classList.remove('visible');
  document.body.classList.remove('sidebar-open');
  /* Restore scroll position yang mungkin terkunci */
  document.body.style.top = '';
}

/* ════════════════════════════════════════════════════════════════
   SEARCHABLE DROPDOWN
════════════════════════════════════════════════════════════════ */
function initSearchableDropdown(wrapperId,searchId,listId,clearId,chevronId,hiddenId,options,opts={}) {
  const searchEl=$(searchId),listEl=$(listId),clearEl=$(clearId),chevEl=$(chevronId);
  const hiddenEl=hiddenId?$(hiddenId):null;
  if(!searchEl||!listEl)return;
  let sel='',isOpen=false;

  // Move list to body so it's never clipped by parent overflow
  if(listEl.parentElement && listEl.parentElement !== document.body) {
    document.body.appendChild(listEl);
  }

  function positionList(){
    const rect=searchEl.closest('.searchable-input-wrapper')?.getBoundingClientRect()||searchEl.getBoundingClientRect();
    const spaceBelow=window.innerHeight-rect.bottom;
    const spaceAbove=rect.top;
    const maxH=Math.min(280, spaceBelow>200?spaceBelow-8:spaceAbove-8);
    listEl.style.position='fixed';
    listEl.style.width=rect.width+'px';
    listEl.style.left=rect.left+'px';
    listEl.style.maxHeight=maxH+'px';
    if(spaceBelow>200||spaceBelow>=spaceAbove){
      listEl.style.top=(rect.bottom+4)+'px';
      listEl.style.bottom='';
    } else {
      listEl.style.bottom=(window.innerHeight-rect.top+4)+'px';
      listEl.style.top='';
    }
  }

  function renderList(q=''){
    const lq=q.toLowerCase();
    const fil=options.filter(o=>o.toLowerCase().includes(lq));
    let h='';
    if(opts.allowEmpty) h+=`<div class="searchable-option${!sel?' selected':''}" data-value="">${escHtml(opts.emptyLabel||'Semua')}</div>`;
    if(!fil.length){ h+=`<div class="searchable-option no-result">Tidak ditemukan</div>`; }
    else {
      fil.slice(0,200).forEach(o=>{
        const num=o.match(/^AC (\d+)/)?.[1]||'';
        const rest=num?o.replace(/^AC \d+ /,''):o;
        h+=`<div class="searchable-option${sel===o?' selected':''}" data-value="${escHtml(o)}">${num?`<span class="opt-num">AC ${escHtml(num)}</span>`:''}${escHtml(rest)}</div>`;
      });
    }
    listEl.innerHTML=h;
  }
  function openList(){ renderList(searchEl.value); positionList(); listEl.classList.add('open'); chevEl?.classList.add('open'); isOpen=true; }
  function closeList(){ listEl.classList.remove('open'); chevEl?.classList.remove('open'); isOpen=false; }
  function selectVal(val){
    sel=val; searchEl.value=val;
    if(hiddenEl)hiddenEl.value=val;
    clearEl&&clearEl.classList.toggle('visible',!!val);
    closeList();
  }

  searchEl.addEventListener('focus',openList);
  searchEl.addEventListener('input',()=>{ renderList(searchEl.value); if(!isOpen)openList(); else positionList(); });
  clearEl?.addEventListener('click',e=>{ e.stopPropagation(); selectVal(''); searchEl.focus(); });
  listEl.addEventListener('mousedown',e=>{
    const opt=e.target.closest('.searchable-option');
    if(!opt||opt.classList.contains('no-result'))return;
    e.preventDefault(); selectVal(opt.dataset.value);
  });
  document.addEventListener('click',e=>{
    if(!isOpen)return;
    const wrapper=$(wrapperId);
    if(wrapper&&wrapper.contains(e.target))return;
    if(listEl.contains(e.target))return;
    closeList();
  });
  window.addEventListener('scroll',()=>{ if(isOpen)positionList(); },true);
  window.addEventListener('resize',()=>{ if(isOpen)positionList(); });
}

/* ── Upload Preview ──────────────────────────────────────────── */
function initUpload(inputId,previewId,imgId,removeId,areaId) {
  const input=$(inputId),preview=$(previewId),img=$(imgId),remove=$(removeId),area=$(areaId);
  if(!input)return;
  const ph=area?.querySelector('.upload-placeholder');
  /* Sembunyikan input dari DOM flow — trigger manual via click area.
     Mencegah browser membuka dialog 2x akibat event bubbling ganda
     antara native file input overlay dan area click listener.        */
  input.style.display = 'none';
  /* Guard: cegah double-trigger dalam 500ms */
  let _dialogOpen = false;
  area?.addEventListener('click',e=>{
    if(e.target.closest('.upload-remove') || e.target.closest('.upload-preview')) return;
    if(_dialogOpen) return;
    _dialogOpen = true;
    input.click();
    setTimeout(()=>{ _dialogOpen = false; }, 500);
  });
  input.addEventListener('change',()=>{
    const f=input.files[0]; if(!f)return;
    img.src=URL.createObjectURL(f);
    if(ph)ph.style.display='none'; preview.style.display='flex';
  });
  remove?.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    input.value=''; img.src=''; preview.style.display='none';
    if(ph)ph.style.display='flex';
  });
  area?.addEventListener('dragover',e=>{e.preventDefault();area.style.borderColor='var(--accent)';});
  area?.addEventListener('dragleave',()=>area.style.borderColor='');
  area?.addEventListener('drop',e=>{
    e.preventDefault(); area.style.borderColor='';
    const f=e.dataTransfer.files[0];
    if(f&&f.type.startsWith('image/')){input.files=e.dataTransfer.files;input.dispatchEvent(new Event('change'));}
  });
}

function setAutoTimestamps() {
  const today=getTodayDate(),time=getCurrentTime(),ts=getNowTimestamp();
  [['ac-tanggal',today],['ac-waktu',time],['ac-timestamp',ts],
   ['ipal-tanggal',today],['ipal-waktu',time],['ipal-timestamp',ts]].forEach(([id,val])=>{
    const el=$(id); if(!el)return; if(!el.value||el.readOnly) el.value=val;
  });
}

/* ── Validation ──────────────────────────────────────────────── */
function vField(el,eid,msg){ if(!el||!el.value.trim()){showErr(eid,msg);el?.classList.add('has-error');return false;} clrErr(eid);el.classList.remove('has-error');return true; }
function vSelect(el,eid,msg){ if(!el||!el.value){showErr(eid,msg);el?.classList.add('has-error');return false;} clrErr(eid);el.classList.remove('has-error');return true; }
function vFile(el,eid,msg){ if(!el||!el.files||!el.files[0]){showErr(eid,msg);return false;} clrErr(eid);return true; }
function vRadio(name,eid,msg){ if(!document.querySelector(`input[name="${name}"]:checked`)){showErr(eid,msg);return false;} clrErr(eid);return true; }
function showErr(id,msg){ const e=$(id); if(e)e.textContent=msg; }
function clrErr(id){ const e=$(id); if(e)e.textContent=''; }
function scrollToErr(){ document.querySelector('.has-error,.field-error:not(:empty)')?.scrollIntoView({behavior:'smooth',block:'center'}); }
function clearFormErrors(fid){ const f=$(fid); if(!f)return; f.querySelectorAll('.field-error').forEach(e=>e.textContent=''); f.querySelectorAll('.has-error').forEach(e=>e.classList.remove('has-error')); }
function resetUpload(areaId,previewId){ const pr=$(previewId),ph=document.querySelector(`#${areaId} .upload-placeholder`); if(pr)pr.style.display='none'; if(ph)ph.style.display='flex'; }

/* ════════════════════════════════════════════════════════════════
   FLOWMETER AUTO-CALC DEBIT
   Hitung debit otomatis saat teknisi mengetik nilai flowmeter
════════════════════════════════════════════════════════════════ */
function attachFlowDebitAutoCalc() {
  const map = [
    { flowId:'ipal-inlet-flow',  debitId:'ipal-inlet-debit',  zone:'inlet',   hintId:'hint-inlet-basis' },
    { flowId:'ipal-outlet-flow', debitId:'ipal-outlet-debit', zone:'outlet',  hintId:'hint-outlet-basis' },
    { flowId:'ipal-ras-flow',    debitId:'ipal-ras-debit',    zone:'ras',     hintId:'hint-ras-basis' },
    { flowId:'ipal-rec-flow',    debitId:'ipal-rec-debit',    zone:'recycle', hintId:'hint-recycle-basis' },
  ];
  map.forEach(({flowId, debitId, zone, hintId}) => {
    /* Tampilkan basis saat ini di hint */
    const basis = getFlowBasis(zone);
    const hintEl = $(hintId);
    if(hintEl) hintEl.textContent = basis ? basis.toFixed(2) : 'Belum diset';

    /* Auto-hitung debit saat input flowmeter berubah */
    $(flowId)?.addEventListener('input', () => {
      const flowNow = parseFloat($(flowId).value);
      const debitEl = $(debitId);
      if(!debitEl) return;
      if(!isNaN(flowNow) && getFlowBasis(zone)) {
        const debit = calcDebit(zone, flowNow);
        debitEl.value = debit.toFixed(2);
      } else {
        debitEl.value = '';
      }
    });
  });
}

/* Refresh hint basis di form setelah set parameter atau submit */
function refreshFlowHints() {
  const map = [
    { zone:'inlet',   hintId:'hint-inlet-basis' },
    { zone:'outlet',  hintId:'hint-outlet-basis' },
    { zone:'ras',     hintId:'hint-ras-basis' },
    { zone:'recycle', hintId:'hint-recycle-basis' },
  ];
  map.forEach(({zone, hintId}) => {
    const basis = getFlowBasis(zone);
    const hintEl = $(hintId);
    if(hintEl) hintEl.textContent = basis ? basis.toFixed(2) : 'Belum diset';
    /* Reset debit display jika ada */
    const debitId = `ipal-${zone==='recycle'?'rec':zone}-debit`;
    const debitEl = $(debitId);
    if(debitEl) debitEl.value = '';
  });
}

/* ════════════════════════════════════════════════════════════════
   SET PARAMETER AWAL — Simpan basis flowmeter ke localStorage
════════════════════════════════════════════════════════════════ */
function attachSetParam() {
  /* Tampilkan nilai basis saat ini di halaman set parameter */
  function refreshSetParamDisplay() {
    FLOW_ZONES_LIST.forEach(zone => {
      const basis = getFlowBasis(zone);
      const el = $(`sp-current-${zone}`);
      if(el) el.innerHTML = `Basis saat ini: <b>${basis ? basis.toFixed(2) + ' m³' : '—'}</b>`;
      const input = $(`sp-flow-${zone}`);
      if(input && !input.value) input.placeholder = basis ? basis.toFixed(2) : 'Contoh: 97231.15';
    });
  }
  refreshSetParamDisplay();

  /* Jalankan refresh saat section setparam dibuka */
  qsa('.nav-item[data-section="setparam"]').forEach(btn => {
    btn.addEventListener('click', refreshSetParamDisplay);
  });

  $('sp-save-btn')?.addEventListener('click', () => {
    let ok = true;
    FLOW_ZONES_LIST.forEach(zone => {
      const val = parseFloat($(`sp-flow-${zone}`)?.value);
      const errEl = $(`err-sp-${zone}`);
      if(isNaN(val) || val < 0) {
        if(errEl) errEl.textContent = 'Masukkan nilai flowmeter yang valid.';
        ok = false;
      } else {
        if(errEl) errEl.textContent = '';
      }
    });
    if(!ok) return;

    FLOW_ZONES_LIST.forEach(zone => {
      const val = parseFloat($(`sp-flow-${zone}`).value);
      setFlowBasisLocal(zone, val);
    });

    showNotif('success','Parameter Awal Disimpan!','Basis flowmeter berhasil diperbarui dan disinkronkan.');
    pushFlowBasisToGAS(currentUser?.nama || '').then(()=>{
      /* Reload dari GAS untuk konfirmasi, lalu refresh hint di kedua sisi */
      loadFlowBasisFromGAS().then(refreshFlowHints);
    });
    refreshSetParamDisplay();
    refreshFlowHints();

    /* Kosongkan input setelah simpan */
    FLOW_ZONES_LIST.forEach(zone => {
      const input = $(`sp-flow-${zone}`);
      if(input) input.value = '';
    });
  });
}

/* ════════════════════════════════════════════════════════════════
   AC FORM SUBMIT
════════════════════════════════════════════════════════════════ */
function attachACForm(user) {
  /* Force 24-hour display on waktu-rusak input (some browsers default to 12h on en-US locale) */
  (function force24h() {
    const el = $('ac-waktu-rusak');
    if (!el) return;
    /* Trick: set a known 24h value and read back — if browser converts to 12h the value won't match */
    el.setAttribute('data-force24', '1');
    /* Remove any am/pm from the value on input event */
    el.addEventListener('change', () => {
      const v = el.value; /* value is always HH:MM in 24h from the DOM even if displayed as 12h */
      if (v) el.setAttribute('data-time', v);
    });
  })();

  /* Init foto upload previews */
  initUpload('ac-foto-rusak','ac-rusak-preview','ac-rusak-img','ac-rusak-remove','ac-rusak-area');
  initUpload('ac-foto-fix','ac-fix-preview','ac-fix-img','ac-fix-remove','ac-fix-area');

  $('ac-reset-btn')?.addEventListener('click',()=>{
    if(!confirm('Reset semua data form?'))return;
    $('form-ac')?.reset(); setAutoTimestamps(); clearFormErrors('form-ac');
    resetUpload('ac-rusak-area','ac-rusak-preview');
    resetUpload('ac-fix-area','ac-fix-preview');
    ['ac-unit-search','ac-unit-value','ac-gangguan-search','ac-gangguan-value','ac-penyebab-search','ac-penyebab-value','ac-tindakan-search','ac-tindakan-value'].forEach(id=>{const el=$(id);if(el)el.value='';});
    ['ac-unit-clear','ac-gangguan-clear','ac-penyebab-clear','ac-tindakan-clear'].forEach(id=>$(id)?.classList.remove('visible'));
  });

  $('form-ac')?.addEventListener('submit',async e=>{
    e.preventDefault(); let ok=true;
    ok &= vField($('ac-tanggal'),'err-ac-tanggal','Tanggal wajib diisi.');
    ok &= vField($('ac-waktu'),'err-ac-waktu','Waktu wajib diisi.');
    const unitVal=$('ac-unit-value')?.value||'';
    if(!unitVal){showErr('err-ac-unit','Unit AC wajib dipilih.');ok=false;}else clrErr('err-ac-unit');
    const gangguanVal=$('ac-gangguan-value')?.value||'';
    if(!gangguanVal){showErr('err-ac-gangguan','Jenis gangguan wajib dipilih.');ok=false;}else clrErr('err-ac-gangguan');
    ok &= vField($('ac-waktu-rusak'),'err-ac-waktu-rusak','Waktu mulai kerusakan wajib diisi.');
    const penyebabVal=$('ac-penyebab-value')?.value||'';
    if(!penyebabVal){showErr('err-ac-penyebab','Penyebab kerusakan wajib dipilih.');ok=false;}else clrErr('err-ac-penyebab');
    ok &= vField($('ac-deskripsi-rusak'),'err-ac-deskripsi-rusak','Deskripsi kerusakan wajib diisi.');
    const tindakanVal=$('ac-tindakan-value')?.value||'';
    if(!tindakanVal){showErr('err-ac-tindakan','Tindakan perbaikan wajib dipilih.');ok=false;}else clrErr('err-ac-tindakan');
    ok &= vField($('ac-deskripsi-perbaikan'),'err-ac-deskripsi-perbaikan','Deskripsi perbaikan wajib diisi.');
    ok &= vRadio('ac-kambuh','err-ac-kambuh','Pilih apakah gangguan kembali terjadi.');
    if(!ok){scrollToErr();return;}

    const btn=$('ac-submit-btn');
    setButtonLoading(btn,true);
    try {
      const kambuh=document.querySelector('input[name="ac-kambuh"]:checked')?.value||'';
      const fotoRusakFile=$('ac-foto-rusak')?.files?.[0];
      const fotoFixFile=$('ac-foto-fix')?.files?.[0];
      const fotoRusakBase64 = fotoRusakFile ? await fileToBase64(fotoRusakFile) : '';
      const fotoFixBase64   = fotoFixFile   ? await fileToBase64(fotoFixFile)   : '';
      const namaFotoRusak = fotoRusakFile ? generateFotoName('AC Rusak', fotoRusakFile.name, $('ac-tanggal').value, unitVal) : '';
      const namaFotoFix   = fotoFixFile   ? generateFotoName('AC Fix',   fotoFixFile.name,   $('ac-tanggal').value, unitVal) : '';
      await gasPost({
        formType:'AC',
        namaTeknisi:user.nama, nikTeknisi:user.nik,
        tanggal:$('ac-tanggal').value, waktu:$('ac-waktu').value, timestamp:getNowTimestamp(),
        unitAC:unitVal,
        jenisGangguan:gangguanVal, waktuMulaiRusak:$('ac-waktu-rusak').value,
        penyebabKerusakan:penyebabVal,
        deskripsiRusak:$('ac-deskripsi-rusak').value,
        fotoRusakBase64, namaFotoRusak,
        tindakan:tindakanVal,
        deskripsiPerbaikan:$('ac-deskripsi-perbaikan').value,
        fotoFixBase64, namaFotoFix,
        gangguanKambuh:kambuh,
      });
      setButtonLoading(btn,false);
      const msg=kambuh==='Ya'?'⚠️ Laporan tersimpan. Gangguan kembali — eskalasi diperlukan.':'Laporan tersimpan.';
      showNotif(kambuh==='Ya'?'error':'success','Laporan Berhasil Dikirim!',msg);
      $('form-ac')?.reset(); setAutoTimestamps(); clearFormErrors('form-ac');
      resetUpload('ac-rusak-area','ac-rusak-preview');
      resetUpload('ac-fix-area','ac-fix-preview');
      ['ac-unit-search','ac-unit-value','ac-gangguan-search','ac-gangguan-value','ac-penyebab-search','ac-penyebab-value','ac-tindakan-search','ac-tindakan-value'].forEach(id=>{const el=$(id);if(el)el.value='';});
      ['ac-unit-clear','ac-gangguan-clear','ac-penyebab-clear','ac-tindakan-clear'].forEach(id=>$(id)?.classList.remove('visible'));
      if(user.role==='teknisi-ac'){
        showSection('dashboard'); updateTopbar('Preventive Maintenance','Jadwal dan monitoring PM AC');
        qsa('.nav-item[data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section==='dashboard'));
        loadOwnHistory(user);
      }
      /* Refresh dashboard segera tanpa menunggu interval autofetch */
      triggerImmediateRefresh(user);
    } catch(err) {
      setButtonLoading(btn,false);
      showNotif('error','Gagal Mengirim',err.message||'Periksa koneksi atau konfigurasi GAS.');
    }
  });
}

/* ════════════════════════════════════════════════════════════════
   IPAL FORM SUBMIT
════════════════════════════════════════════════════════════════ */
function attachIPALForm(user) {
  $('ipal-reset-btn')?.addEventListener('click',()=>{
    if(!confirm('Reset semua data form IPAL?'))return;
    $('form-ipal')?.reset(); setAutoTimestamps(); clearFormErrors('form-ipal');
    resetUpload('ipal-svi-area','ipal-svi-preview');
  });

  $('form-ipal')?.addEventListener('submit',async e=>{
    e.preventDefault(); let ok=true;
    ok &= vField($('ipal-tanggal'),'err-ipal-tanggal','Tanggal wajib diisi.');
    ok &= vField($('ipal-waktu'),'err-ipal-waktu','Waktu wajib diisi.');
    ok &= vField($('ipal-inlet-flow'),'err-ipal-inlet-flow','Nilai flowmeter inlet wajib diisi.');
    ok &= vField($('ipal-outlet-flow'),'err-ipal-outlet-flow','Nilai flowmeter outlet wajib diisi.');
    ok &= vField($('ipal-ras-flow'),'err-ipal-ras-flow','Nilai flowmeter RAS wajib diisi.');
    ok &= vField($('ipal-rec-flow'),'err-ipal-rec-flow','Nilai flowmeter recycle wajib diisi.');
    ok &= vField($('ipal-eq2-ph'),'err-ipal-eq2-ph','pH Ekualisasi 2 wajib diisi.');
    ok &= vField($('ipal-eq2-suhu'),'err-ipal-eq2-suhu','Suhu Ekualisasi 2 wajib diisi.');
    ok &= vField($('ipal-anrb-ph'),'err-ipal-anrb-ph','pH Anaerob wajib diisi.');
    ok &= vField($('ipal-anrb-suhu'),'err-ipal-anrb-suhu','Suhu Anaerob wajib diisi.');
    ok &= vField($('ipal-aer1-ph'),'err-ipal-aer1-ph','pH Aerasi 1 wajib diisi.');
    ok &= vField($('ipal-aer1-suhu'),'err-ipal-aer1-suhu','Suhu Aerasi 1 wajib diisi.');
    ok &= vField($('ipal-aer2-ph'),'err-ipal-aer2-ph','pH Aerasi 2 wajib diisi.');
    ok &= vField($('ipal-aer2-suhu'),'err-ipal-aer2-suhu','Suhu Aerasi 2 wajib diisi.');
    ok &= vField($('ipal-aer4-ph'),'err-ipal-aer4-ph','pH Aerasi 4 wajib diisi.');
    ok &= vField($('ipal-aer4-suhu'),'err-ipal-aer4-suhu','Suhu Aerasi 4 wajib diisi.');
    if(!ok){scrollToErr();return;}

    /* Ambil nilai flowmeter dan hitung debit */
    const flowMap = {
      inlet:   parseFloat($('ipal-inlet-flow').value),
      outlet:  parseFloat($('ipal-outlet-flow').value),
      ras:     parseFloat($('ipal-ras-flow').value),
      recycle: parseFloat($('ipal-rec-flow').value),
    };
    const debitMap = {};
    FLOW_ZONES_LIST.forEach(z => { debitMap[z] = calcDebit(z, flowMap[z]); });

    const btn=$('ipal-submit-btn');
    setButtonLoading(btn,true);
    try {
      const fotoSviFile = $('ipal-foto-svi')?.files?.[0];
      const fotoSviBase64 = fotoSviFile ? await fileToBase64(fotoSviFile) : '';
      const namaFotoSvi   = fotoSviFile ? generateFotoName('SVI30', fotoSviFile.name, $('ipal-tanggal').value, user.nama) : '';

      await gasPost({
        formType:'IPAL',
        namaTeknisi:user.nama, nikTeknisi:user.nik,
        tanggal:$('ipal-tanggal').value, waktu:$('ipal-waktu').value, timestamp:getNowTimestamp(),
        inletFlow:flowMap.inlet,   inletDebit:debitMap.inlet,
        outletFlow:flowMap.outlet, outletDebit:debitMap.outlet,
        rasFlow:flowMap.ras,       rasDebit:debitMap.ras,
        recFlow:flowMap.recycle,   recDebit:debitMap.recycle,
        eq2Ph:$('ipal-eq2-ph').value, eq2Suhu:$('ipal-eq2-suhu').value,
        anrbPh:$('ipal-anrb-ph').value, anrbSuhu:$('ipal-anrb-suhu').value,
        aer1Ph:$('ipal-aer1-ph').value, aer1Suhu:$('ipal-aer1-suhu').value, aer1Svi:$('ipal-aer1-svi').value,
        aer2Ph:$('ipal-aer2-ph').value, aer2Suhu:$('ipal-aer2-suhu').value, aer2Svi:$('ipal-aer2-svi').value,
        aer4Ph:$('ipal-aer4-ph').value, aer4Suhu:$('ipal-aer4-suhu').value, aer4Svi:$('ipal-aer4-svi').value,
        keteranganTambahan:$('ipal-keterangan')?.value||'',
        fotoSviBase64, namaFotoSvi,
      });
      /* Setelah submit sukses: flowmeter sekarang jadi basis berikutnya, sinkron ke GAS */
      FLOW_ZONES_LIST.forEach(z => advanceFlowBasis(z, flowMap[z]));
      await pushFlowBasisToGAS(user.nama);
      refreshFlowHints();
      setButtonLoading(btn,false);
      showNotif('success','Data Berhasil Dikirim!','Data monitoring IPAL tersimpan. Basis flowmeter diperbarui otomatis.');
      $('form-ipal')?.reset(); setAutoTimestamps(); clearFormErrors('form-ipal');
      resetUpload('ipal-svi-area','ipal-svi-preview');
      refreshFlowHints();
      if(user.role==='teknisi-ipal'){
        showSection('dashboard'); updateTopbar('Dashboard','Selamat datang kembali');
        qsa('.nav-item[data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section==='dashboard'));
        loadOwnHistory(user);
      }
      /* Refresh dashboard segera tanpa menunggu interval autofetch */
      triggerImmediateRefresh(user);
    } catch(err) {
      setButtonLoading(btn,false);
      showNotif('error','Gagal Mengirim',err.message||'Periksa koneksi atau konfigurasi GAS.');
    }
  });
}

/* ════════════════════════════════════════════════════════════════
   TEKNISI HISTORY
════════════════════════════════════════════════════════════════ */
/* Cache semua data history teknisi — supaya filter/search tidak perlu re-fetch */
let _teknisiHistoryCache = [];
let _teknisiHistoryFilter = 'all'; // 'all' | 'mine'

async function loadOwnHistory(user) {
  const wrap=$('teknisi-history'); if(!wrap)return;
  wrap.innerHTML=`<div class="history-loading"><div class="spinner spinner-dark"></div>&nbsp;Memuat data…</div>`;
  try {
    /* Ambil SEMUA data (sama seperti supervisor), bukan hanya milik sendiri */
    let action, params;
    if(user.role==='teknisi-ipal') {
      action='getIPALHistory'; params={action};
    } else {
      /* Gunakan 'all' agar semua data (termasuk lama yang sudah punya foto) ikut tampil.
         Supervisor history yang pakai period filter dikelola terpisah di loadSupervisorHistory. */
      action='getACHistory'; params={action, period: 'all'};
    }
    const res=await gasFetch(params);
    _teknisiHistoryCache=res.data||[];
    /* Yield to browser before heavy DOM render */
    await new Promise(r => requestAnimationFrame(r));
    _renderTeknisiHistory(user);
    _attachTeknisiHistoryControls(user);
  } catch(e) {
    wrap.innerHTML=`<div class="activity-empty"><p>Gagal memuat data</p><span>${e.message}</span></div>`;
  }
}

function _renderTeknisiHistory(user) {
  const wrap=$('teknisi-history'); if(!wrap)return;
  const searchVal=($('teknisi-hist-search')?.value||'').toLowerCase().trim();
  let data = _teknisiHistoryCache;

  /* Filter: Saya saja vs semua */
  if(_teknisiHistoryFilter==='mine') {
    data = data.filter(d => (d.nikTeknisi||d.nik||'') === user.nik || (d.namaTeknisi||'').toLowerCase()===user.nama.toLowerCase());
  }
  /* Filter: search */
  if(searchVal) {
    data = data.filter(d => JSON.stringify(d).toLowerCase().includes(searchVal));
  }

  let ok=0,attn=0;
  if(user.role==='teknisi-ipal') {
    data.forEach(d=>{
      const isAttn = d.status==='Perlu Perhatian' || !!(d.keteranganTambahan && d.keteranganTambahan.trim());
      isAttn?attn++:ok++;
    });
    if($('tstat-total'))$('tstat-total').textContent=_teknisiHistoryCache.length;
    if($('tstat-ok'))$('tstat-ok').textContent=ok;
    if($('tstat-attn'))$('tstat-attn').textContent=attn;
    const badge=$('teknisi-history-badge'); if(badge) badge.textContent=`${data.length} data`;
    if(!data.length){ wrap.innerHTML=emptyState('Belum ada data','Data akan muncul setelah submit form'); return; }
    const cols=['Waktu','Teknisi','NIK','Debit Inlet (m³)','Debit Outlet (m³)','pH Ekualisasi 2','Suhu Ekualisasi 2 (°C)','pH Anaerob','Suhu Anaerob (°C)','pH Aerasi 1','Suhu Aerasi 1 (°C)','SVI30 Aerasi 1 (mL/g)','pH Aerasi 2','Suhu Aerasi 2 (°C)','SVI30 Aerasi 2 (mL/g)','pH Aerasi 4','Suhu Aerasi 4 (°C)','SVI30 Aerasi 4 (mL/g)','Keterangan Tambahan','Status','Foto SVI30'];
    const rowBuilder = d => {
      const isAttn = d.status==='Perlu Perhatian' || !!(d.keteranganTambahan && d.keteranganTambahan.trim());
      const isMine = (d.nikTeknisi||d.nik||'')=== user.nik || (d.namaTeknisi||'').toLowerCase()===user.nama.toLowerCase();
      const st = isAttn ? '<span class="history-badge badge-attention">Perhatian</span>' : '<span class="history-badge badge-normal">Normal</span>';
      const rowStyle = isMine ? 'background:var(--accent-light,rgba(59,130,246,0.06))' : '';
      /* Konversi URL ke drive.usercontent.google.com agar bisa dibuka di tab baru */
      function toUcUrl(url) {
        if (!url) return '';
        const m = String(url).match(/[?&]id=([^&]+)/);
        if (m) return `https://drive.usercontent.google.com/download?id=${m[1]}&export=view&authuser=0`;
        return url;
      }
      const fotoSviUrl = toUcUrl(d.fotoSviUrl);
      const fotoSvi = fotoSviUrl
        ? `<button class="foto-link-btn" data-foto-url="${escHtml(fotoSviUrl)}" data-foto-caption="📷 Foto SVI30 — ${escHtml(d.namaTeknisi||'')}">📷 Lihat</button>`
        : '—';
      return `<tr style="${rowStyle}">
        <td style="white-space:nowrap">${escHtml(d.timestamp||'')}</td>
        <td>${escHtml(d.namaTeknisi||'—')}</td>
        <td>${escHtml(d.nikTeknisi||'—')}</td>
        <td>${escHtml(String(d.inletDebit||'—'))}</td>
        <td>${escHtml(String(d.outletDebit||'—'))}</td>
        <td>${escHtml(String(d.eq2Ph||'—'))}</td>
        <td>${escHtml(String(d.eq2Suhu||'—'))}</td>
        <td>${escHtml(String(d.anarobPh||'—'))}</td>
        <td>${escHtml(String(d.anarobSuhu||'—'))}</td>
        <td>${escHtml(String(d.aerasi1Ph||'—'))}</td>
        <td>${escHtml(String(d.aerasi1Suhu||'—'))}</td>
        <td>${escHtml(String(d.aerasi1Svi30||'—'))}</td>
        <td>${escHtml(String(d.aerasi2Ph||'—'))}</td>
        <td>${escHtml(String(d.aerasi2Suhu||'—'))}</td>
        <td>${escHtml(String(d.aerasi2Svi30||'—'))}</td>
        <td>${escHtml(String(d.aerasi4Ph||'—'))}</td>
        <td>${escHtml(String(d.aerasi4Suhu||'—'))}</td>
        <td>${escHtml(String(d.aerasi4Svi30||'—'))}</td>
        <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(d.keteranganTambahan||'')}">${escHtml(d.keteranganTambahan||'—')}</td>
        <td>${st}</td>
        <td>${fotoSvi}</td>
      </tr>`;
    };
    wrap.innerHTML=buildGroupedTableWithPDF('Riwayat Monitoring IPAL', cols, data, rowBuilder, ['Foto SVI30']);
  } else {
    data.forEach(d=>{ d.kambuh==='Ya'?attn++:ok++; });
    if($('tstat-total'))$('tstat-total').textContent=_teknisiHistoryCache.length;
    if($('tstat-ok'))$('tstat-ok').textContent=ok;
    if($('tstat-attn'))$('tstat-attn').textContent=attn;
    const badge=$('teknisi-history-badge'); if(badge) badge.textContent=`${data.length} data`;
    if(!data.length){ wrap.innerHTML=emptyState('Belum ada data','Data akan muncul setelah submit form'); return; }
    const cols=['Waktu','Teknisi','NIK','Unit AC','Jenis Gangguan','Waktu Mulai Kerusakan','Penyebab Kerusakan','Deskripsi Kerusakan','Tindakan Perbaikan','Deskripsi Perbaikan','Status','Foto Rusak','Foto Fix'];
    const rowBuilder = d => {
      const isMine = (d.nikTeknisi||d.nik||'')=== user.nik || (d.namaTeknisi||'').toLowerCase()===user.nama.toLowerCase();
      const st=d.kambuh==='Ya'?'<span class="history-badge badge-attention">Kambuh</span>':'<span class="history-badge badge-normal">Berhasil</span>';
      const rowStyle = isMine ? 'background:var(--accent-light,rgba(59,130,246,0.06))' : '';
      const fotoRusak = d.fotoRusakUrl
        ? `<button class="foto-link-btn" data-foto-url="${escHtml(d.fotoRusakUrl)}" data-foto-caption="Foto Rusak — ${escHtml(d.unitAC||'')}">📷 Lihat</button>` : '—';
      const fotoFix = d.fotoFixUrl
        ? `<button class="foto-link-btn" data-foto-url="${escHtml(d.fotoFixUrl)}" data-foto-caption="Foto Fix — ${escHtml(d.unitAC||'')}">✅ Lihat</button>` : '—';
      return `<tr style="${rowStyle}">
        <td style="white-space:nowrap">${escHtml(d.timestamp||'')}</td>
        <td>${escHtml(d.namaTeknisi||'—')}</td>
        <td>${escHtml(d.nikTeknisi||'—')}</td>
        <td style="min-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px" title="${escHtml(d.unitAC||'')}">${escHtml(d.unitAC||'')}</td>
        <td>${escHtml(d.jenisGangguan||'')}</td>
        <td>${escHtml(formatWaktuRusak(d.waktuMulaiRusak)||'—')}</td>
        <td>${escHtml(d.penyebabKerusakan||'—')}</td>
        <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(d.deskripsiRusak||'')}">${escHtml(d.deskripsiRusak||'—')}</td>
        <td>${escHtml(d.tindakan||'')}</td>
        <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(d.deskripsiPerbaikan||'')}">${escHtml(d.deskripsiPerbaikan||'—')}</td>
        <td>${st}</td>
        <td>${fotoRusak}</td>
        <td>${fotoFix}</td>
      </tr>`;
    };
    wrap.innerHTML=buildGroupedTableWithPDF('Riwayat Maintenance AC', cols, data, rowBuilder, ['Foto Rusak','Foto Fix']);
  }
}

let _teknisiHistoryControlsBound = false;
function _attachTeknisiHistoryControls(user) {
  if(_teknisiHistoryControlsBound) return;
  _teknisiHistoryControlsBound = true;

  /* Tab filter: Semua / Saya */
  document.addEventListener('click', e=>{
    const tab=e.target.closest('.teknisi-hist-tab');
    if(!tab) return;
    qsa('.teknisi-hist-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    _teknisiHistoryFilter = tab.dataset.thist||'all';
    _renderTeknisiHistory(user);
  });

  /* Search input */
  document.addEventListener('input', e=>{
    if(e.target.id==='teknisi-hist-search') _renderTeknisiHistory(user);
  });

  /* Refresh button */
  document.addEventListener('click', e=>{
    if(e.target.closest('#teknisi-refresh-history-btn')) {
      _teknisiHistoryControlsBound = false; // reset so controls re-bind after reload
      loadOwnHistory(user);
    }
  });
}

/* ════════════════════════════════════════════════════════════════
   SUPERVISOR IPAL DASHBOARD
════════════════════════════════════════════════════════════════ */
async function loadIPALDashboard() {
  checkAndApplyDailyFlowReset();
  try {
    const [latestRes,chartRes,historyRes]=await Promise.all([
      gasFetch({action:'getIPALLatest'}),
      gasFetch({action:'getIPALChart',date:getTodayDate()}),
      gasFetch({action:'getIPALHistory'}),
    ]);
    ipalChartData=chartRes.data||{};

    /* Ambil entri hari ini yang ada keterangan tambahan */
    window._ipalHistoryData = historyRes.data||[];
    const keteranganItems=(historyRes.data||[]).filter(d=>
      d.keteranganTambahan && d.keteranganTambahan.trim()
    );

    renderIPALMonitorCards(latestRes.data||{}, keteranganItems);
    updateDebitTotalDisplay();

    /* Inisialisasi unified chart */
    _activeUnifiedParam = _renderUnifiedParamBtns(_activeUnifiedZone, _activeUnifiedParam) || 'debit';
    renderIPALUnifiedChart(ipalChartData, _activeUnifiedZone, _activeUnifiedParam);

    /* Unified chart zone select */
    $('unified-chart-zone-select')?.addEventListener('change', e=>{
      _activeUnifiedZone = e.target.value;
      _activeUnifiedParam = _renderUnifiedParamBtns(_activeUnifiedZone, _activeUnifiedParam) || 'debit';
      renderIPALUnifiedChart(ipalChartData, _activeUnifiedZone, _activeUnifiedParam);
      /* Re-attach param button listeners after re-render */
      _attachUnifiedParamListeners();
    });
    _attachUnifiedParamListeners();

  } catch(e){ console.error('IPAL Dashboard error:',e); }
}

function _attachUnifiedParamListeners() {
  const wrap = $('unified-chart-params'); if(!wrap) return;
  wrap.querySelectorAll('[data-unified-param]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      wrap.querySelectorAll('[data-unified-param]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      _activeUnifiedParam = btn.dataset.unifiedParam;
      renderIPALUnifiedChart(ipalChartData, _activeUnifiedZone, _activeUnifiedParam);
    });
  });
}

/* Show/hide SVI30 button based on selected zone */
function updateIPALChartParamBtns(zoneId) {
  const zoneConf = IPAL_CHART_ZONES[zoneId];
  const sviBtn = document.querySelector('.svi-btn');
  if(sviBtn) {
    const hasSVI = zoneConf?.params.includes('svi30');
    sviBtn.style.display = hasSVI ? '' : 'none';
    if(!hasSVI && activeChartParam==='svi30'){
      activeChartParam='ph';
      qsa('[data-chart-param]').forEach(b=>b.classList.toggle('active',b.dataset.chartParam==='ph'));
    }
  }
}

function renderIPALMonitorCards(tanks, keteranganItems=[]) {
  let ok=0,attn=0,attnItems=[];
  const flowZones=IPAL_ZONES.filter(z=>z.type==='flow');
  const gaugeZones=IPAL_GAUGE_ZONES_ORDERED.map(id=>IPAL_ZONES.find(z=>z.id===id)).filter(Boolean);

  flowZones.forEach(z=>{
    const d=tanks[z.id]||{};
    /* Jika data dari hari yang berbeda, tampilkan — untuk Debit & stats (bukan flowmeter) */
    const todayStr2 = getTodayDate();
    let dataIsToday = true;
    if(d.ts) {
      /* ts bisa "HH:MM" atau "DD Mmm, HH:MM" — cek apakah ada tanggal yg berbeda */
      const mDate = d.ts.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if(mDate) {
        const tsDate = `${mDate[3]}-${mDate[2].padStart(2,'0')}-${mDate[1].padStart(2,'0')}`;
        dataIsToday = (tsDate === todayStr2);
      }
      /* Jika ts hanya jam (HH:MM atau HH:MM:SS), anggap hari ini */
    }
    let warn=false;
    if(z.id==='inlet' && d.debit!=null && isZoneWarn('inlet','debit',d.debit)){ warn=true; attnItems.push({bak:z.name,param:'Debit Inlet',val:`${d.debit.toFixed(1)} m³`,thresh:`≤130 hijau, 130–149 kuning, ≥150 merah`,ts:d.ts||''}); }
    warn?attn++:ok++;
    const fc=$(`flow-${z.id}`); if(fc) fc.classList.toggle('flow-warning',warn);
    const dot=$(`fdot-${z.id}`); if(dot) dot.className=`flow-status-dot ${warn?'dot-warn':'dot-ok'}`;
    if($(`fflow-${z.id}`)) $(`fflow-${z.id}`).textContent=d.flowmeter!=null?d.flowmeter.toFixed(1):'—';
    /* Debit & stats hanya tampilkan jika data hari ini; jika kemarin → reset ke — */
    if($(`fdebit-${z.id}`)) $(`fdebit-${z.id}`).textContent=(dataIsToday && d.debit!=null)?d.debit.toFixed(1):'—';
    if($(`fmax-${z.id}`)) $(`fmax-${z.id}`).textContent=(dataIsToday && d.maxDebit!=null)?d.maxDebit.toFixed(1):'—';
    if($(`fmin-${z.id}`)) $(`fmin-${z.id}`).textContent=(dataIsToday && d.minDebit!=null)?d.minDebit.toFixed(1):'—';
    if($(`favg-${z.id}`)) $(`favg-${z.id}`).textContent=(dataIsToday && d.avgDebit!=null)?d.avgDebit.toFixed(1):'—';
    if($(`fts-${z.id}`)) $(`fts-${z.id}`).innerHTML=`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>&nbsp;${escHtml(d.ts||'—')}`;
    /* Debit Total harian — dihitung dari sum semua entry hari ini via ipalChartData */
    const elTotal = $(`fdebit-total-${z.id}`);
    if(elTotal) elTotal.textContent = calcDebitTotalFromChartData(z.id).toFixed(2);
  });

  gaugeZones.forEach(z=>{
    const d=tanks[z.id]||{};
    let warn=false;

    /* Per-zone warn detection using ZONE_THRESHOLDS */
    if(d.ph != null   && isZoneWarn(z.id,'ph',d.ph))   { warn=true; attnItems.push({bak:z.name,param:'pH',val:`${parseFloat(d.ph).toFixed(2)}`,thresh:z.id==='anaerob'?'merah <4, kuning 4–4.2, hijau >4.2–5.8, kuning 5.9–6, merah >6':'merah <7, kuning 7.0–7.1, hijau ≥7.2',ts:d.ts||''}); }
    if(d.suhu != null && isZoneWarn(z.id,'suhu',d.suhu)){ warn=true; attnItems.push({bak:z.name,param:'Suhu',val:`${parseFloat(d.suhu).toFixed(1)}°C`,thresh:'> 38°C',ts:d.ts||''}); }
    if(z.hasSVI && d.svi30!=null && isZoneWarn(z.id,'svi30',d.svi30)){ warn=true; attnItems.push({bak:z.name,param:'SVI30',val:`${parseFloat(d.svi30).toFixed(1)} mL/g`,thresh:'≥ 48 mL/g',ts:d.ts||''}); }

    warn?attn++:ok++;
    const gc=$(`gauge-${z.id}`); if(gc) gc.classList.toggle('gauge-warning',warn);
    const dot=$(`gdot-${z.id}`); if(dot) dot.className=`flow-status-dot ${warn?'dot-warn':'dot-ok'}`;
    if($(`gts-${z.id}`)) $(`gts-${z.id}`).innerHTML=`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>&nbsp;${escHtml(d.ts||'—')}`;
    const gr=$(`gauges-${z.id}`); if(!gr)return;

    /* Build gauge HTML with per-zone colors */
    const phColor   = getZoneColor(z.id,'ph',d.ph);
    const suhuColor = getZoneColor(z.id,'suhu',d.suhu);
    let gHTML=`<div class="gauge-wrap">${buildGaugeSVG('pH',d.ph,14,0,'#3B82F6','#F59E0B','',null,phColor)}<div class="gauge-label">pH</div><div class="gauge-stats-row"><div class="gauge-stat-item"><div class="gauge-stat-label">Max</div><div class="gauge-stat-val">${d.maxPh!=null?d.maxPh.toFixed(1):'—'}</div></div><div class="gauge-stat-item"><div class="gauge-stat-label">Min</div><div class="gauge-stat-val">${d.minPh!=null?d.minPh.toFixed(1):'—'}</div></div><div class="gauge-stat-item"><div class="gauge-stat-label">Avg</div><div class="gauge-stat-val">${d.avgPh!=null?d.avgPh.toFixed(1):'—'}</div></div></div></div>`;
    gHTML+=`<div class="gauge-wrap">${buildGaugeSVG('Suhu',d.suhu,IPAL_THRESHOLDS.suhu.max,IPAL_THRESHOLDS.suhu.warn,'#8B5CF6','#F97316','',null,suhuColor)}<div class="gauge-label">Suhu (°C)</div><div class="gauge-stats-row"><div class="gauge-stat-item"><div class="gauge-stat-label">Max</div><div class="gauge-stat-val">${d.maxSuhu!=null?d.maxSuhu.toFixed(1):'—'}</div></div><div class="gauge-stat-item"><div class="gauge-stat-label">Min</div><div class="gauge-stat-val">${d.minSuhu!=null?d.minSuhu.toFixed(1):'—'}</div></div><div class="gauge-stat-item"><div class="gauge-stat-label">Avg</div><div class="gauge-stat-val">${d.avgSuhu!=null?d.avgSuhu.toFixed(1):'—'}</div></div></div></div>`;
    if(z.hasSVI) {
      const sviColor = getZoneColor(z.id,'svi30',d.svi30);
      gHTML+=`<div class="gauge-wrap">${buildGaugeSVG('SVI30',d.svi30,100,50,'#EC4899','#EF4444','',null,sviColor)}<div class="gauge-label">SVI30</div><div class="gauge-stats-row"><div class="gauge-stat-item"><div class="gauge-stat-label">Max</div><div class="gauge-stat-val">${d.maxSVI!=null?d.maxSVI.toFixed(1):'—'}</div></div><div class="gauge-stat-item"><div class="gauge-stat-label">Min</div><div class="gauge-stat-val">${d.minSVI!=null?d.minSVI.toFixed(1):'—'}</div></div><div class="gauge-stat-item"><div class="gauge-stat-label">Avg</div><div class="gauge-stat-val">${d.avgSVI!=null?d.avgSVI.toFixed(1):'—'}</div></div></div></div>`;
    }
    gr.innerHTML=gHTML;
  });

  /* ── Perlu Perhatian: scan SEMUA history untuk threshold violations ── */
  /* Tambahkan keterangan teknisi dari semua history */
  const allHistory = window._ipalHistoryData || [];

  /* Scan semua entri history untuk threshold violations */
  const histAttnItems = [];
  allHistory.forEach(d => {
    const ts = d.timestamp || d.tanggal || '';
    /* Flow: Debit Inlet */
    if(d.inletDebit != null && isZoneWarn('inlet','debit',parseFloat(d.inletDebit)))
      histAttnItems.push({bak:'Inlet', param:'Debit Inlet', val:`${parseFloat(d.inletDebit).toFixed(1)} m³`, thresh:'≤130 hijau, 130–149 kuning, ≥150 merah', ts});
    /* Gauge zones */
    const zoneFields = [
      { name:'Ekualisasi 2', zoneId:'ekual2',  ph:'eq2Ph',     suhu:'eq2Suhu',     svi:null,           isAnaerob:false },
      { name:'Anaerob',      zoneId:'anaerob', ph:'anarobPh',  suhu:'anarobSuhu',  svi:null,           isAnaerob:true  },
      { name:'Aerasi 1',     zoneId:'aerasi1', ph:'aerasi1Ph', suhu:'aerasi1Suhu', svi:'aerasi1Svi30', isAnaerob:false },
      { name:'Aerasi 2',     zoneId:'aerasi2', ph:'aerasi2Ph', suhu:'aerasi2Suhu', svi:'aerasi2Svi30', isAnaerob:false },
      { name:'Aerasi 4',     zoneId:'aerasi4', ph:'aerasi4Ph', suhu:'aerasi4Suhu', svi:'aerasi4Svi30', isAnaerob:false },
    ];
    zoneFields.forEach(z => {
      const ph   = d[z.ph]   != null ? parseFloat(d[z.ph])   : null;
      const suhu = d[z.suhu] != null ? parseFloat(d[z.suhu]) : null;
      const svi  = z.svi && d[z.svi] != null ? parseFloat(d[z.svi]) : null;
      if(ph != null && isZoneWarn(z.zoneId,'ph',ph))
        histAttnItems.push({bak:z.name, param:'pH', val:`${ph.toFixed(2)}`, thresh: z.zoneId==='anaerob'?'merah <4, kuning 4–4.2, hijau >4.2–5.8, kuning 5.9–6, merah >6':'merah <7, kuning 7.0–7.1, hijau ≥7.2', ts});
      if(suhu != null && isZoneWarn(z.zoneId,'suhu',suhu))
        histAttnItems.push({bak:z.name, param:'Suhu', val:`${suhu.toFixed(1)}°C`, thresh:'(hijau ≤38, kuning 38–40, merah >40)', ts});
      if(svi != null && isZoneWarn(z.zoneId,'svi30',svi))
        histAttnItems.push({bak:z.name, param:'SVI30', val:`${svi.toFixed(1)} mL/g`, thresh:'(hijau <48, kuning 48–50, merah >50)', ts});
    });
    /* Keterangan tambahan */
    if(d.keteranganTambahan && d.keteranganTambahan.trim())
      histAttnItems.push({
        bak: `Keterangan Teknisi — ${d.namaTeknisi||'?'}`,
        param: 'Catatan', thresh: '',
        val: d.keteranganTambahan.trim(),
        ts, isKeterangan: true,
      });
  });

  /* Gabungkan: prioritaskan scan history; juga tambah dari data terbaru (tanks) jika belum ada */
  const combinedAttn = histAttnItems.length > 0 ? histAttnItems : attnItems;
  const totalAttnToday = combinedAttn.filter(_isAttnToday).length;

  /* Data MS = zona yang OK, Data TMS = zona yang attn */
  if($('sup-stat-ok'))   $('sup-stat-ok').textContent = ok;      /* MS card */
  if($('sup-stat-today')) $('sup-stat-today').textContent = attn; /* TMS card */
  if($('sup-stat-attn')) $('sup-stat-attn').textContent = totalAttnToday;

  /* Count entries submitted today from history data — untuk card "Data Hari Ini" */
  const todayStr = getTodayDate(); // "YYYY-MM-DD"
  const nowDate  = new Date();
  const todayDay = nowDate.getDate();
  const todayMon = nowDate.getMonth(); // 0-based

  /* Indonesian month short names — untuk parse demoTs format "17 Mei, 10:30" */
  const ID_MONTHS = ['jan','feb','mar','apr','mei','jun','jul','agu','sep','okt','nov','des'];

  const todayEntries = allHistory.filter(d => {
    /* 1. Field tanggal "YYYY-MM-DD" — dari form input ipal-tanggal */
    if(d.tanggal) {
      const s = String(d.tanggal).trim();
      if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return s === todayStr;
      /* Sheets kadang convert ke "DD/MM/YYYY" */
      const m2 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if(m2) return `${m2[3]}-${m2[2].padStart(2,'0')}-${m2[1].padStart(2,'0')}` === todayStr;
    }

    const ts = String(d.timestamp || '').trim();
    if(!ts) return false;

    /* 2. getNowTimestamp format: "DD-MM-YYYY, HH.MM.SS" atau "DD-MM-YYYY HH.MM.SS" */
    const mFull = ts.match(/^(\d{2})-(\d{2})-(\d{4})/);
    if(mFull) return `${mFull[3]}-${mFull[2]}-${mFull[1]}` === todayStr;

    /* 3. Format "DD/MM/YYYY" atau "DD-MM-YYYY" di dalam timestamp panjang */
    const mDate = ts.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if(mDate) return `${mDate[3]}-${mDate[2].padStart(2,'0')}-${mDate[1].padStart(2,'0')}` === todayStr;

    /* 4. Demo format: "17 Mei, 10:30" — demoTs() selalu hari ini, cocokkan hari+bulan */
    const mID = ts.match(/^(\d{1,2})\s+([a-zA-Z]+)[,\s]/);
    if(mID) {
      const day    = parseInt(mID[1], 10);
      const monIdx = ID_MONTHS.indexOf(mID[2].toLowerCase().substring(0, 3));
      return (day === todayDay && monIdx === todayMon);
    }

    return false;
  }).length;
  if($('sup-stat-entries')) $('sup-stat-entries').textContent = todayEntries;

  /* ── Render Perlu Perhatian card ── */
  /* Store combined data globally so filter toggle can re-render without re-fetch */
  window._attnAllItems = combinedAttn;
  window._attnTodayStr = getTodayDate();

  _renderAttnBody(combinedAttn, _attnFilterMode || 'today');

  /* Attach filter toggle once */
  const attnToggle = $('attn-filter-toggle');
  if(attnToggle && !attnToggle._bound) {
    attnToggle._bound = true;
    attnToggle.addEventListener('click', e => {
      const btn = e.target.closest('.attn-filter-btn');
      if(!btn) return;
      attnToggle.querySelectorAll('.attn-filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      _attnFilterMode = btn.dataset.attnFilter;
      _renderAttnBody(window._attnAllItems || [], _attnFilterMode);
    });
  }

  /* Tombol hapus di header — attach sekali, cek keberadaan */
  const attnHeader = $('ipal-attn-card')?.querySelector('.ipal-attn-header');
  if(attnHeader && !attnHeader.querySelector('.ipal-attn-clear-btn')) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'ipal-attn-clear-btn';
    clearBtn.title = 'Bersihkan semua notifikasi';
    clearBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
    clearBtn.addEventListener('click', () => {
      _attnDismissed = true;
      const attnCount = $('ipal-attn-count');
      if(attnCount) attnCount.textContent = 0;
      const attnBody = $('ipal-attn-body');
      if(attnBody) attnBody.innerHTML = `<div class="attention-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg><p>Semua Parameter Normal</p><span>Notifikasi telah dibersihkan</span></div>`;
      if($('sup-stat-attn')) $('sup-stat-attn').textContent = 0;
    });
    attnHeader.appendChild(clearBtn);
  }
}

function buildGaugeSVG(label, value, max, warnAt, colorNormal, colorWarn, unit='', warnMin=null, forceColor=null) {
  const val = value!=null ? Math.min(Math.max(parseFloat(value)||0,0),max) : 0;
  const pct = val/max;

  /* Arc geometry — generous half-donut, 260° sweep */
  const R=56, cx=76, cy=86;
  const startAngle = -220;
  const sweepAngle = 260;
  const toRad = a => a*Math.PI/180;
  const arcX = a => cx + R*Math.cos(toRad(a));
  const arcY = a => cy + R*Math.sin(toRad(a));

  /* ── Arc fill color: use forceColor (per-zone) if provided ── */
  let needleCol;
  if(forceColor) {
    needleCol = COLOR_HEX[forceColor] || '#22C55E';
  } else {
    const isWarnHigh = value!=null && warnAt > 0 && val > warnAt;
    const isWarnLow  = warnMin!=null && value!=null && val < warnMin;
    const isTMS      = isWarnHigh || isWarnLow;
    const warnFrac = warnAt > 0 ? (warnAt / max) : 0.9;
    const nearLow  = warnMin!=null ? warnMin + (max - (warnMin||0)) * 0.10 : null;
    const nearHighStart = warnFrac * 0.90;
    const isNearHigh = !isTMS && warnAt > 0 && pct > nearHighStart;
    const isNearLow  = !isTMS && nearLow!=null && val < nearLow;
    const isNear     = isNearHigh || isNearLow;
    needleCol = isTMS ? '#EF4444' : isNear ? '#F59E0B' : '#22C55E';
  }

  /* Unique IDs */
  const uid = `g${label.replace(/\W/g,'')}_${Math.floor(Math.random()*99999)}`;

  const fullEnd  = startAngle + sweepAngle;
  const arcSeg = (a, b) => {
    const large = (b - a) > 180 ? 1 : 0;
    return `M ${arcX(a)} ${arcY(a)} A ${R} ${R} 0 ${large} 1 ${arcX(b)} ${arcY(b)}`;
  };

  /* ── Filled value arc ──────────────────────────────────────── */
  const filledSweep = sweepAngle * pct;
  const largeArc    = filledSweep > 180 ? 1 : 0;
  const fgEnd       = startAngle + filledSweep;
  const fgD = (value!=null && pct>0.005)
    ? `M ${arcX(startAngle)} ${arcY(startAngle)} A ${R} ${R} 0 ${largeArc} 1 ${arcX(fgEnd)} ${arcY(fgEnd)}`
    : null;

  const dispVal = value!=null ? (Number.isInteger(val)?val.toFixed(0):val.toFixed(1)) : '—';
  const valCol = needleCol;
  const textY  = cy + 4;
  const unitY  = cy + 20;

  return `<svg viewBox="0 0 152 136" xmlns="http://www.w3.org/2000/svg" class="gauge-svg" style="overflow:visible;display:block;width:100%;height:auto;">
  <defs>
    <filter id="gw_${uid}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- ── Grey background track — full arc, rounded ends ── -->
  <path d="${arcSeg(startAngle, fullEnd)}"
    fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round"
    style="color: rgba(148,163,184,0.22)"/>

  <!-- ── Filled value arc — colored per zone threshold ── -->
  ${fgD ? `<path d="${fgD}" fill="none" stroke="${needleCol}" stroke-width="13"
    stroke-linecap="round" filter="url(#gw_${uid})" opacity="0.92"/>` : ''}

  <!-- ── Value (big, colored) ── -->
  <text x="${cx}" y="${textY}" text-anchor="middle" dominant-baseline="middle"
    font-family="Plus Jakarta Sans,DM Sans,sans-serif"
    font-size="28" font-weight="800" letter-spacing="-0.5"
    fill="${valCol}">${escHtml(dispVal)}</text>
  ${unit ? `<text x="${cx}" y="${unitY}" text-anchor="middle"
    font-family="Plus Jakarta Sans,DM Sans,sans-serif"
    font-size="10" font-weight="700"
    fill="${valCol}" opacity="0.75">${escHtml(unit)}</text>` : ''}
</svg>`;
}

/* ── UNIFIED IPAL CHART — menggabungkan chart aliran & parameter ── */
/* Format zoneKey: "flow:inlet" | "flow:outlet" | "gauge:ekual2" | dst */
let _activeUnifiedZone = 'combined:debit';
let _activeUnifiedParam = 'debit';

function _getUnifiedParamButtons(zoneKey) {
  const [type, zoneId] = zoneKey.split(':');
  if(type === 'combined') {
    return []; /* No param buttons for combined charts */
  }
  if(type === 'flow') {
    return [
      { key:'debit', label:'Debit' },
    ];
  } else {
    const hasSVI = IPAL_CHART_ZONES[zoneId]?.params.includes('svi30');
    const btns = [
      { key:'ph',   label:'pH' },
      { key:'suhu', label:'Suhu' },
    ];
    if(hasSVI) btns.push({ key:'svi30', label:'SVI30' });
    return btns;
  }
}

function _renderUnifiedParamBtns(zoneKey, activeParam) {
  const wrap = $('unified-chart-params'); if(!wrap) return;
  const btns = _getUnifiedParamButtons(zoneKey);
  /* Combined charts: no param buttons — param is encoded in zoneKey itself */
  if(!btns.length) {
    wrap.innerHTML = '';
    const [, zoneId] = zoneKey.split(':');
    return zoneId; /* e.g. 'debit', 'ph', 'suhu', 'svi30' */
  }
  /* Jika activeParam tidak tersedia di zona ini, reset ke default */
  const validKeys = btns.map(b=>b.key);
  if(!validKeys.includes(activeParam)) activeParam = btns[0].key;
  wrap.innerHTML = btns.map(b=>
    `<button class="chart-filter-btn${b.key===activeParam?' active':''}" data-unified-param="${b.key}">${b.label}</button>`
  ).join('');
  return activeParam;
}

function renderIPALUnifiedChart(data, zoneKey, param) {
  const canvas = $('ipal-unified-chart'); if(!canvas) return;
  if(chartInstances['ipal-unified']){ try{chartInstances['ipal-unified'].destroy();}catch(e){} }
  const [type, zoneId] = zoneKey.split(':');
  const labels = data.labels || [];

  let datasets = [], yLabel = '', threshLine = null;

  /* ── COMBINED CHARTS ── */
  if(type === 'combined') {
    const PALETTE = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'];
    if(zoneId === 'debit') {
      yLabel = 'Debit (m³/waktu)';
      const flowIds = ['inlet','outlet','ras','recycle'];
      const flowNames = {inlet:'Inlet',outlet:'Outlet',ras:'RAS',recycle:'Recycle'};
      flowIds.forEach((id,i) => {
        const vals = data.zones?.[id]?.debit || [];
        datasets.push({ label:flowNames[id], data:vals, borderColor:PALETTE[i], backgroundColor:`${PALETTE[i]}14`, borderWidth:2, pointRadius:2.5, pointBackgroundColor:PALETTE[i], pointHoverRadius:4, fill:false, tension:0.4 });
      });
    } else if(zoneId === 'ph') {
      yLabel = 'pH';
      const gaugeIds = ['ekual2','anaerob','aerasi1','aerasi2','aerasi4'];
      const gaugeNames = {ekual2:'Ekualisasi 2',anaerob:'Anaerob',aerasi1:'Aerasi 1',aerasi2:'Aerasi 2',aerasi4:'Aerasi 4'};
      gaugeIds.forEach((id,i) => {
        const vals = data.zones?.[id]?.ph || [];
        datasets.push({ label:gaugeNames[id], data:vals, borderColor:PALETTE[i], backgroundColor:`${PALETTE[i]}14`, borderWidth:2, pointRadius:2.5, pointBackgroundColor:PALETTE[i], pointHoverRadius:4, fill:false, tension:0.4 });
      });
    } else if(zoneId === 'suhu') {
      yLabel = 'Suhu (°C)';
      const gaugeIds = ['ekual2','anaerob','aerasi1','aerasi2','aerasi4'];
      const gaugeNames = {ekual2:'Ekualisasi 2',anaerob:'Anaerob',aerasi1:'Aerasi 1',aerasi2:'Aerasi 2',aerasi4:'Aerasi 4'};
      gaugeIds.forEach((id,i) => {
        const vals = data.zones?.[id]?.suhu || [];
        datasets.push({ label:gaugeNames[id], data:vals, borderColor:PALETTE[i], backgroundColor:`${PALETTE[i]}14`, borderWidth:2, pointRadius:2.5, pointBackgroundColor:PALETTE[i], pointHoverRadius:4, fill:false, tension:0.4 });
      });
    } else if(zoneId === 'svi30') {
      yLabel = 'SVI30 (mL/g)';
      const sviIds = ['aerasi1','aerasi2','aerasi4'];
      const sviNames = {aerasi1:'Aerasi 1',aerasi2:'Aerasi 2',aerasi4:'Aerasi 4'};
      sviIds.forEach((id,i) => {
        const vals = data.zones?.[id]?.svi30 || [];
        datasets.push({ label:sviNames[id], data:vals, borderColor:PALETTE[i], backgroundColor:`${PALETTE[i]}14`, borderWidth:2, pointRadius:2.5, pointBackgroundColor:PALETTE[i], pointHoverRadius:4, fill:false, tension:0.4 });
      });
    }
    chartInstances['ipal-unified'] = new Chart(canvas, {
      type:'line', data:{labels, datasets},
      options:{
        responsive:true, maintainAspectRatio:false,
        interaction:{mode:'index', intersect:false},
        plugins:{legend:{position:'top', labels:{boxWidth:10, font:{size:10}}}},
        scales:{
          x:{grid:{display:false}, ticks:{font:{size:10}}},
          y:{grid:{color:'rgba(148,163,184,0.09)'}, ticks:{font:{size:10}}, title:{display:true, text:yLabel, font:{size:10}}},
        }
      }
    });
    return;
  }

  /* ── SINGLE ZONE CHARTS ── */
  let values, color;

  if(type === 'flow') {
    const zoneData = data.zones?.[zoneId] || {};
    values = zoneData[param] || [];
    color = param === 'debitTotal' ? '#6366F1' : '#3B82F6';
    const zoneName = IPAL_FLOW_CHART_ZONES[zoneId]?.name || zoneId;
    yLabel = `${zoneName} — ${param==='debitTotal'?'Debit Total (m³)':'Debit (m³/waktu)'}`;
  } else {
    const zoneData = data.zones?.[zoneId] || {};
    values = zoneData[param] || [];
    const colorMap = {ph:'#3B82F6', suhu:'#0EA5E9', svi30:'#6366F1'};
    color = colorMap[param] || '#3B82F6';
    const unitMap = {ph:'', suhu:'°C', svi30:'mL/g'};
    const unit = unitMap[param] || '';
    const zoneName = IPAL_CHART_ZONES[zoneId]?.name || zoneId;
    yLabel = `${zoneName} — ${param.toUpperCase()}${unit?' ('+unit+')':''}`;
  }

  /* ── Build main dataset ── */
  datasets = [{
    label: yLabel,
    data: values,
    borderColor: color,
    backgroundColor: `${color}12`,
    borderWidth: 2, pointRadius: 3, pointBackgroundColor: color,
    pointHoverRadius: 5, fill: true, tension: 0.4,
  }];

  /* ── Threshold lines removed ── */

  chartInstances['ipal-unified'] = new Chart(canvas, {
    type:'line', data:{labels, datasets},
    options:{
      responsive:true, maintainAspectRatio:false,
      interaction:{mode:'index', intersect:false},
      plugins:{legend:{position:'top', labels:{boxWidth:10, font:{size:11}}}},
      scales:{
        x:{grid:{display:false}, ticks:{font:{size:10}}},
        y:{grid:{color:'rgba(148,163,184,0.09)'}, ticks:{font:{size:10}}, beginAtZero: type==='flow'},
      }
    }
  });
}

function renderIPALChart(data, zoneId, param) {
  /* Legacy: redirect to unified if canvas exists */
  renderIPALUnifiedChart(data, `gauge:${zoneId}`, param);
}

function renderIPALFlowChart(data, zoneId, param) {
  /* Legacy: redirect to unified if canvas exists */
  renderIPALUnifiedChart(data, `flow:${zoneId}`, param);
}


async function loadSupervisorHistory(user) {
  const wrap=$('sup-history-wrap'); if(!wrap)return;
  wrap.innerHTML=`<div class="history-loading"><div class="spinner spinner-dark"></div>&nbsp;Memuat data…</div>`;
  try {
    let action = user.role==='supervisor-ipal' ? 'getIPALHistory' : 'getACHistory';
    let params = {action};
    if(user.role==='supervisor-ac') params.period=currentACPeriod;
    const res=await gasFetch(params);
    const data=res.data||[];
    if(!data.length){ wrap.innerHTML=emptyState('Belum ada data history','Data dari spreadsheet akan muncul di sini'); return; }

    /* Yield before heavy DOM render so spinner stays visible */
    await new Promise(r => requestAnimationFrame(r));

    if(user.role==='supervisor-ipal'){
      const cols=['Waktu','Teknisi','NIK','Debit Inlet (m³)','Debit Outlet (m³)','pH Ekualisasi 2','Suhu Ekualisasi 2 (°C)','pH Anaerob','Suhu Anaerob (°C)','pH Aerasi 1','Suhu Aerasi 1 (°C)','SVI30 Aerasi 1 (mL/g)','pH Aerasi 2','Suhu Aerasi 2 (°C)','SVI30 Aerasi 2 (mL/g)','pH Aerasi 4','Suhu Aerasi 4 (°C)','SVI30 Aerasi 4 (mL/g)','Keterangan Tambahan','Status','Foto SVI30'];
      const rowBuilder = d => {
        const isAttn = d.status==='Perlu Perhatian' || !!(d.keteranganTambahan && d.keteranganTambahan.trim());
        const st = isAttn ? '<span class="history-badge badge-attention">Perhatian</span>' : '<span class="history-badge badge-normal">Normal</span>';
        function toUcUrl(url) {
          if (!url) return '';
          const m = String(url).match(/[?&]id=([^&]+)/);
          if (m) return `https://drive.usercontent.google.com/download?id=${m[1]}&export=view&authuser=0`;
          return url;
        }
        const fotoSviUrl = toUcUrl(d.fotoSviUrl);
        const fotoSvi = fotoSviUrl
          ? `<button class="foto-link-btn" data-foto-url="${escHtml(fotoSviUrl)}" data-foto-caption="📷 Foto SVI30 — ${escHtml(d.namaTeknisi||'')}">📷 Lihat</button>`
          : '—';
        return `<tr>
          <td style="white-space:nowrap">${escHtml(d.timestamp||'')}</td>
          <td>${escHtml(d.namaTeknisi||'')}</td>
          <td>${escHtml(d.nikTeknisi||'—')}</td>
          <td>${escHtml(String(d.inletDebit||'—'))}</td>
          <td>${escHtml(String(d.outletDebit||'—'))}</td>
          <td>${escHtml(String(d.eq2Ph||'—'))}</td>
          <td>${escHtml(String(d.eq2Suhu||'—'))}</td>
          <td>${escHtml(String(d.anarobPh||'—'))}</td>
          <td>${escHtml(String(d.anarobSuhu||'—'))}</td>
          <td>${escHtml(String(d.aerasi1Ph||'—'))}</td>
          <td>${escHtml(String(d.aerasi1Suhu||'—'))}</td>
          <td>${escHtml(String(d.aerasi1Svi30||'—'))}</td>
          <td>${escHtml(String(d.aerasi2Ph||'—'))}</td>
          <td>${escHtml(String(d.aerasi2Suhu||'—'))}</td>
          <td>${escHtml(String(d.aerasi2Svi30||'—'))}</td>
          <td>${escHtml(String(d.aerasi4Ph||'—'))}</td>
          <td>${escHtml(String(d.aerasi4Suhu||'—'))}</td>
          <td>${escHtml(String(d.aerasi4Svi30||'—'))}</td>
          <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(d.keteranganTambahan||'')}">${escHtml(d.keteranganTambahan||'—')}</td>
          <td>${st}</td>
          <td>${fotoSvi}</td>
        </tr>`;
      };
      wrap.innerHTML=buildGroupedTableWithPDF('History Monitoring IPAL', cols, data, rowBuilder, ['Foto SVI30']);
    } else {
      const cols=['Waktu','Teknisi','NIK','Unit AC','Jenis Gangguan','Waktu Mulai Kerusakan','Penyebab Kerusakan','Deskripsi Kerusakan','Tindakan Perbaikan','Deskripsi Perbaikan','Status','Foto Rusak','Foto Fix'];
      const rowBuilder = d => {
        const st=d.kambuh==='Ya'?'<span class="history-badge badge-attention">Kambuh</span>':'<span class="history-badge badge-normal">Berhasil</span>';
        const fotoRusak = d.fotoRusakUrl
          ? `<button class="foto-link-btn" data-foto-url="${escHtml(d.fotoRusakUrl)}" data-foto-caption="Foto Rusak — ${escHtml(d.unitAC||'')}">📷 Lihat</button>` : '—';
        const fotoFix = d.fotoFixUrl
          ? `<button class="foto-link-btn" data-foto-url="${escHtml(d.fotoFixUrl)}" data-foto-caption="Foto Fix — ${escHtml(d.unitAC||'')}">✅ Lihat</button>` : '—';
        return `<tr>
          <td style="white-space:nowrap">${escHtml(d.timestamp||'')}</td>
          <td>${escHtml(d.namaTeknisi||'')}</td>
          <td>${escHtml(d.nikTeknisi||'—')}</td>
          <td style="min-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px" title="${escHtml(d.unitAC||'')}">${escHtml(d.unitAC||'')}</td>
          <td>${escHtml(d.jenisGangguan||'')}</td>
          <td>${escHtml(formatWaktuRusak(d.waktuMulaiRusak)||'—')}</td>
          <td>${escHtml(d.penyebabKerusakan||'—')}</td>
          <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(d.deskripsiRusak||'')}">${escHtml(d.deskripsiRusak||'—')}</td>
          <td>${escHtml(d.tindakan||'')}</td>
          <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(d.deskripsiPerbaikan||'')}">${escHtml(d.deskripsiPerbaikan||'—')}</td>
          <td>${st}</td>
          <td>${fotoRusak}</td>
          <td>${fotoFix}</td>
        </tr>`;
      };
      wrap.innerHTML=buildGroupedTableWithPDF('History Maintenance AC', cols, data, rowBuilder, ['Foto Rusak','Foto Fix']);
    }
  } catch(e){ wrap.innerHTML=`<div class="activity-empty"><p>Gagal memuat history</p><span>${e.message}</span></div>`; }
}

/* Load when entering history section */
function initHistorySection(user) {
  if(!$('sup-history-wrap')) return;
  loadSupervisorHistory(user);
}

/* ════════════════════════════════════════════════════════════════
   AC UNIT HISTORY LOOKUP
════════════════════════════════════════════════════════════════ */

/* Download riwayat unit AC sebagai file PDF (print window) */
function downloadACUnitPDF(data, unitName) {
  const now = new Date().toLocaleString('id-ID', {
    day:'2-digit', month:'long', year:'numeric',
    hour:'2-digit', minute:'2-digit'
  });
  const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

  const bdData = data.filter(d => d._type === 'breakdown');
  const pmData = data.filter(d => d._type === 'pm');

  /* ── Tabel Breakdown ── */
  const bdHeader = ['No.','Waktu','Teknisi','Jenis Gangguan','Penyebab','Tindakan Perbaikan','Status'].map(c=>`<th>${c}</th>`).join('');
  const bdBody = bdData.map((d,i) => {
    const isKambuh = d.kambuh === 'Ya';
    const statusStyle = isKambuh ? 'color:#B45309;font-weight:700' : 'color:#065F46;font-weight:700';
    return `<tr>
      <td style="text-align:center;color:#94A3B8">${i+1}</td>
      <td style="white-space:nowrap">${(d.timestamp||'—').replace(/</g,'&lt;')}</td>
      <td>${(d.namaTeknisi||'—').replace(/</g,'&lt;')}</td>
      <td>${(d.jenisGangguan||'—').replace(/</g,'&lt;')}</td>
      <td>${(d.penyebabKerusakan||'—').replace(/</g,'&lt;')}</td>
      <td style="max-width:140px;word-break:break-word">${(d.tindakan||'—').replace(/</g,'&lt;')}</td>
      <td style="${statusStyle}">${isKambuh?'Kambuh':'Berhasil'}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:10px">Tidak ada riwayat breakdown</td></tr>`;

  /* ── Tabel PM ── */
  const pmHeader = ['No.','Tanggal PM','Waktu Input','Teknisi','Tindakan PM','Catatan / Temuan','Status Akhir'].map(c=>`<th>${c}</th>`).join('');
  const pmBody = pmData.map((d,i) => {
    let tanggalStr = d.tanggal || '—';
    if (d.tanggal && d.tanggal.length === 10) {
      const [y,m,dy] = d.tanggal.split('-').map(Number);
      const dateObj = new Date(y, m-1, dy);
      tanggalStr = `${days[dateObj.getDay()]}, ${dy} ${MONTHS_ID[m-1]} ${y}`;
    }
    const statusOk = (d.statusAkhir||'').toLowerCase().includes('normal') || (d.statusAkhir||'').toLowerCase().includes('baik');
    const statusStyle = d.statusAkhir ? (statusOk ? 'color:#065F46;font-weight:700' : 'color:#7C3AED;font-weight:700') : '';
    return `<tr>
      <td style="text-align:center;color:#94A3B8">${i+1}</td>
      <td style="white-space:nowrap">${tanggalStr.replace(/</g,'&lt;')}</td>
      <td style="white-space:nowrap">${(d.timestamp||'—').replace(/</g,'&lt;')}</td>
      <td>${(d.namaTeknisi||'—').replace(/</g,'&lt;')}</td>
      <td style="max-width:140px;word-break:break-word">${(d.tindakan||'—').replace(/</g,'&lt;')}</td>
      <td style="max-width:140px;word-break:break-word">${(d.catatan||'—').replace(/</g,'&lt;')}</td>
      <td style="${statusStyle}">${(d.statusAkhir||'—').replace(/</g,'&lt;')}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:10px">Tidak ada riwayat PM</td></tr>`;

  const totalKambuh   = bdData.filter(d => d.kambuh === 'Ya').length;
  const totalBerhasil = bdData.length - totalKambuh;

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>Riwayat ${unitName}</title>
<style>
  @page { size: A4 landscape; margin: 14mm 10mm 14mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1A2332; background: #fff; }
  .pdf-header { display:flex; justify-content:space-between; align-items:flex-end;
    border-bottom:2.5px solid #1D4ED8; padding-bottom:8px; margin-bottom:10px; }
  .pdf-brand { font-size:9pt; font-weight:700; color:#1E3A8A; margin-bottom:3px; }
  .pdf-title { font-size:13pt; font-weight:800; color:#1D4ED8; letter-spacing:-0.3px; }
  .pdf-unit  { font-size:8.5pt; font-weight:600; color:#334155; margin-top:2px; }
  .pdf-meta  { font-size:7.5pt; color:#64748B; text-align:right; line-height:1.7; }
  .pdf-summary { display:flex; gap:10px; margin-bottom:12px; }
  .pdf-summary-item { padding:5px 12px; border-radius:5px; font-size:7.5pt; font-weight:700; }
  .s-total { background:#EFF6FF; color:#1D4ED8; border:1px solid #BFDBFE; }
  .s-ok    { background:#ECFDF5; color:#065F46; border:1px solid #A7F3D0; }
  .s-attn  { background:#FFFBEB; color:#92400E; border:1px solid #FDE68A; }
  .s-pm    { background:#F5F3FF; color:#5B21B6; border:1px solid #DDD6FE; }
  .section-title { font-size:10pt; font-weight:800; color:#1D4ED8;
    margin: 14px 0 6px 0; padding-bottom:4px; border-bottom:1.5px solid #BFDBFE; }
  table { width:100%; border-collapse:collapse; font-size:7.5pt; }
  thead th { background:#1D4ED8; color:#fff; padding:5px 6px; text-align:left;
    font-weight:700; font-size:7pt; border:1px solid #1E40AF; white-space:nowrap; }
  .pm-thead th { background:#5B21B6; border-color:#4C1D95; }
  tbody td { padding:4px 6px; border:1px solid #E2E8F0; vertical-align:top; word-break:break-word; }
  tbody tr:nth-child(even) { background:#F8FAFF; }
  .pdf-footer { margin-top:12px; font-size:7pt; color:#94A3B8;
    display:flex; justify-content:space-between;
    border-top:1px solid #E2E8F0; padding-top:6px; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style>
</head>
<body>
  <div class="pdf-header">
    <div>
      <div class="pdf-brand">BuMi — Building Maintenance Monitoring Integration</div>
      <div class="pdf-title">Riwayat Maintenance AC</div>
      <div class="pdf-unit">${unitName.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
    </div>
    <div class="pdf-meta">
      <div>Dicetak: ${now}</div>
      <div>Total: ${data.length} riwayat (${bdData.length} Breakdown + ${pmData.length} PM)</div>
      <div>PT Bintang Toedjoe (A Kalbe Company)</div>
    </div>
  </div>
  <div class="pdf-summary">
    <span class="pdf-summary-item s-total">Total: ${data.length} riwayat</span>
    <span class="pdf-summary-item s-attn">Breakdown: ${bdData.length} (Kambuh: ${totalKambuh})</span>
    <span class="pdf-summary-item s-ok">Berhasil: ${totalBerhasil}</span>
    <span class="pdf-summary-item s-pm">PM: ${pmData.length}</span>
  </div>

  <div class="section-title">Riwayat Breakdown Maintenance</div>
  <table>
    <thead class="bd-thead"><tr>${bdHeader}</tr></thead>
    <tbody>${bdBody}</tbody>
  </table>

  <div class="section-title" style="color:#5B21B6;border-color:#DDD6FE">Riwayat Preventive Maintenance</div>
  <table>
    <thead class="pm-thead"><tr>${pmHeader}</tr></thead>
    <tbody>${pmBody}</tbody>
  </table>

  <div class="pdf-footer">
    <span>BuMi v4.1 © 2025 — PT Bintang Toedjoe (A Kalbe Company)</span>
    <span>Dokumen ini digenerate otomatis oleh sistem BuMi</span>
  </div>
  <script>window.onload=function(){window.print();}<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=1100,height=750');
  if (!win) {
    showNotif('error','Pop-up Diblokir','Izinkan pop-up untuk halaman ini agar dapat mengunduh PDF.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
function attachACUnitLookup() {
  /* Init searchable dropdown for lookup */
  initSearchableDropdown(
    'ac-unit-lookup-dropdown',
    'ac-unit-lookup-search',
    'ac-unit-lookup-list',
    'ac-unit-lookup-clear',
    'ac-unit-lookup-chevron',
    'ac-unit-lookup-value',
    AC_UNITS,
    { allowEmpty: false }
  );

  /* Search button */
  $('ac-unit-lookup-btn')?.addEventListener('click', async () => {
    const unit = $('ac-unit-lookup-value')?.value?.trim() || $('ac-unit-lookup-search')?.value?.trim();
    const resultEl = $('ac-unit-lookup-result');
    if(!resultEl) return;
    if(!unit) { resultEl.innerHTML = ''; return; }

    resultEl.innerHTML = `<div class="history-loading"><div class="spinner spinner-dark"></div>&nbsp;Mencari riwayat…</div>`;
    try {
      /* Fetch gabungan: breakdown + PM dari GAS */
      const res = await gasFetch({ action:'getACAndPMHistory', unit });
      const allData = (res.data||[]).filter(d =>
        (d.unitAC||'').toLowerCase() === unit.toLowerCase()
      );

      if(!allData.length){
        resultEl.innerHTML = `<div class="activity-empty" style="padding:10px 0"><p>Belum ada riwayat untuk unit ini</p><span>Coba unit AC lain atau periode berbeda</span></div>`;
        return;
      }

      const bdCount = allData.filter(d => d._type === 'breakdown').length;
      const pmCount = allData.filter(d => d._type === 'pm').length;

      /* Render card sesuai tipe */
      const cards = allData.map(d => {
        const isPM = d._type === 'pm';
        const tsIcon = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

        if (isPM) {
          /* ── Card: Preventive Maintenance ── */
          const statusOk = (d.statusAkhir||'').toLowerCase().includes('normal') || (d.statusAkhir||'').toLowerCase().includes('baik');
          const statusBadge = `<span class="history-badge badge-pm">Preventive Maintenance</span>`;
          const kondisiBadge = d.statusAkhir
            ? (statusOk
                ? `<span class="history-badge badge-normal">${escHtml(d.statusAkhir)}</span>`
                : `<span class="history-badge badge-attention">${escHtml(d.statusAkhir)}</span>`)
            : '';

          /* Tabel sebelum-sesudah untuk parameter teknis */
          const params = [
            ['Suhu (°C)',           d.suhu_before,       d.suhu_after],
            ['Tekanan Freon (psi)', d.tekanan_before,    d.tekanan_after],
            ['Arus Indoor (A)',     d.ampere_before,     d.ampere_after],
            ['Suhu Discharge (°C)', d.discharge_before,  d.discharge_after],
          ].filter(([, b, a]) => (b !== 0 && b !== '' && b != null) || (a !== 0 && a !== '' && a != null));

          const paramRows = params.map(([label, bVal, aVal]) => `
            <div class="ac-lookup-field ac-lookup-field-pm">
              <span class="ac-lookup-field-label">${label}</span>
              <span class="ac-lookup-field-val">
                <span class="pm-param-before">${escHtml(String(bVal??'—'))}</span>
                <span class="pm-param-arrow">→</span>
                <span class="pm-param-after">${escHtml(String(aVal??'—'))}</span>
              </span>
            </div>`).join('');

          return `
          <div class="ac-lookup-entry ac-lookup-entry-pm">
            <div class="ac-lookup-entry-header">
              <span class="ac-lookup-ts">${tsIcon}&nbsp;${escHtml(d.timestamp||'—')}</span>
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                ${statusBadge}
                ${kondisiBadge}
              </div>
            </div>
            <div class="ac-lookup-fields">
              <div class="ac-lookup-field"><span class="ac-lookup-field-label">Teknisi</span><span class="ac-lookup-field-val">${escHtml(d.namaTeknisi||'—')}</span></div>
              <div class="ac-lookup-field"><span class="ac-lookup-field-label">Tanggal PM</span><span class="ac-lookup-field-val">${escHtml(formatTanggalPM(d.tanggal, d.timestamp)||'—')}</span></div>
              ${paramRows}
              ${d.tindakan ? `<div class="ac-lookup-field"><span class="ac-lookup-field-label">Tindakan PM</span><span class="ac-lookup-field-val">${escHtml(d.tindakan)}</span></div>` : ''}
              ${d.catatan  ? `<div class="ac-lookup-field"><span class="ac-lookup-field-label">Catatan</span><span class="ac-lookup-field-val">${escHtml(d.catatan)}</span></div>` : ''}
            </div>
          </div>`;

        } else {
          /* ── Card: Breakdown Maintenance ── */
          const isKambuh = d.kambuh === 'Ya';
          const typeBadge  = `<span class="history-badge badge-breakdown">Breakdown</span>`;
          const statusBadge = isKambuh
            ? `<span class="history-badge badge-attention">Kambuh</span>`
            : `<span class="history-badge badge-normal">Berhasil</span>`;
          return `
          <div class="ac-lookup-entry ac-lookup-entry-breakdown">
            <div class="ac-lookup-entry-header">
              <span class="ac-lookup-ts">${tsIcon}&nbsp;${escHtml(d.timestamp||'—')}</span>
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                ${typeBadge}
                ${statusBadge}
              </div>
            </div>
            <div class="ac-lookup-fields">
              <div class="ac-lookup-field"><span class="ac-lookup-field-label">Teknisi</span><span class="ac-lookup-field-val">${escHtml(d.namaTeknisi||'—')}</span></div>
              <div class="ac-lookup-field"><span class="ac-lookup-field-label">Jenis Gangguan</span><span class="ac-lookup-field-val">${escHtml(d.jenisGangguan||'—')}</span></div>
              <div class="ac-lookup-field"><span class="ac-lookup-field-label">Waktu Mulai Kerusakan</span><span class="ac-lookup-field-val">${escHtml(formatWaktuRusak(d.waktuMulaiRusak)||'—')}</span></div>
              <div class="ac-lookup-field"><span class="ac-lookup-field-label">Penyebab Kerusakan</span><span class="ac-lookup-field-val">${escHtml(d.penyebabKerusakan||'—')}</span></div>
              <div class="ac-lookup-field"><span class="ac-lookup-field-label">Tindakan Perbaikan</span><span class="ac-lookup-field-val">${escHtml(d.tindakan||'—')}</span></div>
            </div>
          </div>`;
        }
      }).join('');

      resultEl.innerHTML = `
        <div class="ac-lookup-header">
          <div class="ac-lookup-header-left">
            <span class="ac-lookup-unit-name">${escHtml(unit)}</span>
            <span class="ac-lookup-count">${allData.length} riwayat &bull; <span style="color:var(--pm-badge-color,#7C3AED)">${pmCount} PM</span> &bull; <span style="color:var(--warn-color,#B45309)">${bdCount} Breakdown</span></span>
          </div>
          <button type="button" class="btn-lookup-download" id="ac-lookup-download-btn"
            title="Unduh riwayat sebagai PDF">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Unduh PDF
          </button>
        </div>
        <div class="ac-lookup-timeline">${cards}</div>`;

      const dlBtn = $('ac-lookup-download-btn');
      if(dlBtn) {
        dlBtn._lookupData = allData;
        dlBtn._lookupUnit = unit;
        dlBtn.addEventListener('click', () => downloadACUnitPDF(dlBtn._lookupData, dlBtn._lookupUnit));
      }
    } catch(e) {
      resultEl.innerHTML = `<div class="activity-empty" style="padding:10px 0"><p>Gagal memuat riwayat</p><span>${escHtml(e.message)}</span></div>`;
    }
  });

  /* Juga saat search input di-clear (input event) dengan value kosong */
  $('ac-unit-lookup-search')?.addEventListener('input', e=>{
    if(!e.target.value.trim()) {
      const hiddenEl = $('ac-unit-lookup-value');
      if(hiddenEl) hiddenEl.value = '';
    }
  });

  /* Also support Enter key in search input */
  $('ac-unit-lookup-search')?.addEventListener('keydown', e=>{
    if(e.key==='Enter') {
      e.preventDefault();
      const searchText = ($('ac-unit-lookup-search')?.value || '').trim();
      /* Jika search box kosong, kembali ke tampilan awal */
      if(!searchText) {
        /* Paksa clear hidden value juga */
        const hiddenEl = $('ac-unit-lookup-value');
        if(hiddenEl) hiddenEl.value = '';
        const resultEl = $('ac-unit-lookup-result');
        if(resultEl) resultEl.innerHTML = '';
        return;
      }
      $('ac-unit-lookup-btn')?.click();
    }
  });
}


/* Store top-N selection per container */
let _acTopN = { 'ac-top-units': 5, 'ac-top-types': 5, 'ac-top-penyebab': 5, 'ac-top-actions': 5 };

function attachACDashFilters() {
  /* Main analytics period */
  qsa('[data-period]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      qsa('[data-period]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentACPeriod=btn.dataset.period;
      loadACDashboard(currentACPeriod);
    });
  });

  /* Chart period toggle (separate) */
  qsa('[data-chart-period]').forEach(btn=>{
    btn.addEventListener('click',async ()=>{
      qsa('[data-chart-period]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      await renderACCompletionChart(btn.dataset.chartPeriod);
    });
  });

  /* Per-parameter chart period toggles */
  qsa('[data-acparam-period]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const target = btn.dataset.acparamTarget;
      /* Update active only within this toggle group */
      btn.closest('.period-toggle')?.querySelectorAll('[data-acparam-period]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      await renderACParamChart(target, btn.dataset.acparamPeriod);
    });
  });

  /* Top-N filter toggles — attach via event delegation */
  document.addEventListener('click', e=>{
    const btn = e.target.closest('.top-filter-btn');
    if(!btn) return;
    const group = btn.closest('[data-filter-group]');
    if(!group) return;
    const containerId = group.dataset.filterGroup;
    const n = parseInt(btn.dataset.top, 10);
    /* Update active state within this group */
    group.querySelectorAll('.top-filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    /* Store and re-render */
    _acTopN[containerId] = n;
    const stats = _acStatsCache[currentACPeriod] || {};
    const dataMap = {
      'ac-top-units':    stats.byUnit    || {},
      'ac-top-types':    stats.byType    || {},
      'ac-top-penyebab': stats.byPenyebab|| {},
      'ac-top-actions':  stats.byAction  || {},
    };
    if(dataMap[containerId] !== undefined) {
      renderACTopList(containerId, dataMap[containerId], n);
    }
  });
}

let _acStatsCache = {};

async function loadACDashboard(period) {
  try {
    const res=await gasFetch({action:'getACStats',period});
    const stats=res.data||{};
    _acStatsCache[period]=stats;

    /* Populate stat cards */
    const periodLabels = { daily:'Hari Ini', weekly:'Minggu Ini', monthly:'Bulan Ini', yearly:'Tahun Ini' };
    if($('ac-stat-total'))       $('ac-stat-total').textContent       = stats.totalReports ?? '—';
    if($('ac-stat-total-sub'))   $('ac-stat-total-sub').textContent   = periodLabels[period] || 'Periode dipilih';
    if($('ac-stat-ok'))          $('ac-stat-ok').textContent          = stats.berhasil ?? '—';
    if($('ac-stat-kambuh'))      $('ac-stat-kambuh').textContent      = stats.kambuh ?? '—';

    renderACTopList('ac-top-units',    stats.byUnit||{},    _acTopN['ac-top-units']);
    renderACTopList('ac-top-types',    stats.byType||{},    _acTopN['ac-top-types']);
    renderACTopList('ac-top-penyebab', stats.byPenyebab||{},_acTopN['ac-top-penyebab']);
    renderACTopList('ac-top-actions',  stats.byAction||{},  _acTopN['ac-top-actions']);
    renderACCompletionChart(period);
    /* Render 4 parameter charts */
    renderACParamChart('units',    period);
    renderACParamChart('types',    period);
    renderACParamChart('penyebab', period);
    renderACParamChart('actions',  period);
  } catch(e){ console.error('AC Dashboard error:',e); }
}

/* ── Render horizontal bar chart for a single AC parameter category ── */
async function renderACParamChart(target, period) {
  const canvasId = `ac-param-chart-${target}`;
  const canvas = $(canvasId); if(!canvas) return;

  /* Destroy previous instance */
  const instanceKey = `ac-param-${target}`;
  if(chartInstances[instanceKey]){ try{chartInstances[instanceKey].destroy();}catch(e){} }

  /* Fetch data if not cached */
  if(!_acStatsCache[period]) {
    try {
      const res = await gasFetch({action:'getACStats', period});
      _acStatsCache[period] = res.data || {};
    } catch(e) { return; }
  }

  const stats = _acStatsCache[period] || {};
  const dataMap = {
    units:    { obj: stats.byUnit    || {}, color:'#3B82F6', label:'AC dengan Kerusakan' },
    types:    { obj: stats.byType    || {}, color:'#F97316', label:'Jenis Kerusakan' },
    penyebab: { obj: stats.byPenyebab|| {}, color:'#8B5CF6', label:'Penyebab Kerusakan' },
    actions:  { obj: stats.byAction  || {}, color:'#10B981', label:'Tindakan Perbaikan' },
  };

  const cfg = dataMap[target]; if(!cfg) return;
  const entries = Object.entries(cfg.obj).sort((a,b)=>b[1]-a[1]).slice(0,8);
  if(!entries.length) return;

  const labels = entries.map(([k])=> k.length>28 ? k.slice(0,26)+'…' : k);
  const values = entries.map(([,v])=> v);
  const col    = cfg.color;

  chartInstances[instanceKey] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: cfg.label,
        data: values,
        backgroundColor: `${col}22`,
        borderColor: col,
        borderWidth: 1.5,
        borderRadius: 5,
        hoverBackgroundColor: `${col}44`,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.x} kasus`
          }
        }
      },
      scales: {
        x: {
          grid: { color:'rgba(148,163,184,0.09)' },
          ticks: { font:{size:10}, precision:0 },
          beginAtZero: true,
        },
        y: {
          grid: { display: false },
          ticks: { font:{size:9.5}, color:'var(--text-secondary)' },
        }
      }
    }
  });
}

function renderACTopList(containerId, dataObj, topN) {
  const el=$(containerId); if(!el)return;
  const n = topN || _acTopN[containerId] || 5;
  const entries=Object.entries(dataObj).sort((a,b)=>b[1]-a[1]).slice(0,n);
  const max=entries[0]?.[1]||1;
  if(!entries.length){ el.innerHTML=emptyState('Belum ada data',''); return; }
  el.innerHTML=entries.map(([name,count],i)=>`
    <div class="ac-top-item">
      <span class="ac-top-rank">#${i+1}</span>
      <div style="flex:1;min-width:0">
        <div class="ac-top-name" title="${escHtml(name)}">${escHtml(name)}</div>
        <div class="ac-top-bar"><div class="ac-top-fill" style="width:${Math.round(count/max*100)}%"></div></div>
      </div>
      <span class="ac-top-count">${count}×</span>
    </div>`).join('');
}

async function renderACCompletionChart(period) {
  const canvas=$('ac-completion-chart'); if(!canvas)return;
  if(chartInstances['ac-completion']){ try{chartInstances['ac-completion'].destroy();}catch(e){} }

  /* Fetch real data dari GAS jika belum ada di cache untuk periode ini */
  if(!_acStatsCache[period]) {
    try {
      const res=await gasFetch({action:'getACStats',period});
      _acStatsCache[period]=res.data||{};
    } catch(e){ console.warn('[AC Chart] Gagal fetch data periode:',period,e); }
  }

  /* Build timeline data — gunakan data real dari GAS, bukan dummy */
  const stats=_acStatsCache[period]||{};
  const timeline=stats.timeline||[];
  const labels=timeline.map(t=>t.label);
  const counts=timeline.map(t=>t.count||0);

  chartInstances['ac-completion']=new Chart(canvas,{
    type:'line',
    data:{labels,datasets:[{
      label:`Kerusakan Diselesaikan (${period==='daily'?'Harian':period==='weekly'?'Mingguan':period==='monthly'?'Bulanan':'Tahunan'})`,
      data:counts,
      borderColor:'#10B981',
      backgroundColor:'rgba(16,185,129,0.07)',
      borderWidth:2.5,
      pointRadius:3,
      pointBackgroundColor:'#10B981',
      pointHoverRadius:6,
      fill:true,
      tension:0.4,
    }]},
    options:{
      responsive:true, maintainAspectRatio:false,
      interaction:{mode:'index',intersect:false},
      plugins:{legend:{position:'top',labels:{boxWidth:10,font:{size:11}}}},
      scales:{
        x:{grid:{display:false},ticks:{font:{size:10},maxTicksLimit:16}},
        y:{grid:{color:'rgba(148,163,184,0.09)'},ticks:{font:{size:10}},beginAtZero:true,precision:0}
      }
    }
  });
}

/* ── Table builder ───────────────────────────────────────────── */
function buildTable(cols,rows) {
  return `<div class="history-table-wrap"><table class="history-table"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

/* Table builder with PDF download button */
function buildTableWithPDF(title, cols, rows) {
  const tableId = 'pdf-table-' + Math.floor(Math.random()*99999);
  return `
  <div class="history-pdf-toolbar">
    <span class="history-pdf-count">${rows.split('<tr>').length - 1} data</span>
    <button class="btn-pdf" onclick="printHistoryPDF('${tableId}','${escHtml(title)}')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
      Unduh PDF
    </button>
  </div>
  <div class="history-table-wrap">
    <table class="history-table" id="${tableId}">
      <thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

/* Kolom-kolom foto yang TIDAK boleh masuk ke PDF */
const PDF_EXCLUDE_COLS = new Set(['Foto SVI30','Foto Rusak','Foto Fix','Foto Sebelum','Foto Sesudah']);

/* Kolom yang menentukan warna status di PDF */
const PDF_STATUS_COLS = new Set(['Status','Status Akhir']);

/* Print-to-PDF: inject a clean print window with only the table */
function printHistoryPDF(tableId, title) {
  const tbl = document.getElementById(tableId);
  if (!tbl) return;

  /* Baca semua header, tandai index mana yang harus di-skip (kolom foto) */
  const allHeaders  = Array.from(tbl.querySelectorAll('thead th')).map(th => th.textContent.trim());
  const skipIdx     = new Set(allHeaders.map((h,i) => PDF_EXCLUDE_COLS.has(h) ? i : -1).filter(i => i >= 0));
  const statusIdx   = new Set(allHeaders.map((h,i) => PDF_STATUS_COLS.has(h) ? i : -1).filter(i => i >= 0));

  /* Header bersih tanpa kolom foto */
  const headerCells = allHeaders.filter((_,i) => !skipIdx.has(i));

  /* Baris bersih tanpa kolom foto */
  const bodyRows = Array.from(tbl.querySelectorAll('tbody tr')).map(tr =>
    Array.from(tr.querySelectorAll('td'))
      .map((td, i) => ({ text: td.textContent.trim(), isStatus: statusIdx.has(i) }))
      .filter((_,i) => !skipIdx.has(i))
  );

  const now = new Date().toLocaleString('id-ID', {
    day:'2-digit', month:'long', year:'numeric',
    hour:'2-digit', minute:'2-digit'
  });

  /* Build clean HTML for print window */
  const colWidthHint = headerCells.length > 12 ? 'font-size:7.5pt;' : 'font-size:8.5pt;';
  const headerHTML = headerCells.map(h => `<th>${h}</th>`).join('');
  const bodyHTML   = bodyRows.map(cells => {
    return `<tr>${cells.map(({ text: c, isStatus }) => {
      const isAttn   = isStatus && (c === 'Perhatian' || c === 'Kambuh');
      const isNormal = isStatus && (c === 'Normal' || c === 'Berhasil');
      const statusStyle = isStatus
        ? (isAttn ? 'color:#B45309;font-weight:700;' : isNormal ? 'color:#065F46;font-weight:700;' : '')
        : '';
      return `<td style="${statusStyle}">${c}</td>`;
    }).join('')}</tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>${title}</title>
<style>
  @page { size: A4 landscape; margin: 14mm 10mm 14mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1A2332; background: #fff; }
  .pdf-header { display: flex; justify-content: space-between; align-items: flex-end;
    border-bottom: 2.5px solid #1D4ED8; padding-bottom: 8px; margin-bottom: 14px; }
  .pdf-title { font-size: 13pt; font-weight: 800; color: #1D4ED8; letter-spacing: -0.3px; }
  .pdf-meta  { font-size: 7.5pt; color: #64748B; text-align: right; line-height: 1.6; }
  .pdf-brand { font-size: 9pt; font-weight: 700; color: #1E3A8A; }
  table { width: 100%; border-collapse: collapse; ${colWidthHint} }
  thead th {
    background: #1D4ED8; color: #fff;
    padding: 5px 5px; text-align: left;
    font-weight: 700; font-size: 7pt;
    border: 1px solid #1E40AF;
    white-space: nowrap;
  }
  tbody td {
    padding: 4px 5px; border: 1px solid #E2E8F0;
    vertical-align: top; word-break: break-word;
    max-width: 120px;
  }
  tbody tr:nth-child(even) { background: #F8FAFF; }
  tbody tr:hover { background: #EFF6FF; }
  .pdf-footer { margin-top: 12px; font-size: 7pt; color: #94A3B8;
    display: flex; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 6px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
  <div class="pdf-header">
    <div>
      <div class="pdf-brand">BuMi — Building Maintenance Monitoring Integration</div>
      <div class="pdf-title">${title}</div>
    </div>
    <div class="pdf-meta">
      <div>Dicetak: ${now}</div>
      <div>Total data: ${bodyRows.length} baris</div>
      <div>PT Bintang Toedjoe</div>
    </div>
  </div>
  <table>
    <thead><tr>${headerHTML}</tr></thead>
    <tbody>${bodyHTML}</tbody>
  </table>
  <div class="pdf-footer">
    <span>BuMi v4.1 © 2025 — PT Bintang Toedjoe</span>
    <span>Dokumen ini digenerate otomatis oleh sistem BuMi</span>
  </div>
  <script>window.onload=function(){window.print();}<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=1100,height=750');
  if (!win) {
    showNotif('error','Pop-up Diblokir','Izinkan pop-up untuk halaman ini agar dapat mengunduh PDF.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

/* Print-to-PDF: jadwal PM bulan tertentu untuk supervisor */
function printPMSchedulePDF(schedules, monthKey) {
  const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const today = getTodayDate();

  /* Cari label bulan */
  let monthLabel = 'Semua';
  if (monthKey && monthKey.length === 7) {
    const [yr, mo] = monthKey.split('-').map(Number);
    monthLabel = `${MONTHS_ID[mo - 1]} ${yr}`;
  }

  const now = new Date().toLocaleString('id-ID', {
    day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit'
  });

  const headerHTML = `<tr><th>No</th><th>Unit AC</th><th>Tanggal PM</th><th>Hari</th><th>Status</th><th>Dikerjakan Oleh</th><th>Keterangan</th></tr>`;
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

  /* Filter ketat berdasarkan monthKey sebagai safety net, lalu urutkan ascending */
  const monthFiltered = (monthKey && monthKey.length === 7)
    ? schedules.filter(s => s.tanggal && s.tanggal.startsWith(monthKey))
    : schedules;
  const sorted = [...monthFiltered].sort((a, b) =>
    (a.tanggal || '').localeCompare(b.tanggal || '')
  );

  const bodyHTML = sorted.map((s, i) => {
    const isSudah = s.status && s.status.trim() === 'Sudah';
    const isPast  = s.tanggal < today;
    const statusLabel = isSudah ? 'Sudah' : isPast ? 'Lewat — Belum' : s.tanggal === today ? 'Hari Ini — Belum' : 'Mendatang';
    const statusStyle = isSudah ? 'color:#065F46;font-weight:700' : isPast ? 'color:#B45309;font-weight:700' : '';
    let dateStr = s.tanggal || '—';
    let hariStr = '—';
    if (s.tanggal && s.tanggal.length === 10) {
      const [y, m, d] = s.tanggal.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      hariStr = days[dateObj.getDay()];
      dateStr = `${d} ${MONTHS_ID[m - 1]} ${y}`;
    }
    return `<tr>
      <td style="text-align:center">${i + 1}</td>
      <td>${s.unitAC || '—'}</td>
      <td style="white-space:nowrap">${dateStr}</td>
      <td>${hariStr}</td>
      <td style="${statusStyle}">${statusLabel}</td>
      <td>${s.selesaiOleh || '—'}</td>
      <td style="max-width:160px;word-break:break-word">${s.keterangan || s.deskripsi || '—'}</td>
    </tr>`;
  }).join('');

  const htmlDoc = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>Jadwal PM — ${monthLabel}</title>
<style>
  @page { size: A4 landscape; margin: 14mm 10mm 14mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1A2332; background: #fff; }
  .pdf-header { display: flex; justify-content: space-between; align-items: flex-end;
    border-bottom: 2.5px solid #1D4ED8; padding-bottom: 8px; margin-bottom: 14px; }
  .pdf-title { font-size: 13pt; font-weight: 800; color: #1D4ED8; letter-spacing: -0.3px; }
  .pdf-meta  { font-size: 7.5pt; color: #64748B; text-align: right; line-height: 1.6; }
  .pdf-brand { font-size: 9pt; font-weight: 700; color: #1E3A8A; }
  table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
  thead th {
    background: #1D4ED8; color: #fff;
    padding: 5px 6px; text-align: left;
    font-weight: 700; font-size: 7.5pt;
    border: 1px solid #1E40AF;
    white-space: nowrap;
  }
  tbody td { padding: 4px 6px; border: 1px solid #E2E8F0; vertical-align: top; }
  tbody tr:nth-child(even) { background: #F8FAFF; }
  .pdf-footer { margin-top: 12px; font-size: 7pt; color: #94A3B8;
    display: flex; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 6px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <div class="pdf-header">
    <div>
      <div class="pdf-brand">BuMi — Building Maintenance Monitoring Integration</div>
      <div class="pdf-title">Daftar Jadwal PM — ${monthLabel}</div>
    </div>
    <div class="pdf-meta">
      <div>Dicetak: ${now}</div>
      <div>Total jadwal: ${sorted.length} unit</div>
      <div>PT Bintang Toedjoe</div>
    </div>
  </div>
  <table>
    <thead>${headerHTML}</thead>
    <tbody>${bodyHTML}</tbody>
  </table>
  <div class="pdf-footer">
    <span>BuMi v4.1 © 2025 — PT Bintang Toedjoe</span>
    <span>Dokumen ini digenerate otomatis oleh sistem BuMi</span>
  </div>
  <script>window.onload=function(){window.print();}<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=1100,height=750');
  if (!win) {
    showNotif('error','Pop-up Diblokir','Izinkan pop-up untuk halaman ini agar dapat mengunduh PDF.');
    return;
  }
  win.document.open();
  win.document.write(htmlDoc);
  win.document.close();
}

function emptyState(title,sub) {
  return `<div class="activity-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><p>${escHtml(title)}</p><span>${escHtml(sub)}</span></div>`;
}

/* ════════════════════════════════════════════════════════════════
   HELPER — Kelompokkan data per bulan dari field timestamp
════════════════════════════════════════════════════════════════ */
function groupDataByMonth(data) {
  /* timestamp bisa berformat: "DD/MM/YYYY, HH:MM:SS" atau "DD Mmm, HH:MM" dsb.
     Kita coba parse tanggal dari field tanggal (YYYY-MM-DD) atau timestamp string. */
  const groups = {};
  const MONTH_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  data.forEach(d => {
    let date = null;
    /* Coba dari field tanggal (YYYY-MM-DD) */
    if (d.tanggal && /^\d{4}-\d{2}-\d{2}$/.test(d.tanggal)) {
      date = new Date(d.tanggal + 'T00:00:00');
    }
    /* Fallback: parse timestamp "DD/MM/YYYY..." */
    if (!date && d.timestamp) {
      const m = d.timestamp.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (m) date = new Date(parseInt(m[3]), parseInt(m[2])-1, parseInt(m[1]));
    }
    /* Fallback: "DD Mmm" — ambil bulan dari nama bulan Indonesia */
    if (!date && d.timestamp) {
      const months = ['jan','feb','mar','apr','mei','jun','jul','ags','sep','okt','nov','des'];
      const lower = d.timestamp.toLowerCase();
      const mo = months.findIndex(m => lower.includes(m));
      if (mo !== -1) {
        const dayM = lower.match(/(\d{1,2})\s/);
        const yr = new Date().getFullYear();
        date = new Date(yr, mo, dayM ? parseInt(dayM[1]) : 1);
      }
    }
    if (!date) date = new Date(); /* fallback ke hari ini */
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
    const label = `${MONTH_ID[date.getMonth()]} ${date.getFullYear()}`;
    if (!groups[key]) groups[key] = { key, label, items: [] };
    groups[key].items.push(d);
  });
  /* Urutkan descending (terbaru dulu) */
  return Object.values(groups).sort((a,b) => b.key.localeCompare(a.key));
}

/* Build grouped history HTML: setiap bulan = accordion collapsible
   Lazy-render: grup pertama langsung tampil, sisanya di-render saat expand
   → menghindari blocking DOM untuk ratusan baris sekaligus */
function buildGroupedTableWithPDF(title, cols, allData, rowBuilder, photoCols) {
  if (!allData.length) return emptyState('Belum ada data history','Data dari spreadsheet akan muncul di sini');
  const groups = groupDataByMonth(allData);
  const tableId = 'pdf-table-' + Math.floor(Math.random()*99999);

  /* Header untuk tabel layar (semua kolom) */
  const colHeader = `<thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>`;

  /* photoCols diterima tapi tidak perlu diproses di sini —
     printHistoryPDF langsung menyaring berdasarkan PDF_EXCLUDE_COLS */

  let html = `
  <div class="history-pdf-toolbar">
    <span class="history-pdf-count">${allData.length} total data · ${groups.length} bulan</span>
    <button class="btn-pdf" onclick="printHistoryPDF('${tableId}','${escHtml(title)}')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
      Unduh PDF
    </button>
  </div>
  <!-- Hidden master table for PDF export — kolom foto akan di-skip oleh printHistoryPDF -->
  <table class="history-table" id="${tableId}" style="display:none">
    ${colHeader}<tbody></tbody>
  </table>
  <div class="history-month-groups">`;

  groups.forEach((grp, gi) => {
    const groupId = `hgrp-${tableId}-${gi}`;
    const isFirst = gi === 0;
    /* Grup pertama langsung di-render, sisanya placeholder lazy */
    const bodyContent = isFirst
      ? `<div class="history-table-wrap"><table class="history-table">${colHeader}<tbody>${grp.items.map(d=>rowBuilder(d)).join('')}</tbody></table></div>`
      : `<div class="history-table-wrap history-lazy-wrap" data-lazy-pending="1"><table class="history-table">${colHeader}<tbody><tr><td colspan="${cols.length}" style="text-align:center;padding:16px"><div class="spinner spinner-dark" style="display:inline-block;margin-right:6px"></div>Memuat ${grp.items.length} data…</td></tr></tbody></table></div>`;
    html += `
    <div class="history-month-group" data-grp-idx="${gi}" data-table-id="${tableId}">
      <button class="history-month-header ${isFirst?'open':''}" onclick="toggleHistoryGroup('${groupId}',this)" aria-expanded="${isFirst}">
        <div class="history-month-header-left">
          <svg class="history-month-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          <span class="history-month-label">${escHtml(grp.label)}</span>
        </div>
        <span class="history-month-count">${grp.items.length} data</span>
      </button>
      <div class="history-month-body ${isFirst?'open':''}\" id="${groupId}">
        ${bodyContent}
      </div>
    </div>`;
  });

  html += `</div>`;

  /* Store groups + rowBuilder for lazy-render — keyed by tableId */
  _lazyGroupRegistry[tableId] = { groups, cols, colHeader, rowBuilder };

  /* Schedule PDF table population lazily too (after paint) */
  requestAnimationFrame(() => {
    const tbl = document.getElementById(tableId);
    if (tbl) {
      const tbody = tbl.querySelector('tbody');
      if (tbody) tbody.innerHTML = allData.map(d => rowBuilder(d)).join('');
    }
  });

  return html;
}

/* Registry for lazy group rendering */
const _lazyGroupRegistry = {};

function toggleHistoryGroup(id, btn) {
  const body = document.getElementById(id);
  if (!body) return;
  const isOpen = body.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', isOpen);

  /* Lazy-render: jika grup baru dibuka dan masih punya placeholder */
  if (isOpen) {
    const lazyWrap = body.querySelector('.history-lazy-wrap[data-lazy-pending="1"]');
    if (lazyWrap) {
      const grpEl   = btn.closest('.history-month-group');
      const gi      = grpEl ? parseInt(grpEl.dataset.grpIdx, 10) : -1;
      const tableId = grpEl ? grpEl.dataset.tableId : '';
      const reg     = tableId ? _lazyGroupRegistry[tableId] : null;
      if (reg && gi >= 0 && reg.groups[gi]) {
        lazyWrap.removeAttribute('data-lazy-pending');
        const rows = reg.groups[gi].items.map(d => reg.rowBuilder(d)).join('');
        lazyWrap.innerHTML = `<table class="history-table">${reg.colHeader}<tbody>${rows}</tbody></table>`;
      }
    }
  }
}

/* showSection — reload data dari GAS setiap kali section dibuka */
function showSection(sec) {
  _showSectionCore(sec);
  if(!currentUser) return;
  if(sec==='history') {
    setTimeout(()=>loadSupervisorHistory(currentUser), 50);
    /* Supervisor AC: juga load PM history yang digabung di halaman History */
    if(currentUser.role === 'supervisor-ac') {
      setTimeout(()=>loadPMHistory(currentUser), 100);
    }
  }
  if(sec==='dashboard') {
    const role = currentUser.role;
    if(role==='teknisi-ipal' || role==='teknisi-ac') {
      _teknisiHistoryControlsBound = false; // allow re-bind after section re-renders
      setTimeout(()=>loadOwnHistory(currentUser), 50);
    }
    /* Teknisi AC: load PM history yang digabung di dashboard */
    if(role==='teknisi-ac') {
      setTimeout(()=>loadPMHistory(currentUser), 200);
    }
  }
  if(sec==='preventive') {
    renderPMList();
  }
  /* sec==='pm-history' sudah tidak ada di sidebar, tapi tetap support kalau dipanggil langsung */
  if(sec==='pm-history') {
    loadPMHistory(currentUser);
  }
}

/* ════════════════════════════════════════════════════════════════
   FOTO MODAL — Popup preview foto dari history
════════════════════════════════════════════════════════════════ */
function showFotoModal(url, caption) {
  let modal = $('foto-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'foto-modal';
    modal.className = 'foto-modal-overlay';
    modal.innerHTML = `
      <div class="foto-modal-box">
        <div class="foto-modal-header">
          <span class="foto-modal-caption" id="foto-modal-caption"></span>
          <div style="display:flex;gap:8px;align-items:center">
            <a id="foto-modal-open" href="#" target="_blank" class="foto-modal-open-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Buka di Tab Baru
            </a>
            <button class="foto-modal-close" id="foto-modal-close" title="Tutup">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div class="foto-modal-img-wrap">
          <div class="foto-modal-loading" id="foto-modal-loading">
            <div class="spinner"></div><span>Memuat foto…</span>
          </div>
          <img id="foto-modal-img" src="" alt="Foto" style="display:none" />
        </div>
      </div>`;
    document.body.appendChild(modal);

    $('foto-modal-close').addEventListener('click', closeFotoModal);
    modal.addEventListener('click', e => { if(e.target===modal) closeFotoModal(); });
    document.addEventListener('keydown', e => { if(e.key==='Escape') closeFotoModal(); });

    $('foto-modal-img').addEventListener('load', () => {
      $('foto-modal-loading').style.display='none';
      $('foto-modal-img').style.display='block';
    });
    $('foto-modal-img').addEventListener('error', () => {
      $('foto-modal-loading').innerHTML='<span style="color:var(--error)">Gagal memuat foto. Klik "Buka di Tab Baru" untuk melihat langsung.</span>';
    });
  }
  $('foto-modal-caption').textContent = caption || 'Foto';
  $('foto-modal-open').href = url;
  $('foto-modal-loading').style.display='flex';
  $('foto-modal-loading').innerHTML='<div class="spinner"></div><span>Memuat foto…</span>';
  $('foto-modal-img').style.display='none';
  $('foto-modal-img').src = url;
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeFotoModal() {
  const modal=$('foto-modal');
  if(modal){ modal.classList.remove('open'); document.body.style.overflow=''; }
}

/* ════════════════════════════════════════════════════════════════
   PM HISTORY — Load and render PM laporan history
════════════════════════════════════════════════════════════════ */
let _pmHistPeriod = 'monthly';

async function loadPMHistory(user) {
  const wrap = $('pm-history-wrap'); if(!wrap) return;
  wrap.innerHTML = `<div class="history-loading"><div class="spinner spinner-dark"></div>&nbsp;Memuat data PM…</div>`;

  try {
    /* Semua role (teknisi maupun supervisor) melihat seluruh riwayat PM — tampilan identik */
    const res = await gasFetch({ action: 'getPMLaporanHistory', period: _pmHistPeriod });
    let data = res.data || [];

    if(!data.length) {
      wrap.innerHTML = emptyState('Belum ada history PM','Laporan PM yang sudah selesai akan muncul di sini');
      /* Tetap pasang listener period toggle agar bisa ganti periode */
      _attachPMHistPeriodToggle(user);
      return;
    }

    /* Yield before heavy DOM render so spinner stays visible */
    await new Promise(r => requestAnimationFrame(r));

    const isSupervisorAC = user && user.role === 'supervisor-ac';
    const cols = ['Waktu','Unit AC','Tanggal PM','Teknisi','Suhu Sblm→Ssdh (°C)','Tekanan Sblm→Ssdh (psi)','Arus Indoor Sblm→Ssdh (A)','Discharge Sblm→Ssdh (°C)','Tindakan','Catatan','Status Akhir','Foto Sebelum','Foto Sesudah'];
    /* Helper: konversi URL Drive ke drive.usercontent.google.com agar bisa dibuka di tab baru langsung */
    function toDriveUcUrl(url) {
      if (!url) return '';
      /* Format: https://drive.google.com/uc?id=FILE_ID&export=view → https://drive.usercontent.google.com/download?id=FILE_ID&export=view&authuser=0 */
      const m = String(url).match(/[?&]id=([^&]+)/);
      if (m) return `https://drive.usercontent.google.com/download?id=${m[1]}&export=view&authuser=0`;
      return url;
    }
    const rowBuilder = d => {
      const fotoBeforeUrl = toDriveUcUrl(d.fotoBeforeUrl);
      const fotoAfterUrl  = toDriveUcUrl(d.fotoAfterUrl);
      const fotoBefore = fotoBeforeUrl
        ? `<button class="foto-link-btn" data-foto-url="${escHtml(fotoBeforeUrl)}" data-foto-caption="📷 Foto Sebelum PM — ${escHtml(d.unitAC||'')}">📷 Sebelum</button>`
        : '—';
      const fotoAfter = fotoAfterUrl
        ? `<button class="foto-link-btn" data-foto-url="${escHtml(fotoAfterUrl)}" data-foto-caption="✅ Foto Sesudah PM — ${escHtml(d.unitAC||'')}">✅ Sesudah</button>`
        : '—';
      const statusBadge = d.statusAkhir && d.statusAkhir.includes('Perlu')
        ? `<span class="history-badge badge-attention">${escHtml(d.statusAkhir)}</span>`
        : `<span class="history-badge badge-normal">${escHtml(d.statusAkhir||'Normal')}</span>`;
      return `<tr>
        <td style="white-space:nowrap">${escHtml(d.timestamp||'')}</td>
        <td style="min-width:140px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escHtml(d.unitAC||'')}">${escHtml(d.unitAC||'—')}</td>
        <td>${escHtml(formatTanggalPM(d.tanggal, d.timestamp)||'')}</td>
        <td>${escHtml(d.namaTeknisi||'—')}</td>
        <td>${d.suhu_before||'—'} → ${d.suhu_after||'—'}</td>
        <td>${d.tekanan_before||'—'} → ${d.tekanan_after||'—'}</td>
        <td>${d.ampere_before||'—'} → ${d.ampere_after||'—'}</td>
        <td>${d.discharge_before||'—'} → ${d.discharge_after||'—'}</td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escHtml(d.tindakan||'')}">${escHtml(d.tindakan||'—')}</td>
        <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escHtml(d.catatan||'')}">${escHtml(d.catatan||'—')}</td>
        <td>${statusBadge}</td>
        <td>${fotoBefore}</td><td>${fotoAfter}</td>
      </tr>`;
    };
    wrap.innerHTML = buildGroupedTableWithPDF('History PM', cols, data, rowBuilder, ['Foto Sebelum','Foto Sesudah']);

    /* Pasang period toggle untuk semua role (supervisor maupun teknisi) */
    _attachPMHistPeriodToggle(user);
  } catch(e) {
    wrap.innerHTML = `<div class="activity-empty"><p>Gagal memuat history PM</p><span>${e.message}</span></div>`;
  }
}

/* Helper: pasang listener tombol period toggle PM history (idempotent via dataset.ready) */
function _attachPMHistPeriodToggle(user) {
  document.querySelectorAll('[data-pmhist-period]').forEach(btn => {
    if (btn.dataset.pmhistReady) return;
    btn.dataset.pmhistReady = '1';
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-pmhist-period]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _pmHistPeriod = btn.dataset.pmhistPeriod;
      /* Reset ready flag agar bisa re-attach setelah DOM pm-history-wrap berubah */
      document.querySelectorAll('[data-pmhist-period]').forEach(b => delete b.dataset.pmhistReady);
      loadPMHistory(user);
    });
  });
}

/* Load PM stats for teknisi AC dashboard */
async function loadACPMStats() {
  try {
    const res = await gasFetch({ action: 'getPMStats' });
    if(res.status === 'ok' && res.data) {
      const { todayTotal, todayDone, monthFixed } = res.data;
      if($('tstat-pm-todo'))    $('tstat-pm-todo').textContent    = todayTotal;
      if($('tstat-pm-done'))    $('tstat-pm-done').textContent    = todayDone;
      if($('tstat-fixed-month')) $('tstat-fixed-month').textContent = monthFixed ?? '—';
    }
  } catch(e) { console.warn('[PM Stats]', e); }
}

/* Load PM bulan ini for supervisor AC dashboard */
async function loadACPMMonthStat() {
  try {
    const res = await gasFetch({ action: 'getPMStats' });
    if(res.status === 'ok' && res.data) {
      if($('ac-stat-pm-month')) $('ac-stat-pm-month').textContent = res.data.monthDone ?? '—';
    }
  } catch(e) { console.warn('[PM Month Stat]', e); }
}

/* ════════════════════════════════════════════════════════════════
   DOMContentLoaded — LOGIN
════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded',()=>{
  initTheme();

  /* ── Global delegation untuk tombol foto (data-foto-url) ──────
     Klik tombol foto langsung membuka URL di tab baru.            */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.foto-link-btn[data-foto-url]');
    if (!btn) return;
    const url = btn.getAttribute('data-foto-url');
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  });

  $('theme-toggle-login')?.addEventListener('click',()=>setTheme(html.getAttribute('data-theme')==='dark'?'light':'dark'));

  const passEl=$('password'), toggleBtn=$('toggle-pass');
  toggleBtn?.addEventListener('click',()=>{
    const isP=passEl.type==='password';
    passEl.type=isP?'text':'password';
    $('eye-open').style.display=isP?'none':'block';
    $('eye-closed').style.display=isP?'block':'none';
  });

  $('nik')?.addEventListener('input',()=>{ $('nik-error').textContent=''; $('login-error').textContent=''; $('nik').classList.remove('has-error'); });
  passEl?.addEventListener('input',()=>{ $('pass-error').textContent=''; $('login-error').textContent=''; passEl.classList.remove('has-error'); });

  $('login-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const nikEl=$('nik'), loginBtn=$('login-btn');
    const nik=nikEl.value.trim(), pass=passEl.value;
    let valid=true;
    if(!nik)  { $('nik-error').textContent='NIK tidak boleh kosong.'; nikEl.classList.add('has-error'); valid=false; }
    if(!pass) { $('pass-error').textContent='Password tidak boleh kosong.'; passEl.classList.add('has-error'); valid=false; }
    if(!valid) return;
    setButtonLoading(loginBtn,true);
    await delay(650);
    const user=USERS.find(u=>u.nik===nik&&u.password===pass);
    if(!user){
      setButtonLoading(loginBtn,false);
      $('login-error').textContent='NIK atau password salah.';
      nikEl.classList.add('has-error'); passEl.classList.add('has-error'); passEl.value='';
      return;
    }
    currentUser=user;
    setButtonLoading(loginBtn,false);
    buildAppShell(user);
  });

  $('notif-close')?.addEventListener('click',hideNotif);

  console.log('%cBuMi v4.1 — Building Maintenance Monitoring Integration','color:#3B82F6;font-weight:800;font-size:14px;');
  if(IS_DEMO){
    console.log('%c[DEMO MODE] Akun tersedia:','color:#10B981;font-size:12px;font-weight:700;');
    console.log('%c  Supervisor IPAL : K0003701    / spvipal123','color:#64748B;font-size:11px;');
    console.log('%c  Supervisor AC   : PEG26041248 / spvac123','color:#64748B;font-size:11px;');
    console.log('%c  Teknisi AC 1    : 200200083   / ac123','color:#64748B;font-size:11px;');
    console.log('%c  Teknisi AC 2    : 993840356   / ac123','color:#64748B;font-size:11px;');
    console.log('%c  Teknisi IPAL    : 25400155    / ipal123','color:#64748B;font-size:11px;');
    console.log('%cGanti GAS_URL di script.js untuk produksi.','color:#F59E0B;font-size:11px;');
  }
});
