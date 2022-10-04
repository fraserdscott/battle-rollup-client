
import './App.css';
import { gql, useQuery } from '@apollo/client';

const QUERY = gql`{
  rollup(id:0) {
    id
    resolved
  }
}`;

const Rollup = () => {
  const { data, loading, error } = useQuery(QUERY, {
    pollInterval: 500,
  });

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return <div>
    {data.rollup && data.rollup.resolved ? "Rollup has been resolved." : "Rollup has not been resolved."}
  </div>;
}

export default Rollup;
