import { Router } from "express";
import {
  createMedication,
  deleteMedication,
  editMedication,
  getMedicationById,
  getMedications,
} from "../controllers/medication.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Medication
 *   description: Endpoints para gerenciar medicamentos
 */

/**
 * @swagger
 * /new-medications:
 *   post:
 *     tags:
 *       - Medication
 *     summary: Cria um novo medicamento
 *     description: Adiciona um novo medicamento à base de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dosage:
 *                 type: number
 *               administrationSchedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                     daysOfWeek:
 *                       type: array
 *                       items:
 *                         type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               observations:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medicamento criado com sucesso
 *       500:
 *         description: Erro ao criar o medicamento
 */
router.post("/new-medications", createMedication);

/**
 * @swagger
 * /get-medications:
 *   get:
 *     tags:
 *       - Medication
 *     summary: Retorna uma lista de medicamentos
 *     responses:
 *       200:
 *         description: Uma lista de medicamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   dosage:
 *                     type: number
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                   observations:
 *                     type: string
 *                   administrationSchedules:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         time:
 *                           type: string
 *                         daysOfWeek:
 *                           type: array
 *                           items:
 *                             type: string
 *       500:
 *         description: Erro ao obter medicamentos
 */
router.get("/get-medications", getMedications);

/**
 * @swagger
 * /delete-medications/{id}:
 *   delete:
 *     tags:
 *       - Medication
 *     summary: Deleta um medicamento
 *     description: Remove um medicamento da base de dados pelo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do medicamento a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicamento deletado com sucesso
 *       500:
 *         description: Erro ao deletar medicamento
 */
router.delete("/delete-medications/:id", deleteMedication);

/**
 * @swagger
 * /edit-medications/{id}:
 *   put:
 *     tags:
 *       - Medication
 *     summary: Edita um medicamento
 *     description: Atualiza os dados de um medicamento existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do medicamento a ser editado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dosage:
 *                 type: number
 *               administrationSchedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                     daysOfWeek:
 *                       type: array
 *                       items:
 *                         type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               observations:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medicamento atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar o medicamento
 */
router.put("/edit-medications/:id", editMedication);

/**
 * @swagger
 * /get-medication/{id}:
 *   get:
 *     tags:
 *       - Medication
 *     summary: Retorna um medicamento específico
 *     description: Obtém os detalhes de um medicamento pelo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do medicamento a ser obtido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do medicamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 dosage:
 *                   type: number
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                 observations:
 *                   type: string
 *                 administrationSchedules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                       daysOfWeek:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Erro ao obter medicamento
 */
router.get("/get-medication/:id", getMedicationById);

export default router;
