"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Bitcoin,
  TrendingUp,
  Landmark,
} from "lucide-react";

export default function Mercado() {

  const router = useRouter();

  return (

    <main className="min-h-screen bg-[#F4F7FA] p-8">

      <div className="mx-auto max-w-6xl">

        {/* TOPO */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-[#0B1727]">
              Mercado em Tempo Real
            </h1>

            <p className="mt-2 text-gray-500">
              Acompanhe os principais indicadores financeiros
            </p>

          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg bg-[#0B1727] px-5 py-3 text-white hover:opacity-90"
          >
            <ArrowLeft size={18} />
          </button>

        </div>

        {/* CARDS */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <DollarSign
              className="mb-4 text-green-600"
              size={32}
            />
            <p className="text-gray-500">
              Dólar
            </p>
            <h2 className="text-3xl font-bold text-[#0B1727]">
              R$ 5,42
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <Bitcoin
              className="mb-4 text-orange-500"
              size={32}
            />
            <p className="text-gray-500">
              Bitcoin
            </p>
            <h2 className="text-3xl font-bold text-[#0B1727]">
              R$ 620.000
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <TrendingUp
              className="mb-4 text-blue-500"
              size={32}
            />
            <p className="text-gray-500">
              Ethereum
            </p>
            <h2 className="text-3xl font-bold text-[#0B1727]">
              R$ 15.000
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <TrendingUp
              className="mb-4 text-purple-500"
              size={32}
            />
            <p className="text-gray-500">
              Ibovespa
            </p>
            <h2 className="text-3xl font-bold text-[#0B1727]">
              138.500
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <Landmark
              className="mb-4 text-red-500"
              size={32}
            />
            <p className="text-gray-500">
              Selic
            </p>
            <h2 className="text-3xl font-bold text-[#0B1727]">
              14,75%
            </h2>
          </div>

        </div>

        {/* BLOCO INFORMATIVO */}

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">

          <h2 className="mb-4 text-2xl font-bold text-[#0B1727]">
            Resumo do Mercado
          </h2>

          <p className="text-gray-600">
            Nesta área serão exibidos indicadores financeiros,
            moedas, criptomoedas e informações relevantes do mercado.
          </p>

          <p className="mt-4 text-gray-600">
            Em uma próxima atualização podemos integrar dados em
            tempo real através de APIs financeiras.
          </p>

        </div>

      </div>

    </main>

  );

}