"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function LoginAdmin() {

  const router = useRouter();

  const [usuario, setUsuario] =
    useState("");

  const [senha, setSenha] =
    useState("");

  function entrar() {

    if (
      usuario === "admin" &&
      senha === "123456"
    ) {

      localStorage.setItem(
        "admin",
        "logado"
      );

      router.push("/admin");

      return;
    }

    alert(
      "Usuário ou senha inválidos"
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
      setUsuario(e.target.value)
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
      setSenha(e.target.value)
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