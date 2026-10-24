---
title: The People on the Treadmill
date: 2026-07-25
order: 16
author: Liutao Hu
category: Political Economy
tags: essay,AI,capability gap rent,treadmill mechanism,monopoly capital,pricing power,open source,valuation
cover: /assets/essay-treadmill-people.png
excerpt: In a single week, Kimi K3 matched Anthropic's flagship, and Anthropic itself launched Opus 5, a model marketed on cost-efficiency. A chaser became a leader. A leader started a price war. This is not coincidence. The treadmill is accelerating.
---

## I

In the week of July 2026, the AI industry had big news again. Moonshot AI released Kimi K3. Total parameter count: 2.8 trillion, using a mixture-of-experts architecture, with performance matching or surpassing Anthropic's flagship model on multiple benchmarks. The capital markets reacted sharply. Some have already begun calling it "DeepSeek Shock 2.0."

Kimi K3's pricing is not DeepSeek-style low pricing. Its API prices are comparable to those of tier-one players like Anthropic and OpenAI. A challenger emerging from China's open-source camp chose, at the moment of pricing, the logic of a leader.

Meanwhile, Anthropic itself released Opus 5. The headline feature of this new model is not that it is stronger, but that it is cheaper: performance close to its own flagship, at substantially reduced cost. A company that sells "frontier capability" has begun putting "value for money" in its press release headlines.

These events, unfolding one after another, are wasted if read as independent technology news. They are fragments of a single story, and the name of that story is: the AI capability treadmill.

## II

To understand what the AI capability treadmill is, one must first understand the real basis of "rent" in the AI industry.

OpenAI is not selling text. When you pay an API fee, you are not buying the words that GPT generates. You can get those words for free from open-source models. What you pay for is a **gap**: the things the best closed model can do that the best free model still cannot. The gap exists, you pay. The gap disappears, you leave.

I call this fee window based on a capability gap "capability gap rent." It is not a charge for a product. It is a charge for a **performance differential**. The wider and more durable the gap, the higher the rent. The narrower and more short-lived, the lower.

Compared to other forms of rent, this one has a peculiar defect: it **cannot reproduce itself**.

Land rent reproduces through physical scarcity. Manhattan will not get any larger, so ground rent is stable. Intellectual property rent reproduces through legal enforcement. When a patent expires, another can be filed; legal protection only strengthens over time. Software rent reproduces through a labor moat. Open-source code can replace the software itself, but not the ongoing human labor of maintenance, customization, and integration that surrounds it.

Capability gap rent has none of these. It has no physical scarcity (model weights copy at zero cost), no legal protection (API terms cannot stop distillation and reverse engineering), and no labor moat. Once a capability is replicated in open source, there is no service layer that only the original provider can offer.

Without stabilizers, rent erodes continuously.

**Erosion Channel One: Baseline commodification.** Yesterday's frontier becomes today's free good. GPT-4-level capability, scarce in 2023, is free in 2026. The phrase "six months ahead" is itself depreciating. What six months is worth shrinks every year.

**Channel Two: Frontier migration.** Capital's response to commodification is to run toward higher dimensions. Frontier firms must constantly open new domains, maintaining a lead in dimensions the open-source ecosystem has not yet caught up to. Textual knowledge was enclosed, then commodified; code generation followed; then reasoning followed. Migration creates rent, but the windows it opens are narrowing, because the open-source replication speed accelerates with each cycle.

**Channel Three: Cost escalation.** The cost of staying ahead is rising. Not because GPUs are getting more expensive, but because of the shape of the capability production function. Empirical scaling laws tell us: double the compute, and capability improves by less than double. Each generation of frontier models must spend far more than the last to open a smaller gap.

The three channels acting together constitute the **treadmill**. Commodification chases from below, migration runs above, and cost accelerates underfoot. The signature of the treadmill turning is this: the frontier AI industry has yet to prove it can reproduce itself. Revenue is growing, but losses are growing faster. OpenAI's 2026 annual revenue is approximately $25 billion, with projected losses of $14 billion. Anthropic's annual revenue is $30 billion, with losses exceeding $3 billion. The entire industry lives on external transfusions, not on the money it earns.

This is the treadmill. You keep running, not to win, but because stopping means you lose.

## III

Now back to this week's big news.

**Kimi K3 matching Anthropic's flagship is Channel One accelerating.**

The standard script of baseline commodification goes: the open-source ecosystem spends months replicating a frontier capability, and the frontier firm migrates to a new dimension. What makes Kimi K3 unusual is that it is not "open-source replication." It is a competitor with frontier-level investment, matching the leader through independent innovation, and at lower cost. The mixture-of-experts architecture allows a 2.8-trillion-parameter model to activate only a small fraction of itself during inference, pushing serving cost toward that of a small model.

This means the basis of capability gap rent, "what only we can do," is not merely being nibbled from below by open source. It is being **pierced from the side by a competitor of the same tier**. When a challenger from China is not merely catching up but catching up more cheaply, the cost asymmetry intensifies. There is a line in the paper: DeepSeek-V3 was trained for $5.6 million and matched GPT-4-class capability, while GPT-4's training cost is estimated at $78 to $100 million. Kimi K3 is a continuation of this trajectory: the frontier gets more expensive, and matching it gets cheaper.

Capital votes with its feet. The "DeepSeek Shock 2.0" framing is not hyperbole. When a 2.8-trillion-parameter Chinese model matches Anthropic's flagship in performance, the question investors ask is simple: if the gap can be closed, how much is the gap worth? The answer: less than yesterday.

**Anthropic launching Opus 5 on value-for-money is the leader retreating.**

This point is more noteworthy than the first. When the leader itself starts a price war, it admits one thing: **frontier migration can no longer open a wide enough gap.**

The logic of the treadmill predicted this moment. The rational strategy for frontier firms is always to open new capability dimensions, from text to code to reasoning to autonomous agents, creating new gaps where open source has not yet caught up. But the windows are narrowing. The replication window for text capability shrank from an initial two years to one year, to a few months. Code capability was faster. By 2026, on single-turn generation benchmarks, open and closed source are nearly indistinguishable.

When migration cannot open a wide enough new window, the leader has only one lever left: price. The "value-for-money" narrative of Opus 5 is, in essence, Anthropic saying: we can no longer open a big enough new gap, so we sell the old gap a little cheaper.

This is the end-stage signal of the treadmill. The leader retreats from "paying for the gap" to "paying for something about the same, but cheaper." Once this stage is entered, the logic of valuation begins to loosen. You are no longer a company selling scarce capability; you are a company selling parity capability. The valuation model for parity capability and the valuation model for scarce capability are not in the same order of magnitude.

**Kimi K3's choice of tier-one pricing is the treadmill recruiting a new runner.**

This is the most interesting of the three events.

DeepSeek's strategy was low pricing. Offer near-frontier capability at prices far below the tier-one players, and grab market share through value for money. This is the classic challenger's playbook: I am a little behind on capability, but I make it up on price.

Kimi K3 does not do this. Its pricing is close to that of Anthropic and OpenAI. Moonshot AI, a company of roughly 300 people, transformed from a challenger within the open-source camp into a frontier firm pricing by the leader's logic.

This is not a betrayal of open source. This is being co-opted by the treadmill.

Once you have reached frontier capability, the rational strategy changes. You no longer need to use low prices to grab market share. You are already at the frontier. Your rational strategy now is to extract capability gap rent: you have a gap with open source, and you charge for that gap. You are on the treadmill.

This is the deepest mechanism of the treadmill: it is not merely a trap for incumbents. It is a gravitational field. Anyone who reaches frontier capability is pulled in. DeepSeek's low-price strategy is a challenger's strategy, but DeepSeek cannot remain a challenger forever. When its capability catches up to the frontier, its pricing logic will converge toward that of a leader. Kimi K3 has already completed this convergence.

And after convergence? Kimi will discover that it faces exactly what OpenAI faces: its gap is also being commodified, its costs are also escalating, and it too must constantly migrate to new dimensions. It has gone from someone trying to break the treadmill to one of the fastest runners on it.

This is the true meaning of "DeepSeek Shock 2.0." The first shock was: a challenger proved, through low pricing, that frontier capability can be replicated cheaply. The second shock is: after a challenger catches up to the frontier, it immediately begins acting by the frontier's logic. The treadmill was not interrupted. It turned the challenger into a new runner.

## IV

Putting the three events together, you see a picture.

The challenger matches the leader at lower cost (Channel One accelerating). The leader cannot open a new window and retreats to a price war (migration window narrowing). The challenger that has caught up to the frontier is immediately pulled into the leader's logic and begins pricing as a frontier player (the treadmill recruiting new runners).

Three lines converge on a single point: the basis of capability gap rent is being eroded simultaneously from multiple directions. This is not a problem for any single firm. It is a reproduction crisis for an entire rent form.

What does this mean for the industry as a whole?

Today's frontier AI companies are valued in the hundreds of billions of dollars. This valuation is not based on these companies' current profitability, but on an implicit assumption: that they can sustainably extract capability gap rent, and that this rent will grow as AI permeates the economy. But the logic of the treadmill says: rent does not reproduce itself. It has no stabilizer. Commodification is accelerating, migration windows are narrowing, and costs are escalating. Every new player that reaches the frontier (Kimi is only the latest) intensifies competition rather than alleviating it.

The valuation model also assumes a winner-take-all structure: a handful of frontier firms dividing the market, each extracting rent stably within its own moat. But the logic of the treadmill says: moats are hard to sustain. Open source chases from below, new competitors enter from the side, and the leader is forced into a price war. The premise of winner-take-all is that there is such a thing as "winning." On the treadmill, there are no winners, only the distinction between the fastest and the slowest. And whoever stops running first is the one who may be eliminated.

The treadmill can turn for a long time, especially when state power (export controls, industrial policy, defense contracts) intervenes as external transfusion. State involvement cannot solve the reproduction problem, but it can defer the consequences beyond any useful forecasting horizon.

But deferral is not resolution. The treadmill is still turning. Kimi K3 has simply shifted it up another gear.

---

*This essay is adapted from a political economy study on "knowledge decommodification," which argues that "capability gap rent," as a rent form lacking stabilizers, has a reproduction failure mechanism: the frontier treadmill.*
