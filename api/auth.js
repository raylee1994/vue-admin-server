var express = require("express")
var router = express.Router
var Dao = require("../utils/dao")
var {jsonRet, createToken, encryptPwd} = require("../utils")

//注册
router.post("/register", (req, res) => {
    var username = req.body.username
    var password = req.body.password
    var roleId = req.body.roleId || 0
    if(typeof username === "undefined") {
        jsonRet(res, "用户名必填", 400)
        return
    }
    if(typeof password === "undefined") {
        jsonRet(res, "密码必填", 400)
        return
    }
    Dao.read("user", ["username"], {username}).then(res => {
        jsonRet(res, "用户名已存在", 400)
    }).catch(err => {
        Dao.create("user", ["roleId", "username", "password"], [roleId, username, encryptPwd(password)]).then(result => {
            var uid = result.insertId
            var token = createToken({
                username,
                roleId,
                uid
            })
            jsonRet(res, {
                token,
                role: roleId
            }, 200)
        })
    })
})

//登录
router.post("/log_in", (req, res) => {
    var username = req.body.username
    var password = req.body.password
    if(typeof username === "undefined") {
        jsonRet(res, "用户名必填", 400)
        return
    }
    if(typeof password === "undefined") {
        jsonRet(res, "密码必填", 400)
        return
    }
    Dao.read("user", ["username", "roleId", "id"], {username, password: encryptPwd(password)}).then(result => {
        var token = createToken({
            username: result[0].username,
            roleId: result[0].roleId,
            uid: result[0].id
        })
        jsonRet(res, {
            token,
            role: result[0].roleId
        }, 200)
    }).catch(err => {
        jsonRet(res, "用户名或密码错误", 400)
    })
})

module.exports = router