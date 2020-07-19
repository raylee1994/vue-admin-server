var crypto = require("crypto")
var jwt = require("jsonwebtoken")
var pwdKey = "pwd752860_12300"
var tokenKey = "token4396460_zx523"

exports.jsonRet = function(res, result, status) {
    res.status(status).json({
        status: status == 200 ? 1 : 0,
        info: result
    })
}

exports.encryptPwd = function(pwd) {
    var cipher = crypto.createCipher("aes192", pwdKey)
    var crypted = cipher.update(pwd, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}

exports.decryptPwd = function(pwd) {
    var decipher = crypto.createDecipher('aes192', pwdKey)
    var decrypted = decipher.update(pwd, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

exports.createToken = function(payload) {
    var token = jwt.sign(payload, tokenKey, { expiresIn: '86400' })
    return token
}

exports.verifyToken = function(req, res, next) {
    var token = req.headers["Authorization"]
    jwt.verify(token, tokenKey, function(err, decoded) {
        if(err) {
            exports.jsonRet(res, "登录状态已失效，请重新登录", 401)
        }
        if(decoded && decoded.uid && decoded.roleId) {
            req.app.set("uid", decoded.uid)
            req.app.set("roleId", decoded.roleId)
            next()
        }
    })
}