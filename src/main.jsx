import { createRoot } from "react-dom/client";
import "./index.css";
import Container from "./Container.jsx";
import Example from "./Example.jsx";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  await worker.start({ quiet: true });
}
enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(<Container />);
});
