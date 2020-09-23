# spring boot启动web服务器的框架设计

## 接口设计

### **No.1 interface org.springframework.boot.web.server.WebServer**

>该接口制定了一个web服务器的生命周期规范，启动，停止，获取端口
,实现该接口则可以执行具体的服务器中间件的启动，例如tomcat,jetty,netty
等等。tomcat的实现是TomcatWebServer，netty的实现是NettyWebServer，jetty
的实现是JettyWebServer。

### **No.2 SpringApplication：双SpringApplication**

>springboot在启动的时候会先发布事件，事件由EventPublishingRunListener发布，
EventPublishingRunListener会找到classpath中所有的ApplicationListener，
其中spring-cloud-context提供了一个listener(BootstrapApplicationListener),
这个listener会去启动了spring 容器，就是总所周知的bootstrap.properties/yaml
文件配置的容器。然后springboot才会启动自己的容器，bootstrap容器是springboot
自己容器的父亲容器，这样做可以让bootstrap这个容器在spring boot容器之前启动和初始化，
便于一些有先后顺序初始化的bean的装配，springboot的容器则会启动一个tomcat。

### **在springboot中Tomcat是如何启动的**

>ServletWebServerApplicationContext是springboot的容器类，
他在onRefresh()的时候回去创建Tomcat server，也就是启动Tomcat，
他启动Tomcat并非使用Tomcat提供的Bootstrap类来启动的，而是用tomcat的api来
实现了一个WebServer，进而依赖自身的api去启动tomcat，这样做的好处是不强依赖
tomcat，换一个server就使用对应的WebServer去启动即可。
在启动的时候使用编程式方式向tomcat注册初始化filter和servlet的回调函数，
然后tomcat启动过程中调用回调函数实现动态向tomcat中添加filter和servlet

## **spring的DispatcherServlet是如何接受到请求的**

>Tomcat的Coytoe监听到请求之后会将请求转发到对应的Service，Service再实例化一个
ApplicationFilterChain，然后执行过滤器和servlet，如果所有过滤器都返回true
，则该请求可以被DispatcherServlet执行，否则，将直接返回到客户端

## **spring容器启动过程中，会收到来自客户端的请求吗？**

>容器启动过程中是不会接收到http请求的，因为springboot会等到容器完全初始化
完毕才会调用完成tomcat的初始化
