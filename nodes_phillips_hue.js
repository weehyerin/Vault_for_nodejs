/**
 * 웹 서버에 html 파일 서비스 하기
 */
var express =  require('express');
var app = express();
var http = require('http');
var path = require('path');
var fs = require('fs'); // 파일 읽기, 쓰기 등 을 할 수 있는 모듈
var url = require('url');
var onoff = "off";
var bodyparser = require('body-parser');
var request = require('request');
var hue = 10000;
var sat = 255;
var bri = 255;
var url = require('url');


function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgb2hsv (r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs),
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff == 0) {
      h = s = 0;
  } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
          h = bb - gg;
      } else if (gabs === v) {
          h = (1 / 3) + rr - bb;
      } else if (babs === v) {
          h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
          h += 1;
      }else if (h > 1) {
          h -= 1;
      }
  }
  return {
      h: Math.round(h * 360),
      s: percentRoundFn(s),
      v: percentRoundFn(v)
  };
}

//정보 가져오기
request({ 
  url: '<phiilips hue url>' + '2',    //2번 그룹 전등 상태 확인
  method: 'GET',
  }, function(err, response, body) {
      var group1status = JSON.parse(body)
      console.log(group1status)
  }
)
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
        res.writeHead(200,{"Content-Type":"text/html"});
        fs.createReadStream("./checkbox.html").pipe(res); 
        console.log(req.url);
})
app.get("/send_email", function(req, res) {
  console.log(req.url);
  var template = `
  <!DOCTYPE html>
  <html>
  <head>
  <body>

  <h2>Summary</h2>
  </body>
  </html>
`;
})

app.post("/send_email", function(req, res) {
  //console.log(req.url);
  console.log("check :", req.body.check);
  var check = req.body.check;
  backURL=req.header('Referer') || '/';
  // do your thang
  
  if(check == "on"){
    console.log("onnnnnnnnnn");
    request({       
      url: '<phiilips hue url>' + '2' + "/action",    //2번 그룹 전등 제어
      method: 'PUT',
      body: JSON.stringify({"on":true, "sat":sat, "bri":bri,"hue":hue})  //on : ture 켜기, on : false 끄기
    })
  }
  else{
    request({       
      url: '<phiilips hue url>' + '2' + "/action",    //2번 그룹 전등 제어
      method: 'PUT',
      body: JSON.stringify({"on":false})  //on : ture 켜기, on : false 끄기
    })
  }

})

app.post("/color", function(req, res) {
  
  var color = req.body.color;
  var red = hexToRgb(color).r;
  var green = hexToRgb(color).g;
  var blue =hexToRgb(color).b;
  console.log(rgb2hsv(red, green, blue).h);
  var h = rgb2hsv(red, green, blue).h;
  var s = rgb2hsv(red, green, blue).s;
  var b = rgb2hsv(red, green, blue).v;
  hue = Math.floor(65535 * h / 360);
  sat = Math.floor(s * 255);
  bri = Math.floor(b * 255);
  console.log("hue, ", hue);
  
  request({       
      url: '<phiilips hue url>' + '2' + "/action",    //1번 그룹 전등 제어
      method: 'PUT',
      body: JSON.stringify({"on":true, "sat":sat, "bri":bri,"hue":hue})  //on : ture 켜기, on : false 끄기
    })
  
  res.writeHead(200);
  res.end();
})

http.createServer(app).listen(8080);
console.log("Server Created...");
