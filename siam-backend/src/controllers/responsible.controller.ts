import { Request, Response } from "express";
import pool from "../config/dbConfig";
import { Responsible } from "../models/responsible.model";

export const createResponsible = async (req: Request, res: Response) => {
  const {
    fullName,
    cpf,
    rg,
    birthdate,
    phoneNumber,
    email,
    address,
    city,
    zipCode,
    observations,
  }: Responsible = req.body;

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO responsibles (full_name, cpf, rg, birthdate, phone_number, email, address, city, zip_code, observations)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        fullName,
        cpf,
        rg || null,
        birthdate,
        phoneNumber,
        email,
        address || null,
        city || null,
        zipCode || null,
        observations || null,
      ]
    );

    const responsibleId = result.rows[0].id;
    await client.query("COMMIT");
    client.release();

    res
      .status(201)
      .json({ message: "Responsável cadastrado com sucesso!", responsibleId });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Erro ao cadastrar responsável:", error);
    res.status(500).json({ error: "Erro ao cadastrar responsável." });
  }
};

export const getResponsibles = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM responsibles");

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao obter responsáveis:", error);
    res.status(500).json({ error: "Erro ao obter responsáveis." });
  }
};

export const getResponsibleById = async (req: Request, res: Response) => {
  const responsibleId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM responsibles WHERE id = $1",
      [responsibleId]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter responsável:", error);
    res.status(500).json({ error: "Erro ao obter responsável." });
  }
};

export const editResponsible = async (req: Request, res: Response) => {
  const {
    id,
    fullName,
    cpf,
    rg,
    birthdate,
    phoneNumber,
    email,
    address,
    city,
    zipCode,
    observations,
  }: Responsible = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE responsibles
       SET full_name = $1, cpf = $2, rg = $3, birthdate = $4, phone_number = $5, email = $6, address = $7, city = $8, zip_code = $9, observations = $10
       WHERE id = $11`,
      [
        fullName,
        cpf,
        rg || null,
        birthdate,
        phoneNumber,
        email,
        address || null,
        city || null,
        zipCode || null,
        observations || null,
        id,
      ]
    );

    await client.query("COMMIT");
    client.release();

    res.status(200).json({ message: "Responsável atualizado com sucesso!" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao atualizar responsável:", error);
    res.status(500).json({ error: "Erro ao atualizar responsável." });
  }
};

export const deleteResponsible = async (req: Request, res: Response) => {
  const responsibleId = req.params.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM responsibles WHERE id = $1", [
      responsibleId,
    ]);

    await client.query("COMMIT");
    client.release();

    res.status(200).json({ message: "Responsável deletado com sucesso!" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao deletar responsável:", error);
    res.status(500).json({ error: "Erro ao deletar responsável." });
  }
};
