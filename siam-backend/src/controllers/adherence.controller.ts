import { Request, Response } from "express";
import pool from "../config/dbConfig";
import { MedicationLog } from "../models/adherence.model";

export const registerDose = async (req: Request, res: Response) => {
  const { medicationId, taken }: MedicationLog = req.body;
  const userId = req.headers["user-id"];

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO medication_logs (medication_id, taken, date_taken, user_id)
       VALUES ($1, $2, NOW(), $3)`,
      [medicationId, taken, userId]
    );

    await client.query("COMMIT");
    client.release();
    res.status(201).json({ message: "Dose registrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar dose:", error);
    res.status(500).json({ error: "Erro ao registrar dose." });
    return;
  }

  if (!taken) {
    try {
      const medicationResult = await pool.query(
        `SELECT name, dosage FROM medications WHERE id = $1`,
        [medicationId]
      );

      const { name, dosage } = medicationResult.rows[0];

      const result = await pool.query(`SELECT email FROM public.responsibles`);
      const emailResponsibles: { email: string }[] = result.rows;

      const emailPromises = emailResponsibles.map((responsible) =>
        sendEmail(responsible.email, name, dosage, new Date().toLocaleString())
      );

      await Promise.all(emailPromises);

      console.log("Emails enviados para os responsáveis.");
    } catch (error) {
      console.error("Erro ao obter dados de adesão ou enviar emails:", error);
      res
        .status(500)
        .json({ error: "Erro ao enviar emails aos responsáveis." });
    }
  }
};

export const sendEmail = async (
  email: string,
  medicationName: string,
  dosage: string,
  dateTime: string
) => {
  const formData = require("form-data");
  const Mailgun = require("mailgun.js");
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key:
      process.env.MAILGUN_APIKEY,
  });

  const subject = `Alerta: Medicamento ${medicationName} não administrado`;
  const textContent = `O medicamento ${medicationName} (dosagem: ${dosage}) não foi administrado conforme o horário planejado em ${dateTime}.`;
  const htmlContent = `
    <h1>Alerta de Administração de Medicamento</h1>
    <p>O medicamento <strong>${medicationName}</strong> (dosagem: ${dosage}) não foi administrado conforme o horário planejado em ${dateTime}.</p>
    <p>Por favor, verifique e tome as ações necessárias.</p>
  `;

  mg.messages
    .create(process.env.MAILGUN_EMAIL, {
      from: `Sistema de Monitoramento <mailgun@${process.env.MAILGUN_EMAIL}>`,
      to: [email],
      subject,
      text: textContent,
      html: htmlContent,
    })
    .then((msg: any) => console.log("Email enviado com sucesso:", msg))
    .catch((err: any) => console.error("Erro ao enviar email:", err));
};

export const getAdherenceData = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];
  try {
    const result = await pool.query(
      `SELECT m.name, 
              COUNT(CASE WHEN ml.taken THEN 1 END) AS taken_count, 
              COUNT(CASE WHEN NOT ml.taken THEN 1 END) AS missed_count
       FROM medications m
       LEFT JOIN medication_logs ml ON m.id = ml.medication_id
       WHERE ml.user_id = $1
       GROUP BY m.name`,
      [userId]
    );

    const adherenceData: {
      name: string;
      taken_count: number;
      missed_count: number;
    }[] = result.rows;
    res.status(200).json(adherenceData);
  } catch (error) {
    console.error("Erro ao obter dados de adesão:", error);
    res.status(500).json({ error: "Erro ao obter dados de adesão." });
  }
};

export const getMissedDosesByWeek = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];
  try {
    const result = await pool.query(
      `SELECT m.name, 
              COUNT(ml.id) AS missed_count, 
              DATE_TRUNC('week', ml.date_taken) AS week
       FROM medications m
       LEFT JOIN medication_logs ml ON m.id = ml.medication_id
       WHERE ml.taken = false AND ml.user_id = $1
       GROUP BY m.name, week
       ORDER BY week`,
      [userId]
    );

    const missedDosesData: {
      name: string;
      missed_count: number;
      week: string;
    }[] = result.rows;
    res.status(200).json(missedDosesData);
  } catch (error) {
    console.error("Erro ao obter doses esquecidas por semana:", error);
    res
      .status(500)
      .json({ error: "Erro ao obter doses esquecidas por semana." });
  }
};

export const getDailyConsumption = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const result = await pool.query(
      `SELECT m.name, 
              COUNT(CASE WHEN ml.taken THEN 1 END) AS taken_count, 
              TO_CHAR(ml.date_taken, 'Day') AS day_of_week
       FROM medications m
       LEFT JOIN medication_logs ml ON m.id = ml.medication_id
       WHERE ml.taken = true
         AND ml.date_taken >= $1
         AND ml.date_taken <= $2
         AND ml.user_id = $3
       GROUP BY m.name, day_of_week
       ORDER BY day_of_week`,
      [startOfWeek, endOfWeek, userId]
    );

    const dailyConsumptionData: {
      name: string;
      taken_count: number;
      day_of_week: string;
    }[] = result.rows;
    res.status(200).json(dailyConsumptionData);
  } catch (error) {
    console.error("Erro ao obter consumo diário:", error);
    res.status(500).json({ error: "Erro ao obter consumo diário." });
  }
};
