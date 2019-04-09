import axios from "axios";
import { prisma, Int } from "../generated/prisma-client";
import { totalmem } from "os";
import { URL } from "url";
const https = require('https')
import { makePrismaClientClass } from "prisma-client-lib";

const headers = { headers: { 'User-Agent': "Mozilla/5.0" }}
const ModelBaseURL =
  "https://stockx.com/api/browse?productCategory=sneakers&sort=release_date&order=DESC";
const years: Array<string> = 
  ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
const brands = [
  {	name: 'adidas',
		models:	['yeezy', 'ultra%20boost', 'nmd', 'iniki', 'other']},
	{	name: 'air%20jordan',
		models: [ 'packs', 'spizike',
				'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine','ten',
				'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
				'twenty-one', 'twenty-two', 'twenty-three', 'twenty-eight', 'twenty-nine', 'thirty',
				'thirty-one', 'thirty-two', 'thirty-three', 'other']},
	{ name: 'nike',
		models: ['foamposite', 'kd', 'kobe', 'lebron', 'air%20force', 'air%20max', 'nike%20basketball', 'nike%20sb', 'other'] },
 { name: 'other%20brands',
    models: ['asics','diadora','li%20ning','louis%20vuitton', 'new%20balance', 'puma', 'reebok','saucony','under%20armour','vans','converse','other']
}
]
    

/*
 * @ Class StockX
 * @ method run() - this function is for test
 *          collectAll() - collect new products
 *          createUrl() - create URL using url queries
 *          seperateUrlByYears() - if there is too many product in one category,
 *                                 Detail it
 *          collectProductsInPage() - Get product in a page using URL
 *                                    It start from page 1 to last page
 *          insert Product() - insert each product infromation to DB
**/

class StockX {

	options = {
		host: 'stockx.com',
		port: 443,
		path: '/api/browse?productCategory=sneakers&sort=release_date&order=DESC',
		method: 'GET'
  }
  
  run = async () =>{
    console.log('run')

    const noUrls: Array<string> = []
    const initialUrls = await this.collectAll()
    const savedUrls = await prisma.uRLs()
    const incompletedUrls = await prisma.uRLs({where:{isComplete:false}})

    console.log(`${initialUrls.length} urls exist`)
    console.log(`${savedUrls.length} urls registered`)
    console.log(`${incompletedUrls.length} urls need to update`)

    const collectProducts = async ( urls ) => {
      await synkCallbackFunction(urls, async param => collectProductInPage(param))
    }

    const synkCallbackFunction = async (params, callback) => {
      for(let i=0; i<params.length; i++)
        callback(params[i],i,params)
    }

    const makePageArray = async (url:string):Promise<Array<string>> => {
      const Numbers:Array<string> = []
      await axios
        .get(url, headers).then((response)=>{
          if(response.data.Pagination.total == 0)
            return;
          for(let i=1; i <= response.data.Pagination.lastPage; ++i)
            Numbers.push( String(i) )
        })
        .catch(e => console.log(`[Connection Error 1] ${e}\n${url}`))
      return Numbers;
    }

    const collectProductInPage = async(param) => {
      //const response = await axios.get(param,headers)
      //const pages = makePageArray(response.data.Pagination.lastPage)
      const pages = await makePageArray(param)
      pages.reduce(
        (pre:Promise<void>, curV:string, curI:Int, array:Array<string>):Promise<void> =>{
          return pre.then( async() => {
            const url = this.createUrl(param,{page:curV})
            await axios.get(url, headers)
              .then((response)=>{  
                response.data.Products.map( (product: any) => {
                  product.url = url;
                  this.insertProduct(product) })
              })
              .catch( e=> console.log(`[Connection Error 2] ${e}\n${url}`))
          })
      },Promise.resolve())
    }

    collectProducts(initialUrls)
    
    
  }

  createUrl = (baseURL: string, querys: Object):string => {
    Object.keys(querys).forEach((e:string)=>{
      baseURL += `&${e}=${querys[e]}`
    })
    return baseURL;
  }

  collectAll = ():Array<string> => {
    const _tags:Array<string> = [];
    const urls:Array<string> = [];
    brands.map((e:{name:string, models:Array<string>})=>{
      e.models.map((v:string)=>{
        if(e.name == v)
          _tags.push(e.name)
        else
          _tags.push(e.name+','+v)
      })
    })
    _tags.map( async (e:string)=> {
      years.map( (year:string) => {
        const url = this.createUrl(ModelBaseURL, {_tags:e, year})
        urls.push( url )
      })
    })
    return urls;
  };

  insertProduct = async (product: any) => {
    const { shoe, uuid, brand, category, name, urlKey, title, url } = product;
    const imgURL = product.media.imgURL ? product.media.imageUrl : ''
    const releaseDate = product.releaseDate ? product.releaseDate.split(' ')[0] : null
    const retailPrice:Int = Number(product.retailPrice)
    try{
      const a = await prisma.products( {where:{uuid} })
      if(a.length >= 1) {
        console.log(`[Pass] ${title} is already registered`)
        return
      };
      const newProduct = await prisma.createProduct({
        uuid,
        brand,
        category,
        name,
        title,
        shoe,
        urlKey,
        imgURL,
        releaseDate,
        retailPrice,
        urlForCheck: url,
        rawData: product
      })
      console.log(
        `[Created] new product: ${newProduct.title} (ID: ${newProduct.id})`
      )
    } catch(e){
      //console.log(e)
      //console.log(e.result.errors)
      console.log(`[ERROR] Not Created ${title}\n${e}`)
    }
  };

  /*
  checkProductURL = async (baseUrl: string): Promise<any> =>{
      let newURL:any = await prisma.uRLs({where:{url:baseUrl}});
      
      const response: any =
        await axios.get(baseUrl, headers)
      if(!response || !response.data){
        console.log('\n[ERROR] In Function createProductURL\n');
        return 'Error';
      }
      await console.log(newURL[0].ProductAmount,':',response.data.Pagination.total,'\t',baseUrl)
      if(newURL[0]){
        if(newURL[0].ProductAmount > response.data.Pagination.total){
          //TODO
          await prisma.
            updateURL({
              data: { isComplete:false,
              ProductAmount: response.data.Pagination.total },
              where:{ id:newURL[0].id }
            })
            //upper code is just quick fix
          return 'up';
        } else if(newURL[0].ProductAmount < response.data.Pagination.total){
          //URL.ProductAmount <- Response.total
          //TODO: more detail
          await prisma.
            updateURL({
              data: { isComplete:false,
              ProductAmount: response.data.Pagination.total },
              where:{ id:newURL[0].id }
            })
          return 'down';
        } else{
          const Prds = await prisma.products({where:{urlForCheck:baseUrl}})
          if( Prds.length == newURL[0].ProductAmount ){
            //DONE
            if(newURL[0].isComplete == false)
              await prisma.
                updateURL({
                  data: { isComplete:true },
                  where:{ id:newURL[0].id }
              })
            return 'done';
          } else if( Prds.length > newURL[0].ProductAmount){
            //DELETE
            return;
          }
        }
      } else{
        //CREATE URL
        const {total, lastPage} = response.data.Pagination;
        newURL =
          await prisma.createURL({
            url: baseUrl,
            ProductAmount:total,
            lastPage,
            isComplete: false });
        await console.log(`Create URL information: ${total} items, ${lastPage} pages`)
      
      }
      
      //COLLECTING
      return 'Collect';
   
    
    if( newURL.length > 0 && newURL[0].ProductAmount == response.data.Pagination.total){
      const checking:any = 
        await prisma.products({where:{urlForCheck:baseUrl}})
      if(newURL[0].ProductAmount > checking.length){
        await console.log('[Warning] There are unregistered data in ', baseUrl)
        await prisma.updateURL({data:{isComplete:false}, where:{id:newURL[0].id}})
        return 'Collect';
      }else if(newURL[0].ProductAmount < checking.length){
        await console.log('[Warning] There are too much data in ', baseUrl)
        await prisma.updateURL({data:{isComplete:false}, where:{id:newURL[0].id}})
        return 'Collect';
      }else{
        await console.log("[Check] There isn't unregistered data in ",baseUrl)
        await prisma.updateURL({data:{isComplete:true}, where:{id:newURL[0].id}})
        return 'Done';
      }
      return;
    }
    if(newURL.length == 0){
      const {total, lastPage} = response.data.Pagination;
      newURL =
        await prisma.createURL({
          url: baseUrl,
          ProductAmount:total,
          lastPage,
          isComplete: false });
      await console.log(`Create URL information: ${total} items, ${lastPage} pages`)
    }else{
      console.log("[Check] There are new data in ",baseUrl)
      await prisma.updateURL({data:{isComplete:false, ProductAmount:response.data.Pagination.total}, where:{id:newURL[0].id}})
      newURL = newURL[0];
    }
    return 'Collect';
    
  }*/

}

new StockX().run();