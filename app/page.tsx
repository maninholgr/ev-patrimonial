"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";

export default function Home() {
  
  const SITE_BLOQUEADO = true;

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin(e: any) {

    e.preventDefault();

    const { data } = await supabase
      .from("evpatrimonial_investidores")
      .select("*")
      .eq("email", email)
      .single();

    if (!data) {

      alert("E-mail ou senha inválidos");
      return;

    }

    const senhaValida =
      await bcrypt.compare(
        senha,
        data.senha
      );

    if (!senhaValida) {

      alert("E-mail ou senha inválidos");
      return;

    }

    localStorage.setItem(
      "investidor",
      JSON.stringify(data)
    );

    router.push("/dashboard");

  }

  if (SITE_BLOQUEADO) {
    return (
      <main className="min-h-screen bg-[#F4F7FA] flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 md:p-12 text-center shadow-xl">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <span className="text-4xl">🔒</span>
          </div>

          <h1 className="mb-4 text-2xl md:text-3xl font-bold text-[#0B1727]">
            Site temporariamente indisponível
          </h1>

          <p className="mb-8 text-gray-600 leading-relaxed">
            No momento, o site GoldUSD está temporariamente indisponível.
          </p>

          <div className="rounded-2xl bg-[#F4F7FA] p-6">
            <p className="mb-2 text-sm text-gray-500">
              Para mais informações, entre em contato com:
            </p>

            <p className="text-xl font-bold text-[#0B1727]">
              Edimilson Veiga
            </p>

            <p className="mt-2 text-lg text-gray-700">
              📱 (11) 94746-3377
            </p>
          </div>

          <a
            href="https://wa.me/5511947463377"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full rounded-xl bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700"
          >
            💬 Falar pelo WhatsApp
          </a>

          <p className="mt-8 text-sm text-gray-400">
            GoldUSD Investimentos
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1727]">

      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">

        <h1 className="mb-2 text-center text-4xl font-bold text-[#0B1727]">
          Goldusd Investimentos
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

          <a
  href="https://wa.me/5511947463377?text=Olá,%20esqueci%20minha%20senha%20de%20acesso."
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 block text-center text-sm text-blue-600 hover:underline"
>
  Esqueceu sua senha? Fale com o administrador
</a>

        </form>

      </div>

    </main>
  );
}
