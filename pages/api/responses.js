import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'GET') {
    const {
      from,
      to,
      only_is_mentoring_session: onlyIsMentoringSession,
      only_not_mentoring_session: onlyNotMentoringSession,

      user_id: userIdOverride,
      department_id: departmentIdOverride,
      hospital_id: hospitalIdOverride,
    } = req.query;

    const filters = [];

    if (from) filters.push({ timestamp: { gte: new Date(+from) } });
    if (to) filters.push({ timestamp: { lte: new Date(+to) } });

    // Default will be with BOTH included
    if (onlyIsMentoringSession === '1') {
      filters.push({ is_mentoring_session: true });
    } else if (onlyNotMentoringSession === '1') {
      filters.push({ is_mentoring_session: false });
    }

    if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      if (!session.user.departmentId) {
        return res.json({ responses: [], averages: {} });
      }

      filters.push({
        departments: { id: { equals: session.user.departmentId } },
      });

      if (userIdOverride && userIdOverride === session.user.userId) {
        filters.push({ user_id: { equals: session.user.userId } });
      }
    } else if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      if (!session.user.hospitalId) {
        return res.json({ responses: [], averages: {} });
      }

      filters.push({
        departments: { hospital_id: { equals: session.user.hospitalId } },
      });

      if (departmentIdOverride) {
        filters.push({
          departments: { id: { equals: +departmentIdOverride } },
        });
      }
    } else if (session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
      if (!session.user.healthBoardId) {
        return res.json({ responses: [], averages: {} });
      }

      filters.push({
        departments: {
          hospitals: {
            health_board_id: { equals: session.user.healthBoardId },
          },
        },
      });

      if (hospitalIdOverride) {
        filters.push({
          departments: { hospitals: { id: { equals: +hospitalIdOverride } } },
        });
      }
    } else {
      if (!session.user.userId) {
        return res.json({ responses: [], averages: {} });
      }

      // Default to lowest-level i.e. logged in user's data
      filters.push({ user_id: { equals: session.user.userId } });
    }

    const select = {
      id: true,
      timestamp: true,
      is_mentoring_session: true,
      departments: true,
      words: true,
      scores: { select: { standards: true, score: true } },
    };

    const orderBy = { timestamp: 'asc' };

    const responses = filters.length
      ? await prisma.responses.findMany({
          where: { AND: filters },
          select,
          orderBy,
        })
      : await prisma.responses.findMany({ select, orderBy });

    const scoresPerStandard = {};
    responses.forEach(val =>
      val.scores.forEach(score => {
        if (scoresPerStandard[score.standards.name]) {
          scoresPerStandard[score.standards.name].push(score.score);
        } else {
          scoresPerStandard[score.standards.name] = [score.score];
        }
      })
    );

    const responseData = { responses, averages: {} };
    Object.entries(scoresPerStandard).map(
      ([standard, scores]) =>
        (responseData.averages[standard] =
          scores.reduce((acc, val) => acc + val, 0) / scores.length)
    );

    return res.json(responseData);
  }

  if (req.method === 'POST') {
    const scores = req.body.scores.map(scoreObj => {
      return {
        standards: { connect: { id: scoreObj.standardId } },
        score: scoreObj.score,
      };
    });

    const words = req.body.words.map(word => {
      return {
        questions: { connect: { id: word.questionId } },
        word: word.word.toLowerCase(),
      };
    });

    const insertion = await prisma.responses.create({
      data: {
        users: { connect: { id: session.user.userId } },
        timestamp: new Date(),
        departments: { connect: { id: session.user.departmentId } },
        is_mentoring_session: req.body.is_mentoring_session,
        scores: { create: scores },
        words: { create: words },
      },
    });

    return res.json(insertion);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
