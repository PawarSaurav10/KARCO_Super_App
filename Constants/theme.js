import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    primary: "#004C6B", //darkblue
    transparentPrimary: "rgba(227, 120, 75, 0.4)",
    transparentPrimary9: "rgba(255, 238, 233, 0.9)",
    // orange: "#FFA133",
    // lightOrange: "#FFA133",
    // lightOrange2: "#FDDED4",
    // lightOrange3: "#FFD9AD",
    lightGreen: "#30c735",
    green: "#27AE60",
    red: "#FF1717",
    red2: "#FF6C44",
    blue: "#0064C0",
    darkBlue: "#111A2C",
    darkGray: "#525C67",
    darkGray2: "#757D85",
    gray: "#898B9A",
    gray2: "#BBBDC1",
    gray3: "#CFD0D7",
    lightGray1: "#DDDDDD",
    lightGray2: "#F5F5F8",
    white2: "#FBFBFB",
    white: "#FFFFFF",
    black: "#000000",
    blue: "#0A6BC7",
    lightBlue: "#ADD7FF",
    lightBlue1: "#6FA8DF",
    lightBlue2: "#EBF3FB",

    transparent: "transparent",
    transparentWhite1: "rgba(255, 255, 255, 0.1)",
    transparentBlack1: "rgba(0, 0, 0, 0.1)",
    transparentBlack7: "rgba(0, 0, 0, 0.7)",
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // font sizes
    largeTitle: 40,
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    h5: 12,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height,
};