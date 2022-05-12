import { useRouter } from "next/router";

const PairName = () => {
  const router = useRouter();
  const { pairName } = router.query;
  return <div>{pairName}</div>;
};

export default PairName;
