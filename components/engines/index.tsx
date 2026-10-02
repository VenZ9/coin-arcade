"use client";

import type React from "react";
import type { EngineId } from "@/lib/games";
import type { EngineProps } from "./shared";
import { PickEngine } from "./PickEngine";
import { HighCardEngine } from "./HighCardEngine";
import { DiceEngine } from "./DiceEngine";
import { WheelEngine } from "./WheelEngine";
import { SlotsEngine } from "./SlotsEngine";
import { BlackjackEngine } from "./BlackjackEngine";
import { PlinkoEngine } from "./PlinkoEngine";
import { MultiplierEngine } from "./MultiplierEngine";
import { GridEngine } from "./GridEngine";
import { NumberEngine } from "./NumberEngine";
import { ScratchEngine } from "./ScratchEngine";
import { ChestEngine } from "./ChestEngine";

/**
 * The single place that maps a game's `engine` id to its implementation.
 * Adding a new game that reuses an existing engine needs no change here.
 */
export const ENGINES: Record<EngineId, React.ComponentType<EngineProps>> = {
  pick: PickEngine,
  highcard: HighCardEngine,
  dice: DiceEngine,
  wheel: WheelEngine,
  slots: SlotsEngine,
  blackjack: BlackjackEngine,
  plinko: PlinkoEngine,
  multiplier: MultiplierEngine,
  grid: GridEngine,
  number: NumberEngine,
  scratch: ScratchEngine,
  chest: ChestEngine,
};
