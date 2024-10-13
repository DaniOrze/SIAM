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
 * /new-alerts:
 *   post:
 *     tags:
 *       - Alert
 *     summary: Cria um novo alerta
 *     description: Adiciona um novo alerta à base de dados.
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
 *               type:
 *                 type: string
 *                 description: Tipo de alerta
 *               duration:
 *                 type: number
 *                 description: Duração do alerta em segundos
 *               playCount:
 *                 type: number
 *                 description: Quantidade de vezes que o alerta será reproduzido
 *               isActive:
 *                 type: boolean
 *                 description: Se o alerta está ativo ou não
 *     responses:
 *       201:
 *         description: Alerta criado com sucesso
 *       500:
 *         description: Erro ao criar o alerta
 */
router.post("/new-alerts", createAlert);

/**
 * @swagger
 * /get-alerts:
 *   get:
 *     tags:
 *       - Alert
 *     summary: Retorna uma lista de alertas
 *     description: Obtém uma lista de alertas cadastrados no sistema.
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
 *                   type:
 *                     type: string
 *                   duration:
 *                     type: number
 *                     description: Duração em segundos
 *                   playCount:
 *                     type: number
 *                     description: Quantidade de reproduções
 *                   isActive:
 *                     type: boolean
 *                     description: Status de ativo/inativo
 *       500:
 *         description: Erro ao obter os alertas
 */
router.get("/get-alerts", getAlerts);

/**
 * @swagger
 * /delete-alerts/{id}:
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
 *     responses:
 *       200:
 *         description: Alerta deletado com sucesso
 *       500:
 *         description: Erro ao deletar alerta
 */
router.delete("/delete-alerts/:id", deleteAlert);

/**
 * @swagger
 * /edit-alerts/{id}:
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
 *               type:
 *                 type: string
 *                 description: Tipo de alerta
 *               duration:
 *                 type: number
 *                 description: Duração do alerta em segundos
 *               playCount:
 *                 type: number
 *                 description: Quantidade de reproduções do alerta
 *               isActive:
 *                 type: boolean
 *                 description: Status de ativo/inativo
 *     responses:
 *       200:
 *         description: Alerta atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar alerta
 */
router.put("/edit-alerts/:id", editAlert);

/**
 * @swagger
 * /get-alert/{id}:
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
 *                 type:
 *                   type: string
 *                 duration:
 *                   type: number
 *                 playCount:
 *                   type: number
 *                 isActive:
 *                   type: boolean
 *       500:
 *         description: Erro ao obter o alerta
 */
router.get("/get-alert/:id", getAlertById);

export default router;
