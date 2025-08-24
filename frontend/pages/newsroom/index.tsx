import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const qs = new URLSearchParams(query as Record<string, string>).toString();
  return {
    redirect: {
      destination: `/newsroom/writer-dashboard${qs ? `?${qs}` : ""}`,
      permanent: false,
    },
  };
};

export default function NewsroomIndex() {
  return null;
}
