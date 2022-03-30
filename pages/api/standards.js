/**
 * Authors: Shubham Jain, Mateusz Zielinski, Matthew Schulz
 * Contributers: Sarvesh Rajdev, Nathan D'Souza
 */
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';
import requiresAuth from '../../lib/requiresAuthApiMiddleware';

/**
 * @swagger
 * tags:
 *  name: standards
 *  description: Health & Care Standards
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    standard:
 *      properties:
 *        id:
 *         type: integer
 *         example: 1
 *        name:
 *          type: string
 *          example: Timely Care
 */

/**
 * @swagger
 * /standards:
 *  get:
 *    summary: Retrieve the list of standards stored in the system
 *    description: Retrieve the list of standards stored in the system, with their ID and name
 *    tags: [standards]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/standard'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    if (!session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to add new standards',
      });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(422).json({
        error: true,
        message: 'The required standard details are missing',
      });
    }

    const record = await prisma.standards.create({
      data: {
        name: name,
      },
    });

    return res.json(record);
  }

  if (req.method === 'GET') {
    const standards = await prisma.standards.findMany();
    return res.json(standards);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
