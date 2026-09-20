# DeviNull portfolio

A cinematic, responsive cybersecurity portfolio built as a dependency-free static site. It is ready to put in a GitHub repository and deploy with AWS Amplify.

## Preview locally

Open `index.html` in a browser, or serve this folder with any static web server.

## Before publishing

1. Replace `hello@example.com` in `index.html` with the desired contact address.
2. Replace the two in-progress project cards with real projects and links.
3. Review the footer year and the personal/about copy.
4. Add the folder to a new GitHub repository, then deploy it in AWS Amplify as a static site.

## Intelligence panel

The vulnerability watch uses the public FIRST EPSS API when available, and safely falls back to example public CVE cards if the browser cannot reach it. The map is intentionally labelled as *illustrative regional signals* rather than a claim of tracking live attacks.

For a production threat dashboard, add a server-side AWS function that fetches and caches approved sources. Do not put API keys in frontend JavaScript.

## GitHub project stream

The **Load repositories** button reads only public, non-forked, non-archived repositories from `github.com/sahitiop` using GitHub's public API. It intentionally requires no token and never exposes private repositories. GitHub may temporarily limit unauthenticated requests; the page shows a retry state if that happens.
