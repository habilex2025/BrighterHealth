const fs = require('fs');
const chalk = require('chalk');
const Client = require('ssh2-sftp-client');

let rawdata = fs.readFileSync('sftp-upload-config.json');
let ftpDetails = JSON.parse(rawdata);

upload();

async function upload() {
  let client = new Client();

  let files = [
    'public_html/js/manifest.js',
    'public_html/js/vendor.js',
    'public_html/js/app.js',
    // 'public_html/js/cp.js',
    'public_html/css/app.css',
    'public_html/css/cp.css',
    'public_html/mix-manifest.json',
    'public_html/images/icons/sprite.svg',
  ];

  try {
    await client.connect({
      host: ftpDetails.host,
      port: ftpDetails.port,
      username: ftpDetails.user,
      password: ftpDetails.password,
      privateKey: fs.readFileSync(ftpDetails.ssh_key_file),
      passphrase: ftpDetails.ssh_key_passphrase,
    });

    for (var i = 0; i < files.length; i++) {
      await client.put(fs.createReadStream(files[i]), `${ftpDetails.remote_path}${files[i]}`);
      console.log(chalk.green('Uploaded: ') + chalk.whiteBright(files[i]));
    }

    client.end();
    console.log(chalk.green('Uploads complete'));
  } catch (err) {
    console.log(err);
  }
}
