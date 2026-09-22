<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see craft\config\GeneralConfig
 */

return [
    '*' => [
        'defaultWeekStartDay' => 1,
        'enableCsrfProtection' => true,
        'omitScriptNameInUrls' => true,
        'cpTrigger' => 'cc',
        'securityKey' => craft\helpers\App::env('SECURITY_KEY'),
        'addTrailingSlashesToUrls' => true,
        'sendPoweredByHeader' => false,
        'allowAdminChanges' => false,
        'errorTemplatePrefix' => '_errors/',
        'enableGql' => false,
        'defaultCpLanguage' => 'en',
        'defaultCpLocale' => 'en-AU',
        'defaultSearchTermOptions' => array(
            'subLeft' => true,
            'subRight' => true,
        ),
        'aliases' => [
            '@web' => craft\helpers\App::env('BASE_URL'),
            '@baseUrl' => craft\helpers\App::env('BASE_URL'),
        ],
        'verificationCodeDuration' => 'P1W',
        'maxUploadFileSize' => 209715200,
        'asyncCsrfInputs' => true,
    ],

    'dev' => [
        'devMode' => true,
        'allowAdminChanges' => true,
        'disallowRobots' => true,
    ],

    'staging' => [
        'devMode' => true,
        'allowAdminChanges' => true,
        'disallowRobots' => true,
    ],

    'production' => [
        // 'devMode' => true,
        // 'allowAdminChanges' => true,
        'cacheDuration' => '0',
        'runQueueAutomatically' => false,
    ],
];
