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

  const [novaSenha, setNovaSenha] =
    useState("");

  const [confirmarSenha, setConfirmarSenha] =
    useState("");  

  const [senhaAtual, setSenhaAtual] =
    useState("");

  const [telefone, setTelefone] =
    useState("");

  const [endereco, setEndereco] =
    useState("");

  const [chavePix, setChavePix] =
    useState("");

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

        const { data: investidorCompleto } =
  await supabase
    .from("evpatrimonial_investidores")
    .select("*")
    .eq("id", investidorParse.id)
    .single();

if (investidorCompleto) {

  setInvestidor(
    investidorCompleto
  );

  setTelefone(
    investidorCompleto.telefone || ""
  );

  setEndereco(
    investidorCompleto.endereco || ""
  );

  setChavePix(
    investidorCompleto.chave_pix || ""
  );

}

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

  async function salvarDados() {

  const { error } =
    await supabase
      .from(
        "evpatrimonial_investidores"
      )
      .update({
        telefone,
        endereco,
        chave_pix: chavePix,
      })
      .eq(
        "id",
        investidor.id
      );

  if (error) {

    alert(
      "Erro ao salvar dados"
    );

    return;

  }

  const investidorAtualizado = {
    ...investidor,
    telefone,
    endereco,
    chave_pix: chavePix,
  };

  setInvestidor(
    investidorAtualizado
  );

  localStorage.setItem(
    "investidor",
    JSON.stringify(
      investidorAtualizado
    )
  );

  alert(
    "Dados atualizados com sucesso!"
  );

}

  async function alterarSenha() {

  if (!senhaAtual) {

    alert(
      "Digite sua senha atual"
    );

    return;
  }

  if (!novaSenha) {

    alert(
      "Digite a nova senha"
    );

    return;
  }

  if (
    novaSenha !==
    confirmarSenha
  ) {

    alert(
      "As senhas não conferem"
    );

    return;
  }

  const response =
    await fetch(
      "/api/alterar-senha",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          investidorId:
            investidor.id,
          senhaAtual,
          novaSenha,
        }),
      }
    );

  const resultado =
    await response.json();

  if (!resultado.sucesso) {

    alert(
      resultado.erro
    );

    return;
  }

  setSenhaAtual("");
  setNovaSenha("");
  setConfirmarSenha("");

  alert(
    "Senha alterada com sucesso!"
  );

}

  function sair() {

    localStorage.removeItem(
      "investidor"
    );

    router.push("/");
  }

  if (!investidor) return null;

  return (
    <main className="min-h-screen bg-[#F4F7FA] p-4 md:p-8">

      <div className="mx-auto max-w-4xl">

        {/* TOPO */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-2xl md:text-4xl font-bold text-[#0B1727]">
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

       <div className="rounded-2xl bg-white p-4 md:p-10 shadow-lg">

          <div className="mb-10 flex flex-col items-center text-center gap-5 md:flex-row md:text-left">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0B1727] text-white">

              <User size={40} />

            </div>

            <div>

              <h2 className="text-2xl md:text-3xl font-bold text-[#0B1727]">
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

            <div className="rounded-xl border border-gray-200 p-5">
  <p className="mb-2 font-semibold text-[#0B1727]">
    Data de Nascimento
  </p>

  <p className="text-gray-600">
    {
  investidor.data_nascimento
    ? new Date(
        investidor.data_nascimento
      ).toLocaleDateString("pt-BR")
    : "Não informado"
}
  </p>
</div>

<div className="rounded-xl border border-gray-200 p-5">
  <p className="mb-2 font-semibold text-[#0B1727]">
    RG
  </p>

  <p className="text-gray-600">
    {investidor.rg || "Não informado"}
  </p>
</div>

<div className="rounded-xl border border-gray-200 p-5">
  <p className="mb-2 font-semibold text-[#0B1727]">
    CPF
  </p>

  <p className="text-gray-600">
    {investidor.cpf || "Não informado"}
  </p>
</div>

<div className="rounded-xl border border-gray-200 p-5">
  <p className="mb-2 font-semibold text-[#0B1727]">
    Endereço
  </p>

  <p className="text-gray-600">
    {investidor.endereco || "Não informado"}
  </p>
</div>

<div className="rounded-xl border border-gray-200 p-5">
  <p className="mb-2 font-semibold text-[#0B1727]">
    Chave PIX
  </p>

  <p className="text-gray-600">
    {investidor.chave_pix || "Não informado"}
  </p>
</div>

<div className="rounded-xl border border-gray-200 p-5">
  <p className="mb-2 font-semibold text-[#0B1727]">
    Corretor
  </p>

  <p className="text-gray-600">
    {investidor.corretor || "Não informado"}
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

              <p className="text-2xl md:text-3xl font-bold text-green-600 break-words">

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

<div className="mt-8 rounded-xl border border-gray-200 p-5">

  <h3 className="mb-5 text-xl font-bold text-[#0B1727]">
    Atualizar Dados
  </h3>

  <div className="space-y-4">

    <label className="block font-medium text-gray-700">
      Telefone
    </label>

    <input
      type="text"
      value={telefone}
      onChange={(e) =>
        setTelefone(e.target.value)
      }
      className="w-full rounded-lg border border-gray-300 p-3 text-black"
    />

    <label className="block font-medium text-gray-700">
      Endereço
    </label>

    <input
      type="text"
      value={endereco}
      onChange={(e) =>
        setEndereco(e.target.value)
      }
      className="w-full rounded-lg border border-gray-300 p-3 text-black"
    />

    <label className="block font-medium text-gray-700">
      Chave PIX
    </label>

    <input
      type="text"
      value={chavePix}
      onChange={(e) =>
        setChavePix(e.target.value)
      }
      className="w-full rounded-lg border border-gray-300 p-3 text-black"
    />

    <button
      onClick={salvarDados}
      className="w-full rounded-lg bg-green-600 p-4 text-white transition hover:bg-green-700"
    >
      Salvar Dados
    </button>

  </div>

</div>

<div className="mt-8 rounded-xl border border-gray-200 p-5">

  <h3 className="mb-5 text-xl font-bold text-[#0B1727]">
    Alterar Senha
  </h3>

  <div className="space-y-4">

    <input
      type="password"
      placeholder="Senha Atual"
      value={senhaAtual}
      onChange={(e) =>
        setSenhaAtual(e.target.value)
      }
      className="w-full rounded-lg border border-gray-300 p-3 text-black"
    />

    <input
      type="password"
      placeholder="Nova Senha"
      value={novaSenha}
      onChange={(e) =>
        setNovaSenha(e.target.value)
      }
      className="w-full rounded-lg border border-gray-300 p-3 text-black"
    />

    <input
      type="password"
      placeholder="Confirmar Nova Senha"
      value={confirmarSenha}
      onChange={(e) =>
        setConfirmarSenha(e.target.value)
      }
      className="w-full rounded-lg border border-gray-300 p-3 text-black"
    />

    <button
      onClick={alterarSenha}
      className="w-full rounded-lg bg-[#0B1727] p-4 text-white"
    >
      Alterar Senha
    </button>

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