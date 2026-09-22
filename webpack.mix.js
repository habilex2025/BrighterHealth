const mix = require('laravel-mix');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');

mix
  .js('src/js/app.js', 'js/app.js')
  .sass('src/scss/app.scss', 'css/')
  .sass('src/scss/cp.scss', 'css/')
  .options({
    terser: {
      extractComments: false,
    },
  });

mix.webpackConfig({
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/images',
          to: 'images',
        },
      ],
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 80,
        }),
      ],
    }),
    new SVGSpritemapPlugin('src/icons/**/*.svg', {
      output: {
        filename: 'images/icons/sprite.svg',
        chunk: {
          keep: true,
        },
        svg: {
          sizes: true,
        },
        svgo: {
          plugins: [
            {
              name: 'addAttributesToSVGElement',
              params: {
                attributes: [
                  {
                    width: '0',
                  },
                  {
                    height: '0',
                  },
                  {
                    style: 'position:absolute;pointer-events:none',
                  },
                ],
              },
            },
          ],
        },
      },
      sprite: {
        prefix: '',
        generate: {
          title: true,
        },
      },
      styles: {
        filename: './src/scss/_sprites.scss',
      },
    }),
    new StylelintPlugin({
      files: './src/scss/**/*.scss',
      fix: true,
      configFile: './.stylelintrc',
    }),
    new ESLintPlugin({
      files: './src/js/**/*.js',
      fix: true,
    }),
    new PrettierPlugin({
      configFile: './.prettierrc',
    }),
  ],
});

mix.extract().sourceMaps().setPublicPath('public_html');

if (!mix.inProduction()) {
  mix.browserSync({
    proxy: 'brighterhealth.test',
    notify: false,
    open: false,
    files: ['public_html/css/**/*.css', 'public_html/js/**/*.js', 'templates/**/*'],
  });
}

if (mix.inProduction()) {
  mix.version();
}
