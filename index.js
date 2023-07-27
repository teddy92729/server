import { createReadStream } from "fs";
import fs from "fs/promises";
import mime from "mime";
import http from "http";
const http_port=5001;

const server=http.createServer(async function(req,res){
    let url=new URL(req.url,`http://localhost:${http_port}`);
    // console.log(url);
    let forceRes=true;
    try{
        const service = await import(`./services${url.pathname}/index.js`);
        console.log(req.url+" OK(s)");
        try{
            await service[req.method](req,res,url);
            forceRes=false;
        }catch(err){
            console.error(err);
        }
    }catch(err){
        try{
            console.error(err);
            // if(url.pathname.match(/index.js\/*$/i))throw new Error("index.js is not allow");
            await fs.access(`./files${url.pathname}`,fs.constants.R_OK);
            let {size}=await fs.stat(`./files${url.pathname}`);
            let type=mime.getType(`./files${url.pathname}`);
            console.log(req.url+" OK(f)");
            try {
                forceRes=false;
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
                    createReadStream(`./files${url.pathname}`,{start:start,end:end}).pipe(res);
                 }else{
                    res.writeHead(200);
                    createReadStream(`./files${url.pathname}`).pipe(res);                    
                }
            } catch (err) {
                console.error(err);
            }
        }catch(err){
            console.error(err);
            console.log(req.url+" Not Found");
            res.writeHead(404);
            res.end("404 Not Found");
        }
    }finally{
        if(forceRes&&!res.writableEnded){
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