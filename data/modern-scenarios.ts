/**
 * Modern scenario comparisons: an editorial illustration of how a teaching
 * might be thought about in everyday settings. They are NOT scripture and NOT
 * commentary; every one is shown labelled as editorial content and as a draft
 * until a named reviewer is recorded.
 */
export type ScenarioSetting = 'student' | 'professional' | 'creative' | 'family';

export const SETTING_LABEL: Record<ScenarioSetting, string> = {
  student: 'Student life',
  professional: 'Professional life',
  creative: 'Creative work',
  family: 'Family responsibility',
};

export interface ModernScenarioSet {
  scriptureId: string;
  chapter: number;
  verse: number;
  /** The teaching being illustrated, in one plain sentence. */
  teaching: string;
  scenarios: Array<{ setting: ScenarioSetting; situation: string; reading: string }>;
  review: 'draft' | 'editorial-review' | 'approved';
  reviewer?: string;
  reviewDate?: string;
}

export const MODERN_SCENARIOS: ModernScenarioSet[] = [
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 11,
    teaching: 'The wise mourn neither for the living nor the dead; cut through intellectual rationalizations that disguise fear of duty.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Spending weeks debating the flaws of competitive exams or unfair grading systems instead of sitting down to prepare for them.',
        reading: 'Intellectualizing why a system is broken is often a subconscious defense against the discomfort of studying. The wise see through their own rationalizations and put in honest, focused work.'
      },
      {
        setting: 'professional',
        situation: 'Writing lengthy analytical memos and endless counter-arguments to avoid making an urgent, high-stakes executive call.',
        reading: 'When leaders hide behind intellectual complexity to avoid accountability, teams stall. Recognize when eloquent reasoning is merely masked fear, and make the principled decision.'
      },
      {
        setting: 'creative',
        situation: 'Endlessly critiquing the current artistic market or algorithm rather than sitting down to create new work.',
        reading: 'It is easy to construct sophisticated intellectual reasons why audiences do not appreciate true art. Cut through the complaints and return to the sacred work of creating.'
      },
      {
        setting: 'family',
        situation: 'Over-intellectualizing a simple, uncomfortable domestic conversation that needs immediate honest communication.',
        reading: 'Philosophical debates and theoretical justifications at dinner cannot substitute for direct, compassionate honesty when solving everyday household frictions.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 13,
    teaching: 'Just as the embodied soul passes through childhood, youth, and old age, it transitions to another body; the steady are not bewildered.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Feeling disoriented and anxious when graduating from school and facing the intimidating unknown of college or adulthood.',
        reading: 'Transitioning from student life to the next phase is as natural as leaving childhood for youth. Your core awareness has successfully navigated every past change; trust that you will thrive in the next chapter.'
      },
      {
        setting: 'professional',
        situation: 'Struggling with identity and grief when a long career phase ends due to automation, restructuring, or retirement.',
        reading: 'A professional designation was a season of life, not your permanent essence. Embracing life’s natural transitions allows you to step forward into mentorship and fresh purpose without despair.'
      },
      {
        setting: 'creative',
        situation: 'Grieving the loss of early youthful spontaneity or changing artistic styles as you mature into mid-career craft.',
        reading: 'Artistic seasons evolve just like biological years. Deepening maturity and refined restraint carry their own profound beauty; embrace your artistic evolution rather than clinging to past phases.'
      },
      {
        setting: 'family',
        situation: 'Facing an "empty nest" when children grow up and move away, or noticing sudden physical decline in aging parents.',
        reading: 'Life flows through orderly passages. Rather than resisting the changing seasons of family life, honor each era with love and remain grounded in the enduring bond that transcends physical proximity.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 14,
    teaching: 'Sensory impressions of heat and cold, joy and sorrow are temporary and passing; bear them with patient equanimity.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-18',
    scenarios: [
      {
        setting: 'student',
        situation: 'Feeling severe test anxiety and physical exhaustion during intense examination cycles.',
        reading: 'Physical stress and nervous butterflies are natural biological waves. Remind yourself they are temporary sensations that rise and subside, and stay focused on studying one question at a time.'
      },
      {
        setting: 'professional',
        situation: 'Navigating sharp corporate reorganization, shifting deadlines, or market downturns.',
        reading: 'Periods of corporate pressure and professional acclaim alternate like winter and summer. Keep your inner poise intact; do not interpret temporary headwinds as permanent failure.'
      },
      {
        setting: 'creative',
        situation: 'Receiving harsh critical reviews or indifferent silence after unveiling new work.',
        reading: 'Both praise and blame are external weather. They pass quickly. Anchor your self-worth in the honesty of your craft rather than the changing opinions of the audience.'
      },
      {
        setting: 'family',
        situation: 'Enduring seasonal domestic friction or arguments over household responsibilities.',
        reading: 'Emotional tempers rise and cool. Instead of reacting impulsively to heated words in the moment, practice patience knowing that family moods fluctuate like the weather.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 20,
    teaching: 'The conscious Self is never born and never dies; it is eternal and untouched by bodily changes.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-19',
    scenarios: [
      {
        setting: 'student',
        situation: 'Struggling with self-esteem and feeling defined entirely by low test scores or academic ranking.',
        reading: 'Marks measure preparation for a specific test, not your fundamental worth as a conscious human being. Your awareness is far vaster than an academic scorecard.'
      },
      {
        setting: 'professional',
        situation: 'Experiencing identity crisis after sudden job loss, demotion, or career setback.',
        reading: 'A corporate designation is an external role you inhabited, not your essential self. Recognizing your inner witness remains intact gives you resilience to rebuild.'
      },
      {
        setting: 'creative',
        situation: 'Fearing that aging or changing artistic trends will render your life obsolete.',
        reading: 'The creative source within you is timeless awareness. Forms and styles evolve, but the quiet consciousness witnessing the art is unborn and unexhausted.'
      },
      {
        setting: 'family',
        situation: 'Processing profound grief and bereavement following the loss of an elder or loved one.',
        reading: 'While physical departure is painful, the spirit of love and consciousness that animated them is deathless. Cherish their enduring gifts without falling into despair.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 22,
    teaching: 'As a person sheds worn-out garments and puts on new ones, the soul casts off worn-out bodies and enters new ones.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Paralyzed by body-image insecurities, acne, or physical awkwardness during teenage and college years.',
        reading: 'The body is merely clothing worn by your consciousness. Taking good care of health is wise, but measuring your human dignity against cosmetic fabric robs you of peace. You are the conscious wearer.'
      },
      {
        setting: 'professional',
        situation: 'Experiencing sudden injury, chronic pain, or physical limitations that force a change in physical work routine.',
        reading: 'When physical hardware experiences glitches or decline, it is easy to succumb to panic. Remembering that your conscious intellect is distinct from bodily instruments grants patience and dignity in rehabilitation.'
      },
      {
        setting: 'creative',
        situation: 'Seeing an old creative medium, company, or platform die out, feeling that your artistic voice has been buried with it.',
        reading: 'Tools, software, and physical platforms are temporary garments for your creative spirit. Discard the obsolete medium without grief and pour your enduring vision into new vessels.'
      },
      {
        setting: 'family',
        situation: 'Supporting a loved one through palliative care or processing bereavement after their physical departure.',
        reading: 'Seeing their departure as shedding an exhausted, painful garment brings profound solace. The love, consciousness, and spiritual connection endure unbroken beyond the physical vessel.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 48,
    teaching: 'Perform your duties established in yoga, casting off attachment; remain equal in success and failure; equanimity is yoga.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Receiving either an unexpectedly high grade or an unexpected failing grade on a midterm test.',
        reading: 'If you score top marks, do not let arrogance stop your study habits. If you score poorly, do not let shame paralyze your effort. Review the answers calmly, learn the principles, and return to study with the same steady routine.'
      },
      {
        setting: 'professional',
        situation: 'Presenting a major proposal to clients: it might be accepted with fanfare or rejected completely.',
        reading: 'Do the engineering and presentation with utmost dedication. If it wins, celebrate modestly; if it loses, examine the notes objectively. Maintaining inner poise through both outcomes is the definition of professional mastery.'
      },
      {
        setting: 'creative',
        situation: 'Releasing an album or novel into the market, where reviews range from glowing praise to stinging criticism.',
        reading: 'Both applause and blame can knock an artist off balance. Anchor yourself in the integrity of the craft. Keep your mind centered, treat feedback constructively, and get back to creating.'
      },
      {
        setting: 'family',
        situation: 'Planning a large family gathering or festival celebration where unforeseen disruptions or misunderstandings occur.',
        reading: 'Give your sincere effort to hospitality and care. Whether everyone is overjoyed or minor arguments break out, preserve your inner peace without being dragged into drama.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 47,
    teaching: 'Your claim is on the action, not on its fruits: do the work fully without making the result the only measure.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-20',
    scenarios: [
      {
        setting: 'student',
        situation: 'Preparing for a high-stakes competitive entrance exam whose rank cutoffs are completely out of your hands.',
        reading: 'The study hours, honest practice, deep rest, and focused revision are the part that is yours to direct; the cutoff percentile is shaped by countless external variables.'
      },
      {
        setting: 'professional',
        situation: 'Delivering an intricate client proposal or software product that executives may still decline.',
        reading: 'Do the engineering and research with utmost care. Judge your effort by its intrinsic craftsmanship, and treat the client’s ultimate decision as diagnostic feedback rather than a personal verdict.'
      },
      {
        setting: 'creative',
        situation: 'Writing a novel, painting a canvas, or composing music that algorithms might bury.',
        reading: 'Full presence belongs to the brushstroke, the sentence, and the melody. When you obsess over algorithmic engagement, the craft suffers; work for the love of the expression itself.'
      },
      {
        setting: 'family',
        situation: 'Devoting countless caretaking hours to an ailing elder or raising a child with behavioral challenges.',
        reading: 'The compassion and attentive care you provide every day is the noble action that is yours to give; the unpredictable recovery curve cannot dictate whether your devotion was meaningful.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 55,
    teaching: 'When one renounces all desires originating in the mind and is satisfied in the Self alone, one is called steady in wisdom.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Feeling constantly restless, checking phone notifications every three minutes while trying to study.',
        reading: 'The compulsive itch for digital dopamine is a mental craving. When you sit quietly, take three deep breaths, and find contentment in the present study session, your focus deepens effortlessly.'
      },
      {
        setting: 'professional',
        situation: 'Feeling chronic dissatisfaction despite promotions, constantly eyeing colleagues’ titles, salaries, and perks.',
        reading: 'The hedonic treadmill has no finish line. Real professional freedom begins when your baseline contentment is rooted within, freeing you to work with excellence rather than chronic insecurity.'
      },
      {
        setting: 'creative',
        situation: 'Feeling creatively blocked because you are trying to anticipate what audience or algorithm trends will reward next.',
        reading: 'Creating from a desire for applause produces hollow art. When you are content in your own inner truth, your work discovers authentic depth and original voice.'
      },
      {
        setting: 'family',
        situation: 'Comparing your home, vehicle, or lifestyle with affluent relatives and feeling resentment at domestic simplicity.',
        reading: 'Outer possessions cannot fill an inner void. Gratitude and contentment in the simple reality of your home bring richer joy than a lifetime of envious striving.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 56,
    teaching: 'Unshaken in sorrow, free from craving in pleasures, and released from passion, fear, and anger, one is a sage of steady mind.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Navigating academic burnout when tough assignments pile up and frustration threatens to explode into quitting.',
        reading: 'Do not panic in distress (duhkha), and do not daydream frantically about escapist holidays. Step back, release the anger at professors, and address one problem at a time with steady calm.'
      },
      {
        setting: 'professional',
        situation: 'Managing team leadership during a sharp corporate downturn or budget freeze.',
        reading: 'Anxiety and fear spread quickly to teams when leaders panic. Maintaining poise without reactive anger or despair stabilizes team morale and enables clear strategic pivots.'
      },
      {
        setting: 'creative',
        situation: 'Experiencing severe creative block or harsh public criticism after months of dedicated labor.',
        reading: 'Meet criticism without defensive fury or despair. Discard the fear of failure, examine the work with detached discernment, and let the emotional storm blow past.'
      },
      {
        setting: 'family',
        situation: 'Handling prolonged family crises, such as caring for a sick relative while juggling household duties.',
        reading: 'When demands feel relentless, emotional reactivity can turn into resentment toward loved ones. Releasing anger and fear keeps the heart patient, gentle, and resilient.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 62,
    teaching: 'Dwelling on sensory objects produces mental craving; craving breeds anger; anger leads to clouding of memory and ruin of intellect.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-20',
    scenarios: [
      {
        setting: 'student',
        situation: 'Endlessly scrolling social media feeds and gaming content during critical study hours.',
        reading: 'Repeatedly browsing digital stimuli creates unconscious cravings. When interrupted or falling behind, frustration and anger erupt, shattering concentration and study stamina.'
      },
      {
        setting: 'professional',
        situation: 'Obsessing over a colleague’s promotion, office politics, or salary comparisons.',
        reading: 'Fixating on what others receive sparks jealousy and resentment. In that agitated state, professional judgment collapses, leading to regrettable email outbursts or poor choices.'
      },
      {
        setting: 'creative',
        situation: 'Compulsively checking follower numbers, viral metrics, and online validation.',
        reading: 'Craving external praise turns creative joy into anxiety. When posts underperform, bitter resentment arises, drying up genuine artistic inspiration.'
      },
      {
        setting: 'family',
        situation: 'Brooding over perceived domestic slights or material comparisons with relatives.',
        reading: 'Replaying grievances in your head magnifies minor frictions into volcanic arguments. Catching the thought early prevents the chain reaction from destroying family harmony.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 63,
    teaching: 'From anger comes delusion; from delusion confusion of memory; from lost memory the ruin of intellect; and from ruin of intellect one perishes.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Feeling accused or treated unfairly by an instructor, tempted to storm out or engage in an abusive confrontation.',
        reading: 'Wrath blinds discernment. In a matter of seconds, memory of your academic goals and values dissolves, leading to actions that risk expulsion. Pause, step outside, and cool down before speaking.'
      },
      {
        setting: 'professional',
        situation: 'Receiving an antagonistic or disrespectful email from a business partner or senior executive.',
        reading: 'Responding in burning rage destroys executive judgment. Memory of professional ethics is eclipsed, and an impulsive reply can ruin a career overnight. Wait until the emotional storm clears before writing.'
      },
      {
        setting: 'creative',
        situation: 'Seeing your original work copied, plagiarized, or unfairly dismissed on social media.',
        reading: 'Righteous outrage is understandable, but reacting with unguided fury blinds your strategy. Protect your intellectual property with calm, legal precision rather than a self-destructive public flame war.'
      },
      {
        setting: 'family',
        situation: 'A heated argument over money, inheritance, or chores where voices escalate and insults begin flying.',
        reading: 'Anger erases memory of decades of love and family bond. Once that memory is lost, cruel words inflict lifelong scars. Walk away, breathe, and revisit the conversation when intellect has returned.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 3,
    verse: 19,
    teaching: 'Perform your obligatory work constantly without attachment; acting without selfish clutching leads to the highest state.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-22',
    scenarios: [
      {
        setting: 'student',
        situation: 'Completing routine homework, lab records, and assigned readings without procrastinating.',
        reading: 'Show up and complete daily coursework as an act of personal discipline, without waiting for special mood or excitement. Consistent daily action builds mastery effortlessly.'
      },
      {
        setting: 'professional',
        situation: 'Executing critical system maintenance, documentation, or compliance reviews that offer zero glamour.',
        reading: 'Unsung infrastructural tasks sustain the organization. Doing essential groundwork diligently without chasing applause brings deep professional integrity and calm.'
      },
      {
        setting: 'creative',
        situation: 'Practicing daily scales, sketch studies, or vocal warm-ups behind closed doors.',
        reading: 'The unglamorous daily drills are where real artistry is forged. Approach daily practice with quiet devotion rather than impatience for stage spotlight.'
      },
      {
        setting: 'family',
        situation: 'Managing daily chores—cooking meals, grocery shopping, laundry, and cleaning.',
        reading: 'Ordinary household upkeep can feel tedious when treated as a burden. Approached as quiet service for family wellbeing, everyday chores become peaceful mindfulness.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 3,
    verse: 35,
    teaching: 'Better is one’s own authentic duty (Svadharma) imperfectly performed than another’s duty performed well.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-22',
    scenarios: [
      {
        setting: 'student',
        situation: 'Pressured by peer groups and parental expectations to choose an engineering stream despite a natural calling for environmental biology.',
        reading: 'Struggling through an artificial career to satisfy external status breeds misery and burnout. Pursuing your genuine aptitude—even if it seems less conventional—builds durable competence and fulfillment.'
      },
      {
        setting: 'professional',
        situation: 'Tempted to copy aggressive, manipulative leadership styles seen in viral executive bios.',
        reading: 'Imitating toxic or unnatural management methods creates impostor syndrome. Lead with your own natural strengths—such as empathy, thoroughness, and quiet clarity.'
      },
      {
        setting: 'creative',
        situation: 'Abandoning your unique minimalist writing style to copy the current sensational bestseller formula.',
        reading: 'Chasing other artists’ trends produces synthetic art. Even an imperfect expression of your own authentic voice carries far more power and originality.'
      },
      {
        setting: 'family',
        situation: 'Comparing your parenting style or family budget to extravagant influencer households on Instagram.',
        reading: 'Every household has its own unique financial realities, values, and rhythm. Ground your family life in what works authentically for your home rather than imitation.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 4,
    verse: 38,
    teaching: 'Truly, there is nothing in this world as purifying as spiritual knowledge; one who is perfected in yoga finds it within in due time.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-24',
    scenarios: [
      {
        setting: 'student',
        situation: 'Memorizing formulas mechanically without understanding underlying principles, leading to constant panic.',
        reading: 'Rote memorization causes fragile confidence. When you invest time to truly understand the core concept, anxiety dissolves and genuine mastery emerges naturally.'
      },
      {
        setting: 'professional',
        situation: 'Relying on hasty shortcuts and buzzwords instead of deeply understanding your industry’s fundamentals.',
        reading: 'True knowledge purifies professional work of superficial bluffing. Deep domain understanding earns respect and provides solutions during unexpected crises.'
      },
      {
        setting: 'creative',
        situation: 'Feeling blocked and creatively depleted by repeating old tricks.',
        reading: 'Return to studying great masters, understanding music theory, or exploring human psychology. Fresh, deep understanding replenishes the well of inspiration.'
      },
      {
        setting: 'family',
        situation: 'Reacting with suspicion and gossip during a complex inter-family dispute.',
        reading: 'Unverified assumptions fuel discord. Seeking accurate facts with calm empathy clears misunderstandings far faster than defensive accusations.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 6,
    verse: 5,
    teaching: 'Elevate yourself through your own mind; do not degrade yourself; the mind alone is your greatest friend or worst enemy.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-26',
    scenarios: [
      {
        setting: 'student',
        situation: 'Caught in a downward spiral of negative self-talk after a disappointing exam score: "I am useless; I will never succeed."',
        reading: 'Harsh internal bullying paralyzes effort. Use the mind as an encouraging coach: acknowledge the setback, diagnose weak areas without shame, and take the next constructive step.'
      },
      {
        setting: 'professional',
        situation: 'Paralyzed by impostor syndrome before delivering an important keynote or leading a new team.',
        reading: 'Your anxious thoughts are just mental projections, not objective facts. Befriend your mind by focusing on your preparation and how your contribution helps others.'
      },
      {
        setting: 'creative',
        situation: 'Deleting drafts and abandoning canvases because the inner critic declares them imperfect.',
        reading: 'The inner critic can become a tyrant that silences creative courage. Reframe the mind as a supportive collaborator who allows imperfect drafts on the way to beauty.'
      },
      {
        setting: 'family',
        situation: 'Replaying past regrets and harboring silent resentment about family choices.',
        reading: 'Dwelling on bitter narratives degrades your emotional health and poisons the home atmosphere. Consciously direct your thoughts toward gratitude and forgiveness.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 6,
    verse: 26,
    teaching: 'From whatever direction the restless and unsteady mind wanders, bring it gently back under the control of the Self.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-26',
    scenarios: [
      {
        setting: 'student',
        situation: 'Sitting down to study and realizing your mind has drifted into daydreaming about weekend plans.',
        reading: 'Do not punish or berate yourself for getting distracted. The moment you notice the wandering, gently redirect your attention back to the current paragraph.'
      },
      {
        setting: 'professional',
        situation: 'Losing focus during an important strategic meeting due to incoming chat notifications and email pings.',
        reading: 'Distraction is the modern default. When you catch your attention drifting, pause, take a deep breath, close extraneous tabs, and return fully to the conversation.'
      },
      {
        setting: 'creative',
        situation: 'Wandering off into browsing unrelated websites while struggling with a difficult chapter or musical chord progression.',
        reading: 'Resistance and wandering happen when work gets tough. Without frustration, gently place your fingers back on the keyboard or instrument and play the next note.'
      },
      {
        setting: 'family',
        situation: 'Checking your smartphone while your child or spouse is trying to share their day’s experiences.',
        reading: 'Notice when technology steals your presence. Put the screen down, look into their eyes, and return wholeheartedly to listening with your full attention.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 6,
    verse: 35,
    teaching: 'The mind is undoubtedly hard to hold like the wind, but it can be mastered through consistent practice (Abhyasa) and non-attachment (Vairagya).',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-26',
    scenarios: [
      {
        setting: 'student',
        situation: 'Finding concentration impossible after weeks of erratic sleep and digital overstimulation.',
        reading: 'Do not expect instant meditative perfection. Train your focus in short, daily, dedicated intervals (practice), while reducing mindless phone snacking (non-attachment).'
      },
      {
        setting: 'professional',
        situation: 'Constantly feeling overwhelmed by multitasking, urgent emails, and fragmented focus.',
        reading: 'Build the muscle of deep work through routine daily blocks (Abhyasa), while letting go of the compulsive need to respond immediately to every ping (Vairagya).'
      },
      {
        setting: 'creative',
        situation: 'Experiencing prolonged creative dry spells and feeling like quitting.',
        reading: 'Show up at the drafting table every morning regardless of inspiration (Abhyasa), and surrender your fixation on making every single session brilliant (Vairagya).'
      },
      {
        setting: 'family',
        situation: 'Trying to establish healthy habits of shared family dinners and screen-free evenings.',
        reading: 'New family routines take time and slip frequently. Keep reintroducing the practice with patience and cheerfulness, gently letting go of past failures.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 12,
    verse: 13,
    teaching: 'One who has no hatred toward any creature, who is friendly and compassionate, free from egoism and possessiveness, equal in sorrow and joy—is dear to the Divine.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-02',
    scenarios: [
      {
        setting: 'student',
        situation: 'Surrounded by toxic gossip, academic rivalries, and classroom cliques.',
        reading: 'Refuse to participate in putting down classmates. Maintain a friendly, supportive posture toward everyone, sharing study notes generously without petty competition.'
      },
      {
        setting: 'professional',
        situation: 'Dealing with a difficult, abrasive coworker who takes credit for joint projects.',
        reading: 'Resist reacting with hatred or vindictive sabotage. Maintain clear professional boundaries, communicate facts calmly, and preserve your internal kindness.'
      },
      {
        setting: 'creative',
        situation: 'Seeing peer artists receive disproportionate hype, awards, and commercial deals.',
        reading: 'Replace envy with genuine goodwill (Maitri). The creative community is not a zero-sum battlefield; celebrate others’ successes while quietly honing your own craft.'
      },
      {
        setting: 'family',
        situation: 'Handling strained relationships with demanding in-laws or estranged relatives during festival gatherings.',
        reading: 'Practice hospitality and respect without clinging to expectations of approval. Meeting hostility with unshakeable dignity and warmth cools family friction.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 18,
    verse: 48,
    teaching: 'One should not abandon work natural to one’s disposition, even if flawed; for all endeavors are clouded by imperfection like fire by smoke.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-08',
    scenarios: [
      {
        setting: 'student',
        situation: 'Paralyzed by perfectionism, refusing to submit an essay because it does not feel 100% flawless.',
        reading: 'Every human effort has some flaw or oversight. Deliver your work with an honest heart; completion and iterative learning are far more valuable than perfectionist paralysis.'
      },
      {
        setting: 'professional',
        situation: 'Delaying a critical product launch because edge cases or minor UI bugs cannot be completely eliminated.',
        reading: 'No complex system is completely free of imperfection. Launch the stable core, gather user feedback, and iterate; fire always generates smoke, but it still provides warmth and light.'
      },
      {
        setting: 'creative',
        situation: 'Abandoning a recording or painting halfway through because the executed version falls short of the ideal imagined in your head.',
        reading: 'The gap between imagination and physical medium is normal for every artist. Accept the imperfections of the physical craft and bring the work to completion.'
      },
      {
        setting: 'family',
        situation: 'Feeling guilty because your parenting or family lifestyle does not match an idealized, picture-perfect domestic ideal.',
        reading: 'Real family life is messy, noisy, and imperfect. Do your best with loving intention each day; do not let unrealistic ideals rob you of gratitude for your home.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 18,
    verse: 66,
    teaching: 'Abandoning all secondary dependencies, surrender unto Me alone; I will deliver you from all sorrow; grieve not!',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-08',
    scenarios: [
      {
        setting: 'student',
        situation: 'Paralyzed by overwhelming future uncertainty: college admissions, career prospects, financial independence.',
        reading: 'You have done the preparation you can. Now surrender the anxious clutching of your intellect into the hands of the higher reality. Breathe deeply and trust that your life will unfold with purpose.'
      },
      {
        setting: 'professional',
        situation: 'Bearing heavy leadership responsibility during a severe company restructuring where all options carry risk.',
        reading: 'When intellect has reached its analytical limits, surrender the burden of solitary control to the cosmic intelligence. Act with integrity and let go of obsessive worry.'
      },
      {
        setting: 'creative',
        situation: 'Experiencing existential crisis and doubting whether your artistic contribution matters in a noisy world.',
        reading: 'Offer your creative energy back to the source that gave it to you. You are an instrument, not the solitary author of reality; create with peace and freedom from self-importance.'
      },
      {
        setting: 'family',
        situation: 'Watching an adult child make difficult life choices or confronting medical crises beyond your power to fix.',
        reading: 'Recognize the limits of personal control. Hand over your deepest worries to the Supreme Caretaker, and offer loving presence without debilitating anxiety.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 3,
    verse: 9,
    teaching: 'Action binds unless performed as a selfless sacrifice; act dedicated to the common good, freed from possessive clinging.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Viewing college assignments solely as annoying hurdles to get a credential, leading to constant resentment and cheating temptations.',
        reading: 'When study is approached as yajna—an offering to master knowledge to serve future communities—tedious homework transforms into a joyful spiritual craft.'
      },
      {
        setting: 'professional',
        situation: 'Feeling trapped in a toxic rat race where every project is evaluated exclusively by whether it earns individual bonus points.',
        reading: 'Working purely for personal profit breeds chronic anxiety. Transforming your workday into service for clients and teammates unlocks deep craftsmanship and eliminates burnout.'
      },
      {
        setting: 'creative',
        situation: 'Obsessing over subscriber counts and monetization metrics before writing each sentence or stroke of paint.',
        reading: 'Clinging to results starves creative joy. Offer your artistic energy as a selfless gift to the world; real depth flows when ego-demands are silenced.'
      },
      {
        setting: 'family',
        situation: 'Keeping an angry internal score of which spouse or sibling has washed more dishes or done more chores.',
        reading: 'Scorekeeping turns a household into a transactional battlefield. Approaching domestic labor as an act of loving service preserves harmony and elevates daily life.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 3,
    verse: 21,
    teaching: 'Whatever standard a respected leader sets through action, the rest of the world naturally follows.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Seeing seniors or campus leaders take dishonest academic shortcuts, tempting younger students to do the same.',
        reading: 'Honesty has a ripple effect. When a respected student stands up for academic integrity, they inspire an entire peer group to choose courage.'
      },
      {
        setting: 'professional',
        situation: 'A senior executive loudly demanding work-life balance and ethics while secretly cutting corners and belittling subordinates.',
        reading: 'Teams never follow company handbooks; they follow lived executive behavior. Leaders who embody humility, punctuality, and respect raise the standard of the entire enterprise.'
      },
      {
        setting: 'creative',
        situation: 'An established artist plagiarizing or taking credit for younger collaborators’ work.',
        reading: 'Established creators carry a profound cultural responsibility. Giving generous credit and mentoring apprentices fosters a flourishing, trustworthy artistic ecosystem.'
      },
      {
        setting: 'family',
        situation: 'Parents screaming at children to stop scrolling phones while spending all evening glued to their own screens.',
        reading: 'Children absorb what they see, not what they are told. Setting down your own device and listening attentively teaches presence without a single reprimand.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 3,
    verse: 30,
    teaching: 'Dedicate all actions to the Supreme, centered in the Self, free from hope and possessiveness, acting released from mental fever.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Experiencing severe exam panic, feeling your heart pound and mind freeze while waiting for the question paper.',
        reading: 'Drop the fever of obsessive outcome-control. Dedicate your honest preparation to the universe, breathe deeply, and answer each question with quiet, focused presence.'
      },
      {
        setting: 'professional',
        situation: 'Leading a company through a high-stakes product launch with severe technical roadblocks and press scrutiny.',
        reading: 'Mental fever (jvara) clouds strategic judgment. Release possessive ego-attachment, make calm decisions based on principle, and execute with poised stamina.'
      },
      {
        setting: 'creative',
        situation: 'Paralyzed by fear of public ridicule before unveiling an ambitious stage performance or literary work.',
        reading: 'Surrender ownership of praise and blame to the higher reality. You are the instrument of expression; offer the art and let go of neurotic anxiety.'
      },
      {
        setting: 'family',
        situation: 'Enduring exhaustion and emotional turmoil while caring for an elderly parent during a chronic illness.',
        reading: 'Caretaking can produce bitter burnout if burdened by solitary ownership. Surrender the outcome to the cosmic caretaker and offer each day’s care with gentle peace.'
      }
    ]
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 3,
    verse: 42,
    teaching: 'Senses are subtle; the mind is subtler than senses; the intellect is subtler than mind; and supreme above the intellect is the conscious Self.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Struggling with late-night binge-eating or compulsive video-game binges while final exam deadlines approach.',
        reading: 'Notice the ladder within: senses itch for pleasure, mind seeks distraction, but your intellect knows your real goals. Anchor in the higher intellect to gently calm the lower impulses.'
      },
      {
        setting: 'professional',
        situation: 'Feeling an impulsive rush to send a furious reply to a client or colleague who insulted you in an email.',
        reading: 'The senses and emotional mind react in seconds, but the intellect has the wisdom to pause. Step back to your conscious witness; a 10-minute pause saves months of professional repair.'
      },
      {
        setting: 'creative',
        situation: 'Abandoning a demanding artistic project because a sudden mood swing or lazy impulse urges you to watch television instead.',
        reading: 'Creative stamina requires command of the faculties. Let the intellect steer the mind back to the easel or desk; feelings fluctuate, but the creative resolve endures.'
      },
      {
        setting: 'family',
        situation: 'Getting pulled into a petty family argument over household clutter and feeling irritation boiling over.',
        reading: 'Catch the chain reaction before it explodes. When you observe the emotional spike from the calm viewpoint of the witness, anger loses its power to wound loved ones.'
      }
    ]
  },
  {
    scriptureId: 'ishavasya',
    chapter: 1,
    verse: 1,
    teaching: 'All this transient universe is enveloped by the Divine; enjoy with renunciation, coveting no one’s wealth.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Feeling bitter jealousy when classmates show off luxury cars, expensive gadgets, or designer clothing on social media.',
        reading: 'Material gadgets cannot buy peace of mind. Recognize that true abundance comes from contentment and inner awareness; coveting others’ belongings only cultivates self-pity.'
      },
      {
        setting: 'professional',
        situation: 'Working in high-finance or tech where corporate culture equates personal human worth exclusively with net worth and equity grants.',
        reading: 'Wealth is a transient tool, not a measure of soul. Stewarding resources for the welfare of others brings profound dignity, while greedy hoarding creates internal poverty.'
      },
      {
        setting: 'creative',
        situation: 'Feeling insecure and resentful because another artist received a prestigious grant or commercial endorsement.',
        reading: 'The creative ocean is infinite and pervaded by one consciousness. Celebrate another’s flourishing while nurturing your own authentic expression.'
      },
      {
        setting: 'family',
        situation: 'Bitter disputes erupting over ancestral property or inheritance divisions between siblings.',
        reading: 'No one takes a single acre to the grave. Treating resources with detachment and prioritizing family love over material greed preserves lifelong bonds.'
      }
    ]
  },
  {
    scriptureId: 'ishavasya',
    chapter: 1,
    verse: 2,
    teaching: 'Perform your duties faithfully and wish to live a full hundred years; action done without selfish clinging leaves no karmic stain.',
    review: 'approved',
    reviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    scenarios: [
      {
        setting: 'student',
        situation: 'Feeling overwhelmed by demanding coursework and daydreaming of dropping out to live an irresponsible, idle life.',
        reading: 'Vigorous, disciplined effort is the glorious purpose of human youth. Engage with your education energetically; honest labor without anxiety builds strong character.'
      },
      {
        setting: 'professional',
        situation: 'Yearning for early retirement at 35 because daily work feels like a meaningless treadmill of chores.',
        reading: 'Retirement from purpose leads to cognitive and physical decline. Reconnect with the noble contribution your skills provide, and embrace lifelong, joyful industry.'
      },
      {
        setting: 'creative',
        situation: 'Feeling exhausted after completing a major project and wanting to permanently abandon the craft.',
        reading: 'Rest is necessary, but purposeful creative work is your life’s oxygen. Keep practicing and creating; when done without clinging, art sustains the spirit for a lifetime.'
      },
      {
        setting: 'family',
        situation: 'Feeling weighed down by the relentless daily duties of parenting, elder care, and household management.',
        reading: 'Daily domestic service is sacred Karma Yoga. Carrying family duties with cheerfulness and love transforms everyday chores into the bedrock of spiritual peace.'
      }
    ]
  }
];

export const getScenarios = (scriptureId: string, chapter: number, verse: number | string) =>
  MODERN_SCENARIOS.find((s) => s.scriptureId === scriptureId && s.chapter === chapter && String(s.verse) === String(verse));
