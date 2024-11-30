import { Request, Response } from "express";
import pool from "../config/dbConfig";
import { Medication } from "../models/medication.model";

export const createMedication = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];

  const {
    name,
    dosage,
    administrationSchedules,
    startDate,
    endDate,
    observations,
  }: Medication = req.body;

  try {
    const client = await pool.connect();

    await client.query("BEGIN");

    const medicationResult = await client.query(
      "INSERT INTO medications (user_id, name, dosage, start_date, end_date, observations) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [userId, name, dosage, startDate, endDate || null, observations || null]
    );

    const medicationId = medicationResult.rows[0].id;

    for (const schedule of administrationSchedules) {
      await client.query(
        "INSERT INTO administration_schedules (medication_id, time, days_of_week) VALUES ($1, $2, $3)",
        [medicationId, schedule.time, schedule.daysOfWeek]
      );
    }

    await client.query("COMMIT");

    client.release();

    res
      .status(201)
      .json({ message: "Medicamento criado com sucesso!", medicationId });
  } catch (error) {
    console.error("Erro ao criar medicamento:", error);
    res.status(500).json({ error: "Erro ao criar o medicamento." });
  }
};

export const getMedications = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];

  try {
    const result = await pool.query(
      `
        SELECT 
          m.id,
          m.name,
          m.dosage,
          m.start_date AS startDate,
          m.end_date AS endDate,
          m.observations,
          json_agg(
            json_build_object(
              'time', a.time,
              'daysOfWeek', a.days_of_week
            )
          ) AS administrationSchedules
        FROM medications m
        LEFT JOIN administration_schedules a ON m.id = a.medication_id
        WHERE m.user_id = $1 -- Filtra pelo ID do usuário
        GROUP BY m.id;
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao obter medicamentos:", error);
    res.status(500).json({ error: "Erro ao obter medicamentos." });
  }
};

export const deleteMedication = async (req: Request, res: Response) => {
  const medicationId = req.params.id;
  const userId = req.headers["user-id"];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

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
      "DELETE FROM administration_schedules WHERE medication_id = $1",
      [medicationId]
    );

    await client.query("DELETE FROM medications WHERE id = $1", [medicationId]);

    await client.query("COMMIT");
    client.release();

    res.status(200).json({ message: "Medicamento deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar medicamento:", error);
    res.status(500).json({ error: "Erro ao deletar medicamento." });
  }
};

export const editMedication = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];
  const {
    id,
    name,
    dosage,
    administrationSchedules,
    startDate,
    endDate,
    observations,
  }: Medication = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const medicationCheckResult = await client.query(
      "SELECT * FROM medications WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (medicationCheckResult.rowCount === 0) {
      res.status(404).json({
        error: "Medicamento não encontrado ou não pertence ao usuário.",
      });
    }

    await client.query(
      "UPDATE medications SET name = $1, dosage = $2, start_date = $3, end_date = $4, observations = $5 WHERE id = $6",
      [name, dosage, startDate, endDate || null, observations || null, id]
    );

    await client.query(
      "DELETE FROM administration_schedules WHERE medication_id = $1",
      [id]
    );
    for (const schedule of administrationSchedules) {
      await client.query(
        "INSERT INTO administration_schedules (medication_id, time, days_of_week) VALUES ($1, $2, $3)",
        [id, schedule.time, schedule.daysOfWeek]
      );
    }

    await client.query("COMMIT");

    client.release();

    res.status(200).json({ message: "Medicamento atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o medicamento." });
  }
};

export const getMedicationById = async (req: Request, res: Response) => {
  const medicationId = req.params.id;
  const userId = req.headers["user-id"];

  try {
    const result = await pool.query(
      `
        SELECT 
          m.id,
          m.name,
          m.dosage,
          m.start_date AS startDate,
          m.end_date AS endDate,
          m.observations,
          json_agg(
            json_build_object(
              'time', a.time,
              'daysOfWeek', a.days_of_week
            )
          ) AS administrationSchedules
        FROM medications m
        LEFT JOIN administration_schedules a ON m.id = a.medication_id
        WHERE m.id = $1 AND m.user_id = $2  -- Filtra pelo ID do medicamento e do usuário
        GROUP BY m.id;
      `,
      [medicationId, userId]
    );

    if (result.rowCount === 0) {
      res
        .status(404)
        .json({
          error: "Medicamento não encontrado ou não pertence ao usuário.",
        });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter medicamento:", error);
    res.status(500).json({ error: "Erro ao obter medicamento." });
  }
};
