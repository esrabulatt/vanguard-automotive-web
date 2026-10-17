const loaded = new Set<string>();

/** Görselleri tarayıcı önbelleğine alır; detay ekranı açıldığında beklemeden görünürler */
export const preloadImages = (urls: string[]) => {
  urls.forEach((url) => {
    if (loaded.has(url)) return;
    loaded.add(url);
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  });
};
