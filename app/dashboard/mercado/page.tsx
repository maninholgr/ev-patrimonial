"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bitcoin,
  Coins,
  Euro,
  TrendingUp,
} from "lucide-react";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Mercado() {

  const router = useRouter();

  const [mercado, setMercado] = useState({
  btc: 0,
  eur: 0,
  ouro: 0,
});

const [investidor, setInvestidor] =
  useState<any>(null);

const [movimentacoes, setMovimentacoes] =
  useState<any[]>([]);

const [lucroTotal, setLucroTotal] =
  useState(0);

const [rentabilidade, setRentabilidade] =
  useState(0);

const [ultimaAtualizacao,
  setUltimaAtualizacao] =
  useState("");

useEffect(() => {

  carregarMercado();

  const investidorStorage =
    localStorage.getItem("investidor");

  if (investidorStorage) {

    const investidorData =
      JSON.parse(investidorStorage);

    setInvestidor(investidorData);

    carregarMovimentacoes(
      investidorData.id
    );

  }

  const intervalo =
    setInterval(
      carregarMercado,
      60000
    );

  return () =>
    clearInterval(intervalo);

}, []);

async function carregarMercado() {

  try {

    const response =
      await fetch("/api/mercado");

    const data =
      await response.json();

    setMercado(data);

    setUltimaAtualizacao(

  new Date()
    .toLocaleTimeString(
      "pt-BR"
    )

);

  } catch (error) {

    console.log(
      "Erro ao carregar mercado",
      error
    );

  }

}

  const mercadoRef = useRef<HTMLDivElement>(null);

   async function carregarMovimentacoes(
  investidorId: string
) {

  const { data, error } =
    await supabase
      .from("evpatrimonial_movimentacoes")
      .select("*")
      .eq("investidor_id", investidorId)
      .order("created_at", { ascending: true });

  if (error) {

    console.log(error);

    return;

  }

  setMovimentacoes(data || []);

  const rendimentos =
    (data || []).filter(
      mov => mov.tipo === "rendimento"
    );

  if (rendimentos.length > 0) {

    const ultimo =
      rendimentos[
        rendimentos.length - 1
      ];

    setLucroTotal(
      Number(ultimo.valor)
    );

    const descricao =
      (
        ultimo.descricao || ""
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

function irParaMercado() {

  mercadoRef.current?.scrollIntoView({
    behavior: "smooth",
  });

}

const patrimonioAutomatico =
  movimentacoes.reduce(
    (total, movimentacao) => {

      const valor =
        Number(
          movimentacao.valor
        );

      if (
        movimentacao.tipo === "aporte" ||
        movimentacao.tipo === "bonus" ||
        movimentacao.tipo === "rendimento"
      ) {

        return total + valor;

      }

      if (
        movimentacao.tipo === "saque" ||
        movimentacao.tipo === "taxa"
      ) {

        return total - valor;

      }

      return total;

    },
    0
  );

let saldo = 0;

const graficoPatrimonio =
  movimentacoes.map((mov) => {

    const valor = Number(mov.valor);

    if (
      mov.tipo === "aporte" ||
      mov.tipo === "bonus" ||
      mov.tipo === "rendimento"
    ) {
      saldo += valor;
    }

    if (
      mov.tipo === "saque" ||
      mov.tipo === "taxa"
    ) {
      saldo -= valor;
    }

    return {
  etapa:
    mov.tipo.charAt(0).toUpperCase() +
    mov.tipo.slice(1),
  patrimonio: saldo,
};

  });

  return (

    <main className="min-h-screen bg-[#020617] text-white">

      <div className="mx-auto max-w-7xl p-4 md:p-8">

        {/* TOPO */}

        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-2xl md:text-4xl font-bold">
              Goldusd Investimentos
            </h1>

            <p className="mt-2 text-slate-400">
              Seu capital em ouro
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

        {/* HERO */}

        <div className="mb-12 grid gap-8 lg:grid-cols-2">

          {/* TEXTO */}

          <div>

            <span className="rounded-full bg-emerald-900/40 px-4 py-2 text-sm text-emerald-400">
              Plataforma Premium
            </span>

            <h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">

              Seu capital

              <span className="block text-emerald-400">
                protegido
              </span>

              no futuro.

            </h2>

            <p className="mt-6 max-w-xl text-base md:text-lg text-slate-400">

              Acompanhe seus investimentos,
              patrimônio e os principais
              mercados globais em uma única
              plataforma moderna e segura.

            </p>

            <div className="mt-8">

  <button
    onClick={irParaMercado}
    className="rounded-xl border border-slate-700 px-6 py-4 font-semibold transition hover:bg-slate-800"
  >
    Ver Mercado
  </button>

</div>

          </div>

          {/* CARD DIREITO */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 md:p-8">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-400">
                  Patrimônio Total
                </p>

                <h3 className="mt-2 text-3xl md:text-5xl font-bold break-words">
                  R$ {
  patrimonioAutomatico.toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )
}
                </h3>

              </div>

              <div className="rounded-full bg-emerald-900/40 px-4 py-2 font-semibold text-emerald-400">
                +{rentabilidade}%
              </div>

            </div>

            {/* GRÁFICO VISUAL */}

            <div className="mt-8 h-56">

  <ResponsiveContainer
  width="100%"
  height="100%"
>

  <LineChart
    data={graficoPatrimonio}
  >

    <XAxis
  dataKey="etapa"
/>

    <YAxis
  domain={[
    (dataMin: number) =>
      dataMin * 0.98,

    (dataMax: number) =>
      dataMax * 1.02,
  ]}
/>

    <Tooltip
  formatter={(value) => {
    return [
      Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    ];
  }}
/>

    <Line
      type="monotone"
      dataKey="patrimonio"
      stroke="#10B981"
      strokeWidth={4}
      dot={{
        r: 5,
        fill: "#10B981",
      }}
    />

  </LineChart>

</ResponsiveContainer>

</div>

            {/* RESUMO */}

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-800 p-4">

                <p className="text-slate-400">
                  Patrimônio
                </p>

                <h4 className="mt-2 text-[26px] font-bold whitespace-nowrap leading-none">
                  R$ {
  patrimonioAutomatico.toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )
}
                </h4>

              </div>

              <div className="rounded-2xl border border-slate-800 p-4">

                <p className="text-slate-400">
                  Lucro Total
                </p>

                <h4 className="mt-2 text-2xl font-bold text-emerald-400">
  R$ {
    lucroTotal.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
  }
</h4>

              </div>

              <div className="rounded-2xl border border-slate-800 p-4">

                <p className="text-slate-400">
                  Rentabilidade
                </p>

                <h4 className="mt-2 text-2xl font-bold text-emerald-400">
                  {rentabilidade}%
                </h4>

              </div>

            </div>

          </div>

        </div>

        {/* MERCADO */}

        <div
  ref={mercadoRef}
  className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
>

          <div>

            <h2 className="text-2xl md:text-4xl font-bold">
              Mercado em Tempo Real
            </h2>

            <p className="mt-2 text-slate-400">
              Acompanhe os principais ativos globais
            </p>

          </div>

          <div className="flex flex-col gap-2 md:items-end">

  <p className="text-sm text-slate-400">
    Última atualização: {ultimaAtualizacao}
  </p>

  <button
    onClick={carregarMercado}
    className="rounded-xl border border-slate-700 px-5 py-3 transition hover:bg-slate-800"
  >
    Atualizar Mercado
  </button>

</div>
</div>

        {/* ATIVOS */}

        <div className="grid gap-6 md:grid-cols-3">

          {/* BTC */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

              <Bitcoin
                size={40}
                className="text-orange-500"
              />

              <TrendingUp
                className="text-emerald-400"
              />

            </div>

            <h3 className="text-3xl font-bold">
              BTC/USD
            </h3>

            <p className="mt-2 text-slate-400">
              Bitcoin
            </p>

            <h4 className="mt-6 text-2xl md:text-4xl font-bold break-words">
              ${(mercado.btc ?? 0).toLocaleString("en-US")}
            </h4>

            <p className="mt-2 text-emerald-400">
              +5.2%
            </p>

          </div>

          {/* OURO */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

              <Coins
                size={40}
                className="text-yellow-400"
              />

              <TrendingUp
                className="text-emerald-400"
              />

            </div>

            <h3 className="text-3xl font-bold">
              OURO/USD
            </h3>

            <p className="mt-2 text-slate-400">
              Gold Spot
            </p>

            <h4 className="mt-6 text-4xl font-bold">
              ${(mercado.ouro ?? 0).toLocaleString("en-US")}
            </h4>

            <p className="mt-2 text-emerald-400">
              +1.8%
            </p>

          </div>

          {/* EURO */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

              <Euro
                size={40}
                className="text-blue-400"
              />

              <TrendingUp
                className="text-emerald-400"
              />

            </div>

            <h3 className="text-3xl font-bold">
              EUR/USD
            </h3>

            <p className="mt-2 text-slate-400">
              Euro
            </p>

            <h4 className="mt-6 text-4xl font-bold">
              {(mercado.eur ?? 0).toFixed(4)}
            </h4>

            <p className="mt-2 text-emerald-400">
              +0.8%
            </p>

          </div>

        </div>

      </div>

    </main>

  );

}