# ベースイメージとして公式のUbuntuイメージを使用
FROM ubuntu:20.04

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y curl gnupg

# Node.jsをインストール
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs


# Gitをインストール（必要に応じて）
RUN apt-get update && apt-get install -y git

# Yarnをインストール
RUN npm install -g yarn

# nodemonをインストール
# RUN npm install -g nodemon

# 作業ディレクトリを設定
WORKDIR /var/www/client

RUN chmod +x /

# ポートの公開
EXPOSE 3000

# COPY . .

RUN yarn install

# 環境変数の設定
ENV NODE_ENV development

# アプリケーションの起動コマンド
CMD ["npm", "run", "dev"]


