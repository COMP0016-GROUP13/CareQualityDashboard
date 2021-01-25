import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'GET') {
    if (!session.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
      res.statusCode = 403;
      return res.end('You do not have permission to view hospitals');
    }

    const hospitals = await prisma.hospitals.findMany({
      where: {
        health_board_id: { equals: session.user.healthBoardId },
      },
    });

    // Only return the name and id of the hospital
    return res.json(hospitals.map(h => ({ name: h.name, id: h.id })));
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
};

export default requiresAuth(handler);
