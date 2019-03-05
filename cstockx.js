var mysql = require('mysql')
var https = require('https')



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

function addToDB(product, callback){

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
 *  @function	getCall
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
function getCall( brand, model, year, page ) {
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
						getCall( brand, e, null, null )
					})
				} else if( year == null ){
					for( var i=2001; i<=2019; i++)
						getCall( brand, model, i, null )
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
					addToDB(dat.Products[i],null)
				}
	
				getCall( brand, model, year, Number(dat.Pagination.page)+1 )
			} else{
				/*
				 *  [ INSERT DB ]
				 */
				for(var i=0; i<dat.Products.length; i++){
					//console.log(dat.Products[i].title)
					addToDB(dat.Products[i],null)
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

function apiTest( brand, model ) {
	var merged = ''
	if( !brand || !brand.name ){
		console.log( "brand name is empty" )
		return
	}
	var options = {
		host: 'stockx.com',
		port: 443,
		path: '/api/browse?productCategory=sneakers&sort=release_date&order=DESC',
		method: 'GET'
	}

	if( model )
		options.path += '&_tags='+model+','+brand.name
	else
		options.path += '&_tags='+brand.name
	
	var getReq = https.request(options, (res)=>{
		res.on('data', (data)=>{ merged += data })
		res.on('end', ()=>{
			var dat = JSON.parse(merged)
				if( model == null ){
					brand.models.forEach( (e)=>{
						apiTest( brand, e, null, null )
					})
				} else{
					console.log("["+brand.name+"] "+model+":\t"+dat.Pagination.total)
				}
		})
	})
	getReq.end()
	getReq.on('error', (err)=>{
		console.log("Error: ", err)
	})
}


//
// Call the function for test..
//
//getCall( brands[0] )


brands.forEach( (e)=>{
	getCall(e)
})
