# CV Evaluation API

Backend API untuk evaluasi CV dan laporan proyek kandidat secara otomatis menggunakan pipeline AI dengan pemrosesan asinkron.

**Versi**: 1.0.0

## Arsitektur

Sistem menggunakan pola _asynchronous task processing_:

- **API Server (Express.js)**: Menerima request, validasi input, dan membuat job
- **Message Queue (In-Memory)**: Antrian sederhana untuk job yang akan diproses
- **Background Worker**: Proses independen menggunakan `setInterval` untuk eksekusi job
- **Data Stores (TypeScript Map)**: Penyimpanan status dan hasil job di memori

## Instalasi & Setup

1. Install dependensi:

```bash
bun install
```

2. Buat file `.env`:

```env
DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxx"
```

3. Jalankan server:

```bash
bun run dev
```

Server berjalan di `http://localhost:3000`

## API Endpoints

### Mulai Evaluasi

```
POST /api/v1/evaluations
```

**Request Body:**

```json
{
  "cv_text": "Saya adalah seorang software engineer...",
  "report_text": "Proyek terakhir saya adalah..."
}
```

**Response (202 Accepted):**

```json
{
  "id": "a1b2c3d4-e5f6-...",
  "status": "queued"
}
```

### Cek Hasil

```
GET /api/v1/evaluations/<job_id>
```

**Response (jika completed):**

```json
{
    "id": "a1b2c3d4-e5f6-...",
    "status": "completed",
    "result": {
        "extracted_info": { ... },
        "score": 85,
        "feedback": "Kandidat menunjukkan potensi yang kuat."
    },
    "createdAt": "2025-09-28T01:34:37.000Z"
}
```

## Keterbatasan

- **Stateless**: Data disimpan di memori, hilang saat server restart
- **Single Worker**: Job diproses sekuensial dengan satu worker

## Rencana Pengembangan

- **Persistent Storage**: Migrasi ke PostgreSQL/MongoDB
- **Robust Queue**: Implementasi Redis + BullMQ untuk sistem antrian yang lebih andal
