// Inline validation message, linked to its input via aria-describedby.
export default function FieldError({ id, error }) {
  if (!error) return null
  return (
    <p className="field-error" id={`${id}-error`}>
      {error}
    </p>
  )
}
