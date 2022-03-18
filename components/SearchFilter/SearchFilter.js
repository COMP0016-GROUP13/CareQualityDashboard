import styles from './SearchFilter.module.css';
import { useRouter } from 'next/router';
function SearchFilter({ data, setSearchTerm, searchTerm }) {
  const router = useRouter();
  return (
    <>
      {
        <input
          className={styles.search}
          type="text"
          placeholder="Search..."
          onChange={event => {
            setSearchTerm(event.target.value);
          }}
        />
      }
      {router.query && router.query.error && showError(router.query.error)}
      {data &&
        data
          .filter(value => {
            if (searchTerm === '') {
              return value;
            } else if (
              value.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return value;
            }
          })
          .map(dashboard => (
            <>
              <button
                onClick={() => {
                  router.push({
                    pathname: '/DashboardNav',
                    query: { dashboard_id: dashboard.id },
                  });
                }}
                id={dashboard.id}
                className={styles.DashboardButtons}>
                {dashboard.name}
              </button>
            </>
          ))}
    </>
  );
}

export default SearchFilter;
