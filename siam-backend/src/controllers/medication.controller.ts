import { Request, Response } from "express";
import pool from "../config/dbConfig";
import { Medication } from "../models/medication.model";

export const createMedication = async (req: Request, res: Response) => {
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
      "INSERT INTO medications (name, dosage, start_date, end_date, observations) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, dosage, startDate, endDate || null, observations || null]
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
    res.status(500).json({ error: "Erro ao criar o medicamento." });
  }
};

export const getMedications = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
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
        GROUP BY m.id;
      `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao obter medicamentos:", error);
    res.status(500).json({ error: "Erro ao obter medicamentos." });
  }
};

export const deleteMedication = async (req: Request, res: Response) => {
  const medicationId = req.params.id;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

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
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Erro ao atualizar o medicamento." });
  }
};

export const getMedicationById = async (req: Request, res: Response) => {
  const medicationId = req.params.id;
  console.log(medicationId);
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
        WHERE m.id = $1  -- Filtra pelo ID do medicamento
        GROUP BY m.id;
      `,
      [medicationId]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter medicamentos:", error);
    res.status(500).json({ error: "Erro ao obter medicamentos." });
  }
};
