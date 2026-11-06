export default function FieldNotes() {
  const notes = [
    'Start with what interests you.',
    'Explore options that fit your strengths.',
    'Choose a next step you can act on.',
  ];

  return (
    <div className="relative z-10 border-b border-charcoal/[0.08] bg-parchment-dim py-6">
      <div className="mx-auto flex max-w-[1180px] flex-wrap justify-center gap-6 px-6 md:px-8">
        {notes.map((note, index) => (
          <div
            key={note}
            style={{ transform: `rotate(${index === 1 ? '0.8deg' : '-0.6deg'})` }}
            className="rounded-sm border border-charcoal/[0.12] bg-parchment px-[18px] py-[10px] text-sm text-[#4a453c] shadow-[0_2px_6px_rgba(36,31,26,0.08)]"
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}
