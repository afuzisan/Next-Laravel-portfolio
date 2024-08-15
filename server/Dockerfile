# どんなdockerイメージを利用して構築をするか
FROM php:8.2-apache

RUN cd /etc/apache2/mods-enabled \
    && ln -s ../mods-available/rewrite.load

# 設定ファイルをdockerコンテナ内のPHP、Apacheに読み込ませる
COPY 000-default.conf /etc/apache2/sites-enabled/

# Composerのインストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ミドルウェアインストール
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    vim \
    libpng-dev \
    libpq-dev \
    libfreetype6-dev \
    libjpeg-dev \
    libonig-dev \
    iputils-ping \
    && docker-php-ext-install pdo pdo_mysql mysqli zip \
    && docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include \
    && docker-php-ext-install -j$(nproc) gd

ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_HOME /composer
ENV PATH $PATH:/composer/vendor/bin

RUN composer self-update --2
RUN composer require fruitcake/laravel-cors

# Node.jsのインストール
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update --fix-missing \
    && apt-get install -y nodejs \
    && npm install -g npm

WORKDIR /var/www/
RUN mkdir -p /var/www/storage /var/www/bootstrap/cache

# ソースコードコピー（コメントアウト解除）
COPY . /var/www/

# パーミッション設定
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# PHP設定ファイルのコピー
COPY php.ini /usr/local/etc/php/

# エントリーポイントスクリプト追加
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["apache2-foreground"]