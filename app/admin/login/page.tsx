"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export default function LoginAdmin() {

  const SITE_BLOQUEADO = true;

  const router = useRouter();

  const [usuario, setUsuario] =
    useState("");

  const [senha, setSenha] =
    useState("");

  async function entrar() {

    const { data, error } =
      await supabase
        .from(
          "evpatrimonial_admin"
        )
        .select("*")
        .eq(
          "usuario",
          usuario
        )
        .single();

    if (!data) {

      alert(
        "Usuário ou senha inválidos"
      );

      return;
    }

    const senhaValida =
      await bcrypt.compare(
        senha,
        data.senha
      );

    if (!senhaValida) {

      alert(
        "Usuário ou senha inválidos"
      );

      return;
    }

    localStorage.setItem(
      "admin",
      JSON.stringify({
        id: data.id,
        usuario: data.usuario,
      })
    );

    router.push("/admin");
  }

  if (SITE_BLOQUEADO) {
    return (
      <main className="min-h-screen bg-[#F4F7FA] flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 md:p-12 text-center shadow-xl">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <span className="text-4xl">🔒</span>
          </div>

          <h1 className="mb-4 text-2xl md:text-3xl font-bold text-[#0B1727]">
            Sistema temporariamente indisponível
          </h1>

          <p className="mb-8 text-gray-600 leading-relaxed">
            No momento, o sistema administrativo está temporariamente
            indisponível.
          </p>

          <div className="rounded-2xl bg-[#F4F7FA] p-6">
            <p className="mb-2 text-sm text-gray-500">
              Para mais informações, entre em contato com:
            </p>

            <p className="text-xl font-bold text-[#0B1727]">
              Luciano Goularte
            </p>

            <p className="mt-2 text-lg text-gray-700">
              📱 (53) 99928-5822
            </p>
          </div>

          <a
            href="https://wa.me/5553999285822"
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

      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg">

        <h1 className="mb-8 text-center text-4xl font-bold text-[#0B1727]">
          Login Admin
        </h1>

        <div className="space-y-5">

          <label className="mb-2 block font-medium text-gray-700">
            Usuário
          </label>

          <input
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) =>
              setUsuario(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-400 outline-none focus:border-[#0B1727]"
          />

          <label className="mb-2 block font-medium text-gray-700">
            Senha
          </label>

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) =>
              setSenha(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-400 outline-none focus:border-[#0B1727]"
          />

          <button
            onClick={entrar}
            className="w-full rounded-lg bg-[#0B1727] p-4 text-white"
          >
            Entrar
          </button>

        </div>

      </div>

    </main>
  );
}