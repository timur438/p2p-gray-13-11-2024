import svgtofont from 'svgtofont'
import path from 'node:path'

await svgtofont({
  src: path.resolve('./icons'),
  dist: path.resolve('./src/assets/icons'),
  fontName: 'app-icons',
  excludeFormat: ['eot', 'symbol.svg'],
  emptyDist: true,
  css: {
    include: /\.css$/i,
    fontSize: false,
    fileName: 'icons',
    cssPath: './',
  },
  classNamePrefix: 'i',
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true,
    round: 1000,
  },
})
