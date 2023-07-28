import ytdlp  from "youtube-dl-exec";
import {fileURLToPath} from "url";
import os from "os";
const ytdl=(os.platform()==="linux")?ytdlp:ytdlp.create(fileURLToPath(new URL("./yt-dlp", import.meta.url)));

export async function GET(req,res,url){
    let videoID=url.searchParams.get("v");
    let type=url.searchParams.get("type");
    if(req.headers.accept==="*/*"){
            if(type!=="a"){
                let video=ytdl.exec(`https://www.youtube.com/watch?v=${videoID}`,{
                    output: "-",
                    format: "bv[height<=1100]",
                    externalDownloader: (os.platform()==="linux")?"aria2c":fileURLToPath(new URL("./aria2c", import.meta.url)),
                    externalDownloaderArgs: "-j 3 -x 9 -k 1M --referer *",
                });
                video.on("error",(err)=>console.error(err));
                res.on("close",()=>{video.kill("SIGINT");});
                res.writeHead(200, {
                    "Content-Type": "video/webm",
                    "Connection": "close",
                });
                video.stdout.pipe(res);                    
            }else{
                let audio=ytdl.exec(`https://www.youtube.com/watch?v=${videoID}`,{
                    output: "-",
                    format: "ba",
                    externalDownloader: (os.platform()==="linux")?"aria2c":fileURLToPath(new URL("./aria2c", import.meta.url)),
                    externalDownloaderArgs: "-j 3 -x 9 -k 1M --referer *",
                });
                audio.on("error",(err)=>console.error(err));
                res.on("close",()=>{audio.kill("SIGINT");});
                res.writeHead(200, {
                    "Content-Type": "audio/webm",
                    "Connection": "close",
                });
                audio.stdout.pipe(res);
            }
    }else if(videoID&&!type){
        res.writeHead(200,{"Content-Type":"text/html"});
        res.end(`
            <html>
                <head>
                    <meta name="viewport" content="width=device-width">
                </head>
                <body bgcolor="black">
                    <video id="playback_v" name="media" style="display: none;" autoplay="true" muted="true">
                        <source src="${(new URL(`/watch?v=${videoID}&type=v`,url.href)).href}" type="video/webm">
                    </video>
                    <video id="playback_a" name="media" style="display: none;" autoplay="true" muted="true">
                        <source src="${(new URL(`/watch?v=${videoID}&type=a`,url.href)).href}" type="video/webm">
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
                        video.pause();
                        audio.pause();
                        (async function(){
                            await readyState(video);
                            await readyState(audio);
                            video.play();
                            audio.play();
                            audio.muted=false;
                        })();
                    </script>
                    <script type="text/javascript" src="https://teddy92729.github.io/elementCreated.js"></script>
                    <script type="text/javascript" src="https://pixijs.download/release/pixi.js"></script>
                    <script type="text/javascript" src="https://teddy92729.github.io/anime4k_Deblur_DoG%20-%20test.js"></script>
                </body>
            </html>
        `);
    }else{
        res.writeHead(200,{"Content-Type":"video/webm"});
        res.end();
    }
}