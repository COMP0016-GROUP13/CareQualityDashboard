import { Icon, SelectPicker } from 'rsuite';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { Roles, Visualisations } from '../../lib/constants';

export function DashboardFilters({ session, ...props }) {
  const [departments, setDepartments] = useState([]);

  /**
   * Render extra filters based on user type:
   * - Health Board users have an extra "Group" filter with a list of departments and
   * hospitals in their health board, grouped by each category respectively
   * - Hospital users have an extra "Group" filter with a list of departments in
   * their hospital
   * - Department managers have an extre "Group" filter which allows them to choose
   * between viewing their own responses or their department's aggregate responses
   *
   * Most of the logic here is to fetch the relevant data asynchronously when the
   * dropdown is selected.
   */
  const renderExtraFilters = () => {
    if (session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
      return <></>;
    }

    if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      return (
        <>
          <p>Group</p>
          <SelectPicker
            value={
              props.dataToDisplayOverride === null
                ? 'hospital'
                : `${props.dataToDisplayOverride.key}-${props.dataToDisplayOverride.value}`
            }
            onOpen={() =>
              fetch('/api/departments')
                .then(res => res.json())
                .then(res => setDepartments(res))
            }
            onChange={value => {
              if (value === 'hospital') {
                props.setDataToDisplayOverride(null);
              } else {
                const split = value.split('-');
                props.setDataToDisplayOverride({
                  key: split[0],
                  value: split[1],
                });
              }
            }}
            searchable={true}
            placeholder="Select"
            cleanable={false}
            block={true}
            data={[
              {
                label: 'My Hospital',
                value: 'hospital',
                type: 'Hospital',
              },
              ...departments.map(d => ({
                label: d.name,
                value: `department_id-${d.id}`,
                type: 'Department',
              })),
            ]}
            groupBy="type"
            renderMenu={menu =>
              departments.length ? menu : <Icon icon="spinner" spin />
            }
          />
        </>
      );
    }

    if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      return <></>;
    }

    return <span />;
  };
  /**
   * The standard filters shown to ALL users are:
   * - Date range: a datepicker
   * - Visualisation: a dropdown menu
   * - Mentoring session: a dropdown menu
   */
  return (
    <div>
      <p>Navigate</p>
      <SelectPicker
        aria-label="navigation filter"
        aria-expanded="false"
        value={props.visualisationType}
        onChange={value => props.setVisualisationType(value)}
        searchable={false}
        placeholder="Select"
        cleanable={false}
        block={true}
        data={[
          {
            label: <text id="Statistics">Statistics</text>,
            value: Visualisations.STATISTICS,
          },
          {
            label: <text id="Self-reporting">Self-reporting</text>,
            value: Visualisations.WORD_CLOUD_ENABLERS,
          },
          {
            label: <text id="Manage">Manage</text>,
            value: Visualisations.WORD_CLOUD_BARRIERS,
          },
        ]}
      />

      {renderExtraFilters()}
    </div>
  );
}

DashboardFilters.propTypes = {
  /** The user's session object to decide what to display */
  session: PropTypes.object,

  /** Controlled value representing the selected date range, with `start` and `end` properties containing Date instances */
  dateRange: PropTypes.object.isRequired,
  /** Controlled value representing if the user has selected mentoring sessions to be shown */
  isMentoringSession: PropTypes.bool,
  /** Controlled value representing which visualisation type the user has selected */
  visualisationType: PropTypes.oneOf(Object.keys(Visualisations)).isRequired,
  /** Controlled value representing if there is any data entity to override */
  dataToDisplayOverride: PropTypes.object,

  /** Callback function to be called when the mentoring session filter is toggled */
  setIsMentoringSession: PropTypes.func.isRequired,
  /** Callback function to be called when the overriden group filter is toggled */
  setDataToDisplayOverride: PropTypes.func,
  /** Callback function to be called when the date range filter is changed */
  setDateRange: PropTypes.func,
  /** Callback function to be called when the visualisation type filter is toggled */
  setVisualisationType: PropTypes.func,
};

export default DashboardFilters;
