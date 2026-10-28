"""Dependency-free static-route, anchor, metadata and asset check."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids, self.meta, self.duplicates = [], set(), {}, []
        self.h1 = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        identity = attrs.get('id')
        if identity:
            if identity in self.ids:
                self.duplicates.append(identity)
            self.ids.add(identity)
        self.h1 += tag == 'h1'
        if tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property', ''))] = attrs.get('content', '')
        if tag in ('a', 'link', 'script', 'img'):
            url = attrs.get('href', attrs.get('src'))
            if url:
                self.links.append(url)


def main():
    pages = {path: Page() for path in ROOT.rglob('*.html') if '.git' not in path.parts}
    errors = []
    for path, page in pages.items():
        page.feed(path.read_text())
    for path, page in pages.items():
        name = str(path.relative_to(ROOT))
        if page.h1 != 1:
            errors.append(f'{name}: expected one h1, found {page.h1}')
        if page.duplicates:
            errors.append(f'{name}: duplicate IDs {page.duplicates}')
        if path.name != '404.html':
            for field in ('description', 'og:title', 'og:description', 'og:url', 'og:image', 'twitter:card'):
                if not page.meta.get(field):
                    errors.append(f'{name}: missing {field}')
        for url in page.links:
            parsed = urlsplit(url)
            if parsed.scheme or parsed.netloc:
                continue
            route = unquote(parsed.path)
            target = ROOT / route.lstrip('/') if route.startswith('/') else path.parent / route if route else path
            if target.is_dir():
                target /= 'index.html'
            target = target.resolve()
            if not target.exists():
                errors.append(f'{name}: missing target {url}')
            elif parsed.fragment and target in pages and unquote(parsed.fragment) not in pages[target].ids:
                errors.append(f'{name}: missing anchor {url}')
    sitemap = ET.parse(ROOT / 'sitemap.xml')
    for location in sitemap.findall('.//{*}loc'):
        route = urlsplit(location.text).path
        target = ROOT / route.lstrip('/')
        if target.is_dir():
            target /= 'index.html'
        if not target.is_file():
            errors.append(f'sitemap: missing route {route}')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(pages)} pages; local links, anchors, assets, IDs, metadata, and sitemap routes.')


if __name__ == '__main__':
    main()
