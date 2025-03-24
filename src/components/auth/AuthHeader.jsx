import { ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthHeader(props) {
  return (
    <>
      <div className="mb-4 flex items-center justify-center">
        <ClipboardCheck size={25} />
        <Link
          className="text-center text-xl font-semibold text-gray-700"
          to="/home"
        >
          Personal Cloud Storage
        </Link>
      </div>

      <div className="my-5">
        <h1 className="text-4xl font-medium">{props.title}</h1>
        <p className="text-slate-500">{props.subtitle}</p>
      </div>
    </>
  );
}
