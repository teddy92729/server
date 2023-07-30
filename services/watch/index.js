import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { error } from "console";

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
                video.on("error", console.error);

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
                video.on("error", console.error);

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
                    <video id="playback_v" name="media" style="display: block; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); height: unset; width: 100%"></video>
                    <audio id="playback_a" name="media" style="display: none;"> </audio>
                    <script type="text/javascript">
                        let video=document.querySelector("#playback_v");
                        let audio=document.querySelector("#playback_a");
                        
                        video.src="./watch?v=${videoID}&type=v"
                        audio.src="./watch?v=${videoID}&type=a"

                        let videoReady=new Promise((r)=>{
                            video.addEventListener("canplaythrough",()=>r());
                        });
                        let audioReady=new Promise((r)=>{
                            audio.addEventListener("canplaythrough",()=>r());
                        });

                        Promise.all([videoReady,audioReady]).then(()=>{
                            video.addEventListener("pause",()=>audio.pause());
                            video.addEventListener("play",()=>audio.play());

                            audio.play();
                            video.play();

                            setInterval(()=>{
                                console.log(audio.currentTime-video.currentTime);
                            },5000);
                        });
                        
                    </script>
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