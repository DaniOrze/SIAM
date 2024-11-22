import request from "supertest";
import { app, server } from "../src/index";
import pool from "../src/config/dbConfig";
import { generateTestToken } from "../src/utils/testUtils";

jest.mock("../src/config/dbConfig", () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue({
      rows: [{ id: 5 }],
    }),
    release: jest.fn(),
  }),
  query: jest.fn(),
  end: jest.fn(),
}));

describe("Alert Controller with Authentication", () => {
  const token = generateTestToken();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /alert/get-alerts", () => {
    it("deve retornar todos os alertas com autenticação válida", async () => {
      const mockResponse = {
        rows: [
          {
            id: 1,
            name: "Test Alert",
            playCount: 10,
            isActive: true,
            medicationId: 1,
            medicationName: "Medication Test",
          },
        ],
      };
      (pool.query as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .get("/alert/get-alerts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows);
    });

    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const response = await request(app).get("/alert/get-alerts");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acesso negado. Token não fornecido.");
    });

    it("deve retornar erro 403 para token inválido", async () => {
      const response = await request(app)
        .get("/alert/get-alerts")
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Token inválido.");
    });
  });

  describe("GET /alert/get-alerts", () => {
    it("deve retornar erro 500 e logar o erro no console quando ocorrer um erro no banco de dados", async () => {
      const mockError = new Error("Erro simulado no banco de dados");
      (pool.query as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .get("/alert/get-alerts")
        .set("Authorization", `Bearer ${generateTestToken()}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erro ao obter alertas." });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter alertas:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("POST /alert/new-alerts", () => {
    it("deve criar um alerta com sucesso", async () => {
      const alertData = {
        name: "Test Alert",
        playCount: 5,
        isActive: true,
        medication_id: 1,
      };

      const response = await request(app)
        .post("/alert/new-alerts")
        .set("Authorization", `Bearer ${token}`)
        .send(alertData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Alerta criado com sucesso!");
      expect(response.body.alertId).toBe(5);
    });
  });

  describe("POST /alert/new-alerts", () => {
    it("deve capturar e logar erro no console ao criar alerta", async () => {
      const mockError = new Error("Erro simulado ao inserir alerta");
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockRejectedValue(mockError),
        release: jest.fn(),
      });
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const alertData = {
        name: "Test Alert",
        playCount: 5,
        isActive: true,
        medication_id: 1,
      };

      const response = await request(app)
        .post("/alert/new-alerts")
        .set("Authorization", `Bearer ${token}`)
        .send(alertData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao criar alerta.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao criar alerta:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("DELETE /alert/delete-alerts/:id", () => {
    it("deve deletar um alerta com sucesso", async () => {
      const mockResponse = { rowCount: 1 };
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue(mockResponse),
        release: jest.fn(),
      });

      const alertId = 1;

      const response = await request(app)
        .delete(`/alert/delete-alerts/${alertId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Alerta deletado com sucesso!");
    });

    it("deve capturar e logar erro no console ao tentar deletar alerta e retornar erro 500", async () => {
      const mockError = new Error("Erro simulado ao deletar alerta");
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockRejectedValue(mockError),
        release: jest.fn(),
      });

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const alertId = 1;

      const response = await request(app)
        .delete(`/alert/delete-alerts/${alertId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao deletar alerta.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao deletar alerta:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("PUT /alert/edit-alerts/:id", () => {
    it("deve atualizar um alerta com sucesso", async () => {
      const mockResponse = { rowCount: 1 };
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue(mockResponse),
        release: jest.fn(),
      });

      const alertId = 1;
      const updatedAlert = {
        id: alertId,
        name: "Alerta Atualizado",
        playCount: 5,
        isActive: true,
        medicationId: 10,
      };

      const response = await request(app)
        .put(`/alert/edit-alerts/${alertId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedAlert);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Alerta atualizado com sucesso!");
    });

    it("deve capturar e logar erro no console ao tentar atualizar alerta e retornar erro 500", async () => {
      const mockError = new Error("Erro simulado ao atualizar alerta");
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockRejectedValue(mockError),
        release: jest.fn(),
      });

      const updatedAlert = {
        id: 1,
        name: "Alerta Atualizado",
        playCount: 5,
        isActive: true,
        medicationId: 10,
      };

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .put("/alert/edit-alerts/1")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedAlert);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao atualizar alerta.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao atualizar alerta:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("GET /alert/get-alert/:id", () => {
    it("deve retornar os detalhes do alerta com sucesso", async () => {
      const mockResponse = {
        rows: [
          {
            id: 1,
            name: "Alerta Teste",
            playCount: 5,
            isActive: true,
            medicationId: 10,
            medicationName: "Medicação Teste",
          },
        ],
      };

      (pool.query as jest.Mock).mockResolvedValue(mockResponse);

      const alertId = 1;

      const response = await request(app)
        .get(`/alert/get-alert/${alertId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows[0]);
    });

    it("deve capturar e logar erro no console ao tentar obter alerta e retornar erro 500", async () => {
      const mockError = new Error("Erro simulado ao obter alerta");
      (pool.query as jest.Mock).mockRejectedValue(mockError);

      const alertId = 1;

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .get(`/alert/get-alert/${alertId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao obter alerta.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter alerta:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  afterAll(async () => {
    await pool.end();
    server.close();
  });
});
