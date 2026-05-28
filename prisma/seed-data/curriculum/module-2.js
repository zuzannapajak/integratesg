import { question, readMarkdown, section, selfAssessmentQuiz, translation } from "./helpers.js";

export const module2 = {
  slug: "module-2-strategy-vision-and-organisational-alignment",
  status: "published",
  area: "strategy",
  difficulty: "intermediate",
  estimatedDurationMinutes: 90,
  lessonsCount: 4,
  sortOrder: 2,
  isFeatured: true,
  translations: [
    translation("en", {
      title: "Module 2: Strategy, Vision and Organisational Alignment",
      subtitle: "Integrating ESG into strategy, leadership and performance",
      description:
        "This module explores the alignment of organisational strategy and vision with ESG principles. It provides practical insights into integrating ESG into core business processes, setting priorities, building leadership commitment, and balancing ESG with financial and operational performance.",
      content:
        "This module explores how to anchor ESG directly to organisational mission, values, strategy, leadership culture, priorities and performance. The full module content is divided into four Markdown-based units.",
    }),
  ],
  sections: [
    section({
      slug: "unit-1-linking-esg-to-mission-values-and-long-term-strategy",
      sortOrder: 1,
      estimatedMinutes: 25,
      title: "Unit 1: Linking ESG to mission, values and long-term strategy",
      summary:
        "Analyse mission, values and long-term strategy to identify ESG alignment gaps and develop an ESG-integrated strategic framework.",
      content: readMarkdown("content/curriculum/module-2/unit-1.md"),
    }),
    section({
      slug: "unit-2-setting-esg-priorities-and-objectives",
      sortOrder: 2,
      estimatedMinutes: 25,
      title: "Unit 2: Setting ESG priorities and objectives",
      summary:
        "Prioritise ESG issues by evaluating stakeholder relevance and business impact, then formulate measurable ESG objectives.",
      content: readMarkdown("content/curriculum/module-2/unit-2.md"),
    }),
    section({
      slug: "unit-3-building-leadership-commitment-and-organisational-culture",
      sortOrder: 3,
      estimatedMinutes: 20,
      title: "Unit 3: Building leadership commitment and organisational culture",
      summary:
        "Foster leadership commitment and cultivate an organisational culture that supports and sustains ESG values and practices.",
      content: readMarkdown("content/curriculum/module-2/unit-3.md"),
    }),
    section({
      slug: "unit-4-balancing-esg-with-financial-and-operational-performance",
      sortOrder: 4,
      estimatedMinutes: 20,
      title: "Unit 4: Balancing ESG with financial and operational performance",
      summary:
        "Evaluate ESG and financial trade-offs and design strategies that integrate ESG into operational processes.",
      content: readMarkdown("content/curriculum/module-2/unit-4.md"),
    }),
  ],
  quizzes: [
    selfAssessmentQuiz({
      title: "Module 2 Self-assessment",
      description:
        "Self-assessment quiz for Module 2: Strategy, Vision and Organisational Alignment.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 1 — You're reviewing your company's mission statement: \"To provide affordable housing solutions.\" When you analyze this against ESG principles, what gap do you identify?",
          answers: [
            {
              label: "A",
              text: "The mission doesn't mention environmental sustainability or social responsibility in construction practices.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Excellent! You've identified a critical gap. The mission addresses a social need, affordable housing, but doesn't explicitly mention environmental considerations, such as sustainable building materials and energy efficiency, or governance aspects, such as ethical labor practices and transparency. This is exactly the type of gap analysis Unit 1 teaches.",
            },
            {
              label: "B",
              text: "The mission is too focused on affordability rather than profitability.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): While profitability is important, this isn't an ESG gap. The question asks you to identify alignment gaps with ESG principles specifically. Affordability actually aligns with the Social dimension of ESG. Focus on what the mission doesn't say about environmental, social, or governance considerations.",
            },
            {
              label: "C",
              text: "The mission doesn't specify which geographic markets to serve.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Geographic scope is a strategic detail, not an ESG alignment issue. ESG gaps relate to whether the mission addresses environmental responsibility, social impact, or governance principles. Re-read the mission and ask: Does it mention sustainability, stakeholder wellbeing, or ethical practices?",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 2 — Your organisation's core value is \"Customer Excellence.\" When you analyze this value for ESG alignment, you notice it doesn't address fair labor practices or community impact. What does this gap suggest?",
          answers: [
            {
              label: "A",
              text: "The value needs to be replaced with a new ESG-focused value.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): Replacing values isn't the solution. Your existing values are still valid; they just need to be expressed more comprehensively. The goal is to integrate ESG into what you already stand for, not to discard your foundation. Think about enrichment, not replacement.",
            },
            {
              label: "B",
              text: "The value should be enriched to include social responsibility dimensions.",
              isCorrect: true,
              feedbackText:
                'Feedback for B (Correct): Perfect! You understand that gaps don\'t mean values are wrong — they mean values need to be developed further. "Customer Excellence" can be enriched to include how you treat employees, support communities, and operate ethically. This is the reframing process Unit 1 teaches.',
            },
            {
              label: "C",
              text: "The organisation doesn't care about ESG principles.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): A gap in your current value statement doesn't mean the organisation doesn't care about ESG. It simply means ESG considerations aren't yet explicitly woven into how you express that value. This is exactly why Unit 1 teaches the gap analysis process — to identify where integration is needed.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            'Question 3 — When analyzing your long-term strategy for "Increase market share by 25% over five years," what ESG-related question should you ask?',
          answers: [
            {
              label: "A",
              text: "How will this growth impact the environment, labor practices and governance standards?",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Excellent analysis! This is the critical thinking Unit 1 develops. Before committing to growth, you must ask: What are the environmental implications? Will we maintain fair labor practices as we scale? Will our governance structures prevent corruption? This ensures growth doesn't come at the expense of people or the planet.",
            },
            {
              label: "B",
              text: "Will this strategy increase our profit margins?",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): While profit margins matter for business sustainability, this isn't an ESG question. ESG analysis focuses on environmental impact, social responsibility, and governance integrity — not financial metrics. Refocus on the three ESG dimensions when analyzing strategic gaps.",
            },
            {
              label: "C",
              text: "How many new employees will we need to hire?",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Workforce planning is important, but it's not the ESG gap analysis Unit 1 teaches. ESG questions go deeper: Will those new employees be treated fairly? Will hiring practices be ethical and transparent? Will growth harm communities or the environment? Think about the broader implications of your strategy.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt:
            'Question 4 — You\'re developing an ESG-integrated mission statement. Your original mission is "To manufacture quality electronics at competitive prices." Which revised mission best reflects ESG integration?',
          answers: [
            {
              label: "A",
              text: "To manufacture quality electronics at competitive prices while minimizing environmental impact, ensuring fair labor practices and maintaining transparent governance.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Perfect! This revision explicitly weaves all three ESG dimensions into your mission. It addresses environmental responsibility, social responsibility and governance. This is exactly the reframing process Unit 1 teaches — enriching your mission without losing its core purpose.",
            },
            {
              label: "B",
              text: "To manufacture quality electronics at competitive prices and comply with all regulations.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): Compliance is important but insufficient. ESG integration goes beyond meeting minimum legal requirements. Your mission should aspire to positive impact — protecting the environment, supporting people and operating with integrity — not just avoiding violations.",
            },
            {
              label: "C",
              text: "To manufacture quality electronics at competitive prices and invest in employee training.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Employee training is valuable, but this revision doesn't address the full scope of ESG integration. A complete ESG-integrated mission addresses environmental sustainability, social responsibility across all stakeholders and governance principles.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            'Question 5 — You\'re aligning your value "Innovation" with ESG principles. Which statement best reflects an ESG-integrated expression of this value?',
          answers: [
            {
              label: "A",
              text: "Innovation means we develop new products faster than our competitors.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): This focuses only on competitive advantage, not on ESG integration. Speed and competition are business concerns, but they don't address environmental or social responsibility. ESG-integrated values must explicitly connect to sustainability, stakeholder wellbeing and ethical practices.",
            },
            {
              label: "B",
              text: "Innovation means we continuously seek better ways to create value for business, society and the environment, including sustainable technologies and circular economy models.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Excellent! You've captured the essence of ESG-integrated values. This expression connects innovation to environmental responsibility and social impact. It tells employees what innovation actually means in your organisation — not just speed or R&D spending, but purposeful, sustainable innovation.",
            },
            {
              label: "C",
              text: "Innovation means we invest heavily in research and development.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): While R&D investment is important, this doesn't express ESG integration. You're describing a business activity, not a value. An ESG-integrated value explains why you innovate and what kind of innovation matters — innovation that benefits people and the planet, not just your bottom line.",
            },
          ],
        }),

        question({
          sortOrder: 6,
          prompt:
            'Question 6 — Your original strategic priority is "Expand into emerging markets." You\'re now integrating ESG. Which revised priority best reflects this integration?',
          answers: [
            {
              label: "A",
              text: "Expand into emerging markets while establishing partnerships with local communities, ensuring environmental compliance exceeds local regulations and implementing governance structures that prevent corruption.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Perfect! This revision maintains your strategic goal while explicitly integrating ESG dimensions: social responsibility, environmental stewardship and governance integrity. This is the strategic integration Unit 1 teaches — ensuring growth doesn't compromise values.",
            },
            {
              label: "B",
              text: "Expand into emerging markets as quickly as possible to maximize first-mover advantage.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): Speed and first-mover advantage are competitive concerns, not ESG considerations. This revision ignores the social, environmental and governance implications of rapid expansion. ESG integration requires you to ask: At what cost to communities and the environment are we expanding? How will we maintain ethical standards?",
            },
            {
              label: "C",
              text: "Expand into emerging markets and hire local talent to reduce labor costs.",
              isCorrect: false,
              feedbackText:
                'Feedback for C (Incorrect): While local hiring can be part of ESG strategy, this revision is incomplete and potentially problematic. Mentioning "reduce labor costs" suggests exploiting lower wages rather than ensuring fair practices. A complete ESG-integrated strategy addresses community impact, environmental responsibility, and governance integrity — not just cost reduction.',
            },
          ],
        }),

        question({
          sortOrder: 7,
          prompt: "Question 7 — Which approach best helps you identify your top ESG priorities?",
          answers: [
            {
              label: "A",
              text: "Focus on issues that are easiest to address.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): Ease of implementation doesn’t guarantee relevance or impact. Focus on what matters most, not just what’s simple.",
            },
            {
              label: "B",
              text: "Prioritize issues important to both stakeholders and business strategy.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Correct! Effective prioritization considers both stakeholder concerns and business impact, ensuring your efforts are meaningful.",
            },
            {
              label: "C",
              text: "Select issues based on competitor actions.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Competitor actions may offer ideas, but your priorities should be based on your own context and stakeholder needs.",
            },
          ],
        }),

        question({
          sortOrder: 8,
          prompt:
            "Question 8 — When engaging stakeholders to set ESG priorities, what is most important?",
          answers: [
            {
              label: "A",
              text: "Only consult internal management.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): Limiting input to management misses key perspectives. Broader engagement leads to more relevant priorities.",
            },
            {
              label: "B",
              text: "Gather input from diverse stakeholder groups.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Correct! Including employees, customers, investors, and communities ensures your ESG priorities reflect real needs and expectations.",
            },
            {
              label: "C",
              text: "Focus on short-term financial gains.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): ESG prioritization is about long-term value, not just immediate profits.",
            },
          ],
        }),

        question({
          sortOrder: 9,
          prompt: "Question 9 — What does a materiality matrix help you do?",
          answers: [
            {
              label: "A",
              text: "Visualize which ESG issues are most important.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Correct! A materiality matrix helps you see which issues matter most to both stakeholders and your business.",
            },
            {
              label: "B",
              text: "Track financial performance.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): Financial tracking is important, but not the purpose of a materiality matrix.",
            },
            {
              label: "C",
              text: "List all possible ESG topics.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Listing topics is a first step, but the matrix helps you prioritize, not just list.",
            },
          ],
        }),

        question({
          sortOrder: 10,
          prompt: "Question 10 — Which is the best example of a measurable ESG objective?",
          answers: [
            {
              label: "A",
              text: "Improve employee wellbeing.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): This is too vague. Objectives should be specific and measurable.",
            },
            {
              label: "B",
              text: "Reduce workplace injuries by 20% in two years.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Correct! This objective is clear, quantifiable, and time-bound, making it actionable and trackable.",
            },
            {
              label: "C",
              text: "Support local charities.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Supporting charities is positive, but without specifics, it’s not measurable.",
            },
          ],
        }),

        question({
          sortOrder: 11,
          prompt:
            "Question 11 — Why should ESG objectives be aligned with your organisation’s strategy?",
          answers: [
            {
              label: "A",
              text: "To ensure leadership support and integration.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Correct! Alignment with strategy ensures ESG objectives are relevant and have organisational backing.",
            },
            {
              label: "B",
              text: "To impress external auditors.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): External validation is useful, but alignment is about real impact, not appearances.",
            },
            {
              label: "C",
              text: "To avoid setting any objectives.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Avoiding objectives undermines progress and accountability.",
            },
          ],
        }),

        question({
          sortOrder: 12,
          prompt: "Question 12 — What is a key step after setting ESG objectives?",
          answers: [
            {
              label: "A",
              text: "Assign responsibility and track progress.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Correct! Assigning responsibility and tracking progress ensures objectives are implemented and outcomes are measured.",
            },
            {
              label: "B",
              text: "Wait for results without monitoring.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): Passive waiting leads to missed opportunities and lack of accountability.",
            },
            {
              label: "C",
              text: "Set new objectives immediately.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Setting new objectives is important, but only after evaluating current progress.",
            },
          ],
        }),

        question({
          sortOrder: 13,
          prompt:
            "Question 13 — Which strategy most effectively builds leadership commitment to ESG?",
          answers: [
            {
              label: "A",
              text: "Educate leaders on ESG trends and show business value through data and case studies.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Excellent! You understand that leaders commit when they see the business case. Education combined with data-driven examples helps leaders understand ESG as a value driver, not just compliance.",
            },
            {
              label: "B",
              text: "Require leaders to attend mandatory ESG compliance training sessions.",
              isCorrect: false,
              feedbackText:
                'Feedback for B (Incorrect): Mandatory training alone doesn\'t build genuine commitment. Leaders need to understand the "why" behind ESG and see tangible benefits. Focus on engagement and education, not just compliance requirements.',
            },
            {
              label: "C",
              text: "Implement ESG initiatives without consulting leadership first.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Implementing ESG without leadership input creates resistance and undermines commitment. Leaders must be involved early and understand how ESG aligns with organisational strategy.",
            },
          ],
        }),

        question({
          sortOrder: 14,
          prompt:
            "Question 14 — How should ESG objectives be connected to gain leadership support?",
          answers: [
            {
              label: "A",
              text: "Link ESG to core business strategy and growth opportunities.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Perfect! When ESG is aligned with business strategy, leaders see it as essential to organisational success, not an add-on. This connection drives resource allocation and sustained commitment.",
            },
            {
              label: "B",
              text: "Present ESG as a separate initiative from business goals.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): Treating ESG separately from business strategy makes it easy to deprioritize when resources are tight. Integration with core business goals ensures ESG remains a priority.",
            },
            {
              label: "C",
              text: "Focus ESG messaging only on regulatory compliance requirements.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Compliance-only messaging limits leadership enthusiasm. Leaders engage more when they see ESG as a growth and innovation opportunity, not just a regulatory burden.",
            },
          ],
        }),

        question({
          sortOrder: 15,
          prompt: "Question 15 — What role should leaders play as ESG ambassadors?",
          answers: [
            {
              label: "A",
              text: "Communicate ESG priorities in meetings and model ESG behaviors visibly.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Correct! Leaders amplify ESG commitment through visible communication and personal modeling. This signals to the entire organisation that ESG is a priority and builds credibility.",
            },
            {
              label: "B",
              text: "Delegate all ESG communication to the sustainability department.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): Delegating ESG communication to one department weakens leadership commitment. Leaders must actively communicate and model ESG values to inspire organisational change.",
            },
            {
              label: "C",
              text: "Discuss ESG only in formal annual sustainability reports.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Annual reports alone are insufficient. Consistent, visible communication throughout the year keeps ESG top of mind and demonstrates genuine leadership commitment.",
            },
          ],
        }),

        question({
          sortOrder: 16,
          prompt:
            "Question 16 — How can you best embed ESG values into daily organisational practices?",
          answers: [
            {
              label: "A",
              text: "Integrate ESG into onboarding, training, and decision-making processes.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Excellent! Embedding ESG in everyday processes makes it part of how work gets done, not a separate initiative. This creates lasting cultural change and sustained commitment.",
            },
            {
              label: "B",
              text: "Create an annual ESG awareness campaign once per year.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): Annual campaigns create awareness but don't sustain culture change. ESG must be woven into daily routines and decision-making to truly shape organisational culture.",
            },
            {
              label: "C",
              text: "Discuss ESG only during quarterly business reviews.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Quarterly discussions are too infrequent to build culture. ESG needs to be present in daily work — from hiring to project approvals to procurement decisions.",
            },
          ],
        }),

        question({
          sortOrder: 17,
          prompt:
            "Question 17 — What is the most effective way to recognize ESG champions in your organisation?",
          answers: [
            {
              label: "A",
              text: "Highlight employees publicly and create formal recognition programs.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Perfect! Public recognition and formal programs celebrate ESG commitment, inspire others, and reinforce that ESG is valued. This strengthens organisational culture around sustainability.",
            },
            {
              label: "B",
              text: "Acknowledge ESG efforts only in private conversations with managers.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): Private acknowledgment is kind but doesn't build culture. Public recognition signals to the entire organisation that ESG behaviors are valued and worth emulating.",
            },
            {
              label: "C",
              text: "Recognize ESG contributions only through financial bonuses.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): While incentives matter, recognition goes beyond money. Public celebration of ESG champions creates cultural momentum and motivates broader participation.",
            },
          ],
        }),

        question({
          sortOrder: 18,
          prompt:
            "Question 18 — How should organisations handle employee feedback on ESG initiatives?",
          answers: [
            {
              label: "A",
              text: "Create safe spaces for dialogue and act on feedback to show it's valued.",
              isCorrect: true,
              feedbackText:
                "Feedback for A (Correct): Correct! Open dialogue and responsive action build trust and ownership. When employees see their feedback shapes ESG initiatives, they become invested in success.",
            },
            {
              label: "B",
              text: "Listen to feedback but make decisions without employee input.",
              isCorrect: false,
              feedbackText:
                "Feedback for B (Incorrect): Listening without acting undermines trust and engagement. Employees need to see that their input influences decisions, or they'll disengage from ESG efforts.",
            },
            {
              label: "C",
              text: "Discourage feedback to maintain clear ESG implementation plans.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Discouraging feedback stifles innovation and creates resistance. The strongest ESG cultures invite input, learn from it and adapt accordingly.",
            },
          ],
        }),

        question({
          sortOrder: 19,
          prompt:
            "Question 19 — When evaluating an ESG initiative's financial impact, what should you consider?",
          answers: [
            {
              label: "A",
              text: "Only the upfront costs of implementation.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): Focusing only on upfront costs ignores the full financial picture. ESG investments often generate returns over 3-5 years through cost savings, new markets, and risk mitigation. You need a complete ROI analysis.",
            },
            {
              label: "B",
              text: "Both immediate costs and long-term benefits including risk mitigation and revenue opportunities.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Excellent! Comprehensive evaluation includes upfront costs, long-term operational savings, risk mitigation and new revenue opportunities. This holistic view reveals the true financial value of ESG.",
            },
            {
              label: "C",
              text: "Only the environmental or social benefits without financial analysis.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): While environmental and social benefits matter, you can't ignore financial implications. Your organisation needs to understand the business case for ESG to gain leadership support and ensure sustainability.",
            },
          ],
        }),

        question({
          sortOrder: 20,
          prompt:
            "Question 20 — A company invests €500,000 in renewable energy but sees no profit in year one. How should you evaluate this trade-off?",
          answers: [
            {
              label: "A",
              text: "Conclude the investment was a mistake and abandon it.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): Abandoning investments after one year ignores the long-term nature of ESG returns. Many ESG initiatives take years to generate financial benefits. Patience and strategic thinking are essential.",
            },
            {
              label: "B",
              text: "Analyze long-term savings, regulatory risk mitigation and brand value over 3-5 years.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Perfect! This approach evaluates the investment properly by considering operational cost savings, avoided regulatory fines, improved brand reputation and customer attraction over the full investment horizon.",
            },
            {
              label: "C",
              text: "Wait until profits appear before assessing the investment's value.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Passive waiting doesn't help you understand the investment's value. You need active analysis to track whether the initiative is delivering expected returns and to adjust strategies if needed.",
            },
          ],
        }),

        question({
          sortOrder: 21,
          prompt:
            "Question 21 — What is the primary risk of focusing only on short-term financial metrics when evaluating ESG initiatives?",
          answers: [
            {
              label: "A",
              text: "ESG initiatives will become too expensive.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): Cost isn't the primary risk here. The issue is perspective — short-term thinking can cause you to miss opportunities that create substantial long-term value.",
            },
            {
              label: "B",
              text: "You may reject valuable long-term investments that generate significant future value.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Correct! Short-term focus can lead you to reject ESG investments that would pay off significantly over 3-5 years. This myopic view costs your organisation money and competitive advantage in the long run.",
            },
            {
              label: "C",
              text: "Employees will lose interest in sustainability efforts.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): While employee engagement matters, the primary risk of short-term thinking is financial — missing valuable investments and long-term value creation opportunities.",
            },
          ],
        }),

        question({
          sortOrder: 22,
          prompt: "Question 22 — Which approach best integrates ESG into operational processes?",
          answers: [
            {
              label: "A",
              text: "Create a separate ESG department to handle sustainability initiatives.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): Separating ESG into its own department isolates it from core business operations. Real integration happens when ESG is woven into how work actually gets done across the organisation.",
            },
            {
              label: "B",
              text: "Embed ESG considerations into core processes like product design, supply chain and procurement.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Excellent! This is true integration. When ESG is embedded in product design, supply chain decisions and procurement, it becomes part of daily operations and drives both sustainability and efficiency improvements.",
            },
            {
              label: "C",
              text: "Implement ESG changes only when required by regulations.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): Waiting for regulations is reactive, not strategic. Proactive ESG integration creates competitive advantages, cost savings and innovation opportunities before regulations force change.",
            },
          ],
        }),

        question({
          sortOrder: 23,
          prompt:
            "Question 23 — How can you foster innovation to find solutions that address both ESG and financial goals?",
          answers: [
            {
              label: "A",
              text: "Assign ESG responsibility to senior management only.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): Top-down approaches miss the creativity and insights of frontline employees who understand operational challenges best. Innovation requires diverse perspectives and broad participation.",
            },
            {
              label: "B",
              text: "Create cross-functional teams and innovation challenges that encourage employee problem-solving.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Perfect! Cross-functional teams bring different expertise and viewpoints, while innovation challenges tap into employee creativity. This approach generates practical solutions that address both sustainability and profitability.",
            },
            {
              label: "C",
              text: "Hire external consultants to develop all ESG strategies.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): While external expertise is valuable, relying solely on consultants misses internal knowledge and reduces employee ownership. The best solutions come from combining external expertise with internal insights.",
            },
          ],
        }),

        question({
          sortOrder: 24,
          prompt:
            "Question 24 — What is the primary purpose of tracking both ESG and financial metrics together?",
          answers: [
            {
              label: "A",
              text: "To prove that ESG is more important than financial performance.",
              isCorrect: false,
              feedbackText:
                "Feedback for A (Incorrect): The goal isn't to rank ESG above financial performance — it's to show they're interconnected. Tracking both metrics reveals how ESG drives financial value.",
            },
            {
              label: "B",
              text: "To demonstrate the value of ESG initiatives and identify areas for improvement and optimization.",
              isCorrect: true,
              feedbackText:
                "Feedback for B (Correct): Correct! Integrated metrics tracking shows stakeholders that ESG delivers real value while helping you identify what's working and what needs adjustment. This data-driven approach supports continuous improvement.",
            },
            {
              label: "C",
              text: "To satisfy regulatory requirements for sustainability reporting.",
              isCorrect: false,
              feedbackText:
                "Feedback for C (Incorrect): While compliance matters, the primary purpose is strategic — understanding the relationship between ESG and financial performance to optimize both and make better business decisions.",
            },
          ],
        }),
      ],
    }),
  ],
};
