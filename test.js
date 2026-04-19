const http = require('http');
fetch('http://localhost:3000').then(res => res.text()).then(text => {
  if (text.includes('Error')) console.log("Has error");
  console.log("Length:", text.length);
});
