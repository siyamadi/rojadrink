const STORAGE_KEY='kopi_katalog_data_v2';
const LEGACY_KEY='kopi_katalog_data';
const SETTINGS_KEY='kopi_restaurant_settings_v1';
let restaurantSettings={name:'KOPI ATELIER',subtitle:'MENU & RECIPE LIBRARY'};
let draftImage='';
const starterData=[
  {
    "brand": "Kopi Tuku",
    "kategori": "Kopi Susu (Signature)",
    "nama": "Es Kopi Susu Tetangga",
    "harga": "22.000",
    "deskripsi": "Menu legendaris pelopor es kopi susu gula aren. Perpaduan espresso blend, susu segar, krimer, dan sirup gula aren khas Tuku yang gurih dan creamy.",
    "bahan": "1 shot espresso (30ml) / 1.5 sdt kopi instan pekat tanpa ampas diseduh air panas; 120ml susu cair UHT Full Cream; 20ml krimer cair / 1 sdm krimer bubuk dilarutkan; 25ml sirup gula aren kental asli; Es batu secukupnya.",
    "cara": "1. Larutkan sirup gula aren di dasar gelas. 2. Masukkan es batu hingga penuh. 3. Tuang susu segar cair dan krimer secara perlahan agar menyatu. 4. Tuangkan espresso hangat di lapisan paling atas. Aduk rata sebelum dinikmati."
  },
  {
    "brand": "Kopi Tuku",
    "kategori": "Kopi Klasik",
    "nama": "Es Kopi Hitam",
    "harga": "20.000",
    "deskripsi": "Kopi hitam dingin klasik (Americano/Long Black) menggunakan biji kopi house blend Tuku.",
    "bahan": "2 shot espresso (60ml) atau 2 sdt kopi bubuk instan berkualitas; 150ml air mineral dingin; es batu secukupnya.",
    "cara": "1. Siapkan es batu di dalam gelas. 2. Tuangkan air mineral dingin. 3. Masukkan espresso ke dalam gelas secara perlahan."
  },
  {
    "brand": "Tomoro Coffee",
    "kategori": "Tomoro Signature",
    "nama": "Tomoro Aren Latte",
    "harga": "22.000",
    "deskripsi": "Espresso, Susu Cair (UHT), Sirup Gula Aren Premium, Es Batu dengan takaran pas.",
    "bahan": "1 shot Espresso (30ml); 120ml Susu UHT Full Cream; 20-25ml Sirup Gula Aren Kental; Es batu secukupnya.",
    "cara": "1. Tuang sirup gula aren ke dasar gelas. 2. Masukkan es batu hingga penuh. 3. Tuang susu cair UHT secara perlahan. 4. Tuangkan shot espresso di bagian paling atas."
  },
  {
    "brand": "Janji Jiwa",
    "kategori": "Seri Kopi",
    "nama": "Signature Kopi Susu",
    "harga": "24.000",
    "deskripsi": "Kopi espresso dengan susu segar dan gula aren murni khas Janji Jiwa.",
    "bahan": "1 shot Espresso (30 ml); 120 ml Susu Cair UHT Full Cream; 25-30 ml Sirup Gula Aren cair; Es batu.",
    "cara": "1. Tuang sirup gula aren di dasar. 2. Masukkan es batu. 3. Tuangkan susu secara perlahan. 4. Tambahkan espresso di paling atas."
  },
  {
    "brand": "Kopi Kenangan",
    "kategori": "Coffee Series",
    "nama": "Kopi Kenangan Mantan",
    "harga": "22.000",
    "deskripsi": "Kopi susu espresso dengan gula aren murni khas Kenangan.",
    "bahan": "1 shot Espresso; 120 ml Susu Cair Segar; 25-30 ml Sirup Gula Aren murni; Es batu.",
    "cara": "1. Tuang gula aren di dasar gelas. 2. Masukkan es batu. 3. Tuang susu cair segar perlahan. 4. Tambahkan shot espresso di atasnya."
  },
  {
    "brand": "Starbucks",
    "kategori": "Coffee & Espresso",
    "nama": "Caramel Macchiato",
    "harga": "62.000",
    "deskripsi": "Espresso dengan susu vanila creamy dan siraman saus caramel di atasnya.",
    "bahan": "1-2 shot Espresso; 200 ml Susu Cair Full Cream; 1 sdm Sirup Vanila; Saus Caramel secukupnya.",
    "cara": "1. Tuang sirup vanila di dasar. 2. Masukkan es batu. 3. Tuangkan susu cair full cream. 4. Masukkan shot espresso hangat. 5. Hiasi saus caramel bentuk jaring."
  }
];
let menuList=[];let selectedBrand='All';let activeIndex=null;let editingIndex=null;let toastTimer;
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rupiah=value=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(String(value??0).replace(/[^\d]/g,''))||0);
function normalize(item){return {brand:String(item.brand||'Brand lainnya'),kategori:String(item.kategori||'Tanpa kategori'),nama:String(item.nama||'Menu tanpa nama'),harga:String(item.harga??'0').replace(/[^\d]/g,''),deskripsi:String(item.deskripsi||''),bahan:String(item.bahan||''),cara:String(item.cara||''),gambar:String(item.gambar||item.image||''),hppBahan:num(item.hppBahan),kemasan:num(item.kemasan),biayaLain:num(item.biayaLain),marginTarget:item.marginTarget===''||item.marginTarget==null?35:num(item.marginTarget),biayaOnline:item.biayaOnline===''||item.biayaOnline==null?20:num(item.biayaOnline)};}
function num(v){const n=Number(String(v??0).replace(/[^0-9.-]/g,''));return Number.isFinite(n)?Math.max(0,n):0}
function pricing(m){const hpp=num(m.hppBahan)+num(m.kemasan)+num(m.biayaLain),margin=Math.min(90,num(m.marginTarget))/100,fee=Math.min(80,num(m.biayaOnline))/100;const offline=margin>=1?0:hpp/(1-margin);const online=fee>=1?0:offline/(1-fee);const round=x=>Math.ceil(x/500)*500;return {hpp,offline:round(offline),online:round(online),margin,fee};}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(menuList));return true}catch(err){showToast('Penyimpanan penuh atau diblokir browser. Ekspor data sebagai cadangan.');return false}}
function loadSettings(){try{const saved=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}');restaurantSettings={name:String(saved.name||'KOPI ATELIER'),subtitle:String(saved.subtitle||'MENU & RECIPE LIBRARY')};}catch(e){}applySettings()}
function applySettings(){document.title=restaurantSettings.name+' — Katalog Menu & Resep';$('restaurantName').textContent=restaurantSettings.name;$('restaurantSubtitle').textContent=restaurantSettings.subtitle;$('restaurantNameInput').value=restaurantSettings.name;$('restaurantSubtitleInput').value=restaurantSettings.subtitle;document.querySelector('footer span').textContent='☕ '+restaurantSettings.name}
function loadData(){loadSettings();try{const current=localStorage.getItem(STORAGE_KEY);const legacy=localStorage.getItem(LEGACY_KEY);const parsed=current?JSON.parse(current):legacy?JSON.parse(legacy):starterData;if(!Array.isArray(parsed))throw Error('Format data tidak valid');menuList=parsed.map(normalize);persist()}catch(err){menuList=starterData.map(normalize);persist();showToast('Data sebelumnya tidak terbaca. Data contoh dimuat kembali.') }renderAll()}
function showToast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800)}
function renderAll(){renderStats();renderFilters();renderCards()}
function renderStats(){$('totalCount').textContent=menuList.length;$('brandCount').textContent=new Set(menuList.map(x=>x.brand)).size;$('categoryCount').textContent=new Set(menuList.map(x=>x.kategori)).size;$('year').textContent=new Date().getFullYear()}
function renderFilters(){const brands=[...new Set(menuList.map(x=>x.brand))].sort((a,b)=>a.localeCompare(b,'id'));if(selectedBrand!=='All'&&!brands.includes(selectedBrand))selectedBrand='All';$('brandFilters').innerHTML=[{name:'All',label:'Semua menu'},...brands.map(name=>({name,label:name}))].map(x=>`<button class="filter ${selectedBrand===x.name?'active':''}" data-brand="${escapeHTML(x.name)}">${escapeHTML(x.label)}</button>`).join('');$('brandFilters').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{selectedBrand=btn.dataset.brand;renderFilters();renderCards()}));$('formBrand').innerHTML=brands.map(x=>`<option value="${escapeHTML(x)}">${escapeHTML(x)}</option>`).join('')+'<option value="__new">＋ Brand baru…</option>';}
function renderCards(){const query=$('searchInput').value.trim().toLocaleLowerCase('id');const filtered=menuList.map((item,index)=>({item,index})).filter(({item})=>(selectedBrand==='All'||item.brand===selectedBrand)&&[item.nama,item.brand,item.kategori,item.deskripsi].some(v=>v.toLocaleLowerCase('id').includes(query)));$('resultCount').textContent=`${filtered.length} menu`;const grid=$('menuGrid');grid.innerHTML=filtered.map(({item,index})=>`<article class="menu-card" role="button" tabindex="0" data-index="${index}" aria-label="Lihat resep ${escapeHTML(item.nama)}">${item.gambar?`<img class="card-image" src="${item.gambar}" alt="Foto ${escapeHTML(item.nama)}" loading="lazy">`:'<div class="card-image-placeholder">☕</div>'}<div class="card-top"><span class="brand-tag">${escapeHTML(item.brand)}</span><span class="category">${escapeHTML(item.kategori)}</span></div><h3>${escapeHTML(item.nama)}</h3><p>${escapeHTML(item.deskripsi||'Belum ada deskripsi untuk menu ini.')}</p><div class="card-bottom"><span class="price">${rupiah(item.harga)}</span><span class="view-recipe">LIHAT RESEP ↗</span></div></article>`).join('');grid.querySelectorAll('.menu-card').forEach(card=>{card.addEventListener('click',()=>openDetail(Number(card.dataset.index)));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(Number(card.dataset.index))}})});$('emptyState').classList.toggle('hidden',filtered.length!==0);}
function openModal(id){$(id).classList.remove('hidden');document.body.style.overflow='hidden';const focus=$(id).querySelector('button,input,select,textarea');if(focus)focus.focus()}
function closeModals(){$('detailModal').classList.add('hidden');$('formModal').classList.add('hidden');$('settingsModal').classList.add('hidden');document.body.style.overflow='';activeIndex=null;editingIndex=null}
function openDetail(index){if(!menuList[index])return;activeIndex=index;const m=menuList[index];const p=pricing(m);$('detailHpp').textContent=rupiah(p.hpp);$('detailOffline').textContent=rupiah(p.offline);$('detailOnline').textContent=rupiah(p.online);$('detailHppNote').textContent=`Biaya bahan ${rupiah(m.hppBahan)} + kemasan ${rupiah(m.kemasan)} + biaya lain ${rupiah(m.biayaLain)}. Margin target ${m.marginTarget}% dan biaya platform ${m.biayaOnline}%. Harga dibulatkan ke atas per Rp500.`;$('detailImage').src=m.gambar||'';$('detailImage').classList.toggle('hidden',!m.gambar);$('detailBrand').textContent=m.brand;$('detailTitle').textContent=m.nama;$('detailCategory').textContent=m.kategori;$('detailPrice').textContent=rupiah(m.harga);$('detailDesc').textContent=m.deskripsi||'Belum ada deskripsi.';$('detailIngredients').textContent=m.bahan.split(/;|\n/).map(x=>x.trim()).filter(Boolean).map(x=>'• '+x).join('\n')||'Belum diisi.';$('detailSteps').textContent=m.cara.trim()||'Belum diisi.';openModal('detailModal')}
function openForm(index=null){editingIndex=index;const editing=index!==null;const m=editing?menuList[index]:{brand:menuList[0]?.brand||'Kopi Tuku',nama:'',kategori:'',harga:'',deskripsi:'',bahan:'',cara:'',gambar:'',hppBahan:0,kemasan:0,biayaLain:0,marginTarget:35,biayaOnline:20};draftImage=m.gambar||'';renderFilters();$('formTitle').textContent=editing?'Edit menu':'Tambah menu baru';$('formBrand').value=m.brand;$('formNama').value=m.nama;$('formKategori').value=m.kategori;$('formHarga').value=m.harga;$('formDesc').value=m.deskripsi;$('formBahan').value=m.bahan;$('formCara').value=m.cara;$('formHppBahan').value=m.hppBahan||0;$('formKemasan').value=m.kemasan||0;$('formBiayaLain').value=m.biayaLain||0;$('formMargin').value=m.marginTarget??35;$('formFeeOnline').value=m.biayaOnline??20;updateHppPreview();updateImagePreview();$('formImage').value='';openModal('formModal')}
$('formBrand').addEventListener('change',e=>{if(e.target.value==='__new'){const name=prompt('Masukkan nama brand baru:');if(name&&name.trim()){const option=document.createElement('option');option.value=name.trim();option.textContent=name.trim();e.target.insertBefore(option,e.target.querySelector('option[value="__new"]'));e.target.value=name.trim()}else e.target.value=menuList[0]?.brand||''}});
$('menuForm').addEventListener('submit',e=>{e.preventDefault();const item=normalize({brand:$('formBrand').value,nama:$('formNama').value.trim(),kategori:$('formKategori').value.trim(),harga:$('formHarga').value,deskripsi:$('formDesc').value.trim(),bahan:$('formBahan').value.trim(),cara:$('formCara').value.trim(),gambar:draftImage,hppBahan:$('formHppBahan').value,kemasan:$('formKemasan').value,biayaLain:$('formBiayaLain').value,marginTarget:$('formMargin').value,biayaOnline:$('formFeeOnline').value});if(!item.nama||!item.kategori){showToast('Nama menu dan kategori wajib diisi.');return}const wasEditing=editingIndex!==null;if(wasEditing)menuList[editingIndex]=item;else menuList.unshift(item);persist();selectedBrand='All';$('searchInput').value='';closeModals();renderAll();showToast(wasEditing?'Perubahan menu berhasil disimpan.':'Menu berhasil ditambahkan.')});
$('deleteBtn').addEventListener('click',()=>{if(activeIndex===null||!confirm(`Hapus menu "${menuList[activeIndex]?.nama}"?`))return;menuList.splice(activeIndex,1);persist();closeModals();renderAll();showToast('Menu berhasil dihapus.')});
$('editBtn').addEventListener('click',()=>{const index=activeIndex;closeModals();openForm(index)});
$('addBtn').addEventListener('click',()=>openForm());$('searchInput').addEventListener('input',renderCards);$('resetFilter').addEventListener('click',()=>{$('searchInput').value='';selectedBrand='All';renderAll()});
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModals));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModals()});
$('exportBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({app:'Kopi Atelier',version:3,exportedAt:new Date().toISOString(),settings:restaurantSettings,menus:menuList},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`kopi-atelier-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);showToast('Backup data berhasil diunduh.')});
function normalizeHeader(value){return String(value??'').toLowerCase().trim().replace(/[\s_-]+/g,'').replace(/[^a-z0-9]/g,'')}
function rowsFromExcel(workbook){
 const sheetName=workbook.SheetNames[0];if(!sheetName)throw Error('Workbook kosong');
 const raw=XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{defval:'',raw:false});
 const aliases={brand:['brand','merek','merk','namabrand'],nama:['nama','namamenu','menu','produk','namaproduk'],kategori:['kategori','category','jenis'],harga:['harga','price','hargajual'],deskripsi:['deskripsi','keterangan','description'],bahan:['bahan','ingredients','komposisi'],cara:['cara','caramembuat','langkah','resep','steps','instruksi'],hppBahan:['hppbahan','biayabahan','modalbahan','costbahan'],kemasan:['kemasan','biayakemasan'],biayaLain:['biayalain','overhead','biayatambahan'],marginTarget:['margintarget','targetmargin','margin'],biayaOnline:['biayaonline','feeonline','platformfee','komisiononline']};
 return raw.map(row=>{const normalized={};Object.entries(row).forEach(([key,value])=>normalized[normalizeHeader(key)]=value);const item={};for(const [field,names] of Object.entries(aliases)){const key=names.map(normalizeHeader).find(name=>Object.prototype.hasOwnProperty.call(normalized,name));item[field]=key?normalized[key]:'';}return item;}).filter(x=>String(x.nama??'').trim());
}
$('importInput').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 try{
  const ext=file.name.split('.').pop().toLowerCase();let rows,importedSettings=null;
  if(ext==='json'){const parsed=JSON.parse(await file.text());rows=Array.isArray(parsed)?parsed:parsed.menus;if(!Array.isArray(parsed)&&parsed.settings)importedSettings=parsed.settings;}
  else if(['xlsx','xls','csv'].includes(ext)){
   if(typeof XLSX==='undefined')throw Error('Pustaka Excel belum termuat. Periksa koneksi internet lalu muat ulang halaman.');
   const workbook=XLSX.read(await file.arrayBuffer(),{type:'array'});rows=rowsFromExcel(workbook);
  }else throw Error('Format file tidak didukung');
  if(!Array.isArray(rows)||!rows.length)throw Error('Tidak ada data menu. Pastikan baris pertama berisi judul kolom.');
  const cleaned=rows.map(normalize);
  if(!confirm(`Ditemukan ${cleaned.length} menu dari file "${file.name}". Impor akan MENGGANTI seluruh data katalog saat ini. Lanjutkan?`))return;
  menuList=cleaned;if(importedSettings){restaurantSettings={name:String(importedSettings.name||'KOPI ATELIER'),subtitle:String(importedSettings.subtitle||'MENU & RECIPE LIBRARY')};localStorage.setItem(SETTINGS_KEY,JSON.stringify(restaurantSettings));applySettings()}selectedBrand='All';$('searchInput').value='';persist();renderAll();showToast(`${menuList.length} menu berhasil diimpor.`);
 }catch(err){console.error(err);showToast(err.message||'File tidak valid. Periksa format Excel/JSON.');}
 finally{e.target.value=''}
});
function updateHppPreview(){const p=pricing({hppBahan:$('formHppBahan').value,kemasan:$('formKemasan').value,biayaLain:$('formBiayaLain').value,marginTarget:$('formMargin').value,biayaOnline:$('formFeeOnline').value});$('previewHpp').textContent=rupiah(p.hpp);$('previewOffline').textContent=rupiah(p.offline);$('previewOnline').textContent=rupiah(p.online)}
['formHppBahan','formKemasan','formBiayaLain','formMargin','formFeeOnline'].forEach(id=>$(id).addEventListener('input',updateHppPreview));
$('formImage').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){showToast('Pilih file gambar yang valid.');return}if(file.size>12*1024*1024){showToast('Ukuran foto maksimal 12 MB sebelum dikompres.');e.target.value='';return}try{draftImage=await compressImage(file);updateImagePreview();showToast('Foto berhasil disesuaikan dan dikompres.')}catch(err){showToast('Foto gagal diproses. Coba gambar lain.')}});
function compressImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const max=1000,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',0.78))};img.src=reader.result};reader.readAsDataURL(file)})}
function updateImagePreview(){const img=$('imagePreview'),remove=$('removeImageBtn');img.src=draftImage||'';img.classList.toggle('hidden',!draftImage);remove.classList.toggle('hidden',!draftImage)}
$('removeImageBtn').addEventListener('click',()=>{draftImage='';$('formImage').value='';updateImagePreview()});
$('settingsBtn').addEventListener('click',()=>{applySettings();openModal('settingsModal')});$('settingsForm').addEventListener('submit',e=>{e.preventDefault();restaurantSettings={name:$('restaurantNameInput').value.trim()||'KOPI ATELIER',subtitle:$('restaurantSubtitleInput').value.trim()||'MENU & RECIPE LIBRARY'};try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(restaurantSettings));applySettings();$('settingsModal').classList.add('hidden');document.body.style.overflow='';showToast('Nama restoran berhasil diperbarui.')}catch(err){showToast('Pengaturan gagal disimpan.')}});
window.addEventListener('storage',e=>{if(e.key===STORAGE_KEY||e.key===SETTINGS_KEY)loadData()});loadData();
