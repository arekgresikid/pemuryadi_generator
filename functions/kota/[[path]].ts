export async function onRequest(context: any) {
  const { request, env, params } = context;
  const pathParam = params.path ? (Array.isArray(params.path) ? params.path.join('/') : params.path) : '';
  
  if (!pathParam) {
    return env.ASSETS.fetch(request);
  }

  const rawCityName = pathParam.replace(/-/g, ' ');
  const cityName = rawCityName.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const title = `Aplikasi Administrasi Guru & Sekolah di Kota ${cityName} - Pemuryadi Generator`;
  const description = `Tingkatkan performa mengajar Anda di ${cityName} dengan Pemuryadi Generator. Platform AI terbaik untuk membuat modul ajar, RPP, dan administrasi pendidikan khusus untuk kurikulum merdeka di Kota ${cityName}.`;
  
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": request.url,
    "publisher": {
      "@type": "Organization",
      "name": "Pemuryadi Generator"
    },
    "spatialCoverage": {
      "@type": "Place",
      "name": `Kota ${cityName}, Indonesia`
    }
  };

  const response = await env.ASSETS.fetch(request);
  const rewriter = new HTMLRewriter()
    .on('title', {
      element(element: any) {
        element.setInnerContent(title);
      }
    })
    .on('meta[name="description"]', {
      element(element: any) {
        element.setAttribute('content', description);
      }
    })
    .on('head', {
      element(element: any) {
        element.append(`<script type="application/ld+json">${JSON.stringify(schemaJson)}</script>`, { html: true });
        element.append(`<meta property="og:title" content="${title}" />`, { html: true });
        element.append(`<meta property="og:description" content="${description}" />`, { html: true });
      }
    });

  return rewriter.transform(response);
}
