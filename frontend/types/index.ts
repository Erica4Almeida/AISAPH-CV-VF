export interface StrapiMeta {
  pagination: { page: number; pageSize: number; pageCount: number; total: number }
}

export interface StrapiMedia {
  id: number
  documentId: string
  url: string
  alternativeText: string | null
  width: number
  height: number
}

export type CursoCategoria = 'basico' | 'avancado' | 'especializado'

export interface Curso {
  id: number
  documentId: string
  titulo: string
  slug: string
  descricao: string
  carga_horaria: string
  publico_alvo: string
  certificacao: string
  categoria: CursoCategoria
  preco?: number
  destaque: boolean
  imagem: StrapiMedia | null
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface Depoimento {
  id: number
  documentId: string
  nome: string
  cargo?: string
  empresa?: string
  texto: string
  foto: StrapiMedia | null
  destaque: boolean
  ordem?: number
  createdAt: string
}

export interface Turma {
  id: number
  documentId: string
  data_inicio: string
  data_fim: string
  local: string
  vagas_disponiveis: number
  curso: Curso
  createdAt: string
}

export interface Parceiro {
  id: number
  documentId: string
  nome: string
  logo: StrapiMedia | null
  site_url?: string
  ordem?: number
}

export interface Faq {
  id: number
  documentId: string
  pergunta: string
  resposta: string
  ordem?: number
}

export interface Sobre {
  historia_titulo: string
  historia_conteudo: string
  missao: string
  visao: string
  valores: string
  stat_1_num: string; stat_1_label: string
  stat_2_num: string; stat_2_label: string
  stat_3_num: string; stat_3_label: string
  stat_4_num: string; stat_4_label: string
  certificacoes: string[]
}

export interface Hero {
  badge: string
  titulo_parte1: string
  titulo_destaque: string
  titulo_parte2: string
  subtitulo: string
  stat_1_num: string; stat_1_unit: string; stat_1_label: string
  stat_2_num: string; stat_2_unit: string; stat_2_label: string
  stat_3_num: string; stat_3_unit: string; stat_3_label: string
  stat_4_num: string; stat_4_unit: string; stat_4_label: string
}

export interface Diferencial {
  id: number
  documentId: string
  emoji: string
  titulo: string
  descricao: string
  ordem?: number
}

export interface Setor {
  id: number
  documentId: string
  icone: string
  titulo: string
  descricao: string
  ordem?: number
}

export interface Etapa {
  id: number
  documentId: string
  numero: string
  titulo: string
  descricao: string
  ordem?: number
}

export interface Configuracao {
  contato_telefone: string
  contato_telefone_href: string
  contato_whatsapp: string
  contato_whatsapp_href: string
  contato_email: string
  contato_localizacao: string
  contato_maps_embed: string
  social_facebook: string
  social_instagram: string
  social_linkedin: string
  footer_descricao: string
  cta_titulo: string
  cta_subtitulo: string
  cta_btn_primario: string
  cta_btn_secundario: string
  incompany_descricao: string
  incompany_servicos: string[]
  incompany_badge_num: string
  incompany_badge_label: string
  incompany_imagem_url: string
  incompany_header_titulo: string
  incompany_header_subtitulo: string
  incompany_tag: string
  incompany_titulo: string
  incompany_btn_proposta: string
  cta_tag: string
}

export interface GaleriaFoto {
  id: number
  documentId: string
  titulo: string
  descricao?: string
  imagem: StrapiMedia | StrapiMedia[]
  data?: string
  ordem?: number
}

export interface Noticia {
  id: number
  documentId: string
  titulo: string
  slug: string
  resumo?: string
  conteudo?: unknown
  imagem?: StrapiMedia | null
  galeria?: StrapiMedia[]
  video_url?: string
  data_publicacao?: string
  destaque?: boolean
  publishedAt: string
}

export interface InscricaoPayload {
  nome: string
  email: string
  telefone: string
  curso_interesse: string
  turma_info?: string
  mensagem?: string
}

export interface PropostaPayload {
  empresa: string
  nome_contato: string
  email: string
  telefone: string
  numero_participantes?: number
  descricao: string
}
