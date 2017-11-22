if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURL : 'mongodb://<arjunmaini007>:<Arjun1997>@ds115396.mlab.com:15396/ajdb1'}
}else{
    module.exports = {mongoURL : 'mongodb://localhost/vidjot-dev'}
}
