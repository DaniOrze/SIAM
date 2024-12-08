import { Router } from "express";
import {
  registerDose,
  getAdherenceData,
  getMissedDosesByWeek,
  getDailyConsumption,
} from "../controllers/adherence.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Adherence
 *   description: Endpoints para gerenciar a adesão ao tratamento
 */

/**
 * @swagger
 * /adherence/register-dose:
 *   post:
 *     tags:
 *       - Adherence
 *     summary: Registra uma dose de medicamento
 *     description: Adiciona uma entrada de dose tomada ou esquecida no log de medicamentos.
 *     parameters:
 *       - in: header
 *         name: user-id
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
 *               medicationId:
 *                 type: integer
 *                 description: ID do medicamento
 *               taken:
 *                 type: boolean
 *                 description: Se a dose foi tomada ou não
 *     responses:
 *       201:
 *         description: Dose registrada com sucesso
 *       500:
 *         description: Erro ao registrar dose
 */
router.post("/register-dose", registerDose);

/**
 * @swagger
 * /adherence/get-adherence-data:
 *   get:
 *     tags:
 *       - Adherence
 *     summary: Retorna dados de adesão ao tratamento
 *     description: Obtém informações sobre as doses tomadas e esquecidas de todos os medicamentos.
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
 *         description: Dados de adesão retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nome do medicamento
 *                   taken_count:
 *                     type: integer
 *                     description: Quantidade de doses tomadas
 *                   missed_count:
 *                     type: integer
 *                     description: Quantidade de doses esquecidas
 *       500:
 *         description: Erro ao obter dados de adesão
 */
router.get("/get-adherence-data", getAdherenceData);

/**
 * @swagger
 * /adherence/get-missed-doses-by-week:
 *   get:
 *     tags:
 *       - Adherence
 *     summary: Retorna doses esquecidas por semana
 *     description: Obtém um relatório de doses esquecidas por semana.
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
 *         description: Dados de doses esquecidas retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nome do medicamento
 *                   missed_count:
 *                     type: integer
 *                     description: Quantidade de doses esquecidas
 *                   week:
 *                     type: string
 *                     description: Semana correspondente
 *       500:
 *         description: Erro ao obter doses esquecidas
 */
router.get("/get-missed-doses-by-week", getMissedDosesByWeek);

/**
 * @swagger
 * /adherence/get-daily-consumption:
 *   get:
 *     tags:
 *       - Adherence
 *     summary: Retorna o consumo diário de medicamentos
 *     description: Obtém informações sobre o consumo diário de medicamentos.
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
 *         description: Dados de consumo diário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nome do medicamento
 *                   taken_count:
 *                     type: integer
 *                     description: Quantidade de doses tomadas no dia
 *                   day_of_week:
 *                     type: string
 *                     description: Dia da semana
 *       500:
 *         description: Erro ao obter consumo diário
 */
router.get("/get-daily-consumption", getDailyConsumption);

export default router;