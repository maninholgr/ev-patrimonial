"use client";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabase";

import bcrypt from "bcryptjs";

export default function Admin() {

  const SITE_BLOQUEADO = true;  

  const router = useRouter();

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [telefone, setTelefone] =
    useState("");

  const [dataNascimento, setDataNascimento] =
  useState("");

const [rg, setRg] =
  useState("");

const [cpf, setCpf] =
  useState("");

const [endereco, setEndereco] =
  useState("");

const [chavePix, setChavePix] =
  useState("");

const [corretor, setCorretor] =
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

if (!admin) {

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

            if (!movimentacoes) return;

movimentacoes.forEach((mov) => {

  if (
    mov.tipo === "aporte" ||
    mov.tipo === "rendimento" ||
    mov.tipo === "bonus"
  ) {

    patrimonio += Number(mov.valor);

  }

  if (
    mov.tipo === "saque" ||
    mov.tipo === "taxa"
  ) {

    patrimonio -= Number(mov.valor);

  }

});

            let rentabilidade = "0.00";

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

    rentabilidade =
      match[1].replace(
        ",",
        "."
      );

  }


console.log("Último rendimento:", ultimoRendimento);
console.log("Rentabilidade:", rentabilidade);

}

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
  data_nascimento: dataNascimento,
  rg,
  cpf,
  endereco: endereco,
  chave_pix: chavePix,
  corretor,
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
      
      const senhaHash =
        await bcrypt.hash(
          senha,
          10
        );
   
      const { error } =
        await supabase
          .from(
            "evpatrimonial_investidores"
          )
          .insert([
  {
    nome,
    email,
    senha: senhaHash,
    telefone,
    data_nascimento: dataNascimento,
    rg,
    cpf,
    endereco,
    chave_pix: chavePix,
    corretor,
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
    setDataNascimento("");
setRg("");
setCpf("");
setEndereco("");
setChavePix("");
setCorretor("");

    carregarInvestidores();
  }

  async function resetarSenha(
  investidorId: string
) {

  const confirmar =
    confirm(
      "Deseja resetar a senha deste investidor?"
    );

  if (!confirmar)
    return;

  const numeros =
    Math.floor(
      1000 +
      Math.random() * 9000
    );

  const novaSenha =
    `Gold${numeros}@`;

  const senhaHash =
    await bcrypt.hash(
      novaSenha,
      10
    );

  const { error } =
    await supabase
      .from(
        "evpatrimonial_investidores"
      )
      .update({
        senha: senhaHash,
      })
      .eq(
        "id",
        investidorId
      );

  if (error) {

    alert(
      "Erro ao resetar senha"
    );

    return;

  }

  alert(
    `Nova senha: ${novaSenha}`
  );

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

  if (SITE_BLOQUEADO) {
  return (
    <main className="min-h-screen bg-[#F4F7FA] flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 md:p-12 text-center shadow-xl">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <span className="text-4xl">🔒</span>
        </div>

        <h1 className="mb-4 text-2xl md:text-3xl font-bold text-[#0B1727]">
          Sistema temporariamente indisponível
        </h1>

        <p className="mb-8 text-gray-600 leading-relaxed">
          No momento, o sistema administrativo está temporariamente
          indisponível.
        </p>

        <div className="rounded-2xl bg-[#F4F7FA] p-6">
          <p className="mb-2 text-sm text-gray-500">
            Para mais informações, entre em contato com:
          </p>

          <p className="text-xl font-bold text-[#0B1727]">
            Luciano Goularte
          </p>

          <p className="mt-2 text-lg text-gray-700">
            📱 (53) 99928-5822
          </p>
        </div>

        <a
          href="https://wa.me/5553999285822"
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

return (
  <main className="min-h-screen bg-[#F4F7FA] p-4 md:p-10">

      {/* CADASTRO */}

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-4 md:p-10 shadow-lg">

        <h1 className="mb-6 text-2xl md:text-4xl font-bold text-[#0B1727]">
          Painel Admin
        </h1>

        <div className="mb-6 flex flex-col gap-3 md:flex-row">

    <button
    onClick={() =>
      router.push(
        "/admin/perfil"
      )
    }
    className="rounded-lg bg-green-600 px-5 py-3 text-white transition hover:bg-green-700"
  >
    Perfil Admin
  </button>

  <button
    onClick={() =>
      router.push(
        "/admin/movimentacoes"
      )
    }
    className="rounded-lg bg-[#0B1727] px-5 py-3 text-white transition hover:opacity-90"
  >
    Ir para Movimentações
  </button>

  <button
    onClick={() => {

      localStorage.removeItem(
        "admin"
      );

      router.push(
        "/admin/login"
      );

    }}
    className="rounded-lg bg-red-500 px-5 py-3 text-white transition hover:bg-red-600"
  >
    Sair
  </button>

</div>

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

          <input
  type="date"
  value={dataNascimento}
  onChange={(e) =>
    setDataNascimento(e.target.value)
  }
  className="w-full rounded-lg border border-gray-300 p-3 text-black"
/>

<input
  type="text"
  placeholder="RG"
  value={rg}
  onChange={(e) =>
    setRg(e.target.value)
  }
  className="w-full rounded-lg border border-gray-300 p-3 text-black"
/>

<input
  type="text"
  placeholder="CPF"
  value={cpf}
  onChange={(e) =>
    setCpf(e.target.value)
  }
  className="w-full rounded-lg border border-gray-300 p-3 text-black"
/>

<input
  type="text"
  placeholder="Endereço"
  value={endereco}
  onChange={(e) =>
    setEndereco(e.target.value)
  }
  className="w-full rounded-lg border border-gray-300 p-3 text-black"
/>

<input
  type="text"
  placeholder="Chave PIX"
  value={chavePix}
  onChange={(e) =>
    setChavePix(e.target.value)
  }
  className="w-full rounded-lg border border-gray-300 p-3 text-black"
/>

<input
  type="text"
  placeholder="Corretor"
  value={corretor}
  onChange={(e) =>
    setCorretor(e.target.value)
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

      <div className="mx-auto mt-10 max-w-5xl rounded-2xl bg-white p-4 md:p-10 shadow-lg">

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

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

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

                  <div className="text-left md:text-right">

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

                <div className="mt-4 flex flex-col gap-3 md:flex-row">

  <button
    onClick={() => {
      setEditandoId(investidor.id);

      setNome(investidor.nome);
      setEmail(investidor.email);
      setSenha("");
      setTelefone(investidor.telefone);

      setDataNascimento(
        investidor.data_nascimento || ""
      );

      setRg(
        investidor.rg || ""
      );

      setCpf(
        investidor.cpf || ""
      );

      setEndereco(
        investidor.endereco || ""
      );

      setChavePix(
        investidor.chave_pix || ""
      );

      setCorretor(
        investidor.corretor || ""
      );
    }}
    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
  >
    Editar
  </button>

  <button
    onClick={() =>
      router.push(
        `/admin/cliente/${investidor.id}`
      )
    }
    className="rounded-lg bg-green-600 px-4 py-2 text-white"
  >
    Ver Cliente
  </button>

  <button
    onClick={() =>
      router.push(
        `/admin/movimentacoes/${investidor.id}`
      )
    }
    className="rounded-lg bg-yellow-600 px-4 py-2 text-white"
  >
    Movimentações
  </button>
  
  <button
  onClick={() =>
    resetarSenha(
      investidor.id
    )
  }
  className="rounded-lg bg-orange-600 px-4 py-2 text-white"
>
  Resetar Senha
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
    className="rounded-lg bg-red-600 px-4 py-2 text-white"
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