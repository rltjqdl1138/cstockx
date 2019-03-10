var mysql = require('mysql')
var https = require('https')
require('date-utils')


// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
var connection = mysql.createConnection({
  host		: '18.224.180.235',
  user		: 'root',
  port		: '3306',
  password	: '1138877',
  database	: 'buffedDB'
});

connection.connect();
console.log("connect to DB")


/*
 *  @variable	{Array}	brands	- 
 *    @variable	  {Object}
 *	@attribute	{String}	name
 *	@attribute	{Array}		models
 *  @description
 *
 *  @TODO
 *	Add other brands and models
**/
var brands = [
		{	name: 'adidas',
			models:	['yeezy', 'ultra%20boost', 'nmd', 'iniki', 'other'] },
		{	name: 'air%20jordan',
			models: [ 'packs', 'spizike',
					'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine','ten',
					'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
					'twenty-one', 'twenty-two', 'twenty-three', 'twenty-eight', 'twenty-nine', 'thirty',
					'thirty-one', 'thirty-two', 'thirty-three', 'other']},
		{ 	name: 'nike',
			models: ['foamposite', 'kd', 'kobe', 'lebron', 'air%20force', 'air%20max', 'nike%20basketball', 'nike%20sb', 'other']},
		{	name: 'asics',
			models: ['asics'] },
		{	name: 'diadora',
			models: ['diadora']},
		{	name: 'li%20ning',
			models: ['li%20ning']},
		{	name: 'louis%20vuitton',
			models: ['louis%20vuitton']},
		{	name: 'new%20balance',
			models: ['new%20balance']},
		{	name: 'puma',
			models: ['puma']},
		{	name: 'reebok',
			models: ['reebok']},
		{	name: 'saucony',
			models: ['saucony']},
		{	name: 'under%20armour',
			models: ['under%20armour']}
]


/*
 *  @function	addToSneakersDB
 *  @params	{Object}	product	- product object from Stockx.com
 *    @attribute	{String}	brand	-> Sneakers.brand
 *    @attribute	{String}	category	-> Sneakers.category
 *    @attribute	{String}	colorway	-> Sneakers.colorway
 *    @attribute	{String}	name	-> Sneakers.name
 *    @attribute	{String}	releaseDate	-> Sneakers.releaseDate
 *    @attribute	{Integer}	releaseTime	-> Sneakers.releaseTime
 *    @attribute	{Integer}	retailPrice	-> Sneakers.retailPrice
 *    @attribute	{String}	shoe	-> Sneakers.shoe
 *    @attribute	{String}	shortDescription	-> Sneakers.shortDescription
 *    @attribute	{String}	title	-> Sneakers.title
 *    @attribute	{String}	urlKey	-> Sneakers.urlKey
 *    @attribute	{Object}	media	-> Sneakers.imageUrl
 *    @attribute	{String}	id	-> Sneakers.ID
 *  @params {function}	callback	- callback function
 * 
 *  @Description	- After crawl from stockx, Add to DB
 *
 *  @TODO	- add options for other case
 * 			  If we need more data, I will add more attributes
 * 
**/
function addToSneakersDB(product, callback){
	product.name=product.name.replace(/\'/gi,"")
	product.shoe=product.shoe.replace(/\'/gi,"")
	product.shortDescription=product.shortDescription.replace(/\'/gi,"")
	product.title=product.title.replace(/\'/gi,"")
	var str = "INSERT INTO Sneakers VALUES('"
			+product.brand+"','"
			+product.category+"','"
			+product.colorway+"','"
			+product.name+"','"
			+product.releaseDate+"',"
			+product.releaseTime+","
			+product.retailPrice+",'"
			+product.shoe+"','"
			+product.shortDescription+"','"
			+product.title+"','"
			+product.urlKey+"','"
			+product.media.imageUrl+"','"
			+product.id+"');"
	connection.query(str, function (error, results, fields) {
		if (error){
			console.log("\n\n\n");
			console.log(str)
			console.log(error)
			console.log(product)
			console.log("\n\n\n");
		}
		else{
			console.log("[success] "+product.title)
		}
	})
	if(callback != null)
		callback()
}
/*
 *  @function	SelectSneakersByTitle
 *  @params	{String}	title	- Sneakers.title in DB
 *  @params {function}	cb	- callback function
**/
function SelectSneakersByTitle(title, cb){
	var str = "SELECT * FROM Sneakers WHERE title='"+ title + "'"
	connection.query(str, function (error, results, fields) {
		if (error){
			console.log(error)
		} else if(cb != null){
			cb(results)
		} else{
			console.log(results)
		}
	})
}
function SelectAllSneakers(cb){
	var str = "SELECT * FROM Sneakers WHERE category='Saucony'"
	connection.query(str, (error, results, fields)=>{
		if(error){
			console.log(error)
		} else if( cb!= null ){
			cb(results)
		} else{
			console.log(results)
		}
	})
}

/*
 *  @function	addToPriceHistoryDB
 *  @params	{String}	Sid		- Sneakers' ID
 *  @params	{Object}	_date	- Date Object
 *  @params	{Integer}	Price	- Sneakers' price
 *  @params {function}	callback	- callback function
 * 
 *  @Description	- After crawl from stockx, Add to DB
 * 
**/
function addToPriceHistoryDB(Sid, _date, price, callback){
	var date = _date.toFormat('YYYY-MM-DD HH24:MI:SS')
	var time = _date.getTime()/1000
	var str = "INSERT INTO PriceHistory VALUES('"
			+ Sid	+ "','"
			+ date	+ "','"
			+ time	+ "','"
			+ price + "');"
	console.log(str)
	connection.query(str, function (error, results, fields) {
		if (error){
			console.log(error)
		} else{
			console.log("[success] ",Sid, date, time, price)
		}
	})
	if(callback != null)
		callback()
}
/*
 *  @function	browseModels
 *
 *  @param	{Object}	brand	- 
 *		{String}	model	-
 *		{Integer}	year	-
 *		{Integer}	page	-
 *
 *  @return	X
 *  @description	- Browse sneakers using parameters
 *
**/
function browseModels( brand, model, year, page ) {
	var merged = ''
	if( !brand || !brand.name ){
		console.log( "brand name is empty" )
		return
	} else if( !page ){
		page = 1
	}
	var options = {
		host: 'stockx.com',
		port: 443,
		path: '/api/browse?productCategory=sneakers&sort=release_date&order=DESC',
		method: 'GET'
	}

	//
	// Add Page informagion to URL
	//
	if( page )
		options.path += '&page='+String(page)
	else{
		options.path += '&page=1'
		page = 1
	}

	//
	// Add Brand and Model information to URL
	//
	if( model )
		options.path += '&_tags='+model+','+brand.name
	else
		options.path += '&_tags='+brand.name

	//
	// Add Year information to URL
	//
	if( year )
		options.path += '&year='+String(year)

	
	
	/*
	 *  @description
	 *    API Calling station.
	 *    If there is over 1000 items, they are ignored.
	 *    So in this case, detail API Calls.
	 *	1. one Brand name => many Model names
	 * 	  etc) Adidas => [ Adidas Yeezy, Adidas NMD, Adidas Iniki, ... ]
	 *	2. one Model name => many release years
	 *	  etc) Adidas Yeezy => [ Adidas Yeezy 2002, ..., Adidas Yeezy 2019 ]
	 *
	 *  @TODO
	 *	1. Connect DB
	 *	2. Find ignored items
	 *
	**/
	var getReq = https.request(options, (res)=>{
		res.on('data', (data)=>{ merged += data })
		res.on('end', ()=>{
			var dat = JSON.parse(merged)

			//
			// Detail API Call
			//
			if(dat.Pagination.total > 1000){
				if( model == null ){
					brand.models.forEach( (e)=>{
						browseModels( brand, e, null, null )
					})
				} else if( year == null ){
					for( var i=2001; i<=2019; i++)
						browseModels( brand, model, i, null )
				} else{
					console.log("Warning!: ["+brand.name+" "+model+" "+year+"] is too many!")
				}
			}else if(dat.Pagination.lastPage == 0){
				//console.log("["+brand.name+" "+model+" "+year+"]\tEmpty!!")
			}else if( dat.Pagination.nextPage != null ){
				//console.log("["+brand.name+" "+model+" "+year+"]\t"+dat.Pagination.page+"/"+dat.Pagination.lastPage+"\t"+dat.Products.length+"items")
				/*
				 *  [ INSERT DB ]
				 *  variable "dat.Products" is Array
				 *  there is too many informations to write here
				 */
				//console.log(dat.Pagination.page)
				for(var i=0; i<dat.Products.length; i++){
					//console.log(dat.Products[i].title)
					addToSneakersDB(dat.Products[i],null)
				}
	
				browseModels( brand, model, year, Number(dat.Pagination.page)+1 )
			} else{
				/*
				 *  [ INSERT DB ]
				 */
				for(var i=0; i<dat.Products.length; i++){
					//console.log(dat.Products[i].title)
					addToSneakersDB(dat.Products[i],null)
				}
				console.log("["+brand.name+" "+model+" "+year+"]\tDone!\t"+dat.Pagination.total+" items")
				
			}
		})
	})
	getReq.end()
	getReq.on('error', (err)=>{
		console.log("Error: ", err)
		connection.end();
	})
}

/*
 *  @function	browsePriceHistory
 *
 *  @params	{String}	title	- Sneakers' title 
 *  @params	{String}	startDate - 'YYYY-MM-DD' format
 *  @params	{String}	endDate - 'YYYY-MM-DD' format
 *
 *  @return	X
 *  @description	- Browse sneakers using parameters
 * 
**/
function browsePriceHistory(title, startDate, endDate, interval=100){
	var now = new Date()
	if(!endDate)
		endDate = now.toFormat('YYYY-MM-DD')
	if(!startDate){
		now.add({months:-3})
		startDate = now.toFormat('YYYY-MM-DD')
	}
	SelectSneakersByTitle(title, (results)=>{
		var merged = ''
		var options = {
			headers: {"Referer":"https://stockx.com/" + results[0].urlKey},
			host: 'stockx.com',
			port: 443,
			path:'https://stockx.com/api/products/' + results[0].ID + '/chart?' +
					'start_date='	+ startDate +
					'&end_date='	+ endDate +
					'&intervals='	+ interval +	'&format=highstock&currency=USD',
			method:'GET'
		}
		var getReq = https.request(options, (res)=>{
			res.on('data', (data)=>{
				merged += data
			})
			res.on('end', ()=>{
				var dat = JSON.parse(merged)
				dat.series[0].data.forEach( (e)=>{
					var currentTime = new Date(e[0])
					addToPriceHistoryDB(results[0].ID, currentTime, e[1])
				})
			})
		})

		getReq.end()
		getReq.on('error', (err)=>{
			console.log("Error: ", err)
		})
	})
}


//
// Call the function for test..
//
//browseModels( brands[0] )

/*
brands.forEach( (e)=>{
	browseModels(e)
})
*/

//browsePriceHistory('Jordan 1 Retro High Pine Green',null,null)

SelectAllSneakers((results)=>{
	results.forEach((e)=>{
		console.log(e.title)
		browsePriceHistory(e.title,null,null)
	})
})