import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function enviarEmailInscricao(dados: Record<string, unknown>) {
  const nome = String(dados.nome ?? '')
  const email = String(dados.email ?? '')
  const telefone = String(dados.telefone ?? '')
  const curso = String(dados.curso_interesse ?? '')
  const turma = dados.turma_info ? String(dados.turma_info) : null
  const modalidade = String(dados.modalidade ?? '')
  const dataNasc = dados.data_nascimento ? String(dados.data_nascimento) : null
  const nif = dados.nif ? String(dados.nif) : null
  const documento = dados.documento_id ? String(dados.documento_id) : null
  const nacionalidade = dados.nacionalidade ? String(dados.nacionalidade) : null
  const sexo = dados.sexo ? String(dados.sexo) : null
  const endereco = dados.endereco ? String(dados.endereco) : null
  const profissao = dados.profissao ? String(dados.profissao) : null
  const instituicao = dados.instituicao ? String(dados.instituicao) : null
  const escolaridade = dados.nivel_escolaridade ? String(dados.nivel_escolaridade) : null
  const expAph = dados.experiencia_aph ? String(dados.experiencia_aph) : null
  const expAphDesc = dados.experiencia_aph_descricao ? String(dados.experiencia_aph_descricao) : null
  const cert = dados.certificacoes_anteriores ? String(dados.certificacoes_anteriores) : null
  const certInfo = dados.certificacoes_anteriores_info ? String(dados.certificacoes_anteriores_info) : null
  const competencias = dados.competencias ? String(dados.competencias) : null
  const dataInicio = dados.data_inicio_prevista ? String(dados.data_inicio_prevista) : null
  const dataFim = dados.data_fim_prevista ? String(dados.data_fim_prevista) : null
  const localForm = dados.local_formacao ? String(dados.local_formacao) : null

  const linha = (label: string, valor: string | null) =>
    valor ? `<tr><td style="padding:6px 12px;color:#5a6a85;font-size:0.85rem;width:200px;vertical-align:top">${label}</td><td style="padding:6px 12px;font-weight:600">${valor}</td></tr>` : ''

  const secao = (titulo: string, linhas: string) => `
    <tr><td colspan="2" style="padding:16px 12px 4px;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#124E7C;border-top:2px solid #e0e7ef">${titulo}</td></tr>
    ${linhas}
  `

  const html = `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.08)">

    <div style="background:#124E7C;padding:28px 32px">
      <h1 style="margin:0;color:#fff;font-size:1.3rem">Nova Inscrição Recebida</h1>
      <p style="margin:6px 0 0;color:#a8c8e8;font-size:0.9rem">AISAPH-CV — Ficha de Inscrição do site</p>
    </div>

    <div style="padding:24px 32px">
      <table style="width:100%;border-collapse:collapse">
        ${secao('Dados Pessoais', `
          ${linha('Nome', nome)}
          ${linha('Email', email)}
          ${linha('Telefone', telefone)}
          ${linha('Data de nascimento', dataNasc)}
          ${linha('Sexo', sexo)}
          ${linha('Nacionalidade', nacionalidade)}
          ${linha('CNI / Passaporte', documento)}
          ${linha('NIF', nif)}
          ${linha('Endereço', endereco)}
          ${linha('Profissão', profissao)}
          ${linha('Instituição', instituicao)}
        `)}
        ${secao('Curso', `
          ${linha('Curso pretendido', curso)}
          ${linha('Turma', turma)}
          ${linha('Modalidade', modalidade)}
          ${linha('Local da formação', localForm)}
          ${linha('Data início prevista', dataInicio)}
          ${linha('Data fim prevista', dataFim)}
        `)}
        ${secao('Educação & Competências', `
          ${linha('Nível de escolaridade', escolaridade)}
          ${linha('Experiência em APH', expAph)}
          ${linha('Descrição experiência', expAphDesc)}
          ${linha('Certificações anteriores', cert)}
          ${linha('Quais certificações', certInfo)}
          ${linha('Competências', competencias)}
        `)}
      </table>
    </div>

    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e0e7ef">
      <p style="margin:0;font-size:0.8rem;color:#94a3b8">
        Esta mensagem foi gerada automaticamente pelo site aisaph.com. Não responda a este email.
      </p>
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? 'AISAPH-CV <info@aisaph.com>',
    to: 'matriculas@aisaph.com',
    replyTo: email,
    subject: `Nova inscrição — ${nome} — ${curso}`,
    html,
  })
}

export async function enviarEmailConfirmacao(dados: Record<string, unknown>) {
  const nome = String(dados.nome ?? '')
  const email = String(dados.email ?? '')
  const telefone = String(dados.telefone ?? '')
  const curso = String(dados.curso_interesse ?? '')
  const turma = dados.turma_info ? String(dados.turma_info) : null
  const modalidade = dados.modalidade ? String(dados.modalidade) : null

  const modalidadeLabel: Record<string, string> = {
    presencial: 'Presencial',
    semi_presencial: 'Semi Presencial',
    online: 'Online',
  }

  const html = `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.08)">

    <!-- Cabeçalho -->
    <div style="background:#124E7C;padding:32px;text-align:center">
      <p style="margin:0 0 8px;color:#a8c8e8;font-size:0.8rem;letter-spacing:2px;text-transform:uppercase">Academia Internacional de Socorrismo</p>
      <h1 style="margin:0;color:#fff;font-size:1.5rem;font-weight:700">AISAPH-CV</h1>
      <p style="margin:8px 0 0;color:#a8c8e8;font-size:0.85rem">Atendimento Pré-Hospitalar de Cabo Verde</p>
    </div>

    <!-- Mensagem principal -->
    <div style="padding:36px 32px">
      <p style="margin:0 0 8px;color:#124E7C;font-size:1rem;font-weight:700">Olá, ${nome}!</p>
      <p style="margin:0 0 24px;color:#5a6a85;font-size:0.95rem;line-height:1.7">
        A sua inscrição foi recebida com sucesso. Obrigado pelo interesse em formação com a AISAPH-CV.
      </p>

      <!-- Resumo da inscrição -->
      <div style="background:#f0f7ff;border-radius:8px;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#124E7C">Resumo da sua inscrição</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:5px 0;color:#94a3b8;font-size:0.85rem;width:130px">Curso</td>
            <td style="padding:5px 0;font-weight:600;color:#1a2a3a;font-size:0.9rem">${curso}</td>
          </tr>
          ${turma ? `<tr><td style="padding:5px 0;color:#94a3b8;font-size:0.85rem">Turma</td><td style="padding:5px 0;font-weight:600;color:#1a2a3a;font-size:0.9rem">${turma}</td></tr>` : ''}
          ${modalidade ? `<tr><td style="padding:5px 0;color:#94a3b8;font-size:0.85rem">Modalidade</td><td style="padding:5px 0;font-weight:600;color:#1a2a3a;font-size:0.9rem">${modalidadeLabel[modalidade] ?? modalidade}</td></tr>` : ''}
          <tr>
            <td style="padding:5px 0;color:#94a3b8;font-size:0.85rem">Contacto</td>
            <td style="padding:5px 0;font-weight:600;color:#1a2a3a;font-size:0.9rem">${telefone}</td>
          </tr>
        </table>
      </div>

      <!-- Próximos passos -->
      <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#124E7C">O que acontece a seguir?</p>
      <p style="margin:0 0 24px;color:#5a6a85;font-size:0.9rem;line-height:1.7">
        A nossa equipa irá analisar a sua ficha e entrar em contacto pelo número <strong style="color:#1a2a3a">${telefone}</strong> para confirmar a inscrição e informar sobre o pagamento e datas.
      </p>

      <p style="margin:0;color:#5a6a85;font-size:0.85rem">
        Dúvidas? Escreva para <a href="mailto:matriculas@aisaph.com" style="color:#124E7C;font-weight:600">matriculas@aisaph.com</a>
      </p>
    </div>

    <!-- Rodapé -->
    <div style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e0e7ef;text-align:center">
      <p style="margin:0;font-size:0.8rem;color:#94a3b8">
        Esta mensagem foi gerada automaticamente — por favor não responda directamente a este email.
      </p>
    </div>

  </div>
</body>
</html>`

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? 'AISAPH-CV <info@aisaph.com>',
    to: email,
    subject: `Inscrição recebida — ${curso} | AISAPH-CV`,
    html,
  })
}
