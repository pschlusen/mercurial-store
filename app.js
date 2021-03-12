const https = require('https')
require('dotenv').config()


function saveFile(cookies){
    let request = https.request({
        hostname: process.env.STORE_HOST,
        path: process.env.STORE_PATH_FILE_EDIT,
        port: 443,
        method: "POST",
        headers: {
            'Content-Type': "application/json;charset=utf8",
            'Cookie': cookies
        }
    }, response => {
        response.on('data', (d) => {console.log(d.toString())})
    })

    request.on('error', error => {
        console.error(error)
    })

    request.write(JSON.stringify({
        "EditorCustomPath": "/Custom/Content/Themes",
        "VirtualFilePath": "~/Custom/Content/Themes/colcci/CSS/carrinho.css",
        "ContentType": "Template",
        "parentPath": "",
        "FileContents": ".h{color:blue}"
    }))

    request.end()

}

function start(){
    let request = https.request({
        hostname: process.env.STORE_HOST,
        path: process.env.STORE_PATH_LOGON,
        port: 443,
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        }
    }, response => {
        let cookies = response['headers']['set-cookie']
        saveFile(cookies)
    })

    request.on('error', error => {
        console.error(error)
    })

    request.write(JSON.stringify({"UserName": process.env.USER_NAME, "Password": process.env.USER_PASSWORD}))
    request.end()
}


start()