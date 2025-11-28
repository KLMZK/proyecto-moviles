// __tests__/ContrasenaScreen.test.js
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ContrasenaScreen from "../screens/ContrasenaScreen";

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

describe("ContrasenaScreen", () => {
  it("debe permitir ingresar datos y cambiar contraseña", async () => {
    const { getByPlaceholderText, getByText } = render(<ContrasenaScreen />);

    // Simular ingreso de datos
    fireEvent.changeText(getByPlaceholderText("Nombre"), "Ignacio");
    fireEvent.changeText(getByPlaceholderText("ejemplo@correo.com"), "ignacio@test.com");
    fireEvent.changeText(getByPlaceholderText("Nueva contraseña"), "nueva123");

    // Simular click en botón
    fireEvent.press(getByText("Definir Contraseña"));

    // Esperar resultado
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "http://192.168.1.6/moviles/contrasena.php",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });
});