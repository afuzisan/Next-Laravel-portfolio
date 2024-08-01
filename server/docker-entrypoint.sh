#!/bin/bash
set -e

# ストレージリンク作成
# php artisan storage:link

# 他の初期化タスク
# php artisan migrate --force
# php artisan config:cache
# など

# Apache起動
exec apache2-foreground