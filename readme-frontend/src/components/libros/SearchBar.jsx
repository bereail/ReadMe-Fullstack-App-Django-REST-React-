export default function SearchBar({ value, onChange, onSubmit }) {
  const canSubmit = value.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex items-stretch gap-2"
    >
      <input
        type="text"
        placeholder="Buscar por título, autor o ISBN…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          flex-1
          rounded-xl
          border border-black/15
          bg-white
          px-3 py-2.5
          text-sm
          outline-none
          focus:border-black/30
          dark:border-white/10
          dark:bg-neutral-900
          dark:text-neutral-100
          dark:placeholder:text-neutral-500
        "
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className={[
          "rounded-xl px-4 py-2.5 text-sm font-bold text-white transition",
          canSubmit
            ? "bg-black hover:bg-black/90 active:scale-[0.99]"
            : "cursor-not-allowed bg-black/30",
        ].join(" ")}
      >
        Buscar
      </button>
    </form>
  );
}
