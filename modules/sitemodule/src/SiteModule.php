<?php

namespace modules\sitemodule;

use modules\sitemodule\twigextensions\SiteModuleTwigExtension;

use Craft;
use craft\web\View;
use craft\web\twig\variables\CraftVariable;
use yii\base\Module;
use yii\base\Event;

class SiteModule extends Module
{
    public function init()
    {
        Craft::setAlias('@modules/sitemodule', __DIR__);

        $this->controllerNamespace = 'modules\sitemodule\controllers';

        parent::init();

        // add in twig extension
        if (Craft::$app->request->getIsSiteRequest()) {
            $extension = new SiteModuleTwigExtension();
            Craft::$app->view->registerTwigExtension($extension);
        }
        
        $this->addCpEnvironmentTag();
        $this->addDoTrackingVariable();
    }
    
    private function addCpEnvironmentTag()
    {    
        Event::on(
            View::class,
            View::EVENT_BEFORE_RENDER_TEMPLATE,
            function (Event $event) {
                // show the env tag if it's not in production or if it's not in a dev environment but it is in dev mode
                if (Craft::$app->getRequest()->getIsCpRequest()) {
                    $tag = '';
                    $env = getenv('ENVIRONMENT');
                    if ($env !== 'production') $tag = $env;
                    if ($env !== 'dev' && Craft::$app->getConfig()->getGeneral()->devMode) $tag .= (strlen($tag) ? ' - ' : '') . 'Dev Mode On';
                    if (strlen($tag)) {
                        $customHtml = '<div class="cp-env-tag">' . $tag . '</div>
                            <style>
                            .cp-env-tag {
                                background: yellow;
                                color: black;
                                opacity: .8;
                                padding: 12px 12px;
                                position: fixed;
                                bottom: 0;
                                left: 0;
                                z-index: 100;
                                text-transform: uppercase;
                                font-weight: 700;
                                pointer-events: none;
                                width: 226px;
                                text-align: center;
                            }
                            </style>';
                        Craft::$app->getView()->registerHtml($customHtml);
                    }
                }
            }
        );
    }
    
    private function addDoTrackingVariable()
    {
        Event::on(
            CraftVariable::class,
            CraftVariable::EVENT_INIT,
            function (Event $event) {
                /** @var CraftVariable $variable */
                $variable = $event->sender;

                // Add a custom variable
                $variable->set('doTracking', function() {
                    $doTracking = getenv('ENVIRONMENT') == 'production';
                    $isMonitor = (Craft::$app->getRequest()->getParam('monitor') == '1') ?? false;
                    if ($isMonitor) $doTracking = false;
                    $currentUser = Craft::$app->getUser()->getIdentity() ?? null;
                    if ($currentUser && $currentUser->id == 1) $doTracking = false;
                    return $doTracking;
                });
            }
        );
    }
}
