import { useRouter } from "next/router";

const CryptoName = () => {
  const router = useRouter();
  const { cryptoName } = router.query;
  return <div>{cryptoName}</div>;
};

export default CryptoName;
