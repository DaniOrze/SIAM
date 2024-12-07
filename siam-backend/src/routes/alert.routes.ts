import { Router } from "express";
import {
  createAlert,
  deleteAlert,
  editAlert,
  getAlertById,
  getAlerts,
} from "../controllers/alert.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Alert
 *   description: Endpoints para gerenciar alertas
 */

/**
 * @swagger
 * /alert/new-alerts:
 *   post:
 *     tags:
 *       - Alert
 *     summary: Cria um novo alerta
 *     description: Adiciona um novo alerta à base de dados.
 *     parameters:
 *       - in: header
 *         name: user_id
 *         required: true
 *         description: ID do usuário autenticado.
 *         schema:
 *           type: string
 *           example: "123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do alerta
 *               playCount:
 *                 type: number
 *                 description: Quantidade de vezes que o alerta será reproduzido
 *               isActive:
 *                 type: boolean
 *                 description: Se o alerta está ativo ou não
 *               medicationId:
 *                 type: number
 *                 description: ID do medicamento associado ao alerta
 *     responses:
 *       201:
 *         description: Alerta criado com sucesso
 *       500:
 *         description: Erro ao criar o alerta
 */
router.post("/new-alerts", createAlert);

/**
 * @swagger
 * /alert/get-alerts:
 *   get:
 *     tags:
 *       - Alert
 *     summary: Retorna uma lista de alertas
 *     description: Obtém uma lista de alertas cadastrados no sistema.
 *     parameters:
 *       - in: header
 *         name: user_id
 *         required: true
 *         description: ID do usuário autenticado.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: Uma lista de alertas
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
 *                   playCount:
 *                     type: number
 *                     description: Quantidade de reproduções
 *                   isActive:
 *                     type: boolean
 *                     description: Status de ativo/inativo
 *                   medicationId:
 *                     type: integer
 *                     description: ID do medicamento associado ao alerta
 *                   medicationName:
 *                     type: string
 *                     description: Nome do medicamento associado
 *       500:
 *         description: Erro ao obter os alertas
 */
router.get("/get-alerts", getAlerts);

/**
 * @swagger
 * /alert/delete-alerts/{id}:
 *   delete:
 *     tags:
 *       - Alert
 *     summary: Deleta um alerta
 *     description: Remove um alerta da base de dados pelo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do alerta a ser deletado
 *         schema:
 *           type: integer
 *       - in: header
 *         name: user_id
 *         required: true
 *         description: ID do usuário autenticado.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: Alerta deletado com sucesso
 *       500:
 *         description: Erro ao deletar alerta
 */
router.delete("/delete-alerts/:id", deleteAlert);

/**
 * @swagger
 * /alert/edit-alerts/{id}:
 *   put:
 *     tags:
 *       - Alert
 *     summary: Edita um alerta
 *     description: Atualiza os dados de um alerta existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do alerta a ser editado
 *         schema:
 *           type: integer
 *       - in: header
 *         name: user_id
 *         required: true
 *         description: ID do usuário autenticado.
 *         schema:
 *           type: string
 *           example: "123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do alerta
 *               playCount:
 *                 type: number
 *                 description: Quantidade de reproduções do alerta
 *               isActive:
 *                 type: boolean
 *                 description: Status de ativo/inativo
 *               medicationId:
 *                 type: number
 *                 description: ID do medicamento associado ao alerta
 *     responses:
 *       200:
 *         description: Alerta atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar alerta
 */
router.put("/edit-alerts/:id", editAlert);

/**
 * @swagger
 * /alert/get-alert/{id}:
 *   get:
 *     tags:
 *       - Alert
 *     summary: Retorna um alerta específico
 *     description: Obtém os detalhes de um alerta pelo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do alerta a ser obtido
 *         schema:
 *           type: integer
 *       - in: header
 *         name: user_id
 *         required: true
 *         description: ID do usuário autenticado.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: Detalhes do alerta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 playCount:
 *                   type: number
 *                 isActive:
 *                   type: boolean
 *                 medicationId:
 *                   type: integer
 *                 medicationName:
 *                   type: string
 *       500:
 *         description: Erro ao obter o alerta
 */
router.get("/get-alert/:id", getAlertById);

export default router;