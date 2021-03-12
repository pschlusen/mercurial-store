const { throws } = require('assert')
const https = require('https')
require('dotenv').config()



function CMSHandler() {
    this.username   = process.env.USER_NAME
    this.password   = process.env.USER_PASSWORD
    this.hostname   = process.env.STORE_HOST
    this.logonPath  = process.env.STORE_PATH_LOGON
    this.editPath   = process.env.STORE_PATH_FILE_EDIT
    this.cookies = false
}


CMSHandler.prototype.saveFile = function(file, cookies) {
    let request = https.request({
        hostname: this.hostname,
        path: this.editPath,
        port: 443,
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf8',
            'Cookie': cookies
        }
    }, response => {
        response.on('data', (d) => {console.log(d.toString())})
    })

    request.on('error', error => {
        console.error(error)
    })

    request.write(JSON.stringify({
        EditorCustomPath: '/Custom/Content/Themes',
        VirtualFilePath: '~/Custom/Content/Themes/colcci/CSS/carrinho.css',
        ContentType: 'Template',
        parentPath: '',
        FileContents: '.h{color:blue}'
    }))

    request.end()

}

CMSHandler.prototype.saveCookies = function(cookies) {

}



CMSHandler.prototype.logonOnCMS = function(callback) {
    if(!this.cookies){
        let request = https.request({
            hostname: this.hostname,
            path: this.logonPath,
            port: 443,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }, response => {
            this.cookies = response['headers']['set-cookie']
            callback(this.cookies)
        })

        request.on('error', error => {
            console.error(error)
        })

        request.write(JSON.stringify({'UserName': this.username, 'Password': this.password}))
        request.end()
    }else{
        callback(this.cookies)
    }
}


exports.CMSHandler = new CMSHandler()

