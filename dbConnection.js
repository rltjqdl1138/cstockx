'use strict';
var mysql = require('mysql')

module.exports = class Connection{
    constructor( DBOption ){
        if(!DBOption)
            DBOption={
                host        : '18.224.180.235',
                user		: 'root',
                port		: '3306',
                password	: '1138877',
                database	: 'buffedDB'    }
        this.db = mysql.createConnection(DBOption)
        this.db.connect()
        console.log(`connect DB ${DBOption.database}@${DBOption.host}:${DBOption.port}`)
        
        this.Sneakers = {
            insert: InsertToSneakersDB,
            select: SelectSneakers,
            select_shoe:    SelectSneakersShoe
        }
        this.PriceHistory = {
            insert: InsertToPriceHistoryDB
        }
    }
    getDB(){
        return this.db
    }
}

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
function InsertToSneakersDB(connection, product, cb){
    product.name=product.name.replace(/\'/gi,"")
    product.shoe=product.shoe.replace(/\'/gi,"")
    product.shortDescription=product.shortDescription.replace(/\'/gi,"")
    product.title=product.title.replace(/\'/gi,"")

    var str = "INSERT INTO Sneakers VALUES('"
                    +product.brand      + "','"
                    +product.category   + "','"
                    +product.colorway   + "','"
                    +product.name       + "','"
                    +product.releaseDate+ "',"
                    +product.releaseTime+ ","
                    +product.retailPrice+ ",'"
                    +product.shoe       + "','"
                    +product.shortDescription+"','"
                    +product.title      + "','"
                    +product.urlKey     + "','"
                    +product.media.imageUrl+"','"
                    +product.id         + "');"
    connection.query(str, (error, results, fields)=>{
        if (error)
            console.log(error)
        else if(cb!=null){
            console.log("[success] "+product.title)
            cb()
        } else{
            console.log("[success] "+product.title)
        }
    })
}

/*
 *  @function	SelectSneakers
 *  @params {keyword}   keyword
 *  @params	{String}	title	- Sneakers.title in DB
 *  @params {function}	cb	- callback function
**/
function SelectSneakers(connection, keyword, input, cb){
    var str = "SELECT * FROM Sneakers"
    if(keyword && input)
        str += " WHERE " + keyword+ "='" + input + "'"

	connection.query(str, (error, results, fields) => {
		if (error)
            console.log(error)
		else if(cb != null){
            console.log("[Success] Query: ",str)
            console.log(results.length, " found\t")
			cb(results)
        }else
            console.log(results)
	})
}

function SelectSneakersShoe(connection, keyword, input, cb){
    var str = "SELECT DISTINCT(shoe) FROM Sneakers"
    if(keyword && input)
        str += " WHERE " + keyword+ "='" + input + "'"

	connection.query(str, (error, results, fields) => {
		if (error)
            console.log(error)
		else if(cb != null){
            console.log("[Success] Query: ",str)
            console.log(results.length, " found\t")
			cb(results)
        }else
            console.log(results)
	})
}


/*
 *  @function	addToPriceHistoryDB
 *  @params	{String}	Sid		- Sneakers' ID
 *  @params	{Object}	_date	- Date Object
 *  @params	{Integer}	Price	- Sneakers' price
 *  @params {function}	cb  	- callback function
 * 
 *  @Description	- After crawl from stockx, Add to DB
**/
function InsertToPriceHistoryDB(connection, Sid, _date, price, cb){ 
	var str = "INSERT INTO PriceHistory VALUES('"
			+ Sid	+ "','"
			+ _date.toFormat('YYYY-MM-DD HH24:MI:SS')	+ "',"
			+ _date.getTime()/1000	+ ","
			+ price + ");"
	connection.query(str, function (error, results, fields) {
		if (error){
			console.log("[fail] ",Sid, _date, price)
		} else if(callback!=null){
            console.log("[success] ",Sid, _date, price)
            cb()
		} else{
            console.log("[success] ",Sid, _date, price)
        }
	})
}