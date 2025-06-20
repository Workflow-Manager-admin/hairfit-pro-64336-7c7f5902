import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Main color constants
const COLOR_HIGHLIGHT = "#D0BCFF";
const COLOR_PRIMARY = "#7F56D9";
const STEPS = [
  {
    title: "Hair Type",
    description: "Select your hair type.",
    options: [
      "Straight",
      "Wavy",
      "Curly",
      "Coily",
      "Other"
    ],
    key: "hairType"
  },
  {
    title: "Scalp Type",
    description: "What is your scalp type?",
    options: [
      "Normal",
      "Dry",
      "Oily",
      "Combination",
      "Sensitive"
    ],
    key: "scalpType"
  },
  {
    title: "Hair Goals",
    description: "Pick your main hair goals.",
    options: [
      "Moisture",
      "Frizz Control",
      "Volume",
      "Shine",
      "Growth",
      "Strength",
      "Repair"
    ],
    key: "hairGoals",
    // Allow multiple select
    multi: true
  },
  {
    title: "Hair Concerns",
    description: "Select your biggest concerns.",
    options: [
      "Breakage",
      "Hair Loss",
      "Itchy Scalp",
      "Dandruff",
      "Color Fading",
      "Oiliness",
      "Dry Ends"
    ],
    key: "hairConcerns",
    multi: true
  }
];

// Animated slide transitions via Tailwind utility classes
function SlideTransition({ direction, inProp, children }) {
  // direction: 'left' or 'right'
  // For simplicity, just apply transform classes inline
  return (
    <div
      className={`w-full transition-all duration-500 ease-in-out
        ${inProp
          ? "opacity-100 translate-x-0"
          : (direction === "left"
              ? "opacity-0 -translate-x-16"
              : "opacity-0 translate-x-16"
            )
        }
      `}
    >
      {children}
    </div>
  );
}

// Option button (highlight when selected)
function OptionCard({ text, selected, onClick, multi }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        block w-full text-left p-4 rounded-2xl mb-3 shadow
        transition-all duration-200
        border-2
        font-medium
        ${
          selected
            ? `bg-[${COLOR_HIGHLIGHT}] border-[${COLOR_PRIMARY}] text-[#4B2670] shadow-lg`
            : "bg-white border-gray-200 text-gray-900"
        }
        hover:border-[${COLOR_PRIMARY}] hover:bg-[${COLOR_HIGHLIGHT}]/70
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${COLOR_PRIMARY}]
      `}
      aria-pressed={selected}
    >
      <span className="flex items-center gap-4">
        <span className="inline-block w-4">{multi ? (selected ? "☑" : "☐") : (selected ? "●" : "○")}</span>
        <span>{text}</span>
      </span>
    </button>
  );
}

// Main Multi-Step Profile Form
// PUBLIC_INTERFACE
function MultiStepProfileForm() {
  /**
   * This component renders a multi-step profile form with slide-in transitions, shadowed cards,
   * Tailwind styling, custom accent and submit colors, and on completion redirects to /routine.
   * Steps: Hair Type, Scalp Type, Hair Goals, Hair Concerns.
   */
  const [stepIdx, setStepIdx] = useState(0);
  const [direction, setDirection] = useState("right"); // for slide animation
  const [formState, setFormState] = useState({
    hairType: "",
    scalpType: "",
    hairGoals: [],
    hairConcerns: []
  });
  const [showSubmit, setShowSubmit] = useState(false);
  const navigate = useNavigate();

  const step = STEPS[stepIdx];

  // Step progress expressed as dots
  const ProgressDots = () => (
    <div className="flex gap-2 justify-center mb-6 mt-2">
      {STEPS.map((_, i) => (
        <span
          key={i}
          className={`w-3 h-3 rounded-full block border-2 transition-all duration-300 ${
            i === stepIdx
              ? `bg-[${COLOR_PRIMARY}] border-[${COLOR_PRIMARY}] scale-105`
              : `bg-white border-[${COLOR_HIGHLIGHT}] opacity-70`
          }`}
        />
      ))}
    </div>
  );

  // Next/Back handlers
  function handleNext() {
    if (stepIdx < STEPS.length - 1) {
      setDirection("right");
      setStepIdx(idx => idx + 1);
    } else {
      setShowSubmit(true);
    }
  }
  function handleBack() {
    if (showSubmit) {
      setShowSubmit(false);
    } else if (stepIdx > 0) {
      setDirection("left");
      setStepIdx(idx => idx - 1);
    }
  }

  // Select option (handle both multi and single choice)
  function selectOption(value) {
    if (step.multi) {
      setFormState(prev => {
        const arr = prev[step.key];
        const exists = arr.includes(value);
        return {
          ...prev,
          [step.key]: exists
            ? arr.filter(v => v !== value)
            : [...arr, value]
        };
      });
    } else {
      setFormState(prev => ({
        ...prev,
        [step.key]: value
      }));
    }
  }

  // On submit, redirect to /routine (simulate save)
  function handleSubmit(e) {
    e.preventDefault();
    // Could POST data here.
    navigate("/routine");
  }

  // Check completion for current step
  function isStepValid() {
    if (step.multi) {
      return (formState[step.key] && formState[step.key].length > 0);
    }
    return !!formState[step.key];
  }

  // The form card per step
  return (
    <form
      className="max-w-lg mx-auto relative"
      style={{ minHeight: 425 }}
      onSubmit={handleSubmit}
      autoComplete="off"
      aria-label="Multi-step profile form"
    >
      {/* Progress */}
      <ProgressDots />

      <div className="overflow-hidden rounded-3xl shadow-2xl bg-white px-8 py-10 flex flex-col items-center justify-center
        transition-shadow duration-300 mb-2
        "
        // inline custom highlight shadow
        style={{
          boxShadow: `0 6px 32px 0 #D0BCFF35`
        }}
      >
        {/* Step content or summary */}
        {!showSubmit ? (
          <SlideTransition direction={direction} inProp={true}>
            <div>
              <h2
                className="text-2xl font-bold mb-2 text-[var(--primary)]"
                style={{ color: COLOR_PRIMARY }}
              >
                {step.title}
              </h2>
              <div
                className="text-[var(--accent)] font-medium mb-4 text-center"
                style={{ color: COLOR_HIGHLIGHT }}
              >
                {step.description}
              </div>
              <div>
                {step.options.map(opt => (
                  <OptionCard
                    key={opt}
                    text={opt}
                    selected={
                      step.multi
                        ? formState[step.key].includes(opt)
                        : formState[step.key] === opt
                    }
                    onClick={() => selectOption(opt)}
                    multi={!!step.multi}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-6 gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`
                    px-5 py-2 rounded-lg text-base font-medium
                    border border-[${COLOR_PRIMARY}]
                    bg-white text-[${COLOR_PRIMARY}]
                    shadow hover:bg-[${COLOR_HIGHLIGHT}]/30 transition-all duration-200
                    disabled:opacity-40
                  `}
                  disabled={stepIdx === 0 && !showSubmit}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`
                    px-6 py-2 rounded-lg text-base font-semibold
                    bg-[${COLOR_PRIMARY}]
                    text-white
                    shadow-lg hover:bg-[#6E44B4] transition-all duration-200
                    disabled:opacity-40
                  `}
                  disabled={!isStepValid()}
                >
                  {stepIdx === STEPS.length - 1 ? "Review" : "Next"}
                </button>
              </div>
            </div>
          </SlideTransition>
        ) : (
          <SlideTransition direction="right" inProp={true}>
            <div className="text-center py-2 px-2">
              <h2
                className="text-2xl font-bold text-[var(--primary)] mb-2"
                style={{ color: COLOR_PRIMARY }}
              >
                Review Your Profile
              </h2>
              <div className="grid gap-2 text-left mt-4 mb-6">
                {STEPS.map(s => (
                  <div key={s.key}>
                    <div className="font-semibold text-[var(--primary)]" style={{ color: COLOR_PRIMARY }}>
                      {s.title}:
                    </div>
                    <div className="ml-1 text-black">{Array.isArray(formState[s.key])
                      ? formState[s.key].length > 0 ? formState[s.key].join(", ") : <span className="text-neutral-400 italic">None selected</span>
                      : formState[s.key] || <span className="text-neutral-400 italic">None selected</span>
                    }
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`
                    px-6 py-2 rounded-lg font-medium
                    border border-[${COLOR_PRIMARY}]
                    bg-white text-[${COLOR_PRIMARY}]
                    shadow hover:bg-[${COLOR_HIGHLIGHT}]/30 transition-all duration-200
                  `}
                >
                  Edit
                </button>
                <button
                  type="submit"
                  className={`
                    px-8 py-2 rounded-lg font-bold
                    shadow bg-[${COLOR_PRIMARY}]
                    text-white hover:bg-[#4727a7] transition-all duration-200
                  `}
                >
                  Submit
                </button>
              </div>
            </div>
          </SlideTransition>
        )}
      </div>
    </form>
  );
}

export default MultiStepProfileForm;
