
import { Building2 } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Building Planner</h1>
          <p className="text-sm text-gray-600">Design & annotate your building plans</p>
        </div>
      </div>
    </header>
  );
};
