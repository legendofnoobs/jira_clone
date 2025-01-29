import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";

import { Project } from "@/features/projects/types";



const app = new Hono()
    .post(
        "/",
        sessionMiddleware,
        zValidator("json", createTaskSchema),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
            const {
                name,
                status,
                workspaceId,
                projectId,
                dueDate,
                assigneeId } = c.req.valid("json")

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const highestPositionTaks = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                [
                    Query.equal("status", status),
                    Query.equal("workspaceId", workspaceId),
                    Query.orderAsc("position"),
                    Query.limit(1)
                ],
            );

            const newPosition = highestPositionTaks.documents.length > 0 ? highestPositionTaks.documents[0].position + 1000 : 1000

            const task = await databases.createDocument(
                DATABASE_ID,
                TASKS_ID,
                ID.unique(),
                {
                    name,
                    status,
                    workspaceId,
                    projectId,
                    dueDate,
                    assigneeId,
                    position: newPosition,
                }
            )

            return c.json({ data: task });
        }
    )
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({
            workspaceId: z.string(),
            projectId: z.string().nullish(),
            assigneeId: z.string().nullish(),
            status: z.nativeEnum(TaskStatus).nullish(),
            search: z.string().nullish(),
            dueDate: z.string().nullish(),
        })
        ),
        async (c) => {
            const { users } = await createAdminClient();
            const databases = c.get("databases");
            const user = c.get("user");

            const {
                workspaceId,
                projectId,
                assigneeId,
                status,
                search,
                dueDate
            } = c.req.valid("query");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const query = [
                Query.equal("workspaceId", workspaceId),
                Query.orderDesc("$createdAt")
            ]

            if (projectId) {
                console.log("projectId", projectId)
                query.push(Query.equal("projectId", projectId))
            }

            if (status) {
                console.log("status", status)
                query.push(Query.equal("status", status))
            }

            if (assigneeId) {
                console.log("assigneeId", assigneeId)
                query.push(Query.equal("assigneeId", assigneeId))
            }

            if (dueDate) {
                console.log("dueDate", dueDate)
                query.push(Query.equal("dueDate", dueDate))
            }

            if (search) {
                console.log("search", search)
                query.push(Query.equal("name", search))
            }

            const tasks = await databases.listDocuments<Task>(
                DATABASE_ID,
                TASKS_ID,
                query
            );

            const projectIds = tasks.documents.map(task => task.projectId);
            const assigneeIds = tasks.documents.map(task => task.assigneeId);

            const projects = await databases.listDocuments<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectIds.length > 0
                    ? [Query.contains("$id", projectIds)]
                    : []
            )

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                assigneeIds.length > 0
                    ? [Query.contains("$id", assigneeIds)]
                    : []
            )

            const assignees = await Promise.all(
                members.documents.map(async (member) => {
                    const user = await users.get(member.userId)
                    return {
                        ...member,
                        name: user.name || user.email,
                        email: user.email
                    }
                })
            )

            const populatedTasks = tasks.documents.map((task) => {
                const project = projects.documents.find(
                    (project) => project.$id === task.projectId
                );

                const assignee = assignees.find(
                    (assignee) => assignee.$id === task.assigneeId
                );

                return {
                    ...task,
                    project,
                    assignee
                }
            })

            return c.json({
                data: {
                    ...tasks,
                    documents: populatedTasks
                }
            })
        }
    )
    // .delete(
    //     "/:taskId",                                                                                                      // Ruta de la petición con el parámetro taskId
    //     sessionMiddleware,                                                                                               // Verificamos si el usuario está autenticado
    //     async (c) => {                                                                                             // Establecido el contexto obtenemos lo siguiente:

    //         const user = c.get("user");                                                                                    // Obtenemos el usuario autenticado
    //         const databases = c.get("databases");                                                                          // Base de datos de appWrite
    //         const { taskId } = c.req.param();                                                                              // Parámetros de la consulta 

    //         const task = await databases.getDocument<Task>(
    //             DATABASE_ID,
    //             TASKS_ID,
    //             taskId
    //         )

    //         const member = await getMember({                                                                               // Obtenemos el usuario asociado al workspace
    //             databases,
    //             workspaceId: task.workspaceId,
    //             userId: user.$id,
    //         });

    //         if (!member) {
    //             return c.json({ error: "Unauthorized" }, 401);                                                               // Validamos que el usuario pertenezca al workspace
    //         }

    //         await databases.deleteDocument(                                                                                // Se elimina la tarea
    //             DATABASE_ID,
    //             TASKS_ID,
    //             taskId
    //         )

    //         return c.json({ data: { $id: task.$id } });                                                                               // Se retorna el id de la tarea eliminada
    //     }
    // )
    // .patch(
    //     "/:taskId",
    //     sessionMiddleware,                                                                                               // Verificar si el usuario está autenticado
    //     zValidator("json", createTaskSchema.partial()),                                                                  // Validar el body de la petición según el esquema
    //     async (c) => {                                                                                             // Establecido el contexto obtenemos lo siguiente:

    //         const user = c.get("user");
    //         const databases = c.get("databases");
    //         const { name, status, projectId, dueDate, assigneeId, description } = c.req.valid("json")
    //         const { taskId } = c.req.param();                                                                              // Parámetros de la consulta

    //         const existingTask = await databases.getDocument<Task>(                                                        // Obtenemos la tarea existente
    //             DATABASE_ID,
    //             TASKS_ID,
    //             taskId,
    //         )

    //         const member = await getMember({                                                                               // Obtenemos el usuario asociado a la tarea existente en el workspace
    //             databases,
    //             workspaceId: existingTask.workspaceId,
    //             userId: user.$id,
    //         });

    //         if (!member) {
    //             return c.json({ error: "Unauthorized" }, 401);                                                               // Validamos que el usuario pertenezca al workspace
    //         }

    //         const task = await databases.updateDocument<Task>(                                                             // Se actualiza la tarea existente
    //             DATABASE_ID,
    //             TASKS_ID,
    //             taskId,
    //             {
    //                 name,
    //                 status,
    //                 projectId,
    //                 dueDate,
    //                 assigneeId,
    //                 description,
    //             }
    //         )

    //         return c.json({ data: task });
    //     }
    // )
    // .get(
    //     "/:taskId",                                                                                                      // Ruta de la petición con el parámetro taskId
    //     sessionMiddleware,                                                                                               // Verificamos si el usuario está autenticado
    //     async (c) => {                                                                                             // Establecido el contexto obtenemos lo siguiente:
    //         const currentUser = c.get("user");                                                                             // Obtenemos el usuario autenticado
    //         const databases = c.get("databases");                                                                          // Base de datos de appWrite
    //         const { taskId } = c.req.param();                                                                              // Parámetros de la consulta taskId
    //         const { users } = await createAdminClient();                                                                   // Users registrados en appWrite

    //         const task = await databases.getDocument<Task>(                                                                // Obtenemos la tarea que corresponde al id del parámetro
    //             DATABASE_ID,
    //             TASKS_ID,
    //             taskId
    //         );

    //         const currentMember = await getMember({                                                                        // Obtenemos el usuario asociado a la tarea existente en el workspace
    //             databases,
    //             workspaceId: task.workspaceId,
    //             userId: currentUser.$id,
    //         });

    //         if (!currentMember) {
    //             return c.json({ error: "Unauthorized" }, 401);                                                               // Validamos que el usuario pertenezca al workspace y a la tarea
    //         }

    //         const project = await databases.getDocument<Project>(                                                          // Obtenemos el proyecto asociado a la tarea del parámetro
    //             DATABASE_ID,
    //             PROJECTS_ID,
    //             task.projectId
    //         );

    //         const member = await databases.getDocument(                                                                    // Obtenemos el miembro asignado a la tarea 
    //             DATABASE_ID,
    //             MEMBERS_ID,
    //             task.assigneeId,
    //         );

    //         const user = await users.get(member.userId)                                                                    // Obtenemos el usuario asociado al miembro asignado a la tarea

    //         const assignee = {                                                                                             // Obtenemos el assignne en base al miembro asignado a la tarea con los detalles de su usuario
    //             ...member,
    //             name: user.name || user.email,
    //             email: user.email
    //         }

    //         return c.json({                                                                                                // Se retorna el task con los detalles de su proyecto y su miembro asignado.
    //             data: {
    //                 ...task,
    //                 project,
    //                 assignee
    //             }
    //         })
    //     }
    // )
    // .post(
    //     "/bulk-update",                                                                                                 // Esta ruta se utiliza para actualizar mas de un task a la vez. 
    //     sessionMiddleware,                                                                                              // Verificamos si el usuario está autenticado
    //     zValidator(                                                                                                     // Se recibe el body de las actualizaciones
    //         "json",
    //         z.object({                                                                                                    // validado con zod según el esquema propuesto
    //             tasks: z.array(
    //                 z.object({
    //                     $id: z.string(),
    //                     status: z.nativeEnum(TaskStatus),
    //                     position: z.number().int().positive().min(1000).max(1_000_000)
    //                 })
    //             )
    //         })
    //     ),
    //     async (c) => {
    //         const databases = c.get("databases");                                                                         // Base de datos de appWrite
    //         const user = c.get("user");                                                                                   // Usuario autenticado
    //         const { tasks } = await c.req.valid("json");                                                                  // Parámetros de la consulta validados con Zod

    //         const taskToUpdate = await databases.listDocuments(                                                           // Se obtienen las tareas que se van a actualizar
    //             DATABASE_ID,
    //             TASKS_ID,
    //             [Query.contains("$id", tasks.map((task) => task.$id))]
    //         );

    //         const workspaceIds = new Set(taskToUpdate.documents.map((task) => task.workspaceId));                         // Se obtienen los ids de los workspaces de las tareas que se van a actualizar. Set elimina duplicados y devuelve un conjunto único de resultados
    //         if (workspaceIds.size !== 1) {                                                                                  // Si workspaceIds > 1 significa que las tareas pertenecen a varios workspace y eso no se permite en este endpoint  
    //             return c.json({ error: "All tasks must belong to the same workspace" }, 400);                               // Se devuelve un error con el mensaje.
    //         }

    //         const workspaceId = workspaceIds                                                                              // Si todas las tareas pertenecen al mismo workspace (es decir, workspaceIds.size === 1), se extrae el único valor del conjunto para usarlo más adelante
    //             .values()       // Devuelve un iterador de los elementos del conjunto.
    //             .next().value;  // Obtiene el primer (y único) valor del iterador.                                                     

    //         if (!workspaceId) {
    //             return c.json({ error: "Workspace Id is required" }, 400)
    //         }

    //         const member = await getMember({                                                                              // Se obtiene el miembro del workspace que se está actualizando.
    //             databases,
    //             workspaceId,
    //             userId: user.$id
    //         })

    //         if (!member) {                                                                                                // se verifica si el usuario autenticado pertenece al workspace
    //             return c.json({ error: "Unauthorized" }, 401);
    //         }

    //         const updatedTasks = await Promise.all(                                                                       // Se actualizan las tareas seleccionadas.
    //             tasks.map(async (task) => {
    //                 const { $id, status, position } = task;
    //                 return databases.updateDocument<Task>(
    //                     DATABASE_ID,
    //                     TASKS_ID,
    //                     $id,
    //                     { status, position }
    //                 )
    //             })
    //         );

    //         return c.json({ data: updatedTasks })
    //     }
    // )



export default app;