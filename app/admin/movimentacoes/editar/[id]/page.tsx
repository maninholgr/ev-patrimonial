"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";

export default function EditarMovimentacao() {

  const { id } = useParams();

  const router = useRouter();

  const [tipo, setTipo] =
    useState("");

  const [valor, setValor] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  useEffect(() => {

    const admin =
      localStorage.getItem(
        "admin"
      );

    if (!admin) {

      router.push(
        "/admin/login"
      );

      return;

    }

    carregarMovimentacao();

  }, []);

  async function carregarMovimentacao() {

    const { data } =
      await supabase
        .from(
          "evpatrimonial_movimentacoes"
        )
        .select("*")
        .eq(
          "id",
          id
        )
        .single();

    if (!data)
      return;

    setTipo(
      data.tipo || ""
    );

    setValor(
      String(
        data.valor || ""
      )
    );

    setDescricao(
      data.descricao || ""
    );

  }

  async function salvar() {

    const { error } =
      await supabase
        .from(
          "evpatrimonial_movimentacoes"
        )
        .update({
          tipo,
          valor,
          descricao,
        })
        .eq(
          "id",
          id
        );

    if (error) {

      alert(
        "Erro ao salvar"
      );

      return;

    }

    alert(
      "Movimentação atualizada!"
    );

    router.back();

  }

  return (

    <main className="min-h-screen bg-[#F4F7FA] p-4 md:p-10">

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 md:p-10 shadow-lg">

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <h1 className="text-2xl md:text-4xl font-bold text-[#0B1727]">
            Editar Movimentação
          </h1>

          <button
            onClick={() =>
              router.back()
            }
            className="rounded-lg bg-[#0B1727] px-5 py-3 text-white"
          >
            Voltar
          </button>

        </div>

        <div className="space-y-5">

          <select
            value={tipo}
            onChange={(e) =>
              setTipo(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          >

            <option value="aporte">
              Aporte
            </option>

            <option value="saque">
              Saque
            </option>

            <option value="bonus">
              Bônus
            </option>

            <option value="rendimento">
              Rendimento
            </option>

            <option value="taxa">
              Taxa
            </option>

          </select>

          <input
            type="number"
            value={valor}
            onChange={(e) =>
              setValor(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <textarea
            rows={4}
            value={descricao}
            onChange={(e) =>
              setDescricao(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <button
            onClick={salvar}
            className="w-full rounded-lg bg-green-600 p-4 text-white font-semibold"
          >
            Salvar Alterações
          </button>

        </div>

      </div>

    </main>

  );

}