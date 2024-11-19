import request from "supertest";
import { app, server } from "../src/index";
import pool from "../src/config/dbConfig";
import { generateTestToken } from "../src/utils/testUtils";

jest.mock("../src/config/dbConfig", () => ({
  query: jest.fn(),
  end: jest.fn(),
}));

describe("GET /adherence/get-adherence-data", () => {
  const token = generateTestToken();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar os dados de adesão com autenticação válida", async () => {
    const mockResponse = {
      rows: [
        {
          name: "Medication Test",
          taken_count: 5,
          missed_count: 3,
        },
      ],
    };

    (pool.query as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .get("/adherence/get-adherence-data")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.rows);
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

  it("deve retornar erro 500 e logar o erro no console quando ocorrer um erro no banco de dados", async () => {
    const mockError = new Error("Erro simulado no banco de dados");
    (pool.query as jest.Mock).mockRejectedValue(mockError);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await request(app)
      .get("/adherence/get-adherence-data")
      .set("Authorization", `Bearer ${generateTestToken()}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Erro ao obter dados de adesão." });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Erro ao obter dados de adesão:",
      mockError
    );

    consoleSpy.mockRestore();
  });

  describe("GET /adherence/get-missed-doses-by-week", () => {
    const token = generateTestToken();
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("deve retornar as doses esquecidas por semana com autenticação válida", async () => {
      const mockResponse = {
        rows: [
          {
            name: "Medication Test",
            missed_count: 5,
            week: "2024-11-01T00:00:00.000Z",
          },
        ],
      };
      (pool.query as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await request(app)
        .get("/adherence/get-missed-doses-by-week")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows);
    });
  
    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const response = await request(app).get("/adherence/get-missed-doses-by-week");
  
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
  
    it("deve retornar erro 500 e logar o erro no console quando ocorrer um erro no banco de dados", async () => {
      const mockError = new Error("Erro simulado no banco de dados");
      (pool.query as jest.Mock).mockRejectedValue(mockError);
  
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
  
      const response = await request(app)
        .get("/adherence/get-missed-doses-by-week")
        .set("Authorization", `Bearer ${generateTestToken()}`);
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erro ao obter doses esquecidas por semana." });
  
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter doses esquecidas por semana:",
        mockError
      );
  
      consoleSpy.mockRestore();
    });
  });
  
  describe("GET /adherence/get-daily-consumption", () => {
    const token = generateTestToken();
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("deve retornar consumo diário de medicamentos para a semana atual com autenticação válida", async () => {
      const mockResponse = {
        rows: [
          {
            name: "Medication Test",
            taken_count: 5,
            day_of_week: "Monday",
          },
          {
            name: "Medication Test",
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
    });
  
    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const response = await request(app).get("/adherence/get-daily-consumption");
  
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
  
    it("deve retornar erro 500 e logar o erro no console quando ocorrer um erro no banco de dados", async () => {
      const mockError = new Error("Erro simulado no banco de dados");
      (pool.query as jest.Mock).mockRejectedValue(mockError);
  
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
  
      const response = await request(app)
        .get("/adherence/get-daily-consumption")
        .set("Authorization", `Bearer ${generateTestToken()}`);
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erro ao obter consumo diário." });
  
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter consumo diário:",
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
