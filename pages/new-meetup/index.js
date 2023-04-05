import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import { useRouter } from "next/router";

function NewMeetup() {
  const router = useRouter();

  //from表单收集的内容在这里。meet updatable=enterMeetupData
  async function addFormHandle(enterMeetupData) {
    console.log(enterMeetupData);
    //把得到的数据发送到同一个api的服务器里/api/new-meetup.就是api里的new-meetup这个线路

    const response = await fetch("http://localhost:3001/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enterMeetupData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log(data);

    //运用useRouter里的push，发送完成之后按提交按钮回到主页，
    //或者 router.replace('/')替换 ,发送成功之后按完按钮就跳转到主页
    router.push("/");
  }
  return (
    <Fragment>
      <Head>
        <title>Add a New Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React Meetups"
        />
      </Head>
      <NewMeetupForm onAddMeetup={addFormHandle} />;
    </Fragment>
  );
}
export default NewMeetup;
