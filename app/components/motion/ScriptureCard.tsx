'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { KineticCard } from '@/app/components/motion/KineticCard';

/**
 * Scripture catalog card with a live, pointer-tracking 3D tilt.
 *
 * Why not a fixed hover lift? A card that tilts *toward the cursor* reads
 * as a physical object catching light — far more convincing than a static
 * rotateX/rotateY. We map the pointer's position within the card to
 * rotation (via spring-damped motion values), float a cursor-following
 * glare across the surface, and push the content forward on the Z axis so
 * it separates from the tile as it turns.
 *
 * Still a motion component (not pure CSS) because the tilt is driven by
 * per-frame motion values, and because entrance animation is orchestrated
 * by the parent <Stagger>/<StaggerItem>.
 */
export function ScriptureCard({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className="block focus:outline-none">
      <KineticCard
        wrapperClassName="h-full"
        className={`${className} relative overflow-hidden`}
        contentClassName="h-full"
        rotate={8}
        lift={6}
        hoverScale={1.02}
        hoverShadow="0 30px 60px -18px rgba(124, 45, 18, 0.28)"
      >
        {children}
      </KineticCard>
    </Link>
  );
}
