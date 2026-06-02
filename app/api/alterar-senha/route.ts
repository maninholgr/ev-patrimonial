import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
  request: Request
) {

  try {

    const {
  investidorId,
  senhaAtual,
  novaSenha,
} = await request.json();

const {
  data: investidor,
} = await supabase
  .from(
    "evpatrimonial_investidores"
  )
  .select("*")
  .eq(
    "id",
    investidorId
  )
  .single();

if (!investidor) {

  return NextResponse.json(
    {
      sucesso: false,
      erro:
        "Investidor não encontrado",
    },
    {
      status: 404,
    }
  );

}

const senhaCorreta =
  await bcrypt.compare(
    senhaAtual,
    investidor.senha
  );

if (!senhaCorreta) {

  return NextResponse.json(
    {
      sucesso: false,
      erro:
        "Senha atual incorreta",
    },
    {
      status: 401,
    }
  );

}

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

      return NextResponse.json(
        {
          sucesso: false,
          erro: error.message,
        },
        {
          status: 500,
        }
      );

    }

    return NextResponse.json({
      sucesso: true,
    });

  } catch (error) {

    return NextResponse.json(
      {
        sucesso: false,
        erro: String(error),
      },
      {
        status: 500,
      }
    );

  }

}