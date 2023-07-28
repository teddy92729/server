export function GET(req,res) {
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <link rel="preload" href="https://www.youtube.com/embed/dQw4w9WgXcQ">
            <title>【我推的孩子】 [12] 線上看 - 巴哈姆特動畫瘋</title>
            <meta property="og:title" content="【我推的孩子】 [12] 線上看 - 巴哈姆特動畫瘋" />
            <meta property="og:type" content="video.movie" />
            <meta property="og:image" content="https://godlike-ahoge.ddns.net/0000128085.JPG" />
        </head>
        <body bgcolor="black">
            <iframe width="1561" height="695" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="【我推的孩子】 [12] 線上看 - 巴哈姆特動畫瘋" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" sandbox="allow-scripts" allowfullscreen></iframe>
        </body>
    </html>
    `);
}