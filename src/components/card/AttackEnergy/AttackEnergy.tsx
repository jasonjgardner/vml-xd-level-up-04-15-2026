import type { IAttackEnergyCount, TypeName } from "../types";
import { TypeBadge } from "../TypeBadge/TypeBadge";
import "./AttackEnergy.css";

export interface IAttackEnergyProps {
  className?: string;
  count: IAttackEnergyCount;
  type?: TypeName;
}

/**
 * A row of N type badges showing the energy cost of an attack.
 * Counts 1-4 supported.
 */
export function AttackEnergy({ className, count, type = "Normal" }: IAttackEnergyProps) {
  const slots = Array.from({ length: count }, (_, i) => i);
  return (
    <div className={className || "attackEnergy"} data-count={count}>
      {slots.map((i) => (
        <TypeBadge key={i} className="attackEnergy__slot" type={type} />
      ))}
    </div>
  );
}
