/// <reference types="@cloudflare/workers-types" />
export async function onRequest(context: any) {
  const { request, env, params } = context;
  const pathParam = params.path ? (Array.isArray(params.path) ? params.path.join('/') : params.path) : '';
  
  if (!pathParam) {
    return env.ASSETS.fetch(request);
  }

  // Handle format like "smpn-1-malang" -> "Smpn 1 Malang" -> "SMPN 1 Malang"
  const rawSchoolName = pathParam.replace(/-/g, ' ');
  const schoolName = rawSchoolName.split(' ').map((w: string) => {
    const lw = w.toLowerCase();
    if (lw === 'sdn' || lw === 'smpn' || lw === 'sman' || lw === 'smkn' || lw === 'min' || lw === 'mtsn' || lw === 'man' || lw === 'sd' || lw === 'smp' || lw === 'sma' || lw === 'smk') {
      return lw.toUpperCase();
    }
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');

  const title = `Aplikasi Pendukung Guru & Tenaga Pendidik di ${schoolName} - Pemuryadi Generator`;
  const description = `Solusi digital terintegrasi untuk guru di ${schoolName}. Buat modul ajar Kurikulum Merdeka, RPP, dan bank soal otomatis dengan AI di ${schoolName}.`;
  
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": schoolName,
    "description": description,
    "url": request.url,
    "sameAs": "https://pemuryadi.com"
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
