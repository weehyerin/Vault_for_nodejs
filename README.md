# nodejs example using vault
## using ec2, ubuntu 16.04

-------


## vault install
0. apt update && install unzip
~~~
sudo apt update && apt upgrade -y

sudp apt install unzip -y
~~~
1. download zip file
~~~
wget https://releases.hashicorp.com/vault/0.11.4/vault_0.11.4_linux_amd64.zip
~~~

2. Unzip the file.
~~~
unzip vault_0.11.4_linux_amd64.zip
~~~

3. move to home
~~~
mv vault /usr/bin
~~~

4. create config dir, /etc/vault
~~~
mkdir /etc/vault
~~~

5. install consul
~~~
wget https://releases.hashicorp.com/consul/1.3.0/consul_1.3.0_linux_amd64.zip
~~~

6. unzip and move
~~~
unzip consul_1.3.0_linux_amd64.zip
mv consul /usr/bin
~~~

1. consul 설치 된 것 확인
~~~
consul -v
~~~
2. vault 설치 된 것 확인
~~~
vault --version
~~~
![image](https://user-images.githubusercontent.com/37536415/62678767-58388e80-b9ed-11e9-9983-9b3cc33f5ed7.png)

>> consul이란, 클라우드 환경에서 MicroService Architecture 에서 서비스간 통신을 위한 메커니즘 구현을 쉽게 해주는 것


-------


## vault dev server & client setting

1. server 실행
~~~
vault server -dev
~~~

#### dev server 실행 확인
![image](https://user-images.githubusercontent.com/37536415/62679003-10fecd80-b9ee-11e9-9726-b910e65ce862.png)

- unseal key, root token 기억하기 
![image](https://user-images.githubusercontent.com/37536415/62679054-3986c780-b9ee-11e9-9d9f-4f3bb502b080.png)


2. 새로운 terminal 열고, client 설정
~~~
export VAULT_ADDR='http://127.0.0.1:8200'
~~~

~~~
export VAULT_DEV_ROOT_TOKEN_ID="<위에서 알아낸 루트 토큰>"
~~~

3. client 설정 확인
~~~
vault status
~~~

![image](https://user-images.githubusercontent.com/37536415/62679185-a8fcb700-b9ee-11e9-9009-e5018ce4aca9.png)



---------


## npm init

0. make dir
~~~
mkdir test_vault
cd test_vault
~~~

1. npm init
~~~
npm init -D
~~~
--> make package.json

2. npm install express, vault
~~~
npm install express -D
npm install vault -D
npm install node-vault -D
npm install request -D
~~~


-----------

## phillips hue using color picker

1. replace color picker(RGB code) value with hue
~~~
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
~~~


---------


## client에서 secret engine && write data

1. enable kv engine
~~~
vault secrets enable kv
~~~

2. 경로(path) 만들어서 데이터 넣기(vault는 경로 기반으로 접근하여 사용) - kv/phillips 경로 만들기, key라는 field 만들어서 저장하고 싶은 값 넣을 수 있음
~~~
vault kv put kv/phillips key = <저장하고 싶은 값>
~~~

3. 위에서 저장한 값 가져오기 
~~~
vault kv get kv/phillips
~~~

4. key 값만 가져오기 
~~~
vault kv get -field=key kv/phillips
~~~
> kv/phillips의 phillips 값과, key = <저장하고 싶은 값>에서 key, <저장하고 싶은 것>은 원하는 값을 넣어서 사용하면 됨.
> key = <저장하고 싶은 값> ; key - value 쌍으로 저장이 됨



---------


## nodejs에서 vault 사용하기

1. server를 실행하며 알아낸, roottoken과 unseal key로 접근하여 값을 가져오므로, 변수로 token과 key 값 저장하기

~~~
const rootKey = "1FX0wh33W6hf7rCSk5TVtz1k"
var unsealKey = "tfG3KmrE50/M8jEW1tGhUCfcgxrh6AfiiNACPstUVI8="

var options = {
    apiVersion: 'v1',
    endpoint: 'http://127.0.0.1:8200',
    token: rootKey
};
~~~

**주의할 점 : http인지, https인지 구분해서 사용하기**

2. kv/phillips에 저장한 값 가져와서 사용하기 

~~~
var vault = require("node-vault")(options);
vault.unseal({ key: unsealKey })
    .then(() => {
        vault.read('kv/phillips')
          .then((res) => console.log("result : ", res.data.key))
          .catch((err) => console.error("error:",err));
    });
~~~

**주의할 점 : error catch를 반드시 해주어야 함.**

kv/phillips 안에 있는 데이터를 읽어오면, json 형식으로 반환하는데, 우리가 저장한 값은 data라는 field의 key라는 변수에 저장이 되어있으므로, res.data.key로 값을 가져옴

**주의할 점 : unseal key를 한 번 인증하면, 한 번 안에 있는 데이터를 가져올 수 있음**

따라서 한 번 res.data.key를 사용했다면, 아래의 코드에서는 사용할 수가 없음. 즉, 다시 사용하고 싶다면 unseal key를 인증한 후에 다시 접근해서 가져오기. (자세한 예시는 nodes_phillips_using_vault.js를 보고 이해하긴)
변수에 대입하여 사용할 수도 없음.
