# AURUM

A dependency-free landing page for a fictional luxury watch house. One HTML file
carries the markup, styles and scripts. A small Node server serves it and collects
waitlist signups as newline-delimited JSON. Python, Java and TypeScript tools sit
beside it for reporting, validation and pricing.

## Run

```bash
npm start            # http://localhost:3000
npm run price        # TypeScript quote demo (needs Node 18+, fetches tsx)
npm run report       # Python lead summary (Python 3.8+)
npm run check        # Java lead validation (JDK 11+)
```

Run the Python and Java tools from the project root, after at least one signup.

## API

| Method | Path          | Result                          |
|--------|---------------|---------------------------------|
| GET    | /api/products | JSON array of watches           |
| POST   | /api/lead     | 201 on save, 400 on bad input   |

## Design notes

- Canvas particles pause when the user prefers reduced motion.
- Scroll reveals use IntersectionObserver instead of scroll listeners.
- Server code guards against path traversal, caps request bodies at 10 KB,
  and builds DOM nodes with textContent rather than innerHTML.

## References

Fielding, R., Nottingham, M., & Reschke, J. (2022). *HTTP semantics* (RFC 9110).
Internet Engineering Task Force. https://www.rfc-editor.org/info/rfc9110

MDN Web Docs. (n.d.). *Intersection Observer API*. Mozilla.
https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

OpenJS Foundation. (n.d.). *Node.js documentation: HTTP*. https://nodejs.org/api/http.html
