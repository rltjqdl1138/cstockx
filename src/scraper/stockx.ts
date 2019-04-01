import axios from "axios";
import { prisma } from "../generated/prisma-client";

const headers = { headers: { 'User-Agent': "Mozilla/5.0" }}
const ModelBaseURL =
  "https://stockx.com/api/browse?productCategory=sneakers&sort=release_date&order=DESC";
const years: Array<string> = 
  ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
const brands = [
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
    models: ['under%20armour']} ]
    

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
  run = async () =>{
    console.log('run')
    const a = await this.collectAll()
    await console.log(a)
  }

  createUrl = async (baseURL: string, querys: Object):Promise<string> => {
    Object.keys(querys).forEach((e:string)=>{
      baseURL += `&${e}=${querys[e]}`
    })
    return baseURL;
  }

  collectAll = async ():Promise<Array<string> > => {
    const _tags:Array<string> = [];
    const urls:Array<string> = [];
    await brands.map((e:{name:string, models:Array<string>})=>{
      e.models.map((v:string)=>{
        if(e.name == v)
          _tags.push(e.name)
        else
          _tags.push(e.name+','+v)
      })
    })
    await _tags.map( async (e:string)=> {
      years.map( async (year:string) => {
        const url = await this.createUrl(ModelBaseURL, {_tags:e, year})
        //console.log(url)
        urls.push( url )
      })
    })
    return urls;
  };

  collectProductsInPage = async (baseUrl: string): Promise<any> => {
    // API URL including 'v3' sometimes close 
    baseUrl = await baseUrl.replace("/v3","")

    const response: any =
      await axios.get(baseUrl, headers)
      .catch(error=>console.log('\n\n[ERROR] Function collectProduct\n',baseUrl,'\n'))

    // case 1: If response is null, Recall function to resend API request
    // case 2: There is no data
    // case 3: Insert all infromation, and Apicall nextPage
    if(!response || !response.data) {  // case 1
      return setTimeout(()=>this.collectProductsInPage(baseUrl),1000)
    } else if(response.data.Pagination.total == 0) { // case 2
      return;
    } else { //case 3
      await response.data.Products.map((product: Object) =>{
        this.insertProduct(product) })
      if( response.data.Pagination.nextPage )

        // Pagination.nextPage omits "https://stockx.com"
        // It start from "/api/...""
        this.collectProductsInPage( "https://stockx.com"+response.data.Pagination.nextPage )
    }
  };

  insertProduct = async (product: any) => {
    const { shoe, uuid, brand, category, name, urlKey, retailPrice, title } = product;
    const imgURL = product.imgURL ? product.media.imageUrl : ''
    const releaseDate = product.releaseDate ? product.releaseDate.split(' ')[0] : null

    try{
      const a = await prisma.products( {where:{uuid} })
      if(a.length >= 1) {
        //console.log(`[Pass] ${title} is already registered`)
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
        rawData: product
      })
      console.log(
        `Created new product: ${newProduct.title} (ID: ${newProduct.id})`
      )
    } catch(e){
      //console.log(e)
      console.log(`[ERROR] Not Created ${title}`)
    }
  };
}

new StockX().run();