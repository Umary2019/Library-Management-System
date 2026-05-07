export default function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : ''}>
      {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-600">{eyebrow}</p> : null}
      <h2 className="section-heading mt-3">{title}</h2>
      {description ? <p className="section-subtitle">{description}</p> : null}
    </div>
  );
}
