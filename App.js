import { View } from "react-native";
import Sidebar from "./src/components/SideBar";
import NovoPedido from "./src/pages/NovoPedido";

export default function App() {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <Sidebar />
      <View style={{ flex: 1 }}>
        <NovoPedido />
      </View>
    </View>
  );
}