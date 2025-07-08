import Canvas from "@/components/Canvas";
import ClientOnly from "@/components/ClientOnly";

export default function ID({ data }: any) {
  return (
    <ClientOnly>
      {data ? (
        <Canvas canvas={JSON.parse(data.content)} />
      ) : (
        <div className="err">
          id 信息有误，请检查之后重新输入
        </div>
      )}
    </ClientOnly>
  );
}

export const getStaticPaths = async () => {
  const res = await fetch(
    "http://localhost:3000/api/web/content/list",
  );
  const data = (await res.json()) ||{result: {data: []}};

  return {
    paths: (data.result || {data: []}).data.map((item: any) => {
      return {params: {id: item.id + '' || "2"}}
    }),
    fallback: true,
  };
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
// 此函数在服务端的构建阶段调用，不会在客户端调用，因此这里相当于是直接查询数据库 SSG
export async function getStaticProps({ params }: { params: { id: string } }) {
  const res = await fetch(
    "http://localhost:3000/api/web/content/get?id=" + (params.id || 2)
  );
  const data = await res.json();

  return {
    props: {
      data: (data.result && !data.result.isDelete ) ? data.result : null,
    },
    revalidate: false, // 关闭自动 ISR，改为 on-demand revalidate
  };
}
