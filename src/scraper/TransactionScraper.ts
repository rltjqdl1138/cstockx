import axios from "axios";
import { prisma, Int, Product } from "../generated/prisma-client";

const Categories = require("../DBdata/category.js")
const headers = { headers: { 'User-Agent': "Mozilla/5.0" }}

class StockX {

	options = {
		host: 'stockx.com',
		port: 443,
		path: '/api/browse?productCategory=sneakers&sort=release_date&order=DESC',
		method: 'GET'
  }
  

  run = async () =>{
    //TODO: find way to scrap whole data
    //      Type category index to argv e.x) ts-node TransactionScraper 13
    //      Then, start scraping to one category
    const currentCategory:string = Categories[Number(process.argv[2])]
    console.log(`Run to ${currentCategory}`)
  
    // I think this way second best
    // If computer resource is poor to run for whole products, Relay functions to callback
    const collectingData = async ( urls:Array<{uuid:string, url:string}>, callbacks:Function ) => {
      await synkCallbackFunction(urls, async param => callbacks(param))
    }

    const synkCallbackFunction = async (params:Array<{uuid:string, url:string}>, callback:Function) => {
      for(let i=0; i<params.length; i++)
        callback(params[i],i,params)
    }

    const collectRawTransactionsInPage = async (product:{uuid:string,url:string}) => {
      try{
        // chrome use this url include 'v2'
        // but axios or postman can't use this url, StockX refused their connection.
        // need to remove 'v2'
        product.url = product.url.replace("/v2/","/")

        // Check Overlaped data
        // TODO: Fix error
        //   - FetchError: Socket hanged up
        const isExist = await prisma.transactionRaws({where:{url:product.url}})

        if(isExist.length > 0 && isExist[0].amount<1000) return;

      await axios.get(product.url, headers)
        .then((response)=>{
          if(!response.data.Pagination){
            console.log(`[Connection Error 2] Connection Refused by Stockx\n${product.url}`)
            return;
          }
          // TODO: need to combine parameters to Object
          if(isExist.length == 0)
            this.insertTransactionRaw(product.url, product.uuid , currentCategory, response.data)
          if(response.data.Pagination.nextPage){
            const nextPage:{uuid:string, url:string} = {
              uuid: product.uuid,
              url:"https://stockx.com"+response.data.Pagination.nextPage
            }
            collectRawTransactionsInPage(nextPage)
          }
        })
        .catch( e=> console.log(`[Connection Error 2] ${e}\n${product.url}`))
      }catch(e){
        console.log(`[Error 3] ${e}\n${product.url}`)
      }
    }


    //collectingData(initialUrls, collectProductInPage)
    const ids = await this.collectAllTransactions({category:currentCategory})
    //console.log(ids)
    collectingData(ids, collectRawTransactionsInPage)
  }

  insertTransactionRaw = async (url:string, uuid:string, category:string, transactionRaw: any) => {
    try{
      const newTransaction = await prisma.createTransactionRaw({
        uuid,
        category,
        url,
        amount: transactionRaw.ProductActivity.length,
        rawData: transactionRaw
      })
      console.log(
        `[Created] new data: ${transactionRaw.ProductActivity.length}s, (ID: ${newTransaction.id})`
      )
    } catch(e){
      console.log(`[ERROR] Not Created ${url}\n${e}`)
    }
  }

  collectAllTransactions = async (whereParameters:{category?:string, brand?:string }) =>{
    const products = await prisma.products({where: whereParameters})
    console.log(`There are ${products.length} items`)
    return products.reduce(
      ( arr:Array<{uuid:string, url:string}>, curV:Product, curI:Int, array:Array<Product>) =>{
        arr.push(this.createTransactionUrl(curV.uuid))
        return arr
    },[])
  }

  createTransactionUrl = (ID:string, page:Int=1):{uuid:string, url: string} =>{
      return {
          uuid: ID,
          url: "https://stockx.com/api/products/" + ID
              + "/activity?state=480&currency=USD&limit=1000&page="+ page
              + "&sort=createdAt&order=DESC" }
  }
}

new StockX().run();