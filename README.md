# nodejs example using vault
## using ec2, ubuntu 16.04

-------


## vault install
0. apt update && install unzip
~~~
apt update && apt upgrade -y

apt install unzip -y
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