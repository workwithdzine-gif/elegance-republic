# videos/

Background footage for the React landing route (`/landing`).

Drop the file in as **`hero-1.mp4`** — the markup already points at it, so no code
change is needed. Optionally add `hero-1.webm` beside it; the browser picks whichever
it can play, preferring the (smaller) webm.

Until a file exists here the `<video>` falls back to its poster,
`images/hero/hero-1.jpg`, so the page looks exactly as it did before.

## What to export

- **Silent.** The video is `muted` (browsers block autoplay with sound) — strip the
  audio track entirely rather than shipping bytes nobody hears.
- **Short + seamless.** It `loop`s. 8–15s that cuts back to its first frame cleanly.
- **Small.** Aim under ~5 MB. It is the first thing on the page and there is no
  loading state behind it. 1080p is plenty — it sits under a dark scrim and a
  `brightness(0.22)` filter, so fine detail is not visible anyway.
- **Poster matched to frame one.** Replace `images/hero/hero-1.jpg` with a still of
  the video's opening frame, or the swap from poster to footage will visibly jump.
