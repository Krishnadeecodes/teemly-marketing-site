import './modulePreview.css'

export default function ModulePreview({ Comp, scale = 0.5, height = 220, fade = true }) {
  return (
    <div className="module-preview" style={{ height }}>
      <div className="module-preview-scale" style={{ transform: `scale(${scale})`, width: `${100 / scale}%` }}>
        <Comp />
      </div>
      {fade && <div className="module-preview-fade" />}
    </div>
  )
}
