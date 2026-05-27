"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin(e: any) {

    e.preventDefault();

    const { data, error } = await supabase
      .from("evpatrimonial_investidores")
      .select("*")
      .eq("email", email)
      .eq("senha", senha)
      .single();

    if (data) {

      localStorage.setItem(
        "investidor",
        JSON.stringify(data)
      );

      router.push("/dashboard");

    } else {

      alert("E-mail ou senha inválidos");

      console.log(error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1727]">

      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">

        <h1 className="mb-2 text-center text-4xl font-bold text-[#0B1727]">
          EV Patrimonial
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Acesse sua conta
        </p>

        <form
          onSubmit={fazerLogin}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              E-mail
            </label>

            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 p-3 text-black outline-none transition focus:border-[#0B1727]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 p-3 text-black outline-none transition focus:border-[#0B1727]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#0B1727] p-3 font-semibold text-white transition hover:opacity-90"
          >
            Entrar
          </button>

        </form>
      </div>
    </main>
  );
}