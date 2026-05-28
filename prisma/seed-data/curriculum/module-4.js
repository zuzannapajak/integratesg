import { question, readCurriculumMarkdown, section, translation, unitQuiz } from "./helpers.js";

export const module4 = {
  slug: "module-4-integrating-esg-into-business-operations",
  status: "published",
  area: "cross_cutting",
  difficulty: "intermediate",
  estimatedDurationMinutes: 80,
  lessonsCount: 4,
  sortOrder: 4,
  isFeatured: false,
  translations: [
    translation("en", {
      title: "Module 4: Integrating ESG into Business Operations",
      subtitle: "ESG in daily operations",
      description:
        "Turn ESG into practical daily actions across operations, workforce, suppliers, governance and customer communication.",
      content:
        "This module shows how to turn ESG principles into everyday business practice. It focuses on identifying ESG touchpoints in core operations, improving workforce and supplier responsibility, strengthening governance in daily decision-making, and communicating ESG actions to customers in a credible and non-misleading way.",
    }),
  ],
  sections: [
    section({
      slug: "unit-1-esg-touchpoints-in-core-operating-processes",
      sortOrder: 1,
      estimatedMinutes: 20,
      title: "Unit 1: ESG Touchpoints in Core Operating Processes",
      summary:
        "Analyse key operational workflows to identify ESG impact points and prioritise practical environmental improvements using impact-versus-effort reasoning.",
      content: readCurriculumMarkdown("en", "module-4", "unit-1"),
    }),
    section({
      slug: "unit-2-social-responsibility-in-workforce-and-supply-chain",
      sortOrder: 2,
      estimatedMinutes: 20,
      title: "Unit 2: Social Responsibility in Workforce and Supply Chain",
      summary:
        "Assess social responsibility risks in workforce practices and supplier relationships, then implement simple actions supporting fairness, inclusion and responsible supply chain engagement.",
      content: readCurriculumMarkdown("en", "module-4", "unit-2"),
    }),
    section({
      slug: "unit-3-governance-in-operational-decision-making",
      sortOrder: 3,
      estimatedMinutes: 20,
      title: "Unit 3: Governance in Operational Decision-Making",
      summary:
        "Analyse everyday decisions, define clear roles and approvals, and introduce simple governance controls that support transparency, accountability and ethical behaviour.",
      content: readCurriculumMarkdown("en", "module-4", "unit-3"),
    }),
    section({
      slug: "unit-4-credible-esg-in-customer-communication-and-claims",
      sortOrder: 4,
      estimatedMinutes: 20,
      title: "Unit 4: Credible ESG in Customer Communication and Claims",
      summary:
        "Evaluate customer-facing ESG claims and communicate ESG actions in a specific, checkable and proportionate way.",
      content: readCurriculumMarkdown("en", "module-4", "unit-4"),
    }),
  ],
  quizzes: [
    unitQuiz({
      unitSlug: "unit-1-esg-touchpoints-in-core-operating-processes",
      sortOrder: 1,
      title: "Unit 1 Self-assessment",
      description: "Self-assessment quiz for Unit 1: ESG Touchpoints in Core Operating Processes.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 1 — You have decided to start improving ESG in daily operations, but you do not want to create extra bureaucracy or collect unnecessary information too early. According to this unit, what is the most useful first step for an SME?",
          answers: [
            {
              label: "1",
              text: "Start collecting detailed ESG data for every activity and every room.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Detailed data collection may become useful later, but it is not the best starting point for a small business. At the beginning, it can slow the process down and make ESG feel like paperwork. The goal of the first step is to spot the main hotspots quickly, not to build a full measurement system.",
            },
            {
              label: "2",
              text: "Do a short walk-through of one normal working day and look for environmental hotspots.",
              isCorrect: true,
              feedbackText:
                "Correct. A short walk-through helps you focus on what is actually happening in normal work. It lets you identify where energy, materials, water, and waste matter most in practical terms. This is exactly the kind of simple, operational starting point recommended in the unit.",
            },
            {
              label: "3",
              text: "Write a general sustainability statement for staff and customers.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A general statement may sound good, but it does not tell you where the real problems are. It does not help you identify which activities create waste, cost, or inefficiency. In this unit, action starts from observing operations, not from writing broad messages.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 2 — During your walk-through, you want to identify which observations should be treated as real environmental hotspots rather than background details. Which of the following is the strongest example of an environmental problem area that should clearly be marked for follow-up?",
          answers: [
            {
              label: "1",
              text: "Machines and lights stay on after work in several areas.",
              isCorrect: true,
              feedbackText:
                "Correct. This is a direct example of unnecessary energy use in daily operations. It happens repeatedly, creates cost, and can usually be improved without major investment. That makes it a strong hotspot under the unit's criteria.",
            },
            {
              label: "2",
              text: "The company logo on boxes looks old-fashioned.",
              isCorrect: false,
              feedbackText:
                "Incorrect. An outdated logo may be a branding issue, but it is not an environmental hotspot in itself. It does not tell you anything important about energy, waste, water, or material use. The unit focuses on operational impacts, not visual identity.",
            },
            {
              label: "3",
              text: "Staff use different mugs in the kitchen area.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Different mugs are not a meaningful indicator of environmental performance in this context. They do not show a clear pattern of waste, cost, or inefficient resource use. A hotspot should point to a practical problem area, not a harmless difference in personal habits.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 3 — A small warehouse completes a walk-through and notices three recurring issues: too much filler is used in packaging, recyclable waste often goes into mixed waste, and chargers stay plugged in overnight. What is the most appropriate next step if the company wants to work in the way recommended by this unit?",
          answers: [
            {
              label: "1",
              text: "Select these as key problem areas and turn each one into a clear action.",
              isCorrect: true,
              feedbackText:
                "Correct. The unit recommends choosing the most relevant problem areas and converting them into practical, specific actions. This keeps the work manageable and helps people know exactly what to do next. It also avoids the common mistake of trying to solve everything at once.",
            },
            {
              label: "2",
              text: "Launch a full ESG strategy covering every department at once.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A full ESG strategy may be too broad and too heavy at this stage. The unit promotes focused operational action, especially for SMEs with limited time and resources. Starting too large can reduce momentum and make implementation harder.",
            },
            {
              label: "3",
              text: "Wait until next year and review everything after buying new equipment.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Waiting for a bigger investment is not necessary here. The problems described can already be addressed through practical actions such as better packaging choices, clearer bins, and simple shutdown routines. The unit clearly shows that useful environmental improvement often starts with small operational changes, not expensive upgrades.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt:
            "Question 4 — You have already listed several possible improvement actions and now need to decide which one should be implemented first. Which option best fits the high impact / low effort category that the unit describes as the best place for an SME to start?",
          answers: [
            {
              label: "1",
              text: "Replace all machines and equipment this quarter.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Replacing all machines may have strong impact, but it is usually expensive and disruptive. That makes it more suitable for later planning than for an immediate quick win. The unit encourages SMEs to start with actions that are easier to carry out.",
            },
            {
              label: "2",
              text: "Introduce an end-of-day shutdown routine for lights and key equipment.",
              isCorrect: true,
              feedbackText:
                "Correct. A shutdown routine is a typical quick win because it is clear, low-cost, and easy to repeat. It can reduce unnecessary energy use without requiring major investment or structural change. This is exactly the kind of action the unit places in the do now category.",
            },
            {
              label: "3",
              text: "Redesign the full layout of the warehouse and storage system.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A full redesign of the warehouse may help in some cases, but it usually takes time, money, and coordination. That makes it too heavy for a first action in most SMEs. The unit advises starting with practical changes that create visible benefits quickly.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            "Question 5 — A company has identified eight possible environmental improvements, but it has limited time and only a small team available to implement them. Based on the prioritisation logic in this unit, what is the most sensible way to move forward?",
          answers: [
            {
              label: "1",
              text: "Implement all eight ideas at the same time so nothing gets missed.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Trying to do everything at once often leads to weak implementation and loss of focus. People become overloaded, and important actions may be done only partially. The unit explicitly argues for a small number of focused actions rather than a long list.",
            },
            {
              label: "2",
              text: "Start with 2–3 quick wins now and plan 1 bigger improvement for later.",
              isCorrect: true,
              feedbackText:
                "Correct. This is the approach recommended in the unit because it balances realism and progress. A few quick wins help build momentum, while one larger action can be prepared more carefully for later. This makes the process manageable and more likely to survive in daily work.",
            },
            {
              label: "3",
              text: "Choose only actions that require almost no effort, even if they change very little.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Very low-effort actions are not always the best choice if they have little real impact. The unit’s method asks you to consider both effort and impact, not effort alone. A good starting set should include actions that are practical but still meaningful.",
            },
          ],
        }),
      ],
    }),

    unitQuiz({
      unitSlug: "unit-2-social-responsibility-in-workforce-and-supply-chain",
      sortOrder: 2,
      title: "Unit 2 Self-assessment",
      description:
        "Self-assessment quiz for Unit 2: Social Responsibility in Workforce and Supply Chain.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 6 — You want to improve social responsibility in an SME, but you do not want to start with long policies or a formal HR system. According to this unit, what is the most useful first step for identifying the main risks and improvement points?",
          answers: [
            {
              label: "1",
              text: "Write a detailed social responsibility policy for the whole business.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A detailed policy may look serious, but it does not show where the real day-to-day problems are. In an SME, the first need is to spot practical risk areas in normal operations. The unit clearly starts with routines and hotspots, not with formal documents.",
            },
            {
              label: "2",
              text: "Review 3–5 routine workforce and supplier areas where people-related issues are most likely to appear.",
              isCorrect: true,
              feedbackText:
                "Correct. This is the approach recommended in the unit because it focuses attention on the places where social responsibility becomes real in daily work. Looking at onboarding, shift planning, task allocation, safety, complaints, or supplier relationships helps you see where unfairness, overload, exclusion, or weak responsibility may already exist. It is practical, focused, and suited to an SME environment.",
            },
            {
              label: "3",
              text: "Wait until an employee or supplier submits a formal complaint.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Waiting for a formal complaint means you are reacting too late. Many social responsibility problems stay invisible because people do not know how to raise them or do not feel safe doing so. The unit encourages early observation and simple review, not passive waiting.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 7 — You are doing a short walk-through of people-related routines in your business. Which of the following is the strongest sign that you have found a real social responsibility hotspot that should be treated as a priority?",
          answers: [
            {
              label: "1",
              text: "The same employees repeatedly work overtime while new staff receive little guidance.",
              isCorrect: true,
              feedbackText:
                "Correct. This is a strong warning sign because it combines overload, possible unfairness, and weak support for new workers. It shows that the issue is not random, but part of how work is currently organised. The unit highlights repeated overtime and poor onboarding as important social responsibility hotspots.",
            },
            {
              label: "2",
              text: "Different team members decorate their workstations in different ways.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Different workstation styles may reflect personal preference, but they do not show a meaningful social risk by themselves. The unit is concerned with fairness, safety, inclusion, workload, and the ability to raise concerns. This option does not point to any of those problems in a clear way.",
            },
            {
              label: "3",
              text: "Some employees prefer printed instructions while others prefer digital ones.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A difference in preferred format is not, on its own, a strong social responsibility hotspot. It may matter later for accessibility or communication quality, but it does not directly show unfair treatment, overload, or weak support. The unit asks you to prioritise clearer warning signs first.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 8 — A small workshop notices that training opportunities are shared only informally, the same people get the better assignments, and new workers are expected to learn by watching. Based on this unit, what is the best interpretation of this situation?",
          answers: [
            {
              label: "1",
              text: "These are normal SME habits and not a social responsibility concern.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Informal habits may be common, but the unit makes clear that they can still create unfairness and exclusion. When opportunities are not shared clearly and new staff are left without guidance, the risk becomes operational and social. Common practice is not the same as good practice.",
            },
            {
              label: "2",
              text: "These are social responsibility hotspots linked to fairness, inclusion, and onboarding.",
              isCorrect: true,
              feedbackText:
                "Correct. This answer fits the unit closely because it identifies the core risks correctly. Informal access to opportunities can create favouritism, while weak onboarding increases confusion and weakens fairness. The unit explicitly presents these kinds of patterns as early warning signs that should be addressed.",
            },
            {
              label: "3",
              text: "These are mainly marketing problems that affect employer image.",
              isCorrect: false,
              feedbackText:
                "Incorrect. These issues may eventually affect employer image, but that is not the main point here. The immediate issue is how people are treated in daily operations and whether they receive fair access, support, and clarity. The unit focuses first on operational responsibility, not branding.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt:
            "Question 9 — You want to make inclusion more practical in daily operations without creating extra bureaucracy. Which action best matches the unit's advice?",
          answers: [
            {
              label: "1",
              text: "Let managers share good opportunities with whoever they think is most suitable.",
              isCorrect: false,
              feedbackText:
                "Incorrect. This keeps access dependent on informal judgement, which can easily create favouritism or the appearance of favouritism. The unit warns against systems where some people hear about opportunities first and others do not. A fair process needs visibility and consistency, not private selection.",
            },
            {
              label: "2",
              text: "Announce training, better shifts, and useful assignments to everyone using one clear rule.",
              isCorrect: true,
              feedbackText:
                "Correct. This is one of the clearest inclusion practices described in the unit. It reduces unfair barriers and helps people feel they are treated more equally in normal work. It is also simple enough for an SME to apply without building a large formal system.",
            },
            {
              label: "3",
              text: "Avoid discussing flexibility because it may create unrealistic expectations.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Avoiding the topic does not remove the issue. The unit suggests using one clear flexibility rule, such as shift swaps with notice or earlier schedule publication, because this makes treatment fairer and more predictable. Ignoring flexibility can leave unfairness unresolved.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            "Question 10 — A key supplier delivers on time and offers a good price, but when asked about working conditions and complaint responsibility, they give vague answers. They do seem open to improving. According to this unit, what is the most appropriate next step?",
          answers: [
            {
              label: "1",
              text: "Ignore the issue because price and delivery are currently acceptable.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Good price and delivery do not remove social responsibility risk. If the supplier cannot clearly confirm safe conditions or responsibility for problems, the issue still matters. The unit stresses that responsible supply chain engagement should look beyond cost alone.",
            },
            {
              label: "2",
              text: "Replace the supplier immediately, even if they are important to your operations.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Immediate replacement is not always the best first move, especially when the supplier is important and willing to improve. The unit promotes a proportional SME approach, where suppliers can improve step by step instead of being removed automatically. A rigid reaction may also create unnecessary business disruption.",
            },
            {
              label: "3",
              text: "Classify the supplier as Improve, send one clear expectation, and ask for one concrete improvement within 90 days.",
              isCorrect: true,
              feedbackText:
                "Correct. This reflects the exact logic recommended in the unit. A supplier with gaps but willingness to improve belongs in the Improve group, not in the Keep or immediate Replace group. A clear improvement request and later follow-up create accountability without turning the process into a heavy audit.",
            },
          ],
        }),
      ],
    }),

    unitQuiz({
      unitSlug: "unit-3-governance-in-operational-decision-making",
      sortOrder: 3,
      title: "Unit 3 Self-assessment",
      description: "Self-assessment quiz for Unit 3: Governance in Operational Decision-Making.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 11 — You want to improve governance in daily operations, but you do not want to create a heavy system that people ignore. According to this unit, what is the most useful first step for increasing transparency and accountability in an SME?",
          answers: [
            {
              label: "1",
              text: "Write a full governance manual covering every possible situation.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A full manual may look comprehensive, but it is not the best starting point for a small business. It takes time, creates complexity, and may never become part of daily work. The unit recommends starting with the decisions that matter most, not documenting everything at once.",
            },
            {
              label: "2",
              text: "List the key decisions that happen often or carry risk, then map roles and approvals.",
              isCorrect: true,
              feedbackText:
                "Correct. This is the practical approach described in the unit. By identifying decisions linked to money, suppliers, complaints, safety, data, or people, you make governance operational and visible. A simple map of decision, role, and approval method reduces confusion and makes accountability much clearer.",
            },
            {
              label: "3",
              text: "Let managers continue deciding informally to keep the business flexible.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Informal decision-making may feel fast, but it often creates inconsistency and weak transparency. When people are not sure who owns a decision or how it should be approved, delays and blame-shifting become more likely. The unit specifically presents governance as a way to reduce this kind of confusion.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 12 — You are building a decision map for governance in normal operations. Which approach best supports long-term clarity and accountability when roles change or when staff are absent?",
          answers: [
            {
              label: "1",
              text: "Assign decisions to the most experienced named employee.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Using a person's name may seem practical in the short term, but it makes the system fragile. If that person changes role, is absent, or leaves the company, the process becomes unclear again. The unit clearly says responsibility should be linked to roles, not to individuals.",
            },
            {
              label: "2",
              text: "Assign responsibility to a role such as Operations Lead or Owner.",
              isCorrect: true,
              feedbackText:
                "Correct. Assigning responsibility to a role creates continuity and makes the system easier to understand. It ensures that the governance map still works even when staff members change. This is one of the unit's core operational governance principles because it improves both transparency and accountability.",
            },
            {
              label: "3",
              text: "Allow any available person to make the decision if needed.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Letting whoever is available decide may solve a short-term problem, but it weakens governance overall. It makes decisions harder to explain, compare, or review later. The unit stresses that clarity about ownership is what prevents confusion and inconsistent handling.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 13 — A customer complaint may lead to a refund and possible legal risk. The employee who received it is unsure whether they can decide, the team lead is busy, and the case stays unresolved for several days. Based on this unit, what is the main governance weakness in this situation?",
          answers: [
            {
              label: "1",
              text: "The company needs more customer advertising.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Advertising has nothing to do with the internal handling of a risky complaint. The main issue here is not visibility or image, but decision clarity and process control. The unit is about how decisions are made and what happens when the normal path is not enough.",
            },
            {
              label: "2",
              text: "The company lacks a clear escalation path with defined roles and response timing.",
              isCorrect: true,
              feedbackText:
                "Correct. This answer matches the unit directly. When a case is risky and people are unsure who should act or how quickly, the problem is a missing escalation path. The unit explains that clear triggers, first-level responsibility, next-level escalation, and timelines are what prevent exactly this type of delay.",
            },
            {
              label: "3",
              text: "The customer should be asked to wait until the next monthly review meeting.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Waiting for a later review is not a governance solution. It increases delay and can worsen both customer trust and operational risk. The unit recommends making escalation practical and timely, especially in cases involving money, complaints, safety, or ethics.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt:
            "Question 14 — You want to reduce corruption risk in operational decisions without introducing a complicated compliance system. Which of the following is the strongest basic control for purchasing and invoice handling in an SME?",
          answers: [
            {
              label: "1",
              text: "Allow verbal approval when the purchase seems urgent.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Verbal approval may feel fast, but it reduces traceability and makes later review difficult. When spending decisions are not clearly recorded, the risk of poor judgement or hidden pressure increases. The unit explicitly recommends avoiding verbal-only approval for important spending.",
            },
            {
              label: "2",
              text: "Let one person choose the supplier, approve the order, and confirm the invoice.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Giving one person control over the whole transaction creates a clear integrity risk. It makes the process more vulnerable to favouritism, pressure, or poor decisions hidden behind urgency. The unit uses this exact logic to explain why even small firms should apply at least basic separation of roles.",
            },
            {
              label: "3",
              text: "Separate the roles that request, approve, and check the transaction.",
              isCorrect: true,
              feedbackText:
                "Correct. This is a strong anti-corruption minimum rule because it makes decisions easier to check and harder to misuse. Even a simple separation between request, approval, and checking roles can improve integrity significantly. The unit presents this as a realistic and practical control, not a large-company-only solution.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            "Question 15 — You want employees to raise concerns about unethical behaviour, unsafe shortcuts, or unfair treatment before the situation becomes more serious. According to this unit, what makes a speak-up channel most credible and useful in an SME?",
          answers: [
            {
              label: "1",
              text: "Ask employees to raise concerns publicly in team meetings.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Public reporting may discourage people from speaking up, especially if the issue involves a manager, colleague, or sensitive situation. It can also create fear, conflict, or silence instead of trust. The unit recommends a channel that feels safe, confidential, and practical.",
            },
            {
              label: "2",
              text: "Provide one reporting channel, one backup receiver, a response promise, and a no-retaliation rule.",
              isCorrect: true,
              feedbackText:
                "Correct. This answer includes the exact elements the unit treats as essential for a lightweight but trustworthy speak-up process. A clear channel, backup option, response timeline, and protection against retaliation make concerns easier to raise and easier to manage. This turns governance into a working daily tool rather than an abstract principle.",
            },
            {
              label: "3",
              text: "Tell staff to report issues only if they are very serious and fully proven.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Requiring full proof or extreme seriousness sets the bar too high. Smaller concerns often matter because they show patterns early, before they become larger operational or reputational problems. The unit explicitly states that a speak-up channel is useful not only for scandals, but also for issues that need attention before they grow.",
            },
          ],
        }),
      ],
    }),

    unitQuiz({
      unitSlug: "unit-4-credible-esg-in-customer-communication-and-claims",
      sortOrder: 4,
      title: "Unit 4 Self-assessment",
      description:
        "Self-assessment quiz for Unit 4: Credible ESG in Customer Communication and Claims.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 16 — A company wants to communicate its ESG efforts to customers, but it is not sure whether its current message is credible or too promotional. According to this unit, which type of statement creates the highest greenwashing or social washing risk?",
          answers: [
            {
              label: "1",
              text: "We reduced packaging size for our top three products.",
              isCorrect: false,
              feedbackText:
                "Incorrect. This statement is relatively credible because it points to a specific operational change. A customer could understand what changed and the company could explain it if asked. The unit stresses that real actions are safer than broad identity-based claims.",
            },
            {
              label: "2",
              text: "We are a responsible and sustainable company.",
              isCorrect: true,
              feedbackText:
                "Correct. This is risky because it sounds broad and impressive, but it does not describe any concrete action. It is difficult to check, easy to exaggerate, and does not show what has actually changed in operations. The unit treats this kind of wording as a warning sign of weak ESG communication.",
            },
            {
              label: "3",
              text: "We now respond to complaints within five working days.",
              isCorrect: false,
              feedbackText:
                "Incorrect. This is a specific service commitment linked to daily operations. It is narrow, understandable, and possible to verify in practice. The unit recommends this type of concrete statement instead of vague value-based language.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 17 — You want to decide whether a customer-facing ESG message reflects a real improvement or only sounds good in marketing. Based on this unit, what is the most useful test to apply first?",
          answers: [
            {
              label: "1",
              text: "Check whether the wording sounds modern and positive.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Positive or modern language may make a message attractive, but it does not make it credible. A claim can sound strong and still be weak if nothing meaningful has changed in operations. The unit warns specifically against impressive words without factual support.",
            },
            {
              label: "2",
              text: "Check whether the message reflects a real operational change that can be explained.",
              isCorrect: true,
              feedbackText:
                "Correct. This is the key test recommended in the unit. The first question should always be whether a real process, service, packaging, repair, complaint, or communication practice has actually changed. If the company cannot explain the operational improvement clearly, the message is probably too strong.",
            },
            {
              label: "3",
              text: "Check whether similar claims are common on competitor websites.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Competitor practice is not a reliable credibility test. If others use vague or exaggerated wording, copying it only repeats the same problem. The unit focuses on evidence from your own operations, not on market fashion.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 18 — A company adds a green-looking slogan to its website and changes some label colours to look more natural, but it does not change packaging, delivery, repair, complaints handling, or customer information. According to this unit, what is the main risk in this situation?",
          answers: [
            {
              label: "1",
              text: "The message may be too short to attract attention.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The main issue is not the length of the message. A short message can still be credible if it describes a real and specific improvement. In this case, the problem is that the company is communicating image rather than substance.",
            },
            {
              label: "2",
              text: "The communication is stronger than the real operational change.",
              isCorrect: true,
              feedbackText:
                "Correct. This is exactly the type of mismatch the unit warns about. The visual or promotional layer has changed, but the underlying customer-facing operations have not. That creates a strong greenwashing or social washing risk because the business appears more responsible than its actual practice shows.",
            },
            {
              label: "3",
              text: "The business may need a larger marketing budget.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Spending more on marketing would not solve the credibility problem. In fact, stronger promotion without operational change could make the risk even worse. The unit clearly separates genuine improvement from pure promotional presentation.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt:
            "Question 19 — A business wants to communicate one ESG-related improvement to customers in a credible and proportionate way. Which of the following messages best follows the communication rules from this unit?",
          answers: [
            {
              label: "1",
              text: "We care deeply about people and the planet.",
              isCorrect: false,
              feedbackText:
                "Incorrect. This sounds positive, but it is too broad and not linked to any clear operational change. A customer cannot easily tell what the company actually did differently. The unit advises avoiding value-heavy language when no specific action is described.",
            },
            {
              label: "2",
              text: "Our service is ethical, sustainable, and responsible.",
              isCorrect: false,
              feedbackText:
                "Incorrect. This message uses broad labels, but it still does not explain what changed in practice. It may sound professional, yet it remains weak because it is not specific or checkable. The unit prefers action-based communication over identity-based wording.",
            },
            {
              label: "3",
              text: "We reduced repeat delivery trips by using tighter scheduling and clearer customer updates.",
              isCorrect: true,
              feedbackText:
                "Correct. This message is strong because it explains a clear operational change and a visible result. It is specific enough to be checked and proportionate to the kind of action taken. This is exactly the style of credible ESG communication promoted in the unit.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            "Question 20 — Before communicating an ESG action externally, a company wants to make sure the message is credible and not exaggerated. According to this unit, which filter should it apply before publishing the claim?",
          answers: [
            {
              label: "1",
              text: "Ask whether the message is specific, checkable, and proportionate.",
              isCorrect: true,
              feedbackText:
                "Correct. This is the core communication filter described in the unit. A good message should describe a real action, be possible to explain or verify, and match the actual scale of the change. These three checks help reduce the risk of greenwashing or social washing.",
            },
            {
              label: "2",
              text: "Ask whether the wording sounds bigger than the operational change.",
              isCorrect: false,
              feedbackText:
                "Incorrect. If the wording sounds bigger than the action, that is a warning sign, not a target. The unit explicitly advises matching the wording to the scale of the change. Exaggeration weakens credibility even when the underlying action is real.",
            },
            {
              label: "3",
              text: "Ask whether the message avoids mentioning operational details.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Avoiding operational detail usually makes an ESG claim weaker, not stronger. Without details, the message becomes vague and harder to trust. The unit repeatedly stresses that credibility comes from small, documented, operationally grounded improvements.",
            },
          ],
        }),
      ],
    }),
  ],
};
