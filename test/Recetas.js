// __tests__/FormRecetasScreen.test.js
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FormRecetasScreen from "../screens/FormRecetasScreen";

// Mock de expo-image-picker
jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "mocked-image-uri" }],
    })
  ),
  MediaTypeOptions: { Images: "Images" },
}));

describe("FormRecetasScreen", () => {
  it("debe agregar un ingrediente a la lista", () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<FormRecetasScreen />);

    // Simular ingreso de datos
    fireEvent.changeText(getByPlaceholderText("Ingrediente"), "Tomate");
    fireEvent.changeText(getByPlaceholderText("Cantidad"), "2");

    // Simular click en botón "+"
    fireEvent.press(getByTestId("btnMas")); // Necesitarías añadir testID al botón en tu código

    // Validar que aparece en la lista
    expect(getByText("Tomate — 2")).toBeTruthy();
  });

  it("debe eliminar un ingrediente al presionarlo", () => {
    const { getByPlaceholderText, getByTestId, getByText, queryByText } = render(<FormRecetasScreen />);

    // Agregar ingrediente
    fireEvent.changeText(getByPlaceholderText("Ingrediente"), "Cebolla");
    fireEvent.changeText(getByPlaceholderText("Cantidad"), "1");
    fireEvent.press(getByTestId("btnMas"));

    // Confirmar que aparece
    expect(getByText("Cebolla — 1")).toBeTruthy();

    // Eliminar ingrediente
    fireEvent.press(getByText("Cebolla — 1"));

    // Validar que ya no está
    expect(queryByText("Cebolla — 1")).toBeNull();
  });

  it("debe seleccionar una imagen correctamente", async () => {
    const { getByText, findByTestId } = render(<FormRecetasScreen />);

    // Simular click en "Seleccionar Imagen"
    fireEvent.press(getByText("Seleccionar Imagen"));

    // Validar que se renderiza la imagen mockeada
    const image = await findByTestId("selectedImage"); // Añadir testID al <Image />
    expect(image.props.source.uri).toBe("mocked-image-uri");
  });
});