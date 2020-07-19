var express = require("express")
var router = express.Router
var Dao = require("../utils/dao")
var {jsonRet} = require("../utils")

router.get("get_organ_list", (req, res) => {
    var roleId = req.app.roleId
    if(roleId != 1 && roleId != 2) {
        jsonRet(res, "没有权限", 403)
        return
    }
    Dao.read("organ", ["organ_name", "organ_contact", "mobile"]).then(result => {
        jsonRet(res, result, 200)
    }).catch(err => {
        jsonRet(res, result, 200)
    })
})

router.get("get_organ_detail", (req, res) => {
    var organId = req.query.id
    var roleId = req.app.roleId
    if(roleId != 1 && roleId != 2) {
        jsonRet(res, "没有权限", 403)
        return
    }
    Dao.read("organ", ["organ_name", "organ_contact", "mobile"], {id: organId}).then(result => {
        jsonRet(res, result, 200)
    }).catch(err => {
        jsonRet(res, result, 200)
    })
})
