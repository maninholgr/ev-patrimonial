"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function MovimentacoesInvestidor() {

  const { id } = useParams();

  const router = useRouter();

  const [investidor, setInvestidor] =
    useState<any>(null);

  const [movimentacoes, setMovimentacoes] =
    useState<any[]>([]);

  const [totalAportes, setTotalAportes] =
    useState(0);

  const [totalRendimentos, setTotalRendimentos] =
    useState(0);

  const [totalSaques, setTotalSaques] =
    useState(0);

  useEffect(() => {

    carregarDados();

  }, []);

  async function carregarDados() {

    const { data: investidorData } =
      await supabase
        .from(
          "evpatrimonial_investidores"
        )
        .select("*")
        .eq(
          "id",
          id
        )
        .single();

    setInvestidor(
      investidorData
    );

    const {
      data: movimentacoesData,
    } = await supabase
      .from(
        "evpatrimonial_movimentacoes"
      )
      .select("*")
      .eq(
        "investidor_id",
        id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    setMovimentacoes(
      movimentacoesData || []
    );

    let aportes = 0;
    let rendimentos = 0;
    let saques = 0;

    movimentacoesData?.forEach(
      (mov) => {

        if (
          mov.tipo ===
          "aporte"
        ) {

          aportes += Number(
            mov.valor
          );

        }

        if (
          mov.tipo ===
          "rendimento"
        ) {

          rendimentos += Number(
            mov.valor
          );

        }

        if (
          mov.tipo ===
            "saque" ||
          mov.tipo ===
            "taxa"
        ) {

          saques += Number(
            mov.valor
          );

        }

      }
    );

    setTotalAportes(
      aportes
    );

    setTotalRendimentos(
      rendimentos
    );

    setTotalSaques(
      saques
    );

  }

  async function excluirMovimentacao(
    movimentacaoId: string
  ) {

    const confirmar =
      confirm(
        "Deseja excluir esta movimentação?"
      );

    if (!confirmar)
      return;

    const { error } =
      await supabase
        .from(
          "evpatrimonial_movimentacoes"
        )
        .delete()
        .eq(
          "id",
          movimentacaoId
        );

    if (error) {

      alert(
        "Erro ao excluir"
      );

      return;

    }

    carregarDados();

  }

  function formatarValor(
    valor: number
  ) {

    return Number(
      valor
    ).toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  }

  return (

    <main className="min-h-screen bg-[#F4F7FA] p-4 md:p-10">

      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-2xl md:text-4xl font-bold text-[#0B1727]">

              Movimentações

            </h1>

            <p className="text-gray-600">

              {
                investidor?.nome
              }

            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/admin"
              )
            }
            className="rounded-lg bg-[#0B1727] px-5 py-3 text-white"
          >
            Voltar
          </button>

        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="text-gray-500">
              Aportes
            </h3>

            <p className="mt-2 text-2xl font-bold text-green-600">

              R$ {
                formatarValor(
                  totalAportes
                )
              }

            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="text-gray-500">
              Rendimentos
            </h3>

            <p className="mt-2 text-2xl font-bold text-blue-600">

              R$ {
                formatarValor(
                  totalRendimentos
                )
              }

            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="text-gray-500">
              Saques/Taxas
            </h3>

            <p className="mt-2 text-2xl font-bold text-red-600">

              R$ {
                formatarValor(
                  totalSaques
                )
              }

            </p>

          </div>

        </div>

        <div className="space-y-4">

          {movimentacoes.map(
            (movimentacao) => (

              <div
                key={
                  movimentacao.id
                }
                className="rounded-2xl bg-white p-5 shadow"
              >

                <div className="flex flex-col gap-3">

                  <p className="font-bold text-[#0B1727]">

                    {
                      movimentacao.tipo
                    }

                  </p>

                  <p
  className={`text-xl font-bold ${
    movimentacao.tipo === "rendimento"
      ? "text-green-600"
      : movimentacao.tipo === "saque" ||
        movimentacao.tipo === "taxa"
      ? "text-red-600"
      : "text-[#0B1727]"
  }`}
>

  R$ {
    formatarValor(
      movimentacao.valor
    )
  }

</p>

                  <p className="text-gray-700">

                    {
                      movimentacao.descricao
                    }

                  </p>

                  <p className="text-sm text-gray-500">

                    {
                      new Date(
                        movimentacao.created_at
                      ).toLocaleDateString(
                        "pt-BR"
                      )
                    }

                  </p>

                  <div className="flex flex-col gap-3 md:flex-row">

                    <button
                      onClick={() =>
                        router.push(
                          `/admin/movimentacoes/editar/${movimentacao.id}`
                        )
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        excluirMovimentacao(
                          movimentacao.id
                        )
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-white"
                    >
                      Excluir
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </main>

  );

}

