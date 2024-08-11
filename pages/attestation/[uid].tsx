import { GetStaticProps } from "next";
import { useRouter } from "next/router";

export const generateStaticParams = async () => {
  // In a real-world scenario, you would fetch the list of UIDs from an API or database
  // For this example, we'll generate a few static paths
  const uids = ["1", "2", "3"];

  return uids.map(uid => ({
    uid: uid,
  }));
};

const AttestationPage = ({ uid }: { uid: string }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Attestation for UID: {uid}</h1>
      {/* Add more content here */}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const uid = params?.uid as string;

  // In a real-world scenario, you would fetch the attestation data for this UID
  // For now, we'll just pass the UID as a prop
  return {
    props: {
      uid,
    },
  };
};

export default AttestationPage;
