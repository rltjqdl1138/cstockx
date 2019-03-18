const dbObject = require('./dbConnection.js')
class Mapper{
    constructor(){
        this.EnglishWords = []
        this.KoreanWords = []
    }
    insert(Eng, Kor){
        let indxE = this._search(this.EnglishWords,Eng)
        let indxK = this._search(this.KoreanWords,Kor)
        if( indxE == -1 && indxK == -1 ){
            let v1 = new MappingNode(Eng, this.KoreanWords.length)
            let v2 = new MappingNode(Kor, this.EnglishWords.length)
            this.KoreanWords.push(v2)
            this.EnglishWords.push(v1)
            //console.log("New word: ", Eng,", ", Kor)

        } else if( indxE == -1 ){
            let v = new MappingNode(Eng, indxK)
            this.EnglishWords.push(v)
            this.KoreanWords[indxK].link.push(this.EnglishWords.length - 1)
            //console.log("New word: ", Eng)

        } else if( indxK == -1){
            let v = new MappingNode(Kor, indxE)
            this.KoreanWords.push(v)
            this.EnglishWords[indxE].link.push(this.KoreanWords.length - 1)
            //console.log("New word: ", Kor)

        } else if(this.EnglishWords[indxE].link.find((item)=>{return item == indxK}) == -1){
            this.EnglishWords[indxE].link.push(indxK)
            this.KoreanWords[indxK].link.push(indxE)
           
        }
    }
    _search(arr, wor){
        if(arr == null)
            arr = this.EnglishWords
        else if(arr == 1)
            arr = this.KoreanWords
        return arr.findIndex((item)=>{return item.word === wor})
    }
    convert(lan, word, word2){
        let length = 2
        let a;
        let b;
        if(lan == 'Eng'){
            if( word2 == null )
                a = this._search(this.EnglishWords, word)
            else
                a = this._search(this.EnglishWords, word + " " + word2)
            if( a == -1 ){
                length = 1;
                if(word2 == null)
                    return {word: word, length: length};
                a = this._search(this.EnglishWords, word) 
                if(a == -1)
                    return {word: word, length: length}
                //console.log(word,': nope')
                //return ">"+word+"<"
            }
            //console.log(a,`\t`,this.EnglishWords[a].link)
            for(var j=0; j<this.EnglishWords[a].link.length; j++){
                let e = this.EnglishWords[a].link[j]
                if( b == null)
                   b = this.KoreanWords[e]
                else if(this.KoreanWords[e].link.length > b.link.length)
                    b = this.KoreanWords[e]
            }
        } else if(lan == 'Kor'){
            if( word2 == null )
                a = this._search(this.KoreanWords, word)
            else
                a = this._search(this.KoreanWords, word + " " + word2)
            if( a == -1 ){
                length = 1;
                if(word2 == null)
                    return {word: word, length: length};
                a = this._search(this.KoreanWords, word) 
                if(a == -1)
                    return {word: word, length: length}
                //console.log(word,': nope')
                //return ">"+word+"<"
            }
            //console.log(a,`\t`,this.EnglishWords[a].link)
            for(var j=0; j<this.KoreanWords[a].link.length; j++){
                let e = this.KoreanWords[a].link[j]
                if( b == null)
                   b = this.EnglishWords[e]
                else if(this.EnglishWords[e].link.length > b.link.length)
                    b = this.EnglishWords[e]

            }
        }
        //console.log(word,":",b.word)
        return {word:b.word, length:length}
    }
    
}
class MappingNode{
    constructor(Word, linkNumber){
        this.word = Word
        this.link = [ linkNumber ]
    }
    insertLink(linkNumber){
        this.link.push(linkNumber)
    }
}


var dbCon = new dbObject()
var a = new Mapper()
console.log('\n\n\n\n\n\n\n\n\n\n\n\n')
setTimeout(()=>{
	/*
	brands.forEach( (e)=>{
		browseModels(dbCon,e,null,null,null)
	})
    */
    MappingJordan(a)
    MappingAdidas(a)
    MappingNike(a)
    MappingAll(a)
    
	dbCon.Sneakers.select_shoe(dbCon.getDB(), null, null,(results)=>{
        distribute(a, results, "Eng")
        
    })
    
},0)

function distribute(mapper, results, lan="Eng", rot=1){
    let unlan = lan=="Eng" ? "Kor" : "Eng";
    results.forEach((e)=>{
        let i=0
        var arr = e.shoe.split(' ')
        let str = ""
        for(i=0; i<arr.length-1; i++){
            let result=mapper.convert(lan, arr[i], arr[i+1])
            if(result.length == 2) i++
            //console.log(`arr[i]: ${arr[i]}\n arr[i+1]: ${arr[i+1]}\nresult: ${result.word}`)
            str += result.word + " "
        }
        if( i<arr.length ){
            let result = mapper.convert(lan, arr[i], null)
            str += result.word
        }
        console.log(e.shoe)
        console.log("=>",str)
        
        if(rot == 1){
            distribute(mapper, [{shoe:str}], unlan, 0)
        }
        console.log("\n")

    })
}


function MappingAll( a ){
    a.insert("Boat", "보트")
    a.insert("Decon", "데콘")
    a.insert("Legend", "레전드")
    a.insert("New", "뉴")

    a.insert("Slip-On", "슬립온")
    a.insert("Slip On", "슬립온")
    a.insert("Pro", "프로")
    a.insert("Slip", "슬립온")
    a.insert("Alpha", "알파")
    a.insert("ACE", "에이스")
    a.insert("Ace", "에이스")
    a.insert("Max", "맥스")
    a.insert("Trek", "트렉")
    a.insert("Team", "팀")
    a.insert("Origin", "오리진")
    a.insert("Premiere", "프리미어")
    a.insert("Premium", "프리미엄")

    a.insert("Christmas", "크리스마스")
    a.insert("Leather", "레더")
    a.insert("Suede", "스웨이드")
    a.insert("Recon", "레콘")
    a.insert("Craft", "크레프트")
    a.insert("Buckle", "버클")
    a.insert("Trail", "트레일")
    a.insert("Trainers", "트레이너")
    a.insert("Trainer", "트레이너")
    a.insert("Train", "트레인")
    a.insert("Running", "러닝")
    a.insert("Runner", "러너")
    a.insert("Run", "런")
    a.insert("Racing", "레이싱")
    a.insert("Racer", "레이서")
    a.insert("Nova", "노바")
    a.insert("Skate", "스케이트")
    a.insert("Support", "서포트")
    a.insert("Boost", "부스트")
    a.insert("Super", "슈퍼")
    a.insert("Pack", "팩")
    a.insert("High", "하이")
    a.insert("Mid", "미드")
    a.insert("Low", "로우")
    a.insert("Retro", "레트로")
}
function MappingJordan ( a ){
        a.insert("Jordan", "조던")
        a.insert("Air Jordan", "조던")
        a.insert("Jordan Air", "조던")
		a.insert("Spizike","스피자이크")
		a.insert("Flightclub","플라이트클럽")
		a.insert("Flight","플라이트")
        

		a.insert("Nouveau", "누보")
		a.insert("Formula", "포뮬러")
		a.insert("Future", "퓨처")

		a.insert("Jumpman", "점프맨")
		a.insert("LStyle", "엘스타일")
		a.insert("Pure", "퓨어")

		a.insert("Flyknit", "플라이니트")
		a.insert("Super.fly", "슈퍼 플라이")
		a.insert("Super fly", "슈퍼 플라이")
		a.insert("SuperFly", "슈퍼플라이")
		a.insert("Super Fly", "슈퍼플라이")
		a.insert("Super.Fly", "슈퍼플라이")
		a.insert("Super", "슈퍼")
		a.insert("Prime.Fly", "프라임 플라이")
		a.insert("Prime", "프라임")
		a.insert("Fly", "플라이")
		a.insert("Hydro", "하이드로")
        a.insert("Advance", "어드밴스")
        a.insert("Ultra", "울트라")
        a.insert("Express", "익스프레스")
        a.insert("Melo", "멜로")
		a.insert("Imminent", "이미넌트")
		a.insert("Illusion", "일루전")
        
		a.insert("School", "스쿨")
		a.insert("Velocity", "벨로시티")
		a.insert("Trainer", "트레이너")
		a.insert("Train", "트레인")
		a.insert("Air", "에어")
        //console.log(`${array[0]}. ${input[i].shoe} \t=> ${str}`)


        /*
		a.insert("XXXIII", "33")
		a.insert("XXXII", "32")
		a.insert("XXXI", "31")

		a.insert("XXX3", "33")
		a.insert("XXX2", "32")
		a.insert("XXX1", "31")
	
		a.insert("XXX", "30")
		a.insert("XX9", "29")
		a.insert("XX8", "28")
		a.insert("XX", "20")

		a.insert("Xiii", "13")
		a.insert("Xii", "12")
		a.insert("XI", "11")
		a.insert("Xi", "11")


		a.insert("VIII", "8")
		a.insert("Viii", "8")
		a.insert("VII", "7")
		a.insert("VI", "6")
		a.insert("IV 4", "4")
			
		a.insert("V.", "5.")
		a.insert(" V ", " 5 ")
		a.insert("I 1", "1")
		a.insert("III", "3")
        a.insert("II", "2")
        */
}

function MappingNike ( a ){
    a.insert("Nike", "나이키")
    a.insert("Air Max", "에어맥스")
    a.insert("Air Force", "에어포스")
    a.insert("Delta Force", "델타포스")
    a.insert("Sky Force", "스카이포스")
    a.insert("Court Force", "코트포스")
    a.insert("Lunar Force", "루나포스")

    a.insert("HyperRev", "하이퍼레브")
    a.insert("Hyperrev", "하이퍼레브")
    a.insert("HyperAdapt", "하이퍼어댑트")
    a.insert("Hypershift", "하이퍼쉬프트")
    a.insert("Hypervenom", "하이퍼베놈")
    a.insert("Hyperdunk", "하이퍼덩크")
    a.insert("Hyperize", "하이퍼라이즈")
    a.insert("Hyperfuse", "하이퍼퓨즈")
    a.insert("Hyperlive", "하이퍼라이브")
    a.insert("Hyperchase", "하이퍼체이스")
    a.insert("Hyperflight", "하이퍼플라이트")
    a.insert("Hyperquickness", "하이퍼퀵니스")
    a.insert("Hyperposite", "하이퍼포짓")
    a.insert("Hyperfeel", "하이퍼필")

    a.insert("Lunar Epic", "루나에픽")
    a.insert("LunarEpic", "루나에픽")
    a.insert("Lunarepic", "루나에픽")
    a.insert("LunarSolo", "루나솔로")
    a.insert("Lunarendor", "루나엔도어")
    a.insert("Lunartempo", "루나템포")
    a.insert("Lunardome", "루나돔")
    a.insert("Lunarcharge", "루나차지")
    a.insert("Lunar", "루나")
    a.insert("Lupinek", "루피넥")

    a.insert("Superfly", "슈퍼플라이")
    a.insert("Mayfly", "메이플라이")
    a.insert("Vaporfly", "베이퍼플라이")
    a.insert("VaporMax", "베이퍼맥스")
    a.insert("Flystepper", "플라이스테퍼")
    a.insert("Flyknit", "플라이니트")
    a.insert("Flightposite", "플라이트포짓")
    a.insert("Foamposite", "폼포짓")
    a.insert("Flight", "플라이트")
    a.insert("Posite", "포짓")
    a.insert("Fly", "플라이")
    a.insert("Sky", "스카이")

    a.insert("Waffle Racer", "와플레이서")
    a.insert("Waffle", "와플")
    a.insert("Aqua Sock", "아쿠아삭")
    a.insert("Sock Racer", "삭레이서")
    a.insert("Sock Dart", "삭다트")
    a.insert("Moon Racer", "문레이서")
    a.insert("Moon", "문")

    a.insert("Stefan Janoski", "스테판 야노스키")
    a.insert("Janoski", "야노스키")
    a.insert("Paul Rodriguez", "폴 로드리게즈")
    a.insert("Cradle Rock", "크래들락")
    a.insert("Blazer", "블레이저")
    a.insert("Supreme", "슈프림")
    a.insert("Trainerendor", "트레이너엔도르")
    a.insert("Trainer", "트레이너")
    a.insert("Train", "트레인")
    a.insert("LeBron", "르브론")
    a.insert("Mogan", "모건")
    a.insert("Vomero", "보메로")
    a.insert("Romaleos", "로말레오")
    a.insert("Odyssey", "오디세이")
    a.insert("Loden", "로덴")
    a.insert("Deconstructed", "디컨스트럭티드")

    a.insert("Free Run", "프리런")
    a.insert("Free RN", "프리런")
    a.insert("Free", "프리")

    a.insert("Portmore", "포트모어")
    a.insert("Solarsoft", "솔라소프트")
    a.insert("Pocket Knife", "포켓나이프")
    a.insert("Pocketknife", "포켓나이프")

    a.insert("Metcon", "메트콘")
    a.insert("Lil Penny", "릴페니")
    a.insert("Penny", "페니")
    a.insert("Mamba Rage", "맘바 레이지")
    a.insert("Mamba", "맘바")
    a.insert("Roshe Run", "로쉐런")    //물어보기
    a.insert("Rosherun", "로쉐런")
    a.insert("Roshe One", "로쉬 원")
    a.insert("Roshe", "로쉬")
    a.insert("Bruin", "브루인")
    a.insert("Gato", "가토")
    a.insert("Toki", "토키")
    a.insert("Kyrie", "카이리")
    a.insert("Cortez", "코르테즈")
    a.insert("Nano", "나노")
    a.insert("Braata", "브라타")
    a.insert("Rookie", "루키")
    a.insert("Pippen", "피펜")
    a.insert("Huarache", "허라치")
    a.insert("Gaiter", "게이터")
    a.insert("Moccasin", "모카신")
    a.insert("Griffey", "그리피")
    a.insert("Voltak", "볼텍")
    a.insert("Vortax", "볼텍스")
    a.insert("Tanjun", "탄준")
    a.insert("Benassi", "베나시")
    a.insert("Phelon", "펠론")
    a.insert("Regime", "레짐")

    a.insert("All Court", "올코트")
    a.insert("Superdome", "슈퍼돔")
    a.insert("Squad", "스쿼드")
    a.insert("React", "리엑트")
    a.insert("Element", "엘리먼트")
    a.insert("Royal", "로얄")
    a.insert("Sonic", "소닉")
    a.insert("Encore", "온코어")
    a.insert("Soldier", "솔져")
    a.insert("Mercurial", "머큐리얼")
    a.insert("Vapor", "베이퍼")
    a.insert("Vandal", "반달")
    a.insert("Zoom", "줌")
    a.insert("Air", "에어")
    a.insert("Alpha", "알파")
    a.insert("Kobe", "코비")
    a.insert("Dunk", "덩크")
    a.insert("Hybrid", "하이브리드")
    a.insert("Shox", "샥스")
    a.insert("Canvas", "캔버스")
    a.insert("Total", "토탈")
    a.insert("Untouchable", "언터쳐블")
    a.insert("Presto", "프레스토")
    a.insert("Gravity", "그레비티")
    a.insert("Killshot", "킬샷")
    a.insert("Vintage", "빈티지")  //중고??
    a.insert("Ultra", "울트라")
    a.insert("Rise", "라이즈")
    a.insert("Rebel", "레벨")
    a.insert("Adapt", "어댑트")
    a.insert("Control", "컨트롤")
    a.insert("Woven", "우븐")
    a.insert("Duel", "듀얼")
    a.insert("Basic", "베이직")
    a.insert("Tennis", "테니스")
    a.insert("Classic", "클래식")
    a.insert("Studio", "스튜디오")
    a.insert("Two", "2")
}


function MappingAdidas ( a ){
    a.insert("adidas", "아디다스")
    a.insert("Yeezy Boost", "이지부스트")
    a.insert("Yeezy", "이지")
    a.insert("Ultra Boost", "울트라부스트")
    a.insert("Ultraboost", "울트라부스트")
    a.insert("Energy Boost", "에너지부스트")
    a.insert("Solarboost", "솔라부스트")
    a.insert("Pure Boost", "퓨어부스트")
    a.insert("PureBoost", "퓨어부스트")
    a.insert("Pureboost", "퓨어부스트")
    a.insert("Purebounce", "퓨어바운스")
    a.insert("Purecontrol", "퓨어컨트롤")
    a.insert("PureControl", "퓨어컨트롤")
    a.insert("Marquee Boost", "마키부스트")
    a.insert("Busenitz", "부세니츠")
    a.insert("Harden", "하든")
    a.insert("Iniki", "이니키")
    a.insert("Nemeziz", "네메시스")
    a.insert("Spezial", "스페지알")
    a.insert("Superstar", "슈퍼스타")
    a.insert("Supernova", "수퍼노바")
    a.insert("Alphaedge", "알파엣지")
    a.insert("Stan Smith", "스탠스미스")

    a.insert("CrazyTrain", "크레이지 트레인")
    a.insert("Crazy Light", "크레이지 라이트")
    a.insert("Crazylight", "크레이지 라이트")
    a.insert("Crazy", "크레이지")
    

    a.insert("Instinct", "인스팅트")
    a.insert("Response", "리스판스")   //리스폰스로도 많이나옴
    a.insert("Chop Shop", "찹샵")
    a.insert("Haven", "헤븐")
    a.insert("Copa", "코파")
    a.insert("COPA", "코파")
    a.insert("Qasa", "콰사")   //카사
    a.insert("Slingshot", "슬링샷")
    a.insert("Hulton", "헐튼")
    a.insert("Mundial", "문디알")
    a.insert("Kozoko", "코조코")
    a.insert("JawPaw", "조포")
    a.insert("Aktiv", "악티브")
    a.insert("Tango", "탱고")
    a.insert("Nizza", "니짜")
    a.insert("Elle", "엘르")
    a.insert("Garwen", "가윈")
    a.insert("Lacombe", "라콤베")
    a.insert("Ozweego", "오즈위고")
    a.insert("Tubular", "튜블라")
    a.insert("Glenbuck", "글렌벅")
    a.insert("Rascal", "라스칼")
    a.insert("Speedfactory", "스피드 팩토리")

    a.insert("adiColor", "아디컬러")
    a.insert("Adicolor", "아디컬러")
    a.insert("Adizero", "아디제로")
    a.insert("adiZero", "아디제로")
    a.insert("Afterburner", "에프터버너")



    a.insert("Hypersleek", "하이퍼슬릭")
    a.insert("Sleek", "슬릭")
    a.insert("Shadow", "섀도우")
    a.insert("Berlin", "베를린")
    a.insert("Boston", "보스턴")
    a.insert("Predator", "프레데터")
    a.insert("Accelerator", "엑셀레이터")

    a.insert("Futurepacer", "퓨처페이서")
    a.insert("Futurecraft", "퓨처크래프트")
    a.insert("Stockholm", "스톡홀름")
    a.insert("Torsion", "토션")
    a.insert("Terrex", "테렉스")
    a.insert("Gazelle", "가젤")
    a.insert("Climacool", "클라이마쿨")    //클리마도 씀
    a.insert("ClimaCool", "클라이마쿨")    //클리마도 씀
    a.insert("Sambarose", "삼바로즈")
    a.insert("Samba", "삼바")
    a.insert("AlphaBounce", "알파바운스")
    a.insert("Alphabounce", "알파바운스")
    a.insert("Roundhouse", "라운드하우스")
    a.insert("Campus", "캠퍼스")
    a.insert("Hardland", "하드랜드")
    a.insert("Century", "센츄리")
    a.insert("Mad Clima", "매드 클라이마")
    a.insert("Marathon", "마라톤")
    a.insert("Powerphase", "파워페이즈")
    a.insert("Solar", "솔라")
    a.insert("Explosive", "익스플로시브")


    a.insert("Lightswitch", "라이트스위치")
    a.insert("Gil", "길")
    a.insert("Replicant", "레플리카")
    a.insert("Micropacer", "마이크로페이서")
    a.insert("Primeknit", "프라임니트")
    a.insert("Climacool", "클라이마쿨")
    a.insert("Clima", "클라이마")

    a.insert("Cloudfoam", "클라우드폼")
    a.insert("Indoor", "인도어")
    a.insert("Kreft", "크래프트")
    a.insert("Advantage", "어드벤티지")
    a.insert("Clean", "클린")
    a.insert("Level", "레벨")
    a.insert("Bunny", "버니")
    a.insert("Icon", "아이콘")
    a.insert("Turf", "터프")
    a.insert("Ultimate", "얼티메이트")
    a.insert("Modern", "모던")
    a.insert("Daily", "데일리")
}