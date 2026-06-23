import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-achtergrond px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-navy">
            Loon<span className="text-amber">Helder</span>
          </h1>
          <p className="mt-2 text-sm text-navy/60">
            Inzicht in salaris en functiegroepen
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-navy">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@bedrijf.nl"
              className="w-full rounded border border-navy/20 px-3 py-2 text-navy outline-none focus:border-amber focus:ring-1 focus:ring-amber"
              required
            />
          </div>

          <div>
            <label htmlFor="wachtwoord" className="mb-1 block text-sm font-medium text-navy">
              Wachtwoord
            </label>
            <input
              id="wachtwoord"
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              placeholder="Uw wachtwoord"
              className="w-full rounded border border-navy/20 px-3 py-2 text-navy outline-none focus:border-amber focus:ring-1 focus:ring-amber"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-amber py-2.5 font-semibold text-navy transition-colors hover:bg-amber/90"
          >
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}
