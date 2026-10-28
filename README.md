# DeviNull portfolio

A responsive cybersecurity portfolio for Kanumuri Sridevi Thrivedya Sahiti, built as a dependency-free static site. The visual direction pairs a cinematic dark interface with motion, a custom pointer on desktop, and an animated illustrative signal map.

## Preview

Open `index.html` in a browser, or serve this folder with any static web server. The site does not need a build step or package installation.

## Publish with GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Choose **Deploy from a branch**, then select `main` and `/ (root)`.
3. Keep `sridevi.qd.je` in the repository root `CNAME` file and in the Pages custom-domain field.
4. In the DigitalPlat DNS settings, point the root domain to the GitHub Pages records and set `www` as a CNAME to `sahitiop.github.io`. Follow GitHub's current [custom-domain DNS instructions](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) for the exact records.
5. Once GitHub reports the DNS check as successful and provisions TLS, enable **Enforce HTTPS** in Pages settings.

GitHub Pages provides free static hosting for public repositories. This site has no server-side components or private credentials.

## Live sections

- **GitHub projects:** loads up to six recent public, non-forked, non-archived repositories from `github.com/sahitiop`. It requires no access token. GitHub may rate-limit anonymous API requests; the page includes a retry control.
- **EPSS signals:** loads the three highest-scoring public records from FIRST's [EPSS API](https://api.first.org/epss/). These scores estimate exploitation likelihood and do not confirm active attacks.
- **Security briefing:** loads recent public items from the FIRST news API. If the feed is unavailable, the panel links to the FIRST newsroom.
- **Signal map:** animated and illustrative. Its nodes and routes are decorative and do not show real incidents, locations, or telemetry.

The page supports reduced-motion preferences and includes mobile navigation and keyboard focus states.
