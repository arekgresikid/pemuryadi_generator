export async function onRequestGet(context: any) {
  const { request, env, params } = context;
  const slug = params.slug;

  // Fetch the static index.html from Cloudflare Pages ASSETS
  const response = await env.ASSETS.fetch(request);
  
  // Only process HTML responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('text/html')) {
    return response;
  }

  let html = await response.text();

  try {
    const db = env.DB;
    const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
    const post = await db.prepare(
      `SELECT title, content FROM blog_posts WHERE slug = ? AND (status = 'published' OR (status = 'pending' AND uploaded_at < ?))`
    ).bind(slug, sixHoursAgo).first();

    if (post) {
      // Create description from content (strip markdown roughly)
      let rawContent = (post.content as string) || '';
      let description = rawContent
        .replace(/#+\s/g, '') // remove headings
        .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
        .replace(/\[.*?\]\(.*?\)/g, '') // remove links
        .replace(/\n/g, ' ') // replace newlines with space
        .trim()
        .substring(0, 155) + '...';
        
      const title = `${post.title} | Blog Pemuryadi Generator`;

      // Replace generic meta tags with specific ones
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`);
      html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`);
    }
  } catch (e) {
    // If DB fails, just silently fallback to returning the original HTML
    console.error('Error fetching blog post for SEO:', e);
  }

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}
