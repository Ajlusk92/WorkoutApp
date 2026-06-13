// components/WeightChart.tsx

import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function WeightChart() {
  return (
    <LineChart
      data={{
        labels: ["W1", "W2", "W3", "W4"],
        datasets: [{ data: [228, 225, 223, 220] }],
      }}
      width={screenWidth - 32}
      height={220}
      yAxisSuffix=" lb"
      chartConfig={{
        backgroundColor: "#FFFFFF",
        backgroundGradientFrom: "#FFFFFF",
        backgroundGradientTo: "#FFFFFF",
        decimalPlaces: 0,
        color: () => "#1E3A8A",
        labelColor: () => "#374151",
        propsForDots: {
          r: "5",
          strokeWidth: "2",
          stroke: "#F97316",
        },
      }}
      bezier
      style={{
        borderRadius: 16,
      }}
    />
  );
}