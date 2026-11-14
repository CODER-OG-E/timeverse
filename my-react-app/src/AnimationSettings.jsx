
import { useAnimations } from "./AnimationContext";

function AnimationSettings() {
  const { animationMode, setAnimationMode } = useAnimations();

  return (
    <div className="animation-settings">
      <label htmlFor="animation-mode">Motion</label>

      <select
        id="animation-mode"
        value={animationMode}
        onChange={(event) => setAnimationMode(event.target.value)}
      >
        <option value="short">Short animations</option>
        <option value="long">Long animations</option>
        <option value="off">No animations</option>
      </select>
    </div>
  );
}

export default AnimationSettings;
