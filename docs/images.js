// Görsel manifesti. Dosyaları docs/img/<kategori>/<id>.jpg olarak koy (png de olur: "file" alanını değiştir).
// cat: karakter (oyuncu karakterleri, kendi kartında her zaman görünür) · npc · mekan · olay
// Oyuncular bir görseli ancak DM "Oyunculara göster" dedikten sonra Görseller sekmesinde görür.
window.IMAGES = [
  // --- Oyuncu karakterleri ---
  { id: "pc-yigit", cat: "karakter", owner: "yigit", title: "Yiğit · Leydi Şans'ın Kumarbazı", file: "img/karakterler/yigit.jpg", caption: "Boynuzlu kumarbaz; kemik zarlar, kül rengi gülümseme." },
  { id: "pc-bilge", cat: "karakter", owner: "bilge", title: "Bilge · Orman Cadısı", file: "img/karakterler/bilge.jpg", caption: "Tavuk bacaklı barakanın sahibi; kazan, orak, şişeler." },
  { id: "pc-beste", cat: "karakter", owner: "beste", title: "Beste · Yüzyılların Büyücüsü", file: "img/karakterler/beste.jpg", caption: "Bin yıllık elf; grimoire koleksiyonu, mum lekeli kitap." },
  { id: "pc-elif", cat: "karakter", owner: "elif", title: "Elif · Orman Perisi", file: "img/karakterler/elif.jpg", caption: "Ruh feneri taşıyan peri; iki sureti var." },
  { id: "pc-elif-dark", cat: "karakter", owner: "elif", title: "Elif · Karanlık Peri (3 ruh)", file: "img/karakterler/elif-karanlik.jpg", caption: "Üç ruh taşıdığında aldığı hal." },
  { id: "pc-grup", cat: "karakter", title: "Dört Kaos Ajanı", file: "img/karakterler/grup.jpg", caption: "Glamour düştüğünde birbirlerini ilk kez gördükleri an." },

  // --- NPC'ler ---
  { id: "npc-sis-ana", cat: "npc", title: "Sis Ana", file: "img/npc/sis-ana.jpg", caption: "Aynada beliren, yüzü sürekli değişen kadın." },
  { id: "npc-vera", cat: "npc", title: "Usta Vera", file: "img/npc/vera.jpg", caption: "Forger; mum kokulu, parmak uçları sarı. Ölü." },
  { id: "npc-beatrice", cat: "npc", title: "Beatrice", file: "img/npc/beatrice.jpg", caption: "Yargıcın karısı; soluk, nazik, perdeler kapalı." },
  { id: "npc-nora", cat: "npc", title: "Nora · Kül Dili", file: "img/npc/nora.jpg", caption: "Gerçek sureti: yanık izli yüz, kül rengi gözler." },
  { id: "npc-albert", cat: "npc", title: "Yargıç Albert", file: "img/npc/albert.jpg", caption: "Cadı mahkemesinin başkanı; titreyen eller." },
  { id: "npc-eli", cat: "npc", title: "Papaz Eli", file: "img/npc/eli.jpg", caption: "Vaazda alev alev, tek başınayken bitkin." },
  { id: "npc-hob", cat: "npc", title: "Hob", file: "img/npc/hob.jpg", caption: "Değirmenci; un tozlu, bir gözü sulu." },
  { id: "npc-ciraklar", cat: "npc", title: "Tilda, Sef ve Oda", file: "img/npc/ciraklar.jpg", caption: "Vera'nın üç çırağı; mum çemberinde." },
  { id: "npc-marta", cat: "npc", title: "Marta", file: "img/npc/marta.jpg", caption: "Asılı Adam hanının sahibi." },
  { id: "npc-pip", cat: "npc", title: "Pip", file: "img/npc/pip.jpg", caption: "Çatılarda yaşayan çocuk; kuzgun besler." },
  { id: "npc-mum", cat: "npc", title: "Mum · kuzgun", file: "img/npc/kuzgun-mum.jpg", caption: "Vera'nın kuzgunu; kanadı mum damlalı." },
  { id: "npc-mum-bekcisi", cat: "npc", title: "Mum Bekçisi", file: "img/npc/mum-bekcisi.jpg", caption: "Balmumu beden; göğsünde yanan fitil." },
  { id: "npc-kul-hanimlar", cat: "npc", title: "Kül Hanımlar", file: "img/npc/kul-hanimlar.jpg", caption: "Dokuz yanık kadının ruhu." },
  { id: "npc-cete", cat: "npc", title: "Cadı avcısı çetesi", file: "img/npc/cete.jpg", caption: "Meşaleli kalabalık, önde papaz." },

  // --- Mekânlar ---
  { id: "mekan-golgekuyu", cat: "mekan", title: "Gölgekuyu", file: "img/mekan/golgekuyu.jpg", caption: "Kasaba; her kapıda nazar demiri, tepede darağacı." },
  { id: "mekan-mumhane", cat: "mekan", title: "Mumhane", file: "img/mekan/mumhane.jpg", caption: "Vera'nın atölyesi; bataklığa bakar." },
  { id: "mekan-mumhane-ic", cat: "mekan", title: "Mumhane · içerisi", file: "img/mekan/mumhane-ic.jpg", caption: "Dökme masası, mum gölü, yarım ritüel." },
  { id: "mekan-han", cat: "mekan", title: "Asılı Adam hanı", file: "img/mekan/han.jpg", caption: "Ocağın üstünde Agnes'in resmi." },
  { id: "mekan-kilise", cat: "mekan", title: "Kilise", file: "img/mekan/kilise.jpg", caption: "Soğuk, boş, kürsüde tek bir adam." },
  { id: "mekan-degirmen", cat: "mekan", title: "Değirmen", file: "img/mekan/degirmen.jpg", caption: "Taş dönüyor ama un yok." },
  { id: "mekan-yargic-evi", cat: "mekan", title: "Yargıç evi", file: "img/mekan/yargic-evi.jpg", caption: "Perdeler kapalı; bahçede köpekler." },
  { id: "mekan-mahzen", cat: "mekan", title: "Mahzen", file: "img/mekan/mahzen.jpg", caption: "Şarap fıçıları; biri boş değil." },
  { id: "mekan-baraka", cat: "mekan", title: "Tavuk bacaklı baraka", file: "img/mekan/baraka.jpg", caption: "Gece kayanın üstüne çömelmiş." },
  { id: "mekan-tepe", cat: "mekan", title: "Darağacı tepesi", file: "img/mekan/daragaci-tepesi.jpg", caption: "Dokuz yanık direk, ortada taş sunak." },
  { id: "mekan-bataklik", cat: "mekan", title: "Bataklık", file: "img/mekan/bataklik.jpg", caption: "Sıra hâlinde yürüyen mum ışıkları." },

  // --- Kilit anlar ---
  { id: "olay-kuzgunlar", cat: "olay", title: "Dört kuzgun", file: "img/olay/dort-kuzgun.jpg", caption: "Dört yere aynı mektup." },
  { id: "olay-ayna", cat: "olay", title: "Aynadaki Sis Ana", file: "img/olay/aynadaki-sis-ana.jpg", caption: "Kırık aynada sis toplanıyor." },
  { id: "olay-ceset", cat: "olay", title: "Cesetle konuşma", file: "img/olay/cesetle-konusma.jpg", caption: "Tütsü dumanı, beş soru." },
  { id: "olay-kuzgun-taklit", cat: "olay", title: "Kuzgun konuşuyor", file: "img/olay/kuzgun-konusuyor.jpg", caption: "'Artık kimse gizlice yanmayacak.'" },
  { id: "olay-glamour-duser", cat: "olay", title: "Glamour düşer", file: "img/olay/glamour-duser.jpg", caption: "İlk savaş; dördü birbirini olduğu gibi görür." },
  { id: "olay-cirak-cemberi", cat: "olay", title: "Çırakların mum çemberi", file: "img/olay/cirak-cemberi.jpg", caption: "'Kimsiniz?'" },
  { id: "olay-fici", cat: "olay", title: "Mahzendeki fıçı", file: "img/olay/mahzendeki-fici.jpg", caption: "Gerçek Beatrice." },
  { id: "olay-cay", cat: "olay", title: "Barakada doğruluk çayı", file: "img/olay/dogruluk-cayi.jpg", caption: "Yargıç çay içiyor; baraka dinliyor." },
  { id: "olay-cete", cat: "olay", title: "Kasabada kaçış", file: "img/olay/kasabada-kacis.jpg", caption: "Meşaleli çete dar sokaklarda." },
  { id: "olay-kul-hanimlar", cat: "olay", title: "Kül Hanımlar belirir", file: "img/olay/kul-hanimlar-belirir.jpg", caption: "Dokuz direğin dibinde dokuz siluet." },
  { id: "olay-ay-isigi", cat: "olay", title: "Ay Işığı · maske düşer", file: "img/olay/maske-duser.jpg", caption: "Beatrice'in yüzü akar, Nora görünür." },
  { id: "olay-bahis", cat: "olay", title: "Leydi'nin bahsi", file: "img/olay/leydinin-bahsi.jpg", caption: "Savaşın ortasında tek zar." },
  { id: "olay-muhur-kirilir", cat: "olay", title: "Mühür kırılır", file: "img/olay/muhur-kirilir.jpg", caption: "Perde yırtılır; dünya görür." },
  { id: "olay-muhur-doner", cat: "olay", title: "Mühür coven'a döner", file: "img/olay/muhur-doner.jpg", caption: "Sis Ana'nın soğuk teşekkürü." },
  { id: "olay-yeni-forger", cat: "olay", title: "Yeni Forger", file: "img/olay/yeni-forger.jpg", caption: "Bilge mührü ayın önünde tutar." }
];
