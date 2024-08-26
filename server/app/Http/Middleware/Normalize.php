<?php

namespace App\Http\Middleware;

use Closure;

class Normalize
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $url = $_SERVER['REQUEST_URI']; // PHP 標準のリクエストを使用
        $normalized = $this->normalize($url);
        if ($url != $normalized) {
            header('Location: ' . $normalized, true, 301); // PHP 標準のリダイレクトを使用
            exit();
        }

        $response = $next($request);
        $content = $response->getContent();

        // 参考: http://piyopiyocs.blog115.fc2.com/blog-entry-636.html
        $regex = '(' . preg_quote(config('app.url'), "/") . '[-_.!~*\'()a-zA-Z0-9;/?:@&=+$,%#]*)';
        $content = preg_replace_callback(
            $regex,
            function ($url) {
                return $this->normalize($url[0]);
            },
            $content
        );

        $response->setContent($content);
        return $response;
    }

    private function normalize($url)
    {
        $elements = ['scheme', 'host', 'path', 'query', 'fragment'];

        $isHtmlEncoded = $url !== ($decoded = htmlspecialchars_decode($url));
        $url = $decoded;
        $parsed = parse_url($url);
        foreach ($elements as $element) {
            $parsed[$element] = $parsed[$element] ?? '';
        }
        parse_str($parsed['query'], $params);
        preg_match('/(.*)\/(.*)/', $parsed['path'], $matches);
        $dirname = $matches[1] ?? '';
        $dirname .= '/';
        $basename = $matches[2] ?? '';

        // パス末尾に / を追加
        if ($basename !== '' && mb_strpos($basename, '.') === false) {
            $dirname .= $basename . '/';
            $basename = '';
        }
        // index.* を削除
        $basename = preg_replace('/^index\.(.*)/', '', $basename);
        // パスの // -> / 置き換え
        $dirname = preg_replace('/\/\/+/', '/', $dirname);
        // クエリ並び替え
        ksort($params);

        $parsed['scheme'] .= empty($parsed['scheme']) ? '' : '://';
        $parsed['query'] = empty($params) ? '' : '?' . http_build_query($params);
        $parsed['fragment'] = empty($parsed['fragment']) ? '' : '#' . $parsed['fragment'];
        $parsed['path'] = $dirname . $basename;
        $url = '';
        foreach ($elements as $element) {
            $url .= $parsed[$element];
        }
        $url = $isHtmlEncoded ? htmlspecialchars($url) : $url;
        return $url;
    }
}
