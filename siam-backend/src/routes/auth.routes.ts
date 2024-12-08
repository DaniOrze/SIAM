import express from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  editUser,
  changePassword,
} from "../controllers/auth.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação de usuários
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     tags: [Auth]
 *     summary: Cadastra um novo usuário
 *     description: Registra um novo usuário no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - cpf
 *               - birthdate
 *               - username
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               nickname:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               cpf:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               observations:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Requisição inválida
 *       500:
 *         description: Erro ao cadastrar o usuário
 */
router.post("/signup", registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Faz login no sistema
 *     description: Autentica um usuário e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro ao fazer login
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Auth]
 *     summary: Obtém os dados de um usuário
 *     description: Recupera os detalhes de um usuário com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser recuperado
 *         schema:
 *           type: integer
 *       - in: header
 *         name: user-id
 *         required: true
 *         description: ID do usuário autenticado.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                     nickname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     cpf:
 *                       type: string
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                     address:
 *                       type: string
 *                     city:
 *                       type: string
 *                     zipCode:
 *                       type: string
 *                     observations:
 *                       type: string
 *                     username:
 *                       type: string
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuário
 */
router.get("/users/:id", getUserById);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags: [Auth]
 *     summary: Atualiza os dados de um usuário
 *     description: Permite a atualização das informações de um usuário existente com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: integer
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
 *             required:
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - cpf
 *               - birthdate
 *             properties:
 *               fullName:
 *                 type: string
 *               nickname:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               cpf:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               observations:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Requisição inválida
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar usuário
 */
router.put("/user/:id", editUser);

/**
 * @swagger
 * /users/{id}/change-password:
 *   put:
 *     tags: [Auth]
 *     summary: Altera a senha de um usuário
 *     description: Permite que um usuário altere sua senha com base no ID fornecido. É necessário fornecer a senha antiga e a nova senha.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário cuja senha será alterada
 *         schema:
 *           type: integer
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
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: A senha atual do usuário
 *               newPassword:
 *                 type: string
 *                 description: A nova senha que o usuário deseja definir
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Requisição inválida, possivelmente devido a uma senha antiga incorreta ou formatação inválida da nova senha
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao alterar a senha do usuário
 */

router.put("/users/:id/change-password", changePassword);

export default router;
