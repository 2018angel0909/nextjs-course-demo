import "../styles/globals.css";
import Layout from "../components/layout/Layout";

//Component是实际页面道具。应该要渲染的内容，pageProps页面特定道具，
//每次导航时不同的页面上，渲染不同实际页面内容
//loyout写在这里，这样不同的页面都是有这个头顶导航栏。不需要每次都一个一个加上
//一定要写在_app.js里用Component, pageProps。Loyout包围
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
