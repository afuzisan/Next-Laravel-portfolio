#!/bin/bash
set -e


php artisan config:cache

# 必要なディレクトリが存在しない場合は作成
mkdir -p /var/www/client/storage/

# 必要なディレクトリの権限を設定
chmod -R 777 /var/www/client/storage/

# Composerの依存関係をインストール
composer install --no-dev --optimize-autoloader

# Apache起動
exec apache2-foreground