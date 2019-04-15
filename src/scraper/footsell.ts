import axios from "axios";
import { prisma, Int, Product } from "../generated/prisma-client";

var cheerio = require('cheerio');  

const baseURL:string = 'https://footsell.com/g2/bbs/board.php?bo_table=m51&r=ok'
const headers = {
  headers:{
    'User-Agent':"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
    'Referer': baseURL+'page=1'
  }
}
class footsellObject{
  rowID:string
  
  constructor(input:any){
    this.rowID = input.attribs.id
    console.log(input.find('.list_market_subject'))
    
  }

};
class footsell{
  lastPage:Int = 200
  run(){
    const pageArray = []
    for(let i=100; i<this.lastPage; i++)
        pageArray.push(i)

    pageArray.forEach((val, index)=>{
        setTimeout( ()=>{this.collectPage(val)},index*1000 )
    },Promise.resolve())
  }

  collectPage = (page:Int) =>{
    console.log(`Page: ${page} / ${this.lastPage}`)
    axios
      .get('https://footsell.com/g2/bbs/board.php?bo_table=m51&page='+String(page), headers)
      .then((response => {
          const $ = cheerio.load(response.data);
          $(".list_table_row")
            .each((i,e)=>{
              if(i<2) return;

              const newProduct = this.convertSubjectToObject($,e)
              if(newProduct)
                this.insertSubject(newProduct)
            })
      }))
      .catch((e)=>{
        console.log(`[Connection Error] in page ${page}`)
      })
  }

  insertSubject = async (inform:any) => {
    try{
      const {subjectID, isForSale, title, ifUsed, price, date, member} = inform
      const ifExist = await prisma.footsellSubjects({where:{subjectID}})
    

      if(ifExist.length > 0){
          if(isForSale == false && ifExist[0].isForSale == true){
            const updatedProduct = await prisma.updatefootsellSubject({data:{isForSale:false},where:{id:ifExist[0].id}})
            console.log(`\n[updated!] ${title}\n`)
          }
          //TODO: update product status
          //console.log(`[Not Created] Already Exists date: (${date}) ${title}`)
      } else if(title!=null && title != '' && price!=null && price!='') {
        const newProduct = await prisma.createfootsellSubject({
            subjectID,
            isForSale,
            title,
            ifUsed,
            price:Number(price.replace(/,/g,"")),
            date,
            member
        })
        console.log(
            `[Created] (date: ${newProduct.date}) ${newProduct.price} - ${title}`
        )
      } else{
          throw new Error('title is NULL!')
      }
    } catch(e){
      console.log(`[ERROR] Not Created ${inform.subjectID}`)
      //if(inform.title != '' && inform.price != '')
        console.dir(inform)
      
    }
  }

  convertSubjectToObject($:any, input:any):any{
    const _img = $(input).find('.list_market_pic').find('a>img')
    const _title = $(input).find('.list_subject_a')
    if( $(input).attr('.list_table_row_notice') )
        return null
    return {
      subjectID: $(input).attr('id').replace('list_row_',''),
      isForSale: _img.length > 0,
      title: _title.find('span>span').children().remove().end().text().trim(),
//      url: _title.attr('href'),
      ifUsed: $(input).find('.list_market_used').text(),
      price: $(input).find('.list_market_price').children().remove().end().text().trim(),//.replace(/\\/g,"").replace('\\',""),
      date: $(input).find('.list_table_dates').text().trim(),
      member: $(input).find('.member').text()
    }
  }
};
const a = new footsell
a.run()
/*
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
*/