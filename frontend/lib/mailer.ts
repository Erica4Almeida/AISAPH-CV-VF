import nodemailer from 'nodemailer'
import PDFDocument from 'pdfkit'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const AZUL = '#124E7C'
const CINZA = '#5a6a85'

/* ── utilitários ────────────────────────────────────────────── */
function str(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—'
  return String(v)
}

const modalidadeLabel: Record<string, string> = {
  presencial: 'Presencial', semi_presencial: 'Semi Presencial', online: 'Online',
}
const escolaridadeLabel: Record<string, string> = {
  basico: 'Ensino Básico', secundario: 'Ensino Secundário',
  tecnico: 'Ensino Técnico/Profissional', superior: 'Ensino Superior', outro: 'Outro',
}
const sexoLabel: Record<string, string> = { feminino: 'Feminino', masculino: 'Masculino' }
const simNao: Record<string, string> = { sim: 'Sim', nao: 'Não' }

/* ── gerar PDF ──────────────────────────────────────────────── */
function gerarPdfInscricao(d: Record<string, unknown>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const chunks: Buffer[] = []
    doc.on('data', c => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const W = doc.page.width - 100 // largura útil

    /* cabeçalho */
    doc.rect(50, 40, W, 60).fill(AZUL)
    doc.fillColor('#fff').fontSize(16).font('Helvetica-Bold')
      .text('AISAPH-CV', 50, 52, { width: W, align: 'center' })
    doc.fillColor('#a8c8e8').fontSize(8).font('Helvetica')
      .text('Academia Internacional de Socorrismo e Atendimento Pré-Hospitalar de Cabo Verde', 50, 74, { width: W, align: 'center' })

    doc.fillColor('#000').fontSize(13).font('Helvetica-Bold')
      .text('FICHA DE INSCRIÇÃO', 50, 115, { width: W, align: 'center' })

    doc.moveTo(50, 135).lineTo(50 + W, 135).strokeColor('#e0e7ef').stroke()

    let y = 148

    function secao(titulo: string) {
      doc.rect(50, y, W, 20).fill(AZUL)
      doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold')
        .text(titulo.toUpperCase(), 58, y + 6)
      doc.fillColor('#000')
      y += 26
    }

    function campo(label: string, valor: string, meio = false) {
      const largura = meio ? W / 2 - 4 : W
      doc.fillColor(CINZA).fontSize(8).font('Helvetica')
        .text(label, 50, y)
      doc.fillColor('#1a2a3a').fontSize(9.5).font('Helvetica-Bold')
        .text(valor, 50, y + 10, { width: largura })
      doc.moveTo(50, y + 22).lineTo(50 + largura, y + 22).strokeColor('#e0e7ef').lineWidth(0.5).stroke()
      if (!meio) y += 28
    }

    function camposDuplos(l1: string, v1: string, l2: string, v2: string) {
      const half = W / 2 - 4
      doc.fillColor(CINZA).fontSize(8).font('Helvetica').text(l1, 50, y)
      doc.fillColor('#1a2a3a').fontSize(9.5).font('Helvetica-Bold').text(v1, 50, y + 10, { width: half })
      doc.moveTo(50, y + 22).lineTo(50 + half, y + 22).strokeColor('#e0e7ef').lineWidth(0.5).stroke()

      doc.fillColor(CINZA).fontSize(8).font('Helvetica').text(l2, 50 + half + 8, y)
      doc.fillColor('#1a2a3a').fontSize(9.5).font('Helvetica-Bold').text(v2, 50 + half + 8, y + 10, { width: half })
      doc.moveTo(50 + half + 8, y + 22).lineTo(50 + W, y + 22).strokeColor('#e0e7ef').lineWidth(0.5).stroke()
      y += 28
    }

    /* dados pessoais */
    secao('Dados Pessoais')
    campo('Nome completo', str(d.nome))
    camposDuplos('Email', str(d.email), 'Telefone / WhatsApp', str(d.telefone))
    camposDuplos('Data de nascimento', str(d.data_nascimento), 'Sexo', sexoLabel[str(d.sexo)] ?? str(d.sexo))
    camposDuplos('CNI / Passaporte', str(d.documento_id), 'NIF', str(d.nif))
    camposDuplos('Nacionalidade', str(d.nacionalidade), 'Profissão', str(d.profissao))
    campo('Endereço', str(d.endereco))
    campo('Instituição / Organização', str(d.instituicao))

    y += 4
    /* curso */
    secao('Informações sobre o Curso')
    campo('Curso pretendido', str(d.curso_interesse))
    camposDuplos('Turma', str(d.turma_info), 'Modalidade', modalidadeLabel[str(d.modalidade)] ?? str(d.modalidade))
    camposDuplos('Local da formação', str(d.local_formacao), '', '')
    camposDuplos('Data início prevista', str(d.data_inicio_prevista), 'Data fim prevista', str(d.data_fim_prevista))

    y += 4
    /* educação */
    secao('Educação & Competências')
    campo('Nível de escolaridade', escolaridadeLabel[str(d.nivel_escolaridade)] ?? str(d.nivel_escolaridade))
    camposDuplos('Experiência em APH', simNao[str(d.experiencia_aph)] ?? str(d.experiencia_aph), 'Certificações anteriores', simNao[str(d.certificacoes_anteriores)] ?? str(d.certificacoes_anteriores))
    if (d.experiencia_aph_descricao) campo('Descrição experiência APH', str(d.experiencia_aph_descricao))
    if (d.certificacoes_anteriores_info) campo('Quais certificações', str(d.certificacoes_anteriores_info))
    campo('Competências', str(d.competencias))

    y += 4
    /* declaração */
    secao('Declaração de Compromisso')
    const decls = [
      'Declaro estar em boas condições físicas e mentais para participar da formação.',
      'Autorizo o uso da minha imagem para fins pedagógicos e institucionais.',
      'Comprometo-me a cumprir as normas da Academia e participar activamente das actividades.',
    ]
    decls.forEach(txt => {
      doc.fillColor('#1a2a3a').fontSize(8.5).font('Helvetica').text('☑  ' + txt, 50, y, { width: W })
      y += 16
    })

    /* rodapé */
    y += 12
    doc.moveTo(50, y).lineTo(50 + W, y).strokeColor('#e0e7ef').lineWidth(0.5).stroke()
    y += 8
    doc.fillColor(CINZA).fontSize(7.5).font('Helvetica')
      .text(`Ficha submetida em ${new Date().toLocaleString('pt-PT')} através de aisaph.com`, 50, y, { width: W, align: 'center' })

    doc.end()
  })
}

/* ── HTML partilhado ────────────────────────────────────────── */
function linha(label: string, valor: string) {
  const vazia = valor === '—'
  return `<tr>
    <td style="padding:6px 12px;color:${CINZA};font-size:0.85rem;width:200px;vertical-align:top;white-space:nowrap">${label}</td>
    <td style="padding:6px 12px;font-weight:${vazia ? '400' : '600'};color:${vazia ? '#b0bec5' : '#1a2a3a'}">${valor}</td>
  </tr>`
}

function secaoHTML(titulo: string, linhas: string) {
  return `
    <tr><td colspan="2" style="padding:14px 12px 4px;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${AZUL};border-top:2px solid #e0e7ef">${titulo}</td></tr>
    ${linhas}
  `
}

/* ── email interno para matriculas@ ────────────────────────── */
export async function enviarEmailInscricao(d: Record<string, unknown>) {
  const nome = str(d.nome)
  const email = str(d.email)
  const curso = str(d.curso_interesse)

  const tabelaHTML = `
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${secaoHTML('Dados Pessoais', `
        ${linha('Nome', str(d.nome))}
        ${linha('Email', str(d.email))}
        ${linha('Telefone', str(d.telefone))}
        ${linha('Data de nascimento', str(d.data_nascimento))}
        ${linha('Sexo', sexoLabel[str(d.sexo)] ?? str(d.sexo))}
        ${linha('Nacionalidade', str(d.nacionalidade))}
        ${linha('CNI / Passaporte', str(d.documento_id))}
        ${linha('NIF', str(d.nif))}
        ${linha('Endereço', str(d.endereco))}
        ${linha('Profissão', str(d.profissao))}
        ${linha('Instituição', str(d.instituicao))}
      `)}
      ${secaoHTML('Curso', `
        ${linha('Curso pretendido', str(d.curso_interesse))}
        ${linha('Turma', str(d.turma_info))}
        ${linha('Modalidade', modalidadeLabel[str(d.modalidade)] ?? str(d.modalidade))}
        ${linha('Local da formação', str(d.local_formacao))}
        ${linha('Data início prevista', str(d.data_inicio_prevista))}
        ${linha('Data fim prevista', str(d.data_fim_prevista))}
      `)}
      ${secaoHTML('Educação & Competências', `
        ${linha('Nível de escolaridade', escolaridadeLabel[str(d.nivel_escolaridade)] ?? str(d.nivel_escolaridade))}
        ${linha('Experiência em APH', simNao[str(d.experiencia_aph)] ?? str(d.experiencia_aph))}
        ${linha('Descrição experiência', str(d.experiencia_aph_descricao))}
        ${linha('Certificações anteriores', simNao[str(d.certificacoes_anteriores)] ?? str(d.certificacoes_anteriores))}
        ${linha('Quais certificações', str(d.certificacoes_anteriores_info))}
        ${linha('Competências', str(d.competencias))}
      `)}
    </table>
  `

  const pdf = await gerarPdfInscricao(d)
  const nomeArquivo = `inscricao_${nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? 'AISAPH-CV <noreply@aisaph.com>',
    to: 'matriculas@aisaph.com',
    replyTo: email !== '—' ? email : undefined,
    subject: `Nova inscrição — ${nome} — ${curso}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
        <div style="background:${AZUL};padding:28px 32px">
          <h1 style="margin:0;color:#fff;font-size:1.3rem">Nova Inscrição Recebida</h1>
          <p style="margin:6px 0 0;color:#a8c8e8;font-size:0.9rem">AISAPH-CV — ${new Date().toLocaleString('pt-PT')}</p>
        </div>
        <div style="padding:24px 32px;background:#f8fafc">${tabelaHTML}</div>
        <div style="padding:12px 24px;background:#e0e7ef;font-size:12px;color:${CINZA};text-align:center">
          Gerado automaticamente por aisaph.com · A ficha em PDF está em anexo.
        </div>
      </div>
    `,
    attachments: [{
      filename: nomeArquivo,
      content: pdf,
      contentType: 'application/pdf',
    }],
  })
}

/* ── email de confirmação para o candidato ──────────────────── */
export async function enviarEmailConfirmacao(d: Record<string, unknown>) {
  const nome = str(d.nome)
  const email = str(d.email)
  const telefone = str(d.telefone)
  const curso = str(d.curso_interesse)
  const turma = d.turma_info ? str(d.turma_info) : null
  const modalidade = d.modalidade ? (modalidadeLabel[str(d.modalidade)] ?? str(d.modalidade)) : null

  if (email === '—') return

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? 'AISAPH-CV <noreply@aisaph.com>',
    to: email,
    subject: `Inscrição recebida — ${curso} | AISAPH-CV`,
    html: `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.08)">
    <div style="background:#fff;padding:20px 32px;text-align:center;border-bottom:3px solid ${AZUL}">
      <img src="https://aisaph.com/logo.png" alt="AISAPH-CV" style="height:90px;width:auto">
    </div>
    <div style="background:${AZUL};padding:20px 32px;text-align:center">
      <h2 style="margin:0;color:#fff;font-size:1.1rem;font-weight:600">Inscrição Recebida com Sucesso</h2>
    </div>
    <div style="padding:36px 32px">
      <p style="margin:0 0 8px;color:${AZUL};font-size:1rem;font-weight:700">Olá, ${nome}!</p>
      <p style="margin:0 0 24px;color:${CINZA};font-size:0.95rem;line-height:1.7">
        A sua inscrição foi recebida com sucesso. Obrigado pelo interesse em formação com a AISAPH-CV.
      </p>
      <div style="background:#f0f7ff;border-radius:8px;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${AZUL}">Resumo da sua inscrição</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:5px 0;color:#94a3b8;font-size:0.85rem;width:130px">Curso</td><td style="padding:5px 0;font-weight:600;color:#1a2a3a;font-size:0.9rem">${curso}</td></tr>
          ${turma ? `<tr><td style="padding:5px 0;color:#94a3b8;font-size:0.85rem">Turma</td><td style="padding:5px 0;font-weight:600;color:#1a2a3a;font-size:0.9rem">${turma}</td></tr>` : ''}
          ${modalidade ? `<tr><td style="padding:5px 0;color:#94a3b8;font-size:0.85rem">Modalidade</td><td style="padding:5px 0;font-weight:600;color:#1a2a3a;font-size:0.9rem">${modalidade}</td></tr>` : ''}
          <tr><td style="padding:5px 0;color:#94a3b8;font-size:0.85rem">Contacto</td><td style="padding:5px 0;font-weight:600;color:#1a2a3a;font-size:0.9rem">${telefone}</td></tr>
        </table>
      </div>
      <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${AZUL}">O que acontece a seguir?</p>
      <p style="margin:0 0 24px;color:${CINZA};font-size:0.9rem;line-height:1.7">
        A nossa equipa irá analisar a sua ficha e entrar em contacto pelo número <strong style="color:#1a2a3a">${telefone}</strong> para confirmar a inscrição e informar sobre o pagamento e datas.
      </p>
      <p style="margin:0;color:${CINZA};font-size:0.85rem">
        Dúvidas? Escreva para <a href="mailto:matriculas@aisaph.com" style="color:${AZUL};font-weight:600">matriculas@aisaph.com</a>
      </p>
    </div>
    <div style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e0e7ef;text-align:center">
      <p style="margin:0;font-size:0.8rem;color:#94a3b8">Esta mensagem foi gerada automaticamente — por favor não responda directamente a este email.</p>
    </div>
  </div>
</body>
</html>`,
  })
}
