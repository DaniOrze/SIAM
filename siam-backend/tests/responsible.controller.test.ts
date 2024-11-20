import request from "supertest";
import { app, server } from "../src/index";
import pool from "../src/config/dbConfig";
import { generateTestToken } from "../src/utils/testUtils";

jest.mock("../src/config/dbConfig", () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue({
      rows: [{ id: 1, name: "John Doe", role: "Nurse" }],
    }),
    release: jest.fn(),
  }),
  query: jest.fn(),
  end: jest.fn(),
}));

describe("Responsible Controller with Authentication", () => {
  const token = generateTestToken();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /responsible/get-responsibles", () => {
    it("deve retornar todos os responsáveis com autenticação válida", async () => {
      const mockResponse = {
        rows: [
          {
            id: 1,
            name: "John Doe",
            role: "Nurse",
          },
        ],
      };
      (pool.query as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .get("/responsible/get-responsibles")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows);
    });

    it("deve retornar erro 401 quando o token não for fornecido", async () => {
      const response = await request(app).get("/responsible/get-responsibles");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acesso negado. Token não fornecido.");
    });

    it("deve retornar erro 403 para token inválido", async () => {
      const response = await request(app)
        .get("/responsible/get-responsibles")
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Token inválido.");
    });
  });

  describe("GET /responsible/get-responsibles", () => {
    it("deve retornar erro 500 e logar o erro no console quando ocorrer um erro no banco de dados", async () => {
      const mockError = new Error("Erro simulado no banco de dados");
      (pool.query as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .get("/responsible/get-responsibles")
        .set("Authorization", `Bearer ${generateTestToken()}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erro ao obter responsáveis." });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter responsáveis:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("POST /responsible/new-responsibles", () => {
    it("deve criar um responsável com sucesso", async () => {
      const responsibleData = {
        fullName: "John Doe",
        cpf: "12345678901",
        rg: "12345678",
        birthdate: "1980-01-01",
        phoneNumber: "1234567890",
        email: "johndoe@example.com",
        address: "123 Main St",
        city: "Sample City",
        zipCode: "12345-678",
        observations: "No observations",
      };

      const response = await request(app)
        .post("/responsible/new-responsibles")
        .set("Authorization", `Bearer ${token}`)
        .send(responsibleData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Responsável cadastrado com sucesso!");
      expect(response.body.responsibleId).toBe(1);
    });

    it("deve criar um responsável com sucesso usando null", async () => {
      const responsibleData = {
        fullName: "John Doe",
        cpf: "12345678901",
        rg: null,
        birthdate: "1980-01-01",
        phoneNumber: "1234567890",
        email: "johndoe@example.com",
        address: null,
        city: null,
        zipCode: null,
        observations: null,
      };

      const response = await request(app)
        .post("/responsible/new-responsibles")
        .set("Authorization", `Bearer ${token}`)
        .send(responsibleData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Responsável cadastrado com sucesso!");
      expect(response.body.responsibleId).toBe(1);
    });
  });

  describe("POST /responsible/new-responsibles", () => {
    it("deve capturar e logar erro no console ao cadastrar responsável", async () => {
      const mockError = new Error("Erro simulado ao inserir responsável");
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockRejectedValue(mockError),
        release: jest.fn(),
      });

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const responsibleData = {
        fullName: "John Doe",
        cpf: "12345678901",
        rg: "12345678",
        birthdate: "1980-01-01",
        phoneNumber: "1234567890",
        email: "johndoe@example.com",
        address: "123 Main St",
        city: "Sample City",
        zipCode: "12345-678",
        observations: "No observations",
      };

      const response = await request(app)
        .post("/responsible/new-responsibles")
        .set("Authorization", `Bearer ${token}`)
        .send(responsibleData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao cadastrar responsável.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao cadastrar responsável:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("DELETE /responsible/delete-responsibles/:id", () => {
    it("deve deletar um responsável com sucesso", async () => {
      const mockResponse = { rowCount: 1 };
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue(mockResponse),
        release: jest.fn(),
      });

      const responsibleId = 1;

      const response = await request(app)
        .delete(`/responsible/delete-responsibles/${responsibleId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Responsável deletado com sucesso!");
    });

    it("deve capturar e logar erro no console ao tentar deletar responsável e retornar erro 500", async () => {
      const mockError = new Error("Erro simulado ao deletar responsável");
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockRejectedValue(mockError),
        release: jest.fn(),
      });

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const responsibleId = 1;

      const response = await request(app)
        .delete(`/responsible/delete-responsibles/${responsibleId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao deletar responsável.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao deletar responsável:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("PUT /responsible/edit-responsibles/:id", () => {
    it("deve atualizar um responsável com sucesso", async () => {
      const mockResponse = { rowCount: 1 };
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue(mockResponse),
        release: jest.fn(),
      });

      const responsibleId = 1;
      const updatedResponsible = {
        id: responsibleId,
        fullName: "Responsável Atualizado",
        cpf: "12345678901",
        rg: "123456789",
        birthdate: "1990-01-01",
        phoneNumber: "987654321",
        email: "responsavel@exemplo.com",
        address: "Rua Exemplo, 123",
        city: "Cidade Exemplo",
        zipCode: "12345678",
        observations: "Observações do responsável",
      };

      const response = await request(app)
        .put(`/responsible/edit-responsibles/${responsibleId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedResponsible);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Responsável atualizado com sucesso!");
    });

    it("deve atualizar um responsável com sucesso usando null", async () => {
      const mockResponse = { rowCount: 1 };
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue(mockResponse),
        release: jest.fn(),
      });

      const responsibleId = 1;
      const updatedResponsible = {
        id: responsibleId,
        fullName: "Responsável Atualizado",
        cpf: "12345678901",
        rg: null,
        birthdate: "1990-01-01",
        phoneNumber: "987654321",
        email: "responsavel@exemplo.com",
        address: null,
        city: null,
        zipCode: null,
        observations: null,
      };

      const response = await request(app)
        .put(`/responsible/edit-responsibles/${responsibleId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedResponsible);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Responsável atualizado com sucesso!");
    });

    it("deve capturar e logar erro no console ao tentar atualizar responsável e retornar erro 500", async () => {
      const mockError = new Error("Erro simulado ao atualizar responsável");
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockRejectedValue(mockError),
        release: jest.fn(),
      });

      const updatedResponsible = {
        id: 1,
        fullName: "Responsável Atualizado",
        cpf: "12345678901",
        rg: "123456789",
        birthdate: "1990-01-01",
        phoneNumber: "987654321",
        email: "responsavel@exemplo.com",
        address: "Rua Exemplo, 123",
        city: "Cidade Exemplo",
        zipCode: "12345678",
        observations: "Observações do responsável",
      };

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .put("/responsible/edit-responsibles/1")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedResponsible);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao atualizar responsável.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao atualizar responsável:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("GET /responsible/get-responsible/:id", () => {
    it("deve retornar os detalhes do responsável com sucesso", async () => {
      const mockResponse = {
        rows: [
          {
            id: 1,
            fullName: "Responsável Teste",
            cpf: "12345678901",
            rg: "123456789",
            birthdate: "1990-01-01",
            phoneNumber: "987654321",
            email: "responsavel@teste.com",
            address: "Rua Teste, 123",
            city: "Cidade Teste",
            zipCode: "12345678",
            observations: "Observações do responsável",
          },
        ],
      };

      (pool.query as jest.Mock).mockResolvedValue(mockResponse);

      const responsibleId = 1;

      const response = await request(app)
        .get(`/responsible/get-responsible/${responsibleId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.rows[0]);
    });

    it("deve capturar e logar erro no console ao tentar obter responsável e retornar erro 500", async () => {
      const mockError = new Error("Erro simulado ao obter responsável");
      (pool.query as jest.Mock).mockRejectedValue(mockError);

      const responsibleId = 1;

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const response = await request(app)
        .get(`/responsible/get-responsible/${responsibleId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao obter responsável.");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao obter responsável:",
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
