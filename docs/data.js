// Karakter verileri. Kodları buradan değiştirebilirsin.
// Metinlerde \n satır sonu olarak gösterilir. cost: 0 = sürekli, 1/2 = kaynak.
window.GAME_DATA = {
  dmCode: "KRAKER",
  moonMax: 12,
  characters: [
    {
      id: "yigit",
      player: "Yiğit",
      title: "Leydi Şans'ın Kumarbazı",
      code: "LADY",
      theme: { c1: "#c9a24a", c2: "#8b1e2d", emblem: "dice" },
      race: "Tiefling", cls: "Warlock 3", bg: "Charlatan",
      abilities: { Str: 8, Dex: 13, Con: 14, Int: 13, Wis: 10, Cha: 17 },
      hpMax: 24, ac: 12, acNote: "leather armor", speed: "30 ft", prof: 2,
      saves: [["Str", -1], ["Dex", 1], ["Con", 2], ["Int", 1], ["Wis", 2], ["Cha", 5]],
      skills: [["Deception", 5], ["Sleight of Hand", 3], ["Insight", 2], ["Investigation", 3], ["Perception", 0], ["Stealth", 1], ["Persuasion", 3], ["Intimidation", 3]],
      weapons: [["Dagger", "+3", "1d4+1 piercing", "20 ft fırlatma"], ["Light crossbow", "+3", "1d8+1 piercing", "80 ft"]],
      traits: ["Darkvision 60 ft", "Ateş hasarına direnç (yarı hasar)", "Diller: Common, Infernal"],
      resource: { kind: "omen", name: "Kehanet", max: 5,
        text: "En fazla 5 token. İkisi de senin kaynağın; hiçbiri sana zarar vermez.\n• Beyaz = Leydi'nin Lütfu\n• Kırmızı = Leydi'nin Gazabı\n\nHer yetenek herhangi bir renkten 1 token ister. Harcadığın rengin bonusu:\n• Beyaz harcarsan: 30 ft içindeki bir yoldaş (sen dahil) bir sonraki d20'sine +1d4 ekler.\n• Kırmızı harcarsan: 30 ft içindeki bir düşman bir sonraki d20'sinden -1d4 düşer.\n\nDolum: her short/long rest'te boş slot kadar d20 at: 11+ beyaz, 10- kırmızı.\nOyun içinde: doğal 20 → +1 beyaz, doğal 1 → +1 kırmızı. DM \"Leydi izliyor\" derse bir d20 daha." },
      cantrips: [
        { name: "Hileli Zar", cost: 0, short: "120 ft, +5 saldırı, 1d10 force",
          text: "Action · 120 ft\nLanetli kemik zarlar fırlatırsın.\nd20 + 5 at; hedefin AC'sine ulaşırsan 1d10 force hasarı." },
        { name: "Leydi'nin Fısıltısı", cost: 0, short: "Dokun: +1d4 ability check",
          text: "Action · dokunma · concentration 1 dk\nDokunduğun kişi 1 dakika içinde yapacağı bir ability check'e +1d4 ekler.\nZar atmadan önce ya da sonra karar verebilir." },
        { name: "Thaumaturgy", cost: 0, short: "Küçük şeytani gösteriler",
          text: "Action · 30 ft · 1 dakika\nBirini seç:\n• sesin 3 kat gürler\n• alevler renk değiştirir / parlar / söner\n• yerde zararsız titreme\n• bir noktadan ürkütücü ses (gök gürültüsü, kuzgun, fısıltı)\n• kilitsiz kapı veya pencere çarpar\n• gözlerinin görünümü değişir" }
      ],
      powers: [
        { name: "Yeniden Dağıt", cost: 1, short: "Bir d20 yeniden atılır (yoldaş ya da düşman)",
          text: "Anında · sonucu gördükten sonra · tur başına 1\nBirini seç:\n• Sen ya da gördüğün bir yoldaş az önce attığı bir d20'yi yeniden atar (yeni sonuç geçerli).\n• Gördüğün bir düşman az önce başardığı bir d20'yi (saldırı, save, check) yeniden atar.\n\nRenk bonusu ayrıca uygulanır (beyaz: yoldaşa +1d4 / kırmızı: düşmana -1d4)." },
        { name: "Kader Zarı", cost: 1, short: "Lütuf: 3 yoldaş +1d4 · Lanet: 3 düşman -1d4",
          text: "Action · 30 ft · concentration 1 dk\nBirini seç:\n• LÜTUF: en fazla 3 yoldaş saldırı ve saving throw'larına +1d4 ekler.\n• LANET: gördüğün en fazla 3 düşman Cha save DC 13; başarısız olanlar saldırı ve save'lerden -1d4.\n\nÇİFTE BAHİS: aynı renkten 2 token harcarsan 5 yaratığı etkiler." },
        { name: "Leydi'nin Damgası", cost: 1, short: "+1d6 necrotic, bir yetenekte dezavantaj",
          text: "Bonus action · 90 ft · concentration 1 saat\n• Hedefe her isabetinde +1d6 necrotic.\n• Bir yetenek seç (Str/Dex/Con/Int/Wis/Cha); hedef o yetenekle check'lerde dezavantajlı.\n• Hedef ölürse bonus action ile damgayı yeni hedefe taşı." },
        { name: "Kehanet Okuması", cost: 1, short: "Leydi'ye bir eylemi sor: iyi / kötü / ikisi / önemsiz",
          text: "1 dakika ritüel (tarot ya da zar)\nÖnümüzdeki 30 dakika içinde yapmayı planladığın TEK bir eylemi sorarsın.\nDM cevap verir:\n• iyi\n• kötü\n• ikisi de\n• önemsiz\n\nGünde ikinci kullanımdan itibaren cevap güvenilmez olabilir (%25 kümülatif)." }
      ],
      daily: [
        { id: "rebuke", name: "Hellish Rebuke", short: "Reaction: sana vurana 3d10 ateş",
          text: "Reaction · 60 ft · günde 1\nSana hasar veren, gördüğün bir yaratık Dex save DC 13 atar.\n• Başarısız: 3d10 ateş\n• Başarılı: yarısı" }
      ],
      background: { name: "Charlatan", feature: "False Identity",
        text: "• İkinci bir kimliğin var: belgeler, tanıdıklar, kılık.\n• Örneğini gördüğün resmi belge ve mektupları taklit edebilirsin.\n• Tercih ettiğin hile: şans oyunlarında kazık." },
      equipment: "• Leather armor\n• 2 dagger\n• Light crossbow + 20 bolt\n• Fine clothes, disguise kit\n• Hileli zar seti, kurukafa işaretli kemik zar çifti\n• Dungeoneer's pack\n• 15 gp"
    },
    {
      id: "bilge",
      player: "Bilge",
      title: "Orman Cadısı",
      code: "YAGA",
      theme: { c1: "#7fb069", c2: "#c75c1e", emblem: "cauldron" },
      race: "İnsan", cls: "Druid 3", bg: "Hermit",
      abilities: { Str: 9, Dex: 14, Con: 15, Int: 13, Wis: 16, Cha: 11 },
      hpMax: 24, ac: 15, acNote: "leather + ahşap kalkan", speed: "30 ft", prof: 2,
      saves: [["Str", -1], ["Dex", 2], ["Con", 2], ["Int", 3], ["Wis", 5], ["Cha", 0]],
      skills: [["Medicine", 5], ["Nature", 3], ["Religion", 3], ["Survival", 5], ["Perception", 3], ["Insight", 3], ["Persuasion", 0], ["Intimidation", 0]],
      weapons: [["Sickle", "+4", "1d4+2 slashing", "light"], ["Quarterstaff", "+1", "1d6-1 bludgeoning", "iki elle 1d8"]],
      traits: ["Tool: herbalism kit, alchemist's supplies", "Diller: Common, +1, Druidic (gizli cadı yazısı)"],
      resource: { kind: "count", name: "İksir Şişesi", max: 4, longRest: 3, shortRest: 1, start: 3,
        text: "• Long rest sonunda kazanda 3 şişe kaynatırsın (en fazla 4).\n• Short rest'te +1.\n• Şişeyi bir yoldaşına verebilirsin; o kullanır, senin DC'n (13) geçerli.\n• Hangi iksir olduğuna kullanırken karar verirsin." },
      cantrips: [
        { name: "Kazan Alevi", cost: 0, short: "Avuçta alev; 30 ft'e fırlat, 1d8 ateş",
          text: "Action\nAvucunda 10 dakika yanan alev (10 ft ışık).\nAction ile 30 ft'e fırlat: d20 + 5, isabette 1d8 ateş." },
        { name: "Kök Kamçısı", cost: 0, short: "30 ft, 1d6 ve 10 ft kendine çek",
          text: "Action · 30 ft\nd20 + 5 at.\nİsabette 1d6 piercing ve hedef Large veya küçükse 10 ft sana doğru çekilir." }
      ],
      powers: [
        { name: "Yakan Şişe", cost: 1, short: "30 ft'e fırlat, 10 ft alanda 3d6 ateş",
          text: "Action · 30 ft'e fırlat\nÇarptığı noktadan 10 ft yarıçapta herkes Dex save DC 13.\n• Başarısız: 3d6 ateş\n• Başarılı: yarısı\nTaşınmayan yanıcı nesneler tutuşur." },
        { name: "Kök Şişesi", cost: 1, short: "60 ft, 20 ft alanda kökler: restrained",
          text: "Action · 60 ft'e fırlat · concentration 1 dk\n20 ft'lik kare alanda kökler fışkırır.\n• Alandakiler Str save DC 13; başarısız olanlar restrained.\n• Kurtulmak: action + Str check DC 13.\n• Alan difficult terrain." },
        { name: "Doğruluk Çayı", cost: 1, short: "Cha save; 10 dk yalan söyleyemez",
          text: "Action\nİki kullanım:\n• İçeceğe kat: sadece içen etkilenir.\n• Mantarı aç: 15 ft yarıçapta herkes.\n\nEtkilenenler Cha save DC 13; başarısız olan 10 dakika bilerek yalan söyleyemez.\nKimin direndiğini bilirsin.\nEtkilenen bunu fark eder; cevap vermeyi reddedebilir ama yalan söyleyemez." }
      ],
      daily: [
        { id: "burun", name: "Barakanın Burnu", short: "Gecede 1: kötü erkeğin yönü",
          text: "Gece · gecede 1\nBarakaya sorarsın: 1.000 ft içinde bir kadına zarar vermiş en yakın erkeğin yönünü gösterir.\nKılık ya da büyüyle saklananı bulamaz." }
      ],
      special: [
        { name: "Tavuk Bacaklı Baraka", text: "• Gündüz sıradan kulübe.\n• Gece sen içindeyken yürür, grubu taşır.\n• İçinde dinlenmek güvenlidir; kapı iznin olmadan açılmaz." },
        { name: "Druidic", text: "Gizli cadı yazısı.\nMesaj bırakırsın; başkası DC 15 Perception ile fark eder ama okuyamaz." }
      ],
      background: { name: "Hermit", feature: "Discovery",
        text: "Uzun inzivanda büyük bir sır öğrendin.\nDM sana ayrı bir kart verecek; sadece sen biliyorsun." },
      equipment: "• Leather armor, ahşap kalkan\n• Sickle, quarterstaff\n• Druidic focus (porsuk ağacı havan tokmağı)\n• Explorer's pack\n• Herbalism kit, alchemist's supplies\n• Notlarla dolu scroll case, battaniye\n• 4 boş vial\n• İğneli bez bebek\n• 5 gp"
    },
    {
      id: "beste",
      player: "Beste",
      title: "Yüzyılların Büyücüsü",
      code: "ZOLT",
      theme: { c1: "#8ec5ff", c2: "#5b4bd6", emblem: "grimoire" },
      race: "High Elf", cls: "Wizard 3", bg: "Sage",
      abilities: { Str: 8, Dex: 16, Con: 13, Int: 16, Wis: 12, Cha: 10 },
      hpMax: 17, ac: 13, acNote: "zırhsız", speed: "30 ft", prof: 2,
      saves: [["Str", -1], ["Dex", 3], ["Con", 1], ["Int", 5], ["Wis", 3], ["Cha", 0]],
      skills: [["Arcana", 5], ["History", 5], ["Investigation", 5], ["Insight", 3], ["Perception", 3], ["Stealth", 3], ["Persuasion", 0], ["Deception", 0]],
      weapons: [["Quarterstaff", "+1", "1d6-1 bludgeoning", "iki elle 1d8"], ["Dagger", "+5", "1d4+3 piercing", "20 ft fırlatma"]],
      traits: ["Darkvision 60 ft", "Charm'a karşı save'lerde avantaj; büyü uyutamaz", "4 saat trance", "Diller: Common, Elvish, +3"],
      resource: { kind: "count", name: "Mana", max: 3, longRest: 3, shortRest: 1, shortOncePerDay: true, start: 3,
        text: "• Long rest: 3 Mana.\n• Short rest: +1 (günde 1 kez).\n\nMana Bastırma (pasif):\n• Büyü algıları seni çırak sanır.\n• Kendi gücün hakkındaki Deception'da avantaj.\n• Son Mana'nı harcadığında bastırma 1 dakika çözülür: herkes gerçek gücünü hisseder." },
      cantrips: [
        { name: "Zoltraak", cost: 0, short: "120 ft, +5 saldırı, 1d10 force",
          text: "Action · 120 ft\nd20 + 5 at; isabette 1d10 force.\n\"Sıradan saldırı büyüsü.\"" },
        { name: "İşe Yaramaz Büyü Koleksiyonu", cost: 0, short: "Küçük numaralar, çiçek tarlası",
          text: "Action · 10 ft\nBirini yap:\n• kıvılcım, rüzgâr, koku gibi zararsız efekt\n• mum yak / söndür\n• 1 ft³ nesneyi temizle ya da kirlet\n• yemeği tatlandır, ısıt, soğut\n• nesneye işaret ya da renk\n• avuç içi illüzyon (1 tur)\n• 30 ft'e kadar çiçek tarlası açtır\nHasarsız." }
      ],
      powers: [
        { name: "Zoltraak: Tam Güç", cost: 1, short: "4 ok, 1d4+1 force, otomatik isabet",
          text: "Action · 120 ft\n4 ok, her biri 1d4+1 force.\nZar atmadan otomatik isabet.\nTek hedefe ya da dağıtarak." },
        { name: "Mana Algısı", cost: 1, short: "10 dk: büyü auraları ve okulları",
          text: "Action · concentration 10 dk\n• 30 ft içinde büyü varlığını hissedersin.\n• Action ile auraları ve büyü okulunu görürsün.\n• Birine dokunursan üzerindeki büyüleri (lanet, charm, kılık) öğrenirsin.\n\nBu sırada başka Mana yeteneği kullanırsan algı o tur kesilir." },
        { name: "Aureole'nin Fısıltısı", cost: 2, short: "Cesede 5 soru",
          text: "Action · 10 ft · 10 dakika\nBir cesede en fazla 5 soru sorarsın.\n• Ceset sadece yaşarken bildiğini bilir.\n• Cevaplar kısa, kriptik ya da tekrarlı.\n• Sana düşmansa yalan söyleyebilir.\n• Ağzı olmalı, undead olamaz, son 10 günde sorgulanmamış olmalı." }
      ],
      daily: [],
      portent: true,
      background: { name: "Sage", feature: "Researcher",
        text: "Bilmediğin bir bilgiyi genellikle nereden ve kimden öğrenebileceğini bilirsin:\nkütüphane, arşiv, bilge biri." },
      equipment: "• Quarterstaff, dagger\n• Arcane focus (eski asa)\n• Spellbook: Grimoire Koleksiyonu\n• Scholar's pack\n• Mürekkep, kalem, bıçak\n• Ölü bir meslektaştan cevaplanmamış soru içeren mektup\n• 10 gp"
    },
    {
      id: "elif",
      player: "Elif",
      title: "Orman Perisi",
      code: "FEY",
      theme: { c1: "#c38cff", c2: "#2a9d8f", emblem: "moth",
        // taşınan ruh sayısına göre tema (0 → 3)
        soul: [["#c38cff", "#2a9d8f"], ["#a97be6", "#2f6f7a"], ["#8a4fd0", "#5a1f4a"], ["#b3122e", "#1a0a1f"]] },
      race: "Orman Perisi", cls: "Druid 3 (Ay Çemberi)", bg: "Outlander",
      abilities: { Str: 8, Dex: 16, Con: 13, Int: 10, Wis: 16, Cha: 12 },
      hpMax: 21, ac: 16, acNote: "leather + kalkan; formda kalkan düşer", speed: "35 ft", prof: 2,
      saves: [["Str", -1], ["Dex", 3], ["Con", 1], ["Int", 2], ["Wis", 5], ["Cha", 1]],
      skills: [["Perception", 5], ["Animal Handling", 5], ["Athletics", 1], ["Survival", 5], ["Stealth", 5], ["Nature", 0], ["Persuasion", 1], ["Intimidation", 1], ["Deception", 1]],
      weapons: [["Scimitar", "+5", "1d6+3 slashing", "finesse, light"], ["Sling", "+5", "1d4+3 bludgeoning", "30 ft"]],
      traits: ["Darkvision 60 ft", "Charm'a karşı save'lerde avantaj; büyü uyutamaz", "4 saat trance", "Mask of the Wild: yaprak, yağmur, sis içinde saklanabilirsin", "Diller: Common, Sylvan, +1, Druidic"],
      resource: { kind: "souls", name: "Ruh", max: 3, start: 1,
        text: "• En fazla 3.\n• 30 ft içinde ruhu olan bir canlı ölürse +1.\n• Dinlenmede sıfırlanmaz, birikir.\n• Action ile bir ruhu serbest bırakabilirsin." },
      wildShape: { max: 2, text: "Bonus action ile daha önce gördüğün herhangi bir hayvana dönüşürsün.\n• 1 saat sürer; bonus action ile geri dönersin.\n• Formun HP'si biterse kendi formuna dönersin (fazla hasar sana geçer).\n• Formdayken Peri Tozu ve Hayvan Dili kullanılamaz; Ruh yetenekleri serbest.\n• Short/long rest'te yenilenir.",
        table: [["Küçük", "kedi, kuzgun, sıçan, solucan", "12", "3", "+4, 1"], ["Orta", "kurt, panter, köpek", "13", "13", "+4, 1d6+2"], ["Büyük", "ayı, kaplan, dev örümcek, at", "12", "30", "+5, 1d8+3"]] },
      cantrips: [
        { name: "Peri Tozu", cost: 0, short: "Bir hedef: ona saldırılar avantajlı",
          text: "Action · 30 ft · tek hedef\nDex save DC 13; başarısızsa senin bir sonraki turunun sonuna kadar:\n• ona yapılan saldırılar avantajlı\n• saklanamaz, görünmez olamaz\n• ışık saçar" },
        { name: "Hayvan Dili", cost: 0, short: "10 dk hayvanlarla konuş",
          text: "Action · 10 dakika\nHayvanlarla konuşursun; son bir günde gördüklerini anlatırlar.\nDM takdirinde küçük iyilik yaptırabilirsin." }
      ],
      powers: [
        { name: "Ruh Yakıtı", cost: 1, short: "2d8 iyileş / form bir boy büyür / Wild Shape geri al",
          text: "Dönüşürken ya da hayvan formundayken · bonus action\nBirini seç:\n• 2d8 HP iyileş\n• bu dönüşümde form bir boy büyür (Küçük→Orta, Orta→Büyük; Büyükse HP +10 ve hasara +1d6)\n• harcanmış bir Wild Shape kullanımını geri al" },
        { name: "Ay Işığı", cost: 1, short: "Işık sütunu 2d10 radiant; kılıkları düşürür",
          text: "Action · 120 ft · concentration 1 dk\n5 ft yarıçaplı gümüş ışık sütunu.\n• İçine giren ya da içinde tur başlatan Con save DC 13: 2d10 radiant (başarılı yarısı).\n• Şekil değiştirenler ve kılık giyenler dezavantajla atar; başarısızsa gerçek yüzüne döner ve ışıktan çıkana kadar değiştiremez.\n• Action ile ışını 60 ft taşı." },
        { name: "Peri Halkası", cost: 1, short: "Grup 1 saat Stealth +10",
          text: "Action · concentration 1 saat\n30 ft içindeki seçtiğin herkes:\n• Stealth'e +10\n• iz bırakmaz" }
      ],
      daily: [],
      special: [
        { name: "İnsan Sureti", text: "Action ile peri ↔ insan formu.\n• Gerçek dönüşüm, dokununca bozulmaz.\n• Ruh karartısını gizleyemez: gözler ve damarlar her iki formda kararır." }
      ],
      background: { name: "Outlander", feature: "Wanderer",
        text: "• Arazinin ve yerleşimlerin düzenini her zaman hatırlarsın.\n• Arazi elverdiğinde kendin ve 5 kişi için her gün yiyecek ve su bulursun." },
      equipment: "• Leather armor, ahşap kalkan\n• Scimitar, sling\n• Druidic focus (ruh feneri)\n• Explorer's pack\n• Staff, hunting trap\n• Hayvan trophy'si\n• Traveler's clothes\n• Şişede ölü bir sprite\n• 10 gp"
    }
  ]
};
