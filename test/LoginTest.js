// __tests__/LoginScreenFail.test.js
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock de useNavigation
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// Mock de AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
}));

// Mock de fetch global → login fallido
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        ingreso: 0,
      }),
  })
);

describe("LoginScreen - caso negativo", () => {
  it("no debe guardar datos ni navegar si el login falla", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Simular ingreso de datos
    fireEvent.changeText(getByPlaceholderText("Email"), "ignacio@test.com");
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "wrongpass");

    // Simular click en botón
    fireEvent.press(getByText("Iniciar Sesión"));

    // Esperar resultado
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalledWith("HomeTabs");
    });
  });
});