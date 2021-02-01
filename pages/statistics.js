import querystring from 'querystring';
import { useState } from 'react';
import { Alert } from 'rsuite';
import { getSession } from 'next-auth/client';
import Head from 'next/head';

import styles from './statistics.module.css';

import {
  LineChart,
  Header,
  CirclesAccordion,
  Filters,
  LoginMessage,
  WordCloud,
  NoAccess,
} from '../components';

import useSWR from '../lib/swr';
import {
  Roles,
  StandardColors,
  Standards,
  Visualisations,
} from '../lib/constants';

const DEFAULT_DATE_OFFSET = 60 * 60 * 24 * 30 * 1000; // 30 days ago;

const generateQueryParams = ({
  start = new Date().getTime() - DEFAULT_DATE_OFFSET,
  end = new Date().getTime(),
  isMentoringSession = null,
  dataToDisplayOverride,
} = {}) => {
  const query = { from: start, to: end };

  if (isMentoringSession === true) {
    query.only_is_mentoring_session = '1';
  } else if (isMentoringSession === false) {
    query.only_not_mentoring_session = '1';
  }

  if (dataToDisplayOverride) {
    query[dataToDisplayOverride.key] = dataToDisplayOverride.value;
  }

  return querystring.stringify(query);
};

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

function statistics({ session, toggleTheme }) {
  const [isMentoringSession, setIsMentoringSession] = useState(null);
  const [dataToDisplayOverride, setDataToDisplayOverride] = useState(null);
  const [visualisationType, setVisualisationType] = useState(
    Visualisations.LINE_CHART
  );
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getTime() - DEFAULT_DATE_OFFSET),
    end: new Date(),
  });

  const { data, error } = useSWR(
    `/api/responses?${generateQueryParams({
      start: dateRange.start.getTime(),
      end: dateRange.end.getTime(),
      isMentoringSession,
      dataToDisplayOverride,
    })}`
  );

  var localData, localError, localMessage;
  if (data) {
    localData = data;
    localError = error || data.error;
    localMessage = data.message;
  } else {
    localData = null;
    localError = error;
    localMessage = error ? error.message : null;
  }

  if (localError) {
    Alert.error(
      "Error: '" +
        localMessage +
        "'. Please reload/try again later or the contact system administrator",
      0
    );
  }

  if (!session) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <LoginMessage />
      </div>
    );
  }

  if (
    !session.user.roles.includes(Roles.USER_TYPE_CLINICIAN) &&
    !session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT) &&
    !session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD) &&
    !session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)
  ) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <NoAccess />
      </div>
    );
  }

  const getAverage = name => {
    const average = !localError && localData ? localData.averages[name] : null;
    return average ? Math.ceil(average * 25) : 0;
  };

  const circles = Object.entries(Standards).map(([shortName, longName]) => {
    return {
      name: shortName[0].toUpperCase() + shortName.substr(1).toLowerCase(),
      color: StandardColors[longName],
      percentage: getAverage(longName),
    };
  });

  return (
    <div>
      <Head>
        <title>Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      <CirclesAccordion circles={circles} />
      <div className={styles.content}>
        <div className={styles.filters}>
          <Filters
            session={session}
            dateRange={dateRange}
            setDateRange={setDateRange}
            visualisationType={visualisationType}
            setVisualisationType={setVisualisationType}
            isMentoringSession={isMentoringSession}
            setIsMentoringSession={setIsMentoringSession}
            dataToDisplayOverride={dataToDisplayOverride}
            setDataToDisplayOverride={setDataToDisplayOverride}
          />
        </div>

        <div className={styles.graph}>
          {visualisationType === Visualisations.LINE_CHART ? (
            <LineChart
              data={
                !localError && localData
                  ? localData.responses.map(d => ({
                      is_mentoring_session: d.is_mentoring_session,
                      timestamp: d.timestamp,
                      scores: d.scores.map(s => ({
                        score: s.score,
                        standardName: s.standards.name,
                        color: StandardColors[s.standards.name],
                      })),
                    }))
                  : null
              }
            />
          ) : (
            <WordCloud
              words={
                !localError && localData
                  ? localData.responses
                      .map(r => r.words.map(w => w.word))
                      .flat()
                  : null
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default statistics;
