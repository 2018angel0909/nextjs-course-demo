import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";
//列表内容

//如果数据库连接成功就不需要虚拟数据
const meetups = [
  {
    id: "m1",
    title: "This is great pic",
    address: "xin wei lai park",
    image:
      "https://thumbs.dreamstime.com/b/amazing-sunset-view-palm-tree-downtown-los-angeles-california-usa-165472741.jpg",
    description: "This is frist meetup",
  },
  {
    id: "m2",
    title: "This is great pic",
    address: "xin wei lai park",
    image:
      "https://thumbs.dreamstime.com/b/amazing-sunset-view-palm-tree-downtown-los-angeles-california-usa-165472741.jpg",
    description: "This is second meetup",
  },
];

//head添加title。网页打开就会有名字。meta是描述。html元素代码就会有描述文字，。有益于容易被谷歌搜索引擎搜索到，增加网页排名
//pages网页都要写，除了api里
function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React Meetups"
        />
      </Head>

      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}
//只有在需要数据的地方用预渲染和获取数据，只在build执行预渲染，我们开发人员服务器上可以看到
//Next.js里获取静态道具getStaticProps，这个在build的时候执行，利于搜索引擎爬虫。会抓取到html里关键字。优化SEO获取静态页面page。会生成404，动态页面，这样用户打开就会直接获取到数据，不需要等，实心点就是SSG用了这里静态站点的页面，不在浏览器上运行
//getStaticProps静态会先生成html。可以存储该文件并有CDN提供服务，不会一直再生，页面工作速度快。会被缓存，并重复使用，不会多次重新生成页面
//用在博客不经常更换的页面。更换频繁用getServerSideProps，服务器上运行，等待页面在每个传入的请求上生成。再生的，会多次重新生成页面
//得到的数据，再给上面的HomePage函数，props.meetup
//如果数据变化。就要重新部署

export async function getStaticProps() {
  //frtch data from an API
  //但是由于自己创建了一个api服务器，所以可以直接用自己内部的服务器，之前连接数据发送给mongodb。所以继续连接mongodb获取数据，拿到之前用户发送post请求活动数据

  //MongoClient调用connect方法。传入mongodb上驱动程序的密码。用户名和密码。
  //连接到数据库上
  const client = await MongoClient.connect(
    "mongodb+srv://woaiszy214:fN7x34soJad0Mz0a@cluster0.cfvfose.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  //调用db方法
  const db = client.db();

  //会即时生成一个数据库的meetups文档
  const meetupsCollection = db.collection("meetups");

  //找到find的方法，找到meetups的文档资料。文档是对象形式。并把对象转成数组传到下面
  //因为异步函数返回一个promise需要等待获取数据
  const meetups = await meetupsCollection.find().toArray();

  //拿到之后需要关闭连接数据库
  client.close();

  //因为数据库获取的id值是非常复杂的对象的形式，不符合需要把对象转成字符串格式
  //遍历之后。map需要返回对象{}，因为传给列表也需要对象  对象再经过map之后是一个对象的数组,页面不需要描述所以可以不用
  //map (a=>({对象形式}))
  //_id这个格式是因为数据库里的id也是这个格式。但是在前端组件，我们只需要正常id，所以不要下划线，
  return {
    props: {
      meetups: meetups.map((meet) => ({
        id: meet._id.toString(),
        title: meet.title,
        address: meet.address,
        image: meet.iamge,
      })),
    },
    revalidate: 1, // seconds  如果有新的请求进入，10s会预生成新的请求内容，对于不频繁的更改。每小时变化3600.每秒变化就是1
    //getStaticProps静态页面会在build的时候，如果有新的请求传入的时候，build时会看到revalidate重新验证，就会重新执行这里组件，meetup数据更新，然后执行HomePage组件
    //然后重新预渲染更新后的内容
  };
}
//服务器站点是对于每一个请求传入都可以预生成页面，不过需要等。
//export async function getServerSideProps(context) {
// const req = context.req; //HTTP对象，带有一个额外的cookiesprop，它是一个具有字符串键映射到 cookie 的字符串值的对象。用户频繁身份验证
// const res = context.res; //响应HTTP对象

//fetch data from an API
// return {
//    props: {
//      meetup: meetups,
//    },
//  };
//}

export default HomePage;
