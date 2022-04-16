import { useRouter } from "next/router";

const PoolName = () => {
  const router = useRouter();
  const { poolName } = router.query;
  return <div>{poolName}</div>;
};

export default PoolName;
