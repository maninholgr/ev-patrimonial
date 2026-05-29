"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Headset,
  MessageCircle,
  Mail,
  Clock,
} from "lucide-react";

export default function Suporte() {

  const router = useRouter();

  return (

    <main className="min-h-screen bg-[#F4F7FA] p-8">

      <div className="mx-auto max-w-5xl">

        {/* TOPO */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-[#0B1727]">
              Suporte
            </h1>

            <p className="mt-2 text-gray-500">
              Entre em contato com nossa equipe
            </p>

          </div>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="flex items-center gap-2 rounded-lg bg-[#0B1727] px-5 py-3 text-white transition hover:opacity-90"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

        </div>

        {/* CARD PRINCIPAL */}

        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <div className="mb-8 flex items-center gap-4">

            <div className="rounded-full bg-green-100 p-4">

              <Headset
                size={40}
                className="text-green-600"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-[#0B1727]">
                Central de Atendimento
              </h2>

              <p className="text-gray-500">
                Estamos disponíveis para ajudar você.
              </p>

            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {/* WHATSAPP */}

            <div className="rounded-xl border border-gray-200 p-6">

              <MessageCircle
                size={30}
                className="mb-4 text-green-600"
              />

              <h3 className="mb-2 text-xl font-bold text-[#0B1727]">
                WhatsApp
              </h3>

              <p className="mb-4 text-gray-600">
                (11) 94746-3377
              </p>

              <a
                href="https://wa.me/5511947463377"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-green-600 px-5 py-3 text-white transition hover:bg-green-700"
              >
                Falar no WhatsApp
              </a>

            </div>

            {/* EMAIL */}

            <div className="rounded-xl border border-gray-200 p-6">

              <Mail
                size={30}
                className="mb-4 text-blue-600"
              />

              <h3 className="mb-2 text-xl font-bold text-[#0B1727]">
                E-mail
              </h3>

              <p className="text-gray-600">
                suporte@evinvestimentos.com.br
              </p>

            </div>

            {/* HORÁRIO */}

            <div className="rounded-xl border border-gray-200 p-6">

              <Clock
                size={30}
                className="mb-4 text-orange-500"
              />

              <h3 className="mb-2 text-xl font-bold text-[#0B1727]">
                Atendimento
              </h3>

              <p className="text-gray-600">
                Segunda à Sexta
              </p>

              <p className="text-gray-600">
                08:00 às 18:00
              </p>

            </div>

          </div>

        </div>

        {/* FAQ */}

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">

          <h2 className="mb-6 text-2xl font-bold text-[#0B1727]">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">

            <div>

              <h3 className="font-bold text-[#0B1727]">
                Como acompanho meus rendimentos?
              </h3>

              <p className="mt-2 text-gray-600">
                Todos os rendimentos ficam disponíveis
                na área Dashboard e Relatórios.
              </p>

            </div>

            <div>

              <h3 className="font-bold text-[#0B1727]">
                Como solicitar um saque?
              </h3>

              <p className="mt-2 text-gray-600">
                Entre em contato pelo WhatsApp para
                receber orientações.
              </p>

            </div>

            <div>

              <h3 className="font-bold text-[#0B1727]">
                Quando os rendimentos são atualizados?
              </h3>

              <p className="mt-2 text-gray-600">
                Sempre que houver uma nova movimentação
                registrada pela administração.
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>

  );

}