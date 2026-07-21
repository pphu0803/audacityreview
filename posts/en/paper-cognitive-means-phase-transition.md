---
title: Phase Transitions in the Means of Cognitive Production: Arguing the Injustice of Excessive Concentration in AI Infrastructure
date: 2026-07-18
order: 13
author: Liutao Hu
category: Thought
tags: thought-experiment,philosophy,AI,political-economy,platform-capitalism,phase-transition,cognitive-production-means
cover: /assets/paper-cognitive-means-phase-transition.png
excerpt: Compute, data, and model weights constitute the "means of cognitive production" of the AI era. Upon crossing a functional transition zone, these three carriers shift from tools of training and inference into control variables that constrain the feasible sets of others, producing a three-class structure of "compute lords—cognitive serfs—cognitively excluded," which constitutes a pro tanto injustice and escalates into a violation of basic rights when it reaches cognitive exclusion. Diagnosis only, no prescription.
series: Means of Cognitive Production Trilogy
seriesOrder: 1
---
## I. Introduction: The Extension Problem of Phase Transition Theory

Prior work, *The Legitimate Upper Bound of Wealth*, traced the following argumentative path: when personal wealth crosses a certain threshold, it undergoes a phase transition from a direct living resource into a control variable that constrains the feasible sets of others. This phase transition is not limited to natural persons; it also occurs at the level of legal persons. It constitutes a pro tanto injustice: through institutional capture, rules are distorted and the choice space of others is compressed. When compression touches the baseline of subsistence, the injustice escalates into a violation of basic rights. The diagnosis deliberately stops at diagnosis.

The object of argument in prior work was **wealth in the traditional sense**: disposable resources carried by currency, equity, and real estate. The starting point of this article is an unavoidable extension problem:

**If the essence of the phase transition is "the slide of resources from functional use into control use," then does this mechanism occur only with traditional wealth?**

A kind of resource is rising, and its economic importance is approaching that of traditional capital, but it is not currency, nor equity, nor real estate. It is the compute power, data, and model weights required to train frontier AI models. These resources are reorganizing the cognitive production capacity of contemporary society: who can produce knowledge, who can only consume knowledge, and for whom even the qualification to consume depends on others' infrastructure. If these resources also exhibit a phase transition mechanism similar to that of wealth, then the diagnosis of prior work must be extended.

This article argues: **The means of cognitive production also undergo a functional transition. Moreover, due to certain distinctive properties of AI technology (especially the zero marginal reproduction cost of model weights), its transition is, in certain dimensions, deeper than that of traditional wealth and harder for existing institutional frameworks to capture.**

The argumentative strategy remains consistent with prior work: **start from mainstream frameworks and push them to conclusions that exceed their usual reach.** The tools used in this article come from industrial organization economics (barriers to entry, network effects, two-sided markets), public choice theory (regulatory capture, rent-seeking), Rawlsian distributive justice (extended application of the difference principle), and critiques of platform capitalism (Srnicek, Zuboff). These tools are sufficient to complete the diagnosis, but the normative implications of the diagnosis (the three-class structure, the claim that algorithmic rents should be redistributed, and the claim that cognitive exclusion constitutes a violation of basic rights) are more radical than the conclusions these frameworks typically support. This article does not conceal this.

A distinction must first be clarified, one that marks the key difference between this article and the existing platform-critical literature. The core mechanism diagnosed by Srnicek in *Platform Capitalism* is **data extraction**: platforms extract data from user behavior as raw material to be processed and monetized [1]. Within that framework, users remain users of services; it is only the byproducts of their behavior that are expropriated without compensation. The mechanism diagnosed in this article is different. When an AI provider offers inference services for free while concentrating the capacity to train frontier models behind insurmountable compute barriers, what occurs is not merely data extraction. What occurs is: **even as users are conscripted as data producers, they simultaneously lose the economic rationality of autonomously producing cognitive capacity.** This is not "use—being observed," but "dependence—being locked in." The core proposition of this article is: structural inequality in the AI era has its roots not in data extraction (the surface layer), but in the concentration of the means of cognitive production themselves (the deep layer).

---

## II. The Means of Cognitive Production: Concept and Triple Carriers

### 2.1 Conceptual Definition

The **means of cognitive production** refers to all the material and social conditions required to train, improve, and deploy frontier AI models. This concept is a concretization of the Marxist "means of production" in the domain of cognitive production. In the industrial era, the means of production were factories, machines, and raw materials; in the early information era, Srnicek identified them as platforms and data. In the AI era, the means of cognitive production have a more complex structure, constituted by three carriers, each with distinct economic properties and distinct phase transition mechanisms.

1. **Compute**: the computational hardware, energy, and cluster infrastructure required to train and run frontier models.
2. **Data**: text, code, images, multimodal corpora, and their organizational forms used for pre-training, fine-tuning, and alignment.
3. **Model weights**: the parameter set produced by the training process, serving as the material carrier of model capability.

### 2.2 Why Exactly Three: Necessity and Joint Sufficiency

**Why three, and not two or five?** This question cannot be evaded, for if the tripartite division of carriers is merely a descriptive convenience, then any reviewer could ask "why not list energy separately" or "why not list talent separately," thereby dismantling the precision of the entire analytical framework. This article's answer is: the three carriers constitute **complementary bottlenecks** of the cognitive production process—they are necessary, and jointly sufficient.

**Necessity**. The complete production chain of a frontier AI model can be decomposed into three irreducible links: training (requiring compute), learning (requiring data), and capability hosting (requiring weights as the material carrier of training outcomes). Remove any one carrier, and the production chain becomes physically impossible to complete: without compute, training cannot run; without data, the model has nothing to learn; without weights, training outcomes have nothing in which to materialize. The three carriers respectively lock down three independent nodes of the cognitive production process, each an inescapable bottleneck.

**Joint sufficiency**. Controlling all three carriers amounts to complete control of the cognitive production process. The converse also holds: so long as one carrier remains beyond control, it becomes an escape channel for resistance. Control compute and data but open weights, and the community can fine-tune, distill, and build alternative ecosystems on open weights; control compute and weights but leave data unguarded, and competitors can train models that surpass on certain dimensions through unique data sources (domain-specific corpora, low-resource language data); control data and weights but leave compute unguarded, and competitors can purchase compute to retrain. It should be noted that the relationship among the three carriers is not only **complementary** (each independently constraining a link in the production process) but also **synergistic**: the control power generated by controlling all three far exceeds the sum of the control power from controlling any two, because the synergy of the three enables the holder to simultaneously lock down entry (compute), improvement (data), and deployment (weights), forming a closed loop that the opening of any single link cannot dissolve. **The synergistic nature of the three bottlenecks means that breaking any single bottleneck is insufficient to dismantle concentration, while maintaining the openness of any single bottleneck is sufficient to preserve space for resistance.** This synergistic structure runs through the entire article: it serves as the foundation both for the subsequent diagnosis of the three-class structure and institutional capture, and for the conclusion that any strategy of resistance and institutional design must be multi-dimensional.

**Why not more**. Other candidate variables are either absorbed by one of the three carriers or lack the property of phase transition (the slide from functional resource to control variable). Energy is the material prerequisite of compute; as an independent bottleneck, it is absorbed by compute. Energy cost is the primary component of compute cost, and energy constraints and compute constraints are, in the productive sense, the same constraint. Distribution and deployment infrastructure (API gateways, inference optimization layers) is a downstream extension of weights; it does not constitute an independent production bottleneck but is rather the engineering realization of weight control. Talent is a more complex case: the loss of top researchers is indeed a channel of capture (discussed in Section V), but talent is not a "means of production." The transfer of a researcher does not alter the feasible sets of others in the way that the enclosure of weights does, because the knowledge a researcher creates (once published) is public. The privatization of talent affects the speed of knowledge production, not the property-rights structure of the means of production. Talent is a question of labor quality, not a question of ownership of the means of production. This distinction guards the boundary of the three carriers: this article analyzes the ownership of the means of production, not the distribution of labor.

The complementary bottleneck framework also carries an important corollary: it explains why single-variable correction is doomed to fail. If the three carriers are complementary bottlenecks, then breaking one of them (e.g., compute antitrust) will see concentration re-established by the other two (the data flywheel and weight enclosure). This corollary appeared in prior work (the legal-person phase transition argument) in the form of "any constraint targeting only one level cannot interrupt the phase transition mechanism itself," and reappears in this article in a more precise form: the three bottlenecks constitute a complementary system, and local perturbations are absorbed by other parts of the system. This structural complementarity means that any corrective scheme must simultaneously cover all three carriers; single-dimensional reform is destined to be offset by concentration in other dimensions.

### 2.3 The Reproduction Economics of the Triple Carriers

- **Compute** has a **high** marginal reproduction cost. Building a cluster of tens of thousands of GPUs requires tens of billions of dollars in cutting-edge hardware procurement, years of infrastructure construction, and accompanying energy supply. The electricity demand of a large data center can reach hundreds of megawatts to the gigawatt level. Compute exhibits traditional economies of scale: the larger the scale, the lower the unit computation cost. This means compute is naturally inclined toward concentration.
- **Data** has a marginal reproduction cost **close to zero** (once digitized), but the **production** cost of data is not equal to its reproduction cost; the acquisition and cleaning costs for high-quality, domain-specific, multilingual aligned datasets are substantial. The key point is that the value of data exhibits a strong **flywheel effect**: the more users a model has, the more behavioral data is generated, the more the model improves, the more users it attracts. Data is thus not merely a resource but a self-reinforcing monopoly mechanism.
- **Model weights** have a marginal reproduction cost that is **exactly zero**. A completed weight file can be losslessly copied onto any number of storage media and distributed to any number of recipients without incurring any marginal production cost. This is the fundamental difference between AI technology and all prior industrial technologies: **the reproduction of the core productive force is technically costless.**

The differences in reproduction economics across these three carriers determine their respective phase transition forms and also determine that any corrective measure must be designed for the specific properties of each. This is the fundamental difference between this article and single-variable analyses ("it's all about compute" or "it's all about data").

### 2.4 The Mutual Reinforcement of the Triple Phase Transitions

The three phase transitions are not independent; they reinforce each other:

Compute concentration → training stronger models → models attracting more users → users generating more data → data improving models → attracting more users → generating more revenue → investing in more compute → ...

Each link in this cycle intensifies the concentration of the next. Section 2.2 argued from a static perspective that "breaking a single bottleneck is insufficient to dismantle concentration"; this section provides its dynamic mechanism: the positive feedback loop ensures that any single-point opening or dispersion is absorbed by the other links. The static complementary bottleneck structure and the dynamic positive feedback loop are two faces of the same phenomenon.

---

## III. The Phase Transition Mechanism: How Each of the Triple Carriers Undergoes Transition

**A methodological clarification regarding the concept of "phase transition."** This article uses the term "phase transition" to denote a **salient shift** in the function of a resource: within a certain interval, the primary function of a resource shifts from being a tool for "maximizing one's own utility under given rules" to being a tool for "rewriting the rules themselves and altering the choice space of others." This term is borrowed from the convention in complexity economics (W. Brian Arthur, 1989), not from the strong sense in statistical physics that demands strict discontinuity (abrupt changes in order parameters, bifurcations). In the threshold tradition of economics and political economy, Hansen (2000)'s threshold regression, Marwell & Oliver (1988)'s critical mass theory, and Centola et al. (2018)'s empirical evidence on tipping points in social norms, "threshold" marks a **regime change in which function alters its character significantly within a certain interval**, not a mathematically discontinuous point. This article follows this tradition: the goal of the argument is not to prove the existence of a precise discontinuous phase transition point, but to prove **the existence of an interval within which function significantly changes** (a critical interval), within which the primary use of a resource slides from functional resource to control variable, and where the moral significance of this transition is substantive, altering the strength of the holder's claim to moral protection for excessive concentration.

This methodological positioning carries an important normative implication. The argumentative force of pro tanto injustice does not depend on a binary claim that "the moral status before and after the threshold is fundamentally different" (which would require strict discontinuity), but on a gradient claim: **as the function of a resource slides from functional resource to control variable, the holder's claim to moral protection for excessive concentration gradually weakens.** At the shallow end of the transition zone, this weakening is slight; at the deep end, it is substantial; when the transition touches basic rights (such as cognitive exclusion), the injustice escalates from pro tanto to a structural violation. This is a continuous change in moral weight, not a discontinuous switch. Acknowledging this does not weaken the argument; on the contrary, it makes the argument more honest and harder to shake through demands to "identify the exact phase transition point."

### 3.1 The Compute Phase Transition

Below a certain scale, compute is a **functional resource**: it is used to train models, run inference, and provide services. Firms that hold compute use it to produce the AI capabilities they sell, just as factories use machines to produce goods.

When compute scale crosses a specific threshold, its function undergoes a phase transition. Additional compute is no longer used merely to expand one's own production capacity; it begins to alter the feasible sets of others:

- **Erecting barriers to entry**: When the training cost of a frontier model reaches hundreds of millions to billions of dollars (the training cost of a GPT-4-class model is estimated at over 100 million dollars), any potential competitor unable to mobilize compute at this scale is structurally excluded from the frontier model arena. Compute scale becomes the physical threshold of market entry.
- **Creating "kill zones"**: Players with overwhelming compute advantages can rapidly replicate or absorb any startup's innovations, strangling them with free or subsidized services before they can establish market position. This mechanism appeared in concentrated, observable form in 2024 through the **"pseudo-acquisition"** pattern: Microsoft licensed Inflection AI's models for approximately 620 million dollars and hired over 80% of its team; Amazon absorbed roughly 66% of Adept AI's team for approximately 330 million dollars; Google absorbed Character.AI's founding team in a similar pattern. These transactions deliberately circumvent the thresholds of traditional merger review (the "trifecta" of licensing technology + hiring teams + minority equity). The FTC, the UK CMA, and the EU have all opened investigations. **But it must be honestly noted**: kill zones as an **industry practice** are observable, but their macro net effect remains contested in the empirical literature. Kamepalli, Rajan & Zingales (2020)'s original paper proposed the hypothesis; a 2024 follow-up study in *Management Science* formally proved that acquisitions can create kill zones, but Prado & Bauer's empirical study found a **positive** causal effect of Big Tech acquisitions on VC and innovation activity, and Barnett's review (U. Chicago Business Law Review, 2024) considers the overall evidence **weak**. The argument of this article does not depend on whether the macro net effect of kill zones is positive or negative. It requires only a weaker proposition to hold: compute advantages **provide** the **capacity** to suppress or absorb competitors, and regardless of how frequently this capacity is exercised, its very existence already constitutes a potential compression of the feasible sets of others.
- **Capturing downstream dependents**: When cloud compute services become concentrated, the entire AI startup ecosystem that depends on cloud compute is brought under the rules of a few infrastructure providers. Compute providers can unilaterally change pricing, access conditions, and data policies; downstream dependents have virtually no bargaining power.

The threshold of the compute phase transition is defined by the minimum effective compute scale required to train a frontier model. Below this scale, compute cannot produce a competitive frontier model; above this scale, compute begins to systematically determine who can enter the arena, who is excluded, and whose innovations can survive. Epoch AI's data shows that from 2010 to 2024, the training compute of frontier language models grew at approximately 4–5 times per year, with training power demand growing at roughly 2.2–2.9 times per year. Correspondingly, the training compute cost of a single frontier model has leapt from approximately 4 million dollars for GPT-3 (2020) to approximately 78 million dollars for GPT-4 (2023) and approximately 191 million dollars for Gemini Ultra (2024) (Stanford HAI 2024 AI Index estimates, compute cost only) [3]. The threshold accelerates, and those who can cross it dwindle. This is a typical feature of a phase transition.

It is worth emphasizing that this functional transition zone is not merely a theoretical construct of this article; it already has **institutional empirical approximations**. The Biden Administration's Executive Order (EO 14110), California's SB 1047 (though not passed, its threshold design was inherited by subsequent legislation), and the EU AI Act jointly adopted **10²⁶ FLOP** (i.e., 10 to the 26th power floating-point operations) as the regulatory threshold for "frontier models," requiring models crossing this threshold to bear additional safety and transparency obligations. Epoch AI's data shows that as of 2025, roughly 2 public models had crossed this threshold; approximately 10 are projected for 2026, and potentially over 200 by 2030 [3]. Regulators are already using a certain threshold to distinguish "frontier models requiring special governance" from other models, which aligns with the diagnostic direction of this article: the threshold marks not a difference in quantity but a change in the character of function. The entities capable of crossing the threshold constitute an "extremely narrow set," so described in a 2025 Carnegie Endowment report, and Stanford HAI's 2025 AI Index data shows that nearly 90% in 2024 and over 90% in 2025 of "notable AI models" came from industry rather than academic or public research institutions. This is not the neutral result of "market survival of the fittest," but the structural consequence of the functional transition of compute: the cost of crossing the threshold has become so high that only an extremely small number of entities can bear it.

### 3.2 The Data Phase Transition

Below a certain scale, data is a **functional resource**: the material needed to train models.

When data accumulation crosses a specific threshold, its function undergoes a phase transition. The key mechanism is the self-reinforcement of the **data flywheel**:

- A model with more users obtains more feedback data; the improved model attracts more users; more users generate more data. Once this positive feedback loop reaches critical scale, any competitor lacking a comparable user base cannot catch up in data quality, **regardless of how much compute it invests**.
- The data flywheel not only compresses the feasible sets of competitors but also compresses the **feasible sets of users**: when the data advantage of a certain model makes it the de facto standard, users cannot migrate to alternatives even if they wish to, because the model quality gap of the alternative is insurmountable.
- The data phase transition also manifests as the **conscription of data producers (users)**. When users use free inference services, their behavior (query patterns, preference feedback, error correction) becomes key data for model improvement. Users believe they are "using" a service, but in fact they are simultaneously being "expropriated" as data producers. This expropriation is concealed: users receive no return for their data contribution and are not recognized as participants in the production chain.

The threshold of the data phase transition is harder to quantify than that of compute, but its existence can be guaranteed by a weak proposition: **there exists a data scale beyond which additional data is primarily used not to improve the holder's own model, but to lock in competitors and users.** The logic of this proposition is consistent with prior work: the marginal output of a resource undergoes a nonlinear leap somewhere, shifting from "improving oneself" to "constraining others."

### 3.3 The Model Weights Phase Transition

Model weights are the most distinctive of the three carriers, because their marginal reproduction cost is zero.

Under certain conditions, model weights are a **functional resource**: the product of the training process, used to deploy inference services.

When the **enclosure** of model weights crosses a specific threshold (i.e., the weights of a frontier model are not publicly available and its ecological position is sufficiently dominant), the function of weight enclosure undergoes a phase transition, shifting from "protecting one's own commercial interests" to "controlling the entire ecosystem":

- **API control**: The holder of closed-source weights can unilaterally determine the cost structure and capability boundaries of all downstream applications through API pricing, access restrictions, and terms of use.
- **Control over fine-tuning rights**: If the holder only opens limited fine-tuning interfaces (or even fully closes gradients), the fine-tuning assets of downstream developers are locked onto the holder's base and cannot be migrated.
- **The power to define standards**: When a closed-source model becomes the de facto standard, the holder acquires the power to define criteria for evaluating AI capabilities, safety standards, and alignment standards.

The model weights phase transition has a unique feature: **its correction cost is the lowest, but the political resistance is the greatest.** Because the marginal reproduction cost of weights is zero, "mandating the disclosure of weights" (requiring models trained on public data to release their weights in some form) is technically almost costless. Copying a weight file does not consume any scarce resource. If correcting the compute phase transition requires confronting the high material cost of "building public compute," and correcting the data phase transition requires confronting the complex legal design of "data trust institutions," then **correcting the model weights phase transition requires material costs close to zero**. What it requires is merely a change in property-rights rules. This means: among the three phase transitions in AI infrastructure, the model weights phase transition is the easiest to correct technically, but precisely because its correction is almost costless materially, the resistance to correction comes entirely from politics: the vested interests in the excess rents generated by maintaining weight enclosure.

### 3.4 The Existence of the Transition Zone

Prior work, in arguing for the wealth threshold, introduced the concept of a "transition zone": between the decline of direct use function and the rise of control function, there exists an interval within which the character of wealth slides from a living resource to a control variable. This article does not need to define precise transition zone boundaries for each of the three carriers; it only needs to demonstrate the existence of the transition zone.

For compute: there exists an interval within which compute is simultaneously used to expand one's own production and begins to be used to erect barriers to entry. The former saturates as compute grows (diminishing marginal returns; there is an upper limit to how much compute a single enterprise can productively absorb), while the latter accelerates significantly at the threshold (once crossed, it begins to systematically alter the feasible sets of others).

For data: there exists an interval within which data is simultaneously used to improve one's own model and begins to be used to lock in competitors and users. The former saturates as data grows (diminishing marginal improvement of models on specific tasks), while the latter accelerates significantly at the critical point of the flywheel.

For model weights: the definition of the transition zone is more distinctive, because the phase transition of weights is not triggered by "accumulation to a certain quantity" but by "enclosure at a certain ecological position." When a set of weights has just been released and has not yet accumulated ecological dependence, its enclosure does not constitute control; when it becomes the dominant ecological standard, enclosure constitutes control over the entire ecosystem. The transition zone is the process of ecological dependence rising from low to high.

The precise boundaries of each transition zone need not be delimited; they may vary depending on the technological environment, market structure, and legal framework. What matters is: **there exist intervals within which the character of the means of cognitive production slides from functional resources to control variables.** The intensity of pro tanto injustice increases with the depth of the transition zone. As stated in the methodological clarification at the beginning of Section III, the concept of "phase transition" in this article refers to an interval of significant functional change, not a discontinuous binary switch. Precisely for this reason, the argument for the existence of the transition zone does not require precisely locating an inflection point; it only requires demonstrating the existence of the transition interval.

---

## IV. The Three-Class Structure: The Human Consequence of the Phase Transition

The phase transition diagnoses resources. But the phase transition of resources ultimately materializes as power relations among persons. This section derives the three-class structure from the triple phase transition.

### 4.1 Compute Lords

**Compute lords** are the few entities that control the means of cognitive production after the phase transition. They possess (or control) compute above the threshold, dominant data flywheels, and enclosed frontier model weights. They need not control all three simultaneously, but must control at least one or two sufficient to constitute a phase transition.

The core power of compute lords does not lie in their "owning AI," but in their **ability to determine whether, under what conditions, and under what rules others can participate in cognitive production**. This is identical in character to the power wielded by wealth holders after the phase transition in prior work: not consuming more, but rewriting the feasible sets of others.

Relations among compute lords are not simply competitive. A tension exists among them: on the one hand, they compete for ecological dependence (competing for developers, enterprise users, data contributors); on the other hand, their interests are aligned in maintaining the fundamental rule that "the means of cognitive production should be privatized." This very tension is a potential fissure for resistance.

### 4.2 Cognitive Serfs

**Cognitive serfs** are the middle layer of the three-class structure. They are the primary users of AI services and simultaneously the primary producers of data. They enjoy free or low-cost inference services, thereby gaining significant cognitive capability enhancements. But this enjoyment comes at a cost: even as they use services, they lose the capacity and economic rationality to autonomously train frontier models.

The "serf" analogy is precise. Serfs in the feudal era cultivated the lord's land, paid rent to the lord, and in exchange obtained the right to use the land. The serf was neither a slave (he possessed a certain freedom) nor a landlord (he did not own the land). His situation was defined by his dependence on the land as a means of production. Cognitive serfs build their own applications, workflows, and fine-tuning assets on the compute lords' "base" (foundation models), pay "algorithmic rent" to the lord (API call fees, data contributions, ecosystem lock-in), and in exchange obtain the right to use the base. The serf is not wholly excluded (he can use services), nor is he a lord (he does not control the base). His situation is defined by his dependence on the means of cognitive production.

The key point of analogy lies in **dependence**: the serf's accumulation (fine-tuning assets, applications, clients) is all built on the lord's base; once the base's rules change (price increases, degradation, interface closure), the serf's accumulation depreciates or is wiped out. This dependence is structural, independent of the serf's individual effort or talent. But there is a key difference between cognitive serfs and feudal serfs, a difference that leaves room for resistance: **the cognitive serf's "human capital" (skills in using AI, domain knowledge, problem-definition capacity) is portable.** A skilled serf can migrate among different lords' bases, if he possesses portable toolchains and standardized fine-tuning assets.

### 4.3 The Cognitively Excluded

**The cognitively excluded** are the most marginalized group in the three-class structure. They are not serfs who "use less," but people who **cannot enter the cognitive production-consumption cycle at all**. Their exclusion is due not to individual choice but to structural conditions:

- **Linguistic exclusion**: Frontier models perform extremely poorly on low-resource languages. Of the approximately 7,000 languages in the world, the vast majority are nearly invisible in mainstream AI models. Empirical research shows that even for open-source models, the LoRA fine-tuning error rate on languages like Yoruba still exceeds 60%, because the base model's representation space for these languages is essentially noise [4].
- **Infrastructure exclusion**: Stable internet access, adequate terminal devices, and affordable data traffic are prerequisites for using AI services. Billions of people globally still lack these conditions.
- **Economic exclusion**: Even where free inference exists, many advanced capabilities requiring payment are inaccessible to low-income groups.
- **Literacy exclusion**: Effective use of AI requires a certain level of digital literacy and language ability, which constitutes an additional threshold.

The situation of the cognitively excluded is more severe than that of cognitive serfs. Serfs at least gain capability enhancements even as they are conscripted; the excluded lack even the qualification to be conscripted. Many discussions of "AI inequality" default to a binary "user—non-user" framework, reducing all inequality to "differences in access." But the three-class structure reveals that **access differences are merely differences within the serf class, and beneath the serfs there is a fundamentally excluded stratum whose situation cannot be resolved through "expanding access."** Offering free inference to a person whose native language is not supported by the model amounts to offering nothing at all.

### 4.4 Key Differences Between the Three-Class Structure and the Traditional Class Structure

The three-class structure differs from the traditional capital-labor class structure in several key respects.

The most salient difference is that conscription replaces dispossession. Traditional capitalism produces classes through overt dispossession (enclosure movements, colonial plunder, extraction of surplus value). Compute lords produce classes through **free conscription**: they do not force you to use; they make you voluntarily use, because the cost of not using is higher. Free inference is the core tool of conscription; it eliminates the price barrier to use, rendering refusal irrational. This voluntariness conceals structural dependence lock-in.

Accompanying conscription is the illusion of mobility. The boundaries of the traditional class structure are relatively rigid. The boundaries of the three-class structure appear fluid: any serf can "learn AI" to become an advanced user and can even found an AI company to become a quasi-lord. But this mobility is selective, rare, and amplified into the ideology that "anyone can do it." The overwhelming majority of serfs can never cross into the lord class, because crossing requires not skills but control over the means of cognitive production.

Finally, the three-class structure has a global dimension that traditional class analysis lacks. Compute lords are highly concentrated in a few countries (primarily the United States and China); cognitive serfs are distributed across the globally connected middle and professional classes; and the cognitively excluded are highly concentrated in the Global South, in marginalized language communities, and in the digital underclass within developed nations. This makes the three-class structure not only a class problem but also a geopolitical problem.

### 4.5 Relationship to the Srnicek Framework

Srnicek diagnosed how platforms accumulate power through data extraction. His framework applies to the advertising-driven platform economy (Google, Facebook, Uber). Within that framework, users are objects of observation, and data is the raw material of extraction.

The diagnosis of this article is: when the platform economy evolves into the AI era, data extraction is merely the surface; **the concentration of the means of cognitive production** is the deep mechanism. A serf described by the Srnicek framework as having "their data extracted" is identified in this article's framework as a dependent who has "lost the capacity for autonomous cognitive production." The former focuses on "who owns the data and how to compensate"; the latter focuses on "who owns the means of cognitive production and how to disperse them." These two frameworks are not opposed, but operate at different levels of abstraction in their diagnoses. Srnicek diagnoses at the level of data flows; this article diagnoses at the level of ownership of the means of cognitive production. The former's prescription is data compensation; the latter's prescription is the dispersion of the means of production. The latter is deeper and harder to realize, but it points to the structure itself.

---

## V. Pro Tanto Injustice: How the Monopolization of Algorithmic Rent Distorts Rules

**When the phase transition of the means of cognitive production distorts rules through institutional capture and compresses the feasible sets of others, excessive concentration constitutes a pro tanto injustice.**

The meaning of "pro tanto" is consistent with prior work: this is a preliminary judgment of injustice that can be outweighed by other considerations. It is not an absolute injustice but an injustice that holds in a certain dimension. Acknowledging the pro tanto character is a matter of honesty: this article does not claim that AI concentration is "absolutely evil," but argues that it has lost legitimacy in a certain normative dimension (distributive justice and political equality).

### 5.1 The Generation and Monopolization of Algorithmic Rent

**Algorithmic rent** refers to the economic surplus generated by the efficiency gains of AI systems, exceeding the minimum cost required to maintain system operation. This surplus is called "rent" because its capture depends not on the holder's productive contribution but on its monopoly position over scarce resources (compute, data, enclosed weights)—consistent with the classic economic definition of "rent" (excess returns above opportunity cost).

The generation of algorithmic rent depends on diverse inputs. Training a frontier model requires not only the capital and compute invested by compute lords, but also:

- **Behavioral data from hundreds of millions of users**: Without this data, models cannot be aligned to human preferences and cannot improve through actual use.
- **Publicly funded basic research**: The Transformer architecture, reinforcement learning, backpropagation. The overwhelming majority of core technological breakthroughs that make contemporary AI possible were born in publicly funded academic research or semi-public laboratories.
- **Infrastructure provided by society as a whole**: Energy networks, fiber-optic backbones, internet protocols, the engineer workforce cultivated by the education system. These are all material prerequisites for the operation of AI.
- **The collective labor of the open-source community**: PyTorch, the Hugging Face ecosystem, countless open-source datasets and tools. The closed-source products of compute lords are built atop these public goods.

If the generation of algorithmic rent depends on such diverse inputs, then when these rents are almost entirely monopolized by compute lords, the moral legitimacy of this monopolization must be interrogated. It is not "rewarding the creation of value," because the creation of value is diverse; it is "capturing surplus that was jointly produced," because the distribution of surplus does not reflect the diversity of its sources.

**An insight at the accounting level reinforces this judgment.** Under current accounting standards (GAAP/IFRS), data largely does not appear on balance sheets. Data is expensed at the moment of collection, even though intangible assets constitute roughly 90% of enterprise value (with data being a primary component) [13]. This means that the value produced by data contributors (users, annotation workers) is **invisible** in corporate financial statements. It is neither recognized as an asset nor generates a corresponding liability (an obligation to compensate data contributors). The invisibility of accounting is not a neutral technical arrangement; it deprives the fact that "algorithmic rent is jointly produced" of any expression within the most authoritative system of economic accounting. When a user's tens of thousands of conversations with ChatGPT significantly improve the model, this contribution leaves no trace in the corporate annual report; when a Kenyan annotation worker performs RLHF annotation for the model at less than 2 dollars per hour, the value they create is equally untraceable on OpenAI's balance sheet. The accounting framework reduces diverse inputs to a single-party output. This reduction is itself the embodiment of distributive injustice at the level of accounting.

**A necessary response to a rebuttal: How does AI data contribution differ from "supermarket shopping data"?** A natural objection is: customers also generate sales data when shopping at a supermarket, data that is indispensable for the supermarket's inventory optimization, yet we do not thereby say that customers are the supermarket's "co-producers," nor that the supermarket's exclusive capture of sales profits constitutes an injustice. If "indispensable input" equals "productive contribution," then virtually all economic transactions entail "co-production," and this article's diagnosis would not be a special judgment about AI but a universal judgment about all markets, which would cause the argument's specificity to vanish. This objection is not without merit. Kim, Lee, Xu & Routledge (2021) raised a similar critique using the "manure" metaphor: personal data is a natural byproduct of activity, and users have not "intentionally produced" it [18]. Jonker (2025) further argues that if we adopt a common-sense concept of "work," most user data is merely a "passive byproduct" and does not constitute "labor" [19]. This article must respond directly to this critical lineage.

The response can unfold on three levels. First is the distinction between constitutiveness and instrumentality. Supermarket sales data **optimizes** an already-existing product shelf; without sales data, the supermarket could still operate (just less efficiently). AI training data **constitutes** the model itself. "The data is the program": the capability of a deep learning model is constituted to a significant degree by the training dataset, not by the code [20]. Without training data, the model is physically impossible. This is the distinction in production theory between a "necessary/irreplaceable input" (Leontief-type) and a "substitutable/optimizing input": the former is a constitutive condition for the product's existence; the latter is a means of improving the product's efficiency. AI data belongs to the former; supermarket data belongs to the latter.

Second is the structural difference in collective externalities. The externality of supermarket shopping data is local (primarily optimizing that supermarket's operations). AI training data has strong positive externalities and non-rivalry (Jones & Tonetti, 2020); one firm's use of data does not reduce another's, and the social marginal product of data exceeds the private marginal product. More importantly, the value of AI data is **collectively emergent**: the behavioral data of any single user is marginally substitutable (here the Kim et al. critique is valid), but the aggregation of large-scale user behavior constitutes an irreplaceable training signal. A collective withdrawal, a "data strike," would destroy the model, whereas an individual customer's cessation of shopping would not destroy a supermarket. Viljoen (2021)'s relational theory of data governance captures this structure: data is not a collection of individual transactions but a social relation constituted by legal/technical systems, generating "supra-individual" legal interests [22].

The above two levels mainly address the data contributions of "ordinary users." But for the most disadvantaged group in the AI value chain, the "passive byproduct" critique is entirely inapplicable. RLHF annotation workers have clear labor intent (hired to annotate), expend effort (processing traumatic content), and create value (the core input for model alignment), yet are paid 1–2 dollars per hour [10]. This is a harder case of exploitation, less vulnerable to the supermarket analogy, than "conversation data from hundreds of millions of users." This article's diagnosis, with respect to annotation workers, does not depend on the contested framework of "data as labor"; it requires only the traditional, uncontroversial judgment of labor exploitation.

Taken together: for ordinary users, this article's normative judgment is based on the constitutiveness and collective externality of data (not on a generalized premise that "all data is labor"); for annotation workers, the judgment is based on traditional labor exploitation. The normative judgment does not depend on the user's self-understanding. Users may not know that their data is used for training, but "having contributed value unknowingly" does not equal "having contributed no value," just as a farmer who does not know he is standing on a gold mine does not thereby forfeit his claim to the deposit.

### 5.2 Institutional Capture: How Excessive Concentration Distorts Rules

Prior work argued the specific channels through which traditional wealth distorts rules via institutional capture: constraining the feasible sets of competitors, altering the feasible sets of regulators, shaping the feasible sets of public opinion, commanding the feasible sets of talent, and defining the feasible sets of standards. This article argues that excessive concentration of the means of cognitive production distorts rules through isomorphic channels, with the addition of AI-specific channels.

**Constraining the feasible sets of competitors**. Compute lords strangle startup innovation through kill zones, block new entrants through compute barriers, and entrench technological pathways through patent barriers (including patenting of model architectures, training methods, and data processing workflows). The feasible set of a potential innovator is systematically compressed by the first-mover advantages of compute lords.

**Altering the feasible sets of regulators**. Compute lords influence the direction of AI regulatory legislation through lobbying, tilting rules in a direction favorable to their own scaling and unfavorable to open-source and small players. A typical example: regulatory frameworks in the name of "AI safety" that set excessively high compliance thresholds, such that only large enterprises with massive legal and compliance teams can afford them, while the open-source community and small laboratories are excluded. This pattern of "regulatory capture in the name of safety" is a distortion channel unique to the AI era.

**Shaping the feasible sets of public opinion**. Compute lords, by funding think tanks, acquiring media, and controlling platforms, determine which narratives about AI are amplified and which are submerged. "AI will inevitably be dominated by a few large companies," "open-source is dangerous," "only scaled enterprises can guarantee AI safety"—these narratives serve the interests of compute lords, yet are presented as "objective facts" through their influence over public opinion.

**Commanding the feasible sets of talent**. Compute lords, through compensation far exceeding what academia can offer (top AI researchers can earn annual salaries of several million dollars), systematically drain research talent from public research institutions. This means that the most cutting-edge AI research increasingly takes place within closed corporate laboratories, and its results no longer enter the public knowledge base. The privatization of talent is the privatization of knowledge production.

**Defining the feasible sets of standards**. When a closed-source model becomes the de facto standard, the holder acquires the power to define the entire industry's capability evaluation criteria, safety standards, and alignment standards. This power to define standards rewrites the feasible sets of the entire industry. It marginalizes any alternative that does not conform to that standard, regardless of its technical merits.

**An AI-specific channel: capturing data infrastructure**. This is a channel absent from traditional wealth capture. The data needed to train frontier models largely comes from the public internet, humanity's shared intellectual heritage. When compute lords, through scraping, agreements, and paywalls, enclose public data as private training corpora and refuse to reciprocate in next-generation models, what is captured is not only competitors but also the data foundation for the entire society's future AI research. This is a self-reinforcing loop: public data is privatized → private models become stronger → attracting more public data → the data foundation of public research becomes weaker.

### 5.3 The Self-Reinforcing Cycle of Institutional Capture

The above channels are not isolated; they constitute a self-reinforcing cycle:

Monopolization of algorithmic rent → excess profits → greater investment in lobbying, acquisitions, talent competition → regulatory frameworks more favorable to concentration → further monopolization of algorithmic rent → ...

This cycle is structurally highly similar to the institutional capture cycle of traditional wealth diagnosed in prior work: capital concentration → institutional capture → rule tilting → further capital concentration. The only differences lie in the carrier (from currency to means of cognitive production) and the channels (with the addition of data infrastructure capture and the power to define standards). This means that the conclusion of prior work regarding traditional wealth holds equally here: **once the concentration of the means of cognitive production has penetrated deeply into the functional transition zone, it acquires the capacity to rewrite rules, and the rewritten rules further intensify concentration. This is a self-reinforcing positive feedback loop that, absent an external intervention, will not stop on its own.**

### 5.4 The Establishment of Pro Tanto Injustice

Synthesizing the above arguments, the chain establishing pro tanto injustice is as follows:

1. The means of cognitive production exhibit a functional transition zone across the three carriers; upon entering this zone, the primary function of the resources shifts from functional resource to control variable (Section III).
2. Compute lords deep within the transition zone distort rules through institutional capture and compress the feasible sets of others (competitors, users, the excluded) (this section).
3. The generation of algorithmic rent depends on diverse inputs (user data, public research, social infrastructure, open-source labor), yet its distribution is nearly completely monopolized, constituting the capture of jointly produced surplus (Section 5.1).
4. Institutional capture is self-reinforcing and will not stop on its own absent an external intervention (Section 5.3).

Conclusion: **When the concentration of the means of cognitive production has penetrated deeply into the functional transition zone and systematically distorts rules and compresses the feasible sets of others through institutional capture, this concentration constitutes a pro tanto injustice.** This judgment is preliminary and can be outweighed by other considerations (such as innovation incentives and safety considerations), but in the dimensions of distributive justice and political equality, it has lost its self-evident legitimacy.

---

## VI. Violation of Basic Rights: The Normative Escalation of Cognitive Exclusion

Prior work argued that when the subsistence deprivation caused by the wealth phase transition touches a baseline, pro tanto injustice escalates into a violation of basic rights. This article argues a parallel escalation: when the concentration of the means of cognitive production results not in "using poorly" but in "being unable to participate at all," the injustice escalates into a structural violation of basic rights.

### 6.1 The Normative Character of Cognitive Exclusion

The situation of the cognitively excluded is not "lacking a certain convenience" but being **excluded from the contemporary infrastructure of cognitive production**. In a world where AI capability increasingly serves as a prerequisite for access to education, employment, healthcare, law, and public services, being excluded from AI infrastructure means being excluded from the basic conditions for participating in social cognitive production.

This bears a structural resemblance to Shue's framework of subsistence rights, cited in prior work [5]. Shue argued that the right to subsistence (the right to be free from deprivation) is a basic right because it is the material precondition for the enjoyment of all other rights. This article advances a parallel proposition: **in an era when AI is increasingly becoming the cognitive infrastructure of society, the right to participate in the cognitive production-consumption cycle is becoming the cognitive precondition for the enjoyment of other social rights.** A person who cannot effectively use AI (because their language is not supported, they lack internet access, they cannot afford devices) will have their feasible sets in education, employment, information access, and public service participation systematically compressed.

This is not a metaphor. When government services, medical consultations, and educational resources are increasingly mediated through AI (or assume that users have AI assistance), a person who is excluded faces not "lacking a certain tool" but **having the channels for accessing basic social services closed off**. This differs from the traditional "digital divide." The digital divide is a difference of degree (using well vs. using poorly); cognitive exclusion is a difference of kind (being able to use vs. being completely unable to use).

### 6.2 Linguistic Exclusion as a Basic Rights Issue

Linguistic exclusion is the sharpest dimension of cognitive exclusion and the one most easily overlooked in mainstream discussion.

Of the approximately 7,000 languages in the world, fewer than 100 are well-supported by mainstream AI models. This means that native speakers of the vast majority of human languages cannot obtain effective AI services in their native language. This is not merely a technical problem but also a normative problem: **if a society's cognitive production infrastructure serves only speakers of a few mainstream languages, then it structurally excludes speakers of other languages from the qualification to participate in cognitive production.**

This bears a direct connection to the international normative framework of language rights. Article 27 of the United Nations International Covenant on Civil and Political Rights protects the right of minority groups to use their own language. If AI infrastructure is increasingly becoming the core channel of social cognitive production, then structurally excluding certain languages constitutes a contemporary erosion of language rights. The issue is not that AI enterprises "have no obligation" to support all languages—before the transition zone, this was indeed merely a commercial choice. The issue is that **when AI infrastructure has penetrated deeply into the functional transition zone and become the dominant channel of cognitive production, structural exclusion of certain languages ceases to be a neutral business decision and becomes a deprivation of the basic right to participation.** The functional transition changes the moral weight—as prior work argued: the moral status of wealth before and after functional transition differs substantively, and this difference deepens progressively within the transition zone rather than flipping suddenly at a single point.

### 6.3 The Global Justice Dimension

The cognitively excluded are highly concentrated in the Global South and marginalized language communities. This makes the three-class structure not only a problem of domestic justice but also a problem of global justice.

Pogge argues that global poverty is a foreseeable consequence of the existing global institutional order, and that citizens of developed countries bear negative duties (the duty not to sustain an unjust order) with respect to it [6]. This article's argument extends this framework: if the global AI infrastructure is systematically centered on English, Chinese, and a few other mainstream languages while neglecting the vast majority of human languages, then the design of this infrastructure is itself an institutional carrier of global cognitive injustice. Compute lords (concentrated in a few countries), by designing a cognitive infrastructure centered on their own languages and cultures, systematically reproduce global cognitive asymmetries. This asymmetry is not a "natural market result" but a foreseeable consequence of institutional design.

---

## VII. The Algorithmic Rent Allocation Ratio: Linking Diagnosis and Normativity

The preceding five sections have completed the diagnosis (phase transition → three-class structure → pro tanto injustice → violation of basic rights). This section proposes a unified variable linking diagnosis and normativity. This variable is introduced in this article as a normative anchor; its policy operationalization is a separate subject of institutional design.

### 7.1 Conceptual Definition

The **Algorithmic Rent Allocation Ratio** (denoted as $\rho_{ARA}$) is defined as:

$$\rho_{ARA} = \frac{\text{Algorithmic rent flowing to data providers, model contributors, and society}}{\text{Total algorithmic rent}}$$

The numerator includes the share of algorithmic rent that flows back, in any form (monetary compensation, public services, data rights, ownership shares), to data providers (users), model contributors (annotators, researchers, the open-source community), and society as a whole (through taxation or public funds). The denominator is the total algorithmic rent generated by the AI system.

When $\rho_{ARA} \to 0$, nearly all algorithmic rent is monopolized by compute lords; when $\rho_{ARA} \to 1$, algorithmic rent is broadly distributed among the social subjects who generated it.

**A necessary clarification regarding the denominator.** An intuitive puzzle is: major frontier AI enterprises (OpenAI, Anthropic, etc.) currently operate at massive losses (OpenAI's 2025 revenue exceeded 20 billion dollars but its loss was roughly 4 billion dollars). If the enterprises themselves are not profitable, does the diagnosis that "algorithmic rent is monopolized" still hold? The answer is that it does, but the denominator requires a more precise specification. The flow of algorithmic rent can be decomposed into three parts: (1) **rent flowing to capital-goods suppliers**: NVIDIA (FY2024 revenue 130.5 billion dollars, 114% year-over-year growth) and cloud service providers capture enormous returns from AI enterprises' compute purchases; (2) **rent retained/anticipated by compute lords**: even if currently operating at a loss, enterprise valuations (OpenAI's 2026 valuation roughly 852 billion dollars, Anthropic's roughly 965 billion dollars) capitalize expectations of future rents, and these valuations embody market confidence in the monopolization of rents; (3) **rent flowing back to co-producers**, currently near zero. The fact of losses does not negate the existence of rents; it merely indicates that rents currently flow primarily to upstream capital-goods suppliers and are capitalized into valuations, rather than being realized as profits. $\rho_{ARA}$ concerns the proportion of part (3) relative to the sum of all three parts. The current extremely low level is unchanged regardless of whether enterprises are profitable.

### 7.2 As a Descriptive Diagnostic Indicator

The first function of $\rho_{ARA}$ is descriptive. It transforms a vague judgment ("who is taking the benefits of AI") into a quantity that is in principle measurable. Although precise measurement faces data opacity (compute lords' internal pricing, data valuation, and cost attribution are all trade secrets), its order of magnitude can be estimated through the following means:

- Of AI enterprises' total profits, what proportion flows back to society through taxation? (enters the numerator)
- What proportion of total revenue do AI enterprises' compensation expenditures to data contributors, in any form, represent? (enters the numerator)
- What is the scale of public AI research funds, open-source model maintenance expenditures, and low-resource language support projects? (enters the numerator)
- What about AI enterprises' net profits, stock buybacks, and executive compensation exceeding what is necessary for the exercise of management functions? (remains in the denominator but does not enter the numerator)

Existing empirical evidence strongly suggests that the $\rho_{ARA}$ of major current AI economies is extremely low.

**The best anchor for "algorithmic rent" as a monetizable concept** currently comes not from the large language model domain but from a structurally isomorphic case: the RealPage algorithmic pricing case. The White House Council of Economic Advisers (CEA) estimated in 2024 that RealPage's algorithmic pricing software caused U.S. tenants to overpay by approximately **3.8 billion dollars** annually in rent (a lower-bound estimate), covering at least 10% of rental units nationwide [9]. The U.S. Department of Justice sued under the Sherman Act in August 2024, and a settlement was reached in November 2025. Although this case concerns real estate pricing algorithms rather than LLMs, it is the clearest empirical demonstration of the core thesis that "algorithms serve as control variables extracting rent": the algorithm was no longer merely an efficiency tool but was used to systematically compress the feasible sets of tenants (raising the rent they were forced to pay) and convert the difference into rent for landlords and software providers. The analogue of $\rho_{ARA}$ in this case is: of this 3.8 billion dollars in excess payments, what proportion flowed back to the tenants from whom it was extracted? The answer is close to zero. The RealPage case provides an empirically graspable baseline for the concept of $\rho_{ARA}$.

**Returning to the AI domain itself**, evidence on the distribution ratio likewise points to an extremely low level. On the **revenue side** of distribution (the numerator), there is a striking order-of-magnitude gap between compensation and data contribution: Kenyan RLHF annotation workers who trained ChatGPT were paid roughly 1.32–1.44 dollars per hour; Filipino Remotasks workers received merely 0.02–0.50 dollars per task; and ordinary users (conversation data contributors) receive zero compensation—"data dividends" remain at the stage of policy proposals [7]. On the **expenditure side** of distribution (the denominator), global corporate/private AI investment reached 252.3 billion dollars in 2024 (a record, 26% year-over-year growth), while public AI research funds differ by roughly an order of magnitude (the corporate-to-public investment ratio is on the order of 10:1). With respect to low-resource language support, which directly concerns the inclusion of the cognitively excluded, investment is near zero.

This means that the current AI economy may be even more extreme in its distribution ratio than the traditional industrial economy. Traditional industry at least achieved some degree of rent redistribution through wages, taxation, and the welfare state, whereas the distribution mechanisms of the AI economy have barely been established.

### 7.3 As a Normative Anchor of Justice

The second function of $\rho_{ARA}$ is normative. The normative proposition advanced by this article is a weak proposition: **when $\rho_{ARA}$ falls significantly below a certain threshold, the distributional structure of the AI economy constitutes a pro tanto injustice.**

The argumentative logic follows directly from Section V: if the efficiency gains of AI are primarily jointly produced by society as a whole, then when these gains are almost entirely monopolized by a few compute lords, this monopolization loses moral protection. It is not "rewarding the creation of value" but "capturing surplus that was jointly produced."

The significance of $\rho_{ARA}$ as a normative anchor lies in its transformation of the question of distributive justice from "should there be AI enterprises" (overly broad) into "in what proportion should the surplus generated by AI flow back to its co-producers" (arguable, quantifiable, legislatable). This bears a structural similarity to Rawls's difference principle: the difference principle requires that the basic structure of society be arranged so as to maximize the benefit of the least advantaged; $\rho_{ARA}$ requires that the distribution of the AI economy give co-producers (especially cognitive serfs and the excluded) a share commensurate with their contributions. The spirit of both is consistent: legitimate inequality must be capable of bringing benefits to everyone (especially the least advantaged), or else it loses legitimacy [8].

### 7.4 Why a Distribution Ratio Rather Than a Distribution Quantity

A possible objection is: why not directly discuss "how much money to give each person" (distribution quantity) instead of introducing a ratio (distribution rate)?

Because distribution quantity cannot capture structural problems. A compute lord could distribute substantial data dividends (high distribution quantity), but if it simultaneously extracts even more value from users through algorithmic rent, the net distribution could be negative. The distribution ratio captures the **structure**: of the total surplus generated by AI, what proportion flows back to co-producers. It is not deceived by cosmetic strategies of "extract first, then return a little."

This is consistent in spirit with the "wealth phase transition" that prior work focused on: the phase transition concerns not the absolute quantity of wealth, but the **function** of wealth (living resource vs. control variable). Similarly, $\rho_{ARA}$ concerns not the absolute quantity of distribution, but the **structural proportion** of distribution (monopolization vs. sharing).

---

## VIII. Responding to Possible Objections

This section responds to three categories of possible objections, to test the robustness of the argument.

### 8.1 "The Incentive Myth": Excessive Concentration Is the Necessary Price of Innovation

The most common objection is: developing frontier AI requires enormous investment, and only by allowing excess returns can enterprises be incentivized to bear risk. Breaking concentration would strangle innovation.

This objection has force, but it conflates two things: **incentivizing innovation** and **permitting unlimited concentration**. Prior work already argued this in the context of traditional wealth: rewarding the creation of value and permitting unlimited appropriation are two different things. The former is legitimate, the latter requires interrogation. This article reiterates this distinction in the AI context.

Acknowledging the necessity of incentives does not amount to acknowledging that the current degree of concentration is necessary for incentives. The key question is: how large is the gap between the level of return required for incentives and the excess rent currently captured by compute lords? If the reasonable return of an enterprise (covering costs plus a risk premium plus a reasonable profit) is some small fraction of its current revenue, then the excess is not "incentive" but "control rent from deep within the transition zone." This is continuous with prior work's argument on traditional wealth: once the functional transition of wealth has penetrated deeply, additional wealth no longer serves incentives but serves control.

Furthermore, the distinctive features of AI innovation actually weaken the "concentration equals innovation" argument. A large number of core innovations in AI (the Transformer architecture, reinforcement learning alignment methods, diffusion models) were born in academia or were publicly published. The primary contribution of frontier AI enterprises is often engineering scale-up (training known architectures at larger scale), not foundational innovation. If foundational innovation is public and scale-up is an engineering problem, then the argument that "only excessive concentration can produce innovation" loses most of its force. It confuses "engineering scale-up requires capital" (correct) with "only monopoly can achieve engineering scale-up" (incorrect, public compute and collaborative training are also viable pathways).

### 8.2 "Open-Source Has Already Solved the Problem"

A second objection is: the existence of open-source models (Llama, Mistral, Qwen, etc.) has already broken the concentration of the means of cognitive production, and the three-class structure is an outdated description.

This objection overlooks the actual position of open-source models in the AI production chain. Current open-source models mostly occupy a position "near the frontier but not at the frontier"; the most cutting-edge capabilities remain in the hands of closed-source models. The existence of open-source models indeed provides conditions for resistance, but it does not dismantle the three-class structure, for two reasons:

First, the training of open-source models itself depends on concentrated compute. Before an open-source model is released, it is still trained by an entity possessing compute above the threshold. What is open-sourced is the weights, not the training capacity. This means compute lords still control the generation of frontier capabilities; open-sourcing merely releases certain capabilities after the fact.

Second, the ecological position of open-source models is constrained by the functional transition advantages of closed-source models. When closed-source models maintain their lead through data flywheels and compute advantages, open-source models occupy the position of "catch-up players," and their ecological influence is constrained by the extent of their lag behind the frontier. Open-sourcing has not eliminated the functional transition; it has merely provided an alternative option within the transition structure. The value of this alternative option depends precisely on closed-source models not having completely locked down all ecological channels—once channels are locked down, open-source models degenerate into pure decoration.

Thus, the argument that "open-source has already solved the problem" confuses "the existence of alternatives" with "the structure having been changed." The existence of alternatives is important (it is a condition of resistance), but it does not equal structural change.

### 8.3 "The Zero Reproduction Cost of Weights Means Natural Openness"

A third objection leverages a fact that this article itself emphasizes, the zero marginal reproduction cost of model weights, to argue: since copying weights is costless, the market will naturally trend toward openness, and concentration will dissolve on its own.

This objection confuses **reproduction cost** with **the incentive to open**. That weight reproduction is costless does not mean the holder has an incentive to open. On the contrary, precisely because weights are a control variable after the phase transition (as argued in Section 3.3), the holder has a strong incentive to maintain enclosure; the excess rents brought by enclosure far exceed the benefits of openness. Zero reproduction cost lowers the material threshold for openness, but it does not alter the holder's strategic calculus. If the rent stream from enclosure is sufficiently large, the holder will invest substantial resources in maintaining enclosure (legal protection, technical encryption, ecosystem lock-in), even if reproduction itself is costless.

Thus, the zero reproduction cost of weights is not a guarantee of "natural openness," but a diagnosis that "openness is technically almost costless, so the only reason for non-openness is the defense of excess rents." The political implication of this diagnosis is: the opening of weights does not need to overcome material obstacles; it only needs to overcome political obstacles. This distinction carries key political significance at the normative level.

---

## IX. Empirical Application: Has the Current Situation Crossed the Threshold?

Prior work, after arguing the existence of the wealth threshold, offered an empirical estimate: the top tier of U.S. wealth reasonably falls within the transition zone. This article undertakes a parallel empirical estimate. It must be acknowledged that the functional transition zone of AI infrastructure is harder to quantify precisely than that of traditional wealth (because the means of cognitive production lack the kind of hard physiological constraints that wealth has), but the richness of publicly available data in recent years is sufficient to support directional judgments—and the force of these directional judgments is sufficient to support this article's normative conclusions.

### 9.1 The Compute Dimension

The compute phase transition has already occurred and is deepening. Three data points suffice to support this judgment:

First, training costs have crossed a threshold that only an extremely small number of entities can bear. The training compute cost of GPT-4 (2023) is roughly 78 million dollars; that of Gemini Ultra (2024) is roughly 191 million dollars (Stanford HAI 2024 AI Index, compute cost only) [3]. The next-generation training cost of frontier models is estimated in the range of 250 million to 1 billion dollars.

Second, 10²⁶ FLOP as an institutional approximation of the functional transition zone has been adopted by regulators in multiple countries, and the entities capable of crossing this threshold constitute an "extremely narrow set" (Carnegie Endowment 2025). The regulatory threshold is not "evidence" of the functional transition; it is the administrative approximation of the transition zone by regulatory bodies. But its existence demonstrates that even policymakers are already using a certain threshold to distinguish "frontier models requiring special governance" from other models, which aligns with the diagnostic direction of this article. Stanford HAI's 2025 AI Index shows that nearly 90% in 2024 and over 90% in 2025 of "notable AI models" came from industry, with the contribution share of academic and public research institutions continuously shrinking.

Third, the compute supply chain is highly concentrated: NVIDIA's share of the AI accelerator chip market reaches 80–95%, with FY2024 revenue of 130.5 billion dollars (114% year-over-year growth). The main buyers of H100 GPUs are Meta (targeting 350,000 units), Microsoft, and OpenAI [3].

### 9.2 The Data Dimension

The data phase transition has already occurred. ChatGPT's weekly active users reached roughly 800 million in October 2025 and roughly 900 million in early 2026; Claude's weekly active users are roughly 19 million—a gap of over 40 times. This difference in user scale maps directly onto a difference in the speed of the data flywheel: more users → more behavioral data → better models → more users. Competitors lacking a comparable user base cannot catch up in data quality regardless of how much compute they invest. The critical scale of the data flywheel has already been crossed by a few models.

### 9.3 The Model Weights Dimension

The weights phase transition has already occurred. The weights of the most cutting-edge models (GPT-4, Gemini, Claude) are all unpublished, and their dominant ecological position makes enclosure constitute control over the entire ecosystem.

A key supplementary observation: the true position of "open-source AI" in this structure. All mainstream "open-source" models, Llama (Meta), Qwen (Alibaba Cloud), Mistral (Mistral AI, cumulative funding roughly 3.7 billion euros), DeepSeek, are in fact trained by large technology companies or heavily capitalized entities [3]. The hardware Meta used to train Llama 3.1 405B consisted of two 24,000-GPU H100 clusters (48,000 units total, hardware valued at roughly 720 million dollars). Traditional open-source (Linux, Apache) is distributed community contribution; "open-source" in the AI domain consists of weight files released by large companies after training is complete. The training process is not open, and the community can only perform marginal work such as fine-tuning, adaptation, and evaluation. Open-sourcing has not eliminated the weights phase transition; it has merely provided an alternative channel within the transition structure, and this channel itself is controlled at the switch by compute lords.

### 9.4 Empirical Estimate of the Algorithmic Rent Allocation Ratio

Precise measurement of $\rho_{ARA}$ faces data opacity, but Section VII has already provided directional evidence. Here, an order-of-magnitude comparison is added that can intuitively present the distributional configuration:

| | Compensation / Value |
|---|---|
| Kenyan RLHF annotators (working for OpenAI) | Hourly wage $1.32–1.44 |
| Filipino Remotasks workers | $0.02–0.50 per task |
| Ordinary users (conversation data contributors) | Zero compensation |
| OpenAI valuation (2026.3) | Approx. $852 billion |
| Anthropic valuation (2026) | Approx. $965 billion (has surpassed OpenAI) |

The order-of-magnitude gap directly presents the distributional configuration of the three-class structure. This is not "the market pricing contributions": there is no reasonable correspondence between annotation workers' traumatic labor and their compensation; ordinary users' data contributions are invisible in accounting (Section V). It is the empirical manifestation of an extremely skewed distribution ratio. To make a rough international comparison: the rent redistribution rate of the traditional economy at the height of the welfare state may have been in the range of 0.3–0.6; the $\rho_{ARA}$ of the current AI economy is likely far below 0.1. This is not a precise measurement but a directional judgment.

### 9.5 The Scale of the Three-Class Structure and Cognitive Exclusion

The identity of compute lords is clear: the few frontier AI enterprises capable of crossing the 10²⁶ FLOP threshold (OpenAI, Google DeepMind, Anthropic, Meta, xAI, etc.), as well as the cloud service providers controlling critical compute infrastructure.

The scale of cognitive serfs is vast: hundreds of millions of AI service users globally. Among them, the most disadvantaged serfs, data annotation workers, are concentrated in Kenya (estimated at nearly 2 million digital workers), the Philippines, and other Global South countries. Their labor is the foundation of model capability, but their compensation and labor protections are at the very bottom of the global value chain.

The scale of the cognitively excluded is even more enormous and has quantifiable demographic boundaries. Two dimensions suffice to define it: **the access dimension**, ITU 2025 data shows roughly **2.2 billion people** globally remain offline, and 53% of the population lacks high-speed internet access. **The linguistic dimension**—there are approximately 7,170 living languages globally (Ethnologue); mainstream AI models adequately support no more than 100 (roughly 1.4%); at least 384 languages have F1 scores of zero on ChatGPT (complete non-recognition) [4]. Even setting aside language barriers, from the access dimension alone, roughly 2.2 billion people are structurally excluded from the cognitive production-consumption cycle.

**Comprehensive judgment: the current state of AI infrastructure reasonably falls within the transition zone.** The triple phase transition has already occurred and is deepening; the three-class structure has already taken shape and has quantifiable demographic boundaries; $\rho_{ARA}$ is at an extremely low level and has an observable distributional configuration. The normative conclusions of this article are not suspended in the air; they have direct applicability to the actual conditions of the contemporary AI economy.

---

## X. Conclusion: The Honesty of Diagnosis

### 10.1 The Diagnostic Output of This Article

The diagnosis of this article can be condensed into one judgment and one variable. The judgment is: the concentration of the means of cognitive production has penetrated deeply into the functional transition zone; the three-class structure has already taken shape; and the distributional configuration of the current AI economy constitutes a pro tanto injustice. The variable is $\rho_{ARA}$: it transforms "who is taking the benefits of AI" from a vague intuition into a ratio that is in principle measurable, giving normative judgment an empirical handle.

The argumentative chain supporting this judgment is: the three carriers (compute, data, weights) each exhibit a functional transition zone, and the three mutually reinforce one another to form a self-consolidating closed loop (Sections II and III); this closed loop produces a three-class structure, the essence of which is the concentration of the means of cognitive production themselves, not merely the extraction of user data (Section IV); the injustice of concentration is established through the monopolization of algorithmic rent and the six channels of institutional capture (Section V); when concentration reaches the point of cognitive exclusion, the injustice escalates into a structural violation of basic rights (Section VI). The current $\rho_{ARA}$ is at an extremely low level, and the normative conclusions therefore have direct applicability to actual conditions (Section IX).

### 10.2 Relationship to Prior Work

This article is an extension of prior work, *The Legitimate Upper Bound of Wealth*, into the AI era, but it is not a simple application. It makes one substantive extension and one substantive qualification to prior work.

**Extension**: The phase transition argument of prior work targeted the wealth of natural persons and legal persons, with carriers being currency, equity, and real estate. This article extends the phase transition argument to a new type of means of production, the means of cognitive production. This extension shows that the phase transition is not a special property of traditional wealth but a more general mechanism: **any resource that, upon crossing a threshold, slides from functional use to control use will undergo a phase transition.** Phase transition theory thereby possesses a broader explanatory power than prior work indicated.

**Qualification**: The phase transition of the means of cognitive production has a distinctive feature absent from traditional wealth: the zero marginal reproduction cost of model weights. This distinctive feature makes the correction cost of the model weights phase transition approach zero (requiring only a change in property-rights rules), which has no analogue in the correction of traditional wealth. This qualification means that the correction of the phase transition in the AI era is easier in one carrier (weights) than the correction of traditional wealth, and potentially harder in another carrier (compute) because the economies of scale of compute are physical in nature. The difficulty map of correction thus differs from that of traditional wealth.

### 10.3 The Boundaries of Diagnosis

As with prior work, this article emphasizes diagnosis over prescription. This article has argued the injustice of the phase transition of the means of cognitive production and the reasonableness of $\rho_{ARA}$ as a normative anchor, but has not prescribed specific corrective institutions. The specific forms of correction—whether data trusts, public compute, legislation mandating the disclosure of weights, compute antitrust, or arrangements not yet imagined—are a separate question, dependent on the institutional endowments, political possibilities, and technological development of specific societies. This posture of restraint has methodological necessity: the work of this article is to establish "the moral necessity of correction," not to prescribe "the technical scheme of correction."

This article also does not promise optimism. The self-reinforcing mechanism of the three-class structure is powerful; institutional capture in the AI domain may be more covert than in the traditional financial domain (because conscription replaces dispossession, and voluntariness conceals coercion); and the situation of the cognitively excluded may be harder to improve than that of the traditionally dispossessed (because they lack even the foundation to be organized into collective action).

But the honesty of diagnosis demands acknowledgment: **the existence of the phase transition mechanism is demonstrable; the three-class structure is unjust; the current level of $\rho_{ARA}$ is excessively low; and the direction of correction can be indicated.** As for whether correction can be realized, at what speed, and through what kind of contestation, these are not decided in theory but in struggle. What theory can do is point struggle toward a directionally correct diagnostic exit.

### 10.4 After Diagnosis

After the diagnosis is complete, the unavoidable question is: **what should the dispossessed do?**

How can cognitive serfs carve out space on the bases of compute lords? How can the cognitively excluded act in a situation where even their qualification to participate is not recognized? These questions push this article from the space of diagnosis toward the space of action. Once action is touched, the tools used in this article (industrial organization economics, public choice theory, Rawlsian distributive justice) begin to lose their grip: they can diagnose the injustice of institutions, but under the premise that "institutions are deeply captured," their capacity to guide "how the dispossessed should act" rapidly diminishes. The logic of action, the specific difficulties of collective action in the AI context, and the conditional strategies of resistance are subjects for an independent study of action.

---
