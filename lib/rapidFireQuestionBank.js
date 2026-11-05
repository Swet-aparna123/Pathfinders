// PATHFINDERS Rapid Fire Question Bank
// Contains 3 Education Tracks (10 focused scenarios each):
// Track A: Classes 8–10
// Track B: Classes 11–12
// Track C: Undergraduate and Postgraduate (UG/PG)

export const TRACK_A_QUESTIONS = [
  {
    id: 'trackA_q1',
    number: 1,
    title: 'Unexpected Problem',
    dimension: 'Problem-solving',
    type: 'subjective',
    prompt: 'You are working on a school project. Suddenly, one important part of your project stops working just before submission. What would you do first?',
    options: [
      { id: 'A', emoji: '🔍', text: 'Try to understand what went wrong.', pattern: 'root_cause_analysis', trait: 'Analytical problem-solver who investigates failure points first.' },
      { id: 'B', emoji: '👥', text: 'Ask someone who has experience with it.', pattern: 'collaborative_guidance', trait: 'Collaborative learner who leverages experienced mentors.' },
      { id: 'C', emoji: '💡', text: 'Find another way to complete the project.', pattern: 'adaptive_workaround', trait: 'Pragmatic pivot-maker who focuses on delivery and workarounds.' },
      { id: 'D', emoji: '⏳', text: 'Wait and see if the problem fixes itself.', pattern: 'passive_observation', trait: 'Patient observer who pauses before committing energy.' }
    ]
  },
  {
    id: 'trackA_q2',
    number: 2,
    title: 'Logical Reasoning',
    dimension: 'Logical reasoning',
    type: 'objective',
    prompt: 'Find the next number in the sequence:\n\n2, 6, 12, 20, 30, ?',
    correctOption: 'C',
    explanation: 'The differences between consecutive numbers increase by 2: +4, +6, +8, +10. The next difference is +12, giving 30 + 12 = 42.',
    options: [
      { id: 'A', emoji: '🔢', text: '36' },
      { id: 'B', emoji: '📐', text: '40' },
      { id: 'C', emoji: '🎯', text: '42' },
      { id: 'D', emoji: '🧮', text: '44' }
    ]
  },
  {
    id: 'trackA_q3',
    number: 3,
    title: 'Group Decision',
    dimension: 'Collaboration and decision-making',
    type: 'subjective',
    prompt: 'Your group cannot agree on one idea for a school activity. What would you do?',
    options: [
      { id: 'A', emoji: '🗳️', text: 'Support the idea most people prefer.', pattern: 'consensus_builder', trait: 'Values group harmony and democratic consensus.' },
      { id: 'B', emoji: '⚖️', text: 'Suggest comparing the advantages of each idea.', pattern: 'objective_evaluation', trait: 'Structured evaluator who uses criteria-based decision making.' },
      { id: 'C', emoji: '💬', text: 'Ask everyone to explain their reasons.', pattern: 'inquiry_oriented', trait: 'Empathetic listener who seeks deeper rationale before concluding.' },
      { id: 'D', emoji: '🚀', text: 'Choose an idea yourself and move forward.', pattern: 'decisive_leadership', trait: 'High-agency driver who unblocks stalled teams through direct action.' }
    ]
  },
  {
    id: 'trackA_q4',
    number: 4,
    title: 'Limited Resources',
    dimension: 'Resourcefulness',
    type: 'subjective',
    prompt: 'You have to complete a science model, but you do not have all the materials you need. What would you do?',
    options: [
      { id: 'A', emoji: '🔄', text: 'Look for alternative materials.', pattern: 'creative_substitution', trait: 'Resourceful improviser who repurposes available assets.' },
      { id: 'B', emoji: '🛠️', text: 'Change the model to fit the available materials.', pattern: 'scope_adaptation', trait: 'Adaptive planner who aligns project scope with constraints.' },
      { id: 'C', emoji: '🙋', text: 'Ask your teacher or classmates for help.', pattern: 'community_support', trait: 'Network builder who taps peer and mentor ecosystems.' },
      { id: 'D', emoji: '⏸️', text: 'Stop working until you get the required materials.', pattern: 'perfectionist_waiting', trait: 'Strict-spec perfectionist who avoids compromises without ideal inputs.' }
    ]
  },
  {
    id: 'trackA_q5',
    number: 5,
    title: 'Conflicting Information',
    dimension: 'Critical thinking',
    type: 'subjective',
    prompt: 'Two websites give you completely different answers to the same school question. What would you do?',
    options: [
      { id: 'A', emoji: '🌐', text: 'Trust the first website.', pattern: 'first_impression_reliance', trait: 'Relies on primacy and initial search hits.' },
      { id: 'B', emoji: '✨', text: 'Trust the website that looks more attractive.', pattern: 'aesthetic_heuristic', trait: 'Influenced by visual presentation and design polish.' },
      { id: 'C', emoji: '📚', text: 'Check other reliable sources before deciding.', pattern: 'triangulation_verification', trait: 'Fact-checker who cross-examines multiple authoritative sources.' },
      { id: 'D', emoji: '🧩', text: 'Choose whichever answer is easier to understand.', pattern: 'cognitive_ease', trait: 'Favours simplicity and intuitive comprehension.' }
    ]
  },
  {
    id: 'trackA_q6',
    number: 6,
    title: 'Learning from Failure',
    dimension: 'Learning from mistakes',
    type: 'subjective',
    prompt: 'You try solving a difficult puzzle but get the answer wrong three times. What would you most likely do?',
    options: [
      { id: 'A', emoji: '🔁', text: 'Try the same method again.', pattern: 'stubborn_grit', trait: 'Persistent brute-forcer who believes in repetition.' },
      { id: 'B', emoji: '🔀', text: 'Change your approach.', pattern: 'hypothesis_shift', trait: 'Agile thinker who pivots strategies upon negative feedback.' },
      { id: 'C', emoji: '🧑‍🏫', text: 'Ask someone to show you the solution.', pattern: 'solution_seeking', trait: 'Fast-tracks mastery by studying proven expert walkthroughs.' },
      { id: 'D', emoji: '🛑', text: 'Leave the puzzle and move on.', pattern: 'selective_engagement', trait: 'Pragmatic allocator who cuts losses when ROI diminishes.' }
    ]
  },
  {
    id: 'trackA_q7',
    number: 7,
    title: 'Unexpected Change',
    dimension: 'Adaptability',
    type: 'subjective',
    prompt: 'You prepared for a school competition, but the rules change at the last moment. What would you do?',
    options: [
      { id: 'A', emoji: '⚡', text: 'Quickly understand the new rules and adjust.', pattern: 'rapid_realignment', trait: 'Highly resilient and agile in dynamic environments.' },
      { id: 'B', emoji: '🎯', text: 'Continue with your original preparation.', pattern: 'core_consistency', trait: 'Anchors to original preparation and preserves momentum.' },
      { id: 'C', emoji: '🗣️', text: 'Ask the organiser what you should do.', pattern: 'authoritative_clarity', trait: 'Seeks authoritative clarification to remove ambiguity.' },
      { id: 'D', emoji: '😟', text: 'Feel frustrated and consider withdrawing.', pattern: 'stress_sensitivity', trait: 'Sensitive to sudden disruption; values predictable frameworks.' }
    ]
  },
  {
    id: 'trackA_q8',
    number: 8,
    title: 'Prioritisation',
    dimension: 'Prioritisation',
    type: 'subjective',
    prompt: 'You have a test tomorrow, a project due in two days and a hobby activity today. What would you do first?',
    options: [
      { id: 'A', emoji: '📖', text: 'Study for the test.', pattern: 'immediate_urgency', trait: 'Prioritises the most immediate deadline first.' },
      { id: 'B', emoji: '💻', text: 'Complete the project.', pattern: 'workload_clearance', trait: 'Clears substantial deliverables to create mental headroom.' },
      { id: 'C', emoji: '🎨', text: 'Attend the hobby activity.', pattern: 'wellbeing_restoration', trait: 'Values balance, recreation and emotional recharge.' },
      { id: 'D', emoji: '⏱️', text: 'Divide your time based on urgency and importance.', pattern: 'eisenhower_matrix', trait: 'Systematic planner who allocates time proportionally.' }
    ]
  },
  {
    id: 'trackA_q9',
    number: 9,
    title: 'Pattern Recognition',
    dimension: 'Pattern recognition',
    type: 'objective',
    prompt: 'Which number does not belong in this group?\n\n3, 9, 15, 21, 28, 33',
    correctOption: 'C',
    explanation: 'All the other numbers are divisible by 3 (3x1, 3x3, 3x5, 3x7, 3x11). 28 is not divisible by 3 (28 = 3x9 + 1).',
    options: [
      { id: 'A', emoji: '🔢', text: '9' },
      { id: 'B', emoji: '📐', text: '21' },
      { id: 'C', emoji: '🎯', text: '28' },
      { id: 'D', emoji: '🧮', text: '33' }
    ]
  },
  {
    id: 'trackA_q10',
    number: 10,
    title: 'Risk Evaluation',
    dimension: 'Risk evaluation',
    type: 'subjective',
    prompt: 'Your friend suggests trying a new activity that looks exciting but has some risks. What would you do?',
    options: [
      { id: 'A', emoji: '🎢', text: 'Try it immediately.', pattern: 'risk_seeking_explorer', trait: 'Spontaneous adventurer motivated by excitement and novelty.' },
      { id: 'B', emoji: '🛡️', text: 'Understand the risks before deciding.', pattern: 'calculated_risk_taker', trait: 'Prudent explorer who maps upside vs downside before committing.' },
      { id: 'C', emoji: '🛑', text: 'Avoid it because it is unfamiliar.', pattern: 'risk_averse_guardian', trait: 'Safety-first mindset prioritizing security and predictability.' },
      { id: 'D', emoji: '🧭', text: 'Ask someone experienced for advice.', pattern: 'mentor_guided_risk', trait: 'Seeks precedent and adult/mentor guidance when venturing out.' }
    ]
  }
];

export const TRACK_B_QUESTIONS = [
  {
    id: 'trackB_q1',
    number: 1,
    title: 'Competing Deadlines',
    dimension: 'Prioritisation',
    type: 'subjective',
    prompt: 'You have an important exam in three days, a practical submission tomorrow and a group presentation in two days. What would you do?',
    options: [
      { id: 'A', emoji: '🟢', text: 'Start with whichever task feels easiest.', pattern: 'momentum_builder', trait: 'Builds confidence through quick friction-free wins.' },
      { id: 'B', emoji: '📊', text: 'Prioritise based on deadlines and effort required.', pattern: 'strategic_triage', trait: 'Maps urgency vs effort matrix for optimal scheduling.' },
      { id: 'C', emoji: '🎯', text: 'Focus only on the exam.', pattern: 'high_stakes_singular', trait: 'Concentrates all firepower on the single highest-stakes item.' },
      { id: 'D', emoji: '🌊', text: 'Complete tasks as they come.', pattern: 'reactive_flow', trait: 'Handles demands sequentially in a natural reactive flow.' }
    ]
  },
  {
    id: 'trackB_q2',
    number: 2,
    title: 'Logical Reasoning',
    dimension: 'Logical reasoning',
    type: 'objective',
    prompt: 'Find the next number:\n\n4, 9, 19, 39, 79, ?',
    correctOption: 'C',
    explanation: 'Each term is obtained by multiplying the previous term by 2 and adding 1: 4*2+1 = 9; 9*2+1 = 19; 19*2+1 = 39; 39*2+1 = 79; 79*2+1 = 159.',
    options: [
      { id: 'A', emoji: '🔢', text: '119' },
      { id: 'B', emoji: '📐', text: '149' },
      { id: 'C', emoji: '🎯', text: '159' },
      { id: 'D', emoji: '🧮', text: '169' }
    ]
  },
  {
    id: 'trackB_q3',
    number: 3,
    title: 'Research Evaluation',
    dimension: 'Critical thinking',
    type: 'subjective',
    prompt: 'You find two research articles with contradictory conclusions. What would you do?',
    options: [
      { id: 'A', emoji: '📅', text: 'Select the more recent article.', pattern: 'recency_bias', trait: 'Leans on chronological recency as a primary validity proxy.' },
      { id: 'B', emoji: '🔬', text: 'Compare their methodology, evidence and sources.', pattern: 'rigorous_deconstruction', trait: 'Deeply dissects experimental design, data integrity, and citations.' },
      { id: 'C', emoji: '💭', text: 'Use whichever supports your existing opinion.', pattern: 'confirmation_lean', trait: 'Selects evidence aligned with preconceived hypotheses.' },
      { id: 'D', emoji: '🚫', text: 'Avoid using either article.', pattern: 'skeptical_discard', trait: 'High skepticism threshold that discards disputed claims entirely.' }
    ]
  },
  {
    id: 'trackB_q4',
    number: 4,
    title: 'Project Failure',
    dimension: 'Problem-solving',
    type: 'subjective',
    prompt: 'Your team has spent two weeks developing a project, but the prototype does not work. What would you do first?',
    options: [
      { id: 'A', emoji: '🔍', text: 'Identify the specific point of failure.', pattern: 'systematic_troubleshooting', trait: 'Isolates variables and isolates bugs through systematic debugging.' },
      { id: 'B', emoji: '🔄', text: 'Restart the project completely.', pattern: 'clean_slate_reset', trait: 'Prefers clean rebuild over messy incremental patching.' },
      { id: 'C', emoji: '🧑‍💼', text: 'Ask the supervisor to solve it.', pattern: 'escalation_seeking', trait: 'Escalates critical roadblocks promptly to leadership.' },
      { id: 'D', emoji: '✂️', text: 'Reduce the project\'s scope immediately.', pattern: 'defensive_descoping', trait: 'Protects delivery deadlines by stripping non-essential specs.' }
    ]
  },
  {
    id: 'trackB_q5',
    number: 5,
    title: 'Unfamiliar Challenge',
    dimension: 'Learning agility',
    type: 'subjective',
    prompt: 'You are assigned a topic you have never studied before. How would you approach it?',
    options: [
      { id: 'A', emoji: '🧱', text: 'Break it into smaller concepts and learn progressively.', pattern: 'first_principles_modular', trait: 'Deconstructs complex unknowns into manageable modular primitives.' },
      { id: 'B', emoji: '📦', text: 'Look for a ready-made solution.', pattern: 'practical_reuse', trait: 'Fast-tracks implementation via existing templates and pre-built code.' },
      { id: 'C', emoji: '🤝', text: 'Ask someone to complete the difficult parts.', pattern: 'specialist_delegation', trait: 'Leverages division of labor and outside technical specialists.' },
      { id: 'D', emoji: '🚪', text: 'Avoid the topic if possible.', pattern: 'familiarity_preference', trait: 'Protects performance by staying inside proven comfort zones.' }
    ]
  },
  {
    id: 'trackB_q6',
    number: 6,
    title: 'Team Conflict',
    dimension: 'Analytical decision-making',
    type: 'subjective',
    prompt: 'Two members of your project team strongly disagree about the technical approach. What would you do?',
    options: [
      { id: 'A', emoji: '🏅', text: 'Support the more experienced member.', pattern: 'authority_heuristic', trait: 'Defers to domain seniority and tenure.' },
      { id: 'B', emoji: '📋', text: 'Compare both approaches against the project requirements.', pattern: 'criteria_based_adjudication', trait: 'Evaluates options dispassionately against documented project specs.' },
      { id: 'C', emoji: '🏛️', text: 'Let the team leader decide without discussion.', pattern: 'hierarchical_deference', trait: 'Relies on executive command structure to avoid deadlock.' },
      { id: 'D', emoji: '👥', text: 'Divide the team into two groups.', pattern: 'parallel_experimentation', trait: 'Allows competing tracks to prove out their efficacy.' }
    ]
  },
  {
    id: 'trackB_q7',
    number: 7,
    title: 'Risk and Opportunity',
    dimension: 'Risk evaluation',
    type: 'subjective',
    prompt: 'You receive an opportunity to participate in a challenging competition, but it may affect your exam preparation. What would you do?',
    options: [
      { id: 'A', emoji: '🚀', text: 'Accept immediately.', pattern: 'ambitious_leap', trait: 'High-growth risk appetite embracing challenge over safe routines.' },
      { id: 'B', emoji: '🛑', text: 'Reject it immediately.', pattern: 'conservative_focus', trait: 'Protects core academic trajectory by eliminating outside distraction.' },
      { id: 'C', emoji: '⚖️', text: 'Evaluate the time commitment and potential benefits.', pattern: 'cost_benefit_calibration', trait: 'Quantifies time-investment vs upside before making balanced trade-off.' },
      { id: 'D', emoji: '🗣️', text: 'Ask your friends to decide.', pattern: 'peer_consensus_seeking', trait: 'Looks to peer group standards and norms for reassurance.' }
    ]
  },
  {
    id: 'trackB_q8',
    number: 8,
    title: 'Data Interpretation',
    dimension: 'Evidence-based reasoning',
    type: 'objective',
    prompt: 'A school survey shows that 60% of students prefer online learning, while 40% prefer classroom learning. Which conclusion is most reasonable?',
    correctOption: 'C',
    explanation: 'A scientific conclusion cannot extrapolate beyond the sample data. Option C is the only mathematically sound conclusion that does not over-generalise.',
    options: [
      { id: 'A', emoji: '🌐', text: 'Online learning is better for everyone.' },
      { id: 'B', emoji: '🏫', text: 'Classroom learning is outdated.' },
      { id: 'C', emoji: '📈', text: 'More students in this survey prefer online learning.' },
      { id: 'D', emoji: '🏆', text: 'Online learning will always produce better results.' }
    ]
  },
  {
    id: 'trackB_q9',
    number: 9,
    title: 'Changing Priorities',
    dimension: 'Adaptability',
    type: 'subjective',
    prompt: 'Halfway through a project, your supervisor changes the main objective. What would you do?',
    options: [
      { id: 'A', emoji: '⚓', text: 'Continue the original plan.', pattern: 'sunk_cost_anchoring', trait: 'Anchored to sunk effort; resists mid-flight directional changes.' },
      { id: 'B', emoji: '🧭', text: 'Understand the new objective and revise the plan.', pattern: 'dynamic_reorientation', trait: 'Adapts seamlessly to pivoting stakeholder directives.' },
      { id: 'C', emoji: '🏃', text: 'Ask to be removed from the project.', pattern: 'stability_demander', trait: 'Prefers stable scopes with immutable milestone agreements.' },
      { id: 'D', emoji: '💪', text: 'Complete both objectives regardless of time.', pattern: 'overachieving_straining', trait: 'Stretches capacity to accomplish both original and revised mandates.' }
    ]
  },
  {
    id: 'trackB_q10',
    number: 10,
    title: 'Decision with Incomplete Information',
    dimension: 'Judgement under uncertainty',
    type: 'subjective',
    prompt: 'You must make a decision, but some important information is unavailable. What would you do?',
    options: [
      { id: 'A', emoji: '⏳', text: 'Delay the decision indefinitely.', pattern: 'analysis_paralysis', trait: 'Reluctant to move until full certainty is guaranteed.' },
      { id: 'B', emoji: '🎲', text: 'Make assumptions and proceed without checking.', pattern: 'blind_momentum', trait: 'Moves aggressively forward on untested assumptions.' },
      { id: 'C', emoji: '🎯', text: 'Identify what is known, estimate uncertainty and make a reasoned decision.', pattern: 'bayesian_probabilistic', trait: 'Frames knowns vs unknowns, bounds downside, and decides rationally.' },
      { id: 'D', emoji: '🤷', text: 'Ask someone else to take responsibility.', pattern: 'accountability_shedding', trait: 'Deflects responsibility when consequences are unpredictable.' }
    ]
  }
];

export const TRACK_C_QUESTIONS = [
  {
    id: 'trackC_q1',
    number: 1,
    title: 'Research Problem',
    dimension: 'Analytical thinking',
    type: 'subjective',
    prompt: 'Your research experiment produces results that contradict your hypothesis. What would you do first?',
    options: [
      { id: 'A', emoji: '🔬', text: 'Check the methodology and data for possible errors.', pattern: 'rigorous_audit', trait: 'Audits instrument calibration, data pipelines and experimental methodology first.' },
      { id: 'B', emoji: '⚠️', text: 'Change the results to fit the hypothesis.', pattern: 'scientific_malpractice', trait: 'Unacceptable integrity risk; manipulates data to force fit.' },
      { id: 'C', emoji: '🛑', text: 'Abandon the research question.', pattern: 'premature_capitulation', trait: 'Discards investigation at the first sign of theoretical friction.' },
      { id: 'D', emoji: '🔁', text: 'Repeat the experiment without changing anything.', pattern: 'mechanical_replication', trait: 'Executes identical control runs before modifying variables.' }
    ]
  },
  {
    id: 'trackC_q2',
    number: 2,
    title: 'Logical Reasoning',
    dimension: 'Logical reasoning',
    type: 'objective',
    prompt: 'A process takes 5 machines 5 minutes to produce 5 units. How long would 100 machines take to produce 100 units, assuming identical independent production rates?',
    correctOption: 'A',
    explanation: 'If 5 machines make 5 units in 5 minutes, 1 machine makes 1 unit in 5 minutes. Therefore, 100 independent machines will produce 100 units concurrently in 5 minutes.',
    options: [
      { id: 'A', emoji: '⏱️', text: '5 minutes' },
      { id: 'B', emoji: '⏳', text: '20 minutes' },
      { id: 'C', emoji: '⌛', text: '100 minutes' },
      { id: 'D', emoji: '🕰️', text: '500 minutes' }
    ]
  },
  {
    id: 'trackC_q3',
    number: 3,
    title: 'Conflicting Evidence',
    dimension: 'Evidence evaluation',
    type: 'subjective',
    prompt: 'Two credible studies report different findings on the same topic. How would you evaluate them?',
    options: [
      { id: 'A', emoji: '📊', text: 'Compare sample sizes, methods, assumptions and limitations.', pattern: 'meta_analytic_critique', trait: 'Performs deep methodological meta-analysis across statistical powers and constraints.' },
      { id: 'B', emoji: '📑', text: 'Prefer the study with the larger number of citations.', pattern: 'popularity_metric_reliance', trait: 'Uses bibliometric citations as a primary proxy for veracity.' },
      { id: 'C', emoji: '💭', text: 'Choose the conclusion that matches your expectations.', pattern: 'cognitive_confirmation', trait: 'Favours findings confirming existing paradigm.' },
      { id: 'D', emoji: '➗', text: 'Average their conclusions without further analysis.', pattern: 'crude_compromise', trait: 'Splits differences mathematically without assessing sample validity.' }
    ]
  },
  {
    id: 'trackC_q4',
    number: 4,
    title: 'Project Constraints',
    dimension: 'Strategic problem-solving',
    type: 'subjective',
    prompt: 'Your project is behind schedule, and the available resources are limited. What would you do?',
    options: [
      { id: 'A', emoji: '🎯', text: 'Reassess scope, dependencies and critical deliverables.', pattern: 'critical_path_triage', trait: 'Restructures work breakdown structure and critical paths to safeguard milestones.' },
      { id: 'B', emoji: '🚜', text: 'Continue the original plan regardless of feasibility.', pattern: 'inflexible_dogmatism', trait: 'Persists on doomed course out of organizational inertia.' },
      { id: 'C', emoji: '➕', text: 'Add more features to improve the final output.', pattern: 'scope_creep_distraction', trait: 'Masks delivery slip by bloating feature list.' },
      { id: 'D', emoji: '⏸️', text: 'Wait until additional resources become available.', pattern: 'resource_dependency_halt', trait: 'Freezes operations awaiting capital or headcount expansion.' }
    ]
  },
  {
    id: 'trackC_q5',
    number: 5,
    title: 'Ambiguous Assignment',
    dimension: 'Handling ambiguity',
    type: 'subjective',
    prompt: 'You receive an assignment with an unclear problem statement. What would you do?',
    options: [
      { id: 'A', emoji: '💡', text: 'Clarify the expected outcome and assumptions.', pattern: 'proactive_requirements_alignment', trait: 'Engages stakeholders upfront to crystallize ambiguous requirements.' },
      { id: 'B', emoji: '🧭', text: 'Make your own interpretation without checking.', pattern: 'autonomous_presumption', trait: 'Proceeds unilaterally on internal interpretation without alignment.' },
      { id: 'C', emoji: '⏳', text: 'Wait for someone else to explain it.', pattern: 'passive_clarification', trait: 'Waits for ambient clarity or third-party interpretations.' },
      { id: 'D', emoji: '🏎️', text: 'Begin implementation immediately.', pattern: 'premature_execution', trait: 'Drives immediately into coding/building before defining success criteria.' }
    ]
  },
  {
    id: 'trackC_q6',
    number: 6,
    title: 'Team Disagreement',
    dimension: 'Collaborative decision-making',
    type: 'subjective',
    prompt: 'A multidisciplinary team disagrees about the best solution. What would you do?',
    options: [
      { id: 'A', emoji: '⚖️', text: 'Compare options using shared criteria and evidence.', pattern: 'multi_criteria_matrix', trait: 'Establishes shared objective metrics to depersonalize debates.' },
      { id: 'B', emoji: '👔', text: 'Follow the opinion of the most senior member.', pattern: 'hierarchical_acquiescence', trait: 'Submits to organizational hierarchy and title weight.' },
      { id: 'C', emoji: '🤐', text: 'Avoid discussing the disagreement.', pattern: 'conflict_avoidance', trait: 'Avoids uncomfortable friction at the expense of sound technical debate.' },
      { id: 'D', emoji: '🛋️', text: 'Select the solution that requires the least effort.', pattern: 'path_of_least_resistance', trait: 'Default to lowest implementation friction regardless of quality.' }
    ]
  },
  {
    id: 'trackC_q7',
    number: 7,
    title: 'Opportunity Cost',
    dimension: 'Opportunity evaluation',
    type: 'subjective',
    prompt: 'You have an opportunity to join a research project, but it will reduce the time available for an internship. How would you decide?',
    options: [
      { id: 'A', emoji: '📈', text: 'Evaluate the learning outcomes, time investment and long-term goals.', pattern: 'strategic_longterm_alignment', trait: 'Maps compound career value, skill delta and long-horizon goals.' },
      { id: 'B', emoji: '🏛️', text: 'Choose the more prestigious option automatically.', pattern: 'prestige_heuristics', trait: 'Anchors on social brand prestige and institutional pedigree.' },
      { id: 'C', emoji: '💰', text: 'Choose whichever option pays more.', pattern: 'short_term_liquidity', trait: 'Optimises for immediate financial yield.' },
      { id: 'D', emoji: '🛑', text: 'Reject both opportunities.', pattern: 'overwhelm_avoidance', trait: 'Withdraws to prevent perceived workload stress.' }
    ]
  },
  {
    id: 'trackC_q8',
    number: 8,
    title: 'Quantitative Reasoning',
    dimension: 'Quantitative reasoning',
    type: 'objective',
    prompt: 'A product\'s price increases by 20% and then decreases by 20%. Compared with its original price, the final price is:',
    correctOption: 'B',
    explanation: 'Let original price = 100. A 20% increase makes it 120. A 20% decrease on 120 is 0.20 * 120 = 24. Final price = 120 - 24 = 96, which is 4% lower than 100.',
    options: [
      { id: 'A', emoji: '🟰', text: 'The same' },
      { id: 'B', emoji: '📉', text: '4% lower' },
      { id: 'C', emoji: '📈', text: '4% higher' },
      { id: 'D', emoji: '📊', text: '2% lower' }
    ]
  },
  {
    id: 'trackC_q9',
    number: 9,
    title: 'Rapid Change',
    dimension: 'Adaptability',
    type: 'subjective',
    prompt: 'A key assumption in your project becomes invalid halfway through implementation. What would you do?',
    options: [
      { id: 'A', emoji: '🛠️', text: 'Revisit the assumptions and redesign the affected parts.', pattern: 'agile_architecture_redesign', trait: 'Gracefully refactors design while preserving reusable modules.' },
      { id: 'B', emoji: '⚓', text: 'Continue because significant work has already been completed.', pattern: 'sunk_cost_fallacy', trait: 'Pours effort into invalid systems due to psychological attachment.' },
      { id: 'C', emoji: '🙈', text: 'Hide the issue until the deadline.', pattern: 'information_concealment', trait: 'Conceals known defects to delay accountability.' },
      { id: 'D', emoji: '💥', text: 'Abandon the entire project immediately.', pattern: 'fragile_catastrophising', trait: 'Over-reacts to architectural invalidations by scrapping everything.' }
    ]
  },
  {
    id: 'trackC_q10',
    number: 10,
    title: 'Ethical Decision-making',
    dimension: 'Ethical judgement',
    type: 'subjective',
    prompt: 'You discover a data inconsistency that could make your project\'s results appear more successful than they actually are. What would you do?',
    options: [
      { id: 'A', emoji: '🛡️', text: 'Report the inconsistency and investigate its cause.', pattern: 'uncompromising_integrity', trait: 'Maintains unshakeable intellectual honesty and transparency.' },
      { id: 'B', emoji: '🕶️', text: 'Ignore it if the overall result looks convincing.', pattern: 'expedient_compromise', trait: 'Tolerates anomalies to secure superficial accolades.' },
      { id: 'C', emoji: '🗑️', text: 'Remove the inconvenient data without documentation.', pattern: 'data_fabrication', trait: 'Severe integrity hazard; censors dissenting data.' },
      { id: 'D', emoji: '⏱️', text: 'Wait to see whether anyone notices.', pattern: 'passive_evasion', trait: 'Passes ethical accountability to downstream reviewers.' }
    ]
  }
];

export function getTrackIdForEducationLevel(educationLevel) {
  if (!educationLevel) return 'track_a';
  const raw = String(educationLevel).toLowerCase();
  if (raw.includes('8') || raw.includes('9') || raw.includes('10') || raw.includes('junior') || raw.includes('middle')) {
    return 'track_a';
  }
  if (raw.includes('11') || raw.includes('12') || raw.includes('higher') || raw.includes('senior')) {
    return 'track_b';
  }
  if (raw.includes('undergraduate') || raw.includes('college') || raw.includes('postgraduate') || raw.includes('master') || raw.includes('phd') || raw.includes('degree')) {
    return 'track_c';
  }
  return 'track_a';
}

export function getQuestionsForEducationLevel(educationLevel) {
  const trackId = getTrackIdForEducationLevel(educationLevel);
  switch (trackId) {
    case 'track_b':
      return { trackId: 'class_11_12', trackLabel: 'Track B: Classes 11–12', questions: TRACK_B_QUESTIONS };
    case 'track_c':
      return { trackId: 'undergrad_postgrad', trackLabel: 'Track C: Undergraduate & Postgraduate', questions: TRACK_C_QUESTIONS };
    case 'track_a':
    default:
      return { trackId: 'class_8_10', trackLabel: 'Track A: Classes 8–10', questions: TRACK_A_QUESTIONS };
  }
}
