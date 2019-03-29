/* * * * * * * * * * * * * * * * * * * * * *
 * This code is not used
 * There happen trouble to open web page
 *
**/



var cheerio = require('cheerio');  
var request = require('request');





console.log("***********************************\n")
console.log("*           running               *\n")
console.log("***********************************\n")
for(var i=2; i<3; i++){
    //var url = 'https://footsell.com/g2/bbs/board.php?bo_table=m51&page='+String(i)+"&page="+String(i-1);
    var url = 'https://footsell.com/g2/bbs/board.php?bo_table=m51&page=2';
    console.log(url)
    request({uri:url, headers:{'User-Agent': 'Mozilla/5.0'}}, function(error, response, html){  
        if (error) {throw error};
        var temp = String(i)
        const $ = cheerio.load(html);
        var aa = $(".list_market_col")
        for(let i = 0; i < aa.length; i++){
            const img = aa[i].children[1]
            const text = aa[i].children[3]
            
            if( img.children[1].name == "img"){
                console.log(temp," [판매완료]")
            } else if( img.children[1].name == "a"){
                console.log(temp," [판매중]")
            }

            var title = text.children[1].children[1].children[0].children[1].children[0].data
            var price = text.children[9].children[2].data
            title = title.replace(/\n/g,"")
            title = title.replace(/\t/g,"")
            price = Number(price.replace(",",""))
            console.log(title)
            console.log(price)

        }
        
    });
    console.log("\n\n\n\n\n")
}
