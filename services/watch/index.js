import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = fileURLToPath(new URL("./", import.meta.url));

export async function GET(req, res, url) {
    let videoID = url.searchParams.get("v");
    let type = url.searchParams.get("type");

    if (req.headers.accept === "*/*") {
        switch (type) {
            case "v": {
                let video = spawn("yt-dlp", [
                    "--config-locations", "yt-dlp.v.cfg",
                    "-o", "-",
                    `https://www.youtube.com/watch?v=${videoID}`
                ], { cwd: __dirname },);

                res.on("finish", () => { video.kill("SIGINT"); });
                res.on("close", () => { video.kill("SIGINT"); });
                res.writeHead(200, {
                    "Content-Type": "video/webm",
                    "Connection": "close",
                });
                video.stdout.pipe(res);
                break;
            }
            case "a": {
                let video = spawn("yt-dlp", [
                    "--config-locations", "yt-dlp.a.cfg",
                    "-o", "-",
                    `https://www.youtube.com/watch?v=${videoID}`
                ], { cwd: __dirname },);

                res.on("finish", () => { video.kill("SIGINT"); });
                res.on("close", () => { video.kill("SIGINT"); });
                res.writeHead(200, {
                    "Content-Type": "video/webm",
                    "Connection": "close",
                });
                video.stdout.pipe(res);
                break;
            }
            default: {
                res.end("Unkown Type");
                break;
            }
        }
    } else if (videoID && !type) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <html>
                <head>
                    <meta name="viewport" content="width=device-width">
                </head>
                <body bgcolor="black">
                    <video id="playback_v" name="media" style="display: none;" preload="metadata">
                        <source src="./watch?v=${videoID}&type=v" type="video/webm">
                    </video>
                    <video id="playback_a" name="media" style="display: none;" preload="metadata">
                        <source src="./watch?v=${videoID}&type=a" type="video/webm">
                    </video>
                    <script type="text/javascript">
                        let video=document.querySelector("#playback_v");
                        let audio=document.querySelector("#playback_a");
                        function readyState(videoElement){
                            return new Promise((r)=>{
                                const video=videoElement;
                                if(video.readyState===4)
                                  r(video);
                                else
                                  video.addEventListener("loadedmetadata",()=>{r(video);});
                              });
                        }
                        (async function(){
                            await readyState(video);
                            await readyState(audio);
                            video.play();
                            audio.play();
                            setInterval(()=>{
                                console.log(audio.currentTime-video.currentTime);
                            },5000);
                        })();
                    </script>
                    <script type="text/javascript" src="https://teddy92729.github.io/elementCreated.js"></script>
                    <script type="text/javascript" src="https://pixijs.download/release/pixi.js"></script>
                    <script type="text/javascript" src="https://teddy92729.github.io/anime4k_Deblur_DoG%20-%20test.js"></script>
                </body>
            </html>
        `);
    } else {
        res.writeHead(200, { "Content-Type": "video/webm" });
        res.end();
    }
}

export async function OPTIONS(req, res, url) {
    res.writeHead(200);
    res.end();
}