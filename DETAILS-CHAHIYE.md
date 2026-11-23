# Invitation ke liye kya chahiye aur kahan daalna hai

Zyada tar cheezein ek hi file me hain: **`src/data/invite.js`**. Baaki ke liye file ka naam aur line niche likhi hai.

Text badalte waqt sirf `'...'` ke andar ka text badlo. Quotes `'`, comma `,` aur brackets `{ }` mat hatana.

---

## Checklist

| #   | Kya chahiye                          | Kahan daalna hai                                                | Status                                  |
| --- | ------------------------------------ | --------------------------------------------------------------- | --------------------------------------- |
| 1   | Venue ka naam aur address            | `src/data/invite.js`                                            | Abhi sample: 1028 Durga Colony, Gurgaon |
| 2   | Background music (MP3)               | `public/assets/media/music.mp3`                                 | Abhi sample tune                        |
| 3   | Couple ki 9 photos                   | `public/assets/media/` + `src/components/PerspectiveTunnel.jsx` | Abhi sample images                      |
| 4   | Photos card ka text                  | `src/data/invite.js`                                            | Abhi: "Photographs are welcome."        |
| 5   | Contact card (naam + phone)          | `src/data/invite.js`                                            | Abhi: "Your host"                       |
| 6   | Venue section ki photo (optional)    | `public/assets/media/table-red.jpg`                             | Abhi sample dinner table                |
| 7   | Website ka address (hosting ke baad) | `index.html`                                                    | Abhi khaali                             |

---

## 1. Venue

**File:** `src/data/invite.js`

`EVENT` ke andar (line 11–13):

```js
place: 'Durga Colony, Gurgaon',                    // intro me naamon ke neeche dikhta hai (chhota rakho)
map: '1028 Durga Colony, Gurgaon, Haryana 122003', // Google Maps isi ko dhoondta hai: map + "Get directions" + calendar
```

`COUPLE` ke andar (line 28–29):

```js
venue: 'Durga Colony, Gurgaon',                        // "Where" section me bada naam
address: '1028 Durga Colony, Gurgaon, Haryana 122003', // uske neeche poora address
```

Example (agar venue "The Grand Lawns" ho):

```js
place: 'The Grand Lawns, Gurgaon',
map: 'The Grand Lawns, Sohna Road, Gurgaon, Haryana 122018',
venue: 'The Grand Lawns',
address: 'Sohna Road, Gurgaon, Haryana 122018',
```

Tip: `map` me wahi likho jo Google Maps me search karne par sahi jagah dikhaye.

---

## 2. Music

1. Apni MP3 file ka naam `music.mp3` rakho.
2. `public/assets/media/music.mp3` wali purani file ki jagah daal do (replace).

Bas, code me kuch nahi badalna. Ek baat dhyan me rakhna: file chhoti ho to page jaldi khulta hai, 5 MB se kam sahi rahega.

Music nahi chahiye to `src/data/invite.js` line 15 par `music: ''` kar do.

---

## 3. Couple ki photos (9 photos, "Our story in moments" section)

**Kaisi photos:** khadi (portrait) photos sabse achhi lagti hain (ratio lagbhag 4:5). Har photo 300 KB se kam ho, JPG ya WEBP.

**Step 1:** photos ko `public/assets/media/` me daalo, jaise `photo-1.jpg`, `photo-2.jpg` … `photo-9.jpg`.

**Step 2:** `src/components/PerspectiveTunnel.jsx` me line 13–23 par `DEFAULT_IMAGES` list hai. Har line me teen cheezein hain:

- `src`: photo ka naam
- `title`: photo par chhota likha aane wala naam
- `alt`: photo ka chhota description (screen reader ke liye)

Example:

```js
const DEFAULT_IMAGES = [
  {
    src: asset("assets/media/photo-1.jpg"),
    title: "Where it began",
    alt: "Harsh and Aditi on their first trip",
  },
  {
    src: asset("assets/media/photo-2.jpg"),
    title: "The proposal",
    alt: "Harsh proposing to Aditi",
  },
  // ... photo-9 tak
];
```

9 se kam ya zyada photos bhi chal jayengi. Jitni lines hongi utne cards udenge.

Section ka text bhi isi file me hai (line 138–143): "Our story in moments", "Every moment / led us here" aur neeche wali line.

---

## 4 & 5. Wishes cards (Photos aur Contact)

**File:** `src/data/invite.js`, line 58–63

```js
{ title: 'Photos', text: 'Photographs are welcome.' },
{ title: 'Contact', text: 'Your host' },
```

Example:

```js
{ title: 'Photos', text: 'Please share your photos with us on WhatsApp.' },
{ title: 'Contact', text: 'Rahul (brother): +91 98765 43210' },
```

Do lines me likhna ho to `\n` lagao: `'Rahul: +91 98765 43210\nPriya: +91 91234 56789'`

Gifts aur Children cards bhi yahin hain, unka text bhi badal sakte ho.

---

## 6. Venue section ki photo (optional)

"Where" section me jo gol-arch wali photo hai wo `public/assets/media/table-red.jpg` hai. Venue ki photo lagani ho to apni photo ka naam `table-red.jpg` rakh ke replace kar do. Khadi (portrait) photo yahan achhi lagegi.

---

## 7. Website ka address (hosting ke baad)

Website live hone ke baad (jaise `https://Harsh-Aditi.netlify.app`), `index.html` line 14 par photo ka poora link likho, taaki WhatsApp par link bhejne par preview me photo aaye:

```html
<meta
  property="og:image"
  content="https://Harsh-Aditi.netlify.app/assets/media/og.jpg"
/>
```

---

## Personal links (har guest ke liye naam wala link)

Link ke aakhir me `?g=Naam` jodo. Space ki jagah `%20` likho.

| Link                                        | Guest ko kya dikhega                                                                                                       |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `https://aapki-site.com/`                   | Intro: "An invitation is hiding under the glitter" → "With the blessings of our families". Letter: "Dear family & friends" |
| `https://aapki-site.com/?g=Sharma%20Family` | Intro: "Sharma Family, your invitation is under the glitter" → "Dear Sharma Family,". Letter: "Dear Sharma Family"         |

Bina `?g=` wala link bhi poora sahi chalta hai. Bas usme general text aata hai, kisi ka naam nahi.

Naam chhota rakho (jaise "Sharma Family", "Rohit Bhaiya"), lamba naam do line me aa jayega.

Har shabd ka pehla akshar apne aap bada ho jaata hai: `?g=yogesh` likhoge to "Yogesh" dikhega.

---

## Ye pehle se set hai (badalna ho to)

Sab `src/data/invite.js` me:

| Cheez                 | Abhi kya hai                                        | Line  |
| --------------------- | --------------------------------------------------- | ----- |
| Couple ke naam        | Harsh, Aditi (monogram "H & A")                     | 20–22 |
| Wedding date aur time | 3 Feb 2027, 4 PM se 10 PM                           | 7–8   |
| Engagement            | Friday, 29 · 01 · 2027, Ring ceremony, 4 PM onwards | 35–38 |
| Wedding programme     | Welcome 4 PM, Dinner around 6 PM                    | 41–47 |

Saare time Indian time (IST) me hain (`utcOffset: '+05:30'`). Isliye videsh me baithe guest ko bhi countdown aur calendar me sahi time dikhega.

Agar date badle to `start`, `end`, `dateDots`, `dateLong`, `dateShort` aur `CELEBRATIONS` ki date, sab ek saath badalna. Countdown aur calendar `start` se apne aap chalte hain.

---

## Badlaav ke baad check kaise karein

```bash
npm run dev     # browser me http://localhost:5173 kholo aur dekho
npm run build   # hosting ke liye final files "dist" folder me banengi
```
