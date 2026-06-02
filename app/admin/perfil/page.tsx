"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export default function PerfilAdmin() {

  const router = useRouter();

  const [admin, setAdmin] =
    useState<any>(null);

  const [senhaAtual, setSenhaAtual] =
    useState("");

  const [novaSenha, setNovaSenha] =
    useState("");

  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  useEffect(() => {

    const adminStorage =
      localStorage.getItem(
        "admin"
      );

    if (!adminStorage) {

      router.push(
        "/admin/login"
      );

      return;

    }

    setAdmin(
      JSON.parse(
        adminStorage
      )
    );

  }, []);

  async function alterarSenha() {

    if (!admin) return;

    if (!senhaAtual) {

      alert(
        "Digite a senha atual"
      );

      return;

    }

    if (!novaSenha) {

      alert(
        "Digite a nova senha"
      );

      return;

    }

    if (
      novaSenha !==
      confirmarSenha
    ) {

      alert(
        "As senhas não conferem"
      );

      return;

    }

    const { data } =
      await supabase
        .from(
          "evpatrimonial_admin"
        )
        .select("*")
        .eq(
          "id",
          admin.id
        )
        .single();

    if (!data) {

      alert(
        "Admin não encontrado"
      );

      return;

    }

    const senhaValida =
      await bcrypt.compare(
        senhaAtual,
        data.senha
      );

    if (!senhaValida) {

      alert(
        "Senha atual incorreta"
      );

      return;

    }

    const senhaHash =
      await bcrypt.hash(
        novaSenha,
        10
      );

    const { error } =
      await supabase
        .from(
          "evpatrimonial_admin"
        )
        .update({
          senha: senhaHash,
        })
        .eq(
          "id",
          admin.id
        );

    if (error) {

      alert(
        "Erro ao atualizar senha"
      );

      return;

    }

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");

    alert(
      "Senha alterada com sucesso!"
    );

  }

  return (
    <main className="min-h-screen bg-[#F4F7FA] p-6">

      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-6 flex items-center justify-between">

  <h1 className="text-3xl font-bold text-[#0B1727]">
    Perfil Admin
  </h1>

  <button
    onClick={() =>
      router.push(
        "/admin"
      )
    }
    className="rounded-lg bg-[#0B1727] px-5 py-3 text-white transition hover:opacity-90"
  >
    Voltar
  </button>

</div>

        <div className="mb-6 rounded-lg bg-gray-100 p-4 text-black">

          <strong>
            Usuário:
          </strong>{" "}

          {admin?.usuario}

        </div>

        <div className="space-y-4">

          <input
            type="password"
            placeholder="Senha Atual"
            value={senhaAtual}
            onChange={(e) =>
              setSenhaAtual(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <input
            type="password"
            placeholder="Nova Senha"
            value={novaSenha}
            onChange={(e) =>
              setNovaSenha(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <input
            type="password"
            placeholder="Confirmar Nova Senha"
            value={confirmarSenha}
            onChange={(e) =>
              setConfirmarSenha(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <button
            onClick={
              alterarSenha
            }
            className="w-full rounded-lg bg-[#0B1727] p-4 text-white"
          >
            Alterar Senha
          </button>

        </div>

      </div>

    </main>
  );
}
