"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Admin() {

  const router = useRouter();  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] =
  useState("");
  const [valorInvestido, setValorInvestido] = useState("");
  const [lucroMensal, setLucroMensal] = useState("");
  const [rentabilidade, setRentabilidade] = useState("");

  const [investidores, setInvestidores] = useState<any[]>([]);

  const [investidorId, setInvestidorId] = useState("");

  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  const [valor, setValor] = useState("");
  const [
    rentabilidadeRendimento,
    setRentabilidadeRendimento,
  ] = useState("");

  const [editandoId, setEditandoId] =
    useState<string | null>(null);

  useEffect(() => {

  const admin =
    localStorage.getItem("admin");

  if (admin !== "logado") {

    router.push(
      "/admin/login"
    );

    return;
  }
    carregarInvestidores();
  }, []);

  async function carregarInvestidores() {

    const { data, error } = await supabase
      .from("evpatrimonial_investidores")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setInvestidores(data || []);
  }

  async function cadastrarRendimento() {

    const { error } = await supabase
      .from("evpatrimonial_rendimentos")
      .insert([
        {
          investidor_id: investidorId,
          mes,
          ano,
          valor,
          rentabilidade:
            rentabilidadeRendimento,
        },
      ]);

    if (error) {
      console.log(error);
      alert("Erro ao cadastrar rendimento");
      return;
    }

    await supabase
  .from(
    "evpatrimonial_movimentacoes"
  )
  .insert([
    {
      investidor_id:
        investidorId,

      tipo: "rendimento",

      valor,

      descricao:
        `Rendimento ${mes}/${ano}`,
    },
  ]);

    alert("Rendimento cadastrado!");

    setInvestidorId("");

    setMes("");
    setAno("");

    setValor("");
    setRentabilidadeRendimento("");
  }

  async function cadastrarInvestidor() {

    if (editandoId !== null) {

      const { error } = await supabase
        .from("evpatrimonial_investidores")
        .update({
          nome,
          email,
          senha,
          telefone,
          valor_investido:
            valorInvestido,
          lucro_mensal:
            lucroMensal,
          rentabilidade,
        })
        .eq("id", editandoId);

      if (error) {
        console.log(error);
        alert("Erro ao atualizar");
        return;
      }

      alert("Investidor atualizado!");

      setEditandoId(null);

    } else {

      const { error } = await supabase
        .from("evpatrimonial_investidores")
        .insert([
          {
            nome,
            email,
            senha,
            telefone,
            valor_investido:
              valorInvestido,
            lucro_mensal:
              lucroMensal,
            rentabilidade,
          },
        ]);

      if (error) {
        console.log(error);
        alert("Erro ao cadastrar");
        return;
      }

      alert("Investidor cadastrado!");
    }

    setNome("");
    setEmail("");
    setSenha("");
    setTelefone("");
    setValorInvestido("");
    setLucroMensal("");
    setRentabilidade("");

    carregarInvestidores();
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA] p-10">

      {/* CADASTRO INVESTIDOR */}
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
              setNome(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-500"
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-500"
          />

          <input
            type="text"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-500"
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
  className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-500"
/>

          <input
            type="number"
            placeholder="Valor Investido"
            value={valorInvestido}
            onChange={(e) =>
              setValorInvestido(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-500"
          />

          <input
            type="number"
            placeholder="Lucro Mensal"
            value={lucroMensal}
            onChange={(e) =>
              setLucroMensal(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-500"
          />

          <input
            type="number"
            placeholder="Rentabilidade"
            value={rentabilidade}
            onChange={(e) =>
              setRentabilidade(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-500"
          />

          <button
            onClick={cadastrarInvestidor}
            className="w-full rounded-lg bg-[#0B1727] p-4 text-white"
          >
            {editandoId
              ? "Atualizar Investidor"
              : "Cadastrar Investidor"}
          </button>

        </div>
      </div>

      {/* LISTA INVESTIDORES */}
      <div className="mx-auto mt-10 max-w-5xl rounded-2xl bg-white p-10 shadow-lg">

        <h2 className="mb-6 text-3xl font-bold text-[#0B1727]">
          Investidores Cadastrados
        </h2>

        <div className="space-y-4">

          {investidores.map((investidor) => (

            <div
              key={investidor.id}
              className="rounded-xl border p-5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-bold text-[#0B1727]">
                    {investidor.nome}
                  </h3>

                  <p className="text-gray-500">
  {investidor.email}
</p>

<p className="text-gray-500">
  {investidor.telefone}
</p>

                </div>

                <div className="text-right">

                  <p className="text-gray-700">
                    <strong>Patrimônio:</strong>{" "}
                    R$ {
                      investidor.valor_investido
                    }
                  </p>

                  <p className="text-gray-700">
                    <strong>Lucro:</strong>{" "}
                    R$ {
                      investidor.lucro_mensal
                    }
                  </p>

                  <p className="text-gray-700">
                    <strong>Rentabilidade:</strong>{" "}
                    {
                      investidor.rentabilidade
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

                    setValorInvestido(
                      investidor.valor_investido
                    );

                    setLucroMensal(
                      investidor.lucro_mensal
                    );

                    setRentabilidade(
                      investidor.rentabilidade
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

                    if (!confirmar) return;

                    const { error } =
                      await supabase
                        .from(
                          "evpatrimonial_investidores"
                        )
                        .delete()
                        .eq(
                          "id",
                          investidor.id
                        );

                    if (error) {
                      console.log(error);
                      alert(
                        "Erro ao excluir"
                      );
                      return;
                    }

                    alert(
                      "Investidor excluído!"
                    );

                    carregarInvestidores();
                  }}
                  className="ml-3 rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Excluir
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* CADASTRO RENDIMENTOS */}
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-10 shadow-lg">

        <h2 className="mb-6 text-3xl font-bold text-[#0B1727]">
          Cadastrar Rendimentos
        </h2>

        <div className="space-y-5">

          <div>

  <label className="mb-2 block font-medium text-gray-700">
    Investidor
  </label>

  <select
    value={investidorId}
    onChange={(e) =>
      setInvestidorId(
        e.target.value
      )
    }
    className="w-full rounded-lg border border-gray-300 p-3 text-black outline-none focus:border-[#0B1727]"
  >

    <option value="">
      Selecione o investidor
    </option>

    {investidores.map(
      (investidor) => (

        <option
          key={investidor.id}
          value={investidor.id}
        >
          {investidor.nome}
        </option>

      )
    )}

  </select>

</div>

          <label className="mb-2 block font-medium text-gray-700">
    Mês
  </label>

  <input
    type="text"
    placeholder="Ex: Junho"
    value={mes}
    onChange={(e) =>
      setMes(e.target.value)
    }
    className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-400 outline-none focus:border-[#0B1727]"
  />

          <label className="mb-2 block font-medium text-gray-700">
    Ano
  </label>

  <input
    type="number"
    placeholder="Ex: 2026"
    value={ano}
    onChange={(e) =>
      setAno(e.target.value)
    }
    className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-400 outline-none focus:border-[#0B1727]"
  />

          <label className="mb-2 block font-medium text-gray-700">
    Valor do Rendimento
  </label>

  <input
    type="number"
    placeholder="Ex: 300"
    value={valor}
    onChange={(e) =>
      setValor(e.target.value)
    }
    className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-400 outline-none focus:border-[#0B1727]"
  />


           <label className="mb-2 block font-medium text-gray-700">
    Rentabilidade (%)
  </label>

  <input
    type="number"
    placeholder="Ex: 3"
    value={rentabilidadeRendimento}
    onChange={(e) =>
      setRentabilidadeRendimento(
        e.target.value
      )
    }
    className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder:text-gray-400 outline-none focus:border-[#0B1727]"
  />


          <button
            onClick={
              cadastrarRendimento
            }
            className="w-full rounded-lg bg-green-600 p-4 text-white"
          >
            Salvar Rendimento
          </button>

        </div>

      </div>

    </main>
  );
}