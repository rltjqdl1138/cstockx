var https = require('https')


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
var brands = [ {
	name: 'adidas',
	models:	['yeezy', 'ultra%20boost', 'nmd', 'iniki', 'other'] }
]

/*
 *  @function	getCallUsingBrand
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
	 *	  etc) Adidas => [ Adidas Yeezy, Adidas NMD, Adidas Iniki, ... ]
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
				console.log("["+brand.name+" "+model+" "+year+"]\tEmpty!!")
			}else if( dat.Pagination.nextPage != null ){
				//console.log("["+brand.name+" "+model+" "+year+"]\t"+dat.Pagination.page+"/"+dat.Pagination.lastPage+"\t"+dat.Products.length+"items")
				//
				// [ INSERT DB ]
				//
				getCall( brand, model, year, Number(dat.Pagination.page)+1 )
			} else{
				console.log("["+brand.name+" "+model+" "+year+"]\tDone!\t"+dat.Pagination.total+" items")
				//
				// [ INSERT DB ]
				//
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
getCall( brands[0] )