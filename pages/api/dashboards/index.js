import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';
import requiresAuth from '../../../lib/requiresAuthApiMiddleware';

/**
 * @swagger
 * tags:
 *  name: dashboards
 *  description: Select Dashboards
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    dashboard:
 *      properties:
 *        id:
 *         type: integer
 *         example: 1
 *        name:
 *          type: string
 *          example: Care Quality Dashboard
 *        user:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              example: UUID
 *            user_type:
 *              type: string
 *              example: Clinician
 */

/**
 * @swagger
 * /questions:
 *  get:
 *    summary: Retrieve all dashboards for a user
 *    description: Retrieve the list of dashboards stored in the system, to be selected by the user.
 *    tags: [dashboards]
 *    parameters:
 *      - in: query
 *        name: default_urls
 *        schema:
 *          type: integer
 *          default: 0
 *        required: false
 *        description: "'1' if you want to get the default URLs for all questions, or '0' if you want your department-overridden URL returned (if it exists)."
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              additionalProperties:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/dashboard'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 *  post:
 *    summary: Add a new Dashboard
 *    description: "Submit a new dashboard to the system, to be shown to all users under a manager. Note: you must be an manager to be able to perform this operation."
 *    tags: [dashboards]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              properties:
 *              id:
 *                 type: integer
 *                 example: 1
 *              name:
 *                  type: string
 *                  example: Care Quality Dashboard
 *              user:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *                          example: UUID
 *                      user_type:
 *                          type: string
 *                          example: Clinician
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/question'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      422:
 *        description: Invalid details
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/error'
 *            example:
 *              error: true
 *              message: The required question details are missing
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    if (!session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to add new dashboards',
      });
    }

    const { name, questions } = req.body;
    if (!name) {
      return res.status(422).json({
        error: true,
        message: 'The required department details are missing',
      });
    }

    // TODO: Create POST for adding new Dashboard

    const record = await prisma.dashboard.create({
      data: {
        users: { connect: { id: session.user.userId } },
        name: name,

        ////     hospitals: { connect: { id: session.user.hospitalId } },
        ////     clinician_join_codes: { create: { code: await createJoinCode() } },
        ////     department_join_codes: { create: { code: await createJoinCode() } },
      },
      ////   include: {
      ////     department_join_codes: { select: { code: true } },
      ////     clinician_join_codes: { select: { code: true } },
      //   },
    });

    return res.json(record);
  }

  if (req.method === 'GET') {
    const test = await prisma.dashboard.findMany();
    console.log(test);
    const dashboards = await prisma.dashboard.findMany({
      where: {
        user_id: session.user.userId,
      },
    });

    return res.json(
      dashboards.map(d => ({
        id: d.id,
        name: d.name,
      }))
    );
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
