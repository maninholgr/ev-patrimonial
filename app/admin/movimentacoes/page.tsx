"use client";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../../../lib/supabase";

export default function Movimentacoes() {

  const router = useRouter();  

  const [investidores, setInvestidores] =
    useState<any[]>([]);

  const [investidorId, setInvestidorId] =
    useState("");

  const [tipo, setTipo] =
    useState("");

  const [valor, setValor] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  useEffect(() => {

  const admin =
    localStorage.getItem("admin");

  if (admin !== "logado") {

    router.push(
      "/admin/login"
    );

    return;
  }

  carregarInvestidores();

}, [router]);

  async function carregarInvestidores() {

    const { data, error } =
      await supabase
        .from(
          "evpatrimonial_investidores"
        )
        .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setInvestidores(data || []);
  }

  async function salvarMovimentacao() {

    const { error } =
      await supabase
        .from(
          "evpatrimonial_movimentacoes"
        )
        .insert([
          {
            investidor_id: investidorId,
            tipo,
            valor,
            descricao,
          },
        ]);

    if (error) {
      console.log(error);
      alert(
        "Erro ao salvar movimentação"
      );
      return;
    }

    alert(
      "Movimentação cadastrada!"
    );

    setInvestidorId("");
    setTipo("");
    setValor("");
    setDescricao("");
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA] p-10">

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 shadow-lg">

       <div className="mb-8 flex items-center justify-between">

  <h1 className="text-4xl font-bold text-[#0B1727]">
    Movimentações Financeiras
  </h1>

  <button
    onClick={() =>
      router.push("/admin")
    }
    className="rounded-lg bg-[#0B1727] px-5 py-3 text-white transition hover:opacity-90"
  >
    Voltar
  </button>

</div>

        <div className="space-y-5">

          <select
            value={investidorId}
            onChange={(e) =>
              setInvestidorId(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          >

            <option value="">
              Selecione o investidor
            </option>

            {investidores.map(
              (investidor) => (

                <option
                  key={investidor.id}
                  value={investidor.id}
                >
                  {investidor.nome}
                </option>

              )
            )}

          </select>

          <select
            value={tipo}
            onChange={(e) =>
              setTipo(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          >

            <option value="">
              Tipo movimentação
            </option>

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
            placeholder="Valor"
            value={valor}
            onChange={(e) =>
              setValor(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) =>
              setDescricao(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <button
            onClick={
              salvarMovimentacao
            }
            className="w-full rounded-lg bg-[#0B1727] p-4 text-white"
          >
            Salvar Movimentação
          </button>

        </div>

      </div>

    </main>
  );
}