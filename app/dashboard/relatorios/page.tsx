"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  FileText,
  Download,
  TrendingUp,
} from "lucide-react";

import { supabase } from "../../../lib/supabase";

export default function Relatorios() {

  const router = useRouter();

  const [investidor, setInvestidor] =
    useState<any>(null);

  const [movimentacoes, setMovimentacoes] =
    useState<any[]>([]);

  const [totalRendimentos, setTotalRendimentos] =
    useState(0);

  useEffect(() => {

    const investidorStorage =
      localStorage.getItem(
        "investidor"
      );

    if (!investidorStorage) {

      router.push("/");

      return;
    }

    const investidorData =
      JSON.parse(
        investidorStorage
      );

    setInvestidor(
      investidorData
    );

    carregarMovimentacoes(
      investidorData.id
    );

  }, []);

  async function carregarMovimentacoes(
    investidorId: string
  ) {

    const { data, error } =
      await supabase
        .from(
          "evpatrimonial_movimentacoes"
        )
        .select("*")
        .eq(
          "investidor_id",
          investidorId
        );

    if (error) {
      console.log(error);
      return;
    }

    setMovimentacoes(data || []);

    calcularRendimentos(
      data || []
    );
  }

  function calcularRendimentos(
    movimentacoes: any[]
  ) {

    let total = 0;

    movimentacoes.forEach(
      (movimentacao) => {

        if (
          movimentacao.tipo ===
          "rendimento"
        ) {

          total += Number(
            movimentacao.valor
          );
        }
      }
    );

    setTotalRendimentos(total);
  }

  if (!investidor) return null;

  return (
    <main className="min-h-screen bg-[#F4F7FA] p-8">

      <div className="mx-auto max-w-6xl">

        {/* TOPO */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-[#0B1727]">
              Relatórios
            </h1>

            <p className="mt-2 text-gray-500">
              Resumo financeiro da sua conta
            </p>

          </div>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="rounded-lg bg-[#0B1727] px-5 py-3 text-white transition hover:opacity-90"
          >
            Voltar
          </button>

        </div>

        {/* CARDS */}

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-lg">

            <div className="mb-4 flex items-center gap-3">

              <TrendingUp
                className="text-green-600"
              />

              <p className="font-semibold text-[#0B1727]">
                Rendimentos Totais
              </p>

            </div>

            <h2 className="text-3xl font-bold text-green-600">

              R$ {totalRendimentos}

            </h2>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">

            <div className="mb-4 flex items-center gap-3">

              <FileText
                className="text-[#0B1727]"
              />

              <p className="font-semibold text-[#0B1727]">
                Movimentações
              </p>

            </div>

            <h2 className="text-3xl font-bold text-[#0B1727]">

              {movimentacoes.length}

            </h2>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">

            <div className="mb-4 flex items-center gap-3">

              <Download
                className="text-blue-600"
              />

              <p className="font-semibold text-[#0B1727]">
                Exportação
              </p>

            </div>

            <button
  onClick={() =>
    window.print()
  }
  className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
>
  Baixar Relatório
</button>

          </div>

        </div>

        {/* TABELA */}

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-lg">

          <h2 className="mb-6 text-3xl font-bold text-[#0B1727]">
            Histórico Completo
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="p-4 text-left text-gray-700">
                  Tipo
                </th>

                <th className="p-4 text-left text-gray-700">
                  Valor
                </th>

                <th className="p-4 text-left text-gray-700">
                  Descrição
                </th>

              </tr>

            </thead>

            <tbody>

              {movimentacoes.map(
                (movimentacao) => (

                  <tr
                    key={movimentacao.id}
                    className="border-b"
                  >

                    <td className="p-4 capitalize text-gray-800">
                      {movimentacao.tipo}
                    </td>

                    <td
                      className={`p-4 font-semibold

                        ${
                          movimentacao.tipo ===
                            "aporte" ||
                          movimentacao.tipo ===
                            "rendimento"

                            ? "text-green-600"

                            : "text-red-500"
                        }

                      `}
                    >

                      R$ {
                        movimentacao.valor
                      }

                    </td>

                    <td className="p-4 text-gray-800">
                      {
                        movimentacao.descricao
                      }
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}