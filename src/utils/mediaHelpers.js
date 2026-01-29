// src/utils/mediaHelpers.js

export const getYoutubeId = (url) => {
    if (!url) return null;

    // Regex ini menangani youtu.be, watch?v=, shorts, dll
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2]) {
        // SOLUSI UTAMA: Kita paksa ambil 11 karakter saja.
        // ID YouTube SELALU 11 karakter.
        // Ini akan memotong "?si=..." atau parameter aneh lainnya secara otomatis.
        return match[2].substring(0, 11);
    }

    return null;
};

export const getEmbedUrl = (url) => {
    const id = getYoutubeId(url);
    // Kita kembalikan URL embed yang bersih
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
};