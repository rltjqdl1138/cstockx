var https = require('https')

function getCall() {
	var merged = ''
	var userAccessToken = ''
	var appAccessToken = ''
	var options = {
		host: 'stockx.com',
		port: 443,
		path:'/api/browse?_tags=yeezy,adidas&productCategory=sneakers&shoeSize=16',
		method:'GET'
	}
	var getReq = https.request(options, (res)=>{
		console.log("status code: ", res.statusCode)
		res.on('data', (data)=>{
			merged += data
		})
		res.on('end', ()=>{
			var dat = JSON.parse(merged)
			console.log(dat.Pagination.total)
			console.log(dat.Pagination.lastPage)
			console.log(dat.Products.length)
		})
	})
	getReq.end()
	getReq.on('error', (err)=>{
		console.log("Error: ", err)
	})

}

getCall()
