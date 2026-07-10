"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function ClienteDetalhes() {

  const { id } = useParams();

  const router = useRouter();

  const [investidor, setInvestidor] =
    useState<any>(null);

  const [patrimonio, setPatrimonio] =
    useState(0);

  const [lucro, setLucro] =
    useState(0);

  const [rentabilidade, setRentabilidade] =
    useState("0.00");

  useEffect(() => {

    carregarCliente();

  }, []);

  async function carregarCliente() {

    const { data } =
      await supabase
        .from("evpatrimonial_investidores")
        .select("*")
        .eq("id", id)
        .single();

    if (!data) return;

    setInvestidor(data);

    const {
      data: movimentacoes,
    } = await supabase
      .from(
        "evpatrimonial_movimentacoes"
      )
      .select("*")
      .eq(
        "investidor_id",
        id
      );

    let patrimonioCalc = 0;
    let lucroCalc = 0;

    movimentacoes?.forEach((mov) => {

      if (
        mov.tipo === "aporte" ||
        mov.tipo === "rendimento" ||
        mov.tipo === "bonus"
      ) {

        patrimonioCalc +=
          Number(mov.valor);

      }

      if (
        mov.tipo === "rendimento"
      ) {

        lucroCalc +=
          Number(mov.valor);

      }

      if (
        mov.tipo === "saque" ||
        mov.tipo === "taxa"
      ) {

        patrimonioCalc -=
          Number(mov.valor);

      }

    });

    let rentCalc = "0.00";

const ultimoRendimento =
  movimentacoes
    ?.filter(
      (mov) =>
        mov.tipo === "rendimento"
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )[0];

if (
  ultimoRendimento?.descricao
) {

  const match =
    ultimoRendimento.descricao.match(
      /([\d.,]+)%/
    );

  if (match) {

    rentCalc =
      match[1].replace(
        ",",
        "."
      );

  }

}

    setPatrimonio(
      patrimonioCalc
    );

    setLucro(
      lucroCalc
    );

    setRentabilidade(
      rentCalc
    );

  }

  function formatarValor(
    valor: number
  ) {

    return valor.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  }

  if (!investidor)
    return null;

  return (

    <main className="min-h-screen bg-[#F4F7FA] p-4 md:p-10">

      <div className="mx-auto max-w-5xl">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <h1 className="text-2xl md:text-4xl font-bold text-[#0B1727]">
            Dados do Cliente
          </h1>

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="rounded-lg bg-[#0B1727] px-5 py-3 text-white"
          >
            Voltar
          </button>

        </div>

        <div className="rounded-2xl bg-white p-4 md:p-8 shadow-lg text-[#0B1727]">

          <div className="grid gap-4 md:grid-cols-2 text-gray-800">

            <div>
              <strong className="text-[#0B1727] font-bold">Nome:</strong>
              <p>{investidor.nome}</p>
            </div>

            <div>
              <strong className="text-[#0B1727] font-bold">Email:</strong>
              <p>{investidor.email}</p>
            </div>

            <div>
              <strong className="text-[#0B1727] font-bold">Telefone:</strong>
              <p>{investidor.telefone}</p>
            </div>

            <div>
              <strong className="text-[#0B1727] font-bold">Data Nascimento:</strong>
              <p>{investidor.data_nascimento}</p>
            </div>

            <div>
              <strong className="text-[#0B1727] font-bold">RG:</strong>
              <p>{investidor.rg}</p>
            </div>

            <div>
              <strong className="text-[#0B1727] font-bold">CPF:</strong>
              <p>{investidor.cpf}</p>
            </div>

            <div>
              <strong className="text-[#0B1727] font-bold">PIX:</strong>
              <p>{investidor.chave_pix}</p>
            </div>

            <div>
              <strong className="text-[#0B1727] font-bold">Corretor:</strong>
              <p>{investidor.corretor}</p>
            </div>

            <div className="md:col-span-2">
              <strong className="text-[#0B1727] font-bold">Endereço:</strong>
              <p>{investidor.endereco}</p>
            </div>

          </div>

        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-lg">

            <h3 className="text-gray-500">
              Patrimônio
            </h3>

            <p className="mt-2 text-2xl font-bold text-green-600">
              R$ {formatarValor(patrimonio)}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">

            <h3 className="text-gray-500">
              Lucro
            </h3>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              R$ {formatarValor(lucro)}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">

            <h3 className="text-gray-500">
              Rentabilidade
            </h3>

            <p className="mt-2 text-2xl font-bold text-[#0B1727]">
              {rentabilidade}%
            </p>

          </div>

        </div>

      </div>

    </main>

  );

}