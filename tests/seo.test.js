import { serializeJsonLd } from '../src/lib/seo';

test('JSON-LD stays inert when article text contains HTML script delimiters', () => {
  const headline = 'Boat guide </script><script>window.injected = true</script> & sailing';
  const html = `<script type="application/ld+json">${serializeJsonLd({ headline })}</script>`;
  const document = new DOMParser().parseFromString(html, 'text/html');
  expect(document.querySelectorAll('script')).toHaveLength(1);
  expect(JSON.parse(document.querySelector('script').textContent).headline).toBe(headline);
});
