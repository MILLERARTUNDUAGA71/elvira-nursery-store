// Patrón decorativo de hojas repetido, en un solo color con baja opacidad.
// Se usa como fondo cuando un producto todavía no tiene foto.
export default function LeafPattern({ color = '#1E3B2A', opacity = 0.08, id }) {
const patternId = `leaf-pattern-${id}`
return (
<svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern id={patternId} width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
<path
d="M21 6c6 4 8 10 4 18-2-1-6-2-8-6-2 4-6 5-8 6-4-8-2-14 4-18 2 1 6 1 8 0z"
fill={color}
opacity={opacity}
/>
</pattern>
</defs>
<rect width="100%" height="100%" fill={`url(#${patternId})`} />
</svg>
)
}
