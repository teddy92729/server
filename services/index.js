export function GET(req,res) {
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="refresh" content="5; url=https://www.youtube.com/watch?v=dQw4w9WgXcQ">
            <link rel="preload" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
            <title>優化連線中</title>
        </head>
        <body>
            <h1>載入中...</h1>
        </body>
    </html>
    `);
}