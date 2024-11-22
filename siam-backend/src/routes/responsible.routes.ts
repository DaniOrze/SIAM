import express from "express";
import {
  createResponsible,
  getResponsibles,
  getResponsibleById,
  editResponsible,
  deleteResponsible,
} from "../controllers/responsible.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Responsible
 *   description: Endpoints para gerenciar responsáveis
 */

/**
 * @swagger
 * /responsible/new-responsibles:
 *   post:
 *     tags: [Responsible]
 *     summary: Cria um novo responsável
 *     description: Adiciona um novo responsável ao sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               cpf:
 *                 type: string
 *               rg:
 *                 type: string
 *                 nullable: true
 *               birthdate:
 *                 type: string
 *                 format: date
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *                 nullable: true
 *               city:
 *                 type: string
 *                 nullable: true
 *               zipCode:
 *                 type: string
 *                 nullable: true
 *               observations:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Responsável criado com sucesso
 *       500:
 *         description: Erro ao criar o responsável
 */
router.post("/new-responsibles", createResponsible);

/**
 * @swagger
 * /responsible/get-responsibles:
 *   get:
 *     tags: [Responsible]
 *     summary: Retorna uma lista de responsáveis
 *     description: Obtém uma lista de todos os responsáveis cadastrados.
 *     responses:
 *       200:
 *         description: Lista de responsáveis retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fullName:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   email:
 *                     type: string
 *                   relationship:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   observations:
 *                     type: string
 *       500:
 *         description: Erro ao obter a lista de responsáveis
 */
router.get("/get-responsibles", getResponsibles);

/**
 * @swagger
 * /responsible/get-responsible/{id}:
 *   get:
 *     tags: [Responsible]
 *     summary: Retorna os detalhes de um responsável específico
 *     description: Obtém os detalhes de um responsável pelo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do responsável a ser obtido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do responsável retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fullName:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 relationship:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 zipCode:
 *                   type: string
 *                 observations:
 *                   type: string
 *       500:
 *         description: Erro ao obter o responsável
 */
router.get("/get-responsible/:id", getResponsibleById);

/**
 * @swagger
 * /responsible/edit-responsibles/{id}:
 *   put:
 *     tags: [Responsible]
 *     summary: Edita um responsável
 *     description: Atualiza as informações de um responsável existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do responsável a ser editado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               fullName:
 *                 type: string
 *               cpf:
 *                 type: string
 *               rg:
 *                 type: string
 *                 nullable: true
 *               birthdate:
 *                 type: string
 *                 format: date
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *                 nullable: true
 *               city:
 *                 type: string
 *                 nullable: true
 *               zipCode:
 *                 type: string
 *                 nullable: true
 *               observations:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Responsável atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar o responsável
 */
router.put("/edit-responsibles/:id", editResponsible);

/**
 * @swagger
 * /responsible/delete-responsibles/{id}:
 *   delete:
 *     tags: [Responsible]
 *     summary: Deleta um responsável
 *     description: Remove um responsável do sistema pelo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do responsável a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Responsável deletado com sucesso
 *       500:
 *         description: Erro ao deletar o responsável
 */
router.delete("/delete-responsibles/:id", deleteResponsible);

export default router;
