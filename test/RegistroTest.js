// __tests__/RegisterScreen.test.js
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../screens/RegisterScreen";

// Mock de useNavigation
jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// Mock de fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ estado: 1 }),
  })
);

describe("RegisterScreen", () => {
  it("debe permitir ingresar datos y crear cuenta", async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    // Simular ingreso de datos
    fireEvent.changeText(getByPlaceholderText("Nombre"), "Ignacio");
    fireEvent.changeText(getByPlaceholderText("ejemplo@correo.com"), "ignacio@test.com");
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "123456");

    // Simular click en botón
    fireEvent.press(getByText("Crear Cuenta"));

    // Esperar resultado
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "http://192.168.1.6/moviles/registro.php",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });
});