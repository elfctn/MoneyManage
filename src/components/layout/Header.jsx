import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-10 py-3">
        <div className="flex gap-8">
          <span className="text-gray-800 font-semibold text-2xl">
            DebtsMaster
          </span>
          <div className="flex items-end gap-4">
            <Link
              to="/dashboard"
              className="text-sky-500 no-underline font-semibold text-lg hover:underline"
            >
              Dashboard
            </Link>
            <Link
              to="/debts"
              className="text-sky-500 no-underline font-semibold text-lg hover:underline"
            >
              Debts
            </Link>
          </div>
        </div>
        <FontAwesomeIcon icon={faReact} className="text-sky-500 text-4xl" />
      </div>
      <hr className="w-full" />
    </div>
  );
}
