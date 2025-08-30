# Çocuklara Kod

Her çocuk farklı bir dünyada büyüyor. Kimisi oyunla öğreniyor, kimisi merakla keşfediyor, kimisi sadece eğlenmek istiyor. Bizim amacımız, onların bu yolculuklarını destekleyecek **anlamlı, eğlenceli ve güvenli yazılımlar geliştirmek**.

**Çocuklara Kod**, çocuklara kod öğretmeyi değil, **çocuklar için yazılım üretmeyi** hedefleyen bir topluluk girişimi. Burada ebeveynler, yazılımcılar ve gönüllüler bir araya gelerek; eğitici oyunlar, keşif uygulamaları ve merak uyandıran deneyimler tasarlıyor.

Çocukların gözündeki ışıltıyı artıracak, onların dünyasına değer katacak her satır kod, bu projenin kalbine işlenmiş durumda. Bizim için önemli olan, teknolojiyi çocukların güvenle, keyifle ve hayal güçlerini besleyecek şekilde deneyimlemesi.

---

## Neden Bu Proje?

* **Çocuklar için**: Yaşa ve gelişim düzeyine uygun, güvenli ve eğlenceli içerikler.
* **Ebeveynler için**: Teknolojiyi sağlıklı ve kontrollü biçimde deneyimlemeye destek olma imkânı.
* **Yazılımcılar için**: Küçük yaştaki kullanıcılar için üretirken farklı tasarım pratiklerini keşfetme alanı.

---

## Nasıl Çalışır?

* Her yazılım/oyun bir klasör ve **`manifest.json`** ile gelir.
* İçerikler **iframe** ile ana siteye gömülür; üstte bir **etkileşim çubuğu** ("Beğendim", "Faydalı Buldum", "Oynadım") bulunur.
* PR süreçlerinde `manifest.json` otomatik **validate** edilir.
* İçerik, tercihen **GitHub Pages** üzerinden yayınlanır (minimum bağımlılık, maksimum şeffaflık).

---

## Klasör Yapısı (Öneri)

```
/
├─ apps/
│  ├─ hafiza-kartlari/
│  │  ├─ index.html
│  │  ├─ assets/
│  │  └─ manifest.json
│  └─ carpim-tablosu/
│     ├─ index.html
│     ├─ assets/
│     └─ manifest.json
├─ public/
│  └─ site-assets...
├─ scripts/
│  └─ validate-manifest.mjs
├─ index.html        # Uygulama listesi, arama, filtreler
├─ apps.json         # Derlenen manifest’lerden oluşan katalog (build adımı ile)
└─ README.md
```

---

## Manifest Şeması (Minimum)

Aşağıdaki örnek, PR açmadan önce doldurulması gereken temel alanları gösterir.

```json
{
  "name": "Çarpım Tablosu Macerası",
  "slug": "carpim-tablosu",
  "version": "1.0.0",
  "description": "Çocukların çarpım tablosunu eğlenceli mini oyunlarla pekiştirmesi için.",
  "age": { "min": 6, "max": 10 },
  "authors": [
    { "name": "Mirat", "role": "Developer" }
  ],
  "tags": ["matematik", "oyun", "egitici"],
  "offline": false,
  "entry": "apps/carpim-tablosu/index.html",
  "permissions": [],
  "safety": {
    "content_warnings": [],
    "no_ads": true,
    "no_tracking": true
  },
  "analytics": {
    "opt_in": true
  },
  "i18n": ["tr"],
  "license": {
    "code": "MIT",
    "assets": "CC BY-NC 4.0"
  }
}
```

> Notlar:
>
> * `offline: true` yapılırsa PWA/Service Worker ile asset’ler cache’lenmeli.
> * `analytics.opt_in` true ise, yalnızca **anonim**, **çocuk güvenli** metrikler toplanır (ör: oturum sayısı, oyun başlatma sayısı). Kişisel veri yok.

---

## Etkileşim Çubuğu (Beğeni & Fayda & Oynama)

* Her uygulamanın üstünde üç buton bulunur: **Beğendim**, **Faydalı Buldum**, **Oynadım**.
* Bu veriler yalnızca toplam ve anonim olarak tutulur; içerik üreticilerini motive etmek için listelerde gösterilir.
* Toplanan metrikler: toplam tıklama, gün/hafta/ay trendi.

---

## Kurulum & Geliştirme

**Ön Koşullar:** Sıfır ya da minimum bağımlılık hedeflenir. Yerel geliştirme için basit bir HTTP sunucusu yeterlidir.

1. Depoyu klonla:

```
 git clone https://github.com/<org>/cocuklarakod.git
 cd cocuklarakod
```

2. Yerel sunucu başlat (ikisi de olur):

```
 # Python
 python -m http.server 8080

 # Node (global http-server varsa)
 npx http-server -p 8080
```

3. Tarayıcıdan aç: `http://localhost:8080`

4. Yeni bir uygulama eklemek için `apps/<slug>/` klasörü oluştur, `index.html` ve `manifest.json` ekle.

---

## Doğrulama (CI)

* PR açıldığında `scripts/validate-manifest.mjs` çalışır ve her `manifest.json` şemaya göre doğrulanır.
* Hatalar PR görüşmelerinde raporlanır (yaş etiketi zorunlu, açıklama zorunlu, lisans alanları boş olamaz vb.).

> İleri Aşama: GitHub Actions ile otomatik `apps.json` üretimi ve siteye liste olarak yansıtma.

---

## Yayınlama

* Varsayılan dağıtım: **GitHub Pages**.
* Build adımı (opsiyonel) `apps/` içindeki tüm `manifest.json` dosyalarını toplayıp `apps.json` üretir; ana sayfa buradan liste üretir.

---

## Erişilebilirlik (A11y) İlkeleri

* Kontrast ve font boyutları yaşa uygun, okunur olmalıdır.
* Klavye ile tam gezinme ve odak halkaları zorunludur.
* Ekran okuyucu etiketleri (aria-label) sağlanmalıdır.
* Hızlı yanıp sönen görsellerden kaçınılır (epilepsi tetikleyici içeriklerden sakınılır).

---

## Güvenlik ve Gizlilik

* **Reklam yok.**
* **Kişisel veri yok.** Cookie kullanımı zorunluysa açıkça belirtilir ve çocuk güvenliğine uygun, yalnızca teknik amaçlı olmalıdır.
* Harici API kullanılıyorsa `permissions` içinde açıkça listelenir ve güvenlik incelemesinden geçer.

---

## Katkı Rehberi

1. Issue açarak fikrini paylaş.
2. `apps/<slug>/` içinde prototip oluştur.
3. `manifest.json`’u şemaya göre doldur.
4. PR aç ve aşağıdaki checklist’i işaretle:

   * [ ] Yaş aralığı belirlendi (`age.min`, `age.max`).
   * [ ] Reklam yok, kişisel veri yok.
   * [ ] Erişilebilirlik temel kontrolleri yapıldı (kontrast, odak, etiketler).
   * [ ] Offline için gerekçe (varsa) açıklandı.
   * [ ] Lisans alanları dolduruldu.

> Topluluk dili Türkçe; kod ve içerik açıklamaları kısa ve anlaşılır olmalı.

---

## Lisans

* **Kod** için önerilen lisans: **MIT**.
* **Görseller/assetler** için önerilen lisans: **CC BY-NC 4.0**.

> Nihai lisanslar proje sahipleri tarafından teyit edilecektir. PR’larda lisans belirtilmesi zorunludur.

---

## Davet

Bu proje bir çağrı: Çocukların merakını gülümseten küçük uygulamalar yapalım. Basit, güvenli, anlaşılır. Eğer bu cümle sende bir kıvılcım çaktırdıysa, kapımız açık. Bir fikri küçük bir oyuna, bir oyunu büyük bir mutluluğa dönüştürelim.
