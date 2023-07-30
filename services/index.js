export function GET(req,res) {
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="refresh" content="1; url=https://godlike-ahoge.ddns.net/watch?v=dQw4w9WgXcQ">
            <link rel="preload" href="https://godlike-ahoge.ddns.net/watch?v=dQw4w9WgXcQ">
            <title>【我推的孩子】 [12] 線上看 - 巴哈姆特動畫瘋</title>
            <meta property="og:title" content="【我推的孩子】 [12] 線上看 - 巴哈姆特動畫瘋" />
            <meta property="og:type" content="video.movie" />
            <meta property="og:image" content="https://godlike-ahoge.ddns.net/0000128085.JPG" />
        </head>
        <body bgcolor="black">
           <h1>優化線路中</h1>
        </body>
    </html>
    `);
}