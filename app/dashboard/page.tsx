"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Wallet,
  FileText,
  User,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { supabase } from "../../lib/supabase";

export default function Dashboard() {

  const router = useRouter();

  const [investidor, setInvestidor] =
    useState<any>(null);

  const [movimentacoes, setMovimentacoes] =
    useState<any[]>([]);

  const [lucroMensal, setLucroMensal] =
    useState(0);

  const [rentabilidade, setRentabilidade] =
    useState(0);

  useEffect(() => {

    const investidorStorage =
      localStorage.getItem("investidor");

    if (!investidorStorage) {

      router.push("/");

      return;
    }

    const investidorData =
      JSON.parse(investidorStorage);

    setInvestidor(investidorData);

    carregarMovimentacoes(
      investidorData.id
    );

  }, [router]);

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
          ascending: true,
        });

    if (error) {
      console.log(error);
      return;
    }

    setMovimentacoes(data || []);

    const rendimentos =
      (data || []).filter(
        (mov) =>
          mov.tipo ===
          "rendimento"
      );

    if (rendimentos.length > 0) {

      const ultimoRendimento =
        rendimentos[
          rendimentos.length - 1
        ];

      setLucroMensal(
        Number(
          ultimoRendimento.valor
        )
      );

      const descricao =
  (
    ultimoRendimento.descricao || ""
  ).replace(",", ".");

      const match =
  descricao.match(
    /\d+(\.\d+)?/
  );

      if (match) {

        setRentabilidade(
          parseFloat(match[0])
        );
      }
    }
  }

  function sair() {

    localStorage.removeItem(
      "investidor"
    );

    router.push("/");
  }

  const patrimonioAutomatico =
    movimentacoes.reduce(
      (
        total,
        movimentacao
      ) => {

        const valor =
          Number(
            movimentacao.valor
          );

        if (
          movimentacao.tipo ===
            "aporte" ||
          movimentacao.tipo ===
            "bonus" ||
          movimentacao.tipo ===
            "rendimento"
        ) {

          return total + valor;
        }

        if (
          movimentacao.tipo ===
            "saque" ||
          movimentacao.tipo ===
            "taxa"
        ) {

          return total - valor;
        }

        return total;

      },
      0
    );

  if (!investidor) return null;

  return (
    <main className="flex min-h-screen bg-[#F4F7FA]">

      {/* MENU */}
      <aside className="w-64 bg-[#0B1727] p-6 text-white">

        <h1 className="mb-10 text-3xl font-bold">
          EV Patrimonial
        </h1>

        <nav className="space-y-4">

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="flex w-full items-center gap-3 rounded-lg bg-white/10 p-3 text-left transition hover:bg-white/20"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() =>
              router.push(
                "/dashboard/investimentos"
              )
            }
            className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-white/10"
          >
            <Wallet size={20} />
            Investimentos
          </button>

          <button
            onClick={() =>
              router.push(
                "/dashboard/relatorios"
              )
            }
            className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-white/10"
          >
            <FileText size={20} />
            Relatórios
          </button>

          <button
            onClick={() =>
              router.push(
                "/dashboard/perfil"
              )
            }
            className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-white/10"
          >
            <User size={20} />
            Perfil
          </button>

        </nav>

      </aside>

      {/* CONTEÚDO */}
      <section className="flex-1 p-8">

        {/* TOPO */}
        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-4xl font-bold text-[#0B1727]">
            Dashboard
          </h2>

          <div className="flex items-center gap-4">

            <div className="rounded-full bg-white px-5 py-3 text-black">
              {investidor.nome}
            </div>

            <button
              onClick={sair}
              className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
              Sair
            </button>

          </div>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-[#0B1727] p-6 text-white shadow-lg">

            <p className="text-sm opacity-70">
              Patrimônio Total
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              R$ {patrimonioAutomatico}
            </h2>

          </div>

          <div className="rounded-2xl bg-green-600 p-6 text-white shadow-lg">

            <p className="text-sm opacity-70">
              Lucro Mensal
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              R$ {lucroMensal}
            </h2>

          </div>

          <div className="rounded-2xl bg-blue-500 p-6 text-white shadow-lg">

            <p className="text-sm opacity-70">
              Rentabilidade
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {rentabilidade}%
            </h2>

          </div>

        </div>

        {/* TABELA */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg">

          <h3 className="mb-6 text-2xl font-bold text-[#0B1727]">
            Últimos Rendimentos
          </h3>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="p-4 text-left text-gray-700">
                  Descrição
                </th>

                <th className="p-4 text-left text-gray-700">
                  Valor
                </th>

                <th className="p-4 text-left text-gray-700">
                  Rentabilidade
                </th>

              </tr>

            </thead>

            <tbody>

              {
                movimentacoes
                  .filter(
                    (movimentacao) =>
                      movimentacao.tipo ===
                      "rendimento"
                  )
                  .map(
                    (movimentacao) => (

                      <tr
                        key={movimentacao.id}
                        className="border-b"
                      >

                        <td className="p-3 text-green-600">

                          {
                            movimentacao.descricao
                          }

                        </td>

                        <td className="p-3 text-green-600">

                          R$ {
                            movimentacao.valor
                          }

                        </td>

                        <td className="p-3 text-green-600">

                          {rentabilidade}%

                        </td>

                      </tr>

                    )
                  )
              }

            </tbody>

          </table>

        </div>

        {/* GRÁFICO */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg">

          <h3 className="mb-6 text-2xl font-bold text-[#0B1727]">
            Evolução de Lucros
          </h3>

          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  movimentacoes.filter(
                    (movimentacao) =>
                      movimentacao.tipo ===
                      "rendimento"
                  )
                }
              >

                <XAxis dataKey="descricao" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#0B1727"
                  strokeWidth={4}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* EXTRATO */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg">

          <h3 className="mb-6 text-2xl font-bold text-[#0B1727]">
            Extrato Financeiro
          </h3>

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

                    <td className="p-3">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold text-white

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

                        {movimentacao.tipo}

                      </span>

                    </td>

                    <td
                      className={`p-3 font-semibold

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

                      R$ {movimentacao.valor}

                    </td>

                    <td className="p-3 text-gray-700">
                      {movimentacao.descricao}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}