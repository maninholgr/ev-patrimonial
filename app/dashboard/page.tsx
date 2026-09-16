"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Wallet,
  FileText,
  User,
  Headset,
  LineChart as MarketIcon,
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

  const SITE_BLOQUEADO = true;

  const router = useRouter();

  const [investidor, setInvestidor] =
    useState<any>(null);

  const [movimentacoes, setMovimentacoes] =
    useState<any[]>([]);

  const [lucroMensal, setLucroMensal] =
    useState(0);

  const [rentabilidade, setRentabilidade] =
    useState(0);

  const [menuAberto, setMenuAberto] = useState(false);  

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

  if (!investidor) return null;

    return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#F4F7FA]">

      {/* MENU */}
      <aside
  className={`
    ${menuAberto ? "block" : "hidden"}
    md:block
    w-full
    md:w-64
    bg-[#0B1727]
    p-6
    text-white
  `}
>

        <h1 className="mb-6 text-2xl md:text-3xl font-bold">
          Goldusd Investimentos
        </h1>

        <nav className="space-y-4">

         <button
           onClick={() => router.push("/dashboard")}
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

          <button
  onClick={() =>
    router.push(
      "/dashboard/suporte"
    )
  }
  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-white/10"
>
  <Headset size={20} />
  Suporte
</button>

<button
  onClick={() =>
    router.push(
      "/dashboard/mercado"
    )
  }
  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-white/10"
>
  <MarketIcon size={20} />
  Mercado
</button>

        </nav>

      </aside>

      {/* CONTEÚDO */}
      <section className="flex-1 p-4 md:p-8 overflow-hidden">

        {/* TOPO */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <button
         onClick={() => setMenuAberto(!menuAberto)}
         className="mb-4 rounded-lg bg-[#0B1727] px-4 py-2 text-white md:hidden"
        >
         ☰ Menu
        </button>

          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1727]">
            Dashboard
          </h2>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">

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
              R$ {
  patrimonioAutomatico.toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )
}
            </h2>

          </div>

          <div className="rounded-2xl bg-green-600 p-6 text-white shadow-lg">

            <p className="text-sm opacity-70">
              Lucro Mensal
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              R$ {
  lucroMensal.toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )
}
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
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
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
  Number(
    movimentacao.valor
  ).toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )
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
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">

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
                            movimentacao.tipo === "aporte" ||
movimentacao.tipo === "rendimento" ||
movimentacao.tipo === "bonus"

  ? "bg-green-600"

  : "bg-red-500"
                          }

                        `}
                      >

                        {movimentacao.tipo}

                      </span>

                    </td>

                    <td
  className={`p-3 font-semibold ${
    movimentacao.tipo === "aporte" ||
movimentacao.tipo === "rendimento" ||
movimentacao.tipo === "bonus"
      ? "text-green-600"
      : "text-red-500"
  }`}
>

  {`R$ ${Number(
    movimentacao.valor
  ).toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`}

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

        </div>

      </section>

    </main>
  );
}