#!/bin/bash

# Register Service Worker and enable PWA
if [[ ! -f "public/sw.js" ]]; then
  mkdir -p public
  curl -s https://cdn.jsdelivr.net/npm/workbox-window/build/workbox-window.umd.js > public/workbox-window.js
fi

npm run build
