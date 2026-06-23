import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setFout("");

    if (wachtwoord !== "demo") {
      setFout("Onjuist e-mailadres of wachtwoord.");
      return;
    }

    const ingevoerdEmail = email.trim().toLowerCase();

    if (ingevoerdEmail === "hr@demo.nl") {
      localStorage.setItem(
        "loonhelder_user",
        JSON.stringify({ email: "hr@demo.nl", rol: "hr", naam: "HR Manager" })
      );
      navigate("/dashboard");
    } else if (ingevoerdEmail === "medewerker@demo.nl") {
      localStorage.setItem(
        "loonhelder_user",
        JSON.stringify({
          email: "medewerker@demo.nl",
          rol: "medewerker",
          naam: "Lisa Jansen",
        })
      );
      navigate("/mijn-profiel");
    } else {
      setFout("Onjuist e-mailadres of wachtwoord.");
    }
  }

  return (
    <div className="pagina flex items-center justify-center px-4">
      <div className="kaart w-full max-w-md p-6 shadow-lg md:p-8">
        <div className="mb-6 text-center md:mb-8">
          <h1 className="text-2xl font-bold text-navy md:text-3xl">
            Loon<span className="text-amber">Helder</span>
          </h1>
          <p className="mt-2 text-sm text-navy/60">
            Loontransparantie voor uw organisatie
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
              className="min-h-11 w-full rounded border border-navy/20 px-3 py-2 text-navy outline-none focus:border-amber focus:ring-1 focus:ring-amber"
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
              className="min-h-11 w-full rounded border border-navy/20 px-3 py-2 text-navy outline-none focus:border-amber focus:ring-1 focus:ring-amber"
              required
            />
          </div>

          {fout && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{fout}</p>
          )}

          <button
            type="submit"
            className="min-h-11 w-full rounded bg-amber py-3 font-semibold text-navy transition-colors hover:bg-amber/90"
          >
            Inloggen
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link
            to="/onboarding"
            className="inline-flex min-h-11 items-center font-medium text-navy hover:text-amber"
          >
            Nieuwe organisatie? Start de scan
          </Link>
        </p>

        <div className="mt-6 rounded bg-achtergrond p-4 text-sm text-navy/70">
          <p className="font-medium text-navy">Testaccounts</p>
          <p className="mt-2">HR: hr@demo.nl / demo</p>
          <p>Medewerker: medewerker@demo.nl / demo</p>
        </div>
      </div>
    </div>
  );
}
