import Head from "next/head";
import ClientOnly from "./components/ClientOnly";
import Canvas from "./components/Canvas";

export default function Home({ data }: any) {
  console.log(data, "data");
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {data ? (
          <ClientOnly>
            <Canvas canvas={JSON.parse(data.content)} />
          </ClientOnly>
        ) : (
          <div className="err">
            id 信息有误，请检查之后重新输入，或者微信联系作者「taro_gege」
          </div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps = async ({
  query,
}: {
  query: { id: string };
}) => {
  const res = await fetch(
    "http://template.codebus.tech/api/web/content/get?id=" + (query.id || 2)
  );

  const data = await res.json();

  return {
    props: {
      data: data.result.publish && !data.result.isDelete && data.result,
    },
  };
};
