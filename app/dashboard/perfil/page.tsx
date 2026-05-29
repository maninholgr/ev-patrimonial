"use client";

import { supabase } from "@/lib/supabase";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  User,
  Mail,
  Phone,
  Wallet,
} from "lucide-react";

export default function Perfil() {

  const router = useRouter();

  const [investidor, setInvestidor] =
    useState<any>(null);

  const [patrimonio, setPatrimonio] =
    useState(0);

  useEffect(() => {

    async function carregarPerfil() {

      const investidorStorage =
        localStorage.getItem(
          "investidor"
        );

      if (!investidorStorage) {

        router.push("/");

        return;
      }

      const investidorParse =
        JSON.parse(
          investidorStorage
        );

      setInvestidor(
        investidorParse
      );

      const {
        data: movimentacoes,
      } = await supabase
        .from(
          "evpatrimonial_movimentacoes"
        )
        .select("*")
        .eq(
          "investidor_id",
          investidorParse.id
        );

      let total = 0;

      movimentacoes?.forEach(
        (mov) => {

          if (
            mov.tipo === "aporte" ||
            mov.tipo === "rendimento"
          ) {

            total += Number(
              mov.valor
            );
          }

          if (
            mov.tipo === "saque" ||
            mov.tipo === "taxa"
          ) {

            total -= Number(
              mov.valor
            );
          }

        }
      );

      setPatrimonio(total);

    }

    carregarPerfil();

  }, []);

  function sair() {

    localStorage.removeItem(
      "investidor"
    );

    router.push("/");
  }

  if (!investidor) return null;

  return (
    <main className="min-h-screen bg-[#F4F7FA] p-8">

      <div className="mx-auto max-w-4xl">

        {/* TOPO */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-[#0B1727]">
              Meu Perfil
            </h1>

            <p className="mt-2 text-gray-500">
              Informações da sua conta
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

        {/* CARD PERFIL */}

        <div className="rounded-2xl bg-white p-10 shadow-lg">

          <div className="mb-10 flex items-center gap-5">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0B1727] text-white">

              <User size={40} />

            </div>

            <div>

              <h2 className="text-3xl font-bold text-[#0B1727]">
                {investidor.nome}
              </h2>

              <p className="text-gray-500">
                Investidor Goldusd Investimentos
              </p>

            </div>

          </div>

          {/* INFORMAÇÕES */}

          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-xl border border-gray-200 p-5">

              <div className="mb-3 flex items-center gap-3">

                <Mail
                  className="text-[#0B1727]"
                />

                <p className="font-semibold text-[#0B1727]">
                  E-mail
                </p>

              </div>

              <p className="text-gray-600">
                {investidor.email}
              </p>

            </div>

            <div className="rounded-xl border border-gray-200 p-5">

              <div className="mb-3 flex items-center gap-3">

                <Phone
                  className="text-[#0B1727]"
                />

                <p className="font-semibold text-[#0B1727]">
                  Telefone
                </p>

              </div>

              <p className="text-gray-600">
                {
                  investidor.telefone ||
                  "Não informado"
                }
              </p>

            </div>

            <div className="rounded-xl border border-gray-200 p-5 md:col-span-2">

              <div className="mb-3 flex items-center gap-3">

                <Wallet
                  className="text-[#0B1727]"
                />

                <p className="font-semibold text-[#0B1727]">
                  Patrimônio Atual
                </p>

              </div>

              <p className="text-3xl font-bold text-green-600">

                R$ {
                  Number(
                    Number(
                      patrimonio
                    ).toFixed(2)
                  ).toLocaleString(
                    "pt-BR",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )
                }

              </p>

            </div>

          </div>

          {/* BOTÃO SAIR */}

          <button
            onClick={sair}
            className="mt-10 w-full rounded-xl bg-red-500 p-4 text-white transition hover:bg-red-600"
          >
            Sair da Conta
          </button>

        </div>

      </div>

    </main>
  );
}