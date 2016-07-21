var co = require('co');
var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(fs);

let serve = (url, {gzip = true}) => {
	return (req, res, next) => {
		if(!isFile(req)){
			return next();
		};
		co(function*(){
			try{
				let encodings = req.acceptsEncodings('gzip');
				let filePath = `${path.join(url, req.originalUrl)}.gz`;
				if(encodings === 'gzip' && gzip && (yield fs.statAsync(filePath))){
					let file = `${getFileName(req)}.gz`;
					res.sendFile(file, {
						root: path.join(url, '/js'),
						headers: {
							'Content-Encoding': 'gzip'
						}
					});
					return;
				}
			}catch(e){
				console.error(e)
				next(e);
			}
			next();
		})
	}
}

let getFileName = req => {
	let parts = req.originalUrl.split('/');
	return parts[parts.length-1];
}

let isFile = req => {
	let uri = getFileName(req);
	if(uri && uri.match('\.js')){
		return true;
	}
	return false;
}

module.exports = {
	serve
}