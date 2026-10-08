import type { Metadata } from 'next';
import { CONCEPT_DETAILS } from '@/data/concept-details';
import { CONCEPT_RELATIONS, RELATION_LABEL } from '@/data/concept-relations';
import { REVIEW_LABEL } from '@/data/study-content';
import { RelationshipExplorer, type ExplorerConcept, type ExplorerRelation } from './RelationshipExplorer';

export const metadata: Metadata = {
  title: 'Concept relationships · अवधारणाओं के संबंध',
  description: 'How twelve central concepts relate to one another, each link with its type and the verse that supports it.',
  alternates: { canonical: '/concepts/relationships' },
};

const IDS = ['dharma', 'karma', 'atman', 'brahman', 'moksha', 'bhakti', 'jnana', 'yoga', 'maya', 'ahimsa', 'samsara', 'vairagya'];

export default function RelationshipsPage() {
  const concepts: ExplorerConcept[] = IDS.filter((id) => CONCEPT_DETAILS[id]).map((id) => {
    const c = CONCEPT_DETAILS[id];
    return { id, label: c.label, sanskrit: c.sanskrit, transliteration: c.transliteration, definition: c.simpleDefinition.en };
  });
  const relations: ExplorerRelation[] = CONCEPT_RELATIONS.map((r) => ({
    from: r.from,
    to: r.to,
    typeLabel: RELATION_LABEL[r.type],
    note: r.note,
    source: `Bhagavad Gita ${r.evidence.chapter}.${r.evidence.verse}`,
    href: `/scripture/${r.evidence.scriptureId}/chapter/${r.evidence.chapter}/verse/${r.evidence.verse}`,
    status: REVIEW_LABEL[r.review],
  }));
  return <RelationshipExplorer concepts={concepts} relations={relations} />;
}
