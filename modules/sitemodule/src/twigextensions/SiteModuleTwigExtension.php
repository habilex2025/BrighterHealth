<?php

namespace modules\sitemodule\twigextensions;

use Craft;
use craft\helpers\StringHelper;
use craft\helpers\UrlHelper;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class SiteModuleTwigExtension extends AbstractExtension
{
    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'SiteModule';
    }

    /**
     * @inheritdoc
     */
    public function getFilters()
    {
        return [
            new TwigFilter('simpleText', [$this, 'simpleText']),
            new TwigFilter('deOrphan', [$this, 'deOrphanString']),
        ];
    }

    /**
     * @inheritdoc
     */
    public function getFunctions()
    {
        return [
            new TwigFunction('isExternal', [$this, 'isExternal']),
            new TwigFunction('srLink', [$this, 'srLink']),
            new TwigFunction('generateVideoEmbedUrl', [$this, 'generateVideoEmbedUrl']),
            new TwigFunction('generateVideoThumbnail', [$this, 'generateVideoThumbnail']),
            new TwigFunction('customPageContent', [$this, 'customPageContent']),
        ];
    }

    /**
     * Load the <main> fragment from public_html/custom/{handle}/index.html
     * and rewrite relative asset URLs for seamless inline embedding.
     */
    public function customPageContent(?string $handle): ?string
    {
        if ($handle === null || $handle === '') {
            return null;
        }

        $handle = trim($handle, '/');

        if (!preg_match('/^[a-z0-9][a-z0-9\-]*$/i', $handle)) {
            return null;
        }

        $path = Craft::getAlias('@webroot') . '/custom/' . $handle . '/index.html';

        if (!is_readable($path)) {
            return null;
        }

        $html = file_get_contents($path);

        if ($html === false || !preg_match('/<main\b[^>]*>(.*)<\/main>/is', $html, $matches)) {
            return null;
        }

        $content = $matches[1];
        // rootRelativeUrl respects the site base path; keep a single trailing slash for concatenation.
        $base = rtrim(UrlHelper::rootRelativeUrl('custom/' . $handle), '/') . '/';

        // Rewrite relative src/href/poster/data-src paths onto the package directory.
        $content = preg_replace_callback(
            '/(\s)(src|href|poster|data-src)(\s*=\s*)(["\'])(?!https?:|\/\/|\/|#|data:|mailto:|tel:|javascript:)([^"\']+)\4/i',
            static function (array $match) use ($base): string {
                $path = preg_replace('#^\./#', '', $match[5]);
                return $match[1] . $match[2] . $match[3] . $match[4] . $base . $path . $match[4];
            },
            $content
        );

        // Also rewrite relative URLs inside srcset attributes.
        $content = preg_replace_callback(
            '/(\s)srcset(\s*=\s*)(["\'])([^"\']+)\3/i',
            static function (array $match) use ($base): string {
                $srcset = preg_replace_callback(
                    '/(?:^|,)\s*([^\s,]+)(\s+[^,]+)?/',
                    static function (array $part) use ($base): string {
                        $url = $part[1];
                        $descriptor = $part[2] ?? '';
                        if (preg_match('#^(?:https?:|//|/|#|data:)#i', $url)) {
                            return $part[0];
                        }
                        $url = preg_replace('#^\./#', '', $url);
                        $prefix = str_starts_with(ltrim($part[0]), ',') ? ',' : '';
                        return $prefix . ' ' . $base . $url . $descriptor;
                    },
                    $match[4]
                );
                return $match[1] . 'srcset' . $match[2] . $match[3] . trim($srcset) . $match[3];
            },
            $content
        );

        return $content;
    }

    public function simpleText($string)
    {
        $tags_to_strip = ['p', 'font', 'small', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        foreach ($tags_to_strip as $tag) {
            $string = preg_replace("/<\\/?" . $tag . "(.|\\s)*?>/", '', $string);
        }
        return $string;
    }

    public function deOrphanString($string, $count = 1)
    {
        $words = explode(' ', $string);
        if (count($words) < 2) return $string;
        $lastWords = [];
        for ($i = 0; $i < $count; $i++) {
            $lastWords[] = array_pop($words);
        }
        $newString = implode(' ', $words);
        foreach ($lastWords as $word) {
            $newString .= '&nbsp;' . $word;
        }
        return $newString;
    }

    public function isExternal($url) {
        $siteUrl = parse_url(UrlHelper::siteUrl())['host'];
        $components = parse_url($url);
        if ( empty($components['host']) ) return false;  // we will treat url like '/relative.php' as relative
        if ( strcasecmp($components['host'], $siteUrl) === 0 ) return false; // url host looks exactly like the local host
        return strrpos(strtolower($components['host']), '.' . $siteUrl) !== strlen($components['host']) - strlen('.' . $siteUrl); // check if the url host is a subdomain
    }

    public function srLink($url, $target='') {
        $srText = '';
        $sep = '';

        if ($this->isExternal($url)) {
            $srText = $srText . $sep . 'an external website';
            $sep = ' ';
        }

        if ($target == 'blank' || stristr($target, 'blank')) {
            $srText = $srText . $sep . 'in a new window';
            $sep = ' ';
        }

        if (strlen($srText)) {
          $srText = '(opens ' . $srText . ')';
        }

        return '<span class="visually-hidden">' . $srText . '</span>';
    }

    public function isYoutube($url = null) {
        if(strpos($url, 'youtube.com/') !== false)
            return true;
        if(strpos($url, 'youtu.be/') !== false)
            return true;
        return false;

    }

    public function isVimeo($url = null) {
        if(strpos($url, 'vimeo.com/') !== false)
            return true;
        return false;
    }

    public function getYoutubeId($url = null)
    {
        if (preg_match("/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user|shorts)\/))([^\?&\"'>]+)/", $url, $result)){
            return $result[1];
        }
        return '';
    }

    public function getVimeoId($url = null)
    {
        if(preg_match("/(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/?(showcase\/)*([0-9))([a-z]*\/)*([0-9]{6,11})[?]?.*/", $url, $output_array)) {
            return $output_array[6];
        }
        return '';
    }

    public function getVimeoHash($url = null)
    {

      // Get hash from query string
      $querystring = parse_url($url, PHP_URL_QUERY);
      parse_str($querystring, $vars);
      if (isset($vars['h'])) {
        return $vars['h'];
      }

      // Search URL segments for hash
      preg_match('/^https?:\/\/(www\.)?vimeo.com\/(channels\/[a-zA-Z0-9]*\/)?(?<id>[0-9]*)(\/(?<hash>[a-zA-Z0-9]+))?(\#t=(\d+)s)?$/', $url, $matches);
      if (isset($matches['hash'])) {
        return $matches['hash'];
      }

      return '';
    }

    public function generateYoutubeEmbedUrl($url = null, $params = [])
    {
        return 'https://www.youtube.com/embed/' . $this->getYoutubeId($url) . $this->generateParamsString($params);
    }

    public function generateVimeoEmbedUrl($url = null, $params = [])
    {
        $hash = $this->getVimeoHash($url);
        if ($hash) $params['h'] = $hash;
        return 'https://player.vimeo.com/video/' . $this->getVimeoId($url) . $this->generateParamsString($params);
    }

    public function generateParamsString($params = []) {
        $urlParams = '';
        $sep = '?';
        foreach ($params as $key => $param) {
            $urlParams .= $sep . $key . '=' . $param;
            $sep = '&';
        }
        return $urlParams;
    }

    public function getVideoId($url = null) {
        if ($this->isYoutube($url)) {
            return $this->getYoutubeId($url);
        }
        if ($this->isVimeo($url)) {
            return $this->getVimeoId($url);
        }
        return '';
    }

    public function generateVideoEmbedUrl($url = null, $params = [])
    {
        if ($this->isYoutube($url)) {
            return $this->generateYoutubeEmbedUrl($url, $params);
        }
        if ($this->isVimeo($url)) {
            return $this->generateVimeoEmbedUrl($url, $params);
        }
        return '';
    }

    public function generateVideoThumbnail($url = null)
    {

        // youtube
        if ($this->isYoutube($url)) {
            $id = $this->getVideoId($url);
            return 'https://img.youtube.com/vi/' . $id . '/hqdefault.jpg';
        }

        // vimeo
        if ($this->isVimeo($url)) {

            $options = array(
                CURLOPT_URL => 'https://vimeo.com/api/oembed.json?url=' . urlencode($url) . '&width=960',
                CURLOPT_RETURNTRANSFER => TRUE,
            );

            $curl = curl_init();
            curl_setopt_array($curl, $options);
            $result = curl_exec($curl);
            curl_close($curl);
            $json = json_decode($result);
            $thumbnail = $json->thumbnail_url;
            return $thumbnail;
        }

        return null;

    }
}
