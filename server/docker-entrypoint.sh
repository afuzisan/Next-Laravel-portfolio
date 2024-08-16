#!/bin/bash
set -e

# ストレージリンク作成
php artisan storage:link

# 他の初期化タスク
php artisan migrate --force  # マイグレーションを実行

php artisan config:cache


# Apache起動
exec apache2-foreground