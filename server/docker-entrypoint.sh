#!/bin/bash
set -e

# ストレージリンク作成
php artisan storage:link

php artisan config:cache


# Apache起動
exec apache2-foreground