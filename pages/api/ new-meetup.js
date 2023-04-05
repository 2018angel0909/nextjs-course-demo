//写在pages底下，api文件夹，专门用来发送http请求，api代码只会在服务器上执行

//如果发送的请求是post就到这里。保存数据，并发给服务
//npm insatll mongodb需要安装包，然后重启中断npm run dev
import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    //MongoClient调用connect方法。传入mongodb上驱动程序的密码。用户名和密码。
    //连接到数据库上
    const client = await MongoClient.connect(
      "mongodb+srv://woaiszy214:fN7x34soJad0Mz0a@cluster0.cfvfose.mongodb.net/meetups?retryWrites=true&w=majority"
    );

    const db = client.db();

    //会即时生成一个数据库
    const meetupsCollection = db.collection("meetups");

    //向集合中插入新的文档内容，把数据对象插入到数据库中，就是post数据。里面是对象
    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    //传到数据库完成之后，关闭数据库的连接
    client.close();

    //成功之后res响应json格式转换获取成功或者失败
    res.status(201).json({ message: "meetup inserted!" });
  }
}

export default handler;
