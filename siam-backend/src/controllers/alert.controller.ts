import { Request, Response } from "express";
import pool from "../config/dbConfig";
import { Alert } from "../models/alert.model";

export const createAlert = async (req: Request, res: Response) => {
  const { name, playCount, isActive, medicationId }: Alert = req.body;
  const userId = req.headers["user-id"];

  try {
    const client = await pool.connect();

    const result = await client.query(
      `INSERT INTO alerts (name, play_count, is_active, medication_id, user_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, playCount, isActive, medicationId, userId]
    );

    client.release();

    res.status(201).json({
      message: "Alerta criado com sucesso!",
      alertId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Erro ao criar alerta:", error);
    res.status(500).json({ error: "Erro ao criar alerta." });
  }
};

export const getAlerts = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];
  try {
    const result = await pool.query(
      `SELECT a.id, a.name, a.play_count AS "playCount", 
              a.is_active AS "isActive", a.medication_id AS "medicationId", 
              m.name AS medicationName
       FROM alerts a
       LEFT JOIN medications m ON a.medication_id = m.id
       WHERE a.user_id = $1`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao obter alertas:", error);
    res.status(500).json({ error: "Erro ao obter alertas." });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  const alertId = req.params.id;
  const userId = req.headers["user-id"];

  try {
    const client = await pool.connect();

    const alertCheckResult = await client.query(
      "SELECT * FROM alerts WHERE id = $1 AND user_id = $2",
      [alertId, userId]
    );

    if (alertCheckResult.rowCount === 0) {
      res
        .status(404)
        .json({ error: "Alerta não encontrado ou não pertence ao usuário." });
    }

    await client.query("DELETE FROM alerts WHERE id = $1", [alertId]);

    client.release();

    res.status(200).json({ message: "Alerta deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar alerta:", error);
    res.status(500).json({ error: "Erro ao deletar alerta." });
  }
};

export const editAlert = async (req: Request, res: Response) => {
  const { id, name, playCount, isActive, medicationId }: Alert = req.body;
  const userId = req.headers["user-id"];

  try {
    const client = await pool.connect();

    const alertCheckResult = await client.query(
      "SELECT * FROM alerts WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (alertCheckResult.rowCount === 0) {
      res
        .status(404)
        .json({ error: "Alerta não encontrado ou não pertence ao usuário." });
    }

    const medicationCheckResult = await client.query(
      "SELECT * FROM medications WHERE id = $1 AND user_id = $2",
      [medicationId, userId]
    );

    if (medicationCheckResult.rowCount === 0) {
      res.status(404).json({
        error: "Medicamento não encontrado ou não pertence ao usuário.",
      });
    }

    await client.query(
      `UPDATE alerts 
       SET name = $1, play_count = $2, is_active = $3, medication_id = $4
       WHERE id = $5`,
      [name, playCount, isActive, medicationId, id]
    );

    client.release();

    res.status(200).json({ message: "Alerta atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar alerta:", error);
    res.status(500).json({ error: "Erro ao atualizar alerta." });
  }
};

export const getAlertById = async (req: Request, res: Response) => {
  const alertId = req.params.id;
  const userId = req.headers["user-id"];

  try {
    const result = await pool.query(
      `SELECT a.id, a.name, a.play_count AS "playCount", 
              a.is_active AS "isActive", a.medication_id AS "medicationId", 
              m.name AS medicationName
       FROM alerts a
       LEFT JOIN medications m ON a.medication_id = m.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [alertId, userId]
    );

    if (result.rowCount === 0) {
      res
        .status(404)
        .json({ error: "Alerta não encontrado ou não pertence ao usuário." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter alerta:", error);
    res.status(500).json({ error: "Erro ao obter alerta." });
  }
};
