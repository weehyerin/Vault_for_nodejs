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

>> consul이란, 클라우드 환경에서 Micro Service Architecture 에서 서비스간 통신을 위한 메커니즘 구현을 쉽게 해주는 것


### consul

[출처 : 조대협](http://bcho.tistory.com)


MSA(Micro Service Architecture)와 같은 분산 환경은 서비스 간의 원격 호출로 구성이 된다. 원격 서비스 호출은 IP 주소와 포트를 이용하는 방식이 되는다. 

클라우드 환경이 되면서 서비스가 오토 스케일링등에 의해서 동적으로 생성되거나 컨테이너 기반의 배포로 인해서, 서비스의 IP가 동적으로 변경되는 일이 잦아졌다.


![image](https://user-images.githubusercontent.com/37536415/62753936-ad85a600-baa8-11e9-9cfc-4db4da941d2f.png)



그래서 서비스 클라이언트가 서비스를 호출할때 서비스의 위치 (즉 IP주소와 포트)를 알아낼 수 있는 기능이 필요한데, 이것을 바로 서비스 디스커버리 (Service discovery)라고 한다.



다음 그림을 보자 Service A의 인스턴스들이 생성이 될때, Service A에 대한 주소를 **Service registry (서비스 등록 서버) 에 등록**해놓는다. Service A를 호출하고자 하는 클라이언트는 Service registry에 Service A의 주소를 물어보고 등록된 주소를 받아서 그 주소로 서비스를 호출한다.

![image](https://user-images.githubusercontent.com/37536415/62753937-b24a5a00-baa8-11e9-8fc9-247dfb346a3f.png)





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



---------


# using docker

서버를 다시 실행할 때 마다 root token과 unseal key 가 바뀌어서 실행할 때마다 다시 실행해야 하므로 그 문제를 고치고자 consul을 사용하려하였다.

하지만, consul을 사용하기 위해 config.hcl을 사용하고 
~~~
storage "consul" {
  address = "127.0.0.1:8500"
  path    = "vault/"
}

listener "tcp" {
 address     = "127.0.0.1:8200"
 tls_disable = 1
}
~~~
을 했을 때, error가 생기고 잡히지 않아서 consul까지 설치된 docker를 사용하고자 하였다. 

## docker 설치
https://blog.cosmosfarm.com/archives/248/%EC%9A%B0%EB%B6%84%ED%88%AC-18-04-%EB%8F%84%EC%BB%A4-docker-%EC%84%A4%EC%B9%98-%EB%B0%A9%EB%B2%95/

## docker compose 설치
https://zetawiki.com/wiki/%EC%9A%B0%EB%B6%84%ED%88%AC16_docker-compose_%EC%84%A4%EC%B9%98

## docker(Docker + Consul + Vault) 사용

[출처](http://egloos.zum.com/mcchae/v/11318672)

1. git clone
~~~
git clone https://github.com/mcchae/docker_consul_vault.git
cd docker_consul_vault
~~~

2. start.sh
~~~
sh start.sh
~~~

3. 서버 실행
지금까지 `vault server -dev`로 하였지만, docker로 다운받은 vault를 실행할 것이기 때문에 아래처럼 실행해주면 됨.
~~~
docker-compose up
~~~

4. 다른 터미널 창에서..

~~~
export VAULT_ADDR='http://127.0.0.1:8200'

vault status
~~~

출처 링크에서는 아래와 같이 설명되어 있었다.
> dhv 다커 마운트 폴더에 key.txt 가 없으면 scripts/setup.sh 를 실행시키고,
> 아니고 있으면 scripts/unseal.sh 를 실행시킵니다.

나는 key.txt 가 없었는데, `sh scripts/setup.sh`이 실행이 안되었다. 
key.txt의 역할은 vault init에 있는 값들을 저장해놓기 위한 것이어서 그냥 client에서 vault init을 하고 그 결과를 key.txt 파일을 만들어서 직접 저장해주었다.

~~~
vault init
~~~

위의 결과를

~~~
vi /dhv/key.txt
~~~

에 저장해주었다.

5. unseal

vault init의 결과로 5개의 unseal key와 root token을 알 수 있다. 
secret engine을 만들고 사용을 하려면, unseal key가 sealing되어 있는 것을 unseal 해주어야 하고, root token으로 login을 해주어야 한다. 

~~~
vault operator unseal
~~~

을 입력하면 unseal key를 입력하는 란이 나옴.
`vault init`으로 나온 결과를 위의 명령어로 하나씩 풀어줘야 함.

**이걸 해주지 않으면 `Vault is sealed`라는 경고창이 뜰 것임**

6. login

~~~
vault login <root token>
~~~

`vault init`으로 알아낸 root token으로 로그인을 해주어야 사용이 가능함. 그렇지 않으면 `permission denied`가 뜰 것.

여기까지 해주면 위에서 secret engine을 만들고, path 경로로 data를 넣어주는 게 가능함

7. server 종료
~~~
docker-compose down
~~~

을 해주면 server가 종료됨.
서버를 다시 실행한다고 해도, unseal key와 root token은 변함이 없으니 nodejs 코드에 root token과 unseal key를 바꿔주지 않아도 사용 가능!






