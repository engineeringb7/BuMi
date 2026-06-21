/* ================================================================
   BUMI — Building Maintenance Monitoring Integration
   Code.gs — Google Apps Script v4.2 Production
   
   Deploy sebagai Web App:
   - Execute as: Me (your account)
   - Who has access: Anyone
   ================================================================ */
/* ── KONFIGURASI — WAJIB DIISI ───────────────────────────────── */
const SPREADSHEET_ID = '157A7j704_tidcSZuSB8WG2IvXA2mbmdm8dMPrP5eSOs';
const SHEET_IPAL      = 'Monitoring IPAL';
const SHEET_AC        = 'Maintenance AC';
const SHEET_PM_SCHED  = 'PM Schedules';     // ← BARU: jadwal PM
const SHEET_PM_LAPORAN= 'PM Laporan';       // ← BARU: laporan PM teknisi
const DRIVE_FOLDER_IPAL = 'BUMI - Monitoring IPAL';
const DRIVE_FOLDER_AC   = 'BUMI - Maintenance AC';
const DRIVE_FOLDER_PM   = 'BUMI - Preventive Maintenance AC';  // ← foto PM
/* ─────────────────────────────────────────────────────────────── */

/* ── doPost — Menerima data dari website ─────────────────────── */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    let result;
    switch (payload.formType) {
      case 'IPAL':         result = handleIPALSubmit(payload);     break;
      case 'AC':           result = handleACSubmit(payload);       break;
      case 'SET_FLOW_BASIS': result = setFlowBasis(payload);       break;
      case 'PM_SCHEDULE':  result = handlePMSchedule(payload);     break;
      case 'PM_LAPORAN':   result = handlePMLaporan(payload);      break;
      default:             result = { status:'error', message:'formType tidak dikenal.' };
    }
    return buildResponse(result);
  } catch (err) {
    return buildResponse({ status:'error', message:err.message });
  }
}

/* ── doGet — Mengembalikan data ke dashboard ─────────────────── */
function doGet(e) {
  try {
    const p = e.parameter;
    let result;
    switch (p.action) {
      case 'getIPALLatest':    result = getIPALLatest();                    break;
      case 'getIPALChart':     result = getIPALChart(p.date);               break;
      case 'getIPALHistory':   result = getIPALHistory();                   break;
      case 'getACStats':       result = getACStats(p.period);               break;
      case 'getACHistory':     result = getACHistory(p.period, p.unit);     break;
      case 'getOwnHistory':    result = getOwnHistory(p.role, p.nik);       break;
      case 'getDriveFolderUrl':result = getDriveFolderUrl(p.folder);        break;
      case 'getFlowBasis':     result = getFlowBasis();                     break;
      case 'getPMSchedules':   result = getPMSchedulesFromSheet();           break;
      case 'getPMLaporanHistory': result = getPMLaporanHistory(p.period, p.unit); break;
      case 'getPMStats':       result = getPMStats();                         break;
      default:                 result = { status:'ok', message:'BuMi GAS API v4.2 aktif.' };
    }
    return buildResponse(result);
  } catch (err) {
    return buildResponse({ status:'error', message:err.message });
  }
}

/* ── buildResponse ───────────────────────────────────────────── */
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ════════════════════════════════════════════════════════════════
   PM SCHEDULE — Simpan / Hapus / Update jadwal ke Spreadsheet
   Sheet: "PM Schedules"
   Kolom: A=Unit AC | B=Tanggal | C=Keterangan Khusus
          D=Status (Belum/Sudah) | E=Dibuat Oleh | F=Dibuat Pada
          G=Selesai Oleh | H=Selesai Pada (timestamp laporan masuk)
   Catatan: ID Jadwal TIDAK disimpan ke spreadsheet — hanya digunakan
            di sisi client untuk referensi sesi (localStorage).
════════════════════════════════════════════════════════════════ */
function handlePMSchedule(p) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_PM_SCHED);
  ensurePMSchedHeader(sheet);

  if (p.action === 'addPMSchedule') {
    const s = p.schedule;
    if (!s || !s.unitAC || !s.tanggal) {
      return { status:'error', message:'Data jadwal tidak lengkap.' };
    }
    sheet.appendRow([
      s.unitAC,                                    // A: Unit AC
      s.tanggal,                                   // B: Tanggal PM
      s.keterangan || '',                          // C: Keterangan Khusus
      'Belum',                                     // D: Status → default "Belum"
      s.createdBy || '',                           // E: Dibuat Oleh
      s.createdAt || new Date().toLocaleString('id-ID'), // F: Dibuat Pada
      '',                                          // G: Selesai Oleh
      '',                                          // H: Selesai Pada
    ]);
    /* Warnai sel Status "Belum" dengan warna kuning */
    const newRow = sheet.getLastRow();
    sheet.getRange(newRow, 4).setBackground('#FEF9C3').setFontColor('#854D0E');
    return { status:'ok', message:'Jadwal PM berhasil disimpan.', id: s.id };

  } else if (p.action === 'deletePMSchedule') {
    if (!p.id) return { status:'error', message:'ID jadwal wajib diisi.' };

    /* Cara 1: ID berformat "sheet_N" → hapus langsung baris N */
    if (/^sheet_(\d+)$/.test(String(p.id))) {
      const rowNum = parseInt(String(p.id).replace('sheet_', ''), 10);
      if (rowNum >= 2 && rowNum <= sheet.getLastRow()) {
        sheet.deleteRow(rowNum);
        return { status:'ok', message:'Jadwal PM berhasil dihapus.' };
      }
    }

    /* Cara 2 (fallback): cocokkan berdasarkan unitAC + tanggal */
    const schedule = p.schedule || {};
    if (schedule.unitAC && schedule.tanggal) {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        const rowUnit    = String(allData[i][0] || '').trim();
        const rowTanggal = normalizeTanggalGAS(allData[i][1]);
        const tanggalNorm = normalizeTanggalGAS(schedule.tanggal);
        if (rowUnit === schedule.unitAC.trim() && rowTanggal === tanggalNorm) {
          sheet.deleteRow(i + 1);
          return { status:'ok', message:'Jadwal PM berhasil dihapus.' };
        }
      }
    }

    return { status:'ok', message:'Jadwal tidak ditemukan di sheet (sudah dihapus atau tidak tersimpan).' };

  } else if (p.action === 'markPMDone') {
    /* Tandai jadwal sebagai "Sudah" ketika teknisi kirim laporan PM.
       Strategi pencocokan (urutan prioritas):
       1. ID berformat "sheet_N" → langsung ke nomor baris N
       2. unitAC + tanggal + status belum "Sudah"                    */
    const namaTeknisi = p.namaTeknisi || '';
    const selesaiPada = new Date().toLocaleString('id-ID');

    function applyDone(rowNum) {
      sheet.getRange(rowNum, 4).setValue('Sudah')
           .setBackground('#DCFCE7').setFontColor('#166534');
      sheet.getRange(rowNum, 7).setValue(namaTeknisi);
      sheet.getRange(rowNum, 8).setValue(selesaiPada);
    }

    /* Cara 1: ID berformat "sheet_N" → row N */
    if (p.id && /^sheet_(\d+)$/.test(String(p.id))) {
      const rowNum = parseInt(String(p.id).replace('sheet_', ''), 10);
      if (rowNum >= 2 && rowNum <= sheet.getLastRow()) {
        const currentStatus = String(sheet.getRange(rowNum, 4).getValue() || '');
        if (currentStatus !== 'Sudah') {
          applyDone(rowNum);
          return { status:'ok', message:'Status PM diperbarui menjadi Sudah.' };
        }
        return { status:'ok', message:'Status PM sudah Sudah sebelumnya.' };
      }
    }

    /* Cara 2: unitAC + tanggal */
    const targetUnit    = String(p.unitAC    || '').trim();
    const targetTanggal = String(p.tanggal   || '').trim();
    if (targetUnit && targetTanggal) {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        const rowUnit    = String(allData[i][0] || '').trim();
        const rowRawDate = allData[i][1];
        const rowTanggal = normalizeTanggalGAS(rowRawDate);
        const rowStatus  = String(allData[i][3] || '').trim();
        if (rowUnit === targetUnit && rowTanggal === targetTanggal && rowStatus !== 'Sudah') {
          applyDone(i + 1);
          return { status:'ok', message:'Status PM diperbarui menjadi Sudah.' };
        }
      }
    }

    return { status:'ok', message:'Jadwal tidak ditemukan atau sudah bertanda Sudah.' };

  }

  return { status:'error', message:'Action tidak dikenal untuk PM_SCHEDULE.' };
}

/* Kembalikan SEMUA jadwal (Belum + Sudah) dari sheet ke client */
function getPMSchedulesFromSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_PM_SCHED);
  if (!sheet) return { status:'ok', data: [] };
  const allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { status:'ok', data: [] };
  const data = allData.slice(1).map((r, i) => ({
    id:           'sheet_' + (i + 2),              // generate client-side ID dari baris
    unitAC:       String(r[0] || ''),
    tanggal:      normalizeTanggalGAS(r[1]),        // selalu YYYY-MM-DD
    keterangan:   String(r[2] || ''),
    status:       String(r[3] || 'Belum'),          // "Belum" | "Sudah"
    createdBy:    String(r[4] || ''),
    createdAt:    String(r[5] || ''),
    selesaiOleh:  String(r[6] || ''),
    selesaiPada:  String(r[7] || ''),
  })).filter(r => r.unitAC !== ''); // skip baris kosong
  return { status:'ok', data };
}

function ensurePMSchedHeader(sheet) {
  if (sheet.getLastRow() === 0 || sheet.getRange(1,1).getValue() === '') {
    const headers = [
      'Unit AC','Tanggal PM','Keterangan Khusus',
      'Status','Dibuat Oleh','Dibuat Pada','Selesai Oleh','Selesai Pada'
    ];
    sheet.getRange(1,1,1,headers.length).setValues([headers]);
    sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#E2E8F0');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 200); // Unit AC
    sheet.setColumnWidth(3, 220); // Keterangan
    sheet.setColumnWidth(4, 80);  // Status
  }
}

/* ════════════════════════════════════════════════════════════════
   PM LAPORAN — Simpan laporan PM teknisi ke Spreadsheet
   Sheet: "PM Laporan"
   Kolom: A=Timestamp | B=PM_ID | C=Unit AC | D=Tanggal PM | E=Nama Teknisi | F=NIK
          G=Suhu Sebelum | H=Suhu Sesudah | I=Tekanan Sebelum | J=Tekanan Sesudah
          K=Ampere Sebelum | L=Ampere Sesudah | M=Discharge Sebelum | N=Discharge Sesudah
          O=Tindakan | P=Catatan | Q=Status Akhir
          R=Foto Sebelum | S=Foto Sesudah
════════════════════════════════════════════════════════════════ */
function handlePMLaporan(p) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_PM_LAPORAN);
  ensurePMLaporanHeader(sheet);

  const k = p.kondisi || {};
  let fotoBeforeUrl = '', fotoAfterUrl = '';

  /* Tandai jadwal PM sebagai "Sudah" di sheet PM Schedules */
  if (p.unitAC && p.tanggal) {
    const schedSheet = ss.getSheetByName(SHEET_PM_SCHED);
    if (schedSheet) {
      const allSched = schedSheet.getDataRange().getValues();
      for (let i = 1; i < allSched.length; i++) {
        const rowUnit    = String(allSched[i][0] || '');
        const rowTanggal = String(allSched[i][1] || '');
        const rowStatus  = String(allSched[i][3] || '');
        if (rowUnit === p.unitAC && rowTanggal === p.tanggal && rowStatus !== 'Sudah') {
          const rowNum = i + 1;
          schedSheet.getRange(rowNum, 4).setValue('Sudah')
                    .setBackground('#DCFCE7').setFontColor('#166534'); // kolom D = Status
          schedSheet.getRange(rowNum, 7).setValue(p.namaTeknisi || '');  // G: Selesai Oleh
          schedSheet.getRange(rowNum, 8).setValue(new Date().toLocaleString('id-ID')); // H: Selesai Pada
          break;
        }
      }
    }
  }

  if (p.fotoBeforeData && p.fotoBeforeData.length > 0) {
    fotoBeforeUrl = uploadToDrive(p.fotoBeforeData, p.fotoBeforeName || 'PM-Before.jpg', DRIVE_FOLDER_PM);
  }
  if (p.fotoAfterData && p.fotoAfterData.length > 0) {
    fotoAfterUrl = uploadToDrive(p.fotoAfterData, p.fotoAfterName || 'PM-After.jpg', DRIVE_FOLDER_PM);
  }

  sheet.appendRow([
    new Date(),                          // A: Timestamp
    p.pmId         || '',                // B: PM ID
    p.unitAC       || '',                // C: Unit AC
    p.tanggal      || '',                // D: Tanggal PM
    p.namaTeknisi  || '',                // E: Nama Teknisi
    p.nikTeknisi   || '',                // F: NIK
    parseFloat(k.suhu_before)      || 0, // G: Suhu Sebelum (°C)
    parseFloat(k.suhu_after)       || 0, // H: Suhu Sesudah (°C)
    parseFloat(k.tekanan_before)   || 0, // I: Tekanan Freon Sebelum (psi)
    parseFloat(k.tekanan_after)    || 0, // J: Tekanan Freon Sesudah (psi)
    parseFloat(k.ampere_before)    || 0, // K: Arus Indoor Sebelum (A)
    parseFloat(k.ampere_after)     || 0, // L: Arus Indoor Sesudah (A)
    parseFloat(k.discharge_before) || 0, // M: Suhu Discharge Sebelum (°C)
    parseFloat(k.discharge_after)  || 0, // N: Suhu Discharge Sesudah (°C)
    p.tindakan     || '',                // O: Tindakan (checklist)
    p.catatan      || '',                // P: Catatan Tambahan
    p.statusAkhir  || '',                // Q: Status Akhir
    fotoBeforeUrl  || '',                // R: Foto Sebelum (plain URL)
    fotoAfterUrl   || '',                // S: Foto Sesudah (plain URL)
  ]);

  /* Set foto sebagai hyperlink klikable di Spreadsheet */
  const newRow = sheet.getLastRow();
  if (fotoBeforeUrl) {
    const rtBefore = SpreadsheetApp.newRichTextValue()
      .setText('📷 Sebelum PM')
      .setLinkUrl(fotoBeforeUrl)
      .build();
    sheet.getRange(newRow, 18).setRichTextValue(rtBefore); // kolom R
  }
  if (fotoAfterUrl) {
    const rtAfter = SpreadsheetApp.newRichTextValue()
      .setText('✅ Sesudah PM')
      .setLinkUrl(fotoAfterUrl)
      .build();
    sheet.getRange(newRow, 19).setRichTextValue(rtAfter); // kolom S
  }

  return { status:'ok', message:'Laporan PM berhasil disimpan.', fotoBeforeUrl, fotoAfterUrl };
}

/* History laporan PM — untuk supervisor AC dan teknisi AC */
function getPMLaporanHistory(period, unit) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_PM_LAPORAN);
  if (!sheet) return { status:'ok', data:[] };
  const allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { status:'ok', data:[] };
  let rows = allData.slice(1);
  rows = filterByPeriod(rows, 0, period);
  if (unit) rows = rows.filter(r => String(r[2]||'').includes(unit));
  rows = rows.slice(-200).reverse();

  /* Baca URL foto dari RichText kolom R (18) dan S (19) */
  const lastRow = sheet.getLastRow();
  const firstDataRow = Math.max(2, lastRow - 199);
  const numRows = lastRow - firstDataRow + 1;
  let fotoBeforeUrls = [], fotoAfterUrls = [];
  if (numRows > 0) {
    const rtBefore = sheet.getRange(firstDataRow, 18, numRows, 1).getRichTextValues();
    const rtAfter  = sheet.getRange(firstDataRow, 19, numRows, 1).getRichTextValues();
    fotoBeforeUrls = rtBefore.map(r => { const rt=r[0]; if(!rt)return''; const runs=rt.getRuns(); for(const run of runs){const l=run.getLinkUrl();if(l)return l;} return rt.getText()||''; }).reverse();
    fotoAfterUrls  = rtAfter.map(r  => { const rt=r[0]; if(!rt)return''; const runs=rt.getRuns(); for(const run of runs){const l=run.getLinkUrl();if(l)return l;} return rt.getText()||''; }).reverse();
  }

  const data = rows.map((r,i) => ({
    timestamp:         formatTimestamp(r[0]),
    pmId:              String(r[1]||''),
    unitAC:            String(r[2]||''),
    tanggal:           String(r[3]||''),
    namaTeknisi:       String(r[4]||''),
    nikTeknisi:        String(r[5]||''),
    suhu_before:       parseFloat(r[6])  || 0,
    suhu_after:        parseFloat(r[7])  || 0,
    tekanan_before:    parseFloat(r[8])  || 0,
    tekanan_after:     parseFloat(r[9])  || 0,
    ampere_before:     parseFloat(r[10]) || 0,
    ampere_after:      parseFloat(r[11]) || 0,
    discharge_before:  parseFloat(r[12]) || 0,
    discharge_after:   parseFloat(r[13]) || 0,
    tindakan:          String(r[14]||''),
    catatan:           String(r[15]||''),
    statusAkhir:       String(r[16]||''),
    fotoBeforeUrl:     fotoBeforeUrls[i] || String(r[17]||''),
    fotoAfterUrl:      fotoAfterUrls[i]  || String(r[18]||''),
  }));
  return { status:'ok', data };
}

function ensurePMLaporanHeader(sheet) {
  if (sheet.getLastRow() === 0 || sheet.getRange(1,1).getValue() === '') {
    sheet.getRange(1,1,1,19).setValues([[
      'Timestamp','PM ID','Unit AC','Tanggal PM','Nama Teknisi','NIK',
      'Suhu Sebelum (°C)','Suhu Sesudah (°C)',
      'Tekanan Freon Sebelum (psi)','Tekanan Freon Sesudah (psi)',
      'Arus Indoor Sebelum (A)','Arus Indoor Sesudah (A)',
      'Suhu Discharge Sebelum (°C)','Suhu Discharge Sesudah (°C)',
      'Tindakan PM','Catatan Tambahan','Status Akhir',
      'Foto Sebelum PM','Foto Sesudah PM',
    ]]);
    sheet.getRange(1,1,1,19).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

/* ════════════════════════════════════════════════════════════════
   HANDLE IPAL SUBMIT
════════════════════════════════════════════════════════════════ */
function handleIPALSubmit(p) {
  Logger.log('[IPAL] Submit diterima: ' + JSON.stringify({nikTeknisi:p.nikTeknisi, tanggal:p.tanggal, formType:p.formType}));
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_IPAL);
  ensureIPALHeader(sheet);
  let fotoSviUrl = '';
  if (p.fotoSviBase64 && p.fotoSviBase64.length > 0) {
    fotoSviUrl = uploadToDrive(
      p.fotoSviBase64,
      p.namaFotoSvi || ('SVI30_' + p.nikTeknisi + '_' + new Date().getTime() + '.jpg'),
      DRIVE_FOLDER_IPAL
    );
  }
  const status = hitungStatusIPAL(p);
  sheet.appendRow([
    new Date(),
    p.tanggal || '',
    p.waktu || '',
    p.namaTeknisi || '',
    p.nikTeknisi || '',
    parseFloat(p.inletFlow)  || 0,
    parseFloat(p.inletDebit) || 0,
    parseFloat(p.outletFlow) || 0,
    parseFloat(p.outletDebit)|| 0,
    parseFloat(p.rasFlow)    || 0,
    parseFloat(p.rasDebit)   || 0,
    parseFloat(p.recFlow)    || 0,
    parseFloat(p.recDebit)   || 0,
    parseFloat(p.eq2Ph)   || 0,
    parseFloat(p.eq2Suhu) || 0,
    parseFloat(p.anrbPh)  || 0,
    parseFloat(p.anrbSuhu)|| 0,
    parseFloat(p.aer1Ph)  || 0,
    parseFloat(p.aer1Suhu)|| 0,
    parseFloat(p.aer1Svi) || 0,
    parseFloat(p.aer2Ph)  || 0,
    parseFloat(p.aer2Suhu)|| 0,
    parseFloat(p.aer2Svi) || 0,
    parseFloat(p.aer4Ph)  || 0,
    parseFloat(p.aer4Suhu)|| 0,
    parseFloat(p.aer4Svi) || 0,
    p.keteranganTambahan || '',
    fotoSviUrl || '',
    status,
    '',               // kolom 30: placeholder untuk RichText link foto (diisi di bawah)
  ]);
  if (fotoSviUrl) {
    const newRow = sheet.getLastRow();
    /* Kolom 28 (AB) berisi plain URL. Kolom 30 (AD) berisi RichText klikable. */
    const rtSvi = SpreadsheetApp.newRichTextValue()
      .setText('📷 Lihat Foto SVI30')
      .setLinkUrl(fotoSviUrl)
      .build();
    sheet.getRange(newRow, 30).setRichTextValue(rtSvi);
  }
  return { status:'ok', message:'Data IPAL berhasil disimpan.', fotoSviUrl, statusIpal: status };
}

/* ════════════════════════════════════════════════════════════════
   HANDLE AC SUBMIT
════════════════════════════════════════════════════════════════ */
function handleACSubmit(p) {
  Logger.log('[AC] Submit diterima: ' + JSON.stringify({nikTeknisi:p.nikTeknisi, unitAC:p.unitAC, formType:p.formType}));
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_AC);
  ensureACHeader(sheet);
  let fotoRusakUrl = '', fotoFixUrl = '';
  if (p.fotoRusakBase64 && p.fotoRusakBase64.length > 0) {
    fotoRusakUrl = uploadToDrive(p.fotoRusakBase64, p.namaFotoRusak || ('Rusak_' + p.nikTeknisi + '_' + new Date().getTime() + '.jpg'), DRIVE_FOLDER_AC);
  }
  if (p.fotoFixBase64 && p.fotoFixBase64.length > 0) {
    fotoFixUrl = uploadToDrive(p.fotoFixBase64, p.namaFotoFix || ('Fix_' + p.nikTeknisi + '_' + new Date().getTime() + '.jpg'), DRIVE_FOLDER_AC);
  }
  sheet.appendRow([
    new Date(),
    p.tanggal || '',
    p.waktu || '',
    p.namaTeknisi || '',
    p.nikTeknisi || '',
    p.unitAC || '',
    p.jenisGangguan || '',
    p.waktuMulaiRusak || '',
    p.penyebabKerusakan || '',
    p.deskripsiRusak || '',
    fotoRusakUrl || '',
    p.tindakan || '',
    p.deskripsiPerbaikan || '',
    fotoFixUrl || '',
    p.gangguanKambuh || '',
  ]);
  const newRowAC = sheet.getLastRow();
  if (fotoRusakUrl) {
    /* Kolom 11 (K) sudah berisi plain URL dari appendRow — jangan dioverwrite.
       Simpan RichText display link di kolom 16 (P) sebagai kolom terpisah. */
    const rtRusak = SpreadsheetApp.newRichTextValue().setText('📷 Lihat Foto Kerusakan').setLinkUrl(fotoRusakUrl).build();
    sheet.getRange(newRowAC, 16).setRichTextValue(rtRusak);
  }
  if (fotoFixUrl) {
    /* Kolom 14 (N) sudah berisi plain URL dari appendRow — jangan dioverwrite.
       Simpan RichText display link di kolom 17 (Q) sebagai kolom terpisah. */
    const rtFix = SpreadsheetApp.newRichTextValue().setText('✅ Lihat Foto Setelah Fix').setLinkUrl(fotoFixUrl).build();
    sheet.getRange(newRowAC, 17).setRichTextValue(rtFix);
  }
  return { status:'ok', message:'Data AC berhasil disimpan.', fotoRusakUrl, fotoFixUrl };
}

/* ════════════════════════════════════════════════════════════════
   UPLOAD FOTO KE GOOGLE DRIVE
════════════════════════════════════════════════════════════════ */
function uploadToDrive(base64Data, fileName, folderName) {
  try {
    const folder   = getOrCreateDriveFolder(folderName);
    const decoded  = Utilities.base64Decode(base64Data);
    const blob     = Utilities.newBlob(decoded, detectMimeType(fileName), fileName);
    const file     = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    /* Gunakan format direct-view agar URL di plain text sel langsung bisa
       dibuka sebagai gambar di browser (bukan halaman Drive) */
    return 'https://drive.google.com/uc?id=' + file.getId() + '&export=view';
  } catch (err) {
    Logger.log('Upload error: ' + err.message);
    return '';
  }
}

/* Konversi URL Google Drive format lama ke format direct-view yang bisa
   langsung dibuka sebagai gambar di browser.
   Input:  https://drive.google.com/file/d/FILE_ID/view?usp=...  (format lama)
           atau sudah /uc?id=... (tidak diubah)
   Output: https://drive.google.com/uc?id=FILE_ID&export=view */
function normalizeGDriveUrl(url) {
  if (!url || typeof url !== 'string') return '';
  url = url.trim();
  if (!url.startsWith('http')) return '';
  if (url.includes('/uc?id=')) return url; // sudah benar
  const m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return 'https://drive.google.com/uc?id=' + m1[1] + '&export=view';
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return 'https://drive.google.com/uc?id=' + m2[1] + '&export=view';
  return url;
}
function getOrCreateDriveFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  const folder = DriveApp.createFolder(name);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return folder;
}
function getDriveFolderUrl(folderName) {
  try {
    const name = folderName === 'ipal' ? DRIVE_FOLDER_IPAL : folderName === 'pm' ? DRIVE_FOLDER_PM : DRIVE_FOLDER_AC;
    const folder = getOrCreateDriveFolder(name);
    return { status:'ok', url: folder.getUrl(), name };
  } catch (err) {
    return { status:'error', message: err.message };
  }
}
function detectMimeType(fileName) {
  const ext = (fileName||'').split('.').pop().toLowerCase();
  const map = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif', webp:'image/webp' };
  return map[ext] || 'image/jpeg';
}

/* ════════════════════════════════════════════════════════════════
   GET IPAL LATEST
════════════════════════════════════════════════════════════════ */
function getIPALLatest() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_IPAL);
  if (!sheet) return { status:'ok', data:{} };
  const allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { status:'ok', data:{} };
  const rows = allData.slice(1);
  const today = getTodayStr();
  const todayRows = rows.filter(r => {
    const ts = r[0];
    if (!ts) return false;
    const d = ts instanceof Date ? ts : new Date(ts);
    return formatDateStr(d) === today;
  });
  const dataToUse = todayRows.length > 0 ? todayRows : rows.slice(-30);
  if (dataToUse.length === 0) return { status:'ok', data:{} };
  const latest = dataToUse[dataToUse.length - 1];
  const latestTs = latest[0] instanceof Date
    ? latest[0].toLocaleString('id-ID',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})
    : String(latest[0]||'');
  function colVals(idx) { return dataToUse.map(r=>parseFloat(r[idx])).filter(v=>!isNaN(v)); }
  function stats(vals) {
    if(!vals.length) return{max:null,min:null,avg:null};
    return{max:Math.max(...vals),min:Math.min(...vals),avg:vals.reduce((a,b)=>a+b,0)/vals.length};
  }
  const zones = {};
  const inletDebitVals=colVals(6),inletFlowVals=colVals(5),sd_inlet=stats(inletDebitVals);
  zones['inlet']={flowmeter:parseFloat(latest[5])||0,debit:parseFloat(latest[6])||0,ts:latestTs,maxDebit:sd_inlet.max,minDebit:sd_inlet.min,avgDebit:sd_inlet.avg,maxFlow:stats(inletFlowVals).max,minFlow:stats(inletFlowVals).min,avgFlow:stats(inletFlowVals).avg};
  const outletDebitVals=colVals(8),outletFlowVals=colVals(7),sd_outlet=stats(outletDebitVals);
  zones['outlet']={flowmeter:parseFloat(latest[7])||0,debit:parseFloat(latest[8])||0,ts:latestTs,maxDebit:sd_outlet.max,minDebit:sd_outlet.min,avgDebit:sd_outlet.avg,maxFlow:stats(outletFlowVals).max,minFlow:stats(outletFlowVals).min,avgFlow:stats(outletFlowVals).avg};
  const rasDebitVals=colVals(10),rasFlowVals=colVals(9),sd_ras=stats(rasDebitVals);
  zones['ras']={flowmeter:parseFloat(latest[9])||0,debit:parseFloat(latest[10])||0,ts:latestTs,maxDebit:sd_ras.max,minDebit:sd_ras.min,avgDebit:sd_ras.avg,maxFlow:stats(rasFlowVals).max,minFlow:stats(rasFlowVals).min,avgFlow:stats(rasFlowVals).avg};
  const recDebitVals=colVals(12),recFlowVals=colVals(11),sd_rec=stats(recDebitVals);
  zones['recycle']={flowmeter:parseFloat(latest[11])||0,debit:parseFloat(latest[12])||0,ts:latestTs,maxDebit:sd_rec.max,minDebit:sd_rec.min,avgDebit:sd_rec.avg,maxFlow:stats(recFlowVals).max,minFlow:stats(recFlowVals).min,avgFlow:stats(recFlowVals).avg};
  const eq2PhVals=colVals(13),eq2SuhuVals=colVals(14),sp2=stats(eq2PhVals),ss2=stats(eq2SuhuVals);
  zones['ekual2']={ph:parseFloat(latest[13])||0,suhu:parseFloat(latest[14])||0,ts:latestTs,maxPh:sp2.max,minPh:sp2.min,avgPh:sp2.avg,maxSuhu:ss2.max,minSuhu:ss2.min,avgSuhu:ss2.avg};
  const anrbPhVals=colVals(15),anrbSuhuVals=colVals(16),spa=stats(anrbPhVals),ssa=stats(anrbSuhuVals);
  zones['anaerob']={ph:parseFloat(latest[15])||0,suhu:parseFloat(latest[16])||0,ts:latestTs,maxPh:spa.max,minPh:spa.min,avgPh:spa.avg,maxSuhu:ssa.max,minSuhu:ssa.min,avgSuhu:ssa.avg};
  const a1PhVals=colVals(17),a1SuhuVals=colVals(18),a1SviVals=colVals(19);
  zones['aerasi1']={ph:parseFloat(latest[17])||0,suhu:parseFloat(latest[18])||0,svi30:parseFloat(latest[19])||0,ts:latestTs,maxPh:stats(a1PhVals).max,minPh:stats(a1PhVals).min,avgPh:stats(a1PhVals).avg,maxSuhu:stats(a1SuhuVals).max,minSuhu:stats(a1SuhuVals).min,avgSuhu:stats(a1SuhuVals).avg,maxSVI:stats(a1SviVals).max,minSVI:stats(a1SviVals).min,avgSVI:stats(a1SviVals).avg};
  const a2PhVals=colVals(20),a2SuhuVals=colVals(21),a2SviVals=colVals(22);
  zones['aerasi2']={ph:parseFloat(latest[20])||0,suhu:parseFloat(latest[21])||0,svi30:parseFloat(latest[22])||0,ts:latestTs,maxPh:stats(a2PhVals).max,minPh:stats(a2PhVals).min,avgPh:stats(a2PhVals).avg,maxSuhu:stats(a2SuhuVals).max,minSuhu:stats(a2SuhuVals).min,avgSuhu:stats(a2SuhuVals).avg,maxSVI:stats(a2SviVals).max,minSVI:stats(a2SviVals).min,avgSVI:stats(a2SviVals).avg};
  const a4PhVals=colVals(23),a4SuhuVals=colVals(24),a4SviVals=colVals(25);
  zones['aerasi4']={ph:parseFloat(latest[23])||0,suhu:parseFloat(latest[24])||0,svi30:parseFloat(latest[25])||0,ts:latestTs,maxPh:stats(a4PhVals).max,minPh:stats(a4PhVals).min,avgPh:stats(a4PhVals).avg,maxSuhu:stats(a4SuhuVals).max,minSuhu:stats(a4SuhuVals).min,avgSuhu:stats(a4SuhuVals).avg,maxSVI:stats(a4SviVals).max,minSVI:stats(a4SviVals).min,avgSVI:stats(a4SviVals).avg};
  return { status:'ok', data: zones };
}

/* ════════════════════════════════════════════════════════════════
   GET IPAL CHART
════════════════════════════════════════════════════════════════ */
function getIPALChart(date) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_IPAL);
  if (!sheet) return { status:'ok', data:{ labels:[], zones:{} } };
  const allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { status:'ok', data:{ labels:[], zones:{} } };
  const rows = allData.slice(1);
  const targetDate = date || getTodayStr();
  const dayRows = rows.filter(r => { const ts=r[0]; if(!ts) return false; const d=ts instanceof Date?ts:new Date(ts); return formatDateStr(d)===targetDate; });
  const dataRows = dayRows.length > 0 ? dayRows : rows.slice(-20);
  const labels = dataRows.map(r => { const ts=r[0] instanceof Date?r[0]:new Date(r[0]); return ts.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}); });
  const zones = {
    inlet:   {ph:[],suhu:[],flowmeter:dataRows.map(r=>parseFloat(r[5])||0),debit:dataRows.map(r=>parseFloat(r[6])||0)},
    outlet:  {ph:[],suhu:[],flowmeter:dataRows.map(r=>parseFloat(r[7])||0),debit:dataRows.map(r=>parseFloat(r[8])||0)},
    ras:     {ph:[],suhu:[],flowmeter:dataRows.map(r=>parseFloat(r[9])||0),debit:dataRows.map(r=>parseFloat(r[10])||0)},
    recycle: {ph:[],suhu:[],flowmeter:dataRows.map(r=>parseFloat(r[11])||0),debit:dataRows.map(r=>parseFloat(r[12])||0)},
    ekual2:  {ph:dataRows.map(r=>parseFloat(r[13])||0),suhu:dataRows.map(r=>parseFloat(r[14])||0)},
    anaerob: {ph:dataRows.map(r=>parseFloat(r[15])||0),suhu:dataRows.map(r=>parseFloat(r[16])||0)},
    aerasi1: {ph:dataRows.map(r=>parseFloat(r[17])||0),suhu:dataRows.map(r=>parseFloat(r[18])||0),svi30:dataRows.map(r=>parseFloat(r[19])||0)},
    aerasi2: {ph:dataRows.map(r=>parseFloat(r[20])||0),suhu:dataRows.map(r=>parseFloat(r[21])||0),svi30:dataRows.map(r=>parseFloat(r[22])||0)},
    aerasi4: {ph:dataRows.map(r=>parseFloat(r[23])||0),suhu:dataRows.map(r=>parseFloat(r[24])||0),svi30:dataRows.map(r=>parseFloat(r[25])||0)},
  };
  return { status:'ok', data:{ labels, zones } };
}

/* ════════════════════════════════════════════════════════════════
   GET IPAL HISTORY
════════════════════════════════════════════════════════════════ */
function getIPALHistory() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_IPAL);
  if (!sheet) return { status:'ok', data:[] };
  const allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { status:'ok', data:[] };
  /* Ambil 100 data terbaru, tampilkan paling baru dulu */
  const rows = allData.slice(1).slice(-100).reverse();
  const data = rows.map(r => ({
    timestamp:          formatTimestamp(r[0]),
    namaTeknisi:        String(r[3]||''),
    nikTeknisi:         String(r[4]||''),
    inletDebit:         parseFloat(r[6])  ||0,
    outletDebit:        parseFloat(r[8])  ||0,
    eq2Ph:              parseFloat(r[13]) ||0,
    eq2Suhu:            parseFloat(r[14]) ||0,
    anarobPh:           parseFloat(r[15]) ||0,
    anarobSuhu:         parseFloat(r[16]) ||0,
    aerasi1Ph:          parseFloat(r[17]) ||0,
    aerasi1Suhu:        parseFloat(r[18]) ||0,
    aerasi1Svi30:       parseFloat(r[19]) ||0,
    aerasi2Ph:          parseFloat(r[20]) ||0,
    aerasi2Suhu:        parseFloat(r[21]) ||0,
    aerasi2Svi30:       parseFloat(r[22]) ||0,
    aerasi4Ph:          parseFloat(r[23]) ||0,
    aerasi4Suhu:        parseFloat(r[24]) ||0,
    aerasi4Svi30:       parseFloat(r[25]) ||0,
    keteranganTambahan: String(r[26]||''),
    /* r[27] = kolom 28 = URL plain text langsung dari appendRow — tidak di-overwrite RichText */
    fotoSviUrl:         normalizeGDriveUrl(String(r[27]||'')),
    status:             String(r[28]||'Normal'),
  }));
  return { status:'ok', data };
}

/* ════════════════════════════════════════════════════════════════
   GET AC STATS
════════════════════════════════════════════════════════════════ */
function getACStats(period) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_AC);
  if (!sheet) return { status:'ok', data:{ totalReports:0, berhasil:0, kambuh:0, byUnit:{}, byType:{}, byPenyebab:{}, byAction:{}, timeline:[] } };
  const allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { status:'ok', data:{ totalReports:0, berhasil:0, kambuh:0, byUnit:{}, byType:{}, byPenyebab:{}, byAction:{}, timeline:[] } };
  const rows = allData.slice(1);
  const filteredRows = filterByPeriod(rows, 0, period);
  const byUnit={}, byType={}, byPenyebab={}, byAction={};
  let berhasil=0, kambuhCount=0;
  filteredRows.forEach(r => {
    const unit=String(r[5]||''), jenis=String(r[6]||''), penyebab=String(r[8]||''), tindakan=String(r[11]||''), kambuh=String(r[14]||'');
    if(unit)    byUnit[unit]        =(byUnit[unit]    ||0)+1;
    if(jenis)   byType[jenis]       =(byType[jenis]   ||0)+1;
    if(penyebab)byPenyebab[penyebab]=(byPenyebab[penyebab]||0)+1;
    if(tindakan)byAction[tindakan]  =(byAction[tindakan]||0)+1;
    kambuh==='Ya'?kambuhCount++:berhasil++;
  });
  const timeline = buildTimeline(filteredRows, 0, period);
  return { status:'ok', data:{ totalReports:filteredRows.length, berhasil, kambuh:kambuhCount, byUnit, byType, byPenyebab, byAction, timeline } };
}

/* ════════════════════════════════════════════════════════════════
   GET AC HISTORY
════════════════════════════════════════════════════════════════ */
function getACHistory(period, unit) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_AC);
  if (!sheet) return { status:'ok', data:[] };
  const lastRow = sheet.getLastRow();
  const lastCol = Math.max(sheet.getLastColumn(), 17); // minimal 17 kolom agar cek kolom P & Q
  if (lastRow < 2) return { status:'ok', data:[] };

  /* Ambil nilai teks biasa untuk semua kolom */
  const allData = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  /* Ambil RichText untuk kolom 11 (K=fotoRusak) dan 14 (N=fotoFix).
     Data lama bisa menyimpan URL sebagai RichText hyperlink sehingga
     getValues() hanya mengembalikan display text, bukan URL aslinya. */
  const numDataRows = lastRow - 1;
  const rtRusakAll = sheet.getRange(2, 16, numDataRows, 1).getRichTextValues();
  const rtFixAll   = sheet.getRange(2, 17, numDataRows, 1).getRichTextValues();

  /* Ekstrak URL dari RichText cell */
  function extractRtUrl(rtRow) {
    try {
      const rt = rtRow[0];
      if (!rt) return '';
      /* Coba via getRuns() — lebih reliable untuk hyperlink parsial */
      if (rt.getRuns) {
        const runs = rt.getRuns();
        for (const run of runs) {
          const link = run.getLinkUrl ? run.getLinkUrl() : null;
          if (link && link.startsWith('http')) return link;
        }
      }
      /* Fallback: getLinkUrl() langsung */
      const direct = rt.getLinkUrl ? rt.getLinkUrl() : null;
      if (direct && direct.startsWith('http')) return direct;
    } catch(e) {}
    return '';
  }

  /* Tandai setiap baris dengan origIdx agar bisa lookup RichText setelah filter */
  let rows = allData.slice(1).map((r, i) => ({ r, origIdx: i }));

  /* Filter by period — gunakan filterByPeriod pada array r saja, lalu match back ke index */
  let filteredRows = rows;
  if (period && period !== 'all') {
    const rOnly = rows.map(({r}) => r);
    const filteredROnly = filterByPeriod(rOnly, 0, period);
    const filteredIndices = new Set();
    let fi = 0;
    for (let i = 0; i < rOnly.length && fi < filteredROnly.length; i++) {
      if (rOnly[i] === filteredROnly[fi]) { filteredIndices.add(i); fi++; }
    }
    filteredRows = rows.filter((_, i) => filteredIndices.has(i));
  }
  if (unit) rows = rows.filter(({ r }) => String(r[5]||'').includes(unit));

  /* Ambil 100 data terbaru, tampilkan paling baru dulu */
  rows = rows.slice(-100).reverse();

  const data = rows.map(({ r, origIdx }) => {
    /* Prioritas URL foto (dari yang paling reliable):
       1. Plain text di kolom 11/14 (data baru — appendRow langsung simpan URL)
       2. URL dari RichText hyperlink di kolom 16/17 (kolom P/Q — display link terpisah)
       3. Plain text di kolom 16/17 (versi peralihan) */
    const plainRusak   = normalizeGDriveUrl(String(r[10]||''));
    const rtRusakUrl   = normalizeGDriveUrl(extractRtUrl(rtRusakAll[origIdx]));
    const col16Url     = normalizeGDriveUrl(String(r[15]||''));
    const resolvedFotoRusakUrl = plainRusak || rtRusakUrl || col16Url;

    const plainFix     = normalizeGDriveUrl(String(r[13]||''));
    const rtFixUrl     = normalizeGDriveUrl(extractRtUrl(rtFixAll[origIdx]));
    const col17Url     = normalizeGDriveUrl(String(r[16]||''));
    const resolvedFotoFixUrl = plainFix || rtFixUrl || col17Url;

    return {
      timestamp:          formatTimestamp(r[0]),
      namaTeknisi:        String(r[3]||''),
      nikTeknisi:         String(r[4]||''),
      unitAC:             String(r[5]||''),
      jenisGangguan:      String(r[6]||''),
      waktuMulaiRusak:    String(r[7]||''),
      penyebabKerusakan:  String(r[8]||''),
      deskripsiRusak:     String(r[9]||''),
      fotoRusakUrl:       resolvedFotoRusakUrl,
      tindakan:           String(r[11]||''),
      deskripsiPerbaikan: String(r[12]||''),
      fotoFixUrl:         resolvedFotoFixUrl,
      kambuh:             String(r[14]||''),
    };
  });
  return { status:'ok', data };
}

/* ════════════════════════════════════════════════════════════════
   GET OWN HISTORY
════════════════════════════════════════════════════════════════ */
function getOwnHistory(role, nik) {
  if (role==='teknisi-ipal'||role==='supervisor-ipal') {
    const res = getIPALHistory();
    if (nik && role==='teknisi-ipal') res.data = res.data.filter(d=>d.nikTeknisi===nik);
    return res;
  } else {
    const res = getACHistory('all','');
    if (nik && role==='teknisi-ac') res.data = res.data.filter(d=>d.nikTeknisi===nik);
    return res;
  }
}

/* ════════════════════════════════════════════════════════════════
   PM STATS — Statistik PM untuk dashboard
════════════════════════════════════════════════════════════════ */
function getPMStats() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const today = getTodayStr();
  const nowDate = new Date();
  const thisMonth = nowDate.getMonth();
  const thisYear  = nowDate.getFullYear();

  /* Hitung dari PM Schedules sheet langsung (pakai kolom Status) */
  const schedSheet = ss.getSheetByName(SHEET_PM_SCHED);
  let todayTotal = 0, todayDone = 0;
  if (schedSheet && schedSheet.getLastRow() > 1) {
    const schedData = schedSheet.getDataRange().getValues().slice(1);
    const todayRows = schedData.filter(r => String(r[2]||'') === today);
    todayTotal = todayRows.length;
    todayDone  = todayRows.filter(r => String(r[4]||'').trim() === 'Sudah').length;
  }

  /* Hitung PM selesai bulan ini dari PM Schedules (status = Sudah) */
  let monthDone = 0;
  if (schedSheet && schedSheet.getLastRow() > 1) {
    const allSchedData = schedSheet.getDataRange().getValues().slice(1);
    allSchedData.forEach(r => {
      const tgl = String(r[2] || '');
      if (!tgl) return;
      const d = new Date(tgl + 'T00:00:00');
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        if (String(r[4] || '').trim() === 'Sudah') monthDone++;
      }
    });
  }

  /* Hitung AC berhasil diperbaiki bulan ini dari sheet Maintenance AC (tidak kambuh) */
  const acSheet = ss.getSheetByName(SHEET_AC);
  let monthFixed = 0;
  if (acSheet && acSheet.getLastRow() > 1) {
    const acData = acSheet.getDataRange().getValues().slice(1);
    acData.forEach(r => {
      const ts = r[0];
      if (!ts) return;
      const d = ts instanceof Date ? ts : new Date(ts);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        const kambuh = String(r[14] || '').toLowerCase();
        if (kambuh !== 'ya') monthFixed++;
      }
    });
  }

  return { status:'ok', data: { todayTotal, todayDone, monthDone, monthFixed } };
}

/* ════════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
════════════════════════════════════════════════════════════════ */
function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}
function ensureIPALHeader(sheet) {
  if (sheet.getLastRow()===0||sheet.getRange(1,1).getValue()==='') {
    sheet.getRange(1,1,1,30).setValues([['Timestamp Sistem','Tanggal','Waktu','Nama Teknisi','NIK','Inlet Flowmeter','Inlet Debit (m3)','Outlet Flowmeter','Outlet Debit (m3)','RAS Flowmeter','RAS Debit (m3)','Recycle Flowmeter','Recycle Debit (m3)','pH Ekualisasi 2','Suhu Ekualisasi 2 (°C)','pH Anaerob','Suhu Anaerob (°C)','pH Aerasi 1','Suhu Aerasi 1 (°C)','SVI30 Aerasi 1 (mL/g)','pH Aerasi 2','Suhu Aerasi 2 (°C)','SVI30 Aerasi 2 (mL/g)','pH Aerasi 4','Suhu Aerasi 4 (°C)','SVI30 Aerasi 4 (mL/g)','Keterangan Tambahan','URL Foto SVI30','Status','Link Foto SVI30']]);
    sheet.getRange(1,1,1,30).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}
function ensureACHeader(sheet) {
  if (sheet.getLastRow()===0||sheet.getRange(1,1).getValue()==='') {
    sheet.getRange(1,1,1,17).setValues([['Timestamp Sistem','Tanggal','Waktu','Nama Teknisi','NIK','Unit AC','Jenis Gangguan','Waktu Mulai Kerusakan','Penyebab Kerusakan','Deskripsi Kerusakan','URL Foto Kerusakan','Tindakan Perbaikan','Deskripsi Perbaikan','URL Foto Setelah Fix','Gangguan Kambuh','Link Foto Kerusakan','Link Foto Setelah Fix']]);
    sheet.getRange(1,1,1,17).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}
function hitungStatusIPAL(p) {
  if (p.keteranganTambahan && String(p.keteranganTambahan).trim().length>0) return 'Perlu Perhatian';
  const phNonAnaerob = [parseFloat(p.eq2Ph), parseFloat(p.aer1Ph), parseFloat(p.aer2Ph), parseFloat(p.aer4Ph)];
  for (const ph of phNonAnaerob) { if (!isNaN(ph)&&(ph>7||ph<6)) return 'Perlu Perhatian'; }
  const anrbPh = parseFloat(p.anrbPh);
  if (!isNaN(anrbPh)&&(anrbPh<4||anrbPh>6)) return 'Perlu Perhatian';
  const suhu = [parseFloat(p.eq2Suhu),parseFloat(p.anrbSuhu),parseFloat(p.aer1Suhu),parseFloat(p.aer2Suhu),parseFloat(p.aer4Suhu)];
  for (const s of suhu) { if (!isNaN(s)&&s>40) return 'Perlu Perhatian'; }
  const svi = [parseFloat(p.aer1Svi),parseFloat(p.aer2Svi),parseFloat(p.aer4Svi)];
  for (const sv of svi) { if (!isNaN(sv)&&sv>50) return 'Perlu Perhatian'; }
  return 'Normal';
}
/* Normalisasi nilai tanggal dari Sheets → selalu "YYYY-MM-DD"
   Google Sheets kadang mengembalikan Date object atau string dengan format beragam. */
function normalizeTanggalGAS(val) {
  if (!val) return '';
  // Jika berupa Date object (paling umum dari Sheets)
  if (val instanceof Date) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const s = String(val).trim();
  // Sudah format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // Format DD/MM/YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) return dmy[3] + '-' + dmy[2].padStart(2,'0') + '-' + dmy[1].padStart(2,'0');
  // Fallback: parse sebagai Date
  try {
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
  } catch(e) {}
  return s;
}

function getTodayStr() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}
function formatDateStr(d) {
  return Utilities.formatDate(d instanceof Date?d:new Date(d), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}
function formatTimestamp(val) {
  if (!val) return '';
  const d = val instanceof Date ? val : new Date(val);
  return d.toLocaleString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
}
function filterByPeriod(rows, tsColIdx, period) {
  const now=new Date(), cutoff=new Date();
  switch(period){
    case 'daily':   cutoff.setHours(0,0,0,0);             break;
    case 'weekly':  cutoff.setDate(now.getDate()-7);       break;
    case 'monthly': cutoff.setMonth(now.getMonth()-1);     break;
    case 'yearly':  cutoff.setFullYear(now.getFullYear()-1);break;
    default:        return rows;
  }
  return rows.filter(r=>{const ts=r[tsColIdx];if(!ts)return false;const d=ts instanceof Date?ts:new Date(ts);return d>=cutoff;});
}
function buildTimeline(rows, tsColIdx, period) {
  const counts={};
  rows.forEach(r=>{
    const ts=r[tsColIdx];if(!ts)return;const d=ts instanceof Date?ts:new Date(ts);let key='';
    switch(period){
      case 'daily':   key=d.getHours()+':00';break;
      case 'weekly':  key=['Min','Sen','Sel','Rab','Kam','Jum','Sab'][d.getDay()];break;
      case 'monthly': key=String(d.getDate());break;
      case 'yearly':  key=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'][d.getMonth()];break;
      default:        key=String(d.getDate())+'/'+(d.getMonth()+1);break;
    }
    counts[key]=(counts[key]||0)+1;
  });
  return Object.entries(counts).map(([label,count])=>({label,count}));
}

/* ════════════════════════════════════════════════════════════════
   FLOW BASIS
════════════════════════════════════════════════════════════════ */
const SHEET_FLOW_BASIS = 'Flow Basis';
function getFlowBasis() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_FLOW_BASIS);
  ensureFlowBasisHeader(sheet);
  if (sheet.getLastRow()<2) return{status:'ok',data:{inlet:0,outlet:0,ras:0,recycle:0,updatedBy:'',updatedAt:''}};
  const row = sheet.getRange(2,1,1,6).getValues()[0];
  return{status:'ok',data:{updatedAt:row[0]?String(row[0]):'',inlet:parseFloat(row[1])||0,outlet:parseFloat(row[2])||0,ras:parseFloat(row[3])||0,recycle:parseFloat(row[4])||0,updatedBy:String(row[5]||'')}};
}
function setFlowBasis(p) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_FLOW_BASIS);
  ensureFlowBasisHeader(sheet);
  const row=[new Date(),parseFloat(p.inlet)||0,parseFloat(p.outlet)||0,parseFloat(p.ras)||0,parseFloat(p.recycle)||0,p.updatedBy||''];
  if(sheet.getLastRow()<2) sheet.appendRow(row);
  else sheet.getRange(2,1,1,6).setValues([row]);
  return{status:'ok',message:'Basis flowmeter diperbarui.'};
}
function ensureFlowBasisHeader(sheet) {
  if(sheet.getLastRow()===0||sheet.getRange(1,1).getValue()===''){
    sheet.getRange(1,1,1,6).setValues([['Timestamp Update','Inlet (m³)','Outlet (m³)','RAS (m³)','Recycle (m³)','Diperbarui Oleh']]);
    sheet.getRange(1,1,1,6).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}
