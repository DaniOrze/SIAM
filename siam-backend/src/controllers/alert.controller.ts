import { Request, Response } from "express";
import pool from "../config/dbConfig";
import { Alert } from "../models/alert.model";

export const createAlert = async (req: Request, res: Response) => {
  const { name, type, duration, playCount, isActive }: Alert = req.body;

  try {
    const client = await pool.connect();

    const result = await client.query(
      `INSERT INTO alerts (name, type, duration, play_count, is_active) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, type, duration, playCount, isActive]
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
  try {
    const result = await pool.query(
      `SELECT id, name, type, duration, play_count AS "playCount", is_active AS "isActive"
       FROM alerts`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao obter alertas:", error);
    res.status(500).json({ error: "Erro ao obter alertas." });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  const alertId = req.params.id;

  try {
    const client = await pool.connect();

    await client.query("DELETE FROM alerts WHERE id = $1", [alertId]);

    client.release();

    res.status(200).json({ message: "Alerta deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar alerta:", error);
    res.status(500).json({ error: "Erro ao deletar alerta." });
  }
};

export const editAlert = async (req: Request, res: Response) => {
  const { id, name, type, duration, playCount, isActive }: Alert = req.body;

  try {
    const client = await pool.connect();

    await client.query(
      `UPDATE alerts 
       SET name = $1, type = $2, duration = $3, play_count = $4, is_active = $5
       WHERE id = $6`,
      [name, type, duration, playCount, isActive, id]
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

  try {
    const result = await pool.query(
      `SELECT id, name, type, duration, play_count AS "playCount", is_active AS "isActive"
       FROM alerts
       WHERE id = $1`,
      [alertId]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter alerta:", error);
    res.status(500).json({ error: "Erro ao obter alerta." });
  }
};
