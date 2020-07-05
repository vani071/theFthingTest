const Response = function(codeNum,responseMsg,msg,data) {
    this.status = {
        code : codeNum,
        response : responseMsg,
        message: msg
    }
    this.result = data;
};

module.exports = Response