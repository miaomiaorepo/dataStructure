// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the cheerio object into a variable, `content`
// which holds data and metadata about the html file (written as txt)
var content = fs.readFileSync('data/m01.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

function parseData (data){
  //creat aa meetings list by name
  const aa = {
    name:"",
    location:"",
    address:"",
    wheelchair:"",
    meetings: [] 
  }
  
  //get metadata
  const left = data.split("</td>")[0]
  const right_arr = data.split("</td>")[1].split('\t\t\t\t  \t    <b>').splice(1)

  //get leftside
  const location =  left.split('<b>')[0].split('0;">')[1].split('</h4>')[0]
  // console.log(left.split('<b>'))
  const address1 = left.split('<b>')[1].split("<br>")[1].replace("\t\t\t\t\t\t",'').trim()
  const address2 = left.split('<b>')[1].split("<br>")[2].replace("\t\t\t\t\t\t",'').trim()
  const address = address1 + address2
  //const address = address1.split(',')[0]
  const name = left.split('<b>')[1].split("<br />")[0].replace("</b>").split('<br>')[0].split("-")[0]
  
  
  //bind data
  aa.name = name
  aa.location = location
  aa.address = address
  
  //wheelChair
  if(left.includes('Wheelchair Access')){
    aa.wheelchair = "yes"
  }else{
    aa.wheelchair = "unknown"
  }
  
  //get meeting time
  for(let i=0;i<right_arr.length;i++){
    //create a meeting time list
    let meeting={
    day: "",
    start: "",
    end:"",
    type:"",
    specialInterest:"",
  }
    
    let item = right_arr[i]
    meeting.day = item.split(" ")[0]
    meeting.start = item.split('b')[1].replace("> ",'').replace(" <",'')
    meeting.end = item.split('b')[3].replace("> ",'').replace(" <",'')
    
    // check special interest
    if(item.includes("Special")) {
      meeting.specialInterest = item.split('b')[9].replace(/\t|\n|\v|\r|\f/g,'').replace("> ",'').replace(" <",'')
    } else{
      meeting.specialInterest = "none"
    }
    
    // check meeting time
    if(item.includes("Type")){
      meeting.type = item.split('b')[6].replace(/\t|\n|\v|\r|\f/g,'').replace("> ",'').replace(" <",'')
    }else{
      meeting.type = "none"
    }

    aa.meetings.push(meeting)
    
  }
  
  return aa
}

function get_address(data){
  
  const left = data.split("</td>")[0]
  const address1 = left.split('<b>')[1].split("<br>")[1].replace("\t\t\t\t\t\t",'').trim()
  const address = address1.split(',')[0]
  
  return address
}

const addressArr = []

$('tr').each(function(i, elem) {
    if ($(elem).attr("style")=="margin-bottom:10px") {
        let row = $(elem).html();
// run my function
        let result = parseData(row); 
        console.log(result)
        //let add = get_address(row)
        //addressArr.push(add)
    }
});


