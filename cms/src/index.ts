import type { Core } from '@strapi/strapi'

const PUBLIC_ACTIONS = [
  // Leitura — conteúdo público
  'api::curso.curso.find',
  'api::curso.curso.findOne',
  'api::depoimento.depoimento.find',
  'api::turma.turma.find',
  'api::parceiro.parceiro.find',
  'api::faq.faq.find',
  'api::sobre.sobre.find',
  'api::hero.hero.find',
  // Novos content types
  'api::diferencial.diferencial.find',
  'api::setor.setor.find',
  'api::etapa.etapa.find',
  'api::configuracao.configuracao.find',
  // Formulários — criação pública
  'api::inscricao.inscricao.create',
  'api::proposta.proposta.create',
]

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } })

      if (!publicRole) {
        strapi.log.warn('[bootstrap] Public role not found — skipping permission setup')
        return
      }

      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findMany({ where: { role: publicRole.id } })

      const existingSet = new Set(existing.map((p: { action: string }) => p.action))

      for (const action of PUBLIC_ACTIONS) {
        if (!existingSet.has(action)) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: { action, role: publicRole.id },
          })
          strapi.log.info(`[bootstrap] Granted public permission: ${action}`)
        }
      }

      strapi.log.info('[bootstrap] Public permissions configured')
    } catch (err) {
      strapi.log.error('[bootstrap] Failed to configure public permissions:', err)
    }
  },
}
