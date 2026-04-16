# 📋 Todo List - Clube do Livro

Abaixo está o mapeamento detalhado de todos os requisitos do projeto e o status atual de implementação de cada um.

## 🏗️ 1. BASE ACAMPAMENTO E ARQUITETURA
- [x] Repositório Backend (NestJS, estruturação modular DDD)
- [x] Repositório Frontend (Next.js App Router, Tailwind css v4)
- [x] Configuração Prisma ORM e Schema Base (User, Club, Event, Book)
- [x] Conexão inicial com PostgreSQL
- [x] Configuração do Redis (Sessões e Cache)
- [x] Configuração do BullMQ (Filas)
- [x] Configuração Base para WebSockets (NestJS Gateway)

## 🔐 2. AUTENTICAÇÃO (Módulo de Segurança)
- [x] Autenticação Base JWT (Access Token / Refresh)
- [x] Hash seguro de senhas com bcrypt
- [x] Login OAuth (Google)
- [x] Login OAuth (Facebook)
- [x] Login sem senha (Magic Link no email)
- [x] Segurança extra: Rate Limit e Brute Force Protection
- [x] Controle global de Sessões (Revogar token/Logout Global)

## 👤 3. USUÁRIO (Rico)
- [x] Modelo de dados Prisma (ID, Username, Bio, Avatar, etc)
- [x] Controlador e Serviço Base (Buscar perfil)
- [x] Sistema de Follow (Seguir usuários)
- [x] Perfil Otimizado (Atividade recente, badges e estatísticas)
- [x] Tags de Interesses de Leitura

## 📚 4. LIVROS (Inteligente)
- [x] Modelo Prisma (Categorias, capa, link externo)
- [x] Serviços e Controllers completos (CRUD Base)
- [x] Sistema de Busca Avançada (Filtro por título/autor/tags)
- [x] Recomendação Baseada em Interesse do Usuário

## 👥 5. CLUBES (Core do Produto)
- [x] Schema e Relações (Cargos ADMIN, MEMBRO, MODERADOR)
- [x] Cadastro de clube e vinculação automática de Criador como Admin
- [x] Fluxo de Convite via Link
- [x] Fluxo de Solicitação de Entrada / Aprovação
- [x] Feed Interno do Clube (Postagens e discussões)

## 📅 6. EVENTOS (Crítico)
- [x] Modelo de Eventos (Online e Presencial)
- [x] Regra: Bloquear criação com < 5 membros no clube
- [x] RSVP Base (Marcar Presença)
- [x] Regra: Confirmar evento com >= 3 participantes
- [x] Restrições Anti-Spam de Eventos e limite por usuário
- [x] Disparo de Lembretes Automáticos para Inscritos (Via BullMQ)

## 📍 7. GEOLOCALIZAÇÃO
- [x] API de detecção / Captação de coordenadas lat/lng do usuário
- [x] Busca / Sugestão de eventos próximos
- [x] Busca / Sugestão de clubes da cidade local

## 💬 8. COMUNICAÇÃO E CHAT
- [x] Salas de chat em tempo real por Clube (Socket)
- [x] Salas de chat em tempo real por Evento (Socket)
- [x] Modelo de Discussões de Livros e Capítulos específicos

## 🔔 9. NOTIFICAÇÕES
- [x] Arquitetura de Notificações HTTP Fallback
- [x] Notificações Push via WebSocket (Mensagem recebida, convites)
- [x] Alertas gamificados ("Você alcançou novo rank!")

## 🧠 10. ENGAJAMENTO / GAMIFICAÇÃO
- [x] Estrutura Inicial no Banco (Level, Points, Streak)
- [x] Lógica de Adição de Pontos (Leituras concluídas, participar de eventos)
- [x] Job diário computando o "Streak Diário" dos Usuários (Filas)
- [x] Configuração de Badges (Conquistas renderizadas)

## 📱 11. FRONTEND E INTERFACE (Next.js)
- [x] Design System Customizado (Variáveis de Tema)
        👤 Agente: Frontend UI Engineer
        Criar Card (livro, clube, usuário)
        👤 Agente: Component Architect
        Criar Badge (gêneros literários)
        👤 Agente: UI Engineer
        Criar Avatar (fallback + imagem)
        👤 Agente: Frontend UI Engineer
        Criar BottomNavbar (mobile-first)
        👤 Agente: Mobile UX Engineer

        Done quando:

        100% reutilizável
        Segue tokens (sem cor hardcoded)
[x] 🚀 Página de Landing (Apresentação Premium)
        Estrutura base criada
        🔧 Tasks
        [x] Adicionar animações (Framer Motion)
        [x] Refinar glassmorphism + gradientes
        [x] Criar CTA forte (“Entrar no clube”)
        [x] Otimizar performance (Lighthouse)

        Done quando:

        Lighthouse > 90
        Mobile first impecável
[x] 🧭 Telas Completas de Onboarding
        Fluxo completo
        🔧 Tasks
        [x] Tela 1: Boas-vindas
        [x] Tela 2: Seleção de gêneros (multi-select)
        [x] Tela 3: Frequência de leitura
        [x] Tela 4: Clubes recomendados
        [x] Persistência com Zustand

        Done quando:

        Fluxo sem reload
        Estado persistido
[x] 🏠 Páginas do Dashboard Privado (Feed Inicial)
        Estrutura principal
        🔧 Tasks
        [x] Layout base estilo app
        [x] Componente “Leitura atual”
        [x] Componente “Clubes ativos”
        [x] Componente “Discussões recentes”
        [x] Skeleton loading

        Done quando:

        Scroll fluido
        Dados reais integrados
[x] 📚 Págias de Clubes e Listagem
        Listagem funcional
        🔧 Tasks
        [x] Criar ClubCard
        [x] Grid responsivo
        [x] Filtro por gênero
        [x] Busca por nome
        [x] Página detalhada do clube

        Done quando:

        Filtros funcionam
        UI consistente
[x] 💬 Layout de Salas de Chat Real-time
        Interface completa
        🔧 Tasks
        [x] Layout estilo chat (WhatsApp/Discord)
        [x] Lista de mensagens com scroll automático
        [x] Input fixo inferior
        [x] Diferenciação visual (eu vs outros)
        [x] Integração websocket/socket

        Done quando:

        Mensagens fluem em tempo real
        UX natural
[x] 🧠 Integração Zustand / React Query
        Setup completo
        🔧 Tasks
        [x] Criar store de usuário
        [x] Criar store de preferências
        [x] Criar store de clubes
        [x] Setup React Query (cache + fetch)
        [x] Integração com API

        Done quando:

        Sem props drilling
        Cache funcionando corretamente
[x] ⚡ BÔNUS (alto nível – diferencial real)
        [x] Transições entre páginas (app-like)
        [x] Feedback tátil/visual (micro-interações)
        [ ] Efeito “virar página”
        [ ] PWA (instalável no celular)

## 🔬 12. QUALIDADE E PADRÕES
- [ ] Validações de payload e DTOs via `class-validator`
- [ ] Tratamento Global de Erros / Exceções personalizadas no Nest
- [ ] Integração com sistema estruturado de Logs

---

> Esse roadmap pode receber check-ins à medida que formos acionando os blocos individualmente.
