# 投資家向けメモサイト
このプロジェクトは、Next.jsのLaravel Breezeアプリケーション、認証スターターキットをCloneして開発を開始しました。

使用したリポジトリはこちらです。

https://github.com/laravel/breeze-next

## 概要
日本株の個別銘柄を簡単に管理し、情報収集を効率化するための投資家向けメモサイトです。

投資家が時系列にメモしたデータを保管し、後から見直す際に、

どのような情報を基に投資判断を下したのかを振り返ることができるメモサイトです。

## コンセプト
約3900銘柄もある日本の上場企業の情報を集めるサイトは多く存在しますが、

それらの情報をユーザーが取捨選択し、管理して振り返り、次の投資に活かすようなサイトは少ないと感じています。

そこで、私自身が使うことを前提に、銘柄管理に必要だと感じた機能を実装したサイトです。

## アプリケーションの機能紹介

## 使用技術

- **フロントエンド**: Next.js/14 (App Router)、Tailwind CSS/3.4
- **バックエンド**: php/8.2、 Apache/2.4、Laravel/11.19
- **データベース**: MySQL/8
- **サーバー**:Ubuntu 20.4
- **scaffold** Laravel Breeze
- **インフラ**: sakuraVPS
- **ツール**: Docker、Git
- **外部API**: phantom.jsCloud
- **ライブラリ**:Three.js、draft-js、dnd-kit



## ER 図
![スクリーンショット 2024-08-25 213129](https://github.com/user-attachments/assets/0693c131-0ba7-41bc-ac17-d793b925cfe3)

## インフラ構成図

## 実装できてない所
- **SSL化**:
- **Reduxを使ったフロントエンドのリファクタリング**:
- **テストの実装**:
