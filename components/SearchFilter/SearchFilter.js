import styles from './SearchFilter.module.css';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
<<<<<<< Updated upstream
function SearchFilter({ data, setSearchTerm, searchTerm }) {
  const router = useRouter();
=======
import useSWR from '../../lib/swr';

function SearchFilter({ data, setSearchTerm, searchTerm }) {
  const router = useRouter();

  // const printstate = () => {
  //   const check = {};
  //   for (var dashboard of data) {
  //     const { departmentData, error } = useSWR(
  //       '/api/departments?' + dashboard.dashboard_id
  //     );
  //     console.log(departmentData.name);
  //     check.dashboard = departmentData.name;
  //   }
  //   return check;
  //   // if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
  //   //   data.map(dashboard => {
  //   //     dashboard.name =
  //   //   })
  //   // }
  // };

  // const jsonData = JSON.stringify(data);
  // const { departmentData, error } = useSWR('/api/departments');
  // console.log(departmentData);
  // console.log(error);
  // if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
  //   data.map(dashboard => {
  //     dashboard.name =
  //   })

>>>>>>> Stashed changes
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
