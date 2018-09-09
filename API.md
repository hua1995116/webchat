#API

### POST

#### /user/signin 注册


```
body: {

​	name:  （String）  // 用户名称

​	 password: （String）  // 密码

​	src:  （String）// 随机头像 

}
```
#### /user/signup  登录
```
body: {

​	name:  （String）  // 用户名称

​	 password: （String）  // 密码

}
```
#### /file/uploadimg

formdata格式


```
formdata {

​	file: (Object)  // file文件

​	username:  (String)  //用户名

​	src:  ( String) // 头像

​	roomid:    (String)  // 房间号

​	time:( Date) // 时间戳

}
```




### GET

#### /message  // 获取当前房间的最新80条信息
```
query：{

​	roomid:   (String) // 房间号

}
```
#### /history/message  获取历史记录
```
query：{

​	 current:   (number)// 当前页数  默认80条/页

​	 roomid:  (String) //  房间号

}
```

#### /robotapi
```
query：{

​	 info:   (String)// 信息

​	 id:  (String) // 用户名字

}
```