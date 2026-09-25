# 💳 KartTaksit Pro — Kredi Kartı Taksit ve Borç Takip Uygulaması

<p align="center">
  <img src="public/favicon.svg" alt="KartTaksit Pro Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>Kredi kartı taksitlerinizi, aylık ödeme yükünüzü ve gelecek borç projeksiyonlarınızı kolayca yönetin.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-purple?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Gizlilik-%25100%20Yerel%20(Local%20Storage)-green" alt="Privacy First" />
  <img src="https://img.shields.io/badge/Lisans-MIT-yellow" alt="License" />
</p>

---

## 🌟 Öne Çıkan Özellikler

### 📊 1. Akıllı Gösterge Paneli (Dashboard)
- **Toplam Kalan Borç**: Aktif tüm taksitlerin toplam kalan bakiyesi.
- **Bu Ayın Taksit Yükü**: İçinde bulunulan ay ödenecek taksit toplamı.
- **Gelecek Ay Projeksiyonu**: Önümüzdeki ay borcunuzun nasıl değişeceğini anında görün.
- **Aktif Taksit Takibi**: Devam eden ve biten taksitlerin anlık sayaçları.

### 📈 2. 24 Aylık Borç Projeksiyon Grafiği
- Gelecek 24 ay boyunca her ay ne kadar taksit ödeyeceğinizi görselleştiren interaktif grafik (Recharts).
- Hangi aylarda borcunuzun hafifleyeceğini, hangi aylarda pik yaptığını tek bakışta analiz edin.

### ⏱️ 3. Ürün Zaman Çizelgesi (Gantt Şeması)
- Her taksitli alışverişin hangi ay başladığını, kaçıncı taksitte olduğunu ve ne zaman biteceğini gösteren görsel zaman çizelgesi.

### 📅 4. Ay Bazlı Detaylı Kırılım
- Seçtiğiniz herhangi bir aya tıklayarak o ay hangi ürün için ne kadar taksit ödeneceğini ve kart bazlı toplam dağılımı inceleyin.

### ⏳ 5. Zaman Makinesi (Tarih Simülatörü)
- "3 ay sonra veya 1 yıl sonra ne kadar borcum kalacak?" sorusunun cevabını görmek için zamanı ileri sarın. Uygulama tüm taksitleri ve kalan borçları seçilen tarihe göre yeniden hesaplar.

### 🔒 6. %100 Yerel ve Güvenli (Privacy-First)
- Kart veya harcama bilgileriniz hiçbir uzak sunucuya gönderilmez.
- Veriler yalnızca kendi tarayıcınızın `localStorage` alanında saklanır.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend Kütüphanesi:** [React 19](https://react.dev/)
- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **Derleyici & Build Aracı:** [Vite 8](https://vite.dev/)
- **Stil & Tasarım:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Grafik:** [Recharts](https://recharts.org/)
- **İkon Seti:** [Lucide React](https://lucide.dev/)
- **Tarih İşlemleri:** [date-fns](https://date-fns.org/)
- **Efektler:** [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Bilgisayarınızda **Node.js** (v18 veya üzeri) yüklü olmalıdır.

### Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/Furkan-Demircan/CreditCardTracking.git
   cd CreditCardTracking
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   Tarayıcınızda `http://localhost:5173` adresine gidin.

---

## 💻 Masaüstü Uygulaması Olarak Kullanım (Windows)

Uygulamayı her seferinde terminal açmadan, sanki bilgisayarınıza kurulu bir masaüstü programı gibi kullanabilirsiniz:

1. Proje dizinindeki **`Baslat.bat`** dosyasına çift tıklayın.
2. Uygulama otomatik olarak pencere modunda (Edge/Chrome App Mode) açılacaktır.
3. *İpucu:* `Baslat.bat` dosyasına sağ tıklayıp **Gönder > Masaüstü (kısayol oluştur)** diyerek masaüstünüzden tek tıkla erişebilirsiniz.

---

## 📜 Kullanılabilir Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır (Hot Module Replacement aktif). |
| `npm run build` | TypeScript tip kontrollerini yapar ve üretim için `dist/` klasörüne derler. |
| `npm run preview` | Derlenmiş `dist/` çıktısını yerel sunucuda önizler. |
| `npm run lint` | Oxlint ile kod kalite kontrolü yapar. |

---

## 📂 Proje Yapısı

```
CreditCardTracking/
├── public/                # Statik varlıklar (favicon, ikonlar)
├── src/
│   ├── assets/            # Görsel ve medya dosyaları
│   ├── components/        # Yeniden kullanılabilir React bileşenleri
│   │   ├── DateSimulator.tsx      # Gelecek tarih simülatörü
│   │   ├── MonthlyBreakdown.tsx   # Aylık taksit detay listesi
│   │   ├── MonthlyDebtChart.tsx   # 24 aylık çubuk grafik
│   │   ├── Navbar.tsx             # Üst gezinme çubuğu
│   │   ├── ProductFormModal.tsx   # Taksit ekleme / düzenleme modalı
│   │   ├── ProductList.tsx        # Aktif ürünler listesi
│   │   ├── ProductTimelineGantt.tsx # Taksit zaman çizelgesi
│   │   └── StatsOverview.tsx      # Üst istatistik kartları
│   ├── services/          # Hesaplama ve localStorage servisleri
│   ├── types/             # TypeScript arayüz ve tip tanımları
│   ├── App.tsx            # Ana uygulama bileşeni
│   ├── index.css          # Tailwind CSS ve genel stiller
│   └── main.tsx           # React giriş noktası
├── Baslat.bat             # Windows tek tıkla başlatıcı
├── package.json           # Proje bağımlılıkları ve betikleri
└── vite.config.ts         # Vite yapılandırması
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. Kişisel kullanım ve geliştirmeler için serbestçe kullanılabilir.
