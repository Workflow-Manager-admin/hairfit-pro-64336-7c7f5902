import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * HairRoutinePlanner displays a weekly grid for hair care routines,
 * with CRUD for items per day and subtle micro-animations for item actions.
 */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COLOR_PRIMARY = "#7F56D9";
const COLOR_ACCENT = "#D0BCFF";
const BG_COLOR = "#F9FAFB";

function useFadeList(items) {
  // animates appear/disappear (true: rendered, false: hidden)
  // Keyed by item.id
  const [renderedKeys, setRenderedKeys] = useState(() => items.map(i => i.id));
  // On item removal, fade out before removing from renderedKeys
  const removeWithFade = (id, removeFn) => {
    setRenderedKeys(keys => keys.filter(k => k !== id));
    setTimeout(() => removeFn(id), 300); // match transition duration
  };
  // When new items are added, add their keys to renderedKeys
  React.useEffect(() => {
    setRenderedKeys(keys => {
      const newKeys = items.map(i => i.id);
      return [...new Set([...keys, ...newKeys])];
    });
  }, [items]);
  return { renderedKeys, removeWithFade };
}

function AnimatedRoutineCard({ item, onCheck, onDelete, onEdit, isVisible }) {
  // Fade in/out animation using Tailwind
  return (
    <div
      className={`
        transition-all duration-300
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-90 pointer-events-none h-0"}
      `}
      style={{
        willChange: "opacity, transform",
        marginBottom: isVisible ? 16 : 0,
      }}
      aria-live="polite"
    >
      <div className="flex items-center bg-white rounded-xl shadow p-3 pr-4 gap-3 group">
        <input
          type="checkbox"
          className="h-5 w-5 accent-[#7F56D9] rounded-md border-2 border-primary transition-all duration-200 cursor-pointer"
          checked={item.completed}
          onChange={() => onCheck(item.id)}
          aria-label="toggle completed"
        />
        <span className={`flex-1 font-medium text-sm select-none ${item.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
          {item.text}
        </span>
        <button
          title="Edit item"
          aria-label="Edit item"
          className="mr-1 opacity-70 hover:opacity-100 text-primary transition"
          onClick={() => onEdit(item)}
          type="button"
        >
          <svg width="18" height="18" fill="none" stroke={COLOR_PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="inline align-middle"
            viewBox="0 0 24 24"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3l-13 13H3.5V17.5l13-13z" />
          </svg>
        </button>
        <button
          title="Remove item"
          aria-label="Remove item"
          className="opacity-60 ml-2 hover:text-red-500 hover:opacity-100 transition"
          onClick={() => onDelete(item.id)}
          type="button"
        >
          <svg width="18" height="18" fill="none" stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            className="inline align-middle"
            viewBox="0 0 24 24"
          >
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Card for adding a new item
function AddRoutineItemForm({ onAdd, label = "Add new care step..." }) {
  const [value, setValue] = useState("");
  const inputRef = useRef();
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (value.trim()) {
          onAdd(value.trim());
          setValue("");
        }
      }}
      className="w-full flex items-center gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        maxLength={50}
        className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-[var(--primary)] focus:outline-none text-sm shadow-sm flex-1"
        style={{ minWidth: 0 }}
        placeholder={label}
        aria-label="Add new routine item"
        value={value}
        onChange={e => setValue(e.target.value)}
        autoComplete="off"
      />
      <button
        className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-semibold text-sm shadow hover:bg-[#6E44B4] focus:outline-none transition-all duration-150"
        type="submit"
        style={{ backgroundColor: COLOR_PRIMARY }}
        aria-label="Add item"
      >
        Add
      </button>
    </form>
  );
}

// Modal for editing item text
function EditModal({ open, text, onClose, onSave }) {
  const [value, setValue] = useState(text || "");
  React.useEffect(() => {
    setValue(text || "");
  }, [text, open]);
  if (!open) return null;
  return (
    <div
      className={
        "fixed z-40 inset-0 flex items-center justify-center bg-black/30 transition-all duration-300 " +
        (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
      }
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 min-w-[260px] w-full max-w-xs mx-2 relative">
        <h2 className="text-xl font-bold text-[var(--primary)] mb-3" style={{ color: COLOR_PRIMARY }}>
          Edit Step
        </h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (value.trim()) {
              onSave(value.trim());
            }
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-[var(--primary)] focus:outline-none text-base"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
            maxLength={50}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-[var(--primary)] text-white font-semibold shadow hover:bg-[#4727a7] transition-all"
              type="submit"
              style={{ backgroundColor: COLOR_PRIMARY }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Public main component
// PUBLIC_INTERFACE
function HairRoutinePlanner() {
  /**
   * Renders the grid for Mon-Sun, each day containing CRUD list,
   * using color and animation specs as described.
   */
  // Data: {Mon: [{id, text, completed}], Tue: ...}
  const [routine, setRoutine] = useState(() =>
    DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );
  // For fade animation: one hook call per day, in component order (NOT within a loop over data).
  // This pattern prevents hook order errors by always calling hooks in the same order per render.
  const fadeLists = [
    useFadeList(routine["Mon"]),
    useFadeList(routine["Tue"]),
    useFadeList(routine["Wed"]),
    useFadeList(routine["Thu"]),
    useFadeList(routine["Fri"]),
    useFadeList(routine["Sat"]),
    useFadeList(routine["Sun"])
  ];

  // For editing
  const [editDay, setEditDay] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const navigate = useNavigate();

  // CRUD ops, unique ids via timestamp + rand
  function addItem(day, text) {
    setRoutine(prev => ({
      ...prev,
      [day]: [...prev[day], { id: Date.now() + Math.random(), text, completed: false }]
    }));
  }
  function editItemText(day, id, newText) {
    setRoutine(prev => ({
      ...prev,
      [day]: prev[day].map(it => it.id === id ? { ...it, text: newText } : it)
    }));
    setEditDay(null);
    setEditItem(null);
  }
  function removeItem(day, id) {
    fadeLists[day].removeWithFade(id, (toDeleteId) => {
      setRoutine(routineNow => ({
        ...routineNow,
        [day]: routineNow[day].filter(item => item.id !== toDeleteId)
      }));
    });
  }
  function toggleItemCompleted(day, id) {
    setRoutine(prev => ({
      ...prev,
      [day]: prev[day].map(it => it.id === id ? { ...it, completed: !it.completed } : it)
    }));
  }

  // Responsive grid: 1 col (mobile), 2 col (xs), 4 col (md), 7 col (lg)
  // Day label: always on top of the card on mobile, as column title on larger devices
  return (
    <div className="h-full min-h-[60vh] w-full px-[2vw] py-2 bg-gray-50 rounded-2xl" style={{ background: BG_COLOR }}>
      <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--primary)]" style={{ color: COLOR_PRIMARY }}>
            Hair Routine Planner
          </h1>
          <div className="text-base sm:text-lg text-gray-500 mb-1 max-w-[500px] mt-2">
            Your customized weekly hair care grid. Add steps for each day!
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-white border border-[var(--primary)] text-[var(--primary)] shadow hover:bg-[var(--primary)] hover:text-white transition-all duration-200 hover:scale-105 focus:outline-none"
          style={{
            borderColor: COLOR_PRIMARY,
            color: COLOR_PRIMARY,
            background: "#fff",
          }}
          onClick={() => navigate("/profile")}
          tabIndex={0}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            className="inline"
          >
            <path d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Profile
        </button>
      </div>
      {/* Responsive grid for week days */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
        {DAYS.map((day, i) => (
          <section
            key={day}
            className="bg-white/70 min-h-[180px] flex flex-col rounded-2xl shadow-lg p-4 transition-shadow hover:shadow-2xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="font-bold text-lg text-[var(--primary)]" style={{ color: COLOR_PRIMARY }}>
                {day}
              </div>
              <span className="ml-2 text-xs px-2 py-0.5 bg-[var(--accent)] rounded-full text-[var(--primary)]"
                    style={{ background: COLOR_ACCENT, color: COLOR_PRIMARY }}>
                {routine[day].length}
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-1 mb-2 w-full relative min-h-[40px]">
              {/* List of items with animations */}
              {routine[day].length === 0 && (
                <span className="text-gray-300 mb-2 text-xs select-none">No routine planned</span>
              )}
              {routine[day].map(item => (
                <AnimatedRoutineCard
                  key={item.id}
                  item={item}
                  onCheck={() => toggleItemCompleted(day, item.id)}
                  onDelete={() => fadeLists[i].removeWithFade(item.id, (toDeleteId) => {
                    setRoutine(routineNow => ({
                      ...routineNow,
                      [day]: routineNow[day].filter(it => it.id !== toDeleteId)
                    }));
                  })}
                  onEdit={(itm) => { setEditDay(day); setEditItem(itm); }}
                  isVisible={fadeLists[i].renderedKeys.includes(item.id)}
                />
              ))}
            </div>
            <AddRoutineItemForm
              onAdd={val => addItem(day, val)}
            />
          </section>
        ))}
      </div>
      {/* Edit Modal - appears over content */}
      <EditModal
        open={!!editDay && !!editItem}
        text={editItem?.text}
        onClose={() => { setEditDay(null); setEditItem(null); }}
        onSave={val => editItemText(editDay, editItem.id, val)}
      />
    </div>
  );
}

export default HairRoutinePlanner;
