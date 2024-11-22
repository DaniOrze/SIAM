import request from "supertest";
import { app, server } from "../src/index";
import pool from "../src/config/dbConfig";
import { generateTestToken } from "../src/utils/testUtils";
import { sendEmail } from "../src/controllers/adherence.controller";

jest.mock("../src/config/dbConfig", () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn(),
    release: jest.fn(),
  }),
  query: jest.fn(),
  end: jest.fn(),
}));

jest.mock("../src/controllers/adherence.controller", () => ({
  ...jest.requireActual("../src/controllers/adherence.controller"),
  sendEmail: jest.fn(),
}));

describe("Adherence Controller - getDailyConsumption", () => {
  const token = generateTestToken();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /adherence/get-daily-consumption", () => {
    it("deve retornar o consumo diário com sucesso", async () => {
      const mockResponse = {
        rows: [
          {
            name: "Paracetamol",
            taken_count: 5,
            day_of_week: "Monday",
          },
          {
            name: "Ibuprofeno",
            taken_count: 3,
            day_of_week: "Tuesday",
          },
        ],
      };

      (pool.query as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .get("/adherence/get-daily-consumption")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows);

      // Verifica se a consulta SQL foi chamada
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String), // Verifica que uma string SQL foi passada
        expect.arrayContaining([
          expect.any(Date), // Verifica que o primeiro parâmetro é uma data
          expect.any(Date), // Verifica que o segundo parâmetro é uma data
        ])
      );
    });

    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const response = await request(app).get(
        "/adherence/get-daily-consumption"
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acesso negado. Token não fornecido.");
    });

    it("deve retornar erro 403 para token inválido", async () => {
      const response = await request(app)
        .get("/adherence/get-daily-consumption")
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Token inválido.");
    });

    it("deve retornar erro 500 e logar o erro no console ao falhar no banco de dados", async () => {
      const mockError = new Error("Erro simulado no banco de dados");
      (pool.query as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .get("/adherence/get-daily-consumption")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "Erro ao obter consumo diário.",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter consumo diário:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });
});

describe("Adherence Controller - getMissedDosesByWeek", () => {
  const token = generateTestToken();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /adherence/get-missed-doses-by-week", () => {
    it("deve retornar as doses esquecidas por semana com sucesso", async () => {
      const mockResponse = {
        rows: [
          {
            name: "Paracetamol",
            missed_count: 2,
            week: "2024-11-13",
          },
          {
            name: "Ibuprofeno",
            missed_count: 1,
            week: "2024-11-13",
          },
        ],
      };

      (pool.query as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .get("/adherence/get-missed-doses-by-week")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows);

      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });

    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const response = await request(app).get(
        "/adherence/get-missed-doses-by-week"
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acesso negado. Token não fornecido.");
    });

    it("deve retornar erro 403 para token inválido", async () => {
      const response = await request(app)
        .get("/adherence/get-missed-doses-by-week")
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Token inválido.");
    });

    it("deve retornar erro 500 e logar o erro no console ao falhar no banco de dados", async () => {
      const mockError = new Error("Erro simulado no banco de dados");
      (pool.query as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .get("/adherence/get-missed-doses-by-week")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "Erro ao obter doses esquecidas por semana.",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter doses esquecidas por semana:",
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

describe("Adherence Controller - getAdherenceData", () => {
  const token = generateTestToken();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /adherence/get-adherence-data", () => {
    it("deve retornar os dados de adesão com sucesso", async () => {
      const mockResponse = {
        rows: [
          {
            name: "Paracetamol",
            taken_count: 5,
            missed_count: 2,
          },
          {
            name: "Ibuprofeno",
            taken_count: 3,
            missed_count: 1,
          },
        ],
      };

      (pool.query as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .get("/adherence/get-adherence-data")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows);

      // Verifica se a consulta SQL foi chamada
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });

    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const response = await request(app).get("/adherence/get-adherence-data");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acesso negado. Token não fornecido.");
    });

    it("deve retornar erro 403 para token inválido", async () => {
      const response = await request(app)
        .get("/adherence/get-adherence-data")
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Token inválido.");
    });

    it("deve retornar erro 500 e logar o erro no console ao falhar no banco de dados", async () => {
      const mockError = new Error("Erro simulado no banco de dados");
      (pool.query as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .get("/adherence/get-adherence-data")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "Erro ao obter dados de adesão.",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter dados de adesão:",
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

describe("Adherence Controller - registerDose", () => {
  const token = generateTestToken();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /adherence/register-dose", () => {
    it("deve registrar a dose com sucesso quando taken = true", async () => {
      const mockClient = pool.connect();
      const mockQuery = (await mockClient).query as jest.Mock;

      const response = await request(app)
        .post("/adherence/register-dose")
        .set("Authorization", `Bearer ${token}`)
        .send({ medicationId: 1, taken: true });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "Dose registrada com sucesso!",
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO medication_logs"),
        [1, true]
      );
      expect((await mockClient).release).toHaveBeenCalled();
    });

    it("deve retornar erro 500 se a transação falhar", async () => {
      const mockClient = pool.connect();
      const mockQuery = (await mockClient).query as jest.Mock;

      mockQuery.mockRejectedValue(new Error("Erro simulado no banco de dados"));

      const response = await request(app)
        .post("/adherence/register-dose")
        .set("Authorization", `Bearer ${token}`)
        .send({ medicationId: 1, taken: true });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erro ao registrar dose." });
    });
  });

  afterAll(async () => {
    await pool.end();
    server.close();
  });
});
