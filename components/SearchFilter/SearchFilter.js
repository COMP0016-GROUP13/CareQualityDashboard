import styles from './SearchFilter.module.css';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
function SearchFilter({ data, setSearchTerm, searchTerm }) {
  const router = useRouter();

  // for (var dashboard of data) {
  //   const { data, error } = useSWR('/api/departments');
  // }
  // if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
  //   data.map(dashboard => {
  //     dashboard.name =
  //   })
  // }
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
            if (
              searchTerm === '' ||
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

SearchFilter.propTypes = {
  session: PropTypes.object,
  data: PropTypes.array,
  setSearchTerm: PropTypes.func,
  searchTerm: PropTypes.string,
};

export default SearchFilter;
