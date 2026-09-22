<?php
namespace Deployer;

require 'recipe/craftcms.php';

// Config

set('repository', 'git@bitbucket.org:brighterdev/brighterhealth.git');

set('log_files', 'storage/logs/*.log');

set('shared_files', ['.env']);

set('shared_dirs', [
    'storage',
    'public_html/uploads',
    'public_html/cpresources',
]);

set('writable_dirs', [
    'config/project',
    'storage',
    'public_html/uploads',
    'public_html/cpresources'
]);

set('release_name', function () {
    return (string) run('date +"%Y-%m-%d--%H-%M-%S"');
});

// Hosts

host('prod')
    ->set('hostname', '45.32.240.184')
    ->set('remote_user', 'ploi')
    ->set('deploy_path', '/home/ploi/dev.brighterhealthdemo.brighterserver.com.au');

// Hooks

after('deploy:failed', 'deploy:unlock');

// Tasks

task('deploy:npm_install', function () {
    run('cd {{release_path}} && source ~/.nvm/nvm.sh && nvm install && nvm use && npm ci', ['tty' => true]);
})->desc('Install npm dependencies');

task('deploy:build_assets', function () {
    run('cd {{release_path}} && source ~/.nvm/nvm.sh && nvm use && npm run prod', ['tty' => true]);
})->desc('Build frontend assets');

task('deploy:verify_build', function () {
    $buildOutput = '{{release_path}}/public_html/css'; // Replace with the actual build output path
    if (!test("[ -d $buildOutput ]")) {
        throw new \RuntimeException("Build verification failed: $buildOutput does not exist.");
    }

    writeln('✅ Build process verified: Build output exists.');
})->desc('Verify the build process');

task('deploy:build', [
    'deploy:npm_install',
    'deploy:build_assets',
    'deploy:verify_build',
]);

task('deploy:cleanup_files', function () {
    $filesToRemove = [
        '.env.example',
        '.editorconfig',
        // '.eslintignore',
        // '.eslintrc',
        '.gitignore',
        // '.nvmrc',
        // '.phpuse',
        // '.prettierignore',
        // '.prettierrc',
        '.s3cfg',
        // '.stylelintrc',
        '.vscode',
        'sftp-upload-config.json.example',
        'sshgo.sh',
        'maintenance.md',
        'readme.md',
        'todo.md',
        'working.md',
        'scripts',
    ];

    foreach ($filesToRemove as $file) {
        run("rm -rf {{release_path}}/$file");
    }
})->desc('Remove unwanted files');

task('deploy:set_author', function () {
    $author = run('cd {{deploy_path}}/.dep/repo && git log -1 --pretty="%an <%ae>"');
    set('release_author', $author);
})->desc('Set release author as the commit author');

task('deploy:refresh', function () {
    $phpVersion = run('cat {{release_path}}/.phpuse');
    $phpFpmService = "php{$phpVersion}-fpm";
    run('sudo -n systemctl reload ' . $phpFpmService);
    run('sudo -n systemctl reload nginx');
})->desc('Refresh server processes');

task('deploy', [
    'deploy:info',
    'deploy:setup',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:set_author',
    // 'deploy:env',
    'deploy:shared',
    'deploy:writable',
    'deploy:build',
    'deploy:cleanup_files',
    'deploy:vendors',
    'craft:clear-caches/compiled-classes',
    'craft:migrate/all',
    'craft:project-config/apply',
    'craft:gc',
    // 'craft:clear-caches/all',
    'deploy:publish',
    'deploy:refresh',
]);
