const fs = require('fs');
const inlineCss = require('inline-css');

var templatesDir = 'templates/_email/templates/';
var templatesInlinedDir = 'templates/_email/templates/inlined/';

fs.readdir(templatesDir, function (err, files) {
  if (err) {
    console.error('Could not list the directory.', err);
    process.exit(1);
  }

  files.forEach(function (file, index) {
    if (file.includes('.html')) {
      fs.readFile(templatesDir + file, 'utf8', function (err, html) {
        if (err) {
          console.error('Could not read the file.', err);
          process.exit(1);
        }
        inlineCss(html, {
          url: '-',
          applyStyleTags: true,
          applyLinkTags: true,
          removeStyleTags: false,
          removeLinkTags: false,
        }).then(function (html) {
          fs.writeFile(templatesInlinedDir + file, html, function (err) {
            if (err) {
              console.error('Could not write the file.', err);
              process.exit(1);
            }
          });
        });
      });
    }
  });
});
