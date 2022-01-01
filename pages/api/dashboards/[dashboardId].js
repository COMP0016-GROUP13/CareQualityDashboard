import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';
import requiresAuth from '../../../lib/requiresAuthApiMiddleware';

/**
 * @swagger
 * /dashboard/{id}:
 *  get:
 *    summary: Retrieve a single dashboard
 *    description: "Retrieve the details of a single departments in the system, for your hospital, health board or department. Note: you must be a hospital, health board or department user to perform this operation, and `id` must be your own department, or a department within your hospital/health board."
 *    tags: [dashboard]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The department ID to update the Join Code for (it must be in your hospital)
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/department'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */

const handler = async (req, res) => {
  const { session } = req;

  // TODO: Error Handling, eg if user not in role

  if (req.method === 'GET') {
    const dashboard = await prisma.dashboard.findUnique({
      where: {
        id: +req.query.dashboardId,
      },
    });

    // let department;
    // if (Object.keys(includes).length) {
    //   department = await prisma.departments.findFirst({
    //     where: { id: +req.query.departmentId },
    //     include: includes,
    //   });
    // } else {
    //   department = await prisma.departments.findFirst({
    //     where: { id: +req.query.departmentId },
    //   });
    // }
    return res.json(dashboard);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
