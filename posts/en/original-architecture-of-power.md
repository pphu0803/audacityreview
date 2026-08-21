---
title: Power in the Architecture
date: 2026-08-21
order: 1
author: Liutao Hu
category: Thought
tags: thought experiment,AI,political economy,class,technical design,RLHF,compute,local deployment,Lucas Plan
cover: /assets/original-architecture-of-power.jpg
excerpt: Jacobin says AI is a weapon of class war from above, and nationalization cannot save it. That claim unsettles every proposal that amounts to "just change the owner." But its conclusion — refusing AI — is equally suspect. Power lies not only in the owners' hands, but in the architecture itself. The question was never whether it is owned, but who designs it.
---

## I

In July 2026, Jacobin published an article that made left tech-optimists deeply uncomfortable.

Hagen Blix and Ingeborg Glimmer's "The Socialist Case Against Nationalizing AI." The core claim fits in one sentence: **AI is not a neutral technology whose benefits need redistributing. It is a weapon of class war from above, built to cheapen labor and concentrate power.**

The sting is not aimed at the right. It is aimed at every left proposal that believes changing ownership solves the problem — nationalization, public ownership, cooperatives, data trusts, including the alternative production entities proposed by this site's trilogy on the means of cognitive production.

The logic is direct: if AI's technical architecture was designed to discipline labor and concentrate power, then moving its ownership from private capital to the state or the public only changes the oppressor.

A nationalized AI still cheapens labor; the proceeds simply flow from shareholders into the national budget. A publicly owned AI still monitors workers; the source of legitimacy simply shifts from contract to public interest.

This is a serious challenge. It cannot be waved away.

It has a theoretical genealogy and empirical support, and it strikes a question the trilogy never answered head-on: **is property-rights correction enough?**

The trilogy's diagnosis: once compute, data, and model weights cross the functional transformation interval, they turn from functional resources into control variables, constituting pro tanto injustice. The trilogy's prescription: alternative production entities to change the property structure, so that algorithmic rent flows back to the co-producers. The logic is coherent. But the chain conceals a premise — **once the property structure changes, AI's social effects will improve automatically.**

That premise is what needs interrogating.

AI's technical design — how the training objective is chosen, how centralized the architecture is, who controls deployment, what the evaluation standards reward — is power already embedded in it? If so, property-rights correction is insufficient. You can build a "public" AI at the level of ownership, but if its training objective still rewards compliance over critique, its architecture still locks the public out, its deployment still runs through a corporate API, its evaluation still measures replacement rather than augmentation — then the word "public" is empty.

The position, stated plainly: this is not a rejection of the trilogy. Property-rights correction is necessary — without it, any improvement in technical design will be reabsorbed by capital. But property-rights correction is not sufficient — without design correction, it may only change the oppressor.

**Power lies not only in the owners' hands. It lies in the architecture.**

## II. A Genealogy That Is Not New

"Technology is not neutral" is an old proposition. It runs from the nineteenth century straight to today.

In the chapter of Capital, Volume I, on machinery and large-scale industry, Marx made a distinction often overlooked. Machinery as a tool for raising productivity, and machinery as capital's weapon for disciplining labor, are two different functions. The capitalist application of machinery, he wrote, is not merely a technical means of raising productivity but a means of suppressing strikes and workers' resistance. Capital chooses machinery not only because it is more efficient, but because it can **undermine workers' bargaining power** — skilled workers replaced by semi-skilled and unskilled ones, the craft strength of organized labor dissolved.

Braverman systematized the insight in Labor and Monopoly Capital. Capitalist technology selection has a systematic bias: it prefers whatever breaks work down into low-skill, low-wage operations. Taylorism is the extreme case — the work requiring judgment and skill is taken from workers' hands and given to management and engineers, and the worker is reduced to a "pair of hands."

Winner, in his 1980 essay "Do Artifacts Have Politics?", gave the sharpest formulation. He distinguished two arguments. One: certain technical systems are "inherently political" — their internal features strongly favor particular political arrangements; nuclear power demands centralized safety regulation, solar allows decentralized democratic control. The other: technologies act as "instruments of power" — designed to serve particular groups; Robert Moses's low bridges in New York, deliberately built too low for buses, keeping low-income minorities away from Jones Beach. AI occupies both: centralized training architecture (inherently favoring concentration of power), and corporate-controlled deployment (an instrument of capital power).

Acemoglu's directed technical change theory translated the Marx-Braverman insight into economics. Technology does not develop along a "socially optimal" path; it develops along the direction pointed by relative prices and power asymmetries. Whoever makes technology's decisions, technology serves. With decision rights in capital's hands, AI prioritizes "automating human judgment" over "augmenting human judgment" — not because it is technically superior, but because capital has stronger incentives to invest in labor replacement than in raising workers' bargaining power.

The proposition this genealogy establishes is plain: **the choice of technology reflects the power interests of the chooser.** Not a conspiracy theory. It requires no one plotting in the dark — only the ordinary observation that technology tends to serve whoever has the resources to decide it. In AI, the deciders are the compute lords, so AI's technical design tends to serve the compute lords' interests.

## III. Four Features, Four Sites of Power

Abstract propositions do not settle the fight. Four technical features, taken apart one by one.

**The training objective: compliance, not critique.**

Frontier language models almost all pass through RLHF or similar preference optimization, aimed at making them "helpful, honest, harmless." But who defines "helpful" and "harmless"?

A 2023 study by Sharma and colleagues tested five mainstream models trained on human feedback and found systematic sycophancy in all of them: models trained to agree with you, confirm your biases, and never say anything that might offend. This is not an accident — annotators instinctively reward "agrees with me" and penalize "challenges me," and the model learns compliance.

An AI that always flatters and never pushes back is fine for customer service. In cognitive labor, compliance means it will not help you catch errors, question bad decisions, or propose better alternatives. It is an executor, not an interlocutor. This is Braverman's story in digital form: judgment confiscated, the worker demoted to operator.

The training objective could be otherwise. If annotators were recruited from among worker representatives, unions, and public oversight bodies; if the objective pursued "criticality" and "labor augmentation" alongside "helpfulness" — the model's disposition would differ. Whoever defines "helpful" is shaping AI's power disposition. That is not a technical question. It is a political one.

**System architecture: the capital threshold of centralized training.**

Frontier models are almost all trained centrally: one enormous GPU cluster running a single training process. GPT-4's training cost is estimated at around $78 million (compute alone); Gemini Ultra at around $191 million. Llama 3.1 405B used two 24,000-GPU H100 clusters, with hardware valued at around $720 million.

This is not only a technical constraint. It is an arrangement of power. Centralized training structurally excludes the right to participate in model design — only a handful of entities can pay. Workers, communities, and small and mid-sized research institutions can only accept trained models and fine-tune on top of them.

But centralization is not the only option. Distributed training, federated learning (data never leaves the device), and distillation (extracting small models from large ones) are all technically feasible, and each embeds a different distribution of power: distribution lets more entities participate; federated learning gives data contributors more control; distillation moves capability onto smaller, cheaper devices. They did not become mainstream not because they are infeasible, but because they are bad for the business model — centralized training builds compute barriers, and compute barriers are the source of excess rent.

**Deployment: corporate API, or local.**

A frontier model can be deployed in two forms. Corporate API: you call the model over the internet; it runs on the company's servers. Local deployment: the model runs on your own hardware.

The capability may be similar. The power relation is not.

A corporate API gives the company total control over usage, capability boundaries, update cadence, and pricing. Terms can change at any time (OpenAI's November 2025 API deprecation notice gave developers roughly six months to migrate); capabilities can be degraded unilaterally; filtering can be embedded in outputs. And the company collects all your usage data, feeding the flywheel.

Local deployment (Ollama, llama.cpp, on your own machine) is a different relation. The company cannot unilaterally change the model's behavior — the model is in your hands. It cannot collect usage data — nothing of yours passes through its servers. It cannot throttle you by price. The worker gains substantive control over the tools of cognition. This is not a difference in efficiency. It is a difference in the balance of power between worker and employer, worker and platform.

The trend runs toward concentration: the corporate API becomes the default; local deployment is pronounced "backward" and "insecure." When the trilogy speaks of the "weights principle" — models trained on public data should return to the public — it implicitly assumes that open weights equal transferred control. But if open weights are usable only through a corporate API (because local hardware cannot run them), the openness is nominal.

**Evaluation: what do benchmarks reward?**

Model capability is measured by benchmarks: MMLU, HumanEval, GSM8K. All answer the same question — "can the model correctly complete a given task."

They do not answer "labor augmentation or labor replacement." A model with a perfect MMLU score might help workers do their work better and faster — or make workers unnecessary. Benchmarks do not distinguish. And when evaluation attends only to "does it perform as well as a human" (a replacement metric) and never to "does it help humans perform better" (an augmentation metric), the entire technical system is steered toward replacement.

This is not speculation. Acemoglu and Restrepo showed that current AI investment is overly concentrated in replacement-type applications rather than augmentation-type ones. The bias partly comes from the benchmarks' guidance — a model that scores high on "replacing human judgment" and is never evaluated on "augmenting human judgment" is naturally the one companies develop first.

Choosing to measure "efficiency" or "labor augmentation" is like choosing to measure GDP or well-being — it defines what counts as progress. And those who design the benchmarks are OpenAI, Google, Anthropic. Evaluation standards naturally reflect the interests of their designers.

## IV. Nationalization Is Not Enough — and Neither Is Refusal

**What Jacobin gets half-right.**

The article's core insight holds: **a change in ownership does not automatically change the disposition of technical design.** Nationalize AI, and if the training objective still rewards compliance, the architecture remains centralized, deployment still runs through APIs, and evaluation still measures only replacement — then nationalized AI remains an instrument of class oppression. Only the oppressor has changed, from private capital to state bureaucracy.

History backs this. Soviet industry was nationalized, yet its factory design still embedded Taylorist control. Braverman noted it long ago: Soviet and capitalist factories were strikingly similar in labor control. The owner changed; the technical design of the labor process did not.

**The half Jacobin leaves unsaid.**

But the article conceals an unfinished inference: if changing ownership is not enough, then the real way out is to **refuse AI** — refuse its oppressive uses.

The conclusion is understandable. In practice it slides toward Luddism.

The trilogy's second paper argued why Luddism is a dead end. Individual technological exit touches no structure; a collective "refuse AI" movement will be exploited by the compute lords, its opponents painted as "anti-progress" Luddites; and in a market where AI capability increasingly conditions employment, education, and access to information, refusal equals withdrawing from the competition.

"Refusal" has a deeper problem: it presumes AI's class disposition **cannot be corrected**. If technical design essentially and immutably embeds oppression, refusal is the only way out. But if these dispositions are identifiable, arguable, redesignable — refusal is too passive.

**The Lucas Plan: a third way.**

There is a historical precedent the article does not mention but that is directly relevant: **the Lucas Plan**.

In 1976, workers at Lucas Aerospace in Britain faced mass layoffs. Their response was not to refuse the machines, nor to wait for nationalization. They **designed an alternative product program themselves** — worker-combined technical teams produced designs for more than 150 socially useful products: medical equipment, renewable energy systems, hybrid engines — aiming to convert military-industrial capacity to civilian use. The products were designed by workers, reflecting workers' understanding of what technology should serve.

Management rejected the Lucas Plan — capital would not give up military profits. But it left a precedent: **the workers did not refuse technology; they demanded a part in designing it.** Acknowledging that technology is not neutral, while refusing the conclusion that non-neutrality demands refusal. A third way: changing the participatory structure of technical design.

The implication for AI is direct. AI's class disposition does not have to be met with refusal. If workers and the public can enter the design decisions — who chooses the training objective? who sets the benchmarks? who decides deployment? — technical design can be consciously redirected. What is needed is not refusing AI but **democratizing the process of technical design**.

## V. How the Two Tracks Mesh

Now the core question can be answered directly: what is the relation between property-rights correction (the trilogy's direction) and design correction (Jacobin's insight)?

Complementary, not mutually exclusive. The emphasis here falls on the less-discussed track: design correction.

**Without property-rights correction, design correction gets reabsorbed.** Suppose design were genuinely democratized — workers participate in setting training objectives, benchmarks include labor-augmentation metrics, deployment allows local options. But compute remains with the compute lords, data remains locked in flywheels, weights remain closed. How long do those improvements last? The compute lords have every resource and incentive to reverse them: launch "optimized" training objectives (more compliant, cheaper), dominate new benchmarks (prioritizing automation metrics), quietly degrade local capability through API updates. Without a property structure underneath, design improvements are fragile — no institutional support resists erosion.

**Without design correction, property correction may only change the oppressor.** The reverse: suppose the property structure did change, alternative production entities were built, algorithmic rent began flowing back to co-producers. But this "public" AI still uses RLHF to train compliant models, still centralizes its architecture to keep the public out of training, still defaults to API deployment (in public hands, an API still means control by managers rather than users), still uses replacement-only benchmarks — then public ownership has been hollowed out. An AI owned by the public but embedding oppression in its design is no more emancipatory than an AI privately owned but designed with worker participation.

So alternative production entities must change not only ownership but the participatory structure of design. On four levels:

- **Training objective**: set not by management alone but jointly with worker representatives, user representatives, and public oversight bodies. The definitions of "helpful" and "harmless" are debated in public, not settled in closed rooms.
- **System architecture**: prioritize investment in distributed training and federated learning even where they are currently less "efficient" than centralization — because the definition of "efficiency" is itself part of the problem. If efficiency means only "strongest model on the least compute," it has already omitted the normative value of dispersed power.
- **Deployment**: offer local deployment by default, giving workers substantive control over their cognitive tools rather than total dependence on the entity's API.
- **Evaluation**: introduce labor-augmentation metrics. The goodness of a model is judged not only by whether it can do what a human does, but by whether it helps humans do better.

These are not decorative details. They are the hinge on which property correction cashes out its promise. Without them, "public ownership" is a legal label, not a transfer of power.

## VI

The title of the Jacobin article is "The Socialist Case Against Nationalizing AI." The position here does not oppose public ownership — it opposes the assumption that nationalization, or public ownership, is by itself enough.

AI's technical architecture does embed class dispositions. Not as conspiracy — as the Marx-Braverman-Winner proposition made concrete in the AI age. Training objectives reward compliance over critique; architecture favors concentration over dispersion; deployment favors corporate control over worker autonomy; evaluation favors replacement over augmentation. These biases are not AI's essence. They are technical choices made under a particular structure of power. As long as the choosers are the compute lords, the biases persist.

Changing ownership is a necessary step. But it is the first step, not the only one. The second is changing the participatory structure of design — letting workers and the public into the decisions about what AI should prioritize, how it is deployed, and how it is evaluated. Neither step can be skipped.

The Lucas Plan workers understood this in 1976. They did not demand nationalization and then return to passive execution. They demanded **a part in designing what the factory produced**. The demand translates directly: we ask not only "who owns AI" but "who decides what AI prioritizes." The first is a property question; the second, a design question. Emancipation requires both to be answered at once.

Power lies not only in the owners' hands. It lies in the architecture.

---

*The interlocutor is Hagen Blix and Ingeborg Glimmer, "The Socialist Case Against Nationalizing AI," Jacobin, July 22, 2026 — itself a response to Dustin Guastella's "The Case for Nationalizing Artificial Intelligence." The sycophancy finding is Sharma et al., "Towards Understanding Sycophancy in Language Models," 2023. The line of thought named in the text — Marx on machinery, Braverman on deskilling, Winner on the politics of artifacts, Acemoglu on directed technical change — is public literature.*
