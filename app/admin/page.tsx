"use client";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabase";

export default function Admin() {

  const router = useRouter();

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [telefone, setTelefone] =
    useState("");

  const [investidores, setInvestidores] =
    useState<any[]>([]);

  const [editandoId, setEditandoId] =
    useState<string | null>(null);

  useEffect(() => {

    const admin =
      localStorage.getItem(
        "admin"
      );

    if (admin !== "logado") {

      router.push(
        "/admin/login"
      );

      return;
    }

    carregarInvestidores();

  }, []);

  async function carregarInvestidores() {

    const {
      data: investidoresData,
      error,
    } = await supabase
      .from(
        "evpatrimonial_investidores"
      )
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    const investidoresComValores =
      await Promise.all(

        (investidoresData || []).map(
          async (
            investidor
          ) => {

            const {
              data: movimentacoes,
            } = await supabase
              .from(
                "evpatrimonial_movimentacoes"
              )
              .select("*")
              .eq(
                "investidor_id",
                investidor.id
              );

            let patrimonio = 0;
            let lucro = 0;

            movimentacoes?.forEach(
              (mov) => {

                if (
                  mov.tipo ===
                    "aporte" ||
                  mov.tipo ===
                    "rendimento"
                ) {

                  patrimonio +=
                    Number(
                      mov.valor
                    );
                }

                if (
                  mov.tipo ===
                    "rendimento"
                ) {

                  lucro += Number(
                    mov.valor
                  );
                }

                if (
                  mov.tipo ===
                    "saque" ||
                  mov.tipo ===
                    "taxa"
                ) {

                  patrimonio -=
                    Number(
                      mov.valor
                    );
                }

              }
            );

            const rentabilidade =
              patrimonio > 0
                ? (
                    (lucro /
                      patrimonio) *
                    100
                  ).toFixed(2)
                : "0.00";

            return {
              ...investidor,
              patrimonio,
              lucro,
              rentabilidade,
            };

          }
        )
      );

    setInvestidores(
      investidoresComValores
    );
  }

  async function cadastrarInvestidor() {

    if (editandoId !== null) {

      const { error } =
        await supabase
          .from(
            "evpatrimonial_investidores"
          )
          .update({
            nome,
            email,
            senha,
            telefone,
          })
          .eq(
            "id",
            editandoId
          );

      if (error) {

        console.log(error);

        alert(
          "Erro ao atualizar"
        );

        return;
      }

      alert(
        "Investidor atualizado!"
      );

      setEditandoId(null);

    } else {

      const { error } =
        await supabase
          .from(
            "evpatrimonial_investidores"
          )
          .insert([
            {
              nome,
              email,
              senha,
              telefone,
            },
          ]);

      if (error) {

        console.log(error);

        alert(
          "Erro ao cadastrar"
        );

        return;
      }

      alert(
        "Investidor cadastrado!"
      );
    }

    setNome("");
    setEmail("");
    setSenha("");
    setTelefone("");

    carregarInvestidores();
  }

  function formatarValor(
    valor: number
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

  return (
    <main className="min-h-screen bg-[#F4F7FA] p-10">

      {/* CADASTRO */}

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 shadow-lg">

        <h1 className="mb-8 text-4xl font-bold text-[#0B1727]">
          Painel Admin
        </h1>

        <button
          onClick={() =>
            router.push(
              "/admin/movimentacoes"
            )
          }
          className="mb-6 rounded-lg bg-[#0B1727] px-5 py-3 text-white transition hover:opacity-90"
        >
          Ir para Movimentações
        </button>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) =>
              setNome(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <input
            type="text"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) =>
              setTelefone(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black"
          />

          <button
            onClick={
              cadastrarInvestidor
            }
            className="w-full rounded-lg bg-[#0B1727] p-4 text-white"
          >
            {editandoId
              ? "Atualizar Investidor"
              : "Cadastrar Investidor"}
          </button>

        </div>

      </div>

      {/* LISTA */}

      <div className="mx-auto mt-10 max-w-5xl rounded-2xl bg-white p-10 shadow-lg">

        <h2 className="mb-6 text-3xl font-bold text-[#0B1727]">
          Investidores Cadastrados
        </h2>

        <div className="space-y-4">

          {investidores.map(
            (investidor) => (

              <div
                key={investidor.id}
                className="rounded-xl border p-5"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-xl font-bold text-[#0B1727]">
                      {
                        investidor.nome
                      }
                    </h3>

                    <p className="text-gray-500">
                      {
                        investidor.email
                      }
                    </p>

                    <p className="text-gray-500">
                      {
                        investidor.telefone
                      }
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-gray-700">

                      <strong>
                        Patrimônio:
                      </strong>{" "}

                      R$ {
                        formatarValor(
                          investidor.patrimonio
                        )
                      }

                    </p>

                    <p className="text-gray-700">

                      <strong>
                        Lucro:
                      </strong>{" "}

                      R$ {
                        formatarValor(
                          investidor.lucro
                        )
                      }

                    </p>

                    <p className="text-gray-700">

                      <strong>
                        Rentabilidade:
                      </strong>{" "}

                      {
                        Number(
                          investidor.rentabilidade
                        ).toFixed(2)
                      }%

                    </p>

                  </div>

                </div>

                <div className="mt-4">

                  <button
                    onClick={() => {

                      setEditandoId(
                        investidor.id
                      );

                      setNome(
                        investidor.nome
                      );

                      setEmail(
                        investidor.email
                      );

                      setSenha(
                        investidor.senha
                      );

                      setTelefone(
                        investidor.telefone
                      );

                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                  >
                    Editar
                  </button>

                  <button
                    onClick={async () => {

                      const confirmar =
                        confirm(
                          "Deseja excluir este investidor?"
                        );

                      if (!confirmar)
                        return;

                      await supabase
                        .from(
                          "evpatrimonial_investidores"
                        )
                        .delete()
                        .eq(
                          "id",
                          investidor.id
                        );

                      carregarInvestidores();

                    }}
                    className="ml-3 rounded-lg bg-red-600 px-4 py-2 text-white"
                  >
                    Excluir
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </main>
  );
}