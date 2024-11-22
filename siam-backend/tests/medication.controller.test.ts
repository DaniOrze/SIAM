import request from "supertest";
import { app, server } from "../src/index";
import pool from "../src/config/dbConfig";
import { generateTestToken } from "../src/utils/testUtils";

jest.mock("../src/config/dbConfig", () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue({
      rows: [
        {
          id: 1,
          name: "Medicação Teste",
          dosage: "10mg",
          startDate: "2024-01-01",
          endDate: "2024-06-01",
          observations: "Nenhuma",
          administrationSchedules: [],
        },
      ],
    }),
    release: jest.fn(),
  }),
  query: jest.fn(),
  end: jest.fn(),
}));

describe("Medication Controller with Authentication", () => {
  const token = generateTestToken();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /medication/new-medications", () => {
    it("deve criar um medicamento com sucesso", async () => {
      const medicationData = {
        name: "Test Medication",
        dosage: "2x ao dia",
        administrationSchedules: [
          { time: "08:00", daysOfWeek: ["Segunda", "Quarta", "Sexta"] },
          { time: "20:00", daysOfWeek: ["Segunda", "Quarta", "Sexta"] },
        ],
        startDate: "2024-11-01",
        endDate: "2024-12-01",
        observations: "Tomar com água",
      };

      const response = await request(app)
        .post("/medication/new-medications")
        .set("Authorization", `Bearer ${token}`)
        .send(medicationData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Medicamento criado com sucesso!");
      expect(response.body.medicationId).toBeDefined();
    });

    it("deve criar um medicamento com sucesso usando null", async () => {
      const medicationData = {
        name: "Test Medication",
        dosage: "2x ao dia",
        administrationSchedules: [
          { time: "08:00", daysOfWeek: ["Segunda", "Quarta", "Sexta"] },
          { time: "20:00", daysOfWeek: ["Segunda", "Quarta", "Sexta"] },
        ],
        startDate: "2024-11-01",
        endDate: null,
        observations: null,
      };

      const response = await request(app)
        .post("/medication/new-medications")
        .set("Authorization", `Bearer ${token}`)
        .send(medicationData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Medicamento criado com sucesso!");
      expect(response.body.medicationId).toBeDefined();
    });

  });
  it("deve capturar e logar erro no console ao criar medicamento", async () => {
    const mockError = new Error("Erro simulado ao inserir medicamento");
    (pool.connect as jest.Mock).mockResolvedValue({
      query: jest.fn().mockRejectedValue(mockError),
      release: jest.fn(),
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const medicationData = {
      name: "Test Medication",
      dosage: "2x ao dia",
      administrationSchedules: [
        { time: "08:00", daysOfWeek: ["Segunda", "Quarta", "Sexta"] },
      ],
      startDate: "2024-11-01",
      observations: "Tomar com água",
    };

    const response = await request(app)
      .post("/medication/new-medications")
      .set("Authorization", `Bearer ${token}`)
      .send(medicationData);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Erro ao criar o medicamento.");

    consoleSpy.mockRestore();
  });

  describe("GET /medication/get-medications", () => {
    it("deve retornar todos os medicamentos com autenticação válida", async () => {
      const mockResponse = {
        rows: [
          {
            id: 1,
            name: "Test Medication",
            dosage: "2x ao dia",
            startDate: "2024-11-01",
            endDate: "2024-11-15",
            observations: "Tomar com água",
            administrationSchedules: [
              { time: "08:00", daysOfWeek: ["Segunda", "Quarta"] },
            ],
          },
        ],
      };
      (pool.query as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .get("/medication/get-medications")
        .set("Authorization", `Bearer ${generateTestToken()}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows);
    });

    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const response = await request(app).get("/medication/get-medications");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acesso negado. Token não fornecido.");
    });

    it("deve retornar erro 403 para token inválido", async () => {
      const response = await request(app)
        .get("/medication/get-medications")
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Token inválido.");
    });

    it("deve retornar erro 500 e logar o erro no console quando ocorrer um erro no banco de dados", async () => {
      const mockError = new Error("Erro simulado no banco de dados");
      (pool.query as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .get("/medication/get-medications")
        .set("Authorization", `Bearer ${generateTestToken()}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erro ao obter medicamentos." });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter medicamentos:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("DELETE /medication/delete-medications/:id", () => {
    it("deve deletar um medicamento com sucesso", async () => {
      const mockResponse = { rowCount: 1 };
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue(mockResponse),
        release: jest.fn(),
      });

      const medicationId = 1;

      const response = await request(app)
        .delete(`/medication/delete-medications/${medicationId}`)
        .set("Authorization", `Bearer ${generateTestToken()}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Medicamento deletado com sucesso!");
    });

    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const medicationId = 1;

      const response = await request(app).delete(
        `/medication/delete-medications/${medicationId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acesso negado. Token não fornecido.");
    });

    it("deve retornar erro 403 para token inválido", async () => {
      const medicationId = 1;

      const response = await request(app)
        .delete(`/medication/delete-medications/${medicationId}`)
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Token inválido.");
    });

    it("deve capturar e logar erro no console ao tentar deletar medicamento e retornar erro 500", async () => {
      const mockError = new Error("Erro simulado ao deletar medicamento");
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockRejectedValue(mockError),
        release: jest.fn(),
      });

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const medicationId = 1;

      const response = await request(app)
        .delete(`/medication/delete-medications/${medicationId}`)
        .set("Authorization", `Bearer ${generateTestToken()}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao deletar medicamento.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao deletar medicamento:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("GET /medication/get-medication/:id", () => {
    it("deve retornar os detalhes do medicamento com sucesso", async () => {
      const mockResponse = {
        rows: [
          {
            id: 1,
            name: "Medicamento Teste",
            dosage: "10mg",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            observations: "Observações do medicamento",
            administrationSchedules: [
              { time: "08:00", daysOfWeek: ["Monday", "Wednesday"] },
              { time: "14:00", daysOfWeek: ["Tuesday", "Thursday"] },
            ],
          },
        ],
      };

      (pool.query as jest.Mock).mockResolvedValue(mockResponse);

      const medicationId = 1;

      const response = await request(app)
        .get(`/medication/get-medication/${medicationId}`)
        .set("Authorization", `Bearer ${generateTestToken()}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows[0]);
    });

    it("deve capturar e logar erro no console ao tentar obter medicamento e retornar erro 500", async () => {
      const mockError = new Error("Erro simulado ao obter medicamento");
      (pool.query as jest.Mock).mockRejectedValue(mockError);

      const medicationId = 1;

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .get(`/medication/get-medication/${medicationId}`)
        .set("Authorization", `Bearer ${generateTestToken()}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao obter medicamentos.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter medicamentos:",
        mockError
      );

      consoleSpy.mockRestore();
    });

    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const medicationId = 1;

      const response = await request(app).get(
        `/medication/get-medication/${medicationId}`
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acesso negado. Token não fornecido.");
    });

    it("deve retornar erro 403 para token inválido", async () => {
      const medicationId = 1;

      const response = await request(app)
        .get(`/medication/get-medication/${medicationId}`)
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Token inválido.");
    });
  });

  describe("PUT /medication/edit-medications/:id", () => {
    it("deve atualizar um medicamento com sucesso", async () => {
      const mockResponse = { rowCount: 1 };
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue(mockResponse),
        release: jest.fn(),
      });

      const medicationData = {
        id: 1,
        name: "Updated Test Medication",
        dosage: "2x ao dia",
        administrationSchedules: [
          { time: "08:00", daysOfWeek: ["Segunda", "Quarta"] },
        ],
        startDate: "2024-11-01",
        endDate: "2024-12-01",
        observations: "Observações atualizadas",
      };

      const response = await request(app)
        .put(`/medication/edit-medications/${medicationData.id}`)
        .set("Authorization", `Bearer ${generateTestToken()}`)
        .send(medicationData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Medicamento atualizado com sucesso!");
    });

    it("deve atualizar um medicamento com sucesso usando null", async () => {
      const mockResponse = { rowCount: 1 };
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue(mockResponse),
        release: jest.fn(),
      });

      const medicationData = {
        id: 1,
        name: "Updated Test Medication",
        dosage: "2x ao dia",
        administrationSchedules: [
          { time: "08:00", daysOfWeek: ["Segunda", "Quarta"] },
        ],
        startDate: "2024-11-01",
        endDate: null,
        observations: null,
      };

      const response = await request(app)
        .put(`/medication/edit-medications/${medicationData.id}`)
        .set("Authorization", `Bearer ${generateTestToken()}`)
        .send(medicationData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Medicamento atualizado com sucesso!");
    });

    it("deve capturar e logar erro no console ao tentar atualizar medicamento e retornar erro 500", async () => {
      const mockError = new Error("Erro simulado ao atualizar medicamento");
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockRejectedValue(mockError),
        release: jest.fn(),
      });

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const medicationData = {
        id: 1,
        name: "Updated Test Medication",
        dosage: "2x ao dia",
        administrationSchedules: [
          { time: "08:00", daysOfWeek: ["Segunda", "Quarta"] },
        ],
        startDate: "2024-11-01",
        endDate: "2024-12-01",
        observations: "Observações atualizadas",
      };

      const response = await request(app)
        .put(`/medication/edit-medications/${medicationData.id}`)
        .set("Authorization", `Bearer ${generateTestToken()}`)
        .send(medicationData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao atualizar o medicamento.");

      consoleSpy.mockRestore();
    });
  });

  afterAll(async () => {
    await pool.end();
    server.close();
  });
});
