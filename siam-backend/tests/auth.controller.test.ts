import request from "supertest";
import { app, server } from "../src/index";
import pool from "../src/config/dbConfig";
import bcrypt from "bcrypt";
import { generateTestToken } from "../src/utils/testUtils";

jest.mock("../src/config/dbConfig", () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue({
      rows: [
        {
          id: 1,
          fullName: "John Doe",
          nickname: "John",
          email: "john.doe@example.com",
        },
      ],
    }),
    release: jest.fn(),
  }),
  query: jest.fn(),
  end: jest.fn(),
}));

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("User Controller - Register User", () => {
    const newUser = {
      fullName: "John Doe",
      nickname: "John",
      email: "john.doe@example.com",
      phoneNumber: "123456789",
      cpf: "12345678901",
      birthdate: "1990-01-01",
      address: "Rua Exemplo, 123",
      city: "Cidade Teste",
      zipCode: "12345678",
      observations: "Nenhuma",
      username: "john.doe",
      password: "securePassword123",
    };

    it("deve registrar o usuário com sucesso", async () => {
      const response = await request(app).post("/signup").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Usuário registrado com sucesso!");
      expect(response.body.userId).toBeDefined();
    });

    it("deve retornar erro 500 ao falhar na conexão com o banco de dados", async () => {
      const validUser = newUser;

      (pool.connect as jest.Mock).mockRejectedValueOnce(
        new Error("Falha na conexão")
      );

      const response = await request(app).post("/signup").send(validUser);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao registrar usuário.");
    });
  });


  describe("User Controller - Register User with null", () => {
    const newUser = {
      fullName: "John Doe",
      nickname: null,
      email: "john.doe@example.com",
      phoneNumber: "123456789",
      cpf: "12345678901",
      birthdate: "1990-01-01",
      address: null,
      city: null,
      zipCode: null,
      observations: null,
      username: "john.doe",
      password: "securePassword123",
    };

    it("deve registrar o usuário com sucesso usando null", async () => {
      const response = await request(app).post("/signup").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Usuário registrado com sucesso!");
      expect(response.body.userId).toBeDefined();
    });
  });

  describe("User Controller - Login User", () => {
    const validUser = {
      username: "john.doe",
      password: "securePassword123",
    };

    it("deve realizar o login com sucesso", async () => {
      const mockUser = {
        id: 1,
        username: "john.doe",
        password: await bcrypt.hash(validUser.password, 10),
      };

      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue({
          rows: [mockUser],
        }),
        release: jest.fn(),
      });

      const response = await request(app).post("/login").send(validUser);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login realizado com sucesso!");
      expect(response.body.token).toBeDefined();
      expect(response.body.userId).toBe(mockUser.id);
    });

    it("deve retornar erro 400 quando o usuário não for encontrado", async () => {
      const invalidUser = {
        username: "nonexistentuser",
        password: "password123",
      };

      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue({
          rows: [],
        }),
        release: jest.fn(),
      });

      const response = await request(app).post("/login").send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Usuário não encontrado.");
    });

    it("deve retornar erro 400 quando a senha estiver incorreta", async () => {
      const invalidPasswordUser = {
        username: "john.doe",
        password: "wrongPassword123",
      };

      const mockUser = {
        id: 1,
        username: "john.doe",
        password: await bcrypt.hash("securePassword123", 10),
      };

      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue({
          rows: [mockUser],
        }),
        release: jest.fn(),
      });

      const response = await request(app)
        .post("/login")
        .send(invalidPasswordUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Senha incorreta.");
    });
    it("deve retornar erro 500 ao falhar na conexão com o banco de dados", async () => {
      const validUser = {
        username: "john.doe",
        password: "securePassword123",
      };

      (pool.connect as jest.Mock).mockRejectedValueOnce(
        new Error("Falha na conexão")
      );

      const response = await request(app).post("/login").send(validUser);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao realizar login.");
    });
  });

  describe("User Controller - Edit User", () => {
    const updatedUser = {
      fullName: "John Doe Updated",
      nickname: "John Updated",
      email: "john.updated@example.com",
      phoneNumber: "987654321",
      cpf: "12345678901",
      birthdate: "1990-01-01",
      address: "Rua Atualizada, 456",
      city: "Cidade Atualizada",
      zipCode: "87654321",
      observations: "Nenhuma atualização",
    };

    it("deve atualizar as informações do usuário com sucesso", async () => {
      const mockUserId = 1;
    
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        release: jest.fn(),
      });
    
      const response = await request(app)
        .put(`/user/${mockUserId}`)
        .set("user-id", mockUserId.toString())
        .send(updatedUser);
    
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Usuário atualizado com sucesso!");
    });
    
    it("deve retornar erro 500 ao falhar na atualização do usuário", async () => {
      const mockUserId = 1;
    
      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest
          .fn()
          .mockRejectedValue(new Error("Erro ao atualizar no banco de dados")),
        release: jest.fn(),
      });
    
      const response = await request(app)
        .put(`/user/${mockUserId}`)
        .set("user-id", mockUserId.toString())
        .send(updatedUser);
    
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao atualizar usuário.");
    });    
  });

  describe("User Controller - Edit User with null", () => {
    const updatedUser = {
      fullName: "John Doe Updated",
      nickname: null,
      email: "john.updated@example.com",
      phoneNumber: "987654321",
      cpf: "12345678901",
      birthdate: "1990-01-01",
      address: null,
      city: null,
      zipCode: null,
      observations: null,
    };

    it("deve atualizar as informações do usuário com sucesso usando null", async () => {
      const mockUserId = 1;

      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        release: jest.fn(),
      });

      const response = await request(app)
        .put(`/user/${mockUserId}`)
        .set("user-id", mockUserId.toString())
        .send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Usuário atualizado com sucesso!");
    });
  });

  describe("User Controller - Change Password", () => {
    const validOldPassword = "oldPassword123";
    const validNewPassword = "newPassword123";
    const mockUserId = 1;

    it("deve alterar a senha com sucesso", async () => {
      const token = generateTestToken();

      const validOldPassword = "oldPassword123";
      const validNewPassword = "newPassword123";
      const mockUserId = 1;

      (pool.connect as jest.Mock).mockResolvedValue({
        query: jest.fn().mockResolvedValueOnce({
          rows: [{ password: validOldPassword }],
        }),
        release: jest.fn(),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      bcrypt.hash = jest.fn().mockResolvedValue(validNewPassword);

      const response = await request(app)
        .put(`/users/${mockUserId}/change-password`)
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: validOldPassword, newPassword: validNewPassword });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Senha alterada com sucesso!");
    });

    it("deve retornar erro 500 ao falhar na conexão com o banco de dados", async () => {
      const mockUserId = 1;
      const validOldPassword = "oldPassword123";
      const validNewPassword = "newPassword123";
      const token = generateTestToken();

      (pool.connect as jest.Mock).mockRejectedValueOnce(
        new Error("Falha na conexão")
      );

      const response = await request(app)
        .put(`/users/${mockUserId}/change-password`)
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: validOldPassword, newPassword: validNewPassword });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao alterar senha.");
    });
  });

  afterAll(async () => {
    await pool.end();
    server.close();
  });
});
