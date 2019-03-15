
const mapper = require('./map.js')
const dbObject = require('./dbConnection.js')
const https = require('https')
const fs = require('fs');
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
function browseModels( connection, brand, model, year, page ) {
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

	// Add Page informagion to URL
	if( page )
		options.path += '&page='+String(page)
	else{
		options.path += '&page=1'
		page = 1
	}

	// Add Brand and Model information to URL
	if( model )
		options.path += '&_tags='+model+','+brand.name
	else
		options.path += '&_tags='+brand.name

	// Add Year information to URL
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
	let getReq = https.request(options, (res)=>{
		res.on('data', (data)=>{ merged += data })
		res.on('end', ()=>{
			let dat = JSON.parse(merged)

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
				/*
				 *  [ INSERT DB ]
				 *  variable "dat.Products" is Array
				 *  there is too many informations to write here
				 */
				dat.Products.forEach((e)=>{
					connection.Sneakers.insert(connection.getDB(),e,null)
				})
	
				setTimeout( ()=>{browseModels( connection, brand, model, year, Number(dat.Pagination.page)+1 )},0)
			} else{
				/*
				 *  [ INSERT DB ]
				 */
				dat.Products.forEach((e)=>{
					connection.Sneakers.insert(connection.getDB(),e,null)
				})
				setTimeout(()=>{console.log("["+brand.name+" "+model+" "+year+"]\tDone!\t"+dat.Pagination.total+" items")},0)
				
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
function browsePriceHistory(connection, title, startDate, endDate, interval=100){
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

//browsePriceHistory('Jordan 1 Retro High Pine Green',null,null)

var dbCon = new dbObject()
console.log('\n\n\n\n\n\n\n\n\n\n\n\n')
setTimeout(()=>{
	brands.forEach( (e)=>{
		browseModels(dbCon,e,null,null,null)
	})
	//dbCon.Sneakers.select_shoe(dbCon.getDB(), null, null,(results)=>{
		//distribute(results)
	//})
},0)


function distribute(input, callback){
	var str = ""
	input.forEach((e)=>{
		if (e.shoe.indexOf("Jordan")!=-1){
			str += e.shoe + "\r\n"
			str += mapper.MappingAll(mapper.MappingJordan(e.shoe))+ "\r\n\r\n"
        	//console.log(`[Jordan]\t${e.shoe} \t=> ${str}`)
		} else if(e.shoe.indexOf("Nike")!=-1){
			str += e.shoe + "\r\n"
			str += mapper.MappingAll(mapper.MappingNike(e.shoe))+ "\r\n\r\n"
			//console.log(`[Nike]\t${e.shoe} \t=> ${str}`)
		} else if(e.shoe.indexOf("adidas")!=-1){
			str += e.shoe + "\r\n"
			str += mapper.MappingAll(mapper.MappingAdidas(e.shoe))+ "\r\n\r\n"
			//console.log(`[Adidas]\t${e.shoe} \t=> ${str}`)
		}
	})
	setTimeout(()=>{
		console.log("All Done")
		fs.writeFile("out.txt", str, "utf8", function(error) {
			console.log(str);
		});
	},0)
}

