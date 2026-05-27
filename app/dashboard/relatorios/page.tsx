"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import { supabase } from "../../../lib/supabase";

export default function Investimentos() {

  const router = useRouter();

  const [investidor, setInvestidor] =
    useState<any>(null);

  const [movimentacoes, setMovimentacoes] =
    useState<any[]>([]);

  const [patrimonio, setPatrimonio] =
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
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.log(error);
      return;
    }

    setMovimentacoes(data || []);

    calcularPatrimonio(
      data || []
    );
  }

  function calcularPatrimonio(
    movimentacoes: any[]
  ) {

    let total = 0;

    movimentacoes.forEach(
      (movimentacao) => {

        if (
          movimentacao.tipo ===
            "aporte" ||
          movimentacao.tipo ===
            "rendimento"
        ) {

          total += Number(
            movimentacao.valor
          );

        } else {

          total -= Number(
            movimentacao.valor
          );
        }
      }
    );

    setPatrimonio(total);
  }

  function formatarValor(
    valor: number | string
  ) {

    return Number(
      Number(valor).toFixed(2)
    ).toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  if (!investidor) return null;

  return (
    <main className="min-h-screen bg-[#F4F7FA] p-8">

      <div className="mx-auto max-w-6xl">

        {/* TOPO */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-[#0B1727]">
              Investimentos
            </h1>

            <p className="mt-2 text-gray-500">
              Acompanhe sua carteira financeira
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

        {/* CARD */}

        <div className="mb-10 rounded-2xl bg-[#0B1727] p-8 text-white shadow-lg">

          <p className="text-lg opacity-70">
            Patrimônio Atual
          </p>

          <h2 className="mt-3 text-5xl font-bold">

            R$ {
              formatarValor(
                patrimonio
              )
            }

          </h2>

        </div>

        {/* MOVIMENTAÇÕES */}

        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <h2 className="mb-6 text-3xl font-bold text-[#0B1727]">
            Histórico Financeiro
          </h2>

          <div className="space-y-4">

            {movimentacoes.map(
              (movimentacao) => (

                <div
                  key={movimentacao.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-5"
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`rounded-full p-3 text-white

                        ${
                          movimentacao.tipo ===
                            "aporte" ||
                          movimentacao.tipo ===
                            "rendimento"

                            ? "bg-green-600"

                            : "bg-red-500"
                        }

                      `}
                    >

                      {
                        movimentacao.tipo ===
                          "aporte" ||
                        movimentacao.tipo ===
                          "rendimento"

                          ? (
                            <ArrowUpCircle />
                          ) : (
                            <ArrowDownCircle />
                          )
                      }

                    </div>

                    <div>

                      <p className="font-semibold capitalize text-[#0B1727]">
                        {movimentacao.tipo}
                      </p>

                      <p className="text-sm text-gray-500">
                        {
                          movimentacao.descricao
                        }
                      </p>

                    </div>

                  </div>

                  <div
                    className={`text-xl font-bold

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
                      formatarValor(
                        movimentacao.valor
                      )
                    }

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </main>
  );
}