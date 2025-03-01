import { Toaster } from "sonner";

export default function Toast() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#1A202B",
          color: "white",
          border: "1px solid rgba(255,255,255,0.1)",
        },
      }}
    />
  );
}
