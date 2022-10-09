// npm install axios
// mkdir data

const fs = require('fs');

const axios = require('axios');

axios
  .get('https://parsons.nyc/aa/m08.html')
  
  //res = repsonse
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res.data);
    fs.writeFileSync('/home/ec2-user/environment/dataStructure/data/m08.txt', res.data);
  })
  .catch(error => {
    console.error(error);
  });