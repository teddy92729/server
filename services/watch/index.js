import ytdlp  from "youtube-dl-exec";
import {fileURLToPath} from "url";
import os from "os";
const ytdl=(os.platform()==="linux")?ytdlp:ytdlp.create(fileURLToPath(new URL("./yt-dlp", import.meta.url)));

export async function GET(req,res,url){
    let videoID=url.searchParams.get("v");
    try{
        if(req.headers.accept==="*/*"){
                let video=ytdl.exec(`https://www.youtube.com/watch?v=${videoID}`,{
                    output: "-",
                    format: "bv[height<=1100]+ba/b",
                    externalDownloader: (os.platform()==="linux")?"ffmpeg":fileURLToPath(new URL("./ffmpeg", import.meta.url)),
                    postprocessorArgs: "Merger+ffmpeg_i0:'-movflags +faststart -maxrate 5M -bufsize 10M',Merger+ffmpeg_o:'-movflags +faststart'",
                });
                
                res.on("close",()=>{video.kill();});  
                res.writeHead(200, {
                    "Content-Type": "video/webm",
                });
                video.stdout.pipe(res);    
        }else{
            res.writeHead(200, {
                "Content-Type": "video/webm",
            });
            res.end();           
        }
    }catch(err){
        console.error(err);
    }
}