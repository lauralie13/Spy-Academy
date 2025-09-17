import type { Mission } from "@/lib/content";
import LogHunt from "./LogHunt";
import ZoneBuilder from "./ZoneBuilder";
import Dialogue from "./Dialogue";

export default function MissionRenderer({ mission }: { mission: Mission }) {
  switch (mission.type) {
    case "log-hunt":
      return <LogHunt mission={mission} />;
    case "zone-builder":
      return <ZoneBuilder mission={mission} />;
    case "dialogue":
      return <Dialogue mission={mission} />;
    default:
      return (
        <div className="border border-red-500/30 bg-red-500/5 text-red-300 rounded-lg p-4">
          Unknown mission type: <span className="font-mono">{String(mission.type)}</span>
        </div>
      );
  }
}
