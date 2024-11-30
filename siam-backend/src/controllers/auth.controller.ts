import { Request, Response } from "express";
import pool from "../config/dbConfig";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig";

export const registerUser = async (req: Request, res: Response) => {
  const {
    fullName,
    nickname,
    email,
    phoneNumber,
    cpf,
    birthdate,
    address,
    city,
    zipCode,
    observations,
    username,
    password,
  }: User = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO users (full_name, nickname, email, phone_number, cpf, birthdate, address, city, zip_code, observations, username, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        fullName,
        nickname || null,
        email,
        phoneNumber,
        cpf,
        birthdate,
        address || null,
        city || null,
        zipCode || null,
        observations || null,
        username,
        hashedPassword,
      ]
    );

    const userId = result.rows[0].id;
    await client.query("COMMIT");
    client.release();

    res
      .status(201)
      .json({ message: "Usuário registrado com sucesso!", userId });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  try {
    const client = await pool.connect();

    const result = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    client.release();

    if (result.rows.length === 0) {
      res.status(400).json({ error: "Usuário não encontrado." });
      return;
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(400).json({ error: "Senha incorreta." });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
      }
    );

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      userId: user.id,
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ error: "Erro ao realizar login." });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];
  const requestedUserId = req.params.id;
  const requestedUserIdQuery = parseInt(req.params.id);

  try {
    const client = await pool.connect();

    if (requestedUserId !== userId) {
      res
        .status(403)
        .json({
          error: "Você não tem permissão para visualizar este usuário.",
        });
    }

    const result = await client.query(
      `SELECT full_name AS "fullName", nickname, email, phone_number AS "phoneNumber", cpf, birthdate, address, city, zip_code AS "zipCode", observations, username 
       FROM users 
       WHERE id = $1`,
      [requestedUserIdQuery]
    );
    client.release();

    const user = result.rows[0];
    res.status(200).json({ user });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];
  const requestedUserId = req.params.id;
  const requestedUserIdQuery = parseInt(req.params.id);

  const {
    fullName,
    nickname,
    email,
    phoneNumber,
    cpf,
    birthdate,
    address,
    city,
    zipCode,
    observations,
  }: User = req.body;

  try {
    const client = await pool.connect();

    if (requestedUserId !== userId) {
      res
        .status(403)
        .json({ error: "Você não tem permissão para editar este usuário." });
    }

    await client.query(
      `UPDATE users 
   SET full_name = $1, nickname = $2, email = $3, phone_number = $4, 
       cpf = $5, birthdate = $6, address = $7, city = $8, 
       zip_code = $9, observations = $10
   WHERE id = $11`,
      [
        fullName,
        nickname || null,
        email,
        phoneNumber,
        cpf,
        birthdate,
        address || null,
        city || null,
        zipCode || null,
        observations || null,
        requestedUserIdQuery,
      ]
    );

    client.release();

    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const {
    oldPassword,
    newPassword,
  }: { oldPassword: string; newPassword: string } = req.body;

  try {
    const client = await pool.connect();

    const result = await client.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await client.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      userId,
    ]);

    client.release();
    res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ error: "Erro ao alterar senha." });
  }
};
