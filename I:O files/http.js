const http = require('http')
const fs = require('fs')
const path = require('path')

const notes = require('./notes.json')

const notesFilePath = path.join(__dirname, 'notes.json');

const server = http.createServer((req,res)=>{
    if(req.url === '/' && req.method==='GET'){
        res.end(JSON.stringify(notes))
        return
    }
    if(req.url === '/' && req.method==='POST'){
        let body=''
        req.on('data',(chunk)=>{
            body+=chunk
        })
        req.on('end',()=>{
            try {
                const data = JSON.parse(body)
                notes.push(data)
                fs.writeFile(notesFilePath, JSON.stringify(notes), (err) => {
                    if (err) {
                        console.error(err)
                        res.statusCode = 500
                        res.end('Internal Server Error')
                    } else {
                        res.setHeader('Content-Type', 'text/plain')
                        res.end('Successfully added note')
                    }
                });
            } catch (error) {
                console.error('Error parsing request body:', error)
                res.statusCode = 400
                res.end('Invalid JSON format')
            }
        })
    }
})

server.listen(3000,()=>{
    console.log('Server is listening on port 3000')
})