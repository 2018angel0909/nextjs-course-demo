import DetailPage from "../../components/meetups/DetailPage";
import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

//这里也需要数据，所以从mongodb自己建的服务器上获取数据，获取需要的id和单独的页面数据内容
//因为是动态网页，会有不同的数据，所以head的title和meta也用动态的{}表示
function DetailPages(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>

      <DetailPage
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}
//params里id取得名字是【】动态页面文件的值的名字。不然获取不到
//一般只写最受欢迎的网页
//也一定要写fallback属性。如果是false。写的两个路径支持所有的聚会id值，如果写m3就会出现404。
//通过获取相对应的路径id获取到数据，返回静态站点里的props数据
export async function getStaticPaths() {
  //MongoClient调用connect方法。传入mongodb上驱动程序的密码。用户名和密码。
  //连接到数据库上
  const client = await MongoClient.connect(
    "mongodb+srv://woaiszy214:fN7x34soJad0Mz0a@cluster0.cfvfose.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  //会即时生成一个数据库
  const meetupsCollection = db.collection("meetups");

  //find方法第一个{}对象，是查找所有meetups里的文档对象，第二个{_id:1}是找到所有文档对象里。每组对象只要他们的id。并且把这些id放在数组里。拿到数据库的_id.数组才能便利map
  //返回promise。所以异步等待await
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  return {
    //硬编写的话[{ params: { meetupid: "m1" } }, { params: { meetupid: "m2" } }],meetupid必须名字跟动态文件一样【】
    //把得到的对象id遍历数组.因为paths里的格式是硬编码那种。所以这里要跟格式一样。map之后也会有一个新数组的对象
    //遍历拿到数据库的_id并且转成字符串，不然会序列化错误，数据库里是对象形式的。要转换
    paths: meetups.map((meetup) => ({
      params: { meetupid: meetup._id.toString() },
    })),

    fallback: false,
  };
}
//运行在开发人员服务器端，就是终端输出。
//这里需要数据，不是经常更换的内容用静态站点。获取数据，预呈现
//因为是动态页面，所以需要动态的路径值，静态站点里找路径用 context里的params+动态路径值【】，useRoter只在函数组件用
//因为是动态路径的 页面，所以这里静态站点必须用getStaticPaths这个函数，这样next。js就会将静态预渲染给指定的所有的路径
export async function getStaticProps(context, ObjectId) {
  const meetid = context.params.meetupid;
  //console.log(meetid);
  //终端服务器可以看到，不在浏览器中看，浏览器就是log ,切换网页http://localhost:3001/m2或者m1时，这里能看到m2或者m1时

  //MongoClient调用connect方法。传入mongodb上驱动程序的密码。用户名和密码。
  //连接到数据库上
  const client = await MongoClient.connect(
    "mongodb+srv://woaiszy214:fN7x34soJad0Mz0a@cluster0.cfvfose.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  //会即时生成一个meetups的数据库
  const meetupsCollection = db.collection("meetups");

  //findOne只要找其中一个文档对象内容。
  //meetid是上面查找对应id，id就是路径，再从路径找到对应的文档内容。但是数据库里正确特定的id格式是ObjectId开头的，
  //把找到的单独的内容的数据对象，放在数组里
  const selectMeetup = await meetupsCollection
    .findOne({ _id: ObjectId(meetid) })
    .toArray();

  //fetch data from an api
  return {
    props: {
      meetupData: {
        id: selectMeetup._id.toString(),
        //因为数据库id是_id样子，上面是数据库里的对象Object形式需要转成字符串，不然会序列化错误
        image: selectMeetup.image,
        title: selectMeetup.title,
        address: selectMeetup.address,
        description: selectMeetup.description, //再把这里的所有的数据传给DetailPages组件
      },
    },
  };
}

export default DetailPages;
