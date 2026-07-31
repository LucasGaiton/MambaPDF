import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const BASE_WIDTH = 375;

export const RF = (size) => {
    return Math.round(size * (width / BASE_WIDTH));
};