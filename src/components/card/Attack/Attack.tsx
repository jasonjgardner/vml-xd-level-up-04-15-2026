import type { IAttackEnergyCount, TypeName } from "../types";
import { AttackEnergy } from "../AttackEnergy/AttackEnergy";
import "./Attack.css";

export type AttackVariant = "basic" | "combo" | "condition" | "ability";

export interface IAttackProps {
  variant: AttackVariant;
  name: string;
  description?: string;
  damage?: string;
  energyCount?: IAttackEnergyCount;
  energyType?: TypeName;
}

/**
 * One attack (or ability) entry inside the attack frame.
 * - basic:     name + damage + energy
 * - combo:     name + description + damage + energy
 * - condition: name + description + energy (no damage)
 * - ability:   red "Ability" tag + red name + description (no energy/damage)
 */
export function Attack({ variant, name, description, damage, energyCount, energyType }: IAttackProps) {
  if (variant === "ability") {
    return (
      <div className="attack attack--ability" data-variant="ability">
        <span className="attack__abilityTag">Ability</span>
        <p className="attack__abilityName">{name}</p>
        {description && <p className="attack__description">{description}</p>}
      </div>
    );
  }
  const showDescription = variant === "combo" || variant === "condition";
  const showDamage = variant === "basic" || variant === "combo";
  return (
    <div className={`attack attack--${variant}`} data-variant={variant}>
      <p className="attack__name">{name}</p>
      {showDescription && description && <p className="attack__description">{description}</p>}
      {showDamage && damage && <p className="attack__damage">{damage}</p>}
      {energyCount && (
        <AttackEnergy className="attack__energy" count={energyCount} type={energyType} />
      )}
    </div>
  );
}
