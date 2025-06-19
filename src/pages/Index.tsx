
import { Canvas } from "@/components/Canvas";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex">
        <Canvas />
      </main>
    </div>
  );
};

export default Index;
