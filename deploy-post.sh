# In here is where you want to do actions after symlinking has happened.
# We've gone ahead and added the FPM reload to this part of the deploy script, this is a perfect spot to reload your queue worker as well.

echo "♻️ Flush PHP FPM and caches..."
{FLUSH_FASTCGI_CACHE}
{FLUSH_CLOUDFLARE_CACHE}
{RELOAD_PHP_FPM}

# echo "♻️ Clearing Craft CMS caches..."
# php craft clear-caches/compiled-templates
# php craft clear-caches/compiled-classes
# php craft clear-caches/cp-resources
# php craft clear-caches/data
# php craft gc
