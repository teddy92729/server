import { createReadStream } from "fs";
import fs from "fs/promises";
import mime from "mime";
import http from "http";
const http_port=5001;

const server=http.createServer(async function(req,res){
    let url=new URL(req.url,`http://localhost:${http_port}`);
    // console.log(url);
    let checkRes=true;
    try{
        const service = await import(`./services${url.pathname}/index.js`);
        console.log(req.url+" OK(s)");
        try{
            await service[req.method](req,res,url);
            checkRes=false;
        }catch(err){
            console.error(err);
        }
    }catch(err){
        try{
            let path=decodeURI(url.pathname);
            let {size}=await fs.stat(`./files${path}`);
            let type=mime.getType(`./files${path}`);
            console.log(req.url+" OK(f)");
            try {
                if (req.headers.range) {
                    let [start,end] = req.headers.range.replace(/bytes=/, "").split("-");
                    start = parseInt(start, 10);
                    end = end ? parseInt(start, 10) : size-1;
                    let chunksize = (end-start)+1;
                    let ctype=type?{"Content-Type":type}:{};
                    res.writeHead(206, {
                        "Content-Range": "bytes " + start + "-" + end + "/" + size,
                        "Accept-Ranges": "bytes", "Content-Length": chunksize,
                        ...ctype
                    });
                    createReadStream(`./files${path}`,{start:start,end:end}).pipe(res);
                }else{
                    res.writeHead(200);
                    createReadStream(`./files${path}`).pipe(res);                    
                }
                checkRes=false;
            }catch(err){
                console.error(err);
            }
        }catch(err){
            console.error(err);
            console.log(req.url+" Not Found");
            res.writeHead(404);
            res.end("404 Not Found");
        }
    }finally{
        if(checkRes&&!res.writableEnded){
            res.writeHead(500);
            res.end("500 Internal Server Error");
            console.log("500 Internal Server Error @"+url.pathname);
        }
    }
});
process.on('uncaughtException', function (err) {
    console.error("UncaughtExecption: ", err); 
});
server.listen(http_port);
console.log(`Server Start at port:${http_port}`);