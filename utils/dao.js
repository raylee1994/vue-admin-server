var mysql = require("mysql")
var mysqlconf = {
    host: '111.229.220.211',
    user: 'liweifan',
    database: 'admin',
    password: '101,LIweifan',
    port: 3306
}

class Dao {
    constructor() {
        this.pool = mysql.createPool(mysqlconf)
    }
    /* 
        @params {String} table 表名
        @params {Array} fileds 插入字段名
        @params {Array} values 插入字段值
    */
    create(table, fileds, values) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                var insertFields = fileds.join(", ")
                var fieldsValues = new Array(insertFields.length).fill("?").join(", ")
                connection.query(`INSERT INTO ${table}(${insertFields}) VALUES(${fieldsValues})`, values, function (err, result) {
                    if (result) {
                        resolve(result)
                    }else {
                        reject()
                    }
                    connection.release()
                });
            })
        })
    }
    /* 
        @params {String} table 表名
        @params {Array} fileds 读取字段名
        @params {Object} values 查询条件键值对
    */
    read(table, fileds, values) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if(values) {
                    var selectFields = fileds.join(", ")
                    var fieldsValues = Object.keys(values).map(item => {
                        return `${item} = '${values[item]}'`
                    })
                    fieldsValues = fieldsValues.reduce((total, current) => {
                        return `${current} and ${total}`
                    })
                    fieldsValues = ` where ${fieldsValues}`
                }else {
                    var fieldsValues = ""
                }
                connection.query(`select ${selectFields} from ${table}${fieldsValues}`, function (err, result) {
                    if (result.length > 0) {
                        resolve(result)
                    }else {
                        reject()
                    }
                    connection.release();
                });
            })
        })
    }
    /* 
        @params {String} table 表名
        @params {Object} fileds 更新字段键值对
        @params {Object} values 查询条件键值对
    */
    update(table, fileds, values) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                var setFields = Object.keys(fileds).map(item => {
                    return `${item} = '${fileds[item]}'`
                })
                setFields = setFields.join(",")
                var fieldsValues = Object.keys(values).map(item => {
                    return `${item} = '${values[item]}'`
                })
                fieldsValues = fieldsValues.reduce((total, current) => {
                    return `${current} and ${total}`
                })
                connection.query(`UPDATE ${table} SET ${setFields} WHERE ${fieldsValues}`, function (err, result) {
                    if (result) {
                        resolve(result)
                    }else {
                        reject()
                    }
                    connection.release();
                });
            })
        })
    }
    /* 
        @params {String} table 表名
        @params {Object} values 查询条件键值对
    */
    delete(table, values) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                var fieldsValues = Object.keys(values).map(item => {
                    return `${item} = '${values[item]}'`
                })
                fieldsValues = fieldsValues.reduce((total, current) => {
                    return `${current} and ${total}`
                })
                connection.query(`DELETE FROM ${table} WHERE ${fieldsValues}`, function (err, result) {
                    if (result) {
                        resolve(result)
                    }else {
                        reject()
                    }
                    connection.release();
                });
            })
        })
    }
}

module.exports = new Dao()