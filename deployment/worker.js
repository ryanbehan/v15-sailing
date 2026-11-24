import Negotiator from 'negotiator';
import { SITE_URL } from '../src/lib/seo.js';

const siteHost = new URL(SITE_URL).hostname;
const markdownType = 'text/markdown; charset=utf-8';
const hiddenPath = (pathname) => /^\/(?:admin|search|404)(?:\/|\.html$|$)/.test(pathname);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const publicHost = url.hostname === siteHost || url.hostname === `www.${siteHost}`;
    if (url.protocol === 'http:' || url.hostname === `www.${siteHost}`) {
      url.protocol = 'https:';
      if (publicHost) {
        url.hostname = siteHost;
        url.port = '';
      }
      const headers = new Headers({ Location: url.href });
      if (!publicHost) headers.set('X-Robots-Tag', 'noindex, follow');
      return new Response(null, { status: 308, headers });
    }

    const directMarkdown = /\.md$/i.test(url.pathname);
    const pagePath = !/\.[^/]+$/.test(url.pathname);
    const accepts = new Negotiator({ headers: { accept: request.headers.get('Accept') || '*/*' } });
    const wantsMarkdown = ['GET', 'HEAD'].includes(request.method) && pagePath && !hiddenPath(url.pathname)
      && accepts.mediaType(['text/html; charset=utf-8', markdownType]) === markdownType;
    const probe = new Request(request);
    if (wantsMarkdown) {
      for (const header of ['If-None-Match', 'If-Modified-Since', 'Range', 'If-Range']) probe.headers.delete(header);
    }
    let response = await env.ASSETS.fetch(probe);
    let negotiatedMarkdown = false;
    if (wantsMarkdown && response.status === 200 && /^text\/html\b/i.test(response.headers.get('Content-Type') || '')) {
      const target = new URL(url);
      target.pathname = `${url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`}index.md`;
      target.search = '';
      try {
        const candidate = await env.ASSETS.fetch(new Request(target, request));
        if ([200, 206, 304].includes(candidate.status) && !/^text\/html\b/i.test(candidate.headers.get('Content-Type') || '')) {
          await response.body?.cancel();
          response = candidate;
          negotiatedMarkdown = true;
        } else {
          await candidate.body?.cancel();
        }
      } catch {
        console.error('Markdown asset fetch failed', { pathname: url.pathname });
      }
    }

    const headers = new Headers(response.headers);
    const markdown = negotiatedMarkdown || (directMarkdown && [200, 206, 304].includes(response.status));
    if (pagePath || markdown || /^text\/html\b/i.test(headers.get('Content-Type') || '')) {
      const vary = (headers.get('Vary') || '').split(',').map((value) => value.trim()).filter(Boolean);
      if (!vary.some((value) => /^(?:accept|\*)$/i.test(value))) vary.push('Accept');
      headers.set('Vary', vary.join(', '));
    }
    if (markdown) {
      if (!/^multipart\//i.test(headers.get('Content-Type') || '')) headers.set('Content-Type', markdownType);
      const canonical = new URL(SITE_URL);
      canonical.pathname = negotiatedMarkdown
        ? (url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`)
        : url.pathname.replace(/index\.md$/i, '');
      headers.set('Link', `<${canonical.href}>; rel="canonical", <${SITE_URL}/llms.txt>; rel="describedby"; type="text/plain"`);
    }
    if (!publicHost || hiddenPath(url.pathname) || directMarkdown || url.pathname === '/llms.txt' || response.status >= 400) {
      headers.set('X-Robots-Tag', 'noindex, follow');
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
